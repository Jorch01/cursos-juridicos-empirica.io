/**
 * GOOGLE APPS SCRIPT - SISTEMA DE RESPUESTAS Y CALIFICACIONES DE ESTUDIANTES
 *
 * Este script maneja el almacenamiento y análisis de respuestas de ejercicios
 * de los módulos 1-15 del curso Legal English.
 *
 * INSTALACIÓN:
 * 1. Crea un nuevo Google Sheet llamado "Legal English - Respuestas de Estudiantes"
 * 2. Ve a Extensiones > Apps Script
 * 3. Pega este código completo
 * 4. Ejecuta la función setupSheet() una sola vez para crear las hojas
 * 5. Despliega como Web App (Deploy > New deployment > Web app)
 * 6. Establece permisos: Execute as: Me, Who has access: Anyone
 * 7. Copia la URL del Web App y úsala en sendToBackend() del frontend
 *
 * ESTRUCTURA DE HOJAS:
 * - Respuestas: Todas las respuestas de ejercicios con puntuaciones
 * - Progreso: Resumen de progreso por estudiante/módulo
 * - Analytics: Estadísticas agregadas
 */

// ==================== CONFIGURACIÓN INICIAL ====================

/**
 * Ejecutar UNA SOLA VEZ después de pegar el código
 * Crea la estructura inicial de hojas
 */
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Hoja 1: Respuestas de Ejercicios
  let respuestasSheet = ss.getSheetByName('Respuestas');
  if (!respuestasSheet) {
    respuestasSheet = ss.insertSheet('Respuestas');

    // Headers
    const headers = [
      'Timestamp',
      'Email Estudiante',
      'Módulo',
      'Ejercicio',
      'Puntuación',
      'Porcentaje',
      'Intentos',
      'Tiempo Invertido (min)',
      'Respuestas Detalladas'
    ];

    respuestasSheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // Formateo
    respuestasSheet.getRange(1, 1, 1, headers.length)
      .setBackground('#1a472a')
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    // Congelar fila de headers
    respuestasSheet.setFrozenRows(1);

    // Auto-resize columnas
    for (let i = 1; i <= headers.length; i++) {
      respuestasSheet.autoResizeColumn(i);
    }

    // Validación de datos para columna Módulo
    const moduleRange = respuestasSheet.getRange('C2:C10000');
    const moduleRule = SpreadsheetApp.newDataValidation()
      .requireValueInList([
        'module-1', 'module-2', 'module-3', 'module-4', 'module-5',
        'module-6', 'module-7', 'module-8', 'module-9', 'module-10',
        'module-11', 'module-12', 'module-13', 'module-14', 'module-15'
      ])
      .setAllowInvalid(false)
      .build();
    moduleRange.setDataValidation(moduleRule);
  }

  // Hoja 2: Progreso por Estudiante
  let progresoSheet = ss.getSheetByName('Progreso');
  if (!progresoSheet) {
    progresoSheet = ss.insertSheet('Progreso');

    const headers = [
      'Email Estudiante',
      'Módulo',
      'Ejercicios Completados',
      'Total Ejercicios',
      'Porcentaje Completado',
      'Promedio de Puntuación',
      'Última Actividad',
      'Estado'
    ];

    progresoSheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // Formateo
    progresoSheet.getRange(1, 1, 1, headers.length)
      .setBackground('#2c5f2d')
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    progresoSheet.setFrozenRows(1);

    for (let i = 1; i <= headers.length; i++) {
      progresoSheet.autoResizeColumn(i);
    }
  }

  // Hoja 3: Analytics Agregados
  let analyticsSheet = ss.getSheetByName('Analytics');
  if (!analyticsSheet) {
    analyticsSheet = ss.insertSheet('Analytics');

    const headers = [
      'Módulo',
      'Ejercicio',
      'Total Intentos',
      'Promedio de Puntuación',
      'Tasa de Aprobación (%)',
      'Tiempo Promedio (min)',
      'Dificultad Percibida'
    ];

    analyticsSheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // Formateo
    analyticsSheet.getRange(1, 1, 1, headers.length)
      .setBackground('#97c93d')
      .setFontColor('#1a472a')
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    analyticsSheet.setFrozenRows(1);

    for (let i = 1; i <= headers.length; i++) {
      analyticsSheet.autoResizeColumn(i);
    }
  }

  Logger.log('✅ Hojas creadas correctamente: Respuestas, Progreso, Analytics');

  // Mensaje de confirmación
  SpreadsheetApp.getUi().alert(
    '✅ Configuración Completada',
    'Se han creado las hojas: Respuestas, Progreso y Analytics.\n\n' +
    'Próximo paso: Despliega este script como Web App y copia la URL.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

// ==================== ENDPOINTS API ====================

/**
 * Endpoint POST principal
 * Recibe datos del frontend cuando los estudiantes completan ejercicios
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    Logger.log('📥 Recibido: ' + JSON.stringify(data));

    // Determinar tipo de acción
    const type = data.type;

    switch(type) {
      case 'exercise_score':
        return handleExerciseScore(data.data);

      case 'module_completion':
        return handleModuleCompletion(data.data);

      case 'survey_response':
        return handleSurveyResponse(data.data);

      default:
        return createResponse(false, 'Tipo de acción desconocido: ' + type);
    }

  } catch (error) {
    Logger.log('❌ Error en doPost: ' + error.toString());
    return createResponse(false, 'Error: ' + error.toString());
  }
}

/**
 * Endpoint GET para consultas
 * Permite obtener datos de progreso y analytics
 */
function doGet(e) {
  try {
    const action = e.parameter.action;

    switch(action) {
      case 'getStudentProgress':
        return getStudentProgress(e.parameter.email);

      case 'getModuleStats':
        return getModuleStats(e.parameter.module);

      case 'getExerciseAnalytics':
        return getExerciseAnalytics(e.parameter.module, e.parameter.exercise);

      case 'getAllStudents':
        return getAllStudents();

      case 'exportData':
        return exportStudentData(e.parameter.email);

      default:
        return createResponse(false, 'Acción desconocida: ' + action);
    }

  } catch (error) {
    Logger.log('❌ Error en doGet: ' + error.toString());
    return createResponse(false, 'Error: ' + error.toString());
  }
}

// ==================== HANDLERS DE DATOS ====================

/**
 * Maneja el almacenamiento de puntuaciones de ejercicios
 */
function handleExerciseScore(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const respuestasSheet = ss.getSheetByName('Respuestas');

  if (!respuestasSheet) {
    return createResponse(false, 'Hoja "Respuestas" no encontrada. Ejecuta setupSheet() primero.');
  }

  // Validar datos requeridos
  if (!data.studentEmail || !data.module || !data.exercise || !data.score) {
    return createResponse(false, 'Datos incompletos: se requiere studentEmail, module, exercise, score');
  }

  // Verificar si ya existe una respuesta para este ejercicio
  const existingRow = findExistingResponse(
    respuestasSheet,
    data.studentEmail,
    data.module,
    data.exercise
  );

  if (existingRow > 0) {
    // Actualizar intento existente (incrementar contador de intentos)
    const currentAttempts = respuestasSheet.getRange(existingRow, 7).getValue() || 0;

    const updateData = [
      new Date(), // Timestamp actualizado
      data.studentEmail,
      data.module,
      data.exercise,
      data.score,
      parseFloat(data.percentage) || 0,
      currentAttempts + 1, // Incrementar intentos
      data.timeSpent || 0,
      JSON.stringify(data.detailedAnswers || {})
    ];

    respuestasSheet.getRange(existingRow, 1, 1, updateData.length).setValues([updateData]);

    Logger.log('✏️ Respuesta actualizada para: ' + data.studentEmail + ' - ' + data.module + ' - ' + data.exercise);

  } else {
    // Nueva respuesta
    const newRow = [
      new Date(),
      data.studentEmail,
      data.module,
      data.exercise,
      data.score,
      parseFloat(data.percentage) || 0,
      1, // Primer intento
      data.timeSpent || 0,
      JSON.stringify(data.detailedAnswers || {})
    ];

    respuestasSheet.appendRow(newRow);

    Logger.log('✅ Nueva respuesta guardada para: ' + data.studentEmail + ' - ' + data.module + ' - ' + data.exercise);
  }

  // Actualizar hoja de Progreso
  updateStudentProgress(data.studentEmail, data.module);

  // Actualizar Analytics
  updateAnalytics(data.module, data.exercise);

  return createResponse(true, 'Puntuación guardada correctamente', {
    email: data.studentEmail,
    module: data.module,
    exercise: data.exercise,
    score: data.score
  });
}

/**
 * Maneja la completación de módulos completos
 */
function handleModuleCompletion(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const progresoSheet = ss.getSheetByName('Progreso');

  if (!progresoSheet) {
    return createResponse(false, 'Hoja "Progreso" no encontrada');
  }

  // Buscar fila del estudiante/módulo
  const progressRow = findProgressRow(progresoSheet, data.studentEmail, data.module);

  if (progressRow > 0) {
    // Actualizar estado a "Completado"
    progresoSheet.getRange(progressRow, 8).setValue('Completado');
    progresoSheet.getRange(progressRow, 7).setValue(new Date());

    // Colorear fila de verde
    progresoSheet.getRange(progressRow, 1, 1, 8)
      .setBackground('#d9ead3')
      .setFontWeight('bold');
  }

  return createResponse(true, 'Módulo marcado como completado');
}

/**
 * Maneja respuestas de encuestas de satisfacción
 */
function handleSurveyResponse(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let surveySheet = ss.getSheetByName('Encuestas');

  // Crear hoja si no existe
  if (!surveySheet) {
    surveySheet = ss.insertSheet('Encuestas');
    const headers = ['Timestamp', 'Email', 'Módulo', 'Calificación', 'Comentarios'];
    surveySheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    surveySheet.getRange(1, 1, 1, headers.length)
      .setBackground('#1a472a')
      .setFontColor('#ffffff')
      .setFontWeight('bold');
  }

  const newRow = [
    new Date(),
    data.studentEmail,
    data.module,
    data.rating || 'N/A',
    data.comments || ''
  ];

  surveySheet.appendRow(newRow);

  return createResponse(true, 'Encuesta guardada');
}

// ==================== FUNCIONES AUXILIARES ====================

/**
 * Busca si ya existe una respuesta para un ejercicio específico
 */
function findExistingResponse(sheet, email, module, exercise) {
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) { // Empezar en 1 para saltar headers
    if (data[i][1] === email &&
        data[i][2] === module &&
        data[i][3] === exercise) {
      return i + 1; // +1 porque los arrays empiezan en 0 pero las filas en 1
    }
  }

  return -1; // No encontrado
}

