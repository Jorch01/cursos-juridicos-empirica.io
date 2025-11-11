/**
 * ============================================
 * BACKEND DE GOOGLE APPS SCRIPT
 * Sistema de Verificación de Acceso
 * ============================================
 *
 * INSTRUCCIONES DE INSTALACIÓN:
 *
 * 1. Ir a https://script.google.com
 * 2. Crear un nuevo proyecto
 * 3. Copiar y pegar todo este código
 * 4. Ir a "Despliegue" > "Nueva implementación"
 * 5. Tipo: "Aplicación web"
 * 6. Ejecutar como: "Yo"
 * 7. Quién tiene acceso: "Cualquiera"
 * 8. Copiar la URL generada y pegarla en payment-access-control.js
 */

// ═══════════════════════════════════════
// ⚙️ CONFIGURACIÓN
// ═══════════════════════════════════════

// ID de tu Google Sheet (lo encontrarás en la URL del sheet)
const SHEET_ID = 'TU_SHEET_ID_AQUI';

// Nombres de las hojas
const SHEET_NAMES = {
  compradores: 'Compradores',
  logs: 'Logs'
};

// ═══════════════════════════════════════
// 📊 FUNCIONES AUXILIARES
// ═══════════════════════════════════════

/**
 * Obtener la hoja de cálculo
 */
function getSheet(sheetName) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    // Crear la hoja si no existe
    sheet = ss.insertSheet(sheetName);

    if (sheetName === SHEET_NAMES.compradores) {
      // Configurar encabezados para hoja de compradores
      sheet.appendRow(['Email', 'Curso', 'Fecha Pago', 'Monto', 'ID Transacción', 'Estado']);
      sheet.getRange('A1:F1').setFontWeight('bold').setBackground('#1B2C27').setFontColor('white');
    } else if (sheetName === SHEET_NAMES.logs) {
      // Configurar encabezados para logs
      sheet.appendRow(['Timestamp', 'Acción', 'Email', 'Curso', 'Resultado', 'IP']);
      sheet.getRange('A1:F1').setFontWeight('bold').setBackground('#2C3E50').setFontColor('white');
    }
  }

  return sheet;
}

/**
 * Registrar log de actividad
 */
function logActivity(action, email, course, result, additionalInfo = '') {
  try {
    const sheet = getSheet(SHEET_NAMES.logs);
    const timestamp = new Date();

    sheet.appendRow([
      timestamp,
      action,
      email || 'N/A',
      course || 'N/A',
      result,
      additionalInfo
    ]);
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

/**
 * Verificar si un email tiene acceso a un curso
 */
function checkUserAccess(email, course) {
  try {
    const sheet = getSheet(SHEET_NAMES.compradores);
    const data = sheet.getDataRange().getValues();

    // Saltar encabezado (primera fila)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const rowEmail = row[0].toString().toLowerCase().trim();
      const rowCourse = row[1].toString().toLowerCase().trim();
      const estado = row[5].toString().toLowerCase().trim();

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
    logActivity('ERROR_CHECK_ACCESS', email, course, 'error', error.toString());
    return false;
  }
}

/**
 * Agregar nuevo comprador
 */
function addPurchaser(email, course, amount, transactionId) {
  try {
    const sheet = getSheet(SHEET_NAMES.compradores);
    const timestamp = new Date();

    sheet.appendRow([
      email,
      course,
      timestamp,
      amount,
      transactionId || 'Manual',
      'Activo'
    ]);

    logActivity('ADD_PURCHASER', email, course, 'success', `Monto: ${amount}`);
    return true;
  } catch (error) {
    console.error('Error adding purchaser:', error);
    logActivity('ERROR_ADD_PURCHASER', email, course, 'error', error.toString());
    return false;
  }
}

/**
 * Obtener lista de compradores de un curso
 */
function getPurchasersByCourse(course) {
  try {
    const sheet = getSheet(SHEET_NAMES.compradores);
    const data = sheet.getDataRange().getValues();
    const purchasers = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const rowCourse = row[1].toString().toLowerCase().trim();
      const estado = row[5].toString().toLowerCase().trim();

      if (rowCourse === course.toLowerCase().trim() &&
          (estado === 'activo' || estado === '' || estado === 'pagado')) {
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

    return purchasers;
  } catch (error) {
    console.error('Error getting purchasers:', error);
    return [];
  }
}

// ═══════════════════════════════════════
// 🌐 ENDPOINT WEB APP (GET)
// ═══════════════════════════════════════

function doGet(e) {
  try {
    const params = e.parameter;
    const action = params.action;

    // CORS Headers
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);

    let response = {};

    switch(action) {
      case 'checkAccess':
        const email = params.email;
        const course = params.course;

        if (!email || !course) {
          response = {
            success: false,
            hasAccess: false,
            error: 'Email y curso son requeridos'
          };
        } else {
          const hasAccess = checkUserAccess(email, course);
          logActivity('CHECK_ACCESS', email, course, hasAccess ? 'access_granted' : 'access_denied');

          response = {
            success: true,
            hasAccess: hasAccess,
            timestamp: new Date().toISOString()
          };
        }
        break;

      case 'listPurchasers':
        const listCourse = params.course;
        if (!listCourse) {
          response = {
            success: false,
            error: 'Curso es requerido'
          };
        } else {
          const purchasers = getPurchasersByCourse(listCourse);
          response = {
            success: true,
            course: listCourse,
            count: purchasers.length,
            purchasers: purchasers
          };
        }
        break;

      case 'addPurchaser':
        const newEmail = params.email;
        const newCourse = params.course;
        const amount = params.amount;
        const transactionId = params.transactionId;

        if (!newEmail || !newCourse) {
          response = {
            success: false,
            error: 'Email y curso son requeridos'
          };
        } else {
          const added = addPurchaser(newEmail, newCourse, amount, transactionId);
          response = {
            success: added,
            message: added ? 'Comprador agregado exitosamente' : 'Error al agregar comprador'
          };
        }
        break;

      case 'stats':
        const derecho = getPurchasersByCourse('derecho-no-abogados');
        const legal = getPurchasersByCourse('legal-english');

        response = {
          success: true,
          stats: {
            'derecho-no-abogados': derecho.length,
            'legal-english': legal.length,
            total: derecho.length + legal.length
          }
        };
        break;

      default:
        response = {
          success: false,
          error: 'Acción no válida',
          availableActions: ['checkAccess', 'listPurchasers', 'addPurchaser', 'stats']
        };
    }

    output.setContent(JSON.stringify(response));
    return output;

  } catch (error) {
    const errorResponse = {
      success: false,
      error: error.toString()
    };

    const output = ContentService.createTextOutput(JSON.stringify(errorResponse));
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
  }
}

// ═══════════════════════════════════════
// 🌐 ENDPOINT WEB APP (POST)
// ═══════════════════════════════════════

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    let response = {};

    switch(action) {
      case 'webhookStripe':
        // Procesar webhook de Stripe
        const email = data.customer_email;
        const course = data.metadata?.course;
        const amount = data.amount_total / 100; // Stripe envía en centavos
        const transactionId = data.payment_intent;

        if (email && course) {
          addPurchaser(email, course, amount, transactionId);
          response = {
            success: true,
            message: 'Webhook procesado correctamente'
          };
        } else {
          response = {
            success: false,
            error: 'Datos incompletos en webhook'
          };
        }
        break;

      default:
        response = {
          success: false,
          error: 'Acción POST no válida'
        };
    }

    const output = ContentService.createTextOutput(JSON.stringify(response));
    output.setMimeType(ContentService.MimeType.JSON);
    return output;

  } catch (error) {
    const errorResponse = {
      success: false,
      error: error.toString()
    };

    const output = ContentService.createTextOutput(JSON.stringify(errorResponse));
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
  }
}

