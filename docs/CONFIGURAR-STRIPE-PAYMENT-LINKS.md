# 💳 Configurar Stripe Payment Links con Email Automático

**Guía paso a paso para configurar tus links de pago de Stripe**

---

## 🎯 Objetivo

Configurar tus Payment Links de Stripe para que:
1. Capturen automáticamente el email del comprador
2. Redirijan a tu página de gracias con el email incluido
3. El sistema guarde el email y conceda acceso inmediatamente

---

## 📋 Antes de Comenzar

**Necesitas:**
- Acceso a tu Dashboard de Stripe
- Tus Payment Links ya creados
- La URL de tu sitio web

**Payment Links actuales:**
- **Derecho para No Abogados**: `https://buy.stripe.com/00wfZi0mj12v18L02k7EQ00`
- **Legal English**: `https://buy.stripe.com/14AeVe3yvbH95p18yQ7EQ01`

---

## 🔧 PASO 1: Acceder a Stripe Dashboard (1 minuto)

1. Ve a: https://dashboard.stripe.com/
2. Inicia sesión con tu cuenta
3. Asegúrate de estar en el modo correcto:
   - **Test mode** (para pruebas)
   - **Live mode** (para producción)

---

## 🔧 PASO 2: Encontrar tus Payment Links (1 minuto)

1. En el menú izquierdo, haz clic en **"Products"** → **"Payment Links"**
2. Verás una lista de tus Payment Links existentes
3. Busca los links de tus cursos:
   - "Derecho para No Abogados - $500 MXN"
   - "Legal English - $5,000 MXN"

---

## 🔧 PASO 3: Editar Payment Link - Derecho (5 minutos)

### 3.1. Abrir el Payment Link

1. Haz clic en el Payment Link de **"Derecho para No Abogados"**
2. En la parte superior derecha, haz clic en los **"⋮" (tres puntos)**
3. Selecciona **"Edit"** (Editar)

### 3.2. Configurar la Redirección

1. Baja hasta la sección **"After payment"** (Después del pago)
2. Selecciona la opción: **"Redirect to a page"** (Redirigir a una página)
3. En el campo **"Page URL"**, ingresa:

```
https://TU-DOMINIO.com/gracias.html?curso=derecho-no-abogados&email={CUSTOMER_EMAIL}
```

**⚠️ IMPORTANTE: Reemplaza `TU-DOMINIO.com` con tu dominio real:**

**Ejemplos:**
- Si usas GitHub Pages: `https://jorch01.github.io/cursos-juridicos-empirica.io/gracias.html?curso=derecho-no-abogados&email={CUSTOMER_EMAIL}`
- Si tienes dominio propio: `https://empirica-legal.com/gracias.html?curso=derecho-no-abogados&email={CUSTOMER_EMAIL}`

### 3.3. Entender el Parámetro {CUSTOMER_EMAIL}

**¿Qué es `{CUSTOMER_EMAIL}`?**
- Es un **placeholder** (marcador de posición) de Stripe
- Stripe lo **reemplaza automáticamente** con el email real del comprador
- **NO cambies las llaves** `{` `}`
- Debe estar **exactamente así**: `{CUSTOMER_EMAIL}` (en mayúsculas)

**Ejemplo de cómo funciona:**

**URL configurada:**
```
https://mi-sitio.com/gracias.html?curso=derecho-no-abogados&email={CUSTOMER_EMAIL}
```

**URL final después del pago (generada por Stripe):**
```
https://mi-sitio.com/gracias.html?curso=derecho-no-abogados&email=comprador@gmail.com
```

### 3.4. Guardar Cambios

1. Baja hasta el final de la página
2. Haz clic en **"Save"** (Guardar)
3. Confirma los cambios

---

## 🔧 PASO 4: Editar Payment Link - Legal English (5 minutos)

Repite el proceso para el segundo curso:

### 4.1. Abrir el Payment Link

1. Vuelve a la lista de Payment Links
2. Haz clic en el Payment Link de **"Legal English"**
3. Haz clic en **"⋮"** → **"Edit"**

### 4.2. Configurar la Redirección

1. Ve a la sección **"After payment"**
2. Selecciona **"Redirect to a page"**
3. Ingresa la URL:

```
https://TU-DOMINIO.com/gracias.html?curso=legal-english&email={CUSTOMER_EMAIL}
```