/**
 * Actualiza la hoja de Progreso para un estudiante/módulo
 */
function updateStudentProgress(email, module) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const progresoSheet = ss.getSheetByName('Progreso');
  const respuestasSheet = ss.getSheetByName('Respuestas');

  if (!progresoSheet || !respuestasSheet) return;

  // Contar ejercicios completados por este estudiante en este módulo
  const respuestas = respuestasSheet.getDataRange().getValues();
  const ejerciciosCompletados = new Set();
  let sumaPorcentajes = 0;

  for (let i = 1; i < respuestas.length; i++) {
    if (respuestas[i][1] === email && respuestas[i][2] === module) {
      ejerciciosCompletados.add(respuestas[i][3]); // Ejercicio único
      sumaPorcentajes += parseFloat(respuestas[i][5]) || 0;
    }
  }

  const totalCompletados = ejerciciosCompletados.size;
  const totalEjercicios = getModuleExerciseCount(module);
  const porcentajeCompletado = (totalCompletados / totalEjercicios * 100).toFixed(1);
  const promedioPuntuacion = totalCompletados > 0 ? (sumaPorcentajes / totalCompletados).toFixed(1) : 0;

  // Determinar estado
  let estado = 'En Progreso';
  if (totalCompletados === 0) {
    estado = 'No Iniciado';
  } else if (totalCompletados === totalEjercicios) {
    estado = 'Completado';
  }

  // Buscar si ya existe fila para este estudiante/módulo
  const progressRow = findProgressRow(progresoSheet, email, module);

  const rowData = [
    email,
    module,
    totalCompletados,
    totalEjercicios,
    porcentajeCompletado + '%',
    promedioPuntuacion + '%',
    new Date(),
    estado
  ];

  if (progressRow > 0) {
    // Actualizar fila existente
    progresoSheet.getRange(progressRow, 1, 1, rowData.length).setValues([rowData]);
  } else {
    // Crear nueva fila
    progresoSheet.appendRow(rowData);
  }

  // Aplicar formato condicional según el estado
  const lastRow = progressRow > 0 ? progressRow : progresoSheet.getLastRow();
  const rowRange = progresoSheet.getRange(lastRow, 1, 1, 8);

  if (estado === 'Completado') {
    rowRange.setBackground('#d9ead3');
  } else if (estado === 'En Progreso') {
    rowRange.setBackground('#fff2cc');
  }
}

