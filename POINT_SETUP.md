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

## Paso 2 — Ubicar la terminal y ponerla en modo PDV (3 min)

Con la Point encendida y con internet:

```bash
node --env-file=.env scripts/point-terminal.mjs
```

Copia el `id` (termina con el serial de la etiqueta trasera). Si el modo no es
`PDV`:

```bash
node --env-file=.env scripts/point-terminal.mjs --pdv EL_ID_QUE_SALIO
```

> Si un día falla el internet o Mercado Pago, regrésala al modo normal con
> `--normal EL_ID` y registra en el POS con “Registrar sin Point”.

## Paso 3 — Terminal en Vercel y redesplegar (2 min)

```bash
printf '%s' 'EL_ID_QUE_SALIO' | vercel env add MP_POINT_TERMINAL_ID production
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
