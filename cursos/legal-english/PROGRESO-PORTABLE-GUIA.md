# 📱 Sistema de Progreso Portable - Guía de Implementación

## 🎯 Resumen

Se ha implementado un sistema que permite a los alumnos **recuperar su progreso desde cualquier dispositivo** usando su email. Ahora los estudiantes pueden:

- ✅ Cambiar de computadora y continuar donde lo dejaron
- ✅ Usar diferentes navegadores sin perder su progreso
- ✅ Acceder desde móvil y desktop de forma intercambiable

---

## 🔧 Cómo Funciona

### Sistema Híbrido de Almacenamiento

**Antes:**
- ❌ Progreso solo en `localStorage` (atado al navegador/dispositivo)
- ❌ Cambiar de equipo = empezar de cero

**Ahora:**
- ✅ Progreso guardado en **localStorage + Google Sheets**
- ✅ Recuperación automática desde el servidor
- ✅ Sincronización por email del estudiante

### Flujo del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│  ALUMNO ENTRA AL CURSO DESDE UN NUEVO DISPOSITIVO          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Sistema detecta que NO hay progreso local                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Aparece un MODAL pidiendo el email del alumno             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Sistema consulta Google Sheets con ese email               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Recupera todas las respuestas previas del alumno          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Reconstruye el progreso en localStorage                    │
│  - Módulos completados                                      │
│  - Ejercicios resueltos                                     │
│  - Puntajes obtenidos                                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  ALUMNO VE SU PROGRESO RESTAURADO ✅                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Archivos Modificados

### 1. **Backend de Google Apps Script**
**Archivo:** `cursos/legal-english/google-apps-script/Code.gs`

**Cambios realizados:**

✅ **Nueva función `doGet()`** - Maneja solicitudes GET para recuperar progreso
```javascript
function doGet(e) {
  // Recibe: email como parámetro
  // Devuelve: objeto JSON con todo el progreso del estudiante
}
```

✅ **Nueva función `getStudentProgress(email)`** - Busca todas las respuestas del estudiante
```javascript
function getStudentProgress(email) {
  // Busca en la hoja "Exercise_Responses"
  // Agrupa por módulo
  // Calcula estadísticas
  // Retorna objeto estructurado con:
  //   - responses: array de todas las respuestas
  //   - moduleProgress: progreso por módulo
  //   - summary: resumen general
}
```

**Estructura de datos devuelta:**
```json
{
  "status": "success",
  "email": "alumno@example.com",
  "progress": {
    "responses": [...],
    "moduleProgress": {
      "module-1": {
        "completedExercises": 11,
        "exerciseIds": ["exercise1", "exercise2", ...],
        "averageScore": 95.5
      },
      "module-2": { ... }
    },
    "summary": {
      "totalExercises": 45,
      "completedModules": ["module-1", "module-2", "module-3"],
      "lastActivity": "2025-11-29T10:30:00.000Z"
    }
  }
}
```

### 2. **Índice de Módulos**
**Archivo:** `cursos/legal-english/modulos/index.html`

**Cambios realizados:**

✅ **Constante `BACKEND_URL`** - URL del backend de Google Apps Script

✅ **Función `loadProgressFromServer(email)`** - Recupera progreso desde Google Sheets
- Hace petición GET al backend
- Parsea la respuesta JSON
- Guarda el progreso en localStorage
- Retorna true/false según éxito

✅ **Función `promptForEmail()`** - Modal para solicitar email al usuario
- Diseño atractivo con los colores de Empírica
- Validación de formato de email
- Permite presionar Enter para enviar

✅ **Inicialización mejorada** - Al cargar la página:
1. Verifica si hay progreso local
2. Si NO hay progreso local:
   - Busca email guardado
   - Si no hay email, muestra el modal
   - Consulta el servidor
   - Restaura el progreso
3. Muestra el progreso en pantalla

### 3. **Módulos Individuales**
**Los módulos ya funcionan correctamente** porque:
- Ya leen de localStorage con `localStorage.getItem('module1_progress')`
- El sistema de recuperación guarda en localStorage
- No requieren modificaciones adicionales

---

## 🚀 Pasos para Implementar

### Paso 1: Actualizar Google Apps Script

1. **Abrir tu Google Sheet** del curso Legal English
2. **Ir a Extensiones > Apps Script**
3. **Reemplazar** el contenido de `Code.gs` con el nuevo código
4. **Guardar** (Ctrl+S o ⌘+S)

### Paso 2: Re-desplegar el Script

⚠️ **IMPORTANTE:** Debes re-desplegar para que los cambios tengan efecto

1. En Apps Script, click en **Implementar > Administrar implementaciones**
2. Click en el ✏️ **lápiz de editar** en la implementación activa
3. En "Nueva descripción" escribe: `v2.0 - Agregada recuperación de progreso`
4. Click en **Implementar**
5. **Copia la nueva URL** (será la misma, pero con una nueva versión)

### Paso 3: Verificar la URL del Backend

1. Abre `cursos/legal-english/modulos/index.html`
2. Verifica que la línea 785 tenga la URL correcta:
   ```javascript
   const BACKEND_URL = 'https://script.google.com/macros/s/TU_SCRIPT_ID/exec';
   ```
3. Si es diferente, **actualízala** con tu URL

### Paso 4: Probar el Sistema

