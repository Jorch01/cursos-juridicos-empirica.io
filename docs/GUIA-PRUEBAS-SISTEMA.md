# 🧪 Guía de Pruebas del Sistema de Acceso
**Empírica Legal Lab - Sistema de Verificación y Pagos**

---

## 📋 Resumen del Sistema

Tu sistema ahora tiene **2 formas de acceso** a los cursos:

1. **💳 Pago automático en Stripe** → Email se guarda automáticamente
2. **📧 Verificación manual** → Buscas el email en Google Sheets

Ambos métodos verifican contra el mismo Google Sheets.

---

## ✅ PRUEBA 1: Verificar Backend (1 minuto)

### Paso 1: Probar que el backend responde

**Abre esta URL en tu navegador:**
```
https://script.google.com/macros/s/AKfycbxmXDIMyWJgOWZKTlZ4s8muOXNNPsHxZgGzzJxdIHcDnXLrOn287-eK25uebI0BmLvt/exec?action=stats
```

### ✅ Resultado Esperado:
```json
{
  "success": true,
  "stats": {
    "totalPurchasers": 0,
    "activePurchasers": 0,
    "courses": {
      "derecho-no-abogados": 0,
      "legal-english": 0
    }
  }
}
```

### ❌ Si ves error:
- **Error 404/403**: La URL del backend es incorrecta o no está desplegada
- **Error "Script has been disabled"**: Necesitas volver a desplegar el Apps Script
- **Mensaje de Google login**: El script no está configurado como "Anyone" en los permisos

---

## ✅ PRUEBA 2: Acceso Manual por Email (5 minutos)

Esta prueba simula que das acceso gratis a alguien o que alguien pagó fuera de Stripe.

### Paso 1: Agregar email de prueba al Google Sheet

1. Abre tu Google Sheet: **"Compradores Empírica Legal Lab"**
2. Ve a la pestaña **"Compradores"**
3. Agrega una nueva fila:

| A - Email | B - Curso | C - Fecha | D - Monto | E - ID Transacción | F - Estado |
|-----------|-----------|-----------|-----------|-------------------|------------|
| prueba@test.com | derecho-no-abogados | 2025-11-11 | 0 | TEST-MANUAL | activo |

**⚠️ CRÍTICO:**
- Columna B (Curso): Debe ser **exactamente** `derecho-no-abogados` o `legal-english`
- Columna F (Estado): Debe ser `activo` (minúsculas)

### Paso 2: Abrir el sitio en modo incógnito

**¿Por qué incógnito?** Para que no use cache del navegador.

Abre:
- `https://tu-sitio.com/cursos/derecho-no-abogados/`
- O la URL local si estás en desarrollo

### Paso 3: Intentar acceder a un video

1. Haz clic en cualquier video del curso
2. **Debería aparecer** un modal con 2 tabs:
   - **💳 Inscribirme**
   - **📧 Verificar Acceso**

### Paso 4: Verificar el email

1. Haz clic en el tab **"📧 Verificar Acceso"**
2. Ingresa: `prueba@test.com`
3. Haz clic en **"Verificar Acceso"**

### ✅ Resultado Esperado:

1. **Mensaje verde**: "✓ Acceso verificado correctamente!"
2. La página **recarga automáticamente**
3. El modal **YA NO aparece**
4. Puedes ver **todos los videos** sin restricción

### Paso 5: Verificar persistencia

1. Recarga la página (F5) varias veces
2. El modal **NO** debe aparecer
3. Los videos deben estar accesibles

### Paso 6: Probar cambio de curso

1. Ve al otro curso: `cursos/legal-english/`
2. Intenta ver un video
3. **Debería aparecer el modal** (porque no tienes acceso a este curso)
4. Si verificas con `prueba@test.com`, dirá "Email no encontrado" (correcto)

---

## ✅ PRUEBA 3: Borrar Acceso (2 minutos)

Para probar que puedes revocar acceso:

### Paso 1: Cambiar estado en Google Sheet

1. En el Sheet, encuentra la fila de `prueba@test.com`
2. Cambia columna F de `activo` → `inactivo`

### Paso 2: Limpiar cache del navegador

En la consola del navegador (F12), ejecuta:
```javascript
localStorage.clear()
```

### Paso 3: Recargar la página

El modal **debe aparecer de nuevo** porque el acceso fue revocado.

---

