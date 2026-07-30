# Información pendiente de validar

Nada de esta lista bloquea el Preview, pero **debe resolverse antes de
conectar el dominio definitivo**. El sitio ya está redactado para no afirmar
nada de lo que aparece aquí.

## Datos del negocio

| Dato | Estado | Dónde se usa |
| --- | --- | --- |
| Número de WhatsApp `56 4666 5718` | ⚠️ A confirmar | `lib/site.ts` → todos los botones de WhatsApp |
| Coordenadas exactas del kiosco en Ciudad UP | ❌ Faltan | `lib/site.ts` (hoy se abre una búsqueda genérica de Maps) |
| Referencia interna del campus ("junto a…") | ❌ Falta | `/ubicacion` |
| Horario oficial de servicio | ❌ Falta | `/ubicacion`, schema `OpeningHoursSpecification` (no publicado aún) |
| Estatus Kosher / No Kosher por producto | ❌ Falta | `data/menu.ts` (`kosherStatus` previsto, sin publicar) |
| Alérgenos por producto | ❌ Falta | fichas de producto |
| "Pal' Mamado ya incluye proteína" | ❌ Sin confirmar | ficha del smoothie (no se afirma) |
| Toppings incluidos en cada combo | ⚠️ A confirmar | `/combos` (no se afirma cantidad) |

## Contenido

- **Foto real del kiosco**: no existe en las carpetas actuales. La sección de
  ubicación usa una foto de producto mientras tanto.
- **Foto limpia de panini / bowls / fruta**: solo existen dentro de los PDF
  (ya extraídas como recortes) — sesión fotográfica recomendada.
- **Imagen del smoothie "Pal' Mamado"**: el PDF trae un solo vaso beige (se
  usa el mismo del Chai Lover). Diferenciarlos cuando haya foto propia.
- **Videos horizontales**: todos los videos existentes son verticales,
  cuadrados o 4:5. El plan Higgsfield (docs/plan-higgsfield.md) cubre el hero
  panorámico.

## Integraciones (ver docs/guia-conectores.md)

- Instagram/Meta API (hoy: galería propia administrable, sin feed simulado)
- Google Analytics 4 + Search Console
- Google Maps embebido con pin exacto
- CMS headless (hoy: `data/menu.ts` editable)
- Dominio definitivo en Vercel

## Analizado vs. no analizado

- ✅ LATERAL MENÚ.pdf, LATERALES FRONTALES.pdf, logo El Huerto.pdf
  (renderizados y verificados visualmente)
- ✅ 20 imágenes y 8 videos de `fotos huerto` (clasificados)
- ❌ Perfil de Instagram @elhuerto_mx: **no se analizó** — no hay conector de
  Instagram disponible en esta sesión. Queda registrado como pendiente.
