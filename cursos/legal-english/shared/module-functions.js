/**
 * ============================================================================
 * LEGAL ENGLISH COURSE - SHARED MODULE FUNCTIONS
 * ============================================================================
 *
 * Este archivo contiene TODAS las funciones JavaScript compartidas
 * entre los módulos del curso Legal English.
 *
 * IMPORTANTE:
 * - Este archivo debe ser importado en cada módulo
 * - Las funciones son reutilizables y configurables
 * - NO modificar este archivo sin actualizar TODOS los módulos
 *
 * Uso en cada módulo:
 * <script src="../../shared/module-functions.js"></script>
 *
 * Versión: 1.0
 * Última actualización: 2025-12-08
 * ============================================================================
 */

// ============================================================================
// CONFIGURACIÓN GLOBAL - Debe ser establecida por cada módulo
// ============================================================================

// ============================================================================
// URL CENTRALIZADA DEL BACKEND
// ============================================================================
// IMPORTANTE: Esta es la UNICA URL que necesitas configurar.
// Todos los módulos y el sistema de pagos usan esta misma URL.
//
// INSTRUCCIONES:
// 1. Copia el archivo google-apps-script/SISTEMA-CENTRALIZADO.gs a Google Apps Script
// 2. Despliega como Web App (Deploy > New deployment > Web app)
// 3. Copia la URL generada y pégala aquí abajo
// ============================================================================

const EMPIRICA_BACKEND_URL = 'https://script.google.com/macros/s/AKfycbwLjiDy5ZEpP97JUF-FA8Z4Lf6mbMHDDUzLH0JH9rGXFCHnh9KLeSU8oBNS3NTDFb4Xvg/exec';

// Variable global que cada módulo debe definir ANTES de cargar este script
// Ejemplo: window.MODULE_CONFIG = { moduleNumber: 2, moduleName: 'Contract Law', ... }
window.MODULE_CONFIG = window.MODULE_CONFIG || {
    moduleNumber: 1,
    moduleName: 'Default Module',
    totalExercises: 11,
    backendURL: EMPIRICA_BACKEND_URL,  // Usa la URL centralizada
    isFreeModule: false
};

// Estado global de ejercicios
let exerciseStates = {};
let selectedMatches = {}; // Para ejercicios de matching

// ============================================================================
// 1. UI/NAVIGATION FUNCTIONS
// ============================================================================

/**
 * Toggle mobile navigation menu
 */
function toggleMenu() {
    const navMenu = document.querySelector('.nav-links');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

// ============================================================================
// 2. STUDENT INFORMATION FUNCTIONS
// ============================================================================

/**
 * Guarda la información del estudiante (nombre y email)
 * La información se almacena en localStorage y se envía al backend
 */
function saveStudentInfo() {
    const name = document.getElementById('student-name').value.trim();
    const email = document.getElementById('student-email').value.trim();
    const feedback = document.getElementById('student-info-feedback');

    if (!name) {
        feedback.textContent = '✗ Please enter your name.';
        feedback.style.color = '#dc3545';
        return;
    }

    const studentInfo = {
        name: name,
        email: email,
        timestamp: new Date().toISOString()
    };

    // Guardar en localStorage con clave específica del módulo
    const storageKey = `student_info_module${MODULE_CONFIG.moduleNumber}`;
    localStorage.setItem(storageKey, JSON.stringify(studentInfo));

    // Enviar al backend
    sendToBackend({
        type: 'student_info',
        data: {
            module: `module-${MODULE_CONFIG.moduleNumber}`,
            name: name,
            email: email,
            timestamp: studentInfo.timestamp
        }
    });

    // Deshabilitar campos
    document.getElementById('student-name').disabled = true;
    document.getElementById('student-email').disabled = true;
    document.querySelector('.btn-primary').disabled = true;

    feedback.textContent = `✓ Welcome, ${name}! Your information has been saved.`;
    feedback.style.color = '#28a745';
}

/**
 * Carga la información del estudiante desde localStorage al cargar la página
 */
function loadStudentInfo() {
    const storageKey = `student_info_module${MODULE_CONFIG.moduleNumber}`;
    const saved = localStorage.getItem(storageKey);

    if (saved) {
        const studentInfo = JSON.parse(saved);
        document.getElementById('student-name').value = studentInfo.name;
        document.getElementById('student-email').value = studentInfo.email;
        document.getElementById('student-name').disabled = true;
        document.getElementById('student-email').disabled = true;

        const saveButton = document.querySelector('.btn-primary');
        if (saveButton) {
            saveButton.disabled = true;
        }

        const feedback = document.getElementById('student-info-feedback');
        if (feedback) {
            feedback.textContent = `✓ Welcome back, ${studentInfo.name}!`;
            feedback.style.color = '#28a745';
        }
    }
}

/**
 * Obtiene la información del estudiante actual
 * @returns {Object} {name: string, email: string}
 */
function getStudentInfo() {
    const storageKey = `student_info_module${MODULE_CONFIG.moduleNumber}`;
    const saved = localStorage.getItem(storageKey);

    if (saved) {
        return JSON.parse(saved);
    }

    return { name: 'Anonymous', email: '' };
}

// ============================================================================
// 3. BACKEND COMMUNICATION
// ============================================================================

/**
 * Envía datos al backend de Google Sheets
 * @param {Object} payload - Datos a enviar {type: string, data: Object}
 */
function sendToBackend(payload) {
    const BACKEND_URL = MODULE_CONFIG.backendURL;

    // Si no hay URL configurada, solo hacer log
    if (!BACKEND_URL || BACKEND_URL.includes('YOUR_SCRIPT_ID')) {
        console.log('📤 [Backend Placeholder] Datos que se enviarían:', payload);
        return;
    }

    // IMPORTANTE: Usar 'text/plain' para evitar preflight CORS
    // Google Apps Script parseará el JSON correctamente
    fetch(BACKEND_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: JSON.stringify(payload)
    })
    .then(() => {
        console.log('✅ Datos enviados al backend:', payload);
    })
    .catch(error => {
        console.error('❌ Error al enviar datos al backend:', error);
    });
}

