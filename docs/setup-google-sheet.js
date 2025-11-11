/**
 * ============================================
 * SCRIPT DE CONFIGURACIÓN AUTOMÁTICA
 * Google Sheet - Empírica Legal Lab
 * ============================================
 *
 * INSTRUCCIONES:
 * 1. Abre tu Google Sheet en blanco
 * 2. Ve a: Extensiones > Apps Script
 * 3. Borra el código que aparece por defecto
 * 4. Copia y pega TODO este código
 * 5. Guarda (Ctrl+S o Cmd+S)
 * 6. Ejecuta la función: setupSheet() usando el botón "Ejecutar" ▶️
 * 7. La primera vez te pedirá permisos - acéptalos
 * 8. ¡Listo! Tu sheet estará configurado
 */

/**
 * 🚀 FUNCIÓN PRINCIPAL DE CONFIGURACIÓN
 * Ejecuta esta función para configurar todo automáticamente
 */
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  console.log('📋 Iniciando configuración del Google Sheet...');

  // 1. Crear hoja de Compradores
  createCompradoresSheet(ss);

  // 2. Crear hoja de Logs
  createLogsSheet(ss);

  // 3. Mensaje de éxito en consola
  console.log('✅ Configuración completada exitosamente');
  console.log('');
  console.log('📋 SIGUIENTE PASO:');
  console.log('1. Cierra esta pestaña y vuelve a tu Google Sheet');
  console.log('2. Recarga la página (F5 o Cmd+R)');
  console.log('3. Verás un nuevo menú "🎓 Empírica Legal Lab"');
  console.log('4. Desde ese menú puedes agregar usuarios de prueba');
  console.log('');
  console.log('O ejecuta la función: agregarUsuarioPrueba()');
}

/**
 * 📊 Crear hoja de Compradores
 */
function createCompradoresSheet(ss) {
  let sheet = ss.getSheetByName('Compradores');

  // Si existe, limpiarla; si no, crearla
  if (sheet) {
    console.log('⚠️  Hoja "Compradores" ya existe - limpiando...');
    sheet.clear();
  } else {
    console.log('📄 Creando hoja "Compradores"...');
    sheet = ss.insertSheet('Compradores');
  }

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
  sheet.setColumnWidth(3, 120); // Fecha Pago
  sheet.setColumnWidth(4, 100); // Monto
  sheet.setColumnWidth(5, 200); // ID Transacción
  sheet.setColumnWidth(6, 100); // Estado

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

  console.log('✅ Hoja "Compradores" configurada');
}

/**
 * 📝 Crear hoja de Logs
 */
function createLogsSheet(ss) {
  let sheet = ss.getSheetByName('Logs');

  // Si existe, limpiarla; si no, crearla
  if (sheet) {
    console.log('⚠️  Hoja "Logs" ya existe - limpiando...');
    sheet.clear();
  } else {
    console.log('📄 Creando hoja "Logs"...');
    sheet = ss.insertSheet('Logs');
  }

  // Configurar encabezados
  const headers = ['Timestamp', 'Acción', 'Email', 'Curso', 'Resultado', 'IP'];
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
  sheet.setColumnWidth(2, 150); // Acción
  sheet.setColumnWidth(3, 250); // Email
  sheet.setColumnWidth(4, 180); // Curso
  sheet.setColumnWidth(5, 150); // Resultado
  sheet.setColumnWidth(6, 120); // IP

  // Congelar primera fila
  sheet.setFrozenRows(1);

  console.log('✅ Hoja "Logs" configurada');
}

/**
 * 👤 AGREGAR USUARIO DE PRUEBA - Versión Simple
 * ⚠️ INSTRUCCIONES: Edita la línea que dice 'TU_EMAIL_AQUI' con tu email real
 * Luego ejecuta esta función desde el editor
 */
function agregarUsuarioPrueba() {
  // ⬇️ EDITA ESTA LÍNEA CON TU EMAIL ⬇️
  const email = 'TU_EMAIL_AQUI@ejemplo.com';
  // ⬆️ EDITA ESTA LÍNEA CON TU EMAIL ⬆️

  // Validar email
  if (email === 'TU_EMAIL_AQUI@ejemplo.com' || !email.includes('@')) {
    console.error('❌ ERROR: Debes editar la función y poner tu email real');
    console.error('Busca la línea que dice: const email = "TU_EMAIL_AQUI@ejemplo.com"');
    console.error('Y cámbiala por tu email real, ejemplo: const email = "jorge@gmail.com"');
    return;
  }

  // Agregar acceso a ambos cursos
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Compradores');

  if (!sheet) {
    console.error('❌ ERROR: Primero debes ejecutar la función setupSheet()');
    return;
  }

  const fecha = new Date();

  // Agregar Derecho para No Abogados
  sheet.appendRow([
    email,
    'derecho-no-abogados',
    Utilities.formatDate(fecha, Session.getScriptTimeZone(), 'yyyy-MM-dd'),
    0,
    'TEST-MANUAL-' + fecha.getTime(),
    'activo'
  ]);

  // Agregar Legal English
  sheet.appendRow([
    email,
    'legal-english',
    Utilities.formatDate(fecha, Session.getScriptTimeZone(), 'yyyy-MM-dd'),
    0,
    'TEST-MANUAL-' + fecha.getTime(),
    'activo'
  ]);

  console.log('✅ Usuario de prueba agregado exitosamente:');
  console.log('');
  console.log('📧 Email: ' + email);
  console.log('✓ Derecho para No Abogados');
  console.log('✓ Legal English');
  console.log('');
  console.log('⚠️ IMPORTANTE:');
  console.log('Asegúrate de usar este mismo email en el sitio web.');
  console.log('');
  console.log('Para configurarlo en el navegador:');
  console.log('1. Abre la consola del navegador (F12)');
  console.log('2. Ejecuta este comando:');
  console.log('   localStorage.setItem("empirica_user_email", "' + email + '")');
  console.log('');
  console.log('3. Recarga la página del curso');
}

