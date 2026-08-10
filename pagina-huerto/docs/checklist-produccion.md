# Checklist previo a producción

El sitio vive en Preview hasta que el dueño autorice publicar.
**No conectar el dominio definitivo sin marcar todo esto.**

## Datos (ver docs/pendientes.md)

- [ ] WhatsApp 56 4666 5718 confirmado con un mensaje de prueba real
- [ ] Coordenadas + enlace exacto de Google Maps del kiosco
- [ ] Horario oficial (y aviso de calendario académico)
- [ ] Referencia interna del campus en /ubicacion
- [ ] Revisión de precios contra el menú vigente del mes
- [ ] Confirmar toppings incluidos por combo
- [ ] Ortografía revisada por el equipo (nombres Pal'…, Tía Renee)

## Técnica

- [ ] `npm run build` y `npm run lint` sin errores
- [ ] Lighthouse móvil: Performance ≥90, A11y ≥95, BP ≥95, SEO ≥95
- [ ] Probar en iPhone (Safari) y Android (Chrome) reales
- [ ] Probar teclado + VoiceOver en el menú y el armador de bowls
- [ ] Revisar consola sin errores en /, /carta, /combos, /ubicacion
- [ ] 404 personalizada funciona (/loquesea)
- [x] Actualizar `SITE.url` en `lib/site.ts` al dominio real (www.elhuertomx.com)
- [ ] OG: compartir la URL en WhatsApp y verificar la tarjeta

## Vercel

- [ ] Variables de entorno de producción cargadas (.env.example como guía)
- [ ] Web Analytics + Speed Insights activados
- [x] Dominio conectado y HTTPS verificado
- [ ] Rollback probado (promote de un deployment anterior)

## SEO

- [ ] Search Console verificado + sitemap enviado (ver docs/guia-seo.md)
- [ ] Schema con horario real (`OpeningHoursSpecification`) una vez confirmado
- [ ] **Google Business Profile del kiosco — máxima prioridad SEO** (ver docs/guia-seo.md)
