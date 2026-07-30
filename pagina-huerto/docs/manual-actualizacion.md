# Manual de actualización

Todo el contenido del menú vive en **un solo archivo**: `data/menu.ts`.
Los textos de contacto y ubicación viven en `lib/site.ts`.
Después de cualquier cambio: `npm run build` (o simplemente haz commit y
Vercel despliega solo).

## Cambiar un precio

Busca el producto en `data/menu.ts` y edita el número:

```ts
precios: [
  { etiqueta: "Chico", valor: 40 },   // ← cambia 40
  { etiqueta: "Grande", valor: 55 },
],
```

Los combos están al final del archivo (`COMBOS`): edita `precio: 179`.

## Ocultar un producto agotado

Cambia `disponible: true` → `disponible: false`. La tarjeta se atenúa y
muestra el sello "Agotado". Para quitarlo del sitio por completo, borra (o
comenta) su bloque.

## Agregar un producto

Copia un bloque existente de la misma categoría, cambia `id`, `slug`,
`nombre`, `descripcionCorta` y `precios`. Si tienes foto con fondo
transparente, súbela a `public/products/` y apunta `imagen` a esa ruta.

## Cambiar toppings

Listas `TOPPINGS_BOWLS` y `TOPPINGS_ENSALADA` al inicio de `data/menu.ts`.
El precio del topping extra es `TOPPING_EXTRA_PRECIO`.

## Cambiar WhatsApp, Instagram o ubicación

`lib/site.ts` → `whatsappNumero` (formato 52 + 10 dígitos, sin espacios),
`instagramUser`, `ubicacion.mapsUrl` (pega aquí el enlace real de Google
Maps del kiosco cuando exista).

## Cambiar horarios / avisos

La leyenda de horario está en `components/LocationSection.tsx`. Cuando el
horario oficial esté confirmado, reemplaza el texto y agrégalo también al
schema (ver `docs/checklist-produccion.md`).

## Badges de producto

Campo opcional `badge` con textos cortos en mayúsculas:
`FAVORITO`, `ANTES DE CLASE`, `DESPUÉS DEL GYM`, `PARA EMPEZAR EL DÍA`,
`PARA COMPARTIR`.

## Migración futura a CMS

La estructura de `data/menu.ts` replica el modelo `Product`/`Combo` del
prompt maestro; migrar a Sanity u otro CMS es mover estos datos tal cual.
Ver `docs/guia-conectores.md`.