// ============================================================================
// 4. PROGRESS TRACKING FUNCTIONS
// ============================================================================

/**
 * Actualiza la barra de progreso del módulo
 * Calcula el porcentaje basado en ejercicios completados
 */
function updateProgressBar() {
    const completedExercises = document.querySelectorAll('.feedback-message[style*="color: rgb(40, 167, 69)"]').length;
    const totalExercises = MODULE_CONFIG.totalExercises;
    const percentage = (completedExercises / totalExercises) * 100;

    const progressBar = document.querySelector('.progress');
    if (progressBar) {
        progressBar.style.width = percentage + '%';

        // Guardar progreso
        const storageKey = `module${MODULE_CONFIG.moduleNumber}_progress`;
        localStorage.setItem(storageKey, percentage);
    }
}

/**
 * Carga el progreso guardado desde localStorage
 */
function loadProgress() {
    const storageKey = `module${MODULE_CONFIG.moduleNumber}_progress`;
    const savedProgress = localStorage.getItem(storageKey);

    if (savedProgress) {
        const progressBar = document.querySelector('.progress');
        if (progressBar) {
            progressBar.style.width = savedProgress + '%';
        }
    }
}

// ============================================================================
// 5. HELPER FUNCTIONS
// ============================================================================

/**
 * Maneja la selección de pares en ejercicios de matching
 * @param {HTMLElement} element - Elemento clickeado
 * @param {string} exerciseId - ID del ejercicio (ej: 'exercise1')
 */
function selectMatch(element, exerciseId) {
    const matchValue = element.getAttribute('data-match');

    // No permitir clicks en elementos ya emparejados o bloqueados
    if (element.classList.contains('matched') || element.classList.contains('locked')) {
        return;
    }

    // Inicializar array de selecciones para este ejercicio si no existe
    if (!selectedMatches[exerciseId]) {
        selectedMatches[exerciseId] = [];
    }

    // Si el elemento ya está seleccionado, deseleccionarlo
    if (element.classList.contains('selected')) {
        element.classList.remove('selected');
        selectedMatches[exerciseId] = selectedMatches[exerciseId].filter(item => item.element !== element);
        return;
    }

    // Seleccionar elemento
    element.classList.add('selected');
    selectedMatches[exerciseId].push({
        element: element,
        value: matchValue,
        type: element.classList.contains('term-item') ? 'term' : 'definition'
    });

    // Si hay 2 elementos seleccionados, verificar si forman un par válido
    if (selectedMatches[exerciseId].length === 2) {
        const [first, second] = selectedMatches[exerciseId];

        // Verificar que sean diferentes tipos (term + definition)
        if (first.type !== second.type) {
            // Marcar como emparejados pero NO mostrar si son correctos
            first.element.classList.remove('selected');
            second.element.classList.remove('selected');
            first.element.classList.add('matched');
            second.element.classList.add('matched');

            // Guardar el emparejamiento para verificar después
            first.element.setAttribute('data-matched-with', second.value);
            second.element.setAttribute('data-matched-with', first.value);

            // Deshabilitar clicks
            first.element.style.pointerEvents = 'none';
            second.element.style.pointerEvents = 'none';

            // Limpiar selecciones
            selectedMatches[exerciseId] = [];
        } else {
            // BUG FIX: Si son del mismo tipo, ignorar el segundo click y deseleccionarlo
            second.element.classList.remove('selected');
            selectedMatches[exerciseId] = selectedMatches[exerciseId].filter(item => item.element !== second.element);
        }
    }
}

/**
 * Calcula la distancia de Levenshtein entre dos strings
 * Se usa para tolerancia de errores ortográficos
 * @param {string} str1 - Primera cadena
 * @param {string} str2 - Segunda cadena
 * @returns {number} - Distancia de edición
 */
function levenshteinDistance(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));

    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,      // deletion
                matrix[i][j - 1] + 1,      // insertion
                matrix[i - 1][j - 1] + cost // substitution
            );
        }
    }

    return matrix[len1][len2];
}

/**
 * Verifica si la respuesta del usuario es suficientemente similar a la correcta
 * Tolera hasta 20% de error (80% de similitud)
 * @param {string} userAnswer - Respuesta del usuario
 * @param {string} correctAnswer - Respuesta correcta
 * @returns {boolean}
 */
function isSimilarEnough(userAnswer, correctAnswer) {
    const distance = levenshteinDistance(userAnswer.toLowerCase(), correctAnswer.toLowerCase());
    const maxLength = Math.max(userAnswer.length, correctAnswer.length);
    const similarity = 1 - (distance / maxLength);

    return similarity >= 0.80; // 80% de similitud
}

/**
 * Maneja la selección de opciones en ejercicios de opción múltiple
 * @param {HTMLElement} element - Elemento clickeado
 * @param {string} questionId - ID de la pregunta
 */
function selectOption(element, questionId) {
    // Deseleccionar todas las opciones de esta pregunta
    const allOptions = document.querySelectorAll(`[onclick*="${questionId}"]`);
    allOptions.forEach(opt => opt.classList.remove('selected'));

    // Seleccionar la opción clickeada
    element.classList.add('selected');
}

/**
 * Verifica si un ejercicio ya fue completado
 * @param {string} exerciseId - ID del ejercicio
 * @returns {boolean}
 */
function isExerciseCompleted(exerciseId) {
    const studentInfo = getStudentInfo();
    const storageKey = `${studentInfo.email}_${exerciseId}_completed`;
    return localStorage.getItem(storageKey) === 'true';
}

/**
 * Bloquea un ejercicio después de completarlo
 * @param {string} exerciseId - ID del ejercicio
 */