**⚠️ Nota las diferencias:**
- `curso=legal-english` (sin mayúsculas, con guion)
- El resto es igual

### 4.3. Guardar Cambios

1. Haz clic en **"Save"**
2. Confirma

---

## ✅ PASO 5: Verificar la Configuración (2 minutos)

### 5.1. Revisar Derecho para No Abogados

1. Abre el Payment Link en tu navegador
2. **NO completes el pago todavía**
3. Inspecciona la URL en la barra de direcciones
4. Verifica que sea tu Payment Link correcto

### 5.2. Revisar Legal English

1. Repite para el segundo Payment Link
2. Verifica la URL

---

## 🧪 PASO 6: Hacer una Compra de Prueba (10 minutos)

⚠️ **Solo si estás en Test Mode** (puedes hacer compras sin costo)

### 6.1. Activar Test Mode

1. En Stripe Dashboard, arriba a la derecha
2. Activa el switch **"Test mode"**
3. El dashboard se pondrá con fondo naranja/amarillo

### 6.2. Obtener el Test Payment Link

1. Ve a Payment Links
2. Copia el URL del Payment Link (versión test)
3. Ábrelo en una ventana de incógnito

### 6.3. Completar la Compra de Prueba

1. Ingresa los datos de prueba de Stripe:
   - **Email**: `prueba@test.com`
   - **Tarjeta**: `4242 4242 4242 4242`
   - **Fecha**: Cualquier fecha futura (ej: 12/25)
   - **CVC**: Cualquier 3 dígitos (ej: 123)
   - **Nombre**: Cualquier nombre
   - **País**: México (o el que prefieras)

2. Haz clic en **"Pay"** (Pagar)

### 6.4. Verificar la Redirección

Después del pago, deberías ser redirigido a:
```
https://tu-sitio.com/gracias.html?curso=derecho-no-abogados&email=prueba@test.com
```

**Verifica:**
- La URL en la barra de direcciones contiene `email=prueba@test.com`
- La página de gracias se muestra correctamente
- El nombre del curso es correcto

### 6.5. Verificar que el Email se Guardó

1. Abre la consola del navegador (F12)
2. Ve a la pestaña **"Console"**
3. Deberías ver mensajes como:

```
✅ Parámetros recibidos:
   - curso: derecho-no-abogados
   - email: prueba@test.com
✅ Email guardado automáticamente: prueba@test.com
✅ Acceso concedido para: derecho-no-abogados
```

### 6.6. Verificar Acceso al Curso

1. Ve a la página del curso: `/cursos/derecho-no-abogados/`
2. El modal de acceso **NO debe aparecer**
3. Debes poder acceder a todos los videos

**Si el modal sí aparece:**
- Abre la consola (F12)
- Ejecuta: `localStorage.getItem('empirica_user_email')`
- ¿Devuelve tu email? Si no, hay un problema con el guardado automático

---

## 🔍 Solución de Problemas

### Problema: No me redirige después del pago

**Causas posibles:**

1. **No guardaste los cambios en Stripe**
   - Solución: Ve a Payment Links → Edit → Verifica "After payment"

2. **La URL tiene un error de escritura**
   - Solución: Verifica que no haya espacios extras
   - Verifica que `{CUSTOMER_EMAIL}` esté en mayúsculas

3. **Estás usando el link viejo**
   - Los cambios solo aplican a **nuevas compras**
   - Copia el link nuevamente desde Stripe Dashboard

### Problema: Me redirige pero sin el email en la URL

**Causas posibles:**

1. **Olvidaste poner `{CUSTOMER_EMAIL}`**
   - Solución: Edita el Payment Link y agrega `&email={CUSTOMER_EMAIL}`

2. **Pusiste el parámetro mal escrito**
   - ❌ Incorrecto: `{customer_email}` (minúsculas)
   - ❌ Incorrecto: `{CUSTOMER EMAIL}` (con espacio)
   - ❌ Incorrecto: `{{CUSTOMER_EMAIL}}` (doble llave)
   - ✅ Correcto: `{CUSTOMER_EMAIL}` (mayúsculas, sin espacios)

### Problema: El email se guarda pero no tengo acceso

**Causas posibles:**

1. **El nombre del curso no coincide**
   - En la URL debe ser: `curso=derecho-no-abogados` (exactamente así)
   - Revisa la página de gracias en consola (F12)

