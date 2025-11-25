# 🔄 Guía para Redesplegar Google Apps Script

## ❓ ¿Por qué necesito redesplegar?

Cuando actualizas el código del Apps Script, **los cambios NO se aplican automáticamente** a tu Web App. Necesitas crear una **nueva versión** y redesplegarla.

### Síntoma del problema:
- ✅ Activity_Log muestra nombre y correo correctamente
- ❌ Exercise_Responses y Module_Surveys muestran columnas incorrectas
- **Causa:** Tu Web App está ejecutando una versión vieja del código

---

## 📋 PASOS PARA REDESPLEGAR

### Paso 1: Abre tu Google Apps Script

1. Ve a tu Google Spreadsheet
2. Click en **Extensiones** → **Apps Script**
3. Verás el editor con el archivo `Code.gs`

### Paso 2: Verifica que tengas el código actualizado

Busca estas líneas en `Code.gs` (alrededor de la línea 72-78):

```javascript
const studentName = data.studentName || 'Anonymous';
const studentEmail = data.studentEmail || data.userEmail || 'not provided';

const row = [
    timestamp,           // A: Timestamp
    studentName,         // B: Student Name    ← DEBE ESTAR AQUÍ
    studentEmail,        // C: Student Email   ← DEBE ESTAR AQUÍ
    data.module,         // D: Module
    // ...
];
```

**Si NO ves `studentName` y `studentEmail`**, necesitas copiar el código actualizado:
1. Ve a tu repositorio: `/cursos/legal-english/google-apps-script/Code.gs`
2. Copia TODO el contenido
3. Pega en el editor de Apps Script
4. Click en **Guardar** (icono de disquete o Ctrl+S)

### Paso 3: Redesplegar con Nueva Versión

1. En el editor de Apps Script, click en **Implementar** (arriba a la derecha)
2. Click en **Gestionar implementaciones**
3. Verás tu implementación actual (Web app)
4. Click en el **icono de lápiz ✏️** (editar)
5. **IMPORTANTE:** En "Nueva descripción", cambia el dropdown de "Versión" a **"Nueva versión"**
   - Agrega una descripción: "Agregar columnas Student Name y Email"
6. **NO cambies** "Ejecutar como" (debe ser "Yo")
7. **NO cambies** "Quién tiene acceso" (debe ser "Cualquier usuario")
8. Click en **Implementar**
9. **Copia** la nueva URL de la Web App (debe ser la misma que antes)

### Paso 4: Actualiza la URL en tu código HTML (si es necesario)

Si tu URL cambió, actualiza en `/cursos/legal-english/modulos/modulo-1/index.html` (línea ~2293):

```javascript
const BACKEND_URL = 'https://script.google.com/macros/s/TU_SCRIPT_ID_AQUI/exec';
```

### Paso 5: Elimina las hojas viejas y recréalas

**¿Por qué?** Las hojas viejas tienen la estructura antigua sin las columnas de Student Name/Email.

1. En tu Google Spreadsheet, **elimina** estas hojas (click derecho → Eliminar):
   - `Exercise_Responses`
   - `Module_Surveys`
   - `Summary`
   - **NO elimines:** `Activity_Log` (puedes dejarla)

2. En Apps Script, ve al menú superior:
   - Click en **📚 Legal English** → **⚙️ Setup Spreadsheet**
   - Esto recreará las hojas con la estructura correcta

3. Verifica que las nuevas hojas tengan estos headers:
   - **Exercise_Responses:** `Timestamp | Student Name | Email | Module | Exercise ID | Exercise Type | User Answers (JSON) | All Correct? | Score (%)`
   - **Module_Surveys:** `Timestamp | Student Name | Email | Module | Difficulty | Quality (1-5) | Most Useful | Suggestions | Time Spent`

### Paso 6: Prueba

1. Refresca tu módulo en el navegador (Ctrl+Shift+R)
2. Llena tu información de estudiante (nombre y email)
3. Espera el ALERT de confirmación
4. Completa un ejercicio
5. Ve a tu Google Spreadsheet → pestaña **Exercise_Responses**
6. ✅ Debes ver tu nombre en la columna B y tu email en la columna C

---

## 🔍 Verificación

### En la consola del navegador (F12):
```
📤 Attempting to send data to backend...
📦 Data: {
  "studentName": "TU NOMBRE AQUI",
  "studentEmail": "tu@email.com",
  ...
}
```

### En Exercise_Responses:
| Timestamp | Student Name | Email | Module | Exercise ID | ... |
|-----------|--------------|-------|--------|-------------|-----|
| 2025-11-25 | TU NOMBRE | tu@email.com | module-1 | exercise1 | ... |

---

## ❓ Troubleshooting

### Problema: Sigo viendo "Anonymous"
**Solución:**
1. Asegúrate de llenar el formulario de Student Information ANTES de hacer ejercicios
2. Espera el popup/alert de confirmación
3. Verifica en consola que dice "VERIFICATION - Name in localStorage: TU NOMBRE"

### Problema: Las columnas no aparecen en el Sheet
**Solución:**
1. Elimina las hojas viejas (Exercise_Responses, Module_Surveys, Summary)
2. Ejecuta `setupSpreadsheet()` desde el menú "📚 Legal English"
3. Verifica los headers manualmente

### Problema: Error "Script function not found: doPost"
**Solución:**
1. Asegúrate de haber guardado el código (Ctrl+S)
2. Redespliega con "Nueva versión"
3. Espera 1-2 minutos para que se actualice

### Problema: Permission denied
**Solución:**
1. En "Implementar", verifica que "Ejecutar como" sea "Yo"
2. Verifica que "Quién tiene acceso" sea "Cualquier usuario"
3. Es posible que necesites volver a autorizar el script

---

## 🎯 Resumen Rápido

```
1. Apps Script → Verificar código tiene studentName/studentEmail
2. Implementar → Gestionar implementaciones → Editar (✏️)
3. Cambiar a "Nueva versión" → Implementar
4. Spreadsheet → Eliminar hojas viejas
5. Apps Script → Legal English → Setup Spreadsheet
6. Probar un ejercicio
7. Verificar datos en Exercise_Responses
```

---

## 📞 Si nada funciona

Envíame:
1. Screenshot de los headers en Exercise_Responses
2. Screenshot de una fila de datos en Exercise_Responses
3. Logs de la consola cuando haces un ejercicio
4. Confirmación de que ejecutaste "Nueva versión" al redesplegar