/**
 * Busca la fila de progreso para un estudiante/módulo
 */
function findProgressRow(sheet, email, module) {
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email && data[i][1] === module) {
      return i + 1;
    }
  }

  return -1;
}

/**
 * Retorna el número total de ejercicios por módulo
 * IMPORTANTE: Ajustar estos números según tus módulos reales
 */
function getModuleExerciseCount(module) {
  const exerciseCounts = {
    'module-1': 11,  // Ajustar según tu módulo 1
    'module-2': 11,  // Módulo 2 tiene 11 ejercicios
    'module-3': 10,  // Ajustar
    'module-4': 10,
    'module-5': 10,
    'module-6': 10,
    'module-7': 10,
    'module-8': 10,
    'module-9': 10,
    'module-10': 10,
    'module-11': 10,
    'module-12': 10,
    'module-13': 10,
    'module-14': 10,
    'module-15': 10
  };

  return exerciseCounts[module] || 10; // Default 10 ejercicios
}

/**
 * Actualiza estadísticas agregadas en Analytics
 */
function updateAnalytics(module, exercise) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const analyticsSheet = ss.getSheetByName('Analytics');
  const respuestasSheet = ss.getSheetByName('Respuestas');

  if (!analyticsSheet || !respuestasSheet) return;

  // Calcular estadísticas para este módulo/ejercicio
  const respuestas = respuestasSheet.getDataRange().getValues();
  let totalIntentos = 0;
  let sumaPorcentajes = 0;
  let aprobados = 0;
  let sumaTiempos = 0;

  for (let i = 1; i < respuestas.length; i++) {
    if (respuestas[i][2] === module && respuestas[i][3] === exercise) {
      totalIntentos++;
      const porcentaje = parseFloat(respuestas[i][5]) || 0;
      sumaPorcentajes += porcentaje;
      if (porcentaje >= 70) aprobados++; // 70% como umbral de aprobación
      sumaTiempos += parseFloat(respuestas[i][7]) || 0;
    }
  }

  if (totalIntentos === 0) return; // No hay datos

  const promedioPuntuacion = (sumaPorcentajes / totalIntentos).toFixed(1);
  const tasaAprobacion = (aprobados / totalIntentos * 100).toFixed(1);
  const tiempoPromedio = (sumaTiempos / totalIntentos).toFixed(1);

  // Determinar dificultad percibida
  let dificultad = 'Media';
  if (promedioPuntuacion >= 80) {
    dificultad = 'Fácil';
  } else if (promedioPuntuacion < 60) {
    dificultad = 'Difícil';
  }

  // Buscar si ya existe fila para este módulo/ejercicio
  const analyticsRow = findAnalyticsRow(analyticsSheet, module, exercise);

  const rowData = [
    module,
    exercise,
    totalIntentos,
    promedioPuntuacion + '%',
    tasaAprobacion + '%',
    tiempoPromedio,
    dificultad
  ];

  if (analyticsRow > 0) {
    analyticsSheet.getRange(analyticsRow, 1, 1, rowData.length).setValues([rowData]);
  } else {
    analyticsSheet.appendRow(rowData);
  }
}