## ✅ PRUEBA 4: Acceso de Administrador (1 minuto)

Prueba tu acceso maestro como administrador:

### En la consola del navegador (F12):

```javascript
empiricaAdmin('empirica2025')
```

### ✅ Resultado Esperado:
```
✓ Acceso maestro concedido
```

Ahora puedes acceder a **todos los cursos** sin restricción.

### Para revocar el acceso maestro:
```javascript
localStorage.removeItem('empirica_admin_access')
location.reload()
```

---

## ✅ PRUEBA 5: Flujo de Pago con Stripe (Modo Test)

⚠️ **Esta prueba requiere configurar Stripe primero** (ver siguiente sección).

### Configuración Previa: Stripe Payment Links

Antes de esta prueba, debes configurar tus Payment Links en Stripe:

1. Ve a Stripe Dashboard → Payment Links
2. Edita cada Payment Link
3. En **"After payment"** → **"Redirect to a page"**
4. Configura la URL de redirección:

**Para Derecho:**
```
https://tu-sitio.com/gracias.html?curso=derecho-no-abogados&email={CUSTOMER_EMAIL}
```

**Para Legal English:**
```
https://tu-sitio.com/gracias.html?curso=legal-english&email={CUSTOMER_EMAIL}
```

⚠️ **IMPORTANTE**: El parámetro `{CUSTOMER_EMAIL}` (con llaves) es un placeholder de Stripe que se reemplaza automáticamente con el email del comprador.

### Paso 1: Activar modo test en Stripe

1. Ve a Stripe Dashboard
2. Activa el **"Test mode"** (switch en la esquina superior derecha)
3. Copia tu Payment Link de test

### Paso 2: Hacer una compra de prueba

1. Abre el Payment Link en incógnito
2. Usa tarjeta de prueba de Stripe:
   - **Número**: `4242 4242 4242 4242`
   - **Fecha**: Cualquier fecha futura
   - **CVC**: Cualquier 3 dígitos
   - **Email**: `comprador@test.com`

3. Completa el pago

### Paso 3: Verificar redirección

Deberías ser redirigido a:
```
https://tu-sitio.com/gracias.html?curso=derecho-no-abogados&email=comprador@test.com
```

### Paso 4: Verificar que el email se guardó

Abre la consola del navegador (F12) en la página de gracias.

Deberías ver:
```
✅ Email guardado automáticamente: comprador@test.com
✅ Acceso concedido para: derecho-no-abogados
```

### Paso 5: Verificar acceso automático

1. Ve al curso: `cursos/derecho-no-abogados/`
2. El modal **NO** debe aparecer
3. Debes tener acceso completo

### Paso 6: Verificar en Google Sheets

⚠️ **NOTA**: El sistema actual NO registra automáticamente en Google Sheets.

Debes elegir una opción:

**Opción A: Registro manual**
- Tú agregas manualmente los compradores al Sheet después de cada venta
- Stripe te envía notificaciones por email de cada venta

**Opción B: Automatización con Zapier/Make** (avanzado)
- Configuras un webhook de Stripe
- Automáticamente agrega compradores al Sheet
- Requiere configuración adicional (no incluida en esta guía)

---

## 🔍 Diagnóstico de Problemas Comunes

### Problema: "Email no encontrado"

**Causas posibles:**

1. **El email no está en el Sheet**
   - Solución: Verifica que agregaste la fila correctamente

2. **El nombre del curso no coincide**
   - El Sheet tiene: `Derecho-no-abogados`
   - El sistema busca: `derecho-no-abogados`
   - Solución: Usa minúsculas y guiones exactos

3. **El estado no es "activo"**
   - El Sheet tiene: `Activo` o `ACTIVO`
   - El sistema busca: `activo`
   - Solución: Pon exactamente `activo` en minúsculas

4. **Hay espacios extras**
   - El email tiene espacios: ` prueba@test.com `
   - Solución: Elimina espacios antes y después del email

### Problema: "Error de conexión al servidor"

**Causas posibles:**

1. **La URL del backend es incorrecta**
   - Abre: `js/payment-access-control.js`
   - Línea 16: Verifica que la URL sea la correcta
   - Prueba la URL directamente en el navegador

2. **El Apps Script no está desplegado como "Web App"**
   - Abre el Apps Script
   - Deploy → Manage Deployments
   - Verifica que esté activo

