# 🧾 Tickets por semana — evidencia de compras de El Huerto

Carpeta de evidencia para costos de insumos. Cada compra que entra al
sistema debe tener aquí su ticket (foto o PDF).

## Cómo se organiza

- **Una carpeta por semana** (lunes a domingo), con el número de semana ISO:
  `2026-W32 (03 - 09 ago)/`
- **Nombre de archivo**: `FECHA Proveedor MONTO.ext`
  - Ejemplos: `2026-08-04 Costco 2965.10.pdf` · `2026-08-01 El Zorro 820.jpg`
- Sirve cualquier formato: PDF, JPG, HEIC, PNG.

## Flujo de trabajo

1. Iván deja los tickets de la semana en la carpeta correspondiente
   (o se los pasa a Claude, que los archiva aquí).
2. Claude extrae artículos, cantidades y costos → actualiza **gastos +
   inventario + costo por unidad** en el sistema (migración auditada).
3. El ticket queda aquí como evidencia; con cada `git push` se respalda
   en GitHub automáticamente.

## Regla de oro

**Si un costo del sistema no tiene ticket aquí, se considera no
verificado.** El food cost del reporte solo es confiable si esta
carpeta está completa.