function lockExercise(exerciseId) {
    const exercise = document.getElementById(exerciseId);
    if (!exercise) return;

    // Deshabilitar todos los inputs, textareas y selects
    exercise.querySelectorAll('input, textarea, select').forEach(el => {
        el.disabled = true;
    });

    // Bloquear todos los option-items (opciones clickeables)
    exercise.querySelectorAll('.option-item').forEach(el => {
        el.classList.add('locked');
        el.style.pointerEvents = 'none';
    });

    // Bloquear tick-options (checkboxes visuales)
    exercise.querySelectorAll('.tick-option').forEach(el => {
        el.classList.add('locked');
        el.style.pointerEvents = 'none';
    });

    // Deshabilitar botón de check
    const checkButton = exercise.querySelector('.btn-check');
    if (checkButton) {
        checkButton.disabled = true;
    }

    // Guardar estado de completado
    const studentInfo = getStudentInfo();
    const storageKey = `${studentInfo.email}_${exerciseId}_completed`;
    localStorage.setItem(storageKey, 'true');
}

// ============================================================================
// 6. EXERCISE CHECK FUNCTIONS
// ============================================================================

/**
 * EJERCICIO 1: Match the Terms (Matching)
 * Valida emparejamientos de términos y definiciones
 */
function checkExercise1() {
    const exercise = document.getElementById('exercise1');
    const feedback = exercise.querySelector('.feedback-message');

    // Check if already completed
    if (isExerciseCompleted('exercise1')) {
        feedback.textContent = '✓ Exercise already completed and locked.';
        feedback.style.color = '#28a745';
        return;
    }

    const items = exercise.querySelectorAll('.option-item.matched');

    if (items.length === 0) {
        feedback.textContent = '✗ Please match all terms with their definitions.';
        feedback.style.color = '#dc3545';
        return;
    }

    let correctCount = 0;
    const matches = [];

    // Verificar cada par
    items.forEach(item => {
        const itemValue = item.getAttribute('data-match');
        const matchedWith = item.getAttribute('data-matched-with');

        // Comprobar si el emparejamiento es correcto
        if (itemValue === matchedWith) {
            item.classList.add('correct');
            correctCount++;
        } else {
            item.classList.add('incorrect');
        }

        item.classList.add('locked');
        matches.push({ item: itemValue, matchedWith: matchedWith });
    });

    const totalPairs = items.length / 2;
    const correctPairs = correctCount / 2;

    // Guardar en localStorage
    const studentInfo = getStudentInfo();
    const storageKey = `${studentInfo.email}_exercise1_matches`;
    localStorage.setItem(storageKey, JSON.stringify({
        matches: matches,
        score: `${correctPairs}/${totalPairs}`,
        timestamp: new Date().toISOString()
    }));

    // Mostrar resultado
    if (correctPairs === totalPairs) {
        feedback.textContent = `✓ Perfect! All ${totalPairs} pairs are correct.`;
        feedback.style.color = '#28a745';
    } else {
        feedback.textContent = `Score: ${correctPairs}/${totalPairs} correct pairs.`;
        feedback.style.color = '#856404';
    }

    // Enviar al backend
    sendToBackend({
        type: 'exercise_score',
        data: {
            module: `module-${MODULE_CONFIG.moduleNumber}`,
            exercise: 'exercise1',
            exerciseType: 'matching',
            studentEmail: studentInfo.email,
            studentName: studentInfo.name,
            score: `${correctPairs}/${totalPairs}`,
            percentage: (correctPairs / totalPairs * 100).toFixed(1),
            isCorrect: correctPairs === totalPairs,
            userAnswers: matches,
            timestamp: new Date().toISOString()
        }
    });

    // Guardar estado y actualizar progreso
    saveExerciseState('exercise1', { completed: true, score: `${correctPairs}/${totalPairs}` });
    updateProgressBar();

    // Lock exercise permanently
    lockExercise('exercise1');
}

/**
 * EJERCICIO 2: Fill in the Blanks
 * Valida respuestas de completar espacios en blanco
 */
function checkExercise2() {
    const exercise = document.getElementById('exercise2');
    const feedback = exercise.querySelector('.feedback-message');

    // Check if already completed
    if (isExerciseCompleted('exercise2')) {
        feedback.textContent = '✓ Exercise already completed and locked.';
        feedback.style.color = '#28a745';
        return;
    }

    const inputs = exercise.querySelectorAll('.fill-blank-input');
    const studentInfo = getStudentInfo();

    // Verificar que todos los campos estén llenos
    let allFilled = true;
    inputs.forEach(input => {
        if (!input.value.trim()) {
            allFilled = false;
        }
    });

    if (!allFilled) {
        feedback.textContent = '✗ Please complete all blanks before checking.';
        feedback.style.color = '#dc3545';
        return;
    }

    let allCorrect = true;
    let correctCount = 0;
    const userAnswers = [];

    inputs.forEach(input => {
        const correctAnswer = input.getAttribute('data-answer').toLowerCase().trim();
        const userAnswer = input.value.toLowerCase().trim();
        const isCorrect = userAnswer === correctAnswer || isSimilarEnough(userAnswer, correctAnswer);

        // Usar fuzzy matching para tolerancia
        if (isCorrect) {
            input.classList.add('correct');
            input.disabled = true;
            correctCount++;
        } else {
            input.classList.add('incorrect');
            input.disabled = true;
            allCorrect = false;
        }

        // Guardar respuesta para enviar al backend
        userAnswers.push({
            inputId: input.id,
            userAnswer: userAnswer,
            correctAnswer: correctAnswer,
            isCorrect: isCorrect
        });

        // Guardar respuesta individual en localStorage
        const storageKey = `${studentInfo.email}_exercise2_${input.id}`;
        localStorage.setItem(storageKey, JSON.stringify({
            answer: userAnswer,
            correct: isCorrect,
            timestamp: new Date().toISOString()
        }));
    });

    // Mostrar feedback
    if (allCorrect) {
        feedback.textContent = '✓ Excellent! All answers are correct.';
        feedback.style.color = '#28a745';
    } else {
        feedback.textContent = `Score: ${correctCount}/${inputs.length} correct.`;
        feedback.style.color = '#856404';
    }

    // Enviar al backend
    sendToBackend({
        type: 'exercise_score',
        data: {
            module: `module-${MODULE_CONFIG.moduleNumber}`,
            exercise: 'exercise2',
            exerciseType: 'fill-blanks',
            studentEmail: studentInfo.email,
            studentName: studentInfo.name,
            score: `${correctCount}/${inputs.length}`,
            percentage: (correctCount / inputs.length * 100).toFixed(1),
            isCorrect: allCorrect,
            userAnswers: userAnswers,
            timestamp: new Date().toISOString()
        }
    });

    saveExerciseState('exercise2', { completed: true, score: `${correctCount}/${inputs.length}` });
    updateProgressBar();

    // Lock exercise permanently
    lockExercise('exercise2');
}