3. **Los permisos no están configurados**
   - En el Apps Script
   - Deploy → Who has access: **Anyone**
   - Si dice "Only myself", cámbialo

4. **CORS bloqueado**
   - Abre la consola (F12) → Network
   - ¿Ves un error de CORS?
   - Verifica que el Apps Script tenga el header CORS correcto

### Problema: El modal no aparece

**Causas posibles:**

1. **Ya tienes acceso guardado**
   - Solución: `localStorage.clear()` y recarga

2. **Estás en una página sin protección**
   - El modal solo aparece en páginas de cursos
   - No aparece en: `index.html`, `gracias.html`

3. **Error de JavaScript**
   - Abre la consola (F12)
   - ¿Ves algún error rojo?
   - Compártelo para diagnóstico

### Problema: El modal aparece pero está vacío

**Causas posibles:**

1. **Stripe Payment Links no configurados**
   - Abre: `js/payment-access-control.js`
   - Líneas 19-22: Verifica que tengas tus URLs de Stripe

2. **JavaScript no cargó completamente**
   - Recarga la página (Ctrl+Shift+R)
   - Verifica la consola por errores

---

## 📊 Checklist de Verificación Final

Antes de poner el sistema en producción, verifica:

### Backend
- [ ] Google Sheet creado y configurado
- [ ] Apps Script desplegado como Web App
- [ ] Permisos configurados: "Anyone"
- [ ] URL del backend probada con `?action=stats`
- [ ] URL del backend configurada en `js/payment-access-control.js` línea 16

### Frontend
- [ ] Modal aparece correctamente en páginas de cursos
- [ ] Modal NO aparece en `index.html` ni `gracias.html`
- [ ] Tab "Inscribirme" redirige a Stripe
- [ ] Tab "Verificar Acceso" verifica contra Google Sheets
- [ ] Acceso persiste después de recargar la página

### Stripe
- [ ] Payment Links configurados
- [ ] URLs de redirect configuran con `{CUSTOMER_EMAIL}`
- [ ] Links probados en modo test
- [ ] Página `gracias.html` guarda email automáticamente

### Seguridad
- [ ] Código maestro de admin funciona: `empiricaAdmin('empirica2025')`
- [ ] Puedes revocar acceso cambiando estado en Google Sheet
- [ ] No hay información sensible en el código frontend

### Experiencia de Usuario
- [ ] Comprador puede acceder inmediatamente después de pagar
- [ ] Acceso funciona en modo incógnito (sin cache)
- [ ] Mensajes de error son claros
- [ ] No hay formularios de registro bloqueando el acceso

---

## 🚀 Siguientes Pasos

Una vez que todas las pruebas pasen:

1. **Modo Producción en Stripe**
   - Cambia de Test Mode a Live Mode
   - Actualiza los Payment Links con las URLs reales

2. **Monitoreo**
   - Revisa el Google Sheet periódicamente
   - Agrega manualmente compradores de Stripe al Sheet
   - Considera automatización con Zapier/Make

3. **Soporte a Compradores**
   - Si un comprador reporta problemas de acceso:
     1. Verifica que su email esté en el Sheet
     2. Verifica que el curso y estado sean correctos
     3. Pídele que use "Verificar Acceso" en el modal
     4. Como último recurso, da acceso maestro temporal

---

## 📞 Comandos Rápidos para Soporte

### Dar acceso temporal a un comprador con problemas

1. Dile que abra la consola del navegador (F12)
2. Dile que ejecute:
```javascript
localStorage.setItem('empirica_user_email', 'su-email@ejemplo.com');
localStorage.setItem('empirica_has_access_derecho-no-abogados', 'true');
location.reload();
```

3. Mientras tanto, verifica su pago en Stripe y agrega su email al Sheet

### Revisar qué tiene guardado un usuario

Pídele que ejecute en consola:
```javascript
Object.keys(localStorage).filter(k => k.startsWith('empirica_')).forEach(k => {
  console.log(k + ': ' + localStorage.getItem(k));
});
```

### Limpiar todo el acceso

```javascript
Object.keys(localStorage).filter(k => k.startsWith('empirica_')).forEach(k => {
  localStorage.removeItem(k);
});
location.reload();
```

---

**¿Problemas no cubiertos en esta guía?**

Revisa el archivo `docs/DIAGNOSTICO-Y-SOLUCION.md` para diagnóstico avanzado.
