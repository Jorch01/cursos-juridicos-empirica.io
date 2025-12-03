/**
 * ============================================
 * BACKEND DE GOOGLE APPS SCRIPT
 * Sistema de Verificación de Acceso - Compradores
 * Empírica Legal Lab
 * ============================================
 *
 * INSTRUCCIONES DE INSTALACIÓN:
 *
 * 1. Abre tu Google Sheet "Compradores Empírica Legal Lab"
 * 2. Ve a: Extensiones > Apps Script
 * 3. Borra el código que aparece por defecto
 * 4. Copia y pega TODO este código
 * 5. Guarda (Ctrl+S o Cmd+S)
 * 6. Ejecuta primero la función: setupSheet() usando el botón "Ejecutar" ▶️
 * 7. Acepta los permisos cuando te los pida
 * 8. Luego ve a: Implementar > Nueva implementación
 * 9. Tipo: "Aplicación web"
 * 10. Ejecutar como: "Yo"
 * 11. Quién tiene acceso: "Cualquiera"
 * 12. Copiar la URL generada
 */

// ═══════════════════════════════════════
// ⚙️ CONFIGURACIÓN
// ═══════════════════════════════════════

// Nombres de las hojas
const SHEET_NAMES = {
  compradores: 'Compradores',
  logs: 'Logs'
};

// ═══════════════════════════════════════
// 🚀 FUNCIÓN DE CONFIGURACIÓN INICIAL
// ═══════════════════════════════════════

/**
 * Ejecuta esta función PRIMERO para configurar las hojas
 */
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  console.log('📋 Iniciando configuración del Google Sheet...');

  // 1. Crear hoja de Compradores
  createCompradoresSheet(ss);

  // 2. Crear hoja de Logs
  createLogsSheet(ss);

  // 3. Crear menú personalizado
  onOpen();

  // 4. Mensaje de éxito
  SpreadsheetApp.getUi().alert(
    '✅ Configuración Completada',
    'Las hojas "Compradores" y "Logs" han sido creadas.\n\n' +
    'SIGUIENTE PASO:\n' +
    '1. Cierra esta ventana\n' +
    '2. Ve a: Implementar > Nueva implementación\n' +
    '3. Tipo: Aplicación web\n' +
    '4. Ejecutar como: Yo\n' +
    '5. Quién tiene acceso: Cualquiera\n' +
    '6. Click en Implementar\n' +
    '7. Copia la URL generada',
    SpreadsheetApp.getUi().ButtonSet.OK
  );

  console.log('✅ Configuración completada exitosamente');
}

// ═══════════════════════════════════════
// 📊 CREAR HOJAS
// ═══════════════════════════════════════

function createCompradoresSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_NAMES.compradores);

  // Si existe, no recrearla
  if (sheet) {
    console.log('⚠️  Hoja "Compradores" ya existe');
    return sheet;
  }

  console.log('📄 Creando hoja "Compradores"...');
  sheet = ss.insertSheet(SHEET_NAMES.compradores);

  // Configurar encabezados
  const headers = ['Email', 'Curso', 'Fecha Pago', 'Monto', 'ID Transacción', 'Estado'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Formato de encabezados
  const headerRange = sheet.getRange('A1:F1');
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#1B2C27');
  headerRange.setFontColor('#FFFFFF');
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');

  // Ajustar anchos de columnas
  sheet.setColumnWidth(1, 250); // Email
  sheet.setColumnWidth(2, 180); // Curso
  sheet.setColumnWidth(3, 150); // Fecha Pago
  sheet.setColumnWidth(4, 100); // Monto
  sheet.setColumnWidth(5, 200); // ID Transacción
  sheet.setColumnWidth(6, 120); // Estado

  // Congelar primera fila
  sheet.setFrozenRows(1);

  // Agregar validación de datos en columna "Curso"
  const cursoRange = sheet.getRange('B2:B1000');
  const cursoRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['derecho-no-abogados', 'legal-english'], true)
    .setAllowInvalid(false)
    .setHelpText('Selecciona un curso válido')
    .build();
  cursoRange.setDataValidation(cursoRule);

  // Agregar validación de datos en columna "Estado"
  const estadoRange = sheet.getRange('F2:F1000');
  const estadoRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['activo', 'pagado', 'inactivo', 'cancelado'], true)
    .setAllowInvalid(true)
    .setHelpText('Estado del acceso del usuario')
    .build();
  estadoRange.setDataValidation(estadoRule);

  // Agregar formato condicional para estados
  const activeRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('activo')
    .setBackground('#d4edda')
    .setFontColor('#155724')
    .setRanges([sheet.getRange('F2:F1000')])
    .build();

  const inactiveRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('inactivo')
    .setBackground('#f8d7da')
    .setFontColor('#721c24')
    .setRanges([sheet.getRange('F2:F1000')])
    .build();

  sheet.setConditionalFormatRules([activeRule, inactiveRule]);

  console.log('✅ Hoja "Compradores" configurada');
  return sheet;
}

function createLogsSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_NAMES.logs);

  if (sheet) {
    console.log('⚠️  Hoja "Logs" ya existe');
    return sheet;
  }

  console.log('📄 Creando hoja "Logs"...');
  sheet = ss.insertSheet(SHEET_NAMES.logs);

  // Configurar encabezados
  const headers = ['Timestamp', 'Acción', 'Email', 'Curso', 'Resultado', 'Detalles'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Formato de encabezados
  const headerRange = sheet.getRange('A1:F1');
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#2C3E50');
  headerRange.setFontColor('#FFFFFF');
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');

  // Ajustar anchos de columnas
  sheet.setColumnWidth(1, 180); // Timestamp
  sheet.setColumnWidth(2, 180); // Acción
  sheet.setColumnWidth(3, 250); // Email
  sheet.setColumnWidth(4, 150); // Curso
  sheet.setColumnWidth(5, 120); // Resultado
  sheet.setColumnWidth(6, 300); // Detalles

  // Congelar primera fila
  sheet.setFrozenRows(1);

  console.log('✅ Hoja "Logs" configurada');
  return sheet;
}

// ═══════════════════════════════════════
// 📡 ENDPOINT PRINCIPAL (doGet)
// ═══════════════════════════════════════

/**
 * Maneja las solicitudes GET desde el sitio web
 * URL: https://script.google.com/.../exec?action=checkAccess&email=...&course=...
 */
function doGet(e) {
  try {
    const params = e.parameter;
    const action = params.action;

    logActivity('GET Request', params.email || 'N/A', params.course || 'N/A', 'received', JSON.stringify(params));

    // Verificar acceso
    if (action === 'checkAccess') {
      const email = params.email;
      const course = params.course;

      if (!email || !course) {
        return createJsonResponse({
          hasAccess: false,
          error: 'Email y curso son requeridos'
        });
      }

      const hasAccess = checkUserAccess(email, course);

      logActivity('Check Access', email, course, hasAccess ? 'granted' : 'denied', '');

      return createJsonResponse({
        hasAccess: hasAccess,
        email: email,
        course: course,
        timestamp: new Date().toISOString()
      });
    }

    // Acción no reconocida
    return createJsonResponse({
      hasAccess: false,
      error: 'Acción no válida'
    });

  } catch (error) {
    logActivity('ERROR doGet', 'N/A', 'N/A', 'error', error.toString());
    return createJsonResponse({
      hasAccess: false,
      error: error.toString()
    });
  }
}

// ═══════════════════════════════════════
// 🔍 VERIFICAR ACCESO
// ═══════════════════════════════════════

/**
 * Verifica si un email tiene acceso a un curso
 */
function checkUserAccess(email, course) {
  try {
    const sheet = getSheet(SHEET_NAMES.compradores);
    const data = sheet.getDataRange().getValues();

    // Saltar encabezado (primera fila)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const rowEmail = String(row[0]).toLowerCase().trim();
      const rowCourse = String(row[1]).toLowerCase().trim();
      const estado = String(row[5]).toLowerCase().trim();

      // Verificar coincidencia
      if (rowEmail === email.toLowerCase().trim() &&
          rowCourse === course.toLowerCase().trim() &&
          (estado === 'activo' || estado === '' || estado === 'pagado')) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Error checking access:', error);
    logActivity('ERROR checkUserAccess', email, course, 'error', error.toString());
    return false;
  }
}

// ═══════════════════════════════════════
// 📝 FUNCIONES DE UTILIDAD
// ═══════════════════════════════════════

/**
 * Obtener hoja por nombre (crear si no existe)
 */
function getSheet(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    if (sheetName === SHEET_NAMES.compradores) {
      sheet = createCompradoresSheet(ss);
    } else if (sheetName === SHEET_NAMES.logs) {
      sheet = createLogsSheet(ss);
    }
  }

  return sheet;
}

/**
 * Registrar actividad en logs
 */