/**
 * EJERCICIO 3: True/False Questions
 * Valida preguntas de verdadero/falso
 */
function checkExercise3() {
    const exercise = document.getElementById('exercise3');
    const feedback = exercise.querySelector('.feedback-message');

    // Check if already completed
    if (isExerciseCompleted('exercise3')) {
        feedback.textContent = '✓ Exercise already completed and locked.';
        feedback.style.color = '#28a745';
        return;
    }

    const questions = exercise.querySelectorAll('.option-item.selected');

    if (questions.length < 5) {
        feedback.textContent = '✗ Please answer all 5 questions.';
        feedback.style.color = '#dc3545';
        return;
    }

    let correctCount = 0;
    const userAnswers = [];

    questions.forEach((option, index) => {
        const isCorrect = option.getAttribute('data-correct') === 'true';
        if (isCorrect) {
            option.classList.add('correct');
            correctCount++;
        } else {
            option.classList.add('incorrect');
        }
        userAnswers.push({
            question: index + 1,
            answer: option.textContent.trim(),
            isCorrect: isCorrect
        });
    });

    // Always show score
    feedback.textContent = `Score: ${correctCount}/5 correct.`;
    feedback.style.color = correctCount === 5 ? '#28a745' : '#856404';

    const studentInfo = getStudentInfo();
    sendToBackend({
        type: 'exercise_score',
        data: {
            module: `module-${MODULE_CONFIG.moduleNumber}`,
            exercise: 'exercise3',
            exerciseType: 'true-false',
            studentEmail: studentInfo.email,
            studentName: studentInfo.name,
            score: `${correctCount}/5`,
            percentage: (correctCount / 5 * 100).toFixed(1),
            isCorrect: correctCount === 5,
            userAnswers: userAnswers,
            timestamp: new Date().toISOString()
        }
    });

    saveExerciseState('exercise3', { completed: true, score: `${correctCount}/5` });
    updateProgressBar();

    // Lock exercise permanently
    lockExercise('exercise3');
}

/**
 * EJERCICIO 4: Multiple Choice (Reading Comprehension)
 * Valida preguntas de opción múltiple
 */
function checkExercise4() {
    const exercise = document.getElementById('exercise4');
    const feedback = exercise.querySelector('.feedback-message');

    // Check if already completed
    if (isExerciseCompleted('exercise4')) {
        feedback.textContent = '✓ Exercise already completed and locked.';
        feedback.style.color = '#28a745';
        return;
    }

    const questions = ['ex4-q1', 'ex4-q2', 'ex4-q3', 'ex4-q4'];
    const studentInfo = getStudentInfo();

    let correctCount = 0;
    let allAnswered = true;
    const totalQuestions = questions.length;
    const userAnswers = [];

    questions.forEach(qId => {
        // Fixed selector - look within exercise4 for selected options
        const selected = exercise.querySelector(`.option-item.selected[data-question="${qId}"]`) ||
                        exercise.querySelector(`[onclick*="${qId}"].selected`);

        if (!selected) {
            allAnswered = false;
            return;
        }

        const isCorrect = selected.getAttribute('data-correct') === 'true';

        if (isCorrect) {
            selected.classList.add('correct');
            correctCount++;
        } else {
            selected.classList.add('incorrect');
        }

        // Guardar respuesta para enviar
        userAnswers.push({
            questionId: qId,
            answer: selected.textContent.trim(),
            isCorrect: isCorrect
        });

        // Guardar respuesta individual
        const storageKey = `${studentInfo.email}_exercise4_${qId}`;
        localStorage.setItem(storageKey, JSON.stringify({
            selected: selected.textContent.trim(),
            correct: isCorrect,
            timestamp: new Date().toISOString()
        }));
    });

    if (!allAnswered) {
        feedback.textContent = '✗ Please answer all questions before checking.';
        feedback.style.color = '#dc3545';
        return;
    }

    feedback.textContent = `Score: ${correctCount}/${totalQuestions} correct.`;
    feedback.style.color = correctCount === totalQuestions ? '#28a745' : '#856404';

    sendToBackend({
        type: 'exercise_score',
        data: {
            module: `module-${MODULE_CONFIG.moduleNumber}`,
            exercise: 'exercise4',
            exerciseType: 'multiple-choice',
            studentEmail: studentInfo.email,
            studentName: studentInfo.name,
            score: `${correctCount}/${totalQuestions}`,
            percentage: (correctCount / totalQuestions * 100).toFixed(1),
            isCorrect: correctCount === totalQuestions,
            userAnswers: userAnswers,
            timestamp: new Date().toISOString()
        }
    });

    saveExerciseState('exercise4', { completed: true, score: `${correctCount}/${totalQuestions}` });
    updateProgressBar();

    // Lock exercise permanently
    lockExercise('exercise4');
}

/**
 * EJERCICIO 5: Find the Words (Fill in the blanks para términos)
 * Similar al ejercicio 2 pero con lista de palabras
 */
