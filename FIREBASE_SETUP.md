# 🛡 Blindaje de Firebase — Pasos para Iván (5 minutos)

> **Por qué:** hoy tu base de datos está abierta — cualquiera con la URL del proyecto
> puede leer o borrar ventas, nómina, todo. Estos pasos la cierran sin cambiar
> nada del flujo de las chicas.

## ⚠️ ORDEN OBLIGATORIO: primero el Paso 1, después el Paso 2.
Si publicas las reglas (Paso 2) sin habilitar Auth (Paso 1), la app deja de cargar.

---

## Paso 1 — Habilitar Anonymous Auth (2 min)

1. Entra a https://console.firebase.google.com
2. Abre el proyecto **el-huerto-95801**
3. Menú izquierdo → **Build → Authentication**
4. Pestaña **Sign-in method** (Método de acceso)
5. En la lista de proveedores busca **Anonymous** (Anónimo)
6. Click → activa el switch **Enable** → **Save**

### Verificación del Paso 1
- Abre https://el-huerto.vercel.app (después del deploy de esta versión)
- Abre la consola del navegador (F12)
- Debes ver: `✓ Firebase Auth: sesión anónima activa`
- Si ves eso, continúa al Paso 2. Si no, avísame antes de seguir.

---

## Paso 2 — Publicar las reglas de seguridad (2 min)

1. En la misma consola de Firebase → **Build → Firestore Database**
2. Pestaña **Rules** (Reglas)
3. Borra lo que haya y pega el contenido completo del archivo
   **`firestore.rules`** de este repo
4. Click **Publish** (Publicar)

### Verificación del Paso 2
- Recarga https://el-huerto.vercel.app → todo debe funcionar normal
- Prueba registrar una venta de prueba → debe guardarse
- (Opcional) En una ventana de incógnito SIN abrir la app, la base ya no es
  accesible directamente por API pública

---

## Paso 3 — Primer respaldo (1 min)

1. En el sistema → **⚙️ Config** → tarjeta **🛡 Respaldo de Datos**
2. Click **💾 Descargar respaldo completo**
3. Guarda el archivo `huerto_backup_FECHA.json` en tu Drive/computadora
4. El sistema te recordará cada 7 días hacer uno nuevo

---

## ¿Algo salió mal?

- **La app se queda cargando después del Paso 2** → casi seguro no se habilitó
  Anonymous Auth. Vuelve al Paso 1, o temporalmente en Rules cambia
  `if request.auth != null` por `if true` y Publish (vuelve a quedar abierta,
  pero la app funciona mientras me avisas).
- Cualquier duda: dime qué ves en la consola (F12) y te digo el fix exacto.
