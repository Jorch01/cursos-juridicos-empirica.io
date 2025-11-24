# Sistema de Registro de Respuestas y Evaluaciones

## Descripción General

El módulo 1 del curso de Legal English ahora incluye un sistema completo de registro de respuestas de ejercicios y evaluaciones del módulo. Este sistema permite rastrear el progreso y las respuestas de cada estudiante.

## Características Implementadas

### 1. Almacenamiento Local (localStorage)

Todas las respuestas se guardan automáticamente en el navegador del estudiante usando `localStorage`:

- **`module1_responses`**: Contiene todas las respuestas de ejercicios
- **`module_surveys`**: Contiene las evaluaciones del módulo
- **`empirica_user_email`**: Email del usuario (si está disponible del sistema de pago)

### 2. Datos Registrados por Ejercicio

Para cada ejercicio completado, se guarda:

```json
{
  "module": "module-1",
  "exerciseId": "exercise1",
  "exerciseType": "matching|true-false|fill-blanks|listening-checkbox",
  "userEmail": "usuario@ejemplo.com",
  "timestamp": "2025-11-24T10:30:00.000Z",
  "userAnswers": [...],  // Respuestas específicas del ejercicio
  "isCorrect": true,
  "score": 100
}
```

### 3. Datos de Encuesta del Módulo

La encuesta al final de cada módulo guarda:

```json
{
  "module": "module-1",
  "userEmail": "usuario@ejemplo.com",
  "timestamp": "2025-11-24T10:45:00.000Z",
  "difficulty": "appropriate",
  "quality": "5",
  "most_useful": "Los ejercicios de matching fueron muy útiles",
  "suggestions": "Agregar más ejemplos de casos reales",
  "time_spent": "45_60"
}
```

## Cómo Acceder a los Datos

### Opción 1: Consola del Navegador (Método Actual)

Los datos están disponibles en el navegador del estudiante. Para accederlos:

1. Abrir las herramientas de desarrollador (F12)
2. Ir a la pestaña "Console"
3. Ejecutar:

```javascript
// Ver todas las respuestas
console.log(JSON.parse(localStorage.getItem('module1_responses')));

// Ver todas las encuestas
console.log(JSON.parse(localStorage.getItem('module_surveys')));

// Exportar a JSON
exportResponses(); // Descarga un archivo JSON
```

### Opción 2: Función de Exportación

Se puede agregar un botón para que los estudiantes exporten sus respuestas:

```html
<button onclick="exportResponses()">Export My Responses</button>
```

Esto descarga un archivo JSON con todas las respuestas.

## Opciones de Backend para Recolección Centralizada

Como GitHub Pages es un hosting estático, no puede guardar datos directamente en el servidor. Tienes estas opciones:

### 🟢 Opción Recomendada: Google Sheets API

Ya tienes Google Sheets configurado para el sistema de pagos. Puedes usar el mismo sistema:

#### Paso 1: Crear Google Apps Script

1. Ir a https://script.google.com
2. Crear nuevo proyecto
3. Pegar este código:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.openById('TU_SHEET_ID').getSheetByName('Responses');
  const data = JSON.parse(e.postData.contents);

  // Agregar fila con los datos
  sheet.appendRow([
    new Date(),
    data.userEmail,
    data.module,
    data.exerciseId || 'survey',
    JSON.stringify(data.userAnswers || data.data),
    data.isCorrect,
    data.score
  ]);

  return ContentService.createTextOutput('Success');
}
```

4. Deploy > New deployment > Web app
5. Copiar la URL del script

#### Paso 2: Configurar en el código

En `modulo-1/index.html`, buscar la línea 2098 y reemplazar:

```javascript
const BACKEND_URL = 'https://script.google.com/macros/s/TU_SCRIPT_ID/exec';
```

### 🔵 Opción 2: Formspree (Más Fácil)

1. Crear cuenta en https://formspree.io (gratis)
2. Crear nuevo form
3. Usar la URL de Formspree en lugar de Google Sheets
4. Recibir respuestas por email o en el dashboard

### 🔵 Opción 3: Google Forms

Crear un Google Form oculto y enviar respuestas automáticamente.

### 🔵 Opción 4: Firebase

Para una solución más robusta:
- Firestore Database para almacenamiento
- Firebase Authentication para identificar usuarios
- Consultas en tiempo real

## Privacidad y GDPR

- Los datos se guardan localmente en el navegador del estudiante
- Solo se envían al backend si está configurado
- El email del usuario se obtiene del sistema de pagos existente
- Se incluye timestamp para auditoría

## Mejoras Futuras

1. **Dashboard de Instructor**: Crear una página para que visualices todas las respuestas
2. **Reportes por Estudiante**: Generar PDFs con el progreso individual
3. **Análisis de Datos**: Identificar ejercicios difíciles, tiempos promedio, etc.
4. **Notificaciones**: Enviar alertas cuando un estudiante completa un módulo

## Estructura de los Archivos de Respuesta

Si exportas manualmente los datos del localStorage, obtendrás archivos JSON como:

```json
[
  {
    "module": "module-1",
    "exerciseId": "exercise1",
    "exerciseType": "matching",
    "userEmail": "estudiante@ejemplo.com",
    "timestamp": "2025-11-24T10:30:00.000Z",
    "userAnswers": ["d", "g", "h", "f", "a", "c", "e", "b", "j", "i"],
    "isCorrect": true,
    "score": 100
  },
  {
    "module": "module-1",
    "exerciseId": "exercise2",
    "exerciseType": "fill-blanks",
    "userEmail": "estudiante@ejemplo.com",
    "timestamp": "2025-11-24T10:35:00.000Z",
    "userAnswers": [
      {"blank": 1, "answer": "federal", "correct": true, "expected": "federal"},
      {"blank": 2, "answer": "apeal", "correct": true, "expected": "appeal"},
      ...
    ],
    "isCorrect": false,
    "score": 85.7
  }
]
```

## Preguntas Frecuentes

**Q: ¿Los datos se pierden si el estudiante cierra el navegador?**
A: No, localStorage persiste incluso después de cerrar el navegador.

**Q: ¿Puedo ver las respuestas de todos mis estudiantes?**
A: Solo si configuras un backend (Google Sheets, Firebase, etc.). Los datos locales solo están en el navegador de cada estudiante.

**Q: ¿Cómo identifico a cada estudiante?**
A: Por el email registrado en tu sistema de pagos (almacenado en `empirica_user_email`).

**Q: ¿Qué pasa si un estudiante usa navegación privada?**
A: Los datos se perderán al cerrar la ventana. Recomiendo enviarlos a un backend.

## Contacto

Para configurar el backend o personalizar el sistema, contactar a:
**Jorge Clemente** - jorge_clemente@empirica.mx