/**
 * 👤 AGREGAR USUARIO DE PRUEBA - Versión con UI (solo desde menú)
 * Esta versión solo funciona cuando se ejecuta desde el menú del Sheet
 */
function agregarUsuarioPruebaConUI() {
  try {
    const ui = SpreadsheetApp.getUi();

    // Pedir el email del usuario
    const response = ui.prompt(
      '👤 Agregar Usuario de Prueba',
      'Ingresa tu email para tener acceso a ambos cursos:\n\n(Este email debe ser el mismo que usas en el sitio web)',
      ui.ButtonSet.OK_CANCEL
    );

    // Verificar si el usuario canceló
    if (response.getSelectedButton() !== ui.Button.OK) {
      return;
    }

    const email = response.getResponseText().trim();

    // Validar email
    if (!email || !email.includes('@')) {
      ui.alert('❌ Error', 'Por favor ingresa un email válido.', ui.ButtonSet.OK);
      return;
    }

    // Agregar acceso a ambos cursos
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Compradores');

    if (!sheet) {
      ui.alert('❌ Error', 'Primero debes ejecutar la función setupSheet()', ui.ButtonSet.OK);
      return;
    }

    const fecha = new Date();

    // Agregar Derecho para No Abogados
    sheet.appendRow([
      email,
      'derecho-no-abogados',
      Utilities.formatDate(fecha, Session.getScriptTimeZone(), 'yyyy-MM-dd'),
      0,
      'TEST-MANUAL-' + fecha.getTime(),
      'activo'
    ]);

    // Agregar Legal English
    sheet.appendRow([
      email,
      'legal-english',
      Utilities.formatDate(fecha, Session.getScriptTimeZone(), 'yyyy-MM-dd'),
      0,
      'TEST-MANUAL-' + fecha.getTime(),
      'activo'
    ]);

    ui.alert(
      '✅ Usuario Agregado',
      'Se ha agregado acceso completo para:\n\n' +
      '📧 Email: ' + email + '\n\n' +
      '✓ Derecho para No Abogados\n' +
      '✓ Legal English\n\n' +
      '⚠️ IMPORTANTE:\n' +
      'Asegúrate de usar este mismo email cuando te registres en el sitio web.\n\n' +
      'Para configurarlo manualmente en el navegador:\n' +
      '1. Abre la consola del navegador (F12)\n' +
      '2. Ejecuta:\n' +
      'localStorage.setItem(\'empirica_user_email\', \'' + email + '\')',
      ui.ButtonSet.OK
    );

    console.log('✅ Usuario de prueba agregado:', email);
  } catch (e) {
    console.error('Esta función solo puede ejecutarse desde el menú del Google Sheet');
    console.error('Usa la función agregarUsuarioPrueba() desde el editor en su lugar');
  }
}

/**
 * 🗑️ LIMPIAR TODO Y EMPEZAR DE NUEVO
 * Ejecuta esta función si quieres resetear todo
 */
function resetearTodo() {
  const ui = SpreadsheetApp.getUi();

  const response = ui.alert(
    '⚠️ Confirmar Reset',
    '¿Estás seguro de que quieres eliminar TODAS las hojas y datos?\n\n' +
    'Esta acción NO se puede deshacer.',
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) {
    return;
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Eliminar hoja Compradores
  const compradoresSheet = ss.getSheetByName('Compradores');
  if (compradoresSheet) {
    ss.deleteSheet(compradoresSheet);
    console.log('🗑️  Hoja "Compradores" eliminada');
  }

  // Eliminar hoja Logs
  const logsSheet = ss.getSheetByName('Logs');
  if (logsSheet) {
    ss.deleteSheet(logsSheet);
    console.log('🗑️  Hoja "Logs" eliminada');
  }

  ui.alert(
    '✅ Reset Completo',
    'Todas las hojas han sido eliminadas.\n\n' +
    'Ejecuta setupSheet() para configurar de nuevo.',
    ui.ButtonSet.OK
  );
}

/**
 * 📋 CREAR MENÚ PERSONALIZADO
 * Se ejecuta automáticamente al abrir el Sheet
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🎓 Empírica Legal Lab')
    .addItem('⚙️ Configurar Sheet', 'setupSheet')
    .addSeparator()
    .addItem('👤 Agregar Usuario de Prueba', 'agregarUsuarioPruebaConUI')
    .addSeparator()
    .addItem('🗑️ Resetear Todo', 'resetearTodo')
    .addToUi();
}
