# 🚀 Guía Rápida: Crear Google Sheet de Compradores

## ⏱️ Tiempo estimado: 10 minutos

---

## 📝 Paso 1: Crear el Google Sheet

1. Ve a https://sheets.google.com
2. Click en **"+ Blank"** para crear una hoja nueva
3. Nómbrala: **"Compradores Empírica Legal Lab"**
4. **Copia el ID del Sheet** de la URL:
   ```
   https://docs.google.com/spreadsheets/d/[ESTE_ES_EL_ID]/edit
   ```
   Ejemplo: Si la URL es:
   ```
   https://docs.google.com/spreadsheets/d/1abc123XYZ/edit
   ```
   El ID es: `1abc123XYZ`

---

## ⚙️ Paso 2: Configurar Apps Script

1. En el Google Sheet que acabas de crear, ve a:
   **Extensiones > Apps Script**

2. Se abrirá una nueva pestaña con el editor de Apps Script

3. **Borra** el código que aparece por defecto (debería decir `function myFunction() {}`)

4. **Copia** TODO el código del archivo:
   ```
   docs/CODE-COMPRADORES-APPS-SCRIPT.js
   ```

5. **Pega** el código en el editor de Apps Script

6. **Guarda** el proyecto:
   - Click en el icono de disquete 💾
   - O presiona `Ctrl+S` (Windows) / `Cmd+S` (Mac)
   - Nómbralo: **"Backend Compradores"**

---

## 🎯 Paso 3: Ejecutar la Configuración Inicial

1. En el editor de Apps Script, busca el dropdown que dice **"myFunction"** o similar

2. Selecciona la función: **`setupSheet`**

3. Click en el botón **"Ejecutar"** ▶️ (Run)

4. **Primera vez - Permisos:**
   - Te aparecerá: "Authorization required"
   - Click en **"Review permissions"**
   - Selecciona tu cuenta de Google
   - Click en **"Advanced"** (Avanzado)
   - Click en **"Go to Backend Compradores (unsafe)"**
   - Click en **"Allow"** (Permitir)

5. Espera unos segundos

6. Deberías ver una alerta que dice:
   ```
   ✅ Configuración Completada
   Las hojas "Compradores" y "Logs" han sido creadas.
   ```

7. Click en **"OK"**

8. **Verifica:** Vuelve a la pestaña del Google Sheet y deberías ver:
   - Pestaña **"Compradores"** con columnas: Email, Curso, Fecha Pago, Monto, ID Transacción, Estado
   - Pestaña **"Logs"** con columnas: Timestamp, Acción, Email, Curso, Resultado, Detalles
   - Menú nuevo: **"🎓 Empírica Legal Lab"**

---

## 🌐 Paso 4: Desplegar como Aplicación Web

1. Vuelve a la pestaña de **Apps Script**

2. Click en el botón **"Implementar"** (Deploy) en la esquina superior derecha

3. Selecciona: **"Nueva implementación"** (New deployment)

4. Click en el icono de **engranaje ⚙️** junto a "Select type"

5. Selecciona: **"Aplicación web"** (Web app)

6. **Configuración:**
   - **Description:** `v1.0 - Sistema de acceso`
   - **Execute as:** `Me` (Yo)
   - **Who has access:** `Anyone` (Cualquiera)

7. Click en **"Implementar"** (Deploy)

8. **Importante:** Aparecerá un diálogo con la **URL de la aplicación web**