/**
 * Busca fila en Analytics
 */
function findAnalyticsRow(sheet, module, exercise) {
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === module && data[i][1] === exercise) {
      return i + 1;
    }
  }

  return -1;
}

// ==================== FUNCIONES DE CONSULTA (GET) ====================

/**
 * Obtiene el progreso de un estudiante específico
 */
function getStudentProgress(email) {
  if (!email) {
    return createResponse(false, 'Email requerido');
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const progresoSheet = ss.getSheetByName('Progreso');

  if (!progresoSheet) {
    return createResponse(false, 'Hoja Progreso no encontrada');
  }

  const data = progresoSheet.getDataRange().getValues();
  const studentProgress = [];

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email) {
      studentProgress.push({
        module: data[i][1],
        completedExercises: data[i][2],
        totalExercises: data[i][3],
        completionPercentage: data[i][4],
        averageScore: data[i][5],
        lastActivity: data[i][6],
        status: data[i][7]
      });
    }
  }

  return createResponse(true, 'Progreso obtenido', {
    email: email,
    modules: studentProgress,
    totalModules: studentProgress.length
  });
}

/**
 * Obtiene estadísticas de un módulo específico
 */
function getModuleStats(module) {
  if (!module) {
    return createResponse(false, 'Módulo requerido');
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const analyticsSheet = ss.getSheetByName('Analytics');

  if (!analyticsSheet) {
    return createResponse(false, 'Hoja Analytics no encontrada');
  }

  const data = analyticsSheet.getDataRange().getValues();
  const moduleStats = [];

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === module) {
      moduleStats.push({
        exercise: data[i][1],
        totalAttempts: data[i][2],
        averageScore: data[i][3],
        passRate: data[i][4],
        averageTime: data[i][5],
        difficulty: data[i][6]
      });
    }
  }

  return createResponse(true, 'Estadísticas obtenidas', {
    module: module,
    exercises: moduleStats
  });
}

