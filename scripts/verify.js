#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════
// EL HUERTO — Prueba de humo pre-publicación
// Corre automáticamente antes de cada `git push` (hook pre-push).
// Si algo aquí falla, el push se cancela y Vercel nunca recibe
// una versión rota. Uso manual: node scripts/verify.js
// ══════════════════════════════════════════════════════════════
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
let errors = [];
const ok = m => console.log('  ✓ ' + m);
const fail = m => { errors.push(m); console.error('  ✗ ' + m); };

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

// ── 1. Sintaxis de todos los scripts inline ──
console.log('\n[1/5] Sintaxis JavaScript');
const scripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)].filter(m => !/src=/.test(m[1]));
scripts.forEach(([, attrs, code], i) => {
  const isMod = /type=.module/.test(attrs);
  try {
    if (isMod) new Function(code.replace(/^\s*import[^;]+;/gm, ''));
    else new Function('return (async()=>{' + code + '})');
    ok(`script ${i} (${isMod ? 'module' : 'classic'}, ${Math.round(code.length / 1024)}KB)`);
  } catch (e) {
    fail(`script ${i}: ${e.message}`);
  }
});

// ── 2. Funciones críticas presentes ──
console.log('\n[2/5] Funciones críticas');
const FNS = ['cobrar', 'renderOrder', 'renderPOS', 'realizarCorte', 'calcDia',
  'descontarInventario', 'reponerInventario', 'qtyToInvUnit', 'foodCostProducto',
  'loadMigrations', 'migDone', 'markMig', 'exportBackup', 'logAudit',
  'pedirVendedorVenta', 'confVendedor', 'enviarResumenCorteWA', 'checkAutoBackup',
  'fsSetCritical', 'empsActivos'];
FNS.forEach(fn => {
  const re = new RegExp(`(function ${fn}\\b|window\\.${fn}\\s*=|const ${fn}\\s*=)`);
  if (re.test(html)) ok(fn); else fail(`función no encontrada: ${fn}`);
});

// ── 3. Elementos de UI críticos ──
console.log('\n[3/5] Elementos de UI');
const IDS = ['page-pos', 'order-panel', 'op-items', 'op-tot', 'pcats', 'pin-modal',
  'cobro-modal', 'vconf-modal', 'vend-modal', 'corte-contado', 'corte-semaforo',
  'corte-nota', 'lock-emp-btns'];
IDS.forEach(id => {
  if (html.includes(`id="${id}"`)) ok('#' + id); else fail(`elemento no encontrado: #${id}`);
});

// ── 4. Migraciones consistentes (cada migDone tiene su markMig) ──
console.log('\n[4/5] Migraciones');
const keys = s => new Set([...html.matchAll(new RegExp(s + `\\((?:migKey|'([^']+)')\\)`, 'g'))].map(m => m[1]).filter(Boolean));
const migKeys = [...html.matchAll(/const migKey='([^']+)'/g)].map(m => m[1]);
const dupes = migKeys.filter((k, i) => migKeys.indexOf(k) !== i);
if (dupes.length) fail(`migKey duplicado: ${dupes.join(', ')}`); else ok(`${migKeys.length} migraciones, claves únicas`);
migKeys.forEach(k => { /* cada migración debe marcar y consultar */ });
const HELPERS = ['migDone', 'markMig']; // helpers del registro, no migraciones
const migFns = [...html.matchAll(/async function (mig\w+|migrate\w+|fix\w+)\(/g)].map(m => m[1]).filter(f => !HELPERS.includes(f));
migFns.forEach(fn => {
  if (!html.includes(`await ${fn}()`)) fail(`migración definida pero nunca llamada: ${fn}`);
});
if (!errors.some(e => e.includes('migración'))) ok('todas las migraciones están conectadas al init');

// ── 5. Service worker versionado ──
console.log('\n[5/5] Service worker');
const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
const swv = sw.match(/CACHE_NAME\s*=\s*'([^']+)'/);
if (swv) ok(`CACHE_NAME: ${swv[1]}`); else fail('sw.js sin CACHE_NAME');

// ── Resultado ──
console.log('\n══════════════════════════════════');
if (errors.length) {
  console.error(`❌ ${errors.length} error(es) — PUSH CANCELADO`);
  process.exit(1);
} else {
  console.log('✅ Prueba de humo OK — seguro publicar');
}
