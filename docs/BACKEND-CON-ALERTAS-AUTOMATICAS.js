/**
 * ============================================
 * BACKEND CON ALERTAS AUTOMÁTICAS
 * Notificaciones instantáneas de actividad sospechosa
 * ============================================
 */

const SHEET_ID = '1xOCVvO-5DCV0jvEBrJryLp00NTuho7e-Z5h8NO1EBaI';

const SHEET_NAMES = {
  compradores: 'Compradores',
  logs: 'Logs',
  alertas: 'Alertas'
};

// ⚠️ CONFIGURACIÓN DE ALERTAS
const ALERT_CONFIG = {
  adminEmail: 'enlilh@gmail.com',  // Tu email
  enabledAlerts: true,  // Cambiar a false para desactivar alertas

  // Umbrales de detección
  maxAttemptsInTimeWindow: 10,  // Máximo de intentos permitidos
  timeWindowMinutes: 5,          // En cuántos minutos

  // Tipos de alertas a enviar
  sendOnSuspiciousActivity: true,  // Actividad sospechosa
  sendOnNewPurchase: true,         // Nueva compra
  sendOnAccessDenied: false        // Acceso denegado (puede generar mucho spam)
};

// ═══════════════════════════════════════
// 📧 SISTEMA DE NOTIFICACIONES AUTOMÁTICAS
// ═══════════════════════════════════════

/**
 * Enviar alerta de actividad sospechosa
 */
function sendSuspiciousActivityAlert(email, course, attemptCount, timeWindow) {
  if (!ALERT_CONFIG.enabledAlerts || !ALERT_CONFIG.sendOnSuspiciousActivity) {
    return;
  }

  try {
    const subject = `🚨 ALERTA: Actividad Sospechosa Detectada - ${email}`;

    const body = `
⚠️ ALERTA DE SEGURIDAD - Empírica Legal Lab
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 Actividad Sospechosa Detectada

📧 Email: ${email}
📚 Curso: ${course}
🔢 Intentos: ${attemptCount} accesos
⏱️ Periodo: Últimos ${timeWindow} minutos
🕐 Timestamp: ${new Date().toLocaleString('es-MX')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ POSIBLES CAUSAS:

1. Ataque de fuerza bruta
2. Usuario compartiendo credenciales
3. Bot automatizado
4. Usuario legítimo con problemas técnicos

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 ACCIONES RECOMENDADAS:

1. Revisar logs en Google Sheets → pestaña "Logs"
2. Filtrar por email: ${email}
3. Verificar User Agent para detectar patrones
4. Si es abuso, bloquear en Google Sheets:
   - Cambiar estado de "activo" a "bloqueado"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 Links rápidos:
- Ver Logs: https://docs.google.com/spreadsheets/d/${SHEET_ID}
- WhatsApp: https://wa.me/529982570828

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sistema de Alertas Automáticas - Empírica Legal Lab
    `;

    MailApp.sendEmail({
      to: ALERT_CONFIG.adminEmail,
      subject: subject,
      body: body
    });

    // Guardar alerta en Sheet
    saveAlert('SUSPICIOUS_ACTIVITY', email, course, `${attemptCount} intentos en ${timeWindow} min`);

    console.log('✅ Alerta de actividad sospechosa enviada a:', ALERT_CONFIG.adminEmail);

  } catch (error) {
    console.error('❌ Error enviando alerta:', error);
    // No fallar el sistema si el email falla
  }
}

/**
 * Enviar notificación de nueva compra
 */
function sendNewPurchaseNotification(email, course, amount, transactionId) {
  if (!ALERT_CONFIG.enabledAlerts || !ALERT_CONFIG.sendOnNewPurchase) {
    return;
  }

  try {
    const courseName = course === 'derecho-no-abogados'
      ? 'Derecho para No Abogados'
      : 'Legal English';

    const subject = `🎉 Nueva Compra: ${courseName} - $${amount} MXN`;

    const body = `
🎉 NUEVA COMPRA - Empírica Legal Lab
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¡Felicidades! Tienes una nueva compra

📧 Email: ${email}
📚 Curso: ${courseName}
💰 Monto: $${amount} MXN
🆔 ID Transacción: ${transactionId}
🕐 Fecha: ${new Date().toLocaleString('es-MX')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Estado: El usuario YA tiene acceso automático al curso

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Estadísticas del Día:
Para ver estadísticas completas, visita:
https://docs.google.com/spreadsheets/d/${SHEET_ID}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Empírica Legal Lab - Sistema Automatizado
    `;

    MailApp.sendEmail({
      to: ALERT_CONFIG.adminEmail,
      subject: subject,
      body: body
    });

    console.log('✅ Notificación de compra enviada');

  } catch (error) {
    console.error('❌ Error enviando notificación de compra:', error);
  }
}