function checkExercise5() {
    const exercise = document.getElementById('exercise5');
    const feedback = exercise.querySelector('.feedback-message');

    // Check if already completed
    if (isExerciseCompleted('exercise5')) {
        feedback.textContent = '✓ Exercise already completed and locked.';
        feedback.style.color = '#28a745';
        return;
    }

    const inputs = exercise.querySelectorAll('.fill-blank-input');
    const studentInfo = getStudentInfo();

    // Verificar que todos los campos estén llenos
    let allFilled = true;
    inputs.forEach(input => {
        if (!input.value.trim()) {
            allFilled = false;
        }
    });

    if (!allFilled) {
        feedback.textContent = '✗ Please complete all blanks before checking.';
        feedback.style.color = '#dc3545';
        return;
    }

    let correctCount = 0;

    inputs.forEach(input => {
        const correctAnswer = input.getAttribute('data-answer').toLowerCase().trim();
        const userAnswer = input.value.toLowerCase().trim();

        if (userAnswer === correctAnswer || isSimilarEnough(userAnswer, correctAnswer)) {
            input.classList.add('correct');
            input.disabled = true;
            correctCount++;
        } else {
            input.classList.add('incorrect');
            input.disabled = true;
        }

        const storageKey = `${studentInfo.email}_exercise5_${input.id}`;
        localStorage.setItem(storageKey, JSON.stringify({
            answer: userAnswer,
            correct: userAnswer === correctAnswer || isSimilarEnough(userAnswer, correctAnswer),
            timestamp: new Date().toISOString()
        }));
    });

    feedback.textContent = `Score: ${correctCount}/${inputs.length} correct.`;
    feedback.style.color = correctCount === inputs.length ? '#28a745' : '#856404';

    sendToBackend({
        type: 'exercise_score',
        data: {
            module: `module-${MODULE_CONFIG.moduleNumber}`,
            exercise: 'exercise5',
            studentEmail: studentInfo.email,
            score: `${correctCount}/${inputs.length}`,
            percentage: (correctCount / inputs.length * 100).toFixed(1),
            timestamp: new Date().toISOString()
        }
    });

    saveExerciseState('exercise5', { completed: true, score: `${correctCount}/${inputs.length}` });
    updateProgressBar();

    // Lock exercise permanently
    lockExercise('exercise5');
}

/**
 * EJERCICIO 6: Listen and Tick (Listening - Checkboxes)
 * Valida selecciones de checkboxes
 */
function checkExercise6() {
    const exercise = document.getElementById('exercise6');
    const feedback = exercise.querySelector('.feedback-message');

    // Check if already completed
    if (isExerciseCompleted('exercise6')) {
        feedback.textContent = '✓ Exercise already completed and locked.';
        feedback.style.color = '#28a745';
        return;
    }

    const tickOptions = exercise.querySelectorAll('.tick-option');
    const studentInfo = getStudentInfo();

    let totalCorrect = 0;
    const totalStatements = 7;

    tickOptions.forEach(div => {
        const checkboxId = div.getAttribute('data-checkbox-id');
        const checkbox = document.getElementById(checkboxId);
        const isCorrect = div.getAttribute('data-correct') === 'true';
        const isChecked = checkbox.checked;

        // Bloquear el div
        div.classList.add('locked');
        div.style.cursor = 'not-allowed';

        // Colorear según corrección
        if (isChecked && isCorrect) {
            // Correcto - marcado cuando debía
            div.style.borderColor = '#28a745';
            div.style.backgroundColor = '#d4edda';
            totalCorrect++;
        } else if (isChecked && !isCorrect) {
            // Incorrecto - marcado cuando no debía
            div.style.borderColor = '#dc3545';
            div.style.backgroundColor = '#f8d7da';
        } else if (!isChecked && isCorrect) {
            // Incorrecto - NO marcado cuando debía
            div.style.borderColor = '#ffc107';
            div.style.backgroundColor = '#fff3cd';
        }
        // Si no está marcado y no debía estarlo, dejar sin color (correcto implícito)
        else {
            totalCorrect++;
        }

        // Guardar estado
        const storageKey = `${studentInfo.email}_exercise6_${checkboxId}`;
        localStorage.setItem(storageKey, JSON.stringify({
            checked: isChecked,
            correct: (isChecked && isCorrect) || (!isChecked && !isCorrect),
            timestamp: new Date().toISOString()
        }));
    });

    feedback.textContent = `Score: ${totalCorrect}/${totalStatements} correct.`;
    feedback.style.color = totalCorrect === totalStatements ? '#28a745' : '#856404';

    sendToBackend({
        type: 'exercise_score',
        data: {
            module: `module-${MODULE_CONFIG.moduleNumber}`,
            exercise: 'exercise6',
            studentEmail: studentInfo.email,
            score: `${totalCorrect}/${totalStatements}`,
            percentage: (totalCorrect / totalStatements * 100).toFixed(1),
            timestamp: new Date().toISOString()
        }
    });

    saveExerciseState('exercise6', { completed: true, score: `${totalCorrect}/${totalStatements}` });
    updateProgressBar();

    // Lock exercise permanently
    lockExercise('exercise6');
}

/**
 * EJERCICIO 7: Listen Again and Complete (Listening - Fill in blanks)
 * Similar al ejercicio 2 pero para listening
 */
