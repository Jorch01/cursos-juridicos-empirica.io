/**
 * ============================================
 * BACKEND AVANZADO - CON LOGS Y NOTIFICACIONES
 * Sistema completo de verificación + monitoreo
 * ============================================
 */

// ═══════════════════════════════════════
// ⚙️ CONFIGURACIÓN
// ═══════════════════════════════════════

const SHEET_ID = '1xOCVvO-5DCV0jvEBrJryLp00NTuho7e-Z5h8NO1EBaI';

const SHEET_NAMES = {
  compradores: 'Compradores',
  logs: 'Logs',
  stats: 'Estadisticas'
};

// Configuración de EmailJS (opcional - para notificaciones)
const EMAIL_CONFIG = {
  adminEmail: 'jorge_clemente@empirica.mx',  // Tu email para recibir notificaciones
  enabled: false  // Cambiar a true cuando configures EmailJS
};

// ═══════════════════════════════════════
// 📊 FUNCIONES DE HOJAS
// ═══════════════════════════════════════

function getSheet(sheetName) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);

    if (sheetName === SHEET_NAMES.compradores) {
      sheet.appendRow(['Email', 'Curso', 'Fecha Pago', 'Monto', 'ID Transacción', 'Estado']);
      sheet.getRange('A1:F1').setFontWeight('bold').setBackground('#1B2C27').setFontColor('white');
    }
    else if (sheetName === SHEET_NAMES.logs) {
      sheet.appendRow(['Timestamp', 'Acción', 'Email', 'Curso', 'Resultado', 'Info Adicional', 'User Agent']);
      sheet.getRange('A1:G1').setFontWeight('bold').setBackground('#2C3E50').setFontColor('white');
    }
    else if (sheetName === SHEET_NAMES.stats) {
      sheet.appendRow(['Fecha', 'Total Accesos', 'Accesos Exitosos', 'Accesos Denegados', 'Emails Únicos']);
      sheet.getRange('A1:E1').setFontWeight('bold').setBackground('#059669').setFontColor('white');
    }
  }

  return sheet;
}

// ═══════════════════════════════════════
// 📝 SISTEMA DE LOGS MEJORADO
// ═══════════════════════════════════════

function logActivity(action, email, course, result, additionalInfo = '', userAgent = '') {
  try {
    const sheet = getSheet(SHEET_NAMES.logs);
    const timestamp = new Date();

    sheet.appendRow([
      timestamp,
      action,
      email || 'N/A',
      course || 'N/A',
      result,
      additionalInfo,
      userAgent || 'Unknown'
    ]);

    // Auto-limpieza: mantener solo los últimos 1000 logs
    const numRows = sheet.getLastRow();
    if (numRows > 1001) {  // 1000 datos + 1 encabezado
      sheet.deleteRows(2, numRows - 1001);  // Eliminar los más antiguos
    }

  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

/**
 * Obtener estadísticas de actividad
 */
function getActivityStats(days = 7) {
  try {
    const sheet = getSheet(SHEET_NAMES.logs);
    const data = sheet.getDataRange().getValues();

    const now = new Date();
    const cutoff = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));

    let totalAccess = 0;
    let successfulAccess = 0;
    let deniedAccess = 0;
    const uniqueEmails = new Set();

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const timestamp = new Date(row[0]);
      const action = row[1];
      const email = row[2];
      const result = row[4];

      if (timestamp >= cutoff && action === 'CHECK_ACCESS') {
        totalAccess++;

        if (result === 'access_granted') {
          successfulAccess++;
          if (email && email !== 'N/A') {
            uniqueEmails.add(email);
          }
        } else if (result === 'access_denied') {
          deniedAccess++;
        }
      }
    }

    return {
      period: `Últimos ${days} días`,
      totalAccess,
      successfulAccess,
      deniedAccess,
      uniqueUsers: uniqueEmails.size,
      successRate: totalAccess > 0 ? ((successfulAccess / totalAccess) * 100).toFixed(1) + '%' : '0%'
    };

  } catch (error) {
    console.error('Error getting stats:', error);
    return null;
  }
}

/**
 * Detectar actividad sospechosa
 */
function detectSuspiciousActivity(email, timeWindowMinutes = 5) {
  try {
    const sheet = getSheet(SHEET_NAMES.logs);
    const data = sheet.getDataRange().getValues();

    const now = new Date();
    const cutoff = new Date(now.getTime() - (timeWindowMinutes * 60 * 1000));

    let accessCount = 0;

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const timestamp = new Date(row[0]);
      const action = row[1];
      const rowEmail = row[2];

      if (timestamp >= cutoff &&
          action === 'CHECK_ACCESS' &&
          rowEmail === email) {
        accessCount++;
      }
    }

    // Si hay más de 10 intentos en 5 minutos, es sospechoso
    if (accessCount > 10) {
      logActivity('SUSPICIOUS_ACTIVITY', email, 'N/A', 'warning', `${accessCount} accesos en ${timeWindowMinutes} minutos`);
      return true;
    }

    return false;

  } catch (error) {
    console.error('Error detecting suspicious activity:', error);
    return false;
  }
}