/**
 * Enviar email de bienvenida al comprador
 */
function sendWelcomeEmail(email, course) {
  try {
    const courseName = course === 'derecho-no-abogados'
      ? 'Derecho para No Abogados'
      : 'Legal English: Anglo-American Law in Action';

    const courseUrl = `https://cursos.empirica.mx/cursos/${course}/`;

    const subject = `✅ Bienvenido a ${courseName} - Empírica Legal Lab`;

    const body = `
¡Hola!

🎉 ¡Gracias por tu compra! Ya tienes acceso completo al curso:
"${courseName}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎓 ¿CÓMO ACCEDER AL CURSO?

1. Ve a: ${courseUrl}
2. Si te pide verificación, usa este email: ${email}
3. ¡Disfruta el curso!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 TIPS:

✅ Marca este email como importante - contiene tu link de acceso
✅ Puedes acceder desde cualquier dispositivo
✅ Tu acceso es de por vida

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 ¿NECESITAS AYUDA?

Si tienes algún problema para acceder:
- WhatsApp: +52 998 257 0828
- Email: jorge_clemente@empirica.mx

Horario: Lun-Vie 9:00-18:00 | Sáb 9:00-14:00

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¡Que disfrutes el curso!

Mtro. Jorge Israel Clemente Marié
Empírica Legal Lab
www.empirica.mx
    `;

    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: body,
      replyTo: 'jorge_clemente@empirica.mx'
    });

    console.log('✅ Email de bienvenida enviado a:', email);

  } catch (error) {
    console.error('❌ Error enviando email de bienvenida:', error);
  }
}

/**
 * Guardar alerta en Sheet
 */
function saveAlert(type, email, course, details) {
  try {
    const sheet = getSheet(SHEET_NAMES.alertas);

    // Crear headers si es nueva hoja
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Tipo', 'Email', 'Curso', 'Detalles', 'Estado']);
      sheet.getRange('A1:F1').setFontWeight('bold').setBackground('#DC2626').setFontColor('white');
    }

    sheet.appendRow([
      new Date(),
      type,
      email || 'N/A',
      course || 'N/A',
      details,
      'Pendiente'
    ]);

    // Auto-limpieza: mantener solo últimas 500 alertas
    const numRows = sheet.getLastRow();
    if (numRows > 501) {
      sheet.deleteRows(2, numRows - 501);
    }

  } catch (error) {
    console.error('Error guardando alerta:', error);
  }
}

// ═══════════════════════════════════════
// 📊 FUNCIONES DE SHEETS
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
    else if (sheetName === SHEET_NAMES.alertas) {
      sheet.appendRow(['Timestamp', 'Tipo', 'Email', 'Curso', 'Detalles', 'Estado']);
      sheet.getRange('A1:F1').setFontWeight('bold').setBackground('#DC2626').setFontColor('white');
    }
  }

  return sheet;
}

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

    // Auto-limpieza
    const numRows = sheet.getLastRow();
    if (numRows > 1001) {
      sheet.deleteRows(2, numRows - 1001);
    }

  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

/**
 * Detectar actividad sospechosa
 */
function detectSuspiciousActivity(email, timeWindowMinutes = null) {
  try {
    const window = timeWindowMinutes || ALERT_CONFIG.timeWindowMinutes;
    const maxAttempts = ALERT_CONFIG.maxAttemptsInTimeWindow;

    const sheet = getSheet(SHEET_NAMES.logs);
    const data = sheet.getDataRange().getValues();

    const now = new Date();
    const cutoff = new Date(now.getTime() - (window * 60 * 1000));

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

    if (accessCount > maxAttempts) {
      // ENVIAR ALERTA AUTOMÁTICA
      sendSuspiciousActivityAlert(email, 'N/A', accessCount, window);

      logActivity('SUSPICIOUS_ACTIVITY', email, 'N/A', 'warning',
        `${accessCount} accesos en ${window} minutos - ALERTA ENVIADA`);

      return true;
    }

    return false;

  } catch (error) {
    console.error('Error detecting suspicious activity:', error);
    return false;
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

    // ENVIAR NOTIFICACIONES AUTOMÁTICAS
    sendNewPurchaseNotification(email, course, amount, transactionId);
    sendWelcomeEmail(email, course);

    return true;
  } catch (error) {
    console.error('Error adding purchaser:', error);
    logActivity('ERROR_ADD_PURCHASER', email, course, 'error', error.toString());
    return false;
  }
}

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
          // Detectar actividad sospechosa (ENVÍA ALERTA AUTOMÁTICA)
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
            warning: isSuspicious ? 'Actividad sospechosa detectada y reportada' : null
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