// ═══════════════════════════════════════
// 🧪 FUNCIONES DE PRUEBA
// ═══════════════════════════════════════

/**
 * Función para probar el sistema
 */
function testSystem() {
  // Test 1: Agregar comprador de prueba
  Logger.log('Test 1: Agregando comprador de prueba...');
  addPurchaser('test@example.com', 'derecho-no-abogados', '500', 'TEST_TRANSACTION_001');

  // Test 2: Verificar acceso
  Logger.log('Test 2: Verificando acceso...');
  const hasAccess = checkUserAccess('test@example.com', 'derecho-no-abogados');
  Logger.log('¿Tiene acceso? ' + hasAccess);

  // Test 3: Listar compradores
  Logger.log('Test 3: Listando compradores...');
  const purchasers = getPurchasersByCourse('derecho-no-abogados');
  Logger.log('Total compradores: ' + purchasers.length);

  Logger.log('✅ Pruebas completadas');
}

/**
 * Función para limpiar datos de prueba
 */
function cleanupTestData() {
  const sheet = getSheet(SHEET_NAMES.compradores);
  const data = sheet.getDataRange().getValues();

  for (let i = data.length; i > 1; i--) {
    if (data[i-1][0].toString().includes('test@example.com')) {
      sheet.deleteRow(i);
      Logger.log('Eliminada fila de prueba: ' + i);
    }
  }

  Logger.log('✅ Datos de prueba eliminados');
}

// ═══════════════════════════════════════
// 📝 INSTRUCCIONES FINALES
// ═══════════════════════════════════════

/**
 * PASOS PARA USAR ESTE SCRIPT:
 *
 * 1. Crear Google Sheet:
 *    - Ir a https://sheets.google.com
 *    - Crear nueva hoja llamada "Compradores Empírica"
 *    - Copiar el ID del Sheet (está en la URL)
 *    - Pegarlo arriba en SHEET_ID
 *
 * 2. Instalar este script:
 *    - Ir a https://script.google.com
 *    - Nuevo proyecto
 *    - Pegar este código
 *    - Guardar (Ctrl+S)
 *
 * 3. Probar:
 *    - Ejecutar función testSystem()
 *    - Verificar que se creen las hojas automáticamente
 *
 * 4. Desplegar:
 *    - Menú "Despliegue" > "Nueva implementación"
 *    - Tipo: "Aplicación web"
 *    - Ejecutar como: Tu cuenta
 *    - Acceso: "Cualquiera"
 *    - Copiar URL generada
 *
 * 5. Integrar:
 *    - Pegar URL en payment-access-control.js
 *    - Variable: CONFIG.GOOGLE_SCRIPT_URL
 *
 * ¡Listo!
 */