function checkExercise7() {
    const exercise = document.getElementById('exercise7');
    const feedback = exercise.querySelector('.feedback-message');

    // Check if already completed
    if (isExerciseCompleted('exercise7')) {
        feedback.textContent = '✓ Exercise already completed and locked.';
        feedback.style.color = '#28a745';
        return;
    }

    const inputs = exercise.querySelectorAll('.fill-blank-input');
    const studentInfo = getStudentInfo();

    // Verificar que todos los campos estén llenos
    let allFilled = true;
    inputs.forEach(input => {
        if (!input.value.trim()) {
            allFilled = false;
        }
    });

    if (!allFilled) {
        feedback.textContent = '✗ Please complete all blanks before checking.';
        feedback.style.color = '#dc3545';
        return;
    }

    let correctCount = 0;

    inputs.forEach(input => {
        const correctAnswer = input.getAttribute('data-answer').toLowerCase().trim();
        const userAnswer = input.value.toLowerCase().trim();

        if (userAnswer === correctAnswer || isSimilarEnough(userAnswer, correctAnswer)) {
            input.classList.add('correct');
            input.disabled = true;
            correctCount++;
        } else {
            input.classList.add('incorrect');
            input.disabled = true;
        }

        const storageKey = `${studentInfo.email}_exercise7_${input.id}`;
        localStorage.setItem(storageKey, JSON.stringify({
            answer: userAnswer,
            correct: userAnswer === correctAnswer || isSimilarEnough(userAnswer, correctAnswer),
            timestamp: new Date().toISOString()
        }));
    });

    feedback.textContent = `Score: ${correctCount}/${inputs.length} correct.`;
    feedback.style.color = correctCount === inputs.length ? '#28a745' : '#856404';

    sendToBackend({
        type: 'exercise_score',
        data: {
            module: `module-${MODULE_CONFIG.moduleNumber}`,
            exercise: 'exercise7',
            studentEmail: studentInfo.email,
            score: `${correctCount}/${inputs.length}`,
            percentage: (correctCount / inputs.length * 100).toFixed(1),
            timestamp: new Date().toISOString()
        }
    });

    saveExerciseState('exercise7', { completed: true, score: `${correctCount}/${inputs.length}` });
    updateProgressBar();

    // Lock exercise permanently
    lockExercise('exercise7');
}

/**
 * EJERCICIO 8: Match Speakers (Multiple choice para listening)
 * Similar al ejercicio 4
 */
function checkExercise8() {
    const exercise = document.getElementById('exercise8');
    const feedback = exercise.querySelector('.feedback-message');

    // Check if already completed
    if (isExerciseCompleted('exercise8')) {
        feedback.textContent = '✓ Exercise already completed and locked.';
        feedback.style.color = '#28a745';
        return;
    }

    const selectedOptions = exercise.querySelectorAll('.option-item.selected');
    const studentInfo = getStudentInfo();

    if (selectedOptions.length < 3) {
        feedback.textContent = '✗ Please answer all 3 questions.';
        feedback.style.color = '#dc3545';
        return;
    }

    let correctCount = 0;

    selectedOptions.forEach(option => {
        const isCorrect = option.getAttribute('data-correct') === 'true';
        if (isCorrect) {
            option.classList.add('correct');
            correctCount++;
        } else {
            option.classList.add('incorrect');
        }
    });

    feedback.textContent = `Score: ${correctCount}/3 correct.`;
    feedback.style.color = correctCount === 3 ? '#28a745' : '#856404';

    sendToBackend({
        type: 'exercise_score',
        data: {
            module: `module-${MODULE_CONFIG.moduleNumber}`,
            exercise: 'exercise8',
            studentEmail: studentInfo.email,
            score: `${correctCount}/3`,
            percentage: (correctCount / 3 * 100).toFixed(1),
            timestamp: new Date().toISOString()
        }
    });

    saveExerciseState('exercise8', { completed: true, score: `${correctCount}/3` });
    updateProgressBar();

    // Lock exercise permanently
    lockExercise('exercise8');
}

/**
 * EJERCICIO 9: Análisis/Identificación (Single choice)
 */
function checkExercise9() {
    const exercise = document.getElementById('exercise9');
    const feedback = exercise.querySelector('.feedback-message');

    // Check if already completed
    if (isExerciseCompleted('exercise9')) {
        feedback.textContent = '✓ Exercise already completed and locked.';
        feedback.style.color = '#28a745';
        return;
    }

    const selected = exercise.querySelector('.option-item.selected');

    if (!selected) {
        feedback.textContent = '✗ Please select an answer.';
        feedback.style.color = '#dc3545';
        return;
    }

    const isCorrect = selected.getAttribute('data-correct') === 'true';

    if (isCorrect) {
        selected.classList.add('correct');
    } else {
        selected.classList.add('incorrect');
    }

    // Always show score
    feedback.textContent = `Score: ${isCorrect ? '1' : '0'}/1 correct.`;
    feedback.style.color = isCorrect ? '#28a745' : '#856404';

    const studentInfo = getStudentInfo();
    sendToBackend({
        type: 'exercise_score',
        data: {
            module: `module-${MODULE_CONFIG.moduleNumber}`,
            exercise: 'exercise9',
            studentEmail: studentInfo.email,
            score: isCorrect ? '1/1' : '0/1',
            percentage: isCorrect ? '100' : '0',
            timestamp: new Date().toISOString()
        }
    });

    saveExerciseState('exercise9', { completed: true, score: isCorrect ? '1/1' : '0/1' });
    updateProgressBar();

    // Lock exercise permanently
    lockExercise('exercise9');
}

/**
 * EJERCICIO 10: Matching (similar al ejercicio 1)
 */
function checkExercise10() {
    const exercise = document.getElementById('exercise10');
    const feedback = exercise.querySelector('.feedback-message');

    // Check if already completed
    if (isExerciseCompleted('exercise10')) {
        feedback.textContent = '✓ Exercise already completed and locked.';
        feedback.style.color = '#28a745';
        return;
    }

    const items = exercise.querySelectorAll('.option-item.matched');

    if (items.length === 0) {
        feedback.textContent = '✗ Please match all terms.';
        feedback.style.color = '#dc3545';
        return;
    }

    let correctCount = 0;
    const matches = [];

    items.forEach(item => {
        const itemValue = item.getAttribute('data-match');
        const matchedWith = item.getAttribute('data-matched-with');

        if (itemValue === matchedWith) {
            item.classList.add('correct');
            correctCount++;
        } else {
            item.classList.add('incorrect');
        }

        item.classList.add('locked');
        matches.push({ item: itemValue, matchedWith: matchedWith });
    });

    const totalPairs = items.length / 2;
    const correctPairs = correctCount / 2;

    const studentInfo = getStudentInfo();
    const storageKey = `${studentInfo.email}_exercise10_matches`;
    localStorage.setItem(storageKey, JSON.stringify({
        matches: matches,
        score: `${correctPairs}/${totalPairs}`,
        timestamp: new Date().toISOString()
    }));

    feedback.textContent = `Score: ${correctPairs}/${totalPairs} correct.`;
    feedback.style.color = correctPairs === totalPairs ? '#28a745' : '#856404';

    sendToBackend({
        type: 'exercise_score',
        data: {
            module: `module-${MODULE_CONFIG.moduleNumber}`,
            exercise: 'exercise10',
            studentEmail: studentInfo.email,
            score: `${correctPairs}/${totalPairs}`,
            percentage: (correctPairs / totalPairs * 100).toFixed(1),
            timestamp: new Date().toISOString()
        }
    });

    saveExerciseState('exercise10', { completed: true, score: `${correctPairs}/${totalPairs}` });
    updateProgressBar();

    // Lock exercise permanently
    lockExercise('exercise10');
}

