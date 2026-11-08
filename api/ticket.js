// ═════════════════════════════════════════════
// LEER TICKETS — foto o PDF de una compra → partidas listas para revisar
//
// Vercel Function. Iván sube la foto del ticket (o el PDF del CFDI de
// Costco) desde Gastos; esta ruta se la pasa a Claude junto con el
// catálogo del inventario y las ligas que ya se usaron antes ("Queso
// mozzarella cubicado Billy 5 kg" → Queso mozzarella), y regresa las
// partidas con su artículo y la cantidad en la unidad del inventario.
// No escribe nada: la pantalla muestra el resultado, Iván corrige y él
// registra la compra.
//
//   POST /api/ticket {archivos:[{tipo,datos}], catalogo, ligas, proveedores}
//   (Bearer: ID token de Firebase de admin@elhuerto.app)
//
// La llave ANTHROPIC_API_KEY vive solo en Vercel. La verificación del
// token es la misma de api/point.js y api/aviso.js.
// ═════════════════════════════════════════════
const crypto = require('node:crypto');
const AnthropicMod = require('@anthropic-ai/sdk');
const Anthropic = AnthropicMod.default || AnthropicMod;

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID?.trim() || 'el-huerto-95801';
const CERTS_GOOGLE = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
const CUENTA_ADMIN = 'admin@elhuerto.app';
const MODELO = 'claude-opus-5-5';
const TIPOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
const MAX_ARCHIVOS = 4;

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
  if (!pem) pem = (await certsGoogle(true))[header.kid];
  if (!pem) return null;
  const llave = new crypto.X509Certificate(pem).publicKey;
  if (!crypto.verify('RSA-SHA256', Buffer.from(`${partes[0]}.${partes[1]}`), llave, b64url(partes[2]))) return null;
  const ahora = Math.floor(Date.now() / 1000);
  if (claims.aud !== FIREBASE_PROJECT_ID) return null;
  if (claims.iss !== `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`) return null;
  if (typeof claims.sub !== 'string' || !claims.sub) return null;
  if (!(claims.exp > ahora)) return null;
  if (claims.iat > ahora + 300) return null;
  return claims;
}

const ESQUEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['proveedor', 'folio', 'fecha', 'hora', 'metodo', 'total', 'es_factura', 'partidas', 'avisos'],
  properties: {
    proveedor: { type: 'string' },
    folio: { type: 'string' },
    fecha: { type: 'string' },
    hora: { type: 'string' },
    metodo: { type: 'string', enum: ['efectivo', 'tarjeta', 'transferencia', 'desconocido'] },
    total: { type: 'number' },
    es_factura: { type: 'boolean' },
    partidas: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['descripcion', 'cantidad_ticket', 'unidad_ticket', 'importe', 'art_id', 'cantidad_inv', 'confianza', 'nota'],
        properties: {
          descripcion: { type: 'string' },
          cantidad_ticket: { type: 'number' },
          unidad_ticket: { type: 'string' },
          importe: { type: 'number' },
          art_id: { type: 'string' },
          cantidad_inv: { type: 'number' },
          confianza: { type: 'string', enum: ['alta', 'media', 'baja'] },
          nota: { type: 'string' },
        },
      },
    },
    avisos: { type: 'array', items: { type: 'string' } },
  },
};

const INSTRUCCIONES = `Lees tickets y facturas de compra de El Huerto, una cafetería en Huixquilucan (México) que vende fruta picada, bowls, paninis, chilaquiles y café. Del ticket sacas cada partida y la ligas al artículo del inventario que corresponde, para que el dueño revise y registre la compra.

Reglas:
- Una partida por renglón del ticket, con su descripción tal como se lee (puedes completar abreviaturas obvias: "QSO MOZZ" → "Queso mozzarella").
- "importe" es lo que de verdad se pagó por ese renglón, en pesos, ya con su descuento si el ticket lo aplica a ese renglón (Costco pone el descuento en un renglón aparte debajo del artículo: réstalo al artículo y no lo pongas como partida). IVA e IEPS van dentro del importe del artículo. Bolsas, estacionamiento o propinas sí son partidas, sin artículo.
- La suma de los importes debe dar el total del ticket. Si no cuadra, dilo en "avisos" con la diferencia.
- "art_id": el id del catálogo que corresponde, o "" si no es algo del inventario o no hay uno razonable. Usa las ligas anteriores: si una descripción ya se ligó antes, liga igual. No inventes ids.
- "cantidad_inv": la cantidad comprada expresada en la unidad del artículo del catálogo (un queso de 5 kg en un artículo en g → 5000; 3 latas de 2.8 kg en g → 8400; 12 L de leche en L → 12; 100 vasos en pz → 100). Lee el contenido del empaque en la descripción ("908 g", "4 L", "c/100"). Si no se puede saber, pon tu mejor estimación, confianza "baja" y explica en "nota". Si no hay artículo, 0.
- "confianza": "alta" si estás seguro del artículo y la cantidad; "media" o "baja" si hay que revisarlo.
- "fecha" en AAAA-MM-DD ("" si no se ve), "hora" en HH:MM ("" si no se ve). "folio": número de ticket, nota o factura (en un CFDI de Costco, la serie y folio, ej. "ARG 5953455").
- "metodo": cómo se pagó si el ticket lo dice; si no, "desconocido".
- "proveedor": el nombre comercial (Costco, La Comer, HM Central de Alimentos, La Molinera de Abastos, Plastidoro, Sigma Alimentos…). Si se parece a uno de la lista de proveedores conocidos, usa ese nombre exacto.
- "es_factura": true si es un CFDI o factura, false si es ticket o nota.
- En "avisos" pon lo que el dueño deba revisar: renglones ilegibles, totales que no cuadran, cantidades dudosas, algo que parezca personal y no del negocio. Escribe en español sencillo, sin tecnicismos.
- Si la imagen no es un ticket de compra, regresa partidas vacías y explícalo en avisos.`;