// ═══════════════════════════════════════
// 📧 NOTIFICACIONES POR EMAIL (OPCIONAL)
// ═══════════════════════════════════════

/**
 * Enviar notificación de compra al admin
 */
function notifyAdmin(email, course, amount) {
  if (!EMAIL_CONFIG.enabled) return;

  try {
    const subject = `🎉 Nueva compra: ${course}`;
    const body = `
Hola,

Tienes una nueva compra en Empírica Legal Lab:

📧 Email: ${email}
📚 Curso: ${course}
💰 Monto: $${amount} MXN
🕐 Fecha: ${new Date().toLocaleString('es-MX')}

El usuario ya tiene acceso automático al curso.

---
Empírica Legal Lab
Sistema automatizado
    `;

    MailApp.sendEmail(EMAIL_CONFIG.adminEmail, subject, body);

  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
}

/**
 * Enviar email de bienvenida al comprador
 */
function sendWelcomeEmail(email, course) {
  if (!EMAIL_CONFIG.enabled) return;

  try {
    const courseName = course === 'derecho-no-abogados'
      ? 'Derecho para No Abogados'
      : 'Legal English: Anglo-American Law in Action';

    const subject = `✅ Bienvenido a ${courseName} - Empírica Legal Lab`;
    const body = `
Hola,

¡Gracias por tu compra! Ya tienes acceso completo al curso "${courseName}".

🎓 ¿Cómo acceder?
1. Ve a: https://cursos.empirica.mx/cursos/${course}/
2. Si te pide verificación, usa este email: ${email}

📱 ¿Necesitas ayuda?
Contáctanos por WhatsApp: +52 998 257 0828

¡Que disfrutes el curso!

---
Empírica Legal Lab
jorge_clemente@empirica.mx
    `;

    MailApp.sendEmail(email, subject, body);

  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
}

// ═══════════════════════════════════════
// 🔍 VERIFICACIÓN DE ACCESO
// ═══════════════════════════════════════

function checkUserAccess(email, course) {
  try {
    const sheet = getSheet(SHEET_NAMES.compradores);
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const rowEmail = row[0].toString().toLowerCase().trim();
      const rowCourse = row[1].toString().toLowerCase().trim();
      const estado = row[5].toString().toLowerCase().trim();

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
      'activo'
    ]);

    logActivity('ADD_PURCHASER', email, course, 'success', `Monto: ${amount}`);

    // Enviar notificaciones
    notifyAdmin(email, course, amount);
    sendWelcomeEmail(email, course);

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
    const userAgent = e.parameter.userAgent || 'Unknown';

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
          // Detectar actividad sospechosa
          const isSuspicious = detectSuspiciousActivity(email);

          const hasAccess = checkUserAccess(email, course);
          logActivity(
            'CHECK_ACCESS',
            email,
            course,
            hasAccess ? 'access_granted' : 'access_denied',
            isSuspicious ? 'SUSPICIOUS' : '',
            userAgent
          );

          response = {
            success: true,
            hasAccess: hasAccess,
            timestamp: new Date().toISOString(),
            warning: isSuspicious ? 'Actividad sospechosa detectada' : null
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
        const activityStats = getActivityStats(7);

        response = {
          success: true,
          stats: {
            'derecho-no-abogados': derecho.length,
            'legal-english': legal.length,
            total: derecho.length + legal.length
          },
          activity: activityStats
        };
        break;

      case 'activityStats':
        const days = parseInt(params.days) || 7;
        const stats = getActivityStats(days);

        response = {
          success: true,
          stats: stats
        };
        break;

      case 'logs':
        // Solo para admin - mostrar últimos 50 logs
        const logsSheet = getSheet(SHEET_NAMES.logs);
        const logsData = logsSheet.getDataRange().getValues();
        const recentLogs = logsData.slice(-50).reverse();

        response = {
          success: true,
          logs: recentLogs.map(row => ({
            timestamp: row[0],
            action: row[1],
            email: row[2],
            course: row[3],
            result: row[4],
            info: row[5]
          }))
        };
        break;

      default:
        response = {
          success: false,
          error: 'Acción no válida',
          availableActions: ['checkAccess', 'listPurchasers', 'addPurchaser', 'stats', 'activityStats', 'logs']
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
// 🌐 ENDPOINT WEB APP (POST) - WEBHOOKS
// ═══════════════════════════════════════

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    let response = {};

    switch(action) {
      case 'webhookStripe':
        const email = data.customer_email;
        const course = data.metadata?.course;
        const amount = data.amount_total / 100;
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

function testSystem() {
  Logger.log('Test 1: Agregando comprador de prueba...');
  addPurchaser('test@example.com', 'derecho-no-abogados', '500', 'TEST_TRANSACTION_001');

  Logger.log('Test 2: Verificando acceso...');
  const hasAccess = checkUserAccess('test@example.com', 'derecho-no-abogados');
  Logger.log('¿Tiene acceso? ' + hasAccess);

  Logger.log('Test 3: Obteniendo estadísticas...');
  const stats = getActivityStats(7);
  Logger.log('Estadísticas: ' + JSON.stringify(stats));

  Logger.log('✅ Pruebas completadas');
}