9. **COPIA ESTA URL COMPLETA** (algo como):
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```

10. **Guarda esta URL en un lugar seguro** (la necesitarás en el siguiente paso)

---

## 🔗 Paso 5: Actualizar el Código del Sitio Web

Ahora debes actualizar la URL en tu sitio web para que apunte a este nuevo backend.

1. Abre el archivo:
   ```
   js/payment-access-control.js
   ```

2. Busca la línea 16 que dice:
   ```javascript
   GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbw1sBsOVp6lnpyvc9IvLk4xgpjEZus0IOmLOrcDgep7aI-xYcOMgtXrofkseaeS4x8mZw/exec',
   ```

3. **Reemplaza** la URL con la que copiaste en el Paso 4

4. **Guarda** el archivo

---

## 👤 Paso 6: Agregar tu Primer Usuario

Ahora vamos a agregar un usuario de prueba para verificar que todo funciona.

### **Opción A: Usar el Menú (Más Fácil)**

1. Ve al Google Sheet "Compradores Empírica Legal Lab"

2. En el menú superior, click en **"🎓 Empírica Legal Lab"**

3. Selecciona: **"➕ Agregar Usuario"**

4. Ingresa tu email (ej: `tu@email.com`)

5. Click **"OK"**

6. Ingresa el curso: `legal-english`

7. Click **"OK"**

8. Deberías ver una confirmación: ✅ Usuario Agregado

### **Opción B: Agregar Manualmente**

1. Ve a la hoja **"Compradores"**

2. En la fila 2 (primera fila después del encabezado), ingresa:
   - **A2 (Email):** tu@email.com
   - **B2 (Curso):** legal-english
   - **C2 (Fecha Pago):** (hoy, ej: 12/3/2025)
   - **D2 (Monto):** $5,000
   - **E2 (ID Transacción):** TEST-001
   - **F2 (Estado):** activo

---

## 🧪 Paso 7: Probar el Sistema

1. Abre tu sitio web en **modo incógnito**:
   - Chrome: `Ctrl+Shift+N` (Windows) / `Cmd+Shift+N` (Mac)
   - Firefox: `Ctrl+Shift+P` (Windows) / `Cmd+Shift+P` (Mac)

2. Ve a la página del curso Legal English:
   ```
   cursos/legal-english/modulos/index.html
   ```

3. Deberías ver un **modal pidiendo tu email**

4. **Ingresa el mismo email** que agregaste en el Paso 6

5. Click en **"Continuar"** o presiona Enter

6. **Si todo está bien:**
   - ✅ El modal desaparecerá
   - ✅ Verás el contenido del curso
   - ✅ En la hoja "Logs" del Google Sheet aparecerá una nueva entrada

7. **Si algo salió mal:**
   - Abre la consola del navegador (F12)
   - Ve a la pestaña "Console"
   - Busca errores en rojo
   - Copia el error y pídeme ayuda

---

## 📊 Verificar que Todo Funciona

### **Verificación 1: Hojas Creadas**
- [ ] Google Sheet tiene la hoja "Compradores"
- [ ] Google Sheet tiene la hoja "Logs"
- [ ] Hay al menos un usuario en "Compradores"

### **Verificación 2: Apps Script Desplegado**
- [ ] Apps Script está guardado
- [ ] Función `setupSheet()` se ejecutó correctamente
- [ ] Implementación web está creada y tienes la URL

### **Verificación 3: Código Actualizado**
- [ ] `payment-access-control.js` tiene la nueva URL
- [ ] El archivo está guardado

### **Verificación 4: Acceso Funciona**
- [ ] Modal aparece al entrar al curso
- [ ] Puedo ingresar mi email
- [ ] Se verifica el acceso correctamente
- [ ] Aparece un log en la hoja "Logs"

---

## 🎓 Uso Diario

### **Agregar Nuevos Compradores**

Cuando alguien compre el curso, agrégalo así:

1. Ve a la hoja **"Compradores"**

2. Agrega una nueva fila con:
   - Email del comprador
   - Curso que compró
   - Fecha del pago
   - Monto pagado
   - ID de transacción de Stripe
   - Estado: `activo`

O usa el menú: **🎓 Empírica Legal Lab > ➕ Agregar Usuario**

### **Ver Estadísticas**

1. En el Google Sheet, click en: **🎓 Empírica Legal Lab > 📊 Ver Estadísticas**

2. Verás un resumen de:
   - Total de usuarios
   - Usuarios por curso
   - Usuarios activos vs inactivos

### **Revisar Logs de Acceso**

1. Ve a la hoja **"Logs"**

2. Allí verás todas las verificaciones de acceso:
   - Timestamp: Cuándo intentó acceder
   - Email: Quién intentó acceder
   - Curso: A qué curso
   - Resultado: Si se le concedió acceso o no

---

## ❓ Preguntas Frecuentes

### **¿Qué pasa si alguien intenta acceder sin pagar?**

El sistema verificará su email en la hoja "Compradores". Si no está, le mostrará el modal de pago.

### **¿Puedo dar acceso temporal?**

Sí, cambia el estado a `inactivo` cuando quieras revocar el acceso.

### **¿Cómo sé si alguien está usando el curso?**

Revisa la hoja "Logs". Cada vez que alguien accede, se registra.

### **¿Qué pasa si borro un usuario de la hoja?**

Perderá el acceso inmediatamente (después de 24 horas por el cache).

### **¿Puedo tener múltiples cursos?**

Sí, solo asegúrate de usar los nombres correctos:
- `legal-english`
- `derecho-no-abogados`

---

## 🆘 Solución de Problemas

### **Error: "Authorization required" no se va**

1. Ve a Apps Script
2. Click en el ícono de engranaje ⚙️ (Project Settings)
3. Scroll down hasta "Google Cloud Platform (GCP) Project"
4. Click en el link del proyecto
5. En GCP, ve a "APIs & Services" > "OAuth consent screen"
6. Configura la pantalla de consentimiento

### **Error: "The script completed but did not return anything"**

Esto es normal en `setupSheet()`. Verifica que las hojas se hayan creado.

### **Error: "Exception: You do not have permission to call..."**

Ejecuta nuevamente la función y acepta los permisos cuando te los pida.

### **El modal no aparece en el sitio**

1. Verifica que la URL en `payment-access-control.js` sea correcta
2. Abre la consola (F12) y busca errores
3. Verifica que el archivo esté guardado y desplegado

---

## ✅ ¡Listo!

Ahora tienes un sistema completo de control de acceso basado en Google Sheets.

**Siguiente paso:** Integrar con Stripe para pagos automáticos (opcional).

---

## 📞 Soporte

Si tienes problemas, revisa:
- La consola del navegador (F12)
- La hoja "Logs" en Google Sheets
- Los logs de Apps Script (View > Logs)
