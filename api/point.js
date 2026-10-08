// ══════════════════════════════════════════════════════════════
// MERCADO PAGO POINT — cobro con la Point Smart 2 desde el POS
//
// Vercel Function. El Access Token de Mercado Pago vive SOLO aquí
// (variables de entorno de Vercel) y nunca llega al navegador. El POS
// (index.html) le pide a esta ruta que mande el monto a la terminal y
// después pregunta por la orden hasta que se paga o se cae.
//
//   GET  /api/point?estado=1               → ¿Point configurado? (sin sesión)
//   POST /api/point {accion:'crear', monto, propina, ticket, intento}
//   GET  /api/point?id=ORD...              → estado de la orden
//   POST /api/point {accion:'cancelar', id}
//
// Orders API (la vigente para Point): POST /v1/orders con type "point"
// y config.point.terminal_id. Estados: created → at_terminal →
// processed | failed | canceled | expired (+ action_required, refunded).
//
// QUIÉN PUEDE COBRAR
// La app abre una sesión anónima para todos, incluido quien escanea el
// menú QR. Por eso aquí se verifica el ID token de Firebase (firma de
// Google, proyecto, vencimiento), se rechazan las sesiones anónimas y,
// además, el correo tiene que estar en MP_POINT_STAFF_EMAILS: con la
// API key pública cualquiera puede crearse una cuenta de correo en el
// proyecto, así que "no es anónimo" no basta para ser del personal.
//
// LA CUENTA ES COMPARTIDA
// La cuenta de Mercado Pago también tiene otras apps. Toda orden de El
// Huerto lleva external_reference "huerto-…", y solo esas se dejan
// consultar o cancelar desde el POS.
// ══════════════════════════════════════════════════════════════
const crypto = require('node:crypto');

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID?.trim() || 'el-huerto-95801';
const CERTS_GOOGLE = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
const VIRTUAL_POINT_TERMINAL = 'NEWLAND_N950__SBX0000001';
const PREFIJO_REF = 'huerto-';
const MONTO_MAX = 50000; // tope de cordura por cobro, en MXN

// ─── Configuración de Point ───
// La terminal virtual oficial solo se usa con MP_POINT_TEST_MODE=true
// explícito. En producción, sin MP_POINT_TERMINAL_ID no se cobra.
function pointConfig() {
  const token = process.env.MP_ACCESS_TOKEN?.trim();
  const pointTestMode = process.env.MP_POINT_TEST_MODE === 'true';
  const pointTerminalId = process.env.MP_POINT_TERMINAL_ID?.trim()
    || (pointTestMode ? VIRTUAL_POINT_TERMINAL : '');
  if (!token) return { error: 'Falta MP_ACCESS_TOKEN en las variables de entorno de Vercel.' };
  if (!pointTerminalId) return { error: 'Falta MP_POINT_TERMINAL_ID en las variables de entorno de Vercel.' };
  return { token, terminalId: pointTerminalId, testMode: pointTestMode };
}

function staffPermitido() {
  return new Set((process.env.MP_POINT_STAFF_EMAILS || '')
    .split(',').map(s => s.trim().toLowerCase()).filter(Boolean));
}

// ─── Verificación del ID token de Firebase ───
// Procedimiento oficial para verificar sin el Admin SDK: firma RS256
// con los certificados públicos de securetoken, aud = proyecto,
// iss = securetoken/proyecto, exp en el futuro, sub no vacío.
let certCache = { certs: null, expira: 0 };
async function certsGoogle(forzar = false) {
  if (!forzar && certCache.certs && Date.now() < certCache.expira) return certCache.certs;
  const r = await fetch(CERTS_GOOGLE);
  if (!r.ok) throw new Error(`certs de Google: HTTP ${r.status}`);
  const certs = await r.json();
  const maxAge = /max-age=(\d+)/.exec(r.headers.get('cache-control') || '');
  certCache = { certs, expira: Date.now() + (maxAge ? Number(maxAge[1]) : 3600) * 1000 };
  return certs;
}

const b64url = s => Buffer.from(s, 'base64url');

async function verificarTokenFirebase(idToken) {
  const partes = String(idToken || '').split('.');
  if (partes.length !== 3) return null;
  let header, claims;
  try {
    header = JSON.parse(b64url(partes[0]).toString('utf8'));
    claims = JSON.parse(b64url(partes[1]).toString('utf8'));
  } catch { return null; }
  if (header.alg !== 'RS256' || !header.kid) return null;

  let pem = (await certsGoogle())[header.kid];
  if (!pem) pem = (await certsGoogle(true))[header.kid]; // Google rotó llaves
  if (!pem) return null;
  const llave = new crypto.X509Certificate(pem).publicKey;
  const firmaOk = crypto.verify('RSA-SHA256', Buffer.from(`${partes[0]}.${partes[1]}`), llave, b64url(partes[2]));
  if (!firmaOk) return null;

  const ahora = Math.floor(Date.now() / 1000);
  const holgura = 300; // relojes desfasados
  if (claims.aud !== FIREBASE_PROJECT_ID) return null;
  if (claims.iss !== `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`) return null;
  if (typeof claims.sub !== 'string' || !claims.sub) return null;
  if (!(claims.exp > ahora)) return null;
  if (claims.iat > ahora + holgura || claims.auth_time > ahora + holgura) return null;
  return claims;
}