2. **El backend no está conectado**
   - El sistema frontend guarda el email en localStorage
   - El acceso es inmediato sin verificar el backend
   - Si no funciona, revisa `js/payment-access-control.js`

### Problema: Funciona en test pero no en producción

**Checklist:**

1. **Cambiar a Live Mode en Stripe**
   - Stripe Dashboard → Desactiva "Test mode"
   - Los Payment Links de test son diferentes a los de producción

2. **Actualizar los Payment Links en tu sitio**
   - Abre `js/payment-access-control.js`
   - Líneas 19-22: Verifica que tengas los URLs de **producción**
   - **Los URLs de test y producción son diferentes**

3. **Volver a configurar las redirecciones**
   - Los settings de test mode NO se copian a live mode
   - Debes editar los Payment Links de producción también

---

## 📝 Configuración Final en tu Código

Una vez configurados los Payment Links, verifica que tu código tenga las URLs correctas:

### Archivo: `js/payment-access-control.js` (líneas 19-22)

```javascript
STRIPE_LINKS: {
    'derecho-no-abogados': 'https://buy.stripe.com/00wfZi0mj12v18L02k7EQ00',
    'legal-english': 'https://buy.stripe.com/14AeVe3yvbH95p18yQ7EQ01'
},
```

**⚠️ IMPORTANTE:**
- Estas son las URLs de **producción** (Live mode)
- Si estás probando, usa las URLs de **test mode**
- Los dos modos tienen URLs diferentes

### ¿Cómo obtener las URLs correctas?

1. Ve a Stripe Dashboard
2. Selecciona el modo correcto (Test o Live)
3. Ve a Payment Links
4. Haz clic en un Payment Link
5. En la parte superior verás el URL completo
6. Cópialo y pégalo en el código

---

## 🎉 Checklist de Verificación Final

Antes de poner en producción:

### Stripe Test Mode
- [ ] Payment Link "Derecho" configurado con redirect + `{CUSTOMER_EMAIL}`
- [ ] Payment Link "Legal English" configurado con redirect + `{CUSTOMER_EMAIL}`
- [ ] Compra de prueba completada exitosamente
- [ ] Redirección funciona con email en la URL
- [ ] Acceso concedido inmediatamente después del pago

### Stripe Live Mode (Producción)
- [ ] Cambié a Live Mode en Stripe Dashboard
- [ ] Payment Link "Derecho" configurado en producción
- [ ] Payment Link "Legal English" configurado en producción
- [ ] URLs de producción actualizadas en `js/payment-access-control.js`
- [ ] Compra real de prueba (opcional, con tu propia tarjeta)

### Experiencia del Usuario
- [ ] Después de pagar, el usuario es redirigido automáticamente
- [ ] El email se captura sin intervención del usuario
- [ ] El usuario puede acceder al curso inmediatamente
- [ ] No hay formularios adicionales que llenar

---

## 📞 Soporte Post-Configuración

### Si un comprador reporta problemas:

1. **Verifica su pago en Stripe Dashboard**
   - Payments → Busca por email
   - Verifica que el pago sea "succeeded"

2. **Agrega su email manualmente al Google Sheet**
   - Abre el Sheet "Compradores Empírica Legal Lab"
   - Agrega una fila con su email y curso

3. **Dile que use "Verificar Acceso"**
   - En la página del curso
   - Tab "📧 Verificar Acceso"
   - Ingrese su email

4. **Como último recurso: Acceso temporal**
   - Dile que abra consola (F12)
   - Ejecute:
   ```javascript
   localStorage.setItem('empirica_user_email', 'su-email@real.com');
   localStorage.setItem('empirica_has_access_derecho-no-abogados', 'true');
   location.reload();
   ```

---

## 🚀 URLs de Redirección Completas

**Copia y pega estas URLs en Stripe** (reemplazando TU-DOMINIO):

### Derecho para No Abogados:
```
https://TU-DOMINIO.com/gracias.html?curso=derecho-no-abogados&email={CUSTOMER_EMAIL}
```

### Legal English:
```
https://TU-DOMINIO.com/gracias.html?curso=legal-english&email={CUSTOMER_EMAIL}
```

---

**¿Listo?** Una vez configurado, tu sistema estará 100% automatizado. Los compradores podrán acceder a sus cursos inmediatamente después de pagar, sin fricciones. 🎉
