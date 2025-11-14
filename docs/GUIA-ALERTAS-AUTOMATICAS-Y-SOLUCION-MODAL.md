# 🚨 Notificaciones Automáticas + Solución Modal Desaparecido

## 📧 PARTE 1: Alertas Automáticas de Actividad Sospechosa

### ¿Qué hace este sistema?

**Envía emails AUTOMÁTICOS cuando:**
1. 🚨 **Actividad sospechosa** - Más de 10 intentos en 5 minutos
2. 🎉 **Nueva compra** - Alguien paga en Stripe
3. ✅ **Email de bienvenida** - Automático al comprador

---

## 🚀 Cómo Implementar las Alertas Automáticas

### PASO 1: Reemplazar el Backend

1. **Abre tu Google Apps Script:** https://script.google.com
2. **Abre tu proyecto** actual del backend
3. **Selecciona TODO el código** (Ctrl+A)
4. **Bórralo** (Delete)
5. **Abre el archivo:** `docs/BACKEND-CON-ALERTAS-AUTOMATICAS.js`
6. **Copia TODO** el código
7. **Pégalo** en Google Apps Script
8. **Guarda** (Ctrl+S)

### PASO 2: Configurar tu Email

En el código que acabas de pegar, **línea 13**, cambia:

```javascript
adminEmail: 'jorge_clemente@empirica.mx',  // ← CAMBIA POR TU EMAIL
```

Por:

```javascript
adminEmail: 'TU-EMAIL@gmail.com',  // ← Tu email real
```

**⚠️ IMPORTANTE:** Debe ser una cuenta de Gmail para que funcionen los emails.

### PASO 3: Activar Alertas

En la **línea 14**, verifica que esté en `true`:

```javascript
enabledAlerts: true,  // ← Debe estar en true
```

Si quieres desactivar alertas temporalmente, cambia a `false`.

### PASO 4: Configurar Umbrales (Opcional)

**Líneas 17-18** - Cambia cuándo se considera "sospechoso":

```javascript
maxAttemptsInTimeWindow: 10,  // ← Intentos permitidos
timeWindowMinutes: 5,         // ← En cuántos minutos
```

**Ejemplo:** Si quieres más sensibilidad:
```javascript
maxAttemptsInTimeWindow: 5,   // Más estricto
timeWindowMinutes: 3,         // Ventana más corta
```

### PASO 5: Elegir Tipos de Alertas (Opcional)

**Líneas 21-23** - Activa/desactiva cada tipo:

```javascript
sendOnSuspiciousActivity: true,  // 🚨 Actividad sospechosa
sendOnNewPurchase: true,         // 🎉 Nueva compra
sendOnAccessDenied: false        // ❌ Acceso denegado (no recomendado - mucho spam)
```

### PASO 6: Desplegar

1. **Deploy** → **Manage deployments**
2. Haz clic en el **lápiz** ✏️
3. **Configuration** → **New version**
4. **Deploy**

### PASO 7: Autorizar Permisos de Gmail

**La primera vez que se ejecute:**

1. Te pedirá autorización
2. Haz clic en **"Review Permissions"**
3. Selecciona tu cuenta de Google
4. Verás: **"Google hasn't verified this app"**
5. Haz clic en **"Advanced"**
6. Haz clic en **"Go to [nombre proyecto] (unsafe)"**
7. Marca: **"Allow"** para enviar emails

**⚠️ SOLO debes hacer esto UNA VEZ**

### PASO 8: Probar el Sistema

#### Prueba A: Email de Actividad Sospechosa

1. Abre tu sitio en incógnito
2. Intenta verificar un email NO registrado 11 veces seguidas
3. **Deberías recibir un email** con asunto: "🚨 ALERTA: Actividad Sospechosa Detectada"

#### Prueba B: Email de Nueva Compra

1. En Google Sheets, agrega manualmente un comprador usando la URL:
```
TU-URL-BACKEND?action=addPurchaser&email=test@test.com&course=derecho-no-abogados&amount=500&transactionId=TEST123
```