/**
 * EJERCICIO 11: Writing Task (Template/Essay)
 * Valida que los campos tengan contenido suficiente
 */
function checkExercise11() {
    const exercise = document.getElementById('exercise11');
    const feedback = exercise.querySelector('.feedback-message');

    // Check if already completed
    if (isExerciseCompleted('exercise11')) {
        feedback.textContent = '✓ Exercise already completed and locked.';
        feedback.style.color = '#28a745';
        return;
    }

    const date = document.getElementById('ex11-date');
    const number = document.getElementById('ex11-number');
    const circumstances = document.getElementById('ex11-circumstances');
    const impact = document.getElementById('ex11-impact');
    const request = document.getElementById('ex11-request');

    // Check if elements exist
    if (!date || !number || !circumstances || !impact || !request) {
        feedback.textContent = '✗ Error: Some form fields are missing.';
        feedback.style.color = '#dc3545';
        return;
    }

    // Clear previous validation classes
    [circumstances, impact, request].forEach(el => {
        el.classList.remove('incorrect', 'correct');
    });

    // Validar campos simples
    if (!date.value.trim() || !number.value.trim()) {
        feedback.textContent = '✗ Please fill in the date and contract number.';
        feedback.style.color = '#dc3545';
        return;
    }

    // Validar textareas (mínimo 20 caracteres)
    const textareas = [
        { element: circumstances, name: 'Circumstances' },
        { element: impact, name: 'Impact' },
        { element: request, name: 'Request' }
    ];
    let allValid = true;
    let invalidFields = [];

    textareas.forEach(({ element, name }) => {
        if (element.value.trim().length < 20) {
            element.classList.add('incorrect');
            allValid = false;
            invalidFields.push(name);
        } else {
            element.classList.add('correct');
        }
    });

    if (!allValid) {
        feedback.textContent = `✗ Please provide more detail in: ${invalidFields.join(', ')} (min 20 characters each).`;
        feedback.style.color = '#dc3545';
        return;
    }

    // All validation passed - show score
    feedback.textContent = 'Score: 1/1 correct. Your force majeure notice is complete!';
    feedback.style.color = '#28a745';

    const studentInfo = getStudentInfo();
    sendToBackend({
        type: 'exercise_score',
        data: {
            module: `module-${MODULE_CONFIG.moduleNumber}`,
            exercise: 'exercise11',
            studentEmail: studentInfo.email,
            score: '1/1',
            percentage: '100',
            writingContent: {
                date: date.value,
                number: number.value,
                circumstances: circumstances.value,
                impact: impact.value,
                request: request.value
            },
            timestamp: new Date().toISOString()
        }
    });

    saveExerciseState('exercise11', { completed: true, score: '1/1' });
    updateProgressBar();

    // Lock exercise permanently
    lockExercise('exercise11');
}

/**
 * Muestra hint para ejercicio 11 (ejemplo de respuesta)
 */
function showExercise11Hint() {
    const feedback = document.querySelector('#exercise11 .feedback-message');
    feedback.innerHTML = `
        <strong>💡 Example Answers:</strong><br><br>
        <strong>Circumstances:</strong> "Due to unprecedented flooding in our manufacturing region,
        our facility has been forced to suspend operations as of [date]. This event was unforeseeable
        and beyond our reasonable control."<br><br>
        <strong>Impact:</strong> "As a result, we are unable to manufacture and deliver the goods
        specified in sections 3.2 and 3.4 of our contract by the agreed deadline of [date]."<br><br>
        <strong>Request:</strong> "We hereby request an extension of 30 days for performance of our
        obligations under the contract, in accordance with the force majeure clause in Section 12."
    `;
    feedback.style.color = '#856404';
}

// ============================================================================
// 7. STATE PERSISTENCE FUNCTIONS
// ============================================================================

/**
 * Guarda el estado de un ejercicio completado
 * @param {string} exerciseId - ID del ejercicio
 * @param {Object} state - Estado a guardar {completed: boolean, score: string}
 */
function saveExerciseState(exerciseId, state) {
    exerciseStates[exerciseId] = state;

    const storageKey = `module${MODULE_CONFIG.moduleNumber}_exercises`;
    localStorage.setItem(storageKey, JSON.stringify(exerciseStates));

    const studentInfo = getStudentInfo();
    sendToBackend({
        type: 'exercise_completion',
        data: {
            module: `module-${MODULE_CONFIG.moduleNumber}`,
            exercise: exerciseId,
            studentEmail: studentInfo.email,
            state: state,
            timestamp: new Date().toISOString()
        }
    });
}

/**
 * Restaura todos los estados de ejercicios guardados
 * Bloquea los ejercicios que ya fueron completados
 */