function logActivity(action, email, course, result, details) {
  try {
    const sheet = getSheet(SHEET_NAMES.logs);
    const timestamp = new Date();

    sheet.appendRow([
      timestamp,
      action,
      email || 'N/A',
      course || 'N/A',
      result,
      details || ''
    ]);
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

/**
 * Crear respuesta JSON
 */
function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ═══════════════════════════════════════
// 👤 AGREGAR USUARIO MANUALMENTE
// ═══════════════════════════════════════

/**
 * Agregar usuario de prueba o comprador manual
 */
function agregarUsuario() {
  const ui = SpreadsheetApp.getUi();

  // Pedir email
  const emailResponse = ui.prompt(
    'Agregar Usuario',
    'Ingresa el email del usuario:',
    ui.ButtonSet.OK_CANCEL
  );

  if (emailResponse.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  const email = emailResponse.getResponseText().trim();

  if (!email || !email.includes('@')) {
    ui.alert('❌ Error', 'Por favor ingresa un email válido', ui.ButtonSet.OK);
    return;
  }

  // Seleccionar curso
  const cursoResponse = ui.prompt(
    'Seleccionar Curso',
    'Ingresa el curso:\n1. legal-english\n2. derecho-no-abogados',
    ui.ButtonSet.OK_CANCEL
  );

  if (cursoResponse.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  const curso = cursoResponse.getResponseText().trim().toLowerCase();

  if (curso !== 'legal-english' && curso !== 'derecho-no-abogados') {
    ui.alert('❌ Error', 'Curso no válido. Usa:\n- legal-english\n- derecho-no-abogados', ui.ButtonSet.OK);
    return;
  }

  // Agregar a la hoja
  const sheet = getSheet(SHEET_NAMES.compradores);
  const timestamp = new Date();

  sheet.appendRow([
    email,
    curso,
    timestamp,
    curso === 'legal-english' ? '$5,000' : '$500',
    'MANUAL-' + Utilities.getUuid().substring(0, 8),
    'activo'
  ]);

  logActivity('ADD_USER_MANUAL', email, curso, 'success', 'Agregado desde menú');

  ui.alert(
    '✅ Usuario Agregado',
    `Email: ${email}\nCurso: ${curso}\nEstado: activo\n\nEl usuario ahora tiene acceso al curso.`,
    ui.ButtonSet.OK
  );
}

// ═══════════════════════════════════════
// 🎨 MENÚ PERSONALIZADO
// ═══════════════════════════════════════

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🎓 Empírica Legal Lab')
    .addItem('➕ Agregar Usuario', 'agregarUsuario')
    .addSeparator()
    .addItem('🔧 Configurar Hojas', 'setupSheet')
    .addItem('📊 Ver Estadísticas', 'mostrarEstadisticas')
    .addToUi();
}

// ═══════════════════════════════════════
// 📊 ESTADÍSTICAS
// ═══════════════════════════════════════

function mostrarEstadisticas() {
  const sheet = getSheet(SHEET_NAMES.compradores);
  const data = sheet.getDataRange().getValues();

  let totalUsuarios = data.length - 1; // Sin contar header
  let legalEnglish = 0;
  let derechoNoAbogados = 0;
  let activos = 0;

  for (let i = 1; i < data.length; i++) {
    const curso = String(data[i][1]).toLowerCase();
    const estado = String(data[i][5]).toLowerCase();

    if (curso === 'legal-english') legalEnglish++;
    if (curso === 'derecho-no-abogados') derechoNoAbogados++;
    if (estado === 'activo' || estado === 'pagado') activos++;
  }

  const ui = SpreadsheetApp.getUi();
  ui.alert(
    '📊 Estadísticas de Compradores',
    `Total de usuarios: ${totalUsuarios}\n\n` +
    `Legal English: ${legalEnglish}\n` +
    `Derecho para No Abogados: ${derechoNoAbogados}\n\n` +
    `Usuarios activos: ${activos}\n` +
    `Usuarios inactivos: ${totalUsuarios - activos}`,
    ui.ButtonSet.OK
  );
}

// ═══════════════════════════════════════
// 🧪 FUNCIONES DE TESTING
// ═══════════════════════════════════════

function testCheckAccess() {
  const testEmail = 'test@example.com';
  const testCourse = 'legal-english';

  console.log('🧪 Testing checkUserAccess...');
  const hasAccess = checkUserAccess(testEmail, testCourse);
  console.log(`Result: ${hasAccess}`);

  return hasAccess;
}

function testDoGet() {
  const mockEvent = {
    parameter: {
      action: 'checkAccess',
      email: 'test@example.com',
      course: 'legal-english'
    }
  };

  console.log('🧪 Testing doGet...');
  const response = doGet(mockEvent);
  console.log('Response:', response.getContent());

  return response;
}
