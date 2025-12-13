/**
 * ============================================================================
 * SISTEMA CENTRALIZADO DE GOOGLE SHEETS
 * Cursos Juridicos - Empirica Legal Lab
 * ============================================================================
 *
 * Este script unifica TODAS las funcionalidades en un solo Google Apps Script:
 *
 * 1. CONTROL DE ACCESO Y PAGOS
 *    - Verificacion de acceso de usuarios
 *    - Registro de compradores/pagos
 *    - Integracion con Stripe webhooks
 *
 * 2. RESPUESTAS DE EJERCICIOS
 *    - Almacenamiento de respuestas de estudiantes
 *    - Tracking de progreso por modulo
 *    - Calculos de puntuaciones
 *
 * 3. ENCUESTAS Y ANALYTICS
 *    - Encuestas de satisfaccion por modulo
 *    - Estadisticas de uso y desempeño
 *
 * VERSION: 2.0.0
 * FECHA: 2025-12-13
 * AUTOR: Jorge Clemente / Claude AI
 * ============================================================================
 */

// ============================================================================
// CONFIGURACION GLOBAL
// ============================================================================

const CONFIG = {
  // Dejar vacio para usar el spreadsheet donde esta alojado el script
  SPREADSHEET_ID: '',

  // Nombres de las hojas
  SHEETS: {
    // Control de Acceso
    COMPRADORES: 'Compradores',
    USUARIOS_ACTIVOS: 'Usuarios_Activos',

    // Respuestas y Progreso
    RESPUESTAS: 'Exercise_Responses',
    PROGRESO: 'Student_Progress',
    ENCUESTAS: 'Module_Surveys',

    // Analytics y Logs
    ANALYTICS: 'Analytics',
    LOGS: 'Activity_Log',

    // Configuracion
    CONFIG: 'Config'
  },

  // Cursos disponibles
  CURSOS: {
    'legal-english': {
      nombre: 'Legal English: Anglo-American Law in Action',
      precio: 5000,
      moneda: 'MXN',
      moduloGratuito: 'modulo-1'
    },
    'derecho-no-abogados': {
      nombre: 'Derecho para No Abogados',
      precio: 500,
      moneda: 'MXN',
      moduloGratuito: null
    }
  },

  // Email para notificaciones
  ADMIN_EMAIL: 'jorge@empirica.io'
};

// ============================================================================
// FUNCIONES DE UTILIDAD - SPREADSHEET
// ============================================================================

/**
 * Obtiene el spreadsheet (actual o por ID)
 */
function getSpreadsheet() {
  if (CONFIG.SPREADSHEET_ID) {
    return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Obtiene o crea una hoja especifica
 */
function getSheet(sheetName) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = createSheet(ss, sheetName);
  }

  return sheet;
}

/**
 * Crea una hoja con su estructura especifica
 */
function createSheet(ss, sheetName) {
  const sheet = ss.insertSheet(sheetName);

  const structures = {
    [CONFIG.SHEETS.COMPRADORES]: {
      headers: ['Email', 'Curso', 'Fecha Pago', 'Monto', 'ID Transaccion', 'Estado', 'Metodo Pago'],
      color: '#1B2C27'
    },
    [CONFIG.SHEETS.USUARIOS_ACTIVOS]: {
      headers: ['Email', 'Curso', 'Status', 'Tipo Acceso', 'Fecha Registro', 'Ultimo Acceso', 'Notas'],
      color: '#10B981'
    },
    [CONFIG.SHEETS.RESPUESTAS]: {
      headers: ['Timestamp', 'Email', 'Nombre', 'Curso', 'Modulo', 'Ejercicio', 'Tipo', 'Respuestas', 'Correcto', 'Puntuacion', 'Porcentaje'],
      color: '#2D4A3E'
    },
    [CONFIG.SHEETS.PROGRESO]: {
      headers: ['Email', 'Nombre', 'Curso', 'Modulo', 'Ejercicios Completados', 'Total Ejercicios', 'Promedio Puntuacion', 'Ultima Actividad', 'Estado'],
      color: '#CFA892'
    },
    [CONFIG.SHEETS.ENCUESTAS]: {
      headers: ['Timestamp', 'Email', 'Nombre', 'Curso', 'Modulo', 'Dificultad', 'Calidad (1-5)', 'Lo Mas Util', 'Sugerencias', 'Tiempo Invertido'],
      color: '#6366F1'
    },
    [CONFIG.SHEETS.ANALYTICS]: {
      headers: ['Fecha', 'Curso', 'Modulo', 'Ejercicio', 'Total Intentos', 'Promedio Puntuacion', 'Tasa Aprobacion', 'Tiempo Promedio'],
      color: '#F59E0B'
    },
    [CONFIG.SHEETS.LOGS]: {
      headers: ['Timestamp', 'Accion', 'Email', 'Curso', 'Detalles', 'Resultado', 'IP'],
      color: '#6C757D'
    },
    [CONFIG.SHEETS.CONFIG]: {
      headers: ['Parametro', 'Valor', 'Descripcion', 'Ultima Modificacion'],
      color: '#1F2937'
    }
  };

  const structure = structures[sheetName];
  if (structure) {
    const headerRange = sheet.getRange(1, 1, 1, structure.headers.length);
    headerRange.setValues([structure.headers]);
    headerRange.setFontWeight('bold');
    headerRange.setBackground(structure.color);
    headerRange.setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);

    // Auto-resize columns
    for (let i = 1; i <= structure.headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
  }

  logActivity('SHEET_CREATED', '', '', `Hoja creada: ${sheetName}`);
  return sheet;
}