async function personalAutorizado(req) {
  const m = /^Bearer\s+(.+)$/i.exec(req.headers?.authorization || '');
  const claims = m ? await verificarTokenFirebase(m[1].trim()) : null;
  if (!claims) return { status: 401, error: 'Sesión no válida. Vuelve a entrar con tu cuenta.' };
  if (claims.firebase?.sign_in_provider === 'anonymous' || !claims.email) {
    return { status: 403, error: 'Para cobrar con Point entra con tu cuenta propia (no con la sesión general).' };
  }
  const staff = staffPermitido();
  if (!staff.size) return { status: 503, error: 'Falta MP_POINT_STAFF_EMAILS en las variables de entorno de Vercel.' };
  if (!staff.has(String(claims.email).toLowerCase())) {
    return { status: 403, error: `La cuenta ${claims.email} no está autorizada para cobrar con Point.` };
  }
  return { uid: claims.sub, email: claims.email };
}

// ─── Mercado Pago ───
function mpHeaders(cfg, idempotencia, extra = {}) {
  return {
    Authorization: `Bearer ${cfg.token}`,
    'Content-Type': 'application/json',
    ...(idempotencia ? { 'X-Idempotency-Key': idempotencia } : {}),
    ...extra,
  };
}

const codigoMP = d => d?.errors?.[0]?.code || d?.code || d?.error || null;

// Mensajes que una cajera puede entender y resolver
const MENSAJES_MP = {
  already_queued_order_for_terminal: 'Ya hay un cobro esperando en la terminal. Cancélalo antes de mandar otro.',
  forbidden_checking_terminal_owner: 'La terminal no está vinculada a la cuenta de Mercado Pago de esta app.',
  // La documentación dice _terminal_owner; la API real (oct-2026) responde _device_owner
  forbidden_checking_device_owner: 'La terminal no está vinculada a la cuenta de Mercado Pago de esta app. Revisa MP_POINT_TERMINAL_ID.',
  store_pos_not_found: 'La terminal no tiene sucursal ni caja asignada en Mercado Pago.',
  cannot_cancel_order: 'Esa orden ya no se puede cancelar (probablemente ya se pagó).',
  order_not_found: 'Mercado Pago no encuentra esa orden.',
  idempotency_key_already_used: 'Ese intento de cobro ya se usó. Vuelve a mandarlo.',
};
function errorMP(data, status) {
  const c = codigoMP(data);
  if (c && MENSAJES_MP[c]) return MENSAJES_MP[c];
  if (status === 401) return 'Mercado Pago rechazó el Access Token. Revisa MP_ACCESS_TOKEN en Vercel.';
  return `Mercado Pago respondió ${status}${c ? ` (${c})` : ''}.`;
}

// Lo único que el navegador necesita saber de la orden
function resumen(o) {
  const p = o?.transactions?.payments?.[0] || {};
  return {
    id: o?.id || null,
    status: o?.status || null,
    statusDetail: o?.status_detail || p.status_detail || null,
    monto: p.amount ?? null,
    pagado: p.paid_amount ?? o?.total_paid_amount ?? null,
    paymentId: p.id || null,
    referenciaPago: p.reference_id || p.reference?.id || null,
    tipo: p.payment_method?.type || null,
    marca: p.payment_method?.id || null,
    ultimos4: p.card?.last_digits || null,
  };
}

const ordenPropia = o => o?.type === 'point' && String(o?.external_reference || '').startsWith(PREFIJO_REF);
const ID_ORDEN = /^ORD[A-Za-z0-9]{6,64}$/;

async function leerOrden(cfg, id) {
  const r = await fetch(`https://api.mercadopago.com/v1/orders/${encodeURIComponent(id)}`, {
    headers: mpHeaders(cfg),
  });
  const data = await r.json().catch(() => ({}));
  return { r, data };
}

