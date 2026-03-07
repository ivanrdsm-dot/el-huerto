# 🌿 El Huerto — Sistema de Control

> Sistema de gestión interna para el restaurante **El Huerto**.

## ¿Qué incluye?

| Módulo | Descripción |
|--------|-------------|
| 🏠 Dashboard | KPIs en tiempo real: ventas del día, semana, mes, utilidad neta |
| 💰 Caja del Día | Registro diario separando efectivo y tarjeta (Lun–Vie) |
| 📊 Gastos | Control categorizado con ticket/folio por proveedor |
| 👩 Nómina | Diana ($11,700 fijos) + Clau ($11,000 + cierres × $700) |
| 🚚 Proveedores | Pedidos semanales y Costco, historial por proveedor |
| 🌿 Suscriptores | Clientes con membresía mensual, control de cobros |
| 📦 Inventario | Stock con alertas automáticas de mínimos |
| 📈 Reportes | Estado de resultados, margen, exportación CSV |

## Stack

- **HTML + CSS + JavaScript** puro — sin frameworks, sin dependencias
- **localStorage** para persistencia de datos en el navegador
- **Deploy**: Vercel (sitio estático)

## Estructura del proyecto

```
el-huerto/
├── index.html      ← App completa (toda la lógica aquí)
├── vercel.json     ← Configuración de Vercel
├── package.json    ← Metadatos del proyecto
├── sitemap.xml     ← Mapa del sitio
├── robots.txt      ← Instrucciones para bots
├── .gitignore      ← Archivos ignorados por Git
└── README.md       ← Este archivo
```

## Deploy en Vercel desde GitHub

```bash
# 1. Clonar / entrar a la carpeta
cd el-huerto

# 2. Inicializar Git
git init
git add .
git commit -m "🌿 El Huerto v1.0"

# 3. Crear repo en github.com y conectar
git remote add origin https://github.com/TU_USUARIO/el-huerto.git
git branch -M main
git push -u origin main

# 4. En vercel.com → New Project → Import desde GitHub → Deploy
```

## Uso local

Abre `index.html` directamente en el navegador. No requiere servidor ni instalación.

---

*Sistema de uso interno — El Huerto*
