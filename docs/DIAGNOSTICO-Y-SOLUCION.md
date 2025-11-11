# 🔧 GUÍA DE DIAGNÓSTICO Y SOLUCIÓN - Sistema de Verificación de Email

## 🚨 PROBLEMA REPORTADO
- Los botones "Verificar Acceso" y "Pagar Ahora" no funcionan
- El formulario de registro viejo sigue apareciendo

---

## ✅ SOLUCIÓN APLICADA

### 1. Formulario de Registro Eliminado
- ✅ Eliminado de index.html
- ✅ Eliminado de cursos/derecho-no-abogados/index.html
- ✅ Eliminado de cursos/legal-english/index.html
- ✅ Eliminado de cursos/derecho-no-abogados/video.html
- ✅ Estilos CSS limpiados completamente

---

## 🔍 DIAGNÓSTICO: Por qué no funcionan los botones

### El modal aparece pero los botones no responden por:

**CAUSA PRINCIPAL:** La URL del Google Apps Script backend no está configurada.

En `js/payment-access-control.js` línea 16:
```javascript
GOOGLE_SCRIPT_URL: 'TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI',  // ← ESTO DEBE CAMBIARSE
```

**Resultado:**
- El botón "Pagar Ahora" SÍ funciona (va a Stripe directamente)
- El botón "Verificar Acceso" NO funciona (necesita el backend)

---

## 🚀 SOLUCIÓN PASO A PASO

### OPCIÓN 1: Configuración Completa (Recomendada - 15 min)

#### Paso 1: Crear Google Sheet (2 min)
1. Ve a https://sheets.google.com
2. Crea hoja: "Compradores Empírica Legal Lab"
3. **Extensiones > Apps Script**
4. Pega código de `docs/setup-google-sheet.js`
5. Ejecuta `setupSheet()`
6. Copia el ID del Sheet de la URL

#### Paso 2: Configurar Backend (5 min)
1. Ve a https://script.google.com
2. Nuevo proyecto: "Empírica Backend API"
3. Pega código de `docs/google-apps-script-backend.js`
4. **Línea 23:** Pega tu Sheet ID
5. **Despliegue > Nueva implementación > Aplicación web**
6. **Ejecutar como:** Yo
7. **Quién tiene acceso:** Cualquiera
8. **Copia la URL generada**

#### Paso 3: Conectar al Sitio (1 min)
1. Edita `js/payment-access-control.js` línea 16
2. Pega la URL del Apps Script
3. Guarda y haz commit/push

#### Paso 4: Probar (2 min)
1. Agrega tu email al Google Sheet con estado "activo"
2. Abre curso en modo incógnito
3. Tab "Verificar Acceso" → Ingresa tu email
4. Debería dar acceso ✅

---

### OPCIÓN 2: Solución Temporal Rápida (2 min)

Si quieres probar el sistema AHORA sin configurar backend:

**En la consola del navegador (F12):**
```javascript
// Activar acceso de administrador
localStorage.setItem('empirica_admin_access', 'granted')
location.reload()
```

Esto te da acceso completo inmediato sin verificaciones.

---

## 🧪 PRUEBAS

### Prueba 1: Ver si el modal aparece
1. Abre cualquier curso
2. Intenta ver un video
3. ¿Aparece el modal con 2 tabs?
   - ✅ SÍ → El sistema frontend funciona
   - ❌ NO → Hay un error de JavaScript

### Prueba 2: Tab "Pagar Ahora"
1. Click en tab "💳 Inscribirme"
2. Click en botón "Pagar Ahora"
3. ¿Te lleva a Stripe?
   - ✅ SÍ → El link de Stripe funciona
   - ❌ NO → Revisa los links en líneas 20-21

### Prueba 3: Tab "Verificar Acceso"
1. Click en tab "📧 Verificar Acceso"
2. Ingresa cualquier email
3. Click en "Verificar Acceso"
4. ¿Qué pasa?
   - **"Error de conexión"** → Backend no configurado (normal)
   - **"Verificando..."** y se queda así → URL del backend incorrecta
   - **"Email no encontrado"** → Backend funciona ✅

---

## 📋 CHECKLIST DE VERIFICACIÓN

Marca lo que YA TIENES configurado:

**Frontend:**
- [ ] Formularios de registro eliminados (YA HECHO ✅)
- [ ] Modal aparece con 2 tabs
- [ ] Tab "Pagar Ahora" funciona
- [ ] Tab "Verificar Acceso" existe

**Backend:**
- [ ] Google Sheet creado
- [ ] Google Sheet configurado con `setupSheet()`
- [ ] Google Apps Script backend creado
- [ ] Sheet ID configurado en el backend
- [ ] Backend desplegado como Web App
- [ ] URL del backend copiada
- [ ] URL del backend pegada en `payment-access-control.js`

**Stripe:**
- [ ] Payment Links configurados
- [ ] URLs incluyen `{CUSTOMER_EMAIL}`
- [ ] Configurado en Test y Live mode

---

## 🆘 SOLUCIÓN RÁPIDA SI TIENES PRISA

**Opción A: Acceso Admin (30 segundos)**
```javascript
localStorage.setItem('empirica_admin_access', 'granted')
location.reload()
```

**Opción B: Simular Pago (1 minuto)**
```javascript
localStorage.setItem('empirica_user_email', 'tu-email@ejemplo.com')
localStorage.setItem('empirica_has_access_derecho-no-abogados', 'true')
localStorage.setItem('empirica_has_access_legal-english', 'true')
location.reload()
```

---

## 📞 SIGUIENTE PASO

Dime:
1. **"Ya hice commit, veo los cambios"** → Te ayudo a configurar el backend
2. **"Quiero probar con acceso admin primero"** → Te doy el comando
3. **"Tengo el Sheet ID y la URL del Apps Script"** → Los pego en el código por ti
4. **"Sigue sin funcionar"** → Te ayudo a diagnosticar el error específico

¿Qué necesitas ahora?