/**
 * Obtiene analytics de un ejercicio específico
 */
function getExerciseAnalytics(module, exercise) {
  if (!module || !exercise) {
    return createResponse(false, 'Módulo y ejercicio requeridos');
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const respuestasSheet = ss.getSheetByName('Respuestas');

  if (!respuestasSheet) {
    return createResponse(false, 'Hoja Respuestas no encontrada');
  }

  const data = respuestasSheet.getDataRange().getValues();
  const responses = [];

  for (let i = 1; i < data.length; i++) {
    if (data[i][2] === module && data[i][3] === exercise) {
      responses.push({
        timestamp: data[i][0],
        email: data[i][1],
        score: data[i][4],
        percentage: data[i][5],
        attempts: data[i][6],
        timeSpent: data[i][7]
      });
    }
  }

  return createResponse(true, 'Analytics obtenidos', {
    module: module,
    exercise: exercise,
    totalResponses: responses.length,
    responses: responses
  });
}

/**
 * Obtiene lista de todos los estudiantes
 */
function getAllStudents() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const progresoSheet = ss.getSheetByName('Progreso');

  if (!progresoSheet) {
    return createResponse(false, 'Hoja Progreso no encontrada');
  }

  const data = progresoSheet.getDataRange().getValues();
  const students = new Set();

  for (let i = 1; i < data.length; i++) {
    students.add(data[i][0]);
  }

  return createResponse(true, 'Estudiantes obtenidos', {
    students: Array.from(students),
    total: students.size
  });
}

/**
 * Exporta todos los datos de un estudiante
 */
function exportStudentData(email) {
  if (!email) {
    return createResponse(false, 'Email requerido');
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const respuestasSheet = ss.getSheetByName('Respuestas');

  if (!respuestasSheet) {
    return createResponse(false, 'Hoja Respuestas no encontrada');
  }

  const data = respuestasSheet.getDataRange().getValues();
  const studentData = [];

  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === email) {
      studentData.push({
        timestamp: data[i][0],
        module: data[i][2],
        exercise: data[i][3],
        score: data[i][4],
        percentage: data[i][5],
        attempts: data[i][6],
        timeSpent: data[i][7],
        detailedAnswers: data[i][8]
      });
    }
  }

  return createResponse(true, 'Datos exportados', {
    email: email,
    totalExercises: studentData.length,
    data: studentData
  });
}

