#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════
// EL HUERTO — Point Smart 2: ubicar la terminal y cambiarle el modo
//
// Se corre UNA vez al instalar (y cuando haya que regresar la terminal a
// modo normal). Lee MP_ACCESS_TOKEN de .env — nunca lo imprime.
//
//   node --env-file=.env scripts/point-terminal.mjs
//       → lista las terminales de la cuenta (el `id` va en MP_POINT_TERMINAL_ID)
//   node --env-file=.env scripts/point-terminal.mjs --pdv <TERMINAL_ID>
//       → modo PDV: la terminal cobra lo que le manda el POS
//   node --env-file=.env scripts/point-terminal.mjs --normal <TERMINAL_ID>
//       → modo normal (STANDALONE): se teclea el monto en la terminal.
//         Es el plan B si el internet o Mercado Pago fallan.
// ══════════════════════════════════════════════════════════════

const token = process.env.MP_ACCESS_TOKEN?.trim();
if (!token) {
  console.error('Falta MP_ACCESS_TOKEN. Ponlo en .env (Producción de la app "El Huerto POS") y corre con --env-file=.env');
  process.exit(2);
}
const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
const [modo, terminalId] = process.argv.slice(2);

async function mp(url, opts = {}) {
  const r = await fetch(url, { ...opts, headers });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const code = data?.errors?.[0]?.code || data?.code || data?.error || '';
    console.error(`Mercado Pago respondió ${r.status} ${code}`);
    // El cuerpo del error nunca trae el token: se muestra para diagnosticar
    console.error(JSON.stringify(data).slice(0, 600));
    if (r.status === 401) console.error('→ El Access Token no es válido.');
    if (r.status === 403) await diagnostico();
    // Visto en la cuenta de El Huerto (oct-2026): las órdenes sí pasan,
    // pero la API de terminales está bloqueada por política para la cuenta.
    if (code === 'PA_UNAUTHORIZED_RESULT_FROM_POLICIES') {
      console.error('→ Mercado Pago no deja a esta cuenta administrar terminales por API.');
      console.error('  Lo libera soporte de Mercado Pago (ver POINT_SETUP.md). El menú de la Point');
      console.error('  "Más opciones > Ajustes > Modo de vinculación" solo aparece tras la 1a activación por API.');
      console.error('  El ID para MP_POINT_TERMINAL_ID es MODELO__MODELO+SERIAL (ej. NEWLAND_N950__N950NCCA05077658).');
    }
    if (r.status === 412) console.error('→ Ya hay otra terminal en modo PDV en esa caja; solo se permite una.');
    if (code === 'store_pos_not_found') console.error('→ La terminal no tiene sucursal/caja asignada en Mercado Pago.');
    process.exit(1);
  }
  return data;
}

// ¿De qué cuenta es el token? La Point solo acepta órdenes de su dueño.
async function diagnostico() {
  const r = await fetch('https://api.mercadopago.com/users/me', { headers });
  const u = await r.json().catch(() => ({}));
  if (!r.ok) return console.error(`/users/me respondió ${r.status}: el token no sirve para esta cuenta.`);
  console.error(`→ El token es del usuario ${u.id} (${u.site_id}, ${u.nickname}).`);
}

if (!modo) {
  const data = await mp('https://api.mercadopago.com/terminals/v1/list?limit=50&offset=0');
  const terminales = data?.data?.terminals || [];
  if (!terminales.length) {
    console.log('No hay terminales en esta cuenta. ¿La Point está vinculada a este mismo usuario de Mercado Pago?');
    process.exit(1);
  }
  console.table(terminales.map(t => ({ id: t.id, modo: t.operating_mode, sucursal: t.store_id, caja: t.pos_id })));
  console.log('\nEl `id` (termina con el serial de la etiqueta trasera) va en MP_POINT_TERMINAL_ID.');
  console.log('Si el modo no es PDV:  node --env-file=.env scripts/point-terminal.mjs --pdv <id>');
} else if ((modo === '--pdv' || modo === '--normal') && terminalId) {
  const operating_mode = modo === '--pdv' ? 'PDV' : 'STANDALONE';
  const data = await mp('https://api.mercadopago.com/terminals/v1/setup', {
    method: 'PATCH',
    body: JSON.stringify({ terminals: [{ id: terminalId, operating_mode }] }),
  });
  const t = data?.terminals?.[0] || {};
  console.log(`✓ ${t.id || terminalId} → ${t.operating_mode || operating_mode}`);
  console.log(operating_mode === 'PDV'
    ? 'Reinicia la Point si no muestra el cambio. Desde ahora cobra lo que le manda el POS.'
    : 'La Point vuelve a cobrar tecleando el monto. Para regresar al POS: --pdv');
} else {
  console.error('Uso: node --env-file=.env scripts/point-terminal.mjs [--pdv|--normal <TERMINAL_ID>]');
  process.exit(2);
}
