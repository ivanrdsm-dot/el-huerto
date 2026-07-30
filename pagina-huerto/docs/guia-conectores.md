# Guía de conectores e integraciones pendientes

Estado real de esta sesión de desarrollo: **ningún conector externo se
inventó**. Lo que funciona hoy funciona sin credenciales.

## ✅ Activo hoy

| Integración | Estado |
| --- | --- |
| Vercel CLI (cuenta `ivanrdsm-1255`) | Autenticado; proyecto `pagina-huerto` |
| WhatsApp (deep links `wa.me`) | Funciona sin API; número pendiente de validar |
| Google Maps (enlace de búsqueda) | Funciona; falta pin exacto |
| Instagram (enlace al perfil) | Funciona; sin feed en vivo |

## ⏳ Pendientes (en orden recomendado)

### 1. Vercel Web Analytics + Speed Insights
Sin código extra: actívalos en el dashboard de Vercel → proyecto
`pagina-huerto` → Analytics / Speed Insights. Luego
`npm i @vercel/analytics @vercel/speed-insights` y añade los componentes en
`app/layout.tsx`.

### 2. Google Analytics 4
Crear propiedad GA4 → copiar `G-XXXX` a `NEXT_PUBLIC_GA4_ID` en Vercel →
añadir el script con `@next/third-parties/google`. Eventos previstos:
`click_whatsapp`, `click_maps`, `click_instagram`, `view_combo`,
`search_menu` (los enlaces ya llevan la fuente en el mensaje de WhatsApp:
`[web:hero]`, `[web:combo-el-og]`, etc.).

### 3. Google Search Console
Verificar el dominio (registro DNS TXT) y enviar `sitemap.xml`.

### 4. Instagram / Meta
Requiere app de Meta + token de larga duración de la cuenta
@elhuerto_mx. Mientras tanto la galería (`components/InstagramGallery.tsx`)
es administrable a mano: agrega fotos a `public/photos/` y edita la lista
`GALERIA`. **No simula un feed en vivo.**

### 5. Google Maps embebido
Cuando existan coordenadas del kiosco: pegar la URL de embed en
`NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` y añadir el iframe con carga diferida
(botón "Cargar mapa") en `LocationSection`.

### 6. CMS (Sanity recomendado)
1. `npm create sanity@latest` con dataset `production`.
2. Modelos `product` y `combo` espejo de `types/menu.ts`.
3. Sustituir las importaciones de `data/menu.ts` por consultas GROQ.
4. Webhook de Sanity → deploy hook de Vercel para republicar al editar.

### 7. Correo del formulario (opcional)
Hoy el formulario entrega por WhatsApp. Si se quiere correo: cuenta de
Resend → `RESEND_API_KEY` → route handler `app/api/contacto/route.ts` con
validación Zod (el esquema ya existe en `ContactForm`).

## Reglas

- Nunca guardes tokens en el repositorio: solo en variables de entorno de
  Vercel (Preview y Production separadas).
- Prueba cada integración en un Preview Deployment antes de producción.