function restoreAllExercises() {
    const storageKey = `module${MODULE_CONFIG.moduleNumber}_exercises`;
    const saved = localStorage.getItem(storageKey);

    if (saved) {
        exerciseStates = JSON.parse(saved);
        console.log('Estados restaurados:', exerciseStates);
    }

    // Restaurar estados de bloqueo para ejercicios completados
    const studentInfo = getStudentInfo();
    for (let i = 1; i <= MODULE_CONFIG.totalExercises; i++) {
        const exerciseId = `exercise${i}`;
        const completedKey = `${studentInfo.email}_${exerciseId}_completed`;
        const isCompleted = localStorage.getItem(completedKey) === 'true';

        if (isCompleted) {
            const exercise = document.getElementById(exerciseId);
            if (exercise) {
                // Bloquear todos los inputs, textareas y selects
                exercise.querySelectorAll('input, textarea, select').forEach(el => {
                    el.disabled = true;
                });

                // Bloquear todos los option-items (opciones clickeables)
                exercise.querySelectorAll('.option-item').forEach(el => {
                    el.classList.add('locked');
                    el.style.pointerEvents = 'none';
                });

                // Bloquear tick-options (checkboxes visuales)
                exercise.querySelectorAll('.tick-option').forEach(el => {
                    el.classList.add('locked');
                    el.style.pointerEvents = 'none';
                });

                // Deshabilitar botón de check
                const checkButton = exercise.querySelector('.btn-check');
                if (checkButton) {
                    checkButton.disabled = true;
                }

                // Mostrar mensaje de completado en el feedback
                const feedback = exercise.querySelector('.feedback-message');
                if (feedback && exerciseStates[exerciseId]) {
                    const score = exerciseStates[exerciseId].score;
                    feedback.textContent = `✓ Completed (Score: ${score})`;
                    feedback.style.color = '#28a745';
                }

                console.log(`✓ Ejercicio ${exerciseId} restaurado como completado`);
            }
        }
    }
}

// ============================================================================
// 8. SURVEY FUNCTIONS
// ============================================================================

/**
 * Maneja el envío de la encuesta de satisfacción del módulo
 * @param {Event} event - Evento del formulario
 */
function handleSurveySubmit(event) {
    event.preventDefault();

    const form = document.getElementById('survey-form');
    if (!form) return;

    const formData = new FormData(form);
    const studentInfo = getStudentInfo();

    // Capturar todos los campos del survey (compatibles con diferentes formularios)
    const surveyData = {
        module: `module-${MODULE_CONFIG.moduleNumber}`,
        studentEmail: studentInfo.email,
        studentName: studentInfo.name,
        // Campos de dificultad y calidad
        difficulty: formData.get('difficulty') || '',
        quality: formData.get('quality') || formData.get('rating') || '',
        rating: formData.get('rating') || formData.get('quality') || '',
        // Campos de texto (soportar ambos formatos de nombre)
        mostUseful: formData.get('most_useful') || formData.get('most-useful') || '',
        leastUseful: formData.get('least_useful') || formData.get('least-useful') || '',
        suggestions: formData.get('suggestions') || '',
        // Tiempo invertido
        timeSpent: formData.get('time_spent') || formData.get('time-spent') || '',
        timestamp: new Date().toISOString()
    };

    // Guardar en localStorage
    const surveysKey = 'module_surveys';
    let surveys = JSON.parse(localStorage.getItem(surveysKey) || '[]');
    surveys.push(surveyData);
    localStorage.setItem(surveysKey, JSON.stringify(surveys));

    // Enviar al backend
    sendToBackend({
        type: 'survey_response',
        data: surveyData
    });

    // Mostrar confirmación
    const feedback = document.getElementById('survey-feedback');
    if (feedback) {
        feedback.textContent = '✓ Thank you for your feedback!';
        feedback.style.color = '#28a745';
        feedback.style.display = 'block';
    }

    // Deshabilitar formulario SIN borrar las respuestas
    // No llamar form.reset() para preservar las respuestas
    form.querySelectorAll('input, textarea, button, select').forEach(el => {
        el.disabled = true;
    });
}

// ============================================================================
// 9. INITIALIZATION
// ============================================================================

/**
 * Inicializa todas las funcionalidades del módulo cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log(`📚 Módulo ${MODULE_CONFIG.moduleNumber} - ${MODULE_CONFIG.moduleName} cargado`);

    // Cargar información del estudiante
    loadStudentInfo();

    // Restaurar estados de ejercicios
    restoreAllExercises();

    // Cargar progreso
    loadProgress();

    // Configurar controles de video para móvil
    const video = document.querySelector('video');
    if (video && window.innerWidth <= 768) {
        video.controls = false;

        const toggleControls = document.createElement('button');
        toggleControls.textContent = '▶️ Show Controls';
        toggleControls.style.cssText = 'padding: 10px; background: var(--primary); color: white; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 10px;';

        video.parentNode.insertBefore(toggleControls, video);

        toggleControls.addEventListener('click', function() {
            video.controls = !video.controls;
            toggleControls.textContent = video.controls ? '⏸️ Hide Controls' : '▶️ Show Controls';
        });
    }

    // Configurar clicks en tick-options para ejercicio 6
    document.querySelectorAll('.tick-option').forEach(div => {
        div.addEventListener('click', function(e) {
            if (this.classList.contains('locked')) return;

            const checkboxId = this.getAttribute('data-checkbox-id');
            const checkbox = document.getElementById(checkboxId);

            if (checkbox && !checkbox.disabled) {
                checkbox.checked = !checkbox.checked;
            }
        });
    });

    // Configurar envío de encuesta
    const surveyForm = document.getElementById('survey-form');
    if (surveyForm) {
        surveyForm.addEventListener('submit', handleSurveySubmit);
    }

    console.log('✅ Todas las funcionalidades inicializadas correctamente');
});

// ============================================================================
// 10. EXPORT (si se usa como módulo ES6)
// ============================================================================

// Si estás usando módulos ES6, puedes exportar las funciones
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Exportar funciones principales
        saveStudentInfo,
        checkExercise1,
        checkExercise2,
        checkExercise3,
        checkExercise4,
        checkExercise5,
        checkExercise6,
        checkExercise7,
        checkExercise8,
        checkExercise9,
        checkExercise10,
        checkExercise11,
        selectOption,
        selectMatch,
        showExercise11Hint,
        isExerciseCompleted,
        lockExercise
    };
}