// ============================================================================
// LOGGING
// ============================================================================

/**
 * Registra actividad en el log
 */
function logActivity(action, email, course, details, result = 'success', ip = '') {
  try {
    const sheet = getSheet(CONFIG.SHEETS.LOGS);
    sheet.appendRow([
      new Date(),
      action,
      email || 'N/A',
      course || 'N/A',
      details || '',
      result,
      ip || ''
    ]);
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

// ============================================================================
// ENDPOINTS PRINCIPALES - doGet y doPost
// ============================================================================

/**
 * Maneja peticiones GET
 */
function doGet(e) {
  try {
    const params = e.parameter;
    const action = params.action;

    logActivity('GET_REQUEST', params.email, params.course, `Action: ${action}`);

    let response = {};

    switch(action) {
      // === CONTROL DE ACCESO ===
      case 'checkAccess':
        response = handleCheckAccess(params);
        break;

      case 'registerFreeAccess':
        response = handleRegisterFreeAccess(params);
        break;

      // === COMPRADORES ===
      case 'listPurchasers':
        response = handleListPurchasers(params);
        break;

      case 'addPurchaser':
        response = handleAddPurchaser(params);
        break;

      case 'stats':
        response = handleGetStats(params);
        break;

      // === PROGRESO ===
      case 'getProgress':
        response = handleGetProgress(params);
        break;

      case 'getStudentHistory':
        response = handleGetStudentHistory(params);
        break;

      // === DEFAULT ===
      default:
        response = {
          success: false,
          error: 'Accion no valida',
          availableActions: [
            'checkAccess', 'registerFreeAccess',
            'listPurchasers', 'addPurchaser', 'stats',
            'getProgress', 'getStudentHistory'
          ]
        };
    }

    return createJsonResponse(response);

  } catch (error) {
    logActivity('ERROR_GET', '', '', error.toString(), 'error');
    return createJsonResponse({
      success: false,
      error: error.toString()
    });
  }
}

/**
 * Maneja peticiones POST
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const type = data.type || data.action;

    logActivity('POST_REQUEST', data.studentEmail || data.email, data.course || data.module, `Type: ${type}`);

    let response = {};

    switch(type) {
      // === EJERCICIOS ===
      case 'exercise_score':
      case 'exercise_response':
        response = handleExerciseResponse(data);
        break;

      case 'exercise_completion':
        response = handleExerciseCompletion(data);
        break;

      // === ENCUESTAS ===
      case 'survey':
      case 'survey_response':
        response = handleSurveyResponse(data);
        break;

      // === INFORMACION ESTUDIANTE ===
      case 'student_info':
        response = handleStudentInfo(data);
        break;

      // === WEBHOOKS ===
      case 'webhookStripe':
        response = handleStripeWebhook(data);
        break;

      // === DEFAULT ===
      default:
        // Intentar detectar si es una respuesta de ejercicio
        if (data.exerciseId || data.exercise) {
          response = handleExerciseResponse(data);
        } else {
          response = {
            success: false,
            error: 'Tipo de datos no reconocido'
          };
        }
    }

    return createJsonResponse(response);

  } catch (error) {
    logActivity('ERROR_POST', '', '', error.toString(), 'error');
    return createJsonResponse({
      success: false,
      error: error.toString()
    });
  }
}

/**
 * Crea respuesta JSON con headers CORS
 */
function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================================
// CONTROL DE ACCESO
// ============================================================================

/**
 * Verifica si un usuario tiene acceso a un curso
 */
function handleCheckAccess(params) {
  const email = (params.email || '').toLowerCase().trim();
  const course = (params.course || '').toLowerCase().trim();

  if (!email) {
    return { success: false, hasAccess: false, error: 'Email requerido' };
  }

  // Verificar en Compradores
  const compradoresSheet = getSheet(CONFIG.SHEETS.COMPRADORES);
  const compradoresData = compradoresSheet.getDataRange().getValues();

  for (let i = 1; i < compradoresData.length; i++) {
    const row = compradoresData[i];
    const rowEmail = String(row[0]).toLowerCase().trim();
    const rowCourse = String(row[1]).toLowerCase().trim();
    const estado = String(row[5]).toLowerCase().trim();

    if (rowEmail === email &&
        (!course || rowCourse === course) &&
        (estado === 'activo' || estado === 'pagado' || estado === '')) {

      logActivity('CHECK_ACCESS', email, course, 'Acceso concedido (comprador)', 'granted');
      return {
        success: true,
        hasAccess: true,
        accessType: 'paid',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Verificar en Usuarios Activos (acceso gratuito, cortesia, etc.)
  const activosSheet = getSheet(CONFIG.SHEETS.USUARIOS_ACTIVOS);
  const activosData = activosSheet.getDataRange().getValues();

  for (let i = 1; i < activosData.length; i++) {
    const row = activosData[i];
    const rowEmail = String(row[0]).toLowerCase().trim();
    const rowCourse = String(row[1]).toLowerCase().trim();
    const status = String(row[2]).toLowerCase().trim();

    if (rowEmail === email &&
        (!course || rowCourse === course) &&
        (status === 'activo' || status === 'active' || status === 'si' || status === 'yes')) {

      logActivity('CHECK_ACCESS', email, course, 'Acceso concedido (usuario activo)', 'granted');
      return {
        success: true,
        hasAccess: true,
        accessType: row[3] || 'authorized',
        timestamp: new Date().toISOString()
      };
    }
  }

  logActivity('CHECK_ACCESS', email, course, 'Acceso denegado', 'denied');
  return {
    success: true,
    hasAccess: false,
    timestamp: new Date().toISOString()
  };
}

/**
 * Registra acceso gratuito (modulo 1)
 */
function handleRegisterFreeAccess(params) {
  const email = (params.email || '').toLowerCase().trim();
  const course = params.course || 'legal-english';
  const module = params.module || 'modulo-1';

  if (!email) {
    return { success: false, error: 'Email requerido' };
  }

  const sheet = getSheet(CONFIG.SHEETS.USUARIOS_ACTIVOS);
  const timestamp = new Date();

  // Verificar si ya existe
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).toLowerCase().trim() === email &&
        String(data[i][1]).toLowerCase().trim() === course.toLowerCase()) {
      // Ya registrado, actualizar ultimo acceso
      sheet.getRange(i + 1, 6).setValue(timestamp);
      return { success: true, message: 'Acceso actualizado' };
    }
  }

  // Nuevo registro
  sheet.appendRow([
    email,
    course,
    'activo',
    `free-${module}`,
    timestamp,
    timestamp,
    `Registro gratuito - ${module}`
  ]);

  logActivity('FREE_ACCESS_REGISTERED', email, course, `Modulo: ${module}`);

  return {
    success: true,
    message: 'Acceso gratuito registrado',
    timestamp: timestamp.toISOString()
  };
}

// ============================================================================
// COMPRADORES Y PAGOS
// ============================================================================

/**
 * Agrega un nuevo comprador
 */
function handleAddPurchaser(params) {
  const email = (params.email || '').toLowerCase().trim();
  const course = params.course || '';
  const amount = params.amount || 0;
  const transactionId = params.transactionId || 'Manual';
  const metodoPago = params.metodoPago || 'Stripe';

  if (!email || !course) {
    return { success: false, error: 'Email y curso son requeridos' };
  }

  const sheet = getSheet(CONFIG.SHEETS.COMPRADORES);
  const timestamp = new Date();

  sheet.appendRow([
    email,
    course,
    timestamp,
    amount,
    transactionId,
    'activo',
    metodoPago
  ]);

  logActivity('ADD_PURCHASER', email, course, `Monto: ${amount}, TX: ${transactionId}`);

  // Enviar notificacion al admin
  sendAdminNotification('Nueva compra', `
    Email: ${email}
    Curso: ${course}
    Monto: ${amount}
    Transaccion: ${transactionId}
  `);

  return {
    success: true,
    message: 'Comprador agregado exitosamente',
    timestamp: timestamp.toISOString()
  };
}

/**
 * Lista compradores de un curso
 */
function handleListPurchasers(params) {
  const course = (params.course || '').toLowerCase().trim();

  if (!course) {
    return { success: false, error: 'Curso requerido' };
  }

  const sheet = getSheet(CONFIG.SHEETS.COMPRADORES);
  const data = sheet.getDataRange().getValues();
  const purchasers = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const rowCourse = String(row[1]).toLowerCase().trim();
    const estado = String(row[5]).toLowerCase().trim();

    if (rowCourse === course && (estado === 'activo' || estado === 'pagado' || estado === '')) {
      purchasers.push({
        email: row[0],
        course: row[1],
        fechaPago: row[2],
        monto: row[3],
        transactionId: row[4],
        estado: row[5]
      });
    }
  }

  return {
    success: true,
    course: course,
    count: purchasers.length,
    purchasers: purchasers
  };
}

/**
 * Obtiene estadisticas generales
 */
function handleGetStats(params) {
  const compradoresSheet = getSheet(CONFIG.SHEETS.COMPRADORES);
  const activosSheet = getSheet(CONFIG.SHEETS.USUARIOS_ACTIVOS);
  const respuestasSheet = getSheet(CONFIG.SHEETS.RESPUESTAS);

  const compradores = compradoresSheet.getDataRange().getValues();
  const activos = activosSheet.getDataRange().getValues();
  const respuestas = respuestasSheet.getDataRange().getValues();

  // Contar por curso
  const stats = {
    'legal-english': { compradores: 0, usuarios: 0 },
    'derecho-no-abogados': { compradores: 0, usuarios: 0 }
  };

  for (let i = 1; i < compradores.length; i++) {
    const course = String(compradores[i][1]).toLowerCase().trim();
    if (stats[course]) stats[course].compradores++;
  }

  for (let i = 1; i < activos.length; i++) {
    const course = String(activos[i][1]).toLowerCase().trim();
    if (stats[course]) stats[course].usuarios++;
  }

  return {
    success: true,
    stats: {
      cursos: stats,
      totalCompradores: compradores.length - 1,
      totalUsuariosActivos: activos.length - 1,
      totalRespuestas: respuestas.length - 1
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * Maneja webhook de Stripe
 */
function handleStripeWebhook(data) {
  const email = data.customer_email || data.email;
  const course = data.metadata?.course || data.course;
  const amount = (data.amount_total || data.amount || 0) / 100; // Stripe envia en centavos
  const transactionId = data.payment_intent || data.id || 'stripe_' + Date.now();

  if (!email || !course) {
    return { success: false, error: 'Datos incompletos en webhook' };
  }

  // Agregar como comprador
  return handleAddPurchaser({
    email: email,
    course: course,
    amount: amount,
    transactionId: transactionId,
    metodoPago: 'Stripe'
  });
}

// ============================================================================
// RESPUESTAS DE EJERCICIOS
// ============================================================================

/**
 * Guarda respuesta de ejercicio
 */
function handleExerciseResponse(data) {
  const sheet = getSheet(CONFIG.SHEETS.RESPUESTAS);
  const timestamp = new Date();

  // Extraer datos con compatibilidad para diferentes formatos
  const exerciseData = data.data || data;

  const email = (exerciseData.studentEmail || exerciseData.email || exerciseData.userEmail || '').toLowerCase().trim();
  const nombre = exerciseData.studentName || exerciseData.name || 'Anonymous';
  const curso = exerciseData.course || 'legal-english';
  const modulo = exerciseData.module || exerciseData.moduleId || 'unknown';
  const ejercicio = exerciseData.exercise || exerciseData.exerciseId || 'unknown';
  const tipo = exerciseData.exerciseType || exerciseData.type || 'unknown';
  const respuestas = JSON.stringify(exerciseData.userAnswers || exerciseData.answers || {});
  const correcto = exerciseData.isCorrect ? 'SI' : 'NO';
  const puntuacion = exerciseData.score || 0;
  const porcentaje = exerciseData.percentage || 0;

  // Guardar respuesta
  sheet.appendRow([
    timestamp,
    email,
    nombre,
    curso,
    modulo,
    ejercicio,
    tipo,
    respuestas,
    correcto,
    puntuacion,
    porcentaje
  ]);

  // Actualizar progreso del estudiante
  updateStudentProgress(email, nombre, curso, modulo, ejercicio, parseFloat(porcentaje) || 0);

  logActivity('EXERCISE_RESPONSE', email, curso, `${modulo}/${ejercicio}: ${porcentaje}%`);

  return {
    success: true,
    status: 'success',
    message: 'Respuesta guardada correctamente',
    timestamp: timestamp.toISOString()
  };
}

/**
 * Maneja completion de ejercicio
 */
function handleExerciseCompletion(data) {
  const exerciseData = data.data || data;

  logActivity('EXERCISE_COMPLETED',
    exerciseData.studentEmail,
    exerciseData.module,
    `${exerciseData.exercise}: ${JSON.stringify(exerciseData.state)}`
  );

  return {
    success: true,
    message: 'Completion registrada'
  };
}

/**
 * Actualiza el progreso del estudiante en un modulo
 */
function updateStudentProgress(email, nombre, curso, modulo, ejercicio, porcentaje) {
  try {
    const sheet = getSheet(CONFIG.SHEETS.PROGRESO);
    const data = sheet.getDataRange().getValues();
    const timestamp = new Date();

    // Buscar fila existente para este estudiante/modulo
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).toLowerCase().trim() === email &&
          String(data[i][3]).toLowerCase().trim() === modulo.toLowerCase()) {
        rowIndex = i + 1;
        break;
      }
    }

    if (rowIndex === -1) {
      // Nueva entrada
      sheet.appendRow([
        email,
        nombre,
        curso,
        modulo,
        1,                    // Ejercicios completados
        11,                   // Total ejercicios (default)
        porcentaje,           // Promedio puntuacion
        timestamp,            // Ultima actividad
        'En progreso'         // Estado
      ]);
    } else {
      // Actualizar existente
      const ejerciciosCompletados = data[rowIndex - 1][4] + 1;
      const promedioActual = data[rowIndex - 1][6] || 0;
      const nuevoPromedio = ((promedioActual * (ejerciciosCompletados - 1)) + porcentaje) / ejerciciosCompletados;

      sheet.getRange(rowIndex, 5).setValue(ejerciciosCompletados);
      sheet.getRange(rowIndex, 7).setValue(Math.round(nuevoPromedio * 100) / 100);
      sheet.getRange(rowIndex, 8).setValue(timestamp);

      // Actualizar estado si completo todos
      if (ejerciciosCompletados >= 11) {
        sheet.getRange(rowIndex, 9).setValue('Completado');
      }
    }
  } catch (error) {
    console.error('Error updating progress:', error);
  }
}

// ============================================================================
// PROGRESO DEL ESTUDIANTE
// ============================================================================

/**
 * Obtiene el progreso de un estudiante
 */
function handleGetProgress(params) {
  const email = (params.email || '').toLowerCase().trim();

  if (!email) {
    return { success: false, error: 'Email requerido' };
  }

  const respuestasSheet = getSheet(CONFIG.SHEETS.RESPUESTAS);
  const encuestasSheet = getSheet(CONFIG.SHEETS.ENCUESTAS);

  const progress = {
    responses: [],
    surveys: [],
    moduleProgress: {},
    summary: {
      totalExercises: 0,
      completedModules: [],
      lastActivity: null
    }
  };

  // Obtener respuestas
  const responsesData = respuestasSheet.getDataRange().getValues();
  for (let i = 1; i < responsesData.length; i++) {
    const row = responsesData[i];
    const rowEmail = String(row[1]).toLowerCase().trim();

    if (rowEmail === email) {
      const response = {
        timestamp: row[0],
        module: row[4],
        exerciseId: row[5],
        exerciseType: row[6],
        isCorrect: row[8] === 'SI',
        score: row[10]
      };

      progress.responses.push(response);

      // Actualizar progreso por modulo
      if (!progress.moduleProgress[response.module]) {
        progress.moduleProgress[response.module] = {
          completedExercises: 0,
          exerciseIds: [],
          averageScore: 0,
          totalScore: 0
        };
      }

      const moduleData = progress.moduleProgress[response.module];
      if (!moduleData.exerciseIds.includes(response.exerciseId)) {
        moduleData.exerciseIds.push(response.exerciseId);
        moduleData.completedExercises++;
        moduleData.totalScore += parseFloat(response.score) || 0;
        moduleData.averageScore = moduleData.totalScore / moduleData.completedExercises;
      }
    }
  }

  // Obtener encuestas
  const surveysData = encuestasSheet.getDataRange().getValues();
  for (let i = 1; i < surveysData.length; i++) {
    const row = surveysData[i];
    const rowEmail = String(row[1]).toLowerCase().trim();

    if (rowEmail === email) {
      progress.surveys.push({
        timestamp: row[0],
        module: row[4],
        difficulty: row[5],
        quality: row[6]
      });
    }
  }

  // Calcular resumen
  progress.summary.totalExercises = progress.responses.length;
  progress.summary.completedModules = Object.keys(progress.moduleProgress);

  if (progress.responses.length > 0) {
    const timestamps = progress.responses.map(r => new Date(r.timestamp));
    progress.summary.lastActivity = new Date(Math.max(...timestamps));
  }

  return {
    success: true,
    status: 'success',
    email: email,
    progress: progress
  };
}

/**
 * Obtiene historial completo del estudiante
 */
function handleGetStudentHistory(params) {
  const email = (params.email || '').toLowerCase().trim();

  if (!email) {
    return { success: false, error: 'Email requerido' };
  }

  // Obtener progreso
  const progressResult = handleGetProgress(params);

  // Obtener info de acceso
  const accessResult = handleCheckAccess(params);

  return {
    success: true,
    email: email,
    access: accessResult,
    progress: progressResult.progress,
    timestamp: new Date().toISOString()
  };
}

// ============================================================================
// ENCUESTAS
// ============================================================================

/**
 * Guarda respuesta de encuesta
 */
function handleSurveyResponse(data) {
  const sheet = getSheet(CONFIG.SHEETS.ENCUESTAS);
  const timestamp = new Date();

  const surveyData = data.data || data;

  const email = (surveyData.studentEmail || surveyData.email || surveyData.userEmail || '').toLowerCase().trim();
  const nombre = surveyData.studentName || surveyData.name || 'Anonymous';
  const curso = surveyData.course || 'legal-english';
  const modulo = surveyData.module || 'unknown';
  const dificultad = surveyData.difficulty || '';
  const calidad = surveyData.quality || surveyData.rating || '';
  const masUtil = surveyData.most_useful || surveyData.mostUseful || '';
  const sugerencias = surveyData.suggestions || '';
  const tiempo = surveyData.time_spent || surveyData.timeSpent || '';

  sheet.appendRow([
    timestamp,
    email,
    nombre,
    curso,
    modulo,
    dificultad,
    calidad,
    masUtil,
    sugerencias,
    tiempo
  ]);

  logActivity('SURVEY_SAVED', email, curso, `Modulo: ${modulo}, Calidad: ${calidad}`);

  return {
    success: true,
    status: 'success',
    message: 'Encuesta guardada correctamente',
    timestamp: timestamp.toISOString()
  };
}

/**
 * Guarda informacion del estudiante
 */
function handleStudentInfo(data) {
  const infoData = data.data || data;

  logActivity('STUDENT_INFO',
    infoData.email,
    infoData.module,
    `Nombre: ${infoData.name}`
  );

  return {
    success: true,
    message: 'Informacion registrada'
  };
}

// ============================================================================
// NOTIFICACIONES
// ============================================================================

/**
 * Envia notificacion al administrador
 */
function sendAdminNotification(subject, body) {
  try {
    if (CONFIG.ADMIN_EMAIL) {
      MailApp.sendEmail({
        to: CONFIG.ADMIN_EMAIL,
        subject: `[Empirica] ${subject}`,
        body: body
      });
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

// ============================================================================
// FUNCIONES DE SETUP E INICIALIZACION
// ============================================================================

/**
 * Configura todas las hojas necesarias
 */
function setupSpreadsheet() {
  const ss = getSpreadsheet();

  // Crear todas las hojas
  Object.values(CONFIG.SHEETS).forEach(sheetName => {
    if (!ss.getSheetByName(sheetName)) {
      createSheet(ss, sheetName);
    }
  });

  logActivity('SETUP', '', '', 'Spreadsheet configurado correctamente');

  SpreadsheetApp.getUi().alert(
    'Setup Completo',
    'Todas las hojas han sido creadas correctamente.\n\n' +
    'Proximos pasos:\n' +
    '1. Despliega este script como Web App\n' +
    '2. Copia la URL del Web App\n' +
    '3. Actualiza la URL en tu codigo frontend',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Menu personalizado
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Empirica Legal Lab')
    .addItem('Setup Spreadsheet', 'setupSpreadsheet')
    .addSeparator()
    .addItem('Ver Estadisticas', 'showStats')
    .addItem('Limpiar Logs Antiguos', 'cleanOldLogs')
    .addSeparator()
    .addItem('Test Ejercicio', 'testExerciseResponse')
    .addItem('Test Acceso', 'testCheckAccess')
    .addToUi();
}

// ============================================================================
// FUNCIONES DE MANTENIMIENTO
// ============================================================================

/**
 * Limpia logs mas antiguos de 30 dias
 */
function cleanOldLogs() {
  const sheet = getSheet(CONFIG.SHEETS.LOGS);
  const data = sheet.getDataRange().getValues();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  let rowsToDelete = [];
  for (let i = 1; i < data.length; i++) {
    const timestamp = new Date(data[i][0]);
    if (timestamp < thirtyDaysAgo) {
      rowsToDelete.push(i + 1);
    }
  }

  // Eliminar de abajo hacia arriba para no afectar los indices
  for (let i = rowsToDelete.length - 1; i >= 0; i--) {
    sheet.deleteRow(rowsToDelete[i]);
  }

  SpreadsheetApp.getUi().alert(`Se eliminaron ${rowsToDelete.length} logs antiguos.`);
}

/**
 * Muestra estadisticas en un dialogo
 */
function showStats() {
  const stats = handleGetStats({});

  SpreadsheetApp.getUi().alert(
    'Estadisticas',
    `Legal English:\n` +
    `  - Compradores: ${stats.stats.cursos['legal-english'].compradores}\n` +
    `  - Usuarios Activos: ${stats.stats.cursos['legal-english'].usuarios}\n\n` +
    `Derecho para No Abogados:\n` +
    `  - Compradores: ${stats.stats.cursos['derecho-no-abogados'].compradores}\n` +
    `  - Usuarios Activos: ${stats.stats.cursos['derecho-no-abogados'].usuarios}\n\n` +
    `Total Respuestas: ${stats.stats.totalRespuestas}`,
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

// ============================================================================
// FUNCIONES DE TESTING
// ============================================================================

/**
 * Test de respuesta de ejercicio
 */
function testExerciseResponse() {
  const testData = {
    type: 'exercise_score',
    data: {
      module: 'module-1',
      exercise: 'exercise1',
      studentEmail: 'test@example.com',
      studentName: 'Test Student',
      score: '5/5',
      percentage: '100',
      timestamp: new Date().toISOString()
    }
  };

  const result = handleExerciseResponse(testData);
  Logger.log(JSON.stringify(result));
  SpreadsheetApp.getUi().alert('Test Result', JSON.stringify(result, null, 2), SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Test de verificacion de acceso
 */
function testCheckAccess() {
  const result = handleCheckAccess({
    email: 'test@example.com',
    course: 'legal-english'
  });

  Logger.log(JSON.stringify(result));
  SpreadsheetApp.getUi().alert('Test Result', JSON.stringify(result, null, 2), SpreadsheetApp.getUi().ButtonSet.OK);
}
