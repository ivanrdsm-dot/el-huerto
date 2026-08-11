# Guía de posicionamiento de El Huerto

Dominio en producción: **https://www.elhuertomx.com**
(el apex `elhuertomx.com` redirige 308 a www — es el canónico correcto).

---

## ✅ Lo que ya está hecho en el sitio

| Elemento | Estado |
| --- | --- |
| Dominio propio conectado y con HTTPS | ✅ |
| URLs canónicas en las 45 páginas | ✅ |
| Un solo `<h1>` por página | ✅ |
| Títulos y descripciones únicos con precios y "Ciudad UP" | ✅ |
| 28 páginas individuales de producto (long-tail) | ✅ |
| Página de preguntas frecuentes con schema FAQ | ✅ |
| Datos estructurados: CafeOrCoffeeShop, WebSite, Menu, MenuItem, BreadcrumbList, ItemList, Offer | ✅ |
| Sitemap con 44 URLs + robots.txt con host y sitemap | ✅ |
| Enlazado interno entre carta → categoría → producto → relacionados | ✅ |
| Logo de El Huerto sobre las imágenes de producto | ✅ |
| Open Graph e imagen para compartir en WhatsApp | ✅ |
| Imágenes en AVIF/WebP automáticas y caché de un año | ✅ |
| Vercel Analytics y Speed Insights instalados | ✅ (activar en el dashboard) |

### Resultados de Lighthouse (móvil, agosto 2026)

| Categoría | Puntuación |
| --- | --- |
| SEO | **100** |
| Accesibilidad | **100** |
| Buenas prácticas | **100** |
| Rendimiento | **84–96** (varía por latencia de la medición) |

Métricas: CLS 0 · TBT 0–10 ms · LCP 2.7–4.1 s.

El LCP oscila entre mediciones aunque la imagen del hero pesa solo 21 KB en
AVIF: la diferencia es latencia de red del laboratorio, no del sitio. **Lo
que Google usa para posicionar son los datos de usuarios reales (CrUX)**, no
Lighthouse de laboratorio — y eso ya lo está midiendo Speed Insights.
Revísalo en Vercel → proyecto `pagina-huerto` → Speed Insights en 2–3 semanas.

Correcciones aplicadas que subieron la nota: `sizes` en las imágenes del hero
(servían una versión mucho mayor de la mostrada), `fetchPriority` alto solo en
la imagen LCP, contraste del pie de página a 5.8:1, y optimización de los PNG
de producto (29.6 MB → 25.2 MB conservando transparencia y calidad).

---

## 🔴 Lo más importante que falta (solo tú puedes hacerlo)

### 1. Google Business Profile — el #1 en impacto local

Sin esto, El Huerto **no aparece en Google Maps ni en el bloque de resultados
locales**, que es donde busca el 80% de los estudiantes ("cafetería cerca de
mí", "café Universidad Panamericana").

1. Entra a https://business.google.com y crea el perfil.
2. Nombre exacto: **El Huerto**
3. Categoría principal: *Cafetería*. Secundarias: *Bar de jugos y batidos*,
   *Tienda de sándwiches*.
4. Ubicación: marca el punto exacto del kiosco dentro de Ciudad UP.
5. Sitio web: `https://www.elhuertomx.com`
6. WhatsApp como teléfono de contacto.
7. Horario real de servicio.
8. Sube 10–15 fotos (usa las de `public/products/`, ya llevan el logo).
9. Google enviará una postal o pedirá verificación por video: complétala.

Cuando tengas las coordenadas exactas, dímelas y las agrego al sitio
(schema `geo` + mapa embebido), que es el complemento de este paso.

**Mientras esperas la verificación:** la postal tarda ~5–14 días; la
verificación por video suele resolverse en 24–72 h. No hace falta hacer nada
más en el sitio — en cuanto Google confirme, entra al perfil, completa fotos y
horario, y pídeme que agregue las coordenadas al sitio (schema `geo` + mapa
embebido). Ese es el complemento que cierra el círculo.

### 2. Google Search Console

Ya lo tienes abierto. Con el dominio nuevo:

1. En Search Console, "Añadir propiedad" → tipo **Dominio** → `elhuertomx.com`
2. Te pedirá un registro TXT. Como el dominio está en Vercel, agrégalo en
   Vercel → Domains → elhuertomx.com → DNS Records → Add (tipo TXT).
3. Verifica, y en "Sitemaps" envía: `sitemap.xml`
4. En "Inspección de URLs" pide indexación de:
   `https://www.elhuertomx.com/`, `/carta`, `/combos`, `/ubicacion`,
   `/preguntas-frecuentes`

### 3. Instagram → sitio

Pon `https://www.elhuertomx.com` en la bio de @elhuerto_mx. Es la señal de
autoridad más fácil y rápida que tienes.

---

## 📈 Qué hacer después (por orden de impacto)

1. **Reseñas de Google**: pide reseña a los clientes frecuentes. Es el factor
   #1 del ranking local. Un QR en el kiosco que abra el enlace de reseña
   funciona muy bien.
2. **Fotos reales del kiosco**: falta la foto del kiosco (ver
   `docs/pendientes.md`). Google premia fotos propias en el perfil.
3. **Publicaciones en Google Business** semanales (mismo contenido que
   Instagram): promos, combos, novedades.
4. **Horario confirmado**: cuando lo tengas, se publica en el sitio y en el
   schema, y habilita el "Abierto ahora" en Google.
5. **Contenido**: si más adelante quieres blog, los temas que buscan los
   estudiantes son "dónde desayunar en Ciudad UP", "café barato Universidad
   Panamericana", "opciones saludables en el campus".

---

## Palabras clave objetivo

Ya trabajadas en títulos, descripciones y contenido, sin saturar:

- El Huerto Ciudad UP · cafetería Ciudad UP · café Universidad Panamericana
- smoothies Ciudad UP · açaí bowl Bosque Real · paninis Ciudad UP
- ensaladas Ciudad UP · boba tea Ciudad UP · matcha Ciudad UP
- comida saludable Ciudad UP · comida para estudiantes Bosque Real

## Cómo medir

Cuando conectes Search Console (paso 2), en 2–4 semanas verás las primeras
impresiones. El posicionamiento local real llega cuando Google Business
Profile esté verificado (paso 1) — ese es el que mueve la aguja.