// ==================== UTILIDADES ====================

/**
 * Crea una respuesta HTTP estandarizada
 */
function createResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message,
    timestamp: new Date().toISOString()
  };

  if (data) {
    response.data = data;
  }

  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// ==================== FUNCIONES DE MANTENIMIENTO ====================

/**
 * Limpia respuestas duplicadas (mantiene la más reciente)
 */
function cleanDuplicateResponses() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const respuestasSheet = ss.getSheetByName('Respuestas');

  if (!respuestasSheet) {
    Logger.log('❌ Hoja Respuestas no encontrada');
    return;
  }

  const data = respuestasSheet.getDataRange().getValues();
  const seen = new Map(); // email+module+exercise -> fila más reciente
  const rowsToDelete = [];

  for (let i = data.length - 1; i >= 1; i--) { // Empezar desde el final
    const key = data[i][1] + '|' + data[i][2] + '|' + data[i][3];

    if (seen.has(key)) {
      // Duplicado encontrado, marcar para borrar
      rowsToDelete.push(i + 1);
    } else {
      seen.set(key, i + 1);
    }
  }

  // Borrar filas duplicadas (de mayor a menor para no desincronizar índices)
  rowsToDelete.sort((a, b) => b - a);
  rowsToDelete.forEach(row => {
    respuestasSheet.deleteRow(row);
  });

  Logger.log('✅ Limpieza completada. ' + rowsToDelete.length + ' duplicados eliminados.');

  SpreadsheetApp.getUi().alert(
    'Limpieza Completada',
    rowsToDelete.length + ' respuestas duplicadas fueron eliminadas.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Recalcula todo el progreso y analytics
 * Útil si hay inconsistencias en los datos
 */
function recalculateAllProgress() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const respuestasSheet = ss.getSheetByName('Respuestas');

  if (!respuestasSheet) {
    Logger.log('❌ Hoja Respuestas no encontrada');
    return;
  }

  // Limpiar hojas de Progreso y Analytics
  const progresoSheet = ss.getSheetByName('Progreso');
  const analyticsSheet = ss.getSheetByName('Analytics');

  if (progresoSheet) {
    progresoSheet.getRange('A2:H').clear();
  }

  if (analyticsSheet) {
    analyticsSheet.getRange('A2:G').clear();
  }

  // Procesar todas las respuestas nuevamente
  const data = respuestasSheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const email = data[i][1];
    const module = data[i][2];
    const exercise = data[i][3];

    updateStudentProgress(email, module);
    updateAnalytics(module, exercise);
  }

  Logger.log('✅ Recálculo completado para todas las respuestas.');

  SpreadsheetApp.getUi().alert(
    'Recálculo Completado',
    'Progreso y Analytics han sido recalculados desde las respuestas.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Genera un reporte mensual
 */
function generateMonthlyReport() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const progresoSheet = ss.getSheetByName('Progreso');

  if (!progresoSheet) return;

  const data = progresoSheet.getDataRange().getValues();
  const today = new Date();
  const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

  let activeStudents = 0;
  let completedModules = 0;

  for (let i = 1; i < data.length; i++) {
    const lastActivity = new Date(data[i][6]);

    if (lastActivity >= oneMonthAgo) {
      activeStudents++;
    }

    if (data[i][7] === 'Completado') {
      completedModules++;
    }
  }

  const report = `
📊 REPORTE MENSUAL - Legal English
Período: ${oneMonthAgo.toLocaleDateString()} - ${today.toLocaleDateString()}

📈 Estadísticas:
- Estudiantes activos: ${activeStudents}
- Módulos completados: ${completedModules}
- Total de registros: ${data.length - 1}

Generado: ${new Date().toLocaleString()}
  `;

  Logger.log(report);

  // Enviar por email (opcional)
  // MailApp.sendEmail('tu-email@example.com', 'Reporte Mensual - Legal English', report);
}