async function crear(body, res, cfg) {
  const monto = Number(body.monto);
  const propina = body.propina == null || body.propina === '' ? 0 : Number(body.propina);
  if (!Number.isFinite(monto) || monto <= 0 || monto > MONTO_MAX) return enviar(res, 400, { error: 'Monto inválido.' });
  if (!Number.isFinite(propina) || propina < 0 || propina > monto) return enviar(res, 400, { error: 'Propina inválida.' });
  const total = Math.round((monto + propina) * 100) / 100;

  // `intento` lo genera el POS una vez por cobro: si la red se corta y
  // el POS reintenta, misma llave + mismo cuerpo = la MISMA orden, no
  // un segundo cobro en la terminal.
  const intento = /^[A-Za-z0-9-]{8,64}$/.test(String(body.intento || '')) ? String(body.intento) : crypto.randomUUID();
  const ticket = String(body.ticket || '').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 24);
  // external_reference: único, ≤64, solo letras/números/-/_, sin datos personales
  const externalReference = `${PREFIJO_REF}${ticket || 'pos'}-${intento.replace(/-/g, '').slice(0, 16)}`;

  const r = await fetch('https://api.mercadopago.com/v1/orders', {
    method: 'POST',
    headers: mpHeaders(cfg, `huerto-crear-${intento}`),
    body: JSON.stringify({
      type: 'point',
      external_reference: externalReference,
      expiration_time: 'PT10M',
      description: `El Huerto${ticket ? ` · ticket ${ticket}` : ''}`,
      transactions: {
        payments: [{ amount: total.toFixed(2) }],
      },
      config: {
        point: {
          terminal_id: cfg.terminalId,
          print_on_terminal: 'no_ticket', // el POS imprime su propio ticket
        },
      },
    }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) return enviar(res, r.status, { error: errorMP(data, r.status), codigo: codigoMP(data) });
  return enviar(res, 201, { ...resumen(data), total: total.toFixed(2), propina: propina.toFixed(2), prueba: cfg.testMode });
}

async function consultar(id, res, cfg) {
  if (!ID_ORDEN.test(id)) return enviar(res, 400, { error: 'ID de orden inválido.' });
  const { r, data } = await leerOrden(cfg, id);
  if (!r.ok) return enviar(res, r.status, { error: errorMP(data, r.status), codigo: codigoMP(data) });
  if (!ordenPropia(data)) return enviar(res, 404, { error: 'Esa orden no es de El Huerto.' });
  return enviar(res, 200, resumen(data));
}

async function cancelar(body, res, cfg) {
  const id = String(body.id || '');
  if (!ID_ORDEN.test(id)) return enviar(res, 400, { error: 'ID de orden inválido.' });
  const previa = await leerOrden(cfg, id);
  if (!previa.r.ok) return enviar(res, previa.r.status, { error: errorMP(previa.data, previa.r.status), codigo: codigoMP(previa.data) });
  if (!ordenPropia(previa.data)) return enviar(res, 404, { error: 'Esa orden no es de El Huerto.' });

  // Sin x-allow-cancelable-status solo se cancelan órdenes en `created`;
  // la de mostrador normalmente ya está en la pantalla de la terminal.
  const r = await fetch(`https://api.mercadopago.com/v1/orders/${encodeURIComponent(id)}/cancel`, {
    method: 'POST',
    headers: mpHeaders(cfg, crypto.randomUUID(), { 'x-allow-cancelable-status': 'at_terminal' }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    if (codigoMP(data) === 'order_already_canceled') return enviar(res, 200, { ...resumen(previa.data), status: 'canceled' });
    return enviar(res, r.status, { error: errorMP(data, r.status), codigo: codigoMP(data) });
  }
  return enviar(res, 200, resumen(data));
}

function enviar(res, status, cuerpo) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(cuerpo));
}

function leerBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string' && req.body) {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return {};
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return enviar(res, 405, { error: 'Método no permitido.' });
  }

  // GET /api/point?estado=1 — público y sin datos sensibles: solo dice si
  // Point está configurado. El POS lo usa para decidir si el botón de
  // tarjeta manda a la terminal o registra como antes. Quitar
  // MP_POINT_TERMINAL_ID en Vercel = regresar al flujo anterior.
  const consulta = req.query || Object.fromEntries(new URL(req.url, 'http://local').searchParams);
  if (req.method === 'GET' && consulta.estado) {
    const cfg = pointConfig();
    return enviar(res, 200, { activo: !cfg.error && staffPermitido().size > 0, prueba: !!cfg.testMode });
  }

  let quien;
  try { quien = await personalAutorizado(req); }
  catch (e) {
    console.error('point: verificación de sesión', e?.message || e);
    return enviar(res, 502, { error: 'No se pudo verificar la sesión. Revisa el internet y reintenta.' });
  }
  if (quien.error) return enviar(res, quien.status, { error: quien.error });

  const cfg = pointConfig();
  if (cfg.error) return enviar(res, 503, { error: cfg.error });

  try {
    if (req.method === 'GET') return await consultar(String(consulta.id || ''), res, cfg);
    const body = leerBody(req);
    if (body.accion === 'crear') return await crear(body, res, cfg);
    if (body.accion === 'cancelar') return await cancelar(body, res, cfg);
    return enviar(res, 400, { error: 'Acción desconocida.' });
  } catch (e) {
    console.error('point:', e?.message || e);
    return enviar(res, 502, { error: 'No hubo respuesta de Mercado Pago. Revisa el internet y reintenta.' });
  }
};
