# 📊 Guía de Instalación - Sistema de Respuestas de Estudiantes

Esta guía te llevará paso a paso para configurar el sistema completo de almacenamiento y análisis de respuestas de ejercicios para los módulos 1-15.

---

## 📋 Tabla de Contenidos

1. [Crear Google Sheet](#1-crear-google-sheet)
2. [Configurar Apps Script](#2-configurar-apps-script)
3. [Ejecutar Setup Inicial](#3-ejecutar-setup-inicial)
4. [Desplegar como Web App](#4-desplegar-como-web-app)
5. [Conectar Frontend](#5-conectar-frontend)
6. [Verificar Funcionamiento](#6-verificar-funcionamiento)
7. [Mantenimiento](#7-mantenimiento)

---

## 1. Crear Google Sheet

### Paso 1.1: Crear Hoja Nueva
1. Ve a [Google Sheets](https://sheets.google.com)
2. Clic en **"Blank"** para crear una hoja nueva
3. Nombra la hoja: **"Legal English - Respuestas de Estudiantes"**

### Paso 1.2: Verificar Permisos
- Asegúrate de estar usando la cuenta de Google que administrará el curso
- Esta cuenta recibirá todas las respuestas de estudiantes

---

## 2. Configurar Apps Script

### Paso 2.1: Abrir Editor de Scripts
1. En tu Google Sheet, ve al menú superior
2. Clic en **Extensiones > Apps Script**
3. Se abrirá una nueva pestaña con el editor de código

### Paso 2.2: Reemplazar Código
1. Verás un archivo llamado `Code.gs` con código de ejemplo
2. **Selecciona TODO el código** (Ctrl+A / Cmd+A)
3. **Borra** el código de ejemplo
4. **Copia TODO el contenido** del archivo `google-apps-script-student-answers.js`
5. **Pega** el código en el editor

### Paso 2.3: Guardar Proyecto
1. Clic en el ícono de **disco** (Save) o Ctrl+S
2. Nombra el proyecto: **"Sistema Respuestas Legal English"**
3. Espera a que guarde (verás confirmación arriba)

---

## 3. Ejecutar Setup Inicial

### Paso 3.1: Seleccionar Función
1. En la parte superior del editor, encuentra el dropdown que dice "Select function"
2. Despliega el dropdown y selecciona **`setupSheet`**

### Paso 3.2: Autorizar Permisos (Primera Vez)
1. Clic en el botón **Run** (▶️ Play)
2. Aparecerá un popup: **"Authorization required"**
3. Clic en **"Review Permissions"**
4. Selecciona tu cuenta de Google
5. Verás advertencia: **"Google hasn't verified this app"**
   - Esto es normal porque es tu propio script
6. Clic en **"Advanced"** (abajo a la izquierda)
7. Clic en **"Go to Sistema Respuestas Legal English (unsafe)"**
8. Clic en **"Allow"**

### Paso 3.3: Verificar Creación de Hojas
1. Vuelve a la pestaña de tu Google Sheet
2. Deberías ver 4 hojas creadas en la parte inferior:
   - ✅ **Respuestas** - Almacena todas las respuestas de ejercicios
   - ✅ **Progreso** - Seguimiento por estudiante/módulo
   - ✅ **Analytics** - Estadísticas agregadas de ejercicios
   - ✅ **Sheet1** (la original, puedes borrarla)
3. Aparecerá un popup: **"✅ Configuración Completada"**

---

## 4. Desplegar como Web App

### Paso 4.1: Crear Deployment
1. Vuelve a la pestaña de Apps Script
2. En la parte superior derecha, clic en **"Deploy"** (botón azul)
3. Selecciona **"New deployment"**

### Paso 4.2: Configurar Deployment
1. Clic en el ícono de **⚙️ engranaje** junto a "Select type"
2. Selecciona **"Web app"**
3. Configura los siguientes campos:

   **Description:** `Sistema de Respuestas - v1.0`

   **Execute as:** `Me (tu-email@gmail.com)`

   **Who has access:** `Anyone` ⚠️ IMPORTANTE

4. Clic en **"Deploy"**

### Paso 4.3: Autorizar (Nueva Autorización)
1. Nuevamente aparecerá **"Authorization required"**
2. Repite el proceso de autorización del Paso 3.2
3. Clic en **"Authorize access"**

### Paso 4.4: Copiar URL del Web App
1. Aparecerá un popup con tu deployment exitoso
2. **COPIA la URL** que dice "Web app"
   - Se ve como: `https://script.google.com/macros/s/AKfycby.../exec`
3. ⚠️ **GUARDA ESTA URL** - la necesitarás para el frontend
4. Clic en **"Done"**

---

## 5. Conectar Frontend

### Paso 5.1: Ubicar Función sendToBackend

En cada módulo (módulo 1 al 15), busca la función `sendToBackend` en el código HTML.

**Ejemplo en módulo-2:**
```javascript
function sendToBackend(payload) {
    const BACKEND_URL = 'TU_URL_DEL_WEB_APP_AQUI'; // ⬅️ REEMPLAZAR ESTA LÍNEA

    fetch(BACKEND_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(() => {
        console.log('✅ Datos enviados al backend:', payload);
    })
    .catch(error => {
        console.error('❌ Error al enviar datos:', error);
    });
}
```

### Paso 5.2: Reemplazar URL

**ANTES:**
```javascript
const BACKEND_URL = 'TU_URL_DEL_WEB_APP_AQUI';
```

**DESPUÉS:**
```javascript
const BACKEND_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
```
*(Usa la URL que copiaste en el Paso 4.4)*

### Paso 5.3: Aplicar a TODOS los Módulos

Repite el Paso 5.2 en **todos los archivos de módulos**:
- `cursos/legal-english/modulos/modulo-1/index.html`
- `cursos/legal-english/modulos/modulo-2/index.html`
- `cursos/legal-english/modulos/modulo-3/index.html`
- ... hasta modulo-15

---

## 6. Verificar Funcionamiento

### Paso 6.1: Probar con un Ejercicio Real

1. Abre cualquier módulo en tu navegador (ej: módulo 2)
2. Ingresa tu email de prueba
3. Completa un ejercicio completamente
4. Clic en **"Check Answers"**
5. Abre la **Consola de Desarrollador** (F12)
6. Busca en la consola: `✅ Datos enviados al backend:`

### Paso 6.2: Verificar en Google Sheets

1. Vuelve a tu Google Sheet
2. Ve a la hoja **"Respuestas"**
3. Espera ~5-10 segundos (el script procesa en background)
4. **Refresca la página** (F5)
5. Deberías ver una nueva fila con:
   - Timestamp
   - Tu email
   - module-2
   - exercise1 (o el que completaste)
   - Puntuación (ej: "5/10")
   - Porcentaje (ej: "50")

### Paso 6.3: Verificar Hoja de Progreso

1. Ve a la hoja **"Progreso"**
2. Deberías ver:
   - Tu email
   - module-2
   - 1 ejercicio completado
   - 11 total de ejercicios
   - 9.1% completado
   - Promedio de puntuación

---

## 7. Mantenimiento

### 7.1: Limpiar Respuestas Duplicadas

Si por algún motivo hay respuestas duplicadas:

1. Ve a Apps Script
2. En "Select function", elige **`cleanDuplicateResponses`**
3. Clic en **Run** (▶️)
4. El script eliminará automáticamente duplicados (mantiene el más reciente)

### 7.2: Recalcular Progreso y Analytics

Si notas inconsistencias en los datos:

1. En "Select function", elige **`recalculateAllProgress`**
2. Clic en **Run** (▶️)
3. El script recalculará todas las hojas desde cero usando la hoja "Respuestas"

### 7.3: Generar Reporte Mensual

Para obtener estadísticas mensuales:

1. En "Select function", elige **`generateMonthlyReport`**
2. Clic en **Run** (▶️)
3. Ve a **View > Logs** (Ctrl+Enter)
4. Verás un reporte con:
   - Estudiantes activos en el último mes
   - Módulos completados
   - Total de registros

### 7.4: Actualizar el Deployment

Si haces cambios al código:

1. **Guarda** los cambios (Ctrl+S)
2. Clic en **"Deploy" > "Manage deployments"**
3. Clic en el ícono de **lápiz** (Edit) junto a tu deployment
4. En "Version", selecciona **"New version"**
5. Clic en **"Deploy"**
6. ⚠️ La URL del Web App **NO cambia**, sigue siendo la misma

---

## 📊 Estructura de Datos

### Hoja "Respuestas"

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| Timestamp | Fecha/hora de la respuesta | 2025-12-07 14:30:00 |
| Email Estudiante | Email del estudiante | estudiante@example.com |
| Módulo | Identificador del módulo | module-2 |
| Ejercicio | Identificador del ejercicio | exercise1 |
| Puntuación | Formato X/Y | 8/10 |
| Porcentaje | Porcentaje numérico | 80 |
| Intentos | Número de intentos | 1 |
| Tiempo Invertido | Minutos | 5.2 |
| Respuestas Detalladas | JSON con respuestas | {...} |

### Hoja "Progreso"

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| Email Estudiante | Email del estudiante | estudiante@example.com |
| Módulo | Módulo en progreso | module-2 |
| Ejercicios Completados | Número completados | 5 |
| Total Ejercicios | Total en el módulo | 11 |
| Porcentaje Completado | % del módulo | 45.5% |
| Promedio de Puntuación | Promedio de scores | 75.0% |
| Última Actividad | Última vez activo | 2025-12-07 14:30:00 |
| Estado | No Iniciado/En Progreso/Completado | En Progreso |

### Hoja "Analytics"

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| Módulo | Identificador del módulo | module-2 |
| Ejercicio | Identificador del ejercicio | exercise1 |
| Total Intentos | Todos los intentos | 45 |
| Promedio de Puntuación | Promedio de todos | 72.5% |
| Tasa de Aprobación | % con ≥70% | 68.9% |
| Tiempo Promedio | Promedio de minutos | 4.2 |
| Dificultad Percibida | Fácil/Media/Difícil | Media |

---

## 🔍 Consultas Avanzadas (API GET)

Puedes hacer consultas HTTP GET a tu Web App:

### Obtener Progreso de un Estudiante

```
https://script.google.com/macros/s/TU_ID/exec?action=getStudentProgress&email=estudiante@example.com
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Progreso obtenido",
  "data": {
    "email": "estudiante@example.com",
    "modules": [
      {
        "module": "module-1",
        "completedExercises": 11,
        "totalExercises": 11,
        "completionPercentage": "100%",
        "averageScore": "85.5%",
        "status": "Completado"
      }
    ]
  }
}
```

### Obtener Estadísticas de un Módulo

```
https://script.google.com/macros/s/TU_ID/exec?action=getModuleStats&module=module-2
```

### Obtener Analytics de un Ejercicio

```
https://script.google.com/macros/s/TU_ID/exec?action=getExerciseAnalytics&module=module-2&exercise=exercise1
```

### Obtener Lista de Todos los Estudiantes

```
https://script.google.com/macros/s/TU_ID/exec?action=getAllStudents
```

### Exportar Datos de un Estudiante

```
https://script.google.com/macros/s/TU_ID/exec?action=exportData&email=estudiante@example.com
```

---

## ⚠️ Solución de Problemas

### Problema: No se guardan las respuestas

**Solución:**
1. Verifica que copiaste la URL correcta del Web App
2. Verifica que el deployment tiene acceso "Anyone"
3. Abre la consola del navegador (F12) y busca errores
4. Ve a Apps Script > Executions para ver logs de errores

### Problema: Error "Authorization required" constantemente

**Solución:**
1. Ve a Apps Script > Project Settings (⚙️)
2. Marca "Show 'appsscript.json' manifest file in editor"
3. Asegúrate de haber autorizado todos los permisos

### Problema: Los porcentajes no se calculan bien

**Solución:**
1. Ejecuta la función `recalculateAllProgress`
2. Verifica que la función `getModuleExerciseCount()` tenga el número correcto de ejercicios por módulo

### Problema: Respuestas duplicadas

**Solución:**
1. Ejecuta la función `cleanDuplicateResponses`
2. Ajusta la lógica de `findExistingResponse` si es necesario

---

## 📞 Soporte

Si tienes problemas:

1. **Revisa los Logs:**
   - Apps Script > Executions
   - Consola del navegador (F12)

2. **Verifica Permisos:**
   - Apps Script > Project Settings
   - Google Sheet > Share settings

3. **Prueba con Email de Prueba:**
   - Usa un email temporal para probar
   - Verifica que aparezca en las hojas

---

## ✅ Checklist de Instalación

- [ ] Google Sheet creado con nombre correcto
- [ ] Código de Apps Script copiado y guardado
- [ ] Función `setupSheet()` ejecutada con éxito
- [ ] 3 hojas creadas: Respuestas, Progreso, Analytics
- [ ] Deployment creado como Web App
- [ ] Permisos configurados: Execute as "Me", Access "Anyone"
- [ ] URL del Web App copiada
- [ ] URL actualizada en TODOS los módulos (1-15)
- [ ] Prueba realizada con un ejercicio
- [ ] Respuesta aparece en hoja "Respuestas"
- [ ] Progreso aparece en hoja "Progreso"

---

¡Listo! Tu sistema de respuestas de estudiantes está completamente configurado y funcionando. 🎉
