# 📚 Sistema Modular - Guía Completa para Crear Nuevos Módulos

Esta guía te muestra **paso a paso** cómo usar el sistema modular compartido para crear nuevos módulos del curso Legal English de forma rápida, consistente y sin errores.

---

## 📋 Tabla de Contenidos

1. [Visión General del Sistema](#visión-general-del-sistema)
2. [Archivos Compartidos](#archivos-compartidos)
3. [Crear un Nuevo Módulo](#crear-un-nuevo-módulo)
4. [Configuración del Módulo](#configuración-del-módulo)
5. [Tipos de Ejercicios Disponibles](#tipos-de-ejercicios-disponibles)
6. [Control de Acceso (Gratuito vs Pago)](#control-de-acceso)
7. [Integración con Google Sheets](#integración-con-google-sheets)
8. [Actualizar Módulos Existentes](#actualizar-módulos-existentes)
9. [Solución de Problemas](#solución-de-problemas)

---

## 🎯 Visión General del Sistema

### ¿Qué es el Sistema Modular?

El sistema modular es una arquitectura que **separa la funcionalidad compartida del contenido específico** de cada módulo.

**Antes (sin sistema modular):**
- Cada módulo tenía su propio código JavaScript duplicado
- Cada módulo tenía sus propios estilos CSS duplicados
- Corregir un bug requería modificar 15 archivos diferentes
- Alto riesgo de inconsistencias entre módulos

**Ahora (con sistema modular):**
- ✅ **Un solo archivo** de funciones JavaScript compartido
- ✅ **Un solo archivo** de estilos CSS compartido
- ✅ Corregir un bug = actualizar 1 archivo, afecta todos los módulos
- ✅ Crear nuevo módulo = copiar template + agregar contenido
- ✅ Consistencia total garantizada

---

## 📁 Archivos Compartidos

### 1. `shared/module-functions.js`

**Ubicación:** `cursos/legal-english/shared/module-functions.js`

**Contiene:**
- 22 funciones JavaScript reutilizables
- Sistema de configuración por módulo (`MODULE_CONFIG`)
- Lógica para 11 tipos de ejercicios diferentes
- Persistencia con localStorage (respuestas guardadas)
- Integración con backend de Google Sheets
- Fuzzy matching (tolerancia de errores ortográficos)
- Progress tracking
- Survey handling

**Funciones principales:**
```javascript
// Student Info
- saveStudentInfo()
- loadStudentInfo()
- getStudentInfo()

// Exercise Checks
- checkExercise1() a checkExercise11()

// Helpers
- selectMatch() - Para ejercicios de matching
- selectOption() - Para multiple choice
- levenshteinDistance() - Para fuzzy matching
- isSimilarEnough() - Validación con tolerancia

// Progress & State
- updateProgressBar()
- loadProgress()
- saveExerciseState()
- restoreAllExercises()

// Backend
- sendToBackend() - Envía datos a Google Sheets
```

### 2. `shared/module-styles.css`

**Ubicación:** `cursos/legal-english/shared/module-styles.css`

**Contiene:**
- Layout principal (video + content sections)
- Estilos para todos los tipos de ejercicios
- Diseño responsive (desktop, tablet, mobile)
- Video controls y progress bar
- Feedback messages (success, error, hint)
- Tablas de comparación
- Vocabulary boxes
- Document displays
- Print styles

**Clases CSS principales:**
```css
/* Layout */
.module-layout
.video-section
.content-section

/* Exercises */
.exercise-block
.exercise-header
.option-item
.fill-blank-input
.tick-option

/* Feedback */
.feedback-message.success
.feedback-message.error
.feedback-message.hint

/* Components */
.vocabulary-box
.vocab-grid
.comparison-table
.document-display
.progress-bar
```

---

## 🆕 Crear un Nuevo Módulo

### Paso 1: Copiar Estructura Base del Módulo 2

El Módulo 2 es tu **template de referencia** porque ya usa el sistema compartido.

```bash
# Desde la raíz del proyecto
cd cursos/legal-english/modulos

# Copiar módulo 2 como base para módulo 3
cp -r modulo-2 modulo-3
```

### Paso 2: Limpiar Contenido Específico

Abre `modulo-3/index.html` y realiza los siguientes cambios:

#### 2.1 Actualizar `<head>`

```html
<!-- ANTES -->
<title>Module 2: Contract Law - Legal English</title>
<meta name="description" content="... Module 2.">

<!-- DESPUÉS -->
<title>Module 3: [NOMBRE DEL MÓDULO] - Legal English</title>
<meta name="description" content="... Module 3.">
```

#### 2.2 Actualizar Configuración del Módulo

Busca la sección de configuración (antes del cierre de `</body>`):

```html
<script>
// CONFIGURACIÓN DEL MÓDULO
window.MODULE_CONFIG = {
    moduleNumber: 3,  // ⬅️ CAMBIAR A 3
    moduleName: 'Tu Nombre del Módulo',  // ⬅️ CAMBIAR
    totalExercises: 11,  // ⬅️ AJUSTAR según tus ejercicios
    backendURL: 'https://script.google.com/macros/s/YOUR_ID/exec',
    isFreeModule: false  // ⬅️ true solo para módulo 1
};
</script>

<!-- Imports compartidos (NO CAMBIAR) -->
<script src="../../shared/module-functions.js"></script>
<script src="../../../../js/payment-access-control.js"></script>
```

#### 2.3 Reemplazar Contenido del Módulo

**Reemplaza TODO el contenido** dentro de `<div class="content-section">` con el contenido de tu nuevo módulo.

**Estructura recomendada:**

```html
<div class="content-section">
    <!-- 1. Header del módulo -->
    <div class="module-header">
        <h1>📘 Module 3: [NOMBRE]</h1>
        <p style="margin: 10px 0 0 0; color: var(--secondary); font-weight: 500;">
            [Descripción breve del módulo]
        </p>
        <div class="module-meta">
            <span>⏱️ Duration: XX min</span>
            <span>📝 XX Exercises</span>
            <span>🎯 Level: [Beginner/Intermediate/Advanced]</span>
        </div>
    </div>

    <!-- 2. Progress Bar -->
    <div class="progress-bar">
        <div class="progress" style="width: 0%;"></div>
    </div>

    <!-- 3. Student Info -->
    <div class="student-info-block">
        <!-- Copiar del módulo 2 -->
    </div>

    <!-- 4. Contenido del módulo -->
    <div class="content-block">
        <h2>🎯 PART 1: [NOMBRE]</h2>
        <!-- Tu contenido aquí -->
    </div>

    <!-- 5. Ejercicios -->
    <div class="exercise-block" id="exercise1">
        <!-- Ver sección "Tipos de Ejercicios" -->
    </div>

    <!-- 6. Survey -->
    <div class="survey-block">
        <!-- Copiar del módulo 2 -->
    </div>

    <!-- 7. Navigation -->
    <div class="module-navigation">
        <a href="../modulo-2/index.html" class="nav-btn">
            ← Previous Module
        </a>
        <a href="../modulo-4/index.html" class="nav-btn">
            Next Module →
        </a>
    </div>
</div>
```

---

## ⚙️ Configuración del Módulo

### MODULE_CONFIG Explicado

```javascript
window.MODULE_CONFIG = {
    // Número del módulo (1-15)
    moduleNumber: 3,

    // Nombre descriptivo del módulo
    moduleName: 'Contract Formation',

    // Total de ejercicios en el módulo
    // IMPORTANTE: Debe coincidir con la cantidad real de ejercicios
    totalExercises: 11,

    // URL del backend de Google Sheets
    // Usar la URL del Web App que creaste en la guía de Google Sheets
    backendURL: 'https://script.google.com/macros/s/AKfycby.../exec',

    // ¿Es módulo gratuito?
    // true = Módulo 1 (acceso libre)
    // false = Módulos 2-15 (requieren pago o registro)
    isFreeModule: false
};
```

### ¿Por qué es importante MODULE_CONFIG?

Este objeto configura automáticamente:
- ✅ LocalStorage keys (usa `module3_` en lugar de `module2_`)
- ✅ Datos enviados al backend (identifica el módulo correcto)
- ✅ Progress bar (calcula % basado en totalExercises)
- ✅ Control de acceso (gratuito vs pago)

---

## 📝 Tipos de Ejercicios Disponibles

El sistema soporta **11 tipos de ejercicios** diferentes. Aquí están los templates para cada uno:

### Ejercicio 1: Matching (Emparejar Términos)

```html
<div class="exercise-block" id="exercise1">
    <div class="exercise-header">
        <div class="exercise-number">1</div>
        <div class="exercise-title">
            <h3>Match the Terms</h3>
            <span>Match each term with its definition</span>
        </div>
    </div>

    <div class="exercise-content">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <!-- Columna izquierda: Términos -->
            <div>
                <h4>Terms:</h4>
                <ul class="options-list">
                    <li class="option-item term-item" data-match="1" onclick="selectMatch(this, 'exercise1')">
                        <span class="option-letter">A</span>
                        <span>Término 1</span>
                    </li>
                    <li class="option-item term-item" data-match="2" onclick="selectMatch(this, 'exercise1')">
                        <span class="option-letter">B</span>
                        <span>Término 2</span>
                    </li>
                    <!-- Más términos... -->
                </ul>
            </div>

            <!-- Columna derecha: Definiciones -->
            <div>
                <h4>Definitions:</h4>
                <ul class="options-list">
                    <li class="option-item definition-item" data-match="1" onclick="selectMatch(this, 'exercise1')">
                        <span class="option-letter">1</span>
                        <span>Definición que corresponde al Término 1</span>
                    </li>
                    <li class="option-item definition-item" data-match="2" onclick="selectMatch(this, 'exercise1')">
                        <span class="option-letter">2</span>
                        <span>Definición que corresponde al Término 2</span>
                    </li>
                    <!-- Más definiciones... -->
                </ul>
            </div>
        </div>
    </div>

    <div class="exercise-actions">
        <button class="btn-check" onclick="checkExercise1()">Check Answers</button>
    </div>

    <div class="feedback-message" id="ex1-feedback"></div>
</div>
```

**Clave:** El atributo `data-match` debe ser **igual** entre el término y su definición correcta.

---

### Ejercicio 2: Fill in the Blanks

```html
<div class="exercise-block" id="exercise2">
    <div class="exercise-header">
        <div class="exercise-number">2</div>
        <div class="exercise-title">
            <h3>Fill in the Blanks</h3>
            <span>Complete the sentences with the correct words</span>
        </div>
    </div>

    <div class="exercise-content">
        <p>
            1. A _____ is a legally binding agreement.
            <input type="text" class="fill-blank-input" id="ex2-blank1" data-answer="contract">
        </p>

        <p>
            2. The _____ is the person who makes an offer.
            <input type="text" class="fill-blank-input" id="ex2-blank2" data-answer="offeror">
        </p>

        <!-- Más preguntas... -->
    </div>

    <div class="exercise-actions">
        <button class="btn-check" onclick="checkExercise2()">Check Answers</button>
    </div>

    <div class="feedback-message" id="ex2-feedback"></div>
</div>
```

**Características:**
- ✅ Fuzzy matching activado (tolera errores ortográficos menores)
- ✅ Case-insensitive
- ✅ 80% de similitud requerida

---

### Ejercicio 3: True/False

```html
<div class="exercise-block" id="exercise3">
    <div class="exercise-header">
        <div class="exercise-number">3</div>
        <div class="exercise-title">
            <h3>True or False</h3>
            <span>Decide if each statement is true or false</span>
        </div>
    </div>

    <div class="exercise-content">
        <div style="margin-bottom: 20px;">
            <p><strong>1. Contracts must always be in writing.</strong></p>
            <ul class="options-list">
                <li class="option-item" data-correct="false" onclick="selectOption(this, 'ex3-q1')">
                    <span class="option-letter">T</span>
                    <span>True</span>
                </li>
                <li class="option-item" data-correct="true" onclick="selectOption(this, 'ex3-q1')">
                    <span class="option-letter">F</span>
                    <span>False</span>
                </li>
            </ul>
        </div>

        <!-- Más preguntas... -->
    </div>

    <div class="exercise-actions">
        <button class="btn-check" onclick="checkExercise3()">Check Answers</button>
    </div>

    <div class="feedback-message" id="ex3-feedback"></div>
</div>
```

---

### Ejercicio 4: Multiple Choice (4 opciones)

```html
<div class="exercise-block" id="exercise4">
    <div class="exercise-header">
        <div class="exercise-number">4</div>
        <div class="exercise-title">
            <h3>Reading Comprehension</h3>
            <span>Choose the correct answer</span>
        </div>
    </div>

    <div class="exercise-content">
        <div style="margin-bottom: 25px;">
            <p><strong>1. What are the essential elements of a contract?</strong></p>
            <ul class="options-list">
                <li class="option-item" data-correct="true" onclick="selectOption(this, 'ex4-q1')">
                    <span class="option-letter">A</span>
                    <span>Offer, acceptance, consideration, intention</span>
                </li>
                <li class="option-item" data-correct="false" onclick="selectOption(this, 'ex4-q1')">
                    <span class="option-letter">B</span>
                    <span>Offer and acceptance only</span>
                </li>
                <li class="option-item" data-correct="false" onclick="selectOption(this, 'ex4-q1')">
                    <span class="option-letter">C</span>
                    <span>Written document and signatures</span>
                </li>
                <li class="option-item" data-correct="false" onclick="selectOption(this, 'ex4-q1')">
                    <span class="option-letter">D</span>
                    <span>Mutual agreement only</span>
                </li>
            </ul>
        </div>

        <!-- Más preguntas... -->
    </div>

    <div class="exercise-actions">
        <button class="btn-check" onclick="checkExercise4()">Check Answers</button>
    </div>

    <div class="feedback-message" id="ex4-feedback"></div>
</div>
```

**IMPORTANTE:** En `checkExercise4()`, debes actualizar el array `questions` con los IDs correctos:

```javascript
// En module-functions.js, la función ya está configurada para:
const questions = ['ex4-q1', 'ex4-q2', 'ex4-q3', 'ex4-q4'];
```

Si tienes 5 preguntas, modifica el HTML para agregar `ex4-q5` y listo.

---

### Ejercicio 5: Find the Words (Fill blanks con lista de palabras)

```html
<div class="exercise-block" id="exercise5">
    <div class="exercise-header">
        <div class="exercise-number">5</div>
        <div class="exercise-title">
            <h3>Find the Words</h3>
            <span>Complete using words from the list</span>
        </div>
    </div>

    <div class="exercise-content">
        <!-- Word Bank -->
        <div class="vocabulary-box">
            <h4>📝 Word Bank:</h4>
            <p><em>breach, damages, remedy, rescission, specific performance</em></p>
        </div>

        <p>
            1. When one party fails to fulfill obligations, it's called a _____.
            <input type="text" class="fill-blank-input" id="ex5-blank1" data-answer="breach">
        </p>

        <!-- Más preguntas... -->
    </div>

    <div class="exercise-actions">
        <button class="btn-check" onclick="checkExercise5()">Check Answers</button>
    </div>

    <div class="feedback-message" id="ex5-feedback"></div>
</div>
```

---

### Ejercicio 6: Listen and Tick (Checkboxes)

```html
<div class="exercise-block" id="exercise6">
    <div class="exercise-header">
        <div class="exercise-number">6</div>
        <div class="exercise-title">
            <h3>Listen and Tick</h3>
            <span>Tick the correct statements</span>
        </div>
    </div>

    <div class="exercise-content">
        <p><strong>Listen to the audio and tick (✓) the TRUE statements:</strong></p>

        <div class="tick-option" data-checkbox-id="ex6-1" data-correct="true">
            <input type="checkbox" id="ex6-1">
            <label for="ex6-1">Statement 1 (TRUE)</label>
        </div>

        <div class="tick-option" data-checkbox-id="ex6-2" data-correct="false">
            <input type="checkbox" id="ex6-2">
            <label for="ex6-2">Statement 2 (FALSE)</label>
        </div>

        <!-- Más statements... -->
    </div>

    <div class="exercise-actions">
        <button class="btn-check" onclick="checkExercise6()">Check Answers</button>
    </div>

    <div class="feedback-message" id="ex6-feedback"></div>
</div>
```

**Características:**
- ✅ Click funciona en TODO el rectángulo, no solo en el checkbox
- ✅ `data-correct="true"` marca los statements correctos
- ✅ Sistema calcula correctos = marcados correctos + NO marcados incorrectos

---

### Ejercicio 7: Listen Again and Complete (Fill blanks audio)

Idéntico al **Ejercicio 2** pero con contexto de listening:

```html
<div class="exercise-block" id="exercise7">
    <div class="exercise-header">
        <div class="exercise-number">7</div>
        <div class="exercise-title">
            <h3>Listen Again and Complete</h3>
            <span>Fill in the missing words from the audio</span>
        </div>
    </div>

    <div class="exercise-content">
        <p>
            1. The contract was signed on _____.
            <input type="text" class="fill-blank-input" id="ex7-blank1" data-answer="March 15">
        </p>

        <!-- Más preguntas... -->
    </div>

    <div class="exercise-actions">
        <button class="btn-check" onclick="checkExercise7()">Check Answers</button>
    </div>

    <div class="feedback-message" id="ex7-feedback"></div>
</div>
```

---

### Ejercicio 8: Match Speakers (Multiple choice para audio)

Similar al **Ejercicio 4** pero con 3 preguntas:

```html
<div class="exercise-block" id="exercise8">
    <div class="exercise-header">
        <div class="exercise-number">8</div>
        <div class="exercise-title">
            <h3>Match Speakers</h3>
            <span>Who said what?</span>
        </div>
    </div>

    <div class="exercise-content">
        <div style="margin-bottom: 20px;">
            <p><strong>1. Who mentioned the deadline?</strong></p>
            <ul class="options-list">
                <li class="option-item" data-correct="true" onclick="selectOption(this, 'ex8-q1')">
                    <span class="option-letter">A</span>
                    <span>Speaker A</span>
                </li>
                <li class="option-item" data-correct="false" onclick="selectOption(this, 'ex8-q1')">
                    <span class="option-letter">B</span>
                    <span>Speaker B</span>
                </li>
            </ul>
        </div>

        <!-- Más preguntas... -->
    </div>

    <div class="exercise-actions">
        <button class="btn-check" onclick="checkExercise8()">Check Answers</button>
    </div>

    <div class="feedback-message" id="ex8-feedback"></div>
</div>
```

---

### Ejercicio 9: Análisis/Identificación (Single choice)

```html
<div class="exercise-block" id="exercise9">
    <div class="exercise-header">
        <div class="exercise-number">9</div>
        <div class="exercise-title">
            <h3>Analysis</h3>
            <span>Identify the correct element</span>
        </div>
    </div>

    <div class="exercise-content">
        <p><strong>Which clause represents force majeure?</strong></p>

        <ul class="options-list">
            <li class="option-item" data-correct="false" onclick="selectOption(this, 'ex9-q1')">
                <span class="option-letter">A</span>
                <span>Payment terms clause</span>
            </li>
            <li class="option-item" data-correct="true" onclick="selectOption(this, 'ex9-q1')">
                <span class="option-letter">B</span>
                <span>Unforeseen circumstances clause</span>
            </li>
            <!-- Más opciones... -->
        </ul>
    </div>

    <div class="exercise-actions">
        <button class="btn-check" onclick="checkExercise9()">Check Answer</button>
    </div>

    <div class="feedback-message" id="ex9-feedback"></div>
</div>
```

---

### Ejercicio 10: Matching (Igual que Ejercicio 1)

Usar exactamente el mismo template del **Ejercicio 1** pero con `id="exercise10"` y `checkExercise10()`.

---

### Ejercicio 11: Writing Task (Template/Essay)

```html
<div class="exercise-block" id="exercise11">
    <div class="exercise-header">
        <div class="exercise-number">11</div>
        <div class="exercise-title">
            <h3>Writing Task</h3>
            <span>Complete the formal notice template</span>
        </div>
    </div>

    <div class="exercise-content">
        <div class="document-display">
            <div class="doc-header">FORCE MAJEURE NOTICE</div>

            <div class="doc-section">
                <strong>Date:</strong>
                <input type="text" id="ex11-date" style="width: 200px; margin-left: 10px;">
            </div>

            <div class="doc-section">
                <strong>Contract Number:</strong>
                <input type="text" id="ex11-number" style="width: 200px; margin-left: 10px;">
            </div>

            <div class="doc-section">
                <strong>1. Circumstances:</strong><br>
                <textarea id="ex11-circumstances" rows="4" style="width: 100%; margin-top: 10px;"></textarea>
            </div>

            <div class="doc-section">
                <strong>2. Impact:</strong><br>
                <textarea id="ex11-impact" rows="4" style="width: 100%; margin-top: 10px;"></textarea>
            </div>

            <div class="doc-section">
                <strong>3. Request:</strong><br>
                <textarea id="ex11-request" rows="4" style="width: 100%; margin-top: 10px;"></textarea>
            </div>
        </div>
    </div>

    <div class="exercise-actions">
        <button class="btn-check" onclick="checkExercise11()">Submit</button>
        <button class="btn-hint" onclick="showExercise11Hint()">Show Example</button>
    </div>

    <div class="feedback-message" id="ex11-feedback"></div>
</div>
```

**Validación:** Verifica que los textareas tengan al menos 20 caracteres.

---

## 🔐 Control de Acceso (Gratuito vs Pago)

### Módulo 1 (Gratuito)

```javascript
window.MODULE_CONFIG = {
    moduleNumber: 1,
    moduleName: 'Introduction to Legal English',
    totalExercises: 11,
    backendURL: 'https://...',
    isFreeModule: true  // ⬅️ GRATUITO
};
```

**Comportamiento:**
- ✅ Acceso libre sin verificación de email
- ✅ Cualquiera puede acceder
- ✅ No se verifica pago

### Módulos 2-15 (De Pago)

```javascript
window.MODULE_CONFIG = {
    moduleNumber: 2,
    moduleName: 'Contract Law',
    totalExercises: 11,
    backendURL: 'https://...',
    isFreeModule: false  // ⬅️ REQUIERE PAGO
};
```

**Comportamiento:**
- ✅ Verifica que el email esté registrado en Google Sheets (hoja "Compradores")
- ✅ Si no está registrado, muestra pantalla de pago
- ✅ El script `payment-access-control.js` maneja la verificación

**Archivo:** `cursos/legal-english/js/payment-access-control.js`

```javascript
// Este script se carga automáticamente en cada módulo
// Verifica acceso consultando Google Sheets
// Si isFreeModule = false, verifica el email
```

---

## 📊 Integración con Google Sheets

### Backend URL

Cada módulo envía datos al backend de Google Sheets configurado en:

```javascript
window.MODULE_CONFIG = {
    backendURL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
};
```

### Datos que se envían automáticamente:

#### 1. Información del estudiante

```javascript
sendToBackend({
    type: 'student_info',
    data: {
        module: 'module-3',
        name: 'Juan Pérez',
        email: 'juan@example.com',
        timestamp: '2025-12-08T10:30:00Z'
    }
});
```

#### 2. Puntuaciones de ejercicios

```javascript
sendToBackend({
    type: 'exercise_score',
    data: {
        module: 'module-3',
        exercise: 'exercise1',
        studentEmail: 'juan@example.com',
        score: '8/10',
        percentage: '80.0',
        timestamp: '2025-12-08T10:35:00Z'
    }
});
```

#### 3. Completación de ejercicios

```javascript
sendToBackend({
    type: 'exercise_completion',
    data: {
        module: 'module-3',
        exercise: 'exercise5',
        studentEmail: 'juan@example.com',
        state: { completed: true, score: '5/5' },
        timestamp: '2025-12-08T10:40:00Z'
    }
});
```

#### 4. Respuestas de encuesta

```javascript
sendToBackend({
    type: 'survey_response',
    data: {
        module: 'module-3',
        studentEmail: 'juan@example.com',
        rating: '5',
        mostUseful: 'Listening exercises',
        leastUseful: 'None',
        suggestions: 'More examples',
        timestamp: '2025-12-08T10:45:00Z'
    }
});
```

### ¿Dónde se almacenan estos datos?

En el Google Sheet configurado con el script `google-apps-script-student-answers.js`:

- **Hoja "Respuestas"**: Todas las puntuaciones de ejercicios
- **Hoja "Progreso"**: Resumen por estudiante/módulo
- **Hoja "Analytics"**: Estadísticas agregadas
- **Hoja "Encuestas"**: Feedback de estudiantes

---

## 🔄 Actualizar Módulos Existentes

### Actualizar Módulo 1 o Módulo 2 al Sistema Compartido

#### Paso 1: Agregar imports de archivos compartidos

Busca el final del archivo `</body>` y agrega ANTES de `</body>`:

```html
<!-- CONFIGURACIÓN DEL MÓDULO -->
<script>
window.MODULE_CONFIG = {
    moduleNumber: 2,  // o 1 para módulo 1
    moduleName: 'Contract Law',
    totalExercises: 11,
    backendURL: 'https://script.google.com/macros/s/YOUR_ID/exec',
    isFreeModule: false  // true solo para módulo 1
};
</script>

<!-- Archivos compartidos -->
<script src="../../shared/module-functions.js"></script>
<script src="../../../../js/payment-access-control.js"></script>

</body>
```

#### Paso 2: Eliminar `<script>` interno con funciones duplicadas

Busca y **ELIMINA** todo el bloque `<script>` que contiene las funciones JavaScript (checkExercise1, checkExercise2, etc.).

**NO elimines** el bloque `<script>` que tiene `MODULE_CONFIG`.

#### Paso 3: Actualizar `<style>` a import

**ANTES:**
```html
<style>
    /* Todos los estilos CSS aquí... */
</style>
```

**DESPUÉS:**
```html
<link rel="stylesheet" href="../../shared/module-styles.css">
```

**ELIMINA** todo el bloque `<style>` interno.

#### Paso 4: Verificar que funciona

1. Abre el módulo en el navegador
2. Completa un ejercicio
3. Verifica que:
   - ✅ Los estilos se aplican correctamente
   - ✅ Los ejercicios funcionan
   - ✅ Se guarda en localStorage
   - ✅ Se envía al backend (ver consola del navegador)

---

## 🐛 Solución de Problemas

### Problema 1: "MODULE_CONFIG is not defined"

**Causa:** El bloque `<script>` con `MODULE_CONFIG` no está antes de los imports.

**Solución:** Asegúrate de que el orden sea:

```html
<script>
window.MODULE_CONFIG = {...};
</script>
<script src="../../shared/module-functions.js"></script>
```

---

### Problema 2: Estilos CSS no se aplican

**Causa:** La ruta del CSS compartido es incorrecta.

**Solución:** Verifica la ruta relativa:

```
modulo-3/index.html
    ↓ ../ (sube a modulos/)
    ↓ ../ (sube a legal-english/)
    ↓ shared/module-styles.css
```

Ruta correcta: `../../shared/module-styles.css`

---

### Problema 3: Funciones no funcionan

**Causa:** La ruta del JS compartido es incorrecta.

**Solución:** Igual que con CSS, usa `../../shared/module-functions.js`

---

### Problema 4: El progress bar no se actualiza

**Causa:** `totalExercises` en `MODULE_CONFIG` no coincide con la cantidad real de ejercicios.

**Solución:** Cuenta tus ejercicios y actualiza:

```javascript
window.MODULE_CONFIG = {
    totalExercises: 11  // ⬅️ Si tienes 11 ejercicios
};
```

---

### Problema 5: Los datos no se envían a Google Sheets

**Causa:** `backendURL` no está configurado o es incorrecto.

**Solución:**
1. Ve a tu Google Apps Script
2. Despliega como Web App
3. Copia la URL que termina en `/exec`
4. Pégala en `MODULE_CONFIG.backendURL`

---

### Problema 6: Ejercicios de matching no funcionan

**Causa:** Los valores `data-match` no coinciden entre términos y definiciones.

**Ejemplo incorrecto:**
```html
<li data-match="contract">Term</li>
<li data-match="contrato">Definition</li>  ❌ No coinciden
```

**Ejemplo correcto:**
```html
<li data-match="1">Contract</li>
<li data-match="1">A legally binding agreement</li>  ✅ Ambos tienen "1"
```

---

## ✅ Checklist de Creación de Módulo

Al crear un módulo nuevo, verifica:

- [ ] Copiaste la estructura del módulo 2
- [ ] Actualizaste `<title>` y `<meta description>`
- [ ] Configuraste `MODULE_CONFIG` correctamente:
  - [ ] `moduleNumber` correcto
  - [ ] `moduleName` descriptivo
  - [ ] `totalExercises` coincide con ejercicios reales
  - [ ] `backendURL` con URL de Google Sheets
  - [ ] `isFreeModule` false (a menos que sea módulo 1)
- [ ] Agregaste imports:
  - [ ] `../../shared/module-styles.css`
  - [ ] `../../shared/module-functions.js`
  - [ ] `../../../../js/payment-access-control.js`
- [ ] Reemplazaste contenido con tu módulo
- [ ] Todos los ejercicios tienen:
  - [ ] `id="exerciseX"` único
  - [ ] Botón con `onclick="checkExerciseX()"`
  - [ ] `<div class="feedback-message" id="exX-feedback"></div>`
- [ ] Navigation links apuntan a módulos correctos
- [ ] Probaste en navegador:
  - [ ] Estilos se ven correctos
  - [ ] Ejercicios funcionan
  - [ ] Progress bar se actualiza
  - [ ] Datos se envían a backend (ver consola)

---

## 🎓 Resumen Final

### Lo que NUNCA debes modificar:

❌ `shared/module-functions.js`
❌ `shared/module-styles.css`

**A menos que** quieras cambiar la funcionalidad de **TODOS** los módulos.

### Lo que SÍ modificas en cada módulo:

✅ `window.MODULE_CONFIG` - Configuración específica
✅ Contenido dentro de `<div class="content-section">`
✅ Ejercicios específicos del tema
✅ Navigation links

### Flujo de trabajo recomendado:

1. **Copiar** módulo 2 como base
2. **Actualizar** MODULE_CONFIG
3. **Reemplazar** contenido educativo
4. **Agregar** ejercicios usando los templates
5. **Probar** en navegador
6. **Publicar** en servidor

---

## 📚 Recursos Adicionales

- **Módulo 2 completo**: `modulos/modulo-2/index.html` (referencia)
- **Funciones JS**: `shared/module-functions.js` (documentado)
- **Estilos CSS**: `shared/module-styles.css` (documentado)
- **Google Sheets Backend**: `docs/google-apps-script-student-answers.js`
- **Guía de Google Sheets**: `docs/GUIA-INSTALACION-GOOGLE-SHEETS.md`
- **Control de acceso**: `js/payment-access-control.js`

---

¡Listo! Ahora puedes crear módulos nuevos en **minutos** en lugar de horas. 🚀
