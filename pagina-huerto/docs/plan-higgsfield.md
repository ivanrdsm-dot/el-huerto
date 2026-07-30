# Plan Higgsfield — piezas audiovisuales

Estado: **pendiente de producción**. El sitio ya usa video real optimizado
(`public/videos/`) y está preparado para recibir estas piezas sin cambios de
código (componente `VideoLoop`, poster + MP4).

Reglas para todas las piezas: luz natural, colores cálidos de la paleta
(verde olivo #344526, crema #F4EEDF, rojo #EF3B24), vasos y empaques reales
de El Huerto, logotipo oficial sin alteraciones, sin texto incrustado en la
versión master, sin deformaciones de alimentos.

## Video 1 — Hero principal (8–12 s)
Formatos: 16:9 (escritorio), 4:5, 9:16 (móvil/reel).
Secuencia: fruta entrando a cuadro → preparación de smoothie → vertido en
vaso real → close-up de granola sobre bowl → panini cortándose → leche
integrándose a café → estudiante recibiendo pedido → plano del kiosco →
cierre con logotipo.
Destino en el sitio: fondo del hero de `/` (hoy: composición fotográfica).

## Video 2 — Smoothies (6–8 s)
Fruta, hielo, leche, avena, crema de almendra, matcha, mezcla, vaso final.
Destino: sección "Un smoothie y seguimos." (hoy: video real de Pal' Sediento).

## Video 3 — Café entre clases (6–8 s)
Espresso, vapor, textura de leche, latte art en el vaso verde oficial,
entrega, ambiente universitario.
Destino: sección "Tu café entre clases." de `/` y `/carta/cafe`.

## Video 4 — Bowls y overnight oats (6–8 s)
Açaí, granola, fresa, blueberry, plátano, mango, miel, textura final.
Destino: sección "Arma tu bowl.".

## Video 5 — Cómo llegar (10–15 s)
Campus → trayecto → señalización → kiosco → producto → cierre
"Nos vemos entre clases."
Destino: `/ubicacion`. Requiere grabar material real del campus (pendiente
de coordenadas/fotos del kiosco).

## Entregables por pieza
MP4 (H.264, CRF 24–26) + WebM, poster AVIF/WebP, versiones 16:9 / 4:5 /
9:16, master sin texto, export para Reel/Stories.

## Integración técnica
1. Comprimir: `ffmpeg -i master.mov -vf scale=1280:-2 -c:v libx264 -crf 26 -preset slow -movflags +faststart -an out.mp4`
2. Poster: `ffmpeg -i out.mp4 -frames:v 1 -q:v 3 poster.jpg`
3. Copiar a `public/videos/` y referenciar con `<VideoLoop src poster etiqueta />`.
El componente ya respeta `prefers-reduced-motion` y ahorro de datos, y solo
reproduce el video cuando está en pantalla.