2. **Deberías recibir 2 emails:**
   - A tu email admin: "🎉 Nueva Compra"
   - A test@test.com: "✅ Bienvenido al curso"

---

## 📊 Google Sheets: Nueva Pestaña "Alertas"

El sistema crea automáticamente una nueva pestaña llamada **"Alertas"** con:

| Timestamp | Tipo | Email | Curso | Detalles | Estado |
|-----------|------|-------|-------|----------|---------|
| 2025-11-13 10:30 | SUSPICIOUS_ACTIVITY | test@test.com | derecho | 15 intentos en 5 min | Pendiente |

**Columnas:**
- **Timestamp:** Cuándo ocurrió
- **Tipo:** SUSPICIOUS_ACTIVITY, NEW_PURCHASE, etc.
- **Email:** Usuario involucrado
- **Detalles:** Info adicional
- **Estado:** Pendiente / Revisado / Resuelto

**Puedes marcar alertas como "Revisado" manualmente.**

---

## 🚨 Ejemplos de Emails que Recibirás

### Email 1: Actividad Sospechosa

```
Asunto: 🚨 ALERTA: Actividad Sospechosa Detectada - usuario@ejemplo.com
───────────────────────────────────────────

⚠️ ALERTA DE SEGURIDAD - Empírica Legal Lab

🚨 Actividad Sospechosa Detectada

📧 Email: usuario@ejemplo.com
📚 Curso: derecho-no-abogados
🔢 Intentos: 15 accesos
⏱️ Periodo: Últimos 5 minutos
🕐 Timestamp: 13/11/2025, 10:30:45

───────────────────────────────────────────

⚠️ POSIBLES CAUSAS:

1. Ataque de fuerza bruta
2. Usuario compartiendo credenciales
3. Bot automatizado
4. Usuario legítimo con problemas técnicos

🔍 ACCIONES RECOMENDADAS:

1. Revisar logs en Google Sheets → pestaña "Logs"
2. Filtrar por email: usuario@ejemplo.com
3. Verificar User Agent
4. Si es abuso, bloquear cambiando estado a "bloqueado"
```

### Email 2: Nueva Compra

```
Asunto: 🎉 Nueva Compra: Derecho para No Abogados - $500 MXN
───────────────────────────────────────────

🎉 NUEVA COMPRA - Empírica Legal Lab

¡Felicidades! Tienes una nueva compra

📧 Email: comprador@ejemplo.com
📚 Curso: Derecho para No Abogados
💰 Monto: $500 MXN
🆔 ID Transacción: pi_3ABC123
🕐 Fecha: 13/11/2025, 11:45:30

✅ Estado: El usuario YA tiene acceso automático al curso
```

---

## 🛡️ PARTE 2: Solución - Modal Desaparecido

### ¿Por qué desapareció el modal?

**Posibles causas:**
1. Cache del navegador
2. GitHub Pages no actualizó
3. localStorage tiene acceso guardado
4. Error en el JavaScript

---

### SOLUCIÓN RÁPIDA (5 minutos)

#### Paso 1: Limpiar Cache

**En el navegador (modo incógnito):**

1. Presiona **F12**
2. En la consola, ejecuta:
```javascript
localStorage.clear();
location.reload(true);
```

#### Paso 2: Esperar GitHub Pages

GitHub Pages tarda **5-10 minutos** en actualizar después de un push.

**Espera 10 minutos** y vuelve a probar.

#### Paso 3: Verificar que el Script Cargó

1. Abre tu sitio
2. Presiona **F12** → **Console**
3. Busca el mensaje:
```
🔐 Iniciando sistema de control de acceso...
```

**¿No lo ves?** El script no cargó. Ve al Paso 4.

#### Paso 4: Forzar Recarga del Script

**En ambos archivos HTML, cambia:**