const limpiaTxt = (s, n) => String(s ?? '').replace(/[\u0000-\u001f]/g, ' ').slice(0, n);

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Solo POST' });

  const token = /^Bearer\s+(.+)$/i.exec(req.headers.authorization || '')?.[1];
  let claims = null;
  try { claims = await verificarTokenFirebase(token); } catch (e) { console.error('token:', e.message); }
  if (!claims) return res.status(401).json({ error: 'Sesión no válida.' });
  if (claims.firebase?.sign_in_provider === 'anonymous' || String(claims.email || '').toLowerCase() !== CUENTA_ADMIN)
    return res.status(403).json({ error: 'Solo el admin sube tickets.' });

  if (!process.env.ANTHROPIC_API_KEY?.trim())
    return res.status(503).json({ error: 'Falta la llave ANTHROPIC_API_KEY en Vercel.' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const archivos = Array.isArray(body.archivos) ? body.archivos.slice(0, MAX_ARCHIVOS) : [];
  if (!archivos.length) return res.status(400).json({ error: 'No llegó ninguna foto.' });
  for (const a of archivos)
    if (!TIPOS.includes(a?.tipo) || typeof a?.datos !== 'string' || !a.datos)
      return res.status(400).json({ error: 'Archivo no válido: sube foto (JPG/PNG) o PDF.' });

  const catalogo = (Array.isArray(body.catalogo) ? body.catalogo : []).slice(0, 800)
    .map(c => `${limpiaTxt(c.id, 30)} | ${limpiaTxt(c.n, 80)} | ${limpiaTxt(c.u, 10)}${c.p ? ` | $${Number(c.p)}/${limpiaTxt(c.u, 10)}` : ''}`).join('\n');
  const ligas = (Array.isArray(body.ligas) ? body.ligas : []).slice(0, 400)
    .map(l => `${limpiaTxt(l.c, 120)} → ${limpiaTxt(l.a, 80)}`).join('\n');
  const proveedores = (Array.isArray(body.proveedores) ? body.proveedores : []).slice(0, 200)
    .map(p => limpiaTxt(p, 80)).join(', ');

  const contexto = `CATÁLOGO DEL INVENTARIO (id | nombre | unidad | precio actual):\n${catalogo || '(vacío)'}\n\n` +
    `LIGAS ANTERIORES (descripción en un ticket → artículo):\n${ligas || '(ninguna)'}\n\n` +
    `PROVEEDORES CONOCIDOS: ${proveedores || '(ninguno)'}`;

  const contenido = [
    ...archivos.map(a => a.tipo === 'application/pdf'
      ? { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: a.datos } }
      : { type: 'image', source: { type: 'base64', media_type: a.tipo, data: a.datos } }),
    { type: 'text', text: archivos.length > 1
      ? 'Estas fotos son del mismo ticket (partes de un ticket largo). Léelo completo, sin repetir renglones.'
      : 'Lee este ticket.' },
  ];

  const client = new Anthropic({ timeout: 55_000, maxRetries: 1 });
  try {
    const r = await client.beta.messages.create({
      model: MODELO,
      max_tokens: 16000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: [
        { type: 'text', text: INSTRUCCIONES },
        { type: 'text', text: contexto, cache_control: { type: 'ephemeral' } },
      ],
      output_config: { format: { type: 'json_schema', schema: ESQUEMA } },
      messages: [{ role: 'user', content: contenido }],
    });
    if (r.stop_reason === 'refusal') return res.status(422).json({ error: 'No se pudo leer este ticket. Intenta con otra foto.' });
    if (r.stop_reason === 'max_tokens') return res.status(422).json({ error: 'El ticket es demasiado largo; súbelo en dos partes.' });
    const txt = r.content.filter(b => b.type === 'text').map(b => b.text).join('');
    let datos;
    try { datos = JSON.parse(txt); } catch { return res.status(502).json({ error: 'La lectura llegó incompleta. Intenta otra vez.' }); }
    return res.status(200).json({ ...datos, uso: { entrada: r.usage?.input_tokens, salida: r.usage?.output_tokens } });
  } catch (e) {
    const st = e?.status;
    console.error('ticket:', st, e?.message);
    if (st === 401 || st === 403) return res.status(503).json({ error: 'La llave de Anthropic en Vercel no es válida.' });
    if (st === 429) return res.status(429).json({ error: 'Demasiados tickets seguidos; espera un minuto.' });
    if (st === 400) return res.status(400).json({ error: 'La foto no se pudo procesar (¿muy grande o dañada?).' });
    return res.status(502).json({ error: 'No se pudo leer el ticket ahora. Intenta otra vez.' });
  }
};
module.exports.config = { maxDuration: 60 };
