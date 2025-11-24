/**
 * SISTEMA DE RECOLECCIÓN DE RESPUESTAS - LEGAL ENGLISH COURSE
 * Cursos Jurídicos Empírica
 *
 * Este script recibe y almacena:
 * 1. Respuestas de ejercicios de estudiantes
 * 2. Encuestas de evaluación de módulos
 *
 * Autor: Claude AI / Jorge Clemente
 * Fecha: 2025-11-24
 */

// ============================================
// CONFIGURACIÓN
// ============================================

const CONFIG = {
  SPREADSHEET_ID: '', // Dejar vacío para usar el spreadsheet actual
  SHEETS: {
    RESPONSES: 'Exercise_Responses',
    SURVEYS: 'Module_Surveys',
    SUMMARY: 'Summary',
    LOG: 'Activity_Log'
  }
};

// ============================================
// FUNCIÓN PRINCIPAL - Maneja POST requests
// ============================================

function doPost(e) {
  try {
    // Log de la actividad
    logActivity('POST Request Received', JSON.stringify(e.postData));

    // Parsear los datos recibidos
    const data = JSON.parse(e.postData.contents);

    // Determinar tipo de dato y procesarlo
    if (data.type === 'survey') {
      return handleSurvey(data.data);
    } else {
      return handleExerciseResponse(data);
    }

  } catch (error) {
    logActivity('ERROR', error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'error',
        'message': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================
// MANEJO DE RESPUESTAS DE EJERCICIOS
// ============================================

function handleExerciseResponse(data) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEETS.RESPONSES);

  // Crear hoja si no existe
  if (!sheet) {
    sheet = createResponsesSheet(ss);
  }

  // Preparar datos para insertar
  const timestamp = new Date();
  const studentName = data.studentName || 'Anonymous';
  const studentEmail = data.studentEmail || data.userEmail || 'not provided';

  const row = [
    timestamp,                                    // A: Timestamp
    studentName,                                  // B: Student Name
    studentEmail,                                 // C: Student Email
    data.module || 'unknown',                     // D: Module
    data.exerciseId || 'unknown',                 // E: Exercise ID
    data.exerciseType || 'unknown',               // F: Exercise Type
    JSON.stringify(data.userAnswers),             // G: User Answers (JSON)
    data.isCorrect ? 'YES' : 'NO',               // H: All Correct?
    data.score || 0                               // I: Score (%)
  ];

  // Insertar fila
  sheet.appendRow(row);

  // Actualizar resumen
  updateSummary(studentName, studentEmail, data.module, data.score);

  // Log de éxito
  logActivity('Exercise Response Saved', `${studentName} (${studentEmail}) - ${data.exerciseId}`);

  return ContentService
    .createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Response saved successfully',
      'timestamp': timestamp.toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// MANEJO DE ENCUESTAS
// ============================================

function handleSurvey(data) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEETS.SURVEYS);

  // Crear hoja si no existe
  if (!sheet) {
    sheet = createSurveysSheet(ss);
  }

  // Preparar datos para insertar
  const timestamp = new Date();
  const studentName = data.studentName || 'Anonymous';
  const studentEmail = data.studentEmail || data.userEmail || 'not provided';

  const row = [
    timestamp,                                    // A: Timestamp
    studentName,                                  // B: Student Name
    studentEmail,                                 // C: Student Email
    data.module || 'unknown',                     // D: Module
    data.difficulty || '',                        // E: Difficulty
    data.quality || '',                           // F: Quality (1-5)
    data.most_useful || '',                       // G: Most Useful
    data.suggestions || '',                       // H: Suggestions
    data.time_spent || ''                         // I: Time Spent
  ];

  // Insertar fila
  sheet.appendRow(row);

  // Log de éxito
  logActivity('Survey Saved', `${studentName} (${studentEmail}) - ${data.module}`);

  return ContentService
    .createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Survey saved successfully',
      'timestamp': timestamp.toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// CREACIÓN DE HOJAS
// ============================================

function createResponsesSheet(ss) {
  const sheet = ss.insertSheet(CONFIG.SHEETS.RESPONSES);

  // Headers
  const headers = [
    'Timestamp',
    'Student Name',
    'Email',
    'Module',
    'Exercise ID',
    'Exercise Type',
    'User Answers (JSON)',
    'All Correct?',
    'Score (%)'
  ];

  // Configurar headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#1B2C27');
  headerRange.setFontColor('#FFFFFF');

  // Freeze header row
  sheet.setFrozenRows(1);

  // Auto-resize columns
  for (let i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }

  return sheet;
}

function createSurveysSheet(ss) {
  const sheet = ss.insertSheet(CONFIG.SHEETS.SURVEYS);

  // Headers
  const headers = [
    'Timestamp',
    'Student Name',
    'Email',
    'Module',
    'Difficulty',
    'Quality (1-5)',
    'Most Useful',
    'Suggestions',
    'Time Spent'
  ];

  // Configurar headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#1B2C27');
  headerRange.setFontColor('#FFFFFF');

  // Freeze header row
  sheet.setFrozenRows(1);

  // Auto-resize columns
  for (let i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }

  return sheet;
}

function createSummarySheet(ss) {
  const sheet = ss.insertSheet(CONFIG.SHEETS.SUMMARY);

  // Headers
  const headers = [
    'Student Name',
    'Email',
    'Module',
    'Exercises Completed',
    'Average Score (%)',
    'Last Activity',
    'Survey Completed?'
  ];

  // Configurar headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#CFA892');
  headerRange.setFontColor('#1B2C27');

  sheet.setFrozenRows(1);

  return sheet;
}

function createLogSheet(ss) {
  const sheet = ss.insertSheet(CONFIG.SHEETS.LOG);

  const headers = ['Timestamp', 'Event', 'Details'];
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#6C757D');
  headerRange.setFontColor('#FFFFFF');

  sheet.setFrozenRows(1);

  return sheet;
}

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

function getSpreadsheet() {
  if (CONFIG.SPREADSHEET_ID) {
    return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

function logActivity(event, details) {
  try {
    const ss = getSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.SHEETS.LOG);

    if (!sheet) {
      sheet = createLogSheet(ss);
    }

    sheet.appendRow([
      new Date(),
      event,
      details || ''
    ]);
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

function getSessionInfo(email) {
  try {
    // Información adicional del navegador/sistema si está disponible
    return Session.getActiveUser().getEmail() || 'system';
  } catch (error) {
    return 'N/A';
  }
}

function updateSummary(studentName, studentEmail, module, score) {
  try {
    const ss = getSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.SHEETS.SUMMARY);

    if (!sheet) {
      sheet = createSummarySheet(ss);
    }

    // Buscar fila existente para este usuario y módulo
    const data = sheet.getDataRange().getValues();
    let rowIndex = -1;

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === studentName && data[i][2] === module) {
        rowIndex = i + 1;
        break;
      }
    }

    if (rowIndex === -1) {
      // Nueva entrada
      sheet.appendRow([
        studentName,
        studentEmail,
        module,
        1,                    // Exercises completed
        score,                // Average score
        new Date(),           // Last activity
        'NO'                  // Survey completed
      ]);
    } else {
      // Actualizar existente
      const exercisesCompleted = data[rowIndex - 1][3] + 1;
      const oldAvgScore = data[rowIndex - 1][4];
      const newAvgScore = ((oldAvgScore * (exercisesCompleted - 1)) + score) / exercisesCompleted;

      sheet.getRange(rowIndex, 4).setValue(exercisesCompleted);
      sheet.getRange(rowIndex, 5).setValue(Math.round(newAvgScore * 100) / 100);
      sheet.getRange(rowIndex, 6).setValue(new Date());
    }
  } catch (error) {
    logActivity('ERROR in updateSummary', error.toString());
  }
}

// ============================================
// FUNCIONES DE INICIALIZACIÓN
// ============================================

function setupSpreadsheet() {
  const ss = getSpreadsheet();

  // Crear todas las hojas necesarias
  if (!ss.getSheetByName(CONFIG.SHEETS.RESPONSES)) {
    createResponsesSheet(ss);
  }

  if (!ss.getSheetByName(CONFIG.SHEETS.SURVEYS)) {
    createSurveysSheet(ss);
  }

  if (!ss.getSheetByName(CONFIG.SHEETS.SUMMARY)) {
    createSummarySheet(ss);
  }

  if (!ss.getSheetByName(CONFIG.SHEETS.LOG)) {
    createLogSheet(ss);
  }

  logActivity('SETUP', 'Spreadsheet configured successfully');

  SpreadsheetApp.getUi().alert(
    'Setup Complete',
    'All sheets have been created successfully.\n\n' +
    'Next steps:\n' +
    '1. Deploy this script as a Web App\n' +
    '2. Copy the Web App URL\n' +
    '3. Update your website code with this URL',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

// ============================================
// FUNCIONES DE TESTING
// ============================================

function testExerciseResponse() {
  const testData = {
    module: 'module-1',
    exerciseId: 'exercise1',
    exerciseType: 'matching',
    userEmail: 'test@example.com',
    userAnswers: ['a', 'b', 'c', 'd', 'e'],
    isCorrect: true,
    score: 100
  };

  const result = handleExerciseResponse(testData);
  Logger.log(result.getContent());
}

function testSurvey() {
  const testData = {
    type: 'survey',
    data: {
      module: 'module-1',
      userEmail: 'test@example.com',
      difficulty: 'appropriate',
      quality: '5',
      most_useful: 'The matching exercises were great',
      suggestions: 'Add more real-world examples',
      time_spent: '45_60'
    }
  };

  const result = handleSurvey(testData.data);
  Logger.log(result.getContent());
}

// ============================================
// MENÚ PERSONALIZADO
// ============================================

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📚 Legal English')
    .addItem('⚙️ Setup Spreadsheet', 'setupSpreadsheet')
    .addItem('🧪 Test Exercise Response', 'testExerciseResponse')
    .addItem('🧪 Test Survey', 'testSurvey')
    .addSeparator()
    .addItem('📊 Generate Report', 'generateReport')
    .addItem('📧 Email Summary', 'emailSummary')
    .addToUi();
}

// ============================================
// REPORTES
// ============================================

function generateReport() {
  // TODO: Implementar generación de reportes
  SpreadsheetApp.getUi().alert('Report generation coming soon!');
}

function emailSummary() {
  // TODO: Implementar envío de resumen por email
  SpreadsheetApp.getUi().alert('Email summary coming soon!');
}
