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

// Variable global que cada módulo debe definir ANTES de cargar este script
// Ejemplo: window.MODULE_CONFIG = { moduleNumber: 2, moduleName: 'Contract Law', ... }
window.MODULE_CONFIG = window.MODULE_CONFIG || {
    moduleNumber: 1,
    moduleName: 'Default Module',
    totalExercises: 11,
    backendURL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
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
            // Si son del mismo tipo, deseleccionar el primero y mantener el segundo
            first.element.classList.remove('selected');
            selectedMatches[exerciseId] = [second];
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
            studentEmail: studentInfo.email,
            score: `${correctPairs}/${totalPairs}`,
            percentage: (correctPairs / totalPairs * 100).toFixed(1),
            timestamp: new Date().toISOString()
        }
    });

    // Guardar estado y actualizar progreso
    saveExerciseState('exercise1', { completed: true, score: `${correctPairs}/${totalPairs}` });
    updateProgressBar();

    // Deshabilitar botón
    const checkButton = exercise.querySelector('.btn-check');
    if (checkButton) checkButton.disabled = true;
}

/**
 * EJERCICIO 2: Fill in the Blanks
 * Valida respuestas de completar espacios en blanco
 */
function checkExercise2() {
    const exercise = document.getElementById('exercise2');
    const feedback = exercise.querySelector('.feedback-message');
    const inputs = exercise.querySelectorAll('.fill-blank-input');
    const studentInfo = getStudentInfo();

    let allCorrect = true;
    let correctCount = 0;

    inputs.forEach(input => {
        const correctAnswer = input.getAttribute('data-answer').toLowerCase().trim();
        const userAnswer = input.value.toLowerCase().trim();

        // Usar fuzzy matching para tolerancia
        if (userAnswer === correctAnswer || isSimilarEnough(userAnswer, correctAnswer)) {
            input.classList.add('correct');
            input.disabled = true;
            correctCount++;
        } else {
            input.classList.add('incorrect');
            input.disabled = true;
            allCorrect = false;
        }

        // Guardar respuesta individual
        const storageKey = `${studentInfo.email}_exercise2_${input.id}`;
        localStorage.setItem(storageKey, JSON.stringify({
            answer: userAnswer,
            correct: userAnswer === correctAnswer || isSimilarEnough(userAnswer, correctAnswer),
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
            studentEmail: studentInfo.email,
            score: `${correctCount}/${inputs.length}`,
            percentage: (correctCount / inputs.length * 100).toFixed(1),
            timestamp: new Date().toISOString()
        }
    });

    saveExerciseState('exercise2', { completed: true, score: `${correctCount}/${inputs.length}` });
    updateProgressBar();

    const checkButton = exercise.querySelector('.btn-check');
    if (checkButton) checkButton.disabled = true;
}

/**
 * EJERCICIO 3: True/False Questions
 * Valida preguntas de verdadero/falso
 */
function checkExercise3() {
    const exercise = document.getElementById('exercise3');
    const feedback = exercise.querySelector('.feedback-message');
    const questions = exercise.querySelectorAll('.option-item.selected');

    if (questions.length < 5) {
        feedback.textContent = '✗ Please answer all 5 questions.';
        feedback.style.color = '#dc3545';
        return;
    }

    let allCorrect = true;
    let correctCount = 0;

    questions.forEach(option => {
        const isCorrect = option.getAttribute('data-correct') === 'true';
        if (isCorrect) {
            option.classList.add('correct');
            correctCount++;
        } else {
            option.classList.add('incorrect');
            allCorrect = false;
        }
    });

    if (allCorrect) {
        feedback.textContent = '✓ Perfect! All answers are correct.';
        feedback.style.color = '#28a745';
    } else {
        feedback.textContent = `Score: ${correctCount}/5 correct.`;
        feedback.style.color = '#856404';
    }

    const studentInfo = getStudentInfo();
    sendToBackend({
        type: 'exercise_score',
        data: {
            module: `module-${MODULE_CONFIG.moduleNumber}`,
            exercise: 'exercise3',
            studentEmail: studentInfo.email,
            score: `${correctCount}/5`,
            percentage: (correctCount / 5 * 100).toFixed(1),
            timestamp: new Date().toISOString()
        }
    });

    saveExerciseState('exercise3', { completed: true, score: `${correctCount}/5` });
    updateProgressBar();
}

/**
 * EJERCICIO 4: Multiple Choice (Reading Comprehension)
 * Valida preguntas de opción múltiple
 */
function checkExercise4() {
    const exercise = document.getElementById('exercise4');
    const feedback = exercise.querySelector('.feedback-message');
    const questions = ['ex4-q1', 'ex4-q2', 'ex4-q3', 'ex4-q4'];
    const studentInfo = getStudentInfo();

    let correctCount = 0;
    let allAnswered = true;
    const totalQuestions = questions.length;

    questions.forEach(qId => {
        const selected = document.querySelector(`[onclick*="${qId}"].selected`);

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
            studentEmail: studentInfo.email,
            score: `${correctCount}/${totalQuestions}`,
            percentage: (correctCount / totalQuestions * 100).toFixed(1),
            timestamp: new Date().toISOString()
        }
    });

    saveExerciseState('exercise4', { completed: true, score: `${correctCount}/${totalQuestions}` });
    updateProgressBar();

    const checkButton = exercise.querySelector('.btn-check');
    if (checkButton) checkButton.disabled = true;
}

/**
 * EJERCICIO 5: Find the Words (Fill in the blanks para términos)
 * Similar al ejercicio 2 pero con lista de palabras
 */
function checkExercise5() {
    const exercise = document.getElementById('exercise5');
    const feedback = exercise.querySelector('.feedback-message');
    const inputs = exercise.querySelectorAll('.fill-blank-input');
    const studentInfo = getStudentInfo();

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

    const checkButton = exercise.querySelector('.btn-check');
    if (checkButton) checkButton.disabled = true;
}

/**
 * EJERCICIO 6: Listen and Tick (Listening - Checkboxes)
 * Valida selecciones de checkboxes
 */
function checkExercise6() {
    const exercise = document.getElementById('exercise6');
    const feedback = exercise.querySelector('.feedback-message');
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

    const checkButton = exercise.querySelector('.btn-check');
    if (checkButton) checkButton.disabled = true;
}

/**
 * EJERCICIO 7: Listen Again and Complete (Listening - Fill in blanks)
 * Similar al ejercicio 2 pero para listening
 */
function checkExercise7() {
    const exercise = document.getElementById('exercise7');
    const feedback = exercise.querySelector('.feedback-message');
    const inputs = exercise.querySelectorAll('.fill-blank-input');
    const studentInfo = getStudentInfo();

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

    const checkButton = exercise.querySelector('.btn-check');
    if (checkButton) checkButton.disabled = true;
}

/**
 * EJERCICIO 8: Match Speakers (Multiple choice para listening)
 * Similar al ejercicio 4
 */
function checkExercise8() {
    const exercise = document.getElementById('exercise8');
    const feedback = exercise.querySelector('.feedback-message');
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
}

/**
 * EJERCICIO 9: Análisis/Identificación (Single choice)
 */
function checkExercise9() {
    const exercise = document.getElementById('exercise9');
    const feedback = exercise.querySelector('.feedback-message');
    const selected = exercise.querySelector('.option-item.selected');

    if (!selected) {
        feedback.textContent = '✗ Please select an answer.';
        feedback.style.color = '#dc3545';
        return;
    }

    const isCorrect = selected.getAttribute('data-correct') === 'true';

    if (isCorrect) {
        selected.classList.add('correct');
        feedback.textContent = '✓ Correct!';
        feedback.style.color = '#28a745';
    } else {
        selected.classList.add('incorrect');
        feedback.textContent = '✗ Incorrect. Review the case details.';
        feedback.style.color = '#dc3545';
    }

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
}

/**
 * EJERCICIO 10: Matching (similar al ejercicio 1)
 */
function checkExercise10() {
    const exercise = document.getElementById('exercise10');
    const feedback = exercise.querySelector('.feedback-message');
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

    const checkButton = exercise.querySelector('.btn-check');
    if (checkButton) checkButton.disabled = true;
}

/**
 * EJERCICIO 11: Writing Task (Template/Essay)
 * Valida que los campos tengan contenido suficiente
 */
function checkExercise11() {
    const exercise = document.getElementById('exercise11');
    const feedback = exercise.querySelector('.feedback-message');
    const date = document.getElementById('ex11-date');
    const number = document.getElementById('ex11-number');
    const circumstances = document.getElementById('ex11-circumstances');
    const impact = document.getElementById('ex11-impact');
    const request = document.getElementById('ex11-request');

    // Validar campos simples
    if (!date.value.trim() || !number.value.trim()) {
        feedback.textContent = '✗ Please fill in the date and contract number.';
        feedback.style.color = '#dc3545';
        return;
    }

    // Validar textareas (mínimo 20 caracteres)
    const textareas = [circumstances, impact, request];
    let allValid = true;

    textareas.forEach(textarea => {
        if (textarea.value.trim().length < 20) {
            textarea.classList.add('incorrect');
            allValid = false;
        } else {
            textarea.classList.add('correct');
            textarea.disabled = true;
        }
    });

    if (!allValid) {
        feedback.textContent = '✗ Please provide more detail in all sections (min 20 characters each).';
        feedback.style.color = '#dc3545';
        return;
    }

    date.disabled = true;
    number.disabled = true;

    feedback.textContent = '✓ Exercise completed! Your force majeure notice is complete.';
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
 */
function restoreAllExercises() {
    const storageKey = `module${MODULE_CONFIG.moduleNumber}_exercises`;
    const saved = localStorage.getItem(storageKey);

    if (saved) {
        exerciseStates = JSON.parse(saved);
        console.log('Estados restaurados:', exerciseStates);
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
    const formData = new FormData(form);
    const studentInfo = getStudentInfo();

    const surveyData = {
        module: `module-${MODULE_CONFIG.moduleNumber}`,
        studentEmail: studentInfo.email,
        rating: formData.get('rating'),
        mostUseful: formData.get('most-useful'),
        leastUseful: formData.get('least-useful'),
        suggestions: formData.get('suggestions'),
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
    feedback.textContent = '✓ Thank you for your feedback!';
    feedback.style.color = '#28a745';
    feedback.style.display = 'block';

    // Deshabilitar formulario
    form.querySelectorAll('input, textarea, button').forEach(el => el.disabled = true);
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
        showExercise11Hint
    };
}