`cursos/derecho-no-abogados/index.html` **línea 1004:**
`cursos/legal-english/index.html` **línea 910:**

**De:**
```html
<script src="../../js/payment-access-control.js?v=2"></script>
```

**A:**
```html
<script src="../../js/payment-access-control.js?v=3"></script>
```

**Commit y push:**
```bash
git add cursos/*/index.html
git commit -m "Forzar recarga de script de acceso"
git push
```

**Espera 10 minutos** y prueba de nuevo.

---

### VERIFICACIÓN COMPLETA (Si lo anterior no funciona)

#### Test 1: ¿El script existe?

Abre en el navegador:
```
https://TU-SITIO.github.io/js/payment-access-control.js
```

¿Ves código JavaScript? ✅ SÍ → Script existe

#### Test 2: ¿El backend responde?

Abre:
```
TU-URL-BACKEND?action=stats
```

¿Ves JSON con estadísticas? ✅ SÍ → Backend funciona

#### Test 3: ¿Hay errores JavaScript?

1. Abre sitio
2. F12 → Console
3. ¿Ves errores en rojo?

**Si ves errores, cópiame exactamente qué dice y te ayudo.**

---

### DIAGNÓSTICO AVANZADO

Si ninguna solución anterior funciona, ejecuta esto en la consola:

```javascript
// 1. Verificar si el script cargó
console.log('Script cargado:', typeof window.empiricaAccessControl !== 'undefined');

// 2. Verificar localStorage
Object.keys(localStorage).filter(k => k.startsWith('empirica_')).forEach(k => {
  console.log(k + ':', localStorage.getItem(k));
});

// 3. Forzar mostrar modal (si existe)
if (typeof showPaymentModal === 'function') {
  showPaymentModal();
} else {
  console.log('❌ Función showPaymentModal no existe');
}
```

**Copia y pega el resultado** y te diré exactamente qué falla.

---

## 📋 Checklist de Implementación

### Alertas Automáticas:
- [ ] Código del backend reemplazado
- [ ] Email configurado (línea 13)
- [ ] Alertas activadas: `enabledAlerts: true`
- [ ] Backend re-desplegado (nueva versión)
- [ ] Permisos de Gmail autorizados
- [ ] Email de prueba recibido

### Modal de Pago:
- [ ] Cache limpiado con `localStorage.clear()`
- [ ] Esperé 10 minutos después del último push
- [ ] Probé en modo incógnito
- [ ] Veo mensaje "🔐 Iniciando..." en consola
- [ ] No hay errores JavaScript en consola
- [ ] Modal aparece cuando intento ver un video

---

## 🆘 Soporte Rápido

### Problema: "No recibo emails de alertas"

**Checklist:**
1. ¿`enabledAlerts: true`? (línea 14)
2. ¿Email correcto en línea 13?
3. ¿Re-desplegaste después de cambios?
4. ¿Autorizaste permisos de Gmail?
5. ¿Revisa spam/correo no deseado?

### Problema: "Modal no aparece en ningún curso"

**Solución temporal - Acceso manual:**

En la consola del navegador:
```javascript
// Dar acceso manual temporal
localStorage.setItem('empirica_user_email', 'tu-email@ejemplo.com');
localStorage.setItem('empirica_has_access_derecho-no-abogados', 'true');
localStorage.setItem('empirica_has_access_legal-english', 'true');
location.reload();
```

Esto te da acceso TEMPORAL para verificar que el curso funciona.

**Luego diagnosticamos por qué el modal no aparece.**

---

## 🎯 Próximos Pasos

Una vez que todo funcione:

1. **Prueba el sistema completo** con un amigo/familiar
2. **Configura Stripe Payment Links** con `{CUSTOMER_EMAIL}`
3. **Implementa webhooks de Stripe** (automatización 100%)
4. **Monitorea alertas** los primeros días

---

¿Listo? Implementa el backend con alertas automáticas y soluciona el modal 🚀
