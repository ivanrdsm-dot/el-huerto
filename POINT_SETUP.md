# 💳 Cobro con Point Smart 2 — Pasos para Iván (10 minutos)

> **Qué cambia:** al tocar **💳 Tarjeta** en el POS, el total (+ propina) llega
> solo a la Point. Cuando el cliente paga, la venta se registra sola con el ID
> de la orden de Mercado Pago. Nadie vuelve a teclear el monto en la terminal.

**Point se enciende solo.** El código ya está publicado. Mientras falte
`MP_ACCESS_TOKEN` o `MP_POINT_TERMINAL_ID` en Vercel, el botón de tarjeta
cobra exactamente como antes. En cuanto estén las dos (y se redespliegue),
empieza a mandar a la terminal. Para apagarlo: borrar `MP_POINT_TERMINAL_ID`
en Vercel, redesplegar y regresar la Point a modo normal (Paso 2, `--normal`).

Ya configurado: `MP_POINT_STAFF_EMAILS` (admin, Claudia 2002, Erandy 2005,
Vale 2006). Cuando entre alguien nuevo, agrega su `empID@elhuerto.app`.

## 🔴 Estado al 7-oct-2026: esperando a soporte de Mercado Pago

Hecho: token de producción en Vercel y `.env`, ID de la terminal confirmado,
cajeras con cuenta propia. **Falta solo el modo PDV**, y Mercado Pago lo tiene
bloqueado para la cuenta: `GET /terminals/v1/list` y `PATCH /terminals/v1/setup`
responden `403 PA_UNAUTHORIZED_RESULT_FROM_POLICIES`. El menú *Modo de
vinculación* de la Point no aparece hasta la primera activación por API.

Mensaje para soporte (Developers → Soporte, desde el panel de la app):

> Hola. Integro mi Point Smart 2 con Orders API (integración propia) y no puedo
> activar el modo PDV.
> - Usuario: 3183209300 (MLM) · App: El Huerto POS, 2249509833805529
>   (credenciales de producción)
> - Terminal: NEWLAND_N950__N950NCCA05077658 (SN NCCA05077658), sucursal 78636166
> - `GET /terminals/v1/list` y `PATCH /terminals/v1/setup` responden 403
>   `PA_UNAUTHORIZED_RESULT_FROM_POLICIES` ("At least one policy returned
>   UNAUTHORIZED"). x-request-id: 58acd6ca-0507-40ee-a78a-2611a0b67033
>   (2026-10-08 03:24 UTC).
> - Con el mismo token, `POST /v1/orders` (type point) a esa terminal sí responde
>   201, y `/users/me`, `/stores` y `/pos` responden 200.
> - En la terminal no aparece "Más opciones > Ajustes > Modo de vinculación".
>
> ¿Pueden habilitar a mi cuenta/aplicación la API de terminales, o activar el
> modo PDV en esa terminal?

Cuando lo liberen: `node --env-file=.env scripts/point-terminal.mjs --pdv
NEWLAND_N950__N950NCCA05077658`, luego el Paso 3.

## ⚠️ ANTES DE EMPEZAR
Las cajeras tienen que entrar con **su cuenta propia** (Config → Cuentas de
acceso, ver `FIREBASE_SETUP.md`). Con la sesión anónima el POS no deja mandar
cobros a la terminal: es la misma sesión que usan los clientes del menú QR. Y en
modo PDV la Point ya no deja teclear montos, así que sin cuenta no hay cobro con
tarjeta.

---

## Paso 1 — Access Token de producción (2 min)

1. https://www.mercadopago.com.mx/developers/panel/app → app **El Huerto POS**
2. **Credenciales → pestaña Producción** → copia el **Access Token**
3. En la carpeta del proyecto, pégalo en Vercel (te lo pide oculto):
   ```bash
   vercel env add MP_ACCESS_TOKEN production --sensitive
   ```
4. Y en un `.env` local (ya está en `.gitignore`) para el Paso 2: copia
   `.env.example` a `.env` y pega el token en `MP_ACCESS_TOKEN`

## Paso 2 — La terminal y su modo PDV (2 min)

**ID de nuestra Point Smart 2 (confirmado el 7-oct-2026):**
`NEWLAND_N950__N950NCCA05077658` (etiqueta trasera: modelo N950, SN NCCA05077658).
Mercado Pago aceptó una orden de prueba a ese ID y se canceló al instante.

Mercado Pago **bloquea para esta cuenta** la API que lista terminales y cambia
su modo (`403 PA_UNAUTHORIZED_RESULT_FROM_POLICIES`); las órdenes sí pasan. Por
eso el modo se cambia **en la Point misma**:

**Más opciones → Ajustes → Modo de vinculación → PDV**

> Si un día falla el internet o Mercado Pago, ahí mismo se regresa al modo
> normal y se registra en el POS con “Registrar sin Point”.
> `scripts/point-terminal.mjs` sirve si algún día Mercado Pago libera la API.

## Paso 3 — Terminal en Vercel y redesplegar (2 min)

```bash
printf '%s' 'NEWLAND_N950__N950NCCA05077658' | vercel env add MP_POINT_TERMINAL_ID production
vercel redeploy https://el-huerto.vercel.app --target production
```

Comprueba que quedó activo (debe decir `"activo":true`):

```bash
curl -s "https://el-huerto.vercel.app/api/point?estado=1"
```

## Paso 4 — Primera prueba real (3 min)

1. En el POS: un producto barato → **💳 Tarjeta** → **Mandar a la terminal**
2. Paga con tu tarjeta → el POS debe decir **¡Pago aprobado!** y registrar la venta
3. Reembolsa esa venta desde la app de Mercado Pago y **anúlala** en el POS
   (anular en el POS no devuelve el dinero; el aviso lo recuerda)

---

## ¿Algo salió mal?

| Lo que dice el POS | Qué hacer |
|---|---|
| “necesitas tu cuenta propia” | Cerrar sesión y entrar de nuevo con la contraseña |
| “no está autorizada para cobrar con Point” | Agregar ese correo a `MP_POINT_STAFF_EMAILS` en Vercel y redesplegar |
| “Falta MP_… en las variables de entorno” | Revisar Pasos 1 y 3 y redesplegar |
| “Ya hay un cobro esperando en la terminal” | Cancelarlo en la Point o con **Cancelar cobro** |
| “La terminal no está vinculada…” | La Point está en otra cuenta de Mercado Pago |
| “Pago aprobado — falta registrar la venta” | **No volver a cobrar**: tocar *Reintentar registrar venta* |

Si se recarga la página mientras el cliente paga, al volver el POS retoma ese
mismo cobro: nunca manda uno nuevo.
