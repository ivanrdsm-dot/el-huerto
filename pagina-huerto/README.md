# Página Huerto

Sitio web oficial de **El Huerto** — cafetería y concepto gastronómico
universitario en Ciudad Universitaria Panamericana (Ciudad UP), Bosque Real,
Huixquilucan.

> NATURAL · FRESCO · SALUDABLE

## Stack

- Next.js (App Router) + React + TypeScript estricto
- Tailwind CSS v4 (tokens en `app/globals.css`)
- `next/font` (Archivo Black · Barlow Condensed · Manrope)
- Zod (validación del formulario)
- Sin dependencias de animación: reveals con IntersectionObserver + CSS
- Despliegue en Vercel (proyecto `pagina-huerto`)

## Correr en local

```bash
npm install
npm run dev        # desarrollo en http://localhost:3000
npm run build      # build de producción
npm run start      # servir el build
npm run lint       # ESLint
```

## Estructura

```
app/            rutas (/, /carta, /carta/[categoria], /combos, /ubicacion, …)
components/     brand · menu · navigation · forms · motion · ui
data/menu.ts    ★ FUENTE DE VERDAD del menú (precios, productos, combos)
lib/site.ts     ★ constantes: WhatsApp, Instagram, ubicación, tagline
types/          tipos del dominio
public/brand    logos SVG (rojo/crema/verde/blanco), favicons, OG
public/products recortes transparentes extraídos de los PDF oficiales
public/photos   fotografías reales
public/videos   videos comprimidos para web + posters
docs/           manuales y pendientes (¡léelos!)
```

## Documentación

| Documento | Para qué |
| --- | --- |
| [docs/manual-actualizacion.md](docs/manual-actualizacion.md) | Cambiar precios, ocultar productos, horarios, avisos |
| [docs/guia-seo.md](docs/guia-seo.md) | ★ Posicionamiento: qué ya está hecho y qué falta (Google Business Profile) |
| [docs/pendientes.md](docs/pendientes.md) | Información pendiente de validar antes de producción |
| [docs/guia-conectores.md](docs/guia-conectores.md) | Integraciones futuras: Instagram, GA4, Maps, CMS |
| [docs/plan-higgsfield.md](docs/plan-higgsfield.md) | Storyboards de los 5 videos para Higgsfield |
| [docs/checklist-produccion.md](docs/checklist-produccion.md) | Checklist previo a publicar en dominio definitivo |

## Reglas de oro

1. Los precios viven **solo** en `data/menu.ts`; nunca se escriben a mano en
   los componentes.
2. No publiques información no verificada (ver `docs/pendientes.md`).
3. No publicar a producción sin autorización del dueño.
