// ═════════════════════════════════════════════
// AVISOS AL DUEÑO — notificación al teléfono de Iván
//
// Vercel Function. Cuando una cajera cierra caja a ciegas, saca efectivo
// o cambia billetes, su aparato manda aquí el resumen y esta ruta lo
// empuja (Web Push) a los teléfonos que Iván activó en el Panel. Ella no
// ve el mensaje; la llave privada VAPID vive solo en Vercel.
//
//   POST /api/aviso {titulo, cuerpo}   (Bearer: ID token de Firebase)
//
// Solo cuentas propias del personal (@elhuerto.app), nunca la sesión
// anónima del menú QR. Las suscripciones viven en sistema/avisos y se
// leen con el mismo token de quien avisa. La verificación del token es
// la misma de api/point.js.
// ═════════════════════════════════════════════
const crypto = require('node:crypto');
const webpush = require('web-push');

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID?.trim() || 'el-huerto-95801';
const CERTS_GOOGLE = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
const DOMINIO_PERSONAL = '@elhuerto.app';

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

// Las suscripciones se leen con el token de quien avisa: las reglas
// dejan leer `sistema` a cualquier sesión, y sin la llave privada un
// endpoint no sirve para nada.
async function suscripciones(idToken) {
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/sistema/avisos`;
  const r = await fetch(url, { headers: { Authorization: `Bearer ${idToken}` } });
  if (!r.ok) return [];
  const d = await r.json();
  const lista = d.fields?.subs?.arrayValue?.values || [];
  return lista.map(v => {
    const f = v.mapValue?.fields || {};
    return { endpoint: f.endpoint?.stringValue,
      keys: { p256dh: f.p256dh?.stringValue, auth: f.auth?.stringValue } };
  }).filter(s => s.endpoint && s.keys.p256dh && s.keys.auth);
}

const recorta = (s, n) => String(s || '').replace(/\s+\n/g, '\n').slice(0, n);

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Solo POST' });
  const pub = process.env.VAPID_PUBLIC_KEY?.trim(), priv = process.env.VAPID_PRIVATE_KEY?.trim();
  if (!pub || !priv) return res.status(503).json({ error: 'Faltan las llaves VAPID en Vercel.' });

  const m = /^Bearer\s+(.+)$/i.exec(req.headers?.authorization || '');
  const token = m ? m[1].trim() : '';
  const claims = token ? await verificarTokenFirebase(token).catch(() => null) : null;
  if (!claims) return res.status(401).json({ error: 'Sesión no válida.' });
  if (claims.firebase?.sign_in_provider === 'anonymous' || !String(claims.email || '').toLowerCase().endsWith(DOMINIO_PERSONAL))
    return res.status(403).json({ error: 'Solo el personal con cuenta propia avisa.' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const aviso = JSON.stringify({ title: recorta(body?.titulo, 80) || 'El Huerto', body: recorta(body?.cuerpo, 400), tag: recorta(body?.tag, 40) || 'huerto' });

  webpush.setVapidDetails(process.env.VAPID_SUBJECT?.trim() || 'https://el-huerto.vercel.app', pub, priv);
  const subs = await suscripciones(token);
  let enviados = 0;
  for (const s of subs) {
    try { await webpush.sendNotification(s, aviso, { TTL: 86400 }); enviados++; }
    catch (e) { console.warn('aviso no entregado:', e.statusCode || e.message); }
  }
  return res.status(200).json({ enviados, telefonos: subs.length });
};