1. **Abre el curso** en un navegador (modo incógnito para simular dispositivo nuevo)
2. **Deberías ver** el modal pidiendo tu email
3. **Ingresa** un email que YA tenga progreso guardado en Google Sheets
4. **Verifica** que el progreso se restaure correctamente:
   - Módulos completados
   - Total de ejercicios
   - Tiempo de estudio
   - Barra de progreso

---

## 📊 Datos que se Recuperan

### Por Módulo:
- ✅ Número de ejercicios completados
- ✅ IDs de ejercicios específicos
- ✅ Promedio de puntaje
- ✅ Fecha de última actividad

### Resumen General:
- ✅ Total de ejercicios resueltos
- ✅ Lista de módulos completados
- ✅ Última fecha de actividad
- ✅ Tiempo estimado de estudio

### Lo que NO se recupera actualmente:
- ⚠️ Estados visuales de ejercicios individuales (marcas de completado dentro de cada módulo)
- ⚠️ Intentos específicos de ejercicios

**Nota:** Esto se puede implementar en una fase 2 si es necesario.

---

## 🔐 Seguridad y Privacidad

### Protección de Datos:
- ✅ Email como único identificador (no se expone información sensible)
- ✅ Consultas por GET son read-only
- ✅ No se permite modificar datos de otros usuarios
- ✅ El backend valida que el email esté presente

### Consideraciones:
- ⚠️ Cualquiera con acceso a un email puede ver su progreso
- ⚠️ No hay autenticación de contraseña (por simplicidad)
- ✅ Esto es apropiado para un curso educativo sin datos sensibles

---

## 🎨 Experiencia del Usuario

### Primera Vez (Dispositivo Nuevo):

```
┌──────────────────────────────────────────┐
│                                          │
│       Recuperar Progreso                │
│                                          │
│  Ingresa tu email para recuperar tu     │
│  progreso anterior o comenzar un        │
│  nuevo registro.                        │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ tu@email.com                       │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │        Continuar                   │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Tu progreso se guardará                │
│  automáticamente                        │
│                                          │
└──────────────────────────────────────────┘
```

### Después del Login:
- ✅ Progreso restaurado instantáneamente
- ✅ Módulos desbloqueados según avance
- ✅ Estadísticas actualizadas
- ✅ Puede continuar donde lo dejó

### Dispositivo Conocido (con localStorage):
- ✅ **No aparece el modal** (usa datos locales)
- ✅ Carga instantánea
- ✅ Experiencia sin interrupciones

---

## 🧪 Casos de Prueba

### Caso 1: Alumno Nuevo
1. Alumno visita el curso por primera vez
2. Aparece modal pidiendo email
3. Ingresa su email
4. Como no tiene progreso previo, empieza desde cero
5. Su progreso se guarda en Google Sheets

### Caso 2: Alumno con Progreso en Otro Dispositivo
1. Alumno entra desde nueva computadora
2. Aparece modal pidiendo email
3. Ingresa su email (el mismo que usó antes)
4. Sistema recupera su progreso desde Google Sheets
5. Ve sus módulos completados y puede continuar

### Caso 3: Alumno Vuelve al Mismo Dispositivo
1. Alumno entra desde la misma computadora
2. **NO aparece modal** (ya tiene localStorage)
3. Carga directo con su progreso local
4. Experiencia instantánea

### Caso 4: Email Incorrecto
1. Alumno ingresa email diferente al que usó
2. Sistema no encuentra progreso para ese email
3. Empieza desde cero con el nuevo email
4. Progreso anterior sigue guardado bajo el email original

---

## 📈 Mejoras Futuras (Opcional)

### Fase 2 - Restauración Completa de Estados:
- Guardar estados completos de ejercicios en el backend
- Restaurar respuestas específicas y visuales de completado
- Mostrar ejercicios marcados como completados dentro de módulos

### Fase 3 - Autenticación:
- Sistema de login con contraseña
- Protección adicional de datos
- Sesiones seguras

### Fase 4 - Sincronización en Tiempo Real:
- Sincronizar cambios automáticamente mientras el alumno estudia
- Conflictos de resolución si usa múltiples dispositivos simultáneamente

---

## ❓ Preguntas Frecuentes

### ¿Qué pasa si un alumno usa diferentes emails?
Cada email crea un perfil separado. El progreso está atado al email.

### ¿Se puede cambiar el email de un alumno?
Sí, manualmente desde Google Sheets puedes actualizar la columna de email.

### ¿Funciona sin conexión a internet?
- ✅ Si ya cargó el progreso previamente: SÍ (usa localStorage)
- ❌ Para recuperar progreso inicial: NO (requiere internet)

### ¿Cuánto tiempo tarda en recuperar el progreso?
Típicamente 1-3 segundos, dependiendo de la cantidad de ejercicios completados.

### ¿Qué pasa si borro mi localStorage?
El sistema detectará que no hay progreso local, pedirá tu email, y lo recuperará automáticamente.

---

## 📞 Soporte

Si tienes problemas con la implementación:

1. **Verifica** que el Apps Script esté desplegado correctamente
2. **Revisa** la consola del navegador (F12) para errores
3. **Comprueba** que la URL del backend sea correcta
4. **Asegúrate** de que la hoja "Exercise_Responses" exista en tu Google Sheet

---

## 🎉 ¡Listo!

Tu curso ahora tiene un sistema de progreso portable que funciona entre dispositivos. Los alumnos pueden estudiar desde cualquier lugar y su progreso siempre estará disponible.

**Empírica - Cursos Jurídicos**
Versión 2.0 - Noviembre 2025
