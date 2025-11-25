# 🚀 Guía Completa: Implementación de Sistema de Pagos

## Stripe + Google Sheets para Empírica Legal Lab

---

## 📋 Índice

1. [Configuración de Stripe](#1-configuración-de-stripe)
2. [Configuración de Google Sheets](#2-configuración-de-google-sheets)
3. [Configuración de Google Apps Script](#3-configuración-de-google-apps-script)
4. [Integración en el Sitio Web](#4-integración-en-el-sitio-web)
5. [Pruebas del Sistema](#5-pruebas-del-sistema)
6. [Gestión de Compradores](#6-gestión-de-compradores)
7. [Solución de Problemas](#7-solución-de-problemas)

---

## 1. Configuración de Stripe

### 1.1 Crear Cuenta en Stripe

1. Ir a https://stripe.com/mx
2. Clic en "Empezar ahora"
3. Completar datos:
   - Email
   - Nombre completo
   - País: **México**
   - Información de negocio
4. Verificar email

### 1.2 Activar Cuenta

1. Ir al Dashboard de Stripe
2. Completar "Información de la empresa":
   - RFC
   - Dirección fiscal
   - Representante legal
   - Cuenta bancaria (CLABE)
3. Esperar verificación (1-2 días hábiles)

### 1.3 Crear Payment Links

**Para Curso: Derecho para No Abogados ($500 MXN)**

1. En Dashboard > "Payment Links"
2. Clic en "+ New"
3. Configurar:

```
Nombre del producto: Curso: Derecho para No Abogados
Descripción: Acceso completo al curso + certificado oficial SAT
Precio: $500 MXN
Tipo: Pago único
```

4. En "Payment page":
   - Permitir códigos promocionales: ✅
   - Solicitar información de facturación: ✅
   - Recopilar número de teléfono: ✅ (opcional)

5. En "After payment":
   - Redirect: `https://cursos.empirica.mx/gracias.html?curso=derecho-no-abogados`

6. En "Metadata" (importante):
   ```
   course: derecho-no-abogados
   ```

7. Guardar y copiar el link generado

**Para Curso: Legal English ($5,000 MXN)**

Repetir mismo proceso con:
```
Nombre del producto: Curso: Legal English Anglo-American Law
Descripción: Acceso completo al curso de 15 módulos + diploma oficial SAT
Precio: $5,000 MXN
```

Metadata:
```
course: legal-english
```

### 1.4 Configurar Métodos de Pago

1. Ir a Settings > Payment methods
2. Activar:
   - ✅ Tarjetas (Visa, Mastercard, Amex)
   - ✅ OXXO
   - ✅ Transferencia bancaria (SPEI)
3. Guardar cambios

### 1.5 Guardar Links de Pago

Copiar los dos links generados. Los necesitarás más adelante:

```
Link Derecho: https://buy.stripe.com/XXXXXXXXXXXXX
Link Legal English: https://buy.stripe.com/YYYYYYYYYYYYYY
```

---

## 2. Configuración de Google Sheets

### 2.1 Crear Google Sheet

1. Ir a https://sheets.google.com
2. Crear hoja nueva: **"Compradores Empírica Legal Lab"**
3. Copiar el ID del Sheet:
   - Está en la URL después de `/d/`
   - Ejemplo: `https://docs.google.com/spreadsheets/d/ABC123XYZ789/edit`
   - ID es: `ABC123XYZ789`
4. Guardar este ID

### 2.2 Estructura de la Hoja

Las hojas se crearán automáticamente, pero puedes crearlas manualmente:

**Hoja 1: "Compradores"**

| Email | Curso | Fecha Pago | Monto | ID Transacción | Estado |
|-------|-------|------------|-------|----------------|--------|
| test@example.com | derecho-no-abogados | 2025-01-15 | 500 | pi_test123 | Activo |

**Hoja 2: "Logs"**

| Timestamp | Acción | Email | Curso | Resultado | IP |
|-----------|--------|-------|-------|-----------|-----|
| 2025-01-15 10:30 | CHECK_ACCESS | test@example.com | derecho-no-abogados | access_granted | - |

---

## 3. Configuración de Google Apps Script

### 3.1 Crear Proyecto

1. Ir a https://script.google.com
2. Clic en "+ Nuevo proyecto"
3. Nombrar: **"Empírica Backend API"**

### 3.2 Copiar Código

1. Borrar todo el código existente
2. Abrir el archivo: `docs/google-apps-script-backend.js`
3. Copiar TODO el contenido
4. Pegarlo en el editor de Apps Script

### 3.3 Configurar SHEET_ID

1. Buscar la línea:
   ```javascript
   const SHEET_ID = 'TU_SHEET_ID_AQUI';
   ```

2. Reemplazar con tu ID del Sheet:
   ```javascript
   const SHEET_ID = 'ABC123XYZ789';
   ```

3. Guardar (Ctrl+S o Cmd+S)

### 3.4 Probar el Script

1. En el menú superior, seleccionar función: `testSystem`
2. Clic en ▶️ "Ejecutar"
3. Autorizar acceso la primera vez:
   - Clic en "Revisar permisos"
   - Seleccionar tu cuenta Google
   - Clic en "Ir a Empírica Backend API (no seguro)"
   - Clic en "Permitir"

4. Verificar logs:
   - Menú "Ver" > "Logs"
   - Debería mostrar: "✅ Pruebas completadas"

5. Verificar tu Google Sheet:
   - Debe tener 2 hojas creadas: "Compradores" y "Logs"
   - "Compradores" debe tener 1 fila de prueba

### 3.5 Desplegar como Web App

1. Clic en "Despliegue" > "Nueva implementación"
2. Clic en ⚙️ junto a "Selecciona el tipo"
3. Seleccionar: "Aplicación web"
4. Configurar:
   ```
   Descripción: API de Acceso Empírica v1
   Ejecutar como: Yo (tu@email.com)
   Quién tiene acceso: Cualquiera
   ```
5. Clic en "Implementar"
6. **COPIAR LA URL generada** (comienza con `https://script.google.com/...`)
7. Guardar esta URL - ¡la necesitarás!

### 3.6 Probar la API

Abre en tu navegador:
```
TU_URL_DE_APPS_SCRIPT?action=stats
```

Deberías ver algo como:
```json
{
  "success": true,
  "stats": {
    "derecho-no-abogados": 1,
    "legal-english": 0,
    "total": 1
  }
}
```

✅ **¡Tu backend está funcionando!**

---

## 4. Integración en el Sitio Web

### 4.1 Editar payment-access-control.js

1. Abrir: `js/payment-access-control.js`

2. Buscar la línea:
   ```javascript
   GOOGLE_SCRIPT_URL: 'TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI',
   ```

3. Reemplazar con tu URL de Apps Script:
   ```javascript
   GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/XXXXX/exec',
   ```

4. Buscar:
   ```javascript
   STRIPE_LINKS: {
       'derecho-no-abogados': 'https://buy.stripe.com/TU_LINK_DERECHO',
       'legal-english': 'https://buy.stripe.com/TU_LINK_LEGAL_ENGLISH'
   },
   ```

5. Reemplazar con tus links de Stripe:
   ```javascript
   STRIPE_LINKS: {
       'derecho-no-abogados': 'https://buy.stripe.com/test_XXXXX',
       'legal-english': 'https://buy.stripe.com/test_YYYYY'
   },
   ```

6. Guardar archivo

### 4.2 Agregar Script a las Páginas de Cursos

**En: `cursos/derecho-no-abogados/index.html`**

Buscar la línea `</body>` (casi al final) y agregar ANTES:

```html
<!-- Sistema de Control de Acceso y Pagos -->
<script src="../../js/payment-access-control.js"></script>
```

**En: `cursos/legal-english/index.html`**

Igual, agregar antes de `</body>`:

```html
<!-- Sistema de Control de Acceso y Pagos -->
<script src="../../js/payment-access-control.js"></script>
```

### 4.3 Crear Página de Agradecimiento

Crear archivo: `gracias.html` en la raíz:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¡Gracias por tu inscripción! | Empírica Legal Lab</title>
    <link rel="stylesheet" href="css/styles.css">
    <style>
        .thank-you-container {
            max-width: 800px;
            margin: 100px auto;
            padding: 60px 40px;
            text-align: center;
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        .thank-you-icon {
            font-size: 5rem;
            margin-bottom: 20px;
        }
        .thank-you-title {
            color: #1B2C27;
            font-size: 2.5rem;
            margin-bottom: 20px;
        }
        .thank-you-message {
            color: #6C757D;
            font-size: 1.2rem;
            line-height: 1.8;
            margin-bottom: 40px;
        }
        .next-steps {
            background: #F0FDF4;
            padding: 30px;
            border-radius: 15px;
            border-left: 4px solid #10B981;
            text-align: left;
            margin: 40px 0;
        }
        .next-steps h3 {
            color: #1B2C27;
            margin-bottom: 20px;
        }
        .next-steps ul {
            list-style: none;
            padding: 0;
        }
        .next-steps li {
            padding: 10px 0;
            padding-left: 30px;
            position: relative;
            color: #2C3E50;
        }
        .next-steps li:before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #10B981;
            font-weight: bold;
            font-size: 1.2rem;
        }
    </style>
</head>
<body>
    <div class="thank-you-container">
        <div class="thank-you-icon">🎉</div>
        <h1 class="thank-you-title">¡Gracias por tu inscripción!</h1>
        <p class="thank-you-message">
            Tu pago ha sido procesado exitosamente. En breve recibirás un email de confirmación con todos los detalles de tu curso.
        </p>

        <div class="next-steps">
            <h3>📋 Próximos Pasos:</h3>
            <ul>
                <li>Revisa tu email para confirmar la inscripción</li>
                <li>Ya tienes acceso completo al curso</li>
                <li>Recuerda el email con el que te registraste para acceder</li>
                <li>Si tienes dudas, contáctanos por WhatsApp</li>
            </ul>
        </div>

        <div style="display: flex; gap: 15px; justify-content: center; margin-top: 40px;">
            <a href="index.html" class="btn btn-secondary">
                🏠 Volver al Inicio
            </a>
            <a href="https://wa.me/529982570828?text=Hola,%20acabo%20de%20inscribirme%20a%20un%20curso" class="btn btn-primary">
                📱 Contactar Soporte
            </a>
        </div>

        <p style="margin-top: 40px; color: #6C757D; font-size: 0.9rem;">
            Si no recibiste el email de confirmación en los próximos 10 minutos,<br>
            revisa tu carpeta de spam o contáctanos por WhatsApp.
        </p>
    </div>

    <script>
        // Detectar curso desde URL
        const urlParams = new URLSearchParams(window.location.search);
        const curso = urlParams.get('curso');

        // Mostrar mensaje específico según el curso
        if (curso === 'derecho-no-abogados') {
            document.querySelector('.thank-you-message').innerHTML = `
                ¡Felicidades! Ya tienes acceso completo al curso <strong>Derecho para No Abogados</strong>.
                <br><br>
                Tu inversión de $500 MXN incluye el certificado oficial con firma electrónica SAT.
            `;
        } else if (curso === 'legal-english') {
            document.querySelector('.thank-you-message').innerHTML = `
                ¡Felicidades! Ya tienes acceso completo al curso <strong>Legal English: Anglo-American Law in Action</strong>.
                <br><br>
                Tu inversión de $5,000 MXN incluye el diploma oficial con firma electrónica SAT.
            `;
        }
    </script>
</body>
</html>
```

---

## 5. Pruebas del Sistema

### 5.1 Agregar Comprador de Prueba

1. Abrir tu Google Sheet
2. En la hoja "Compradores", agregar fila:

```
Email: tuprueba@gmail.com
Curso: derecho-no-abogados
Fecha Pago: 2025-01-15
Monto: 500
ID Transacción: TEST001
Estado: Activo
```

### 5.2 Probar Acceso

1. Abrir: `cursos/derecho-no-abogados/index.html`
2. Registrarte con el email: `tuprueba@gmail.com`
3. **Resultado esperado**: Acceso completo, sin modal de pago

### 5.3 Probar Bloqueo

1. Borrar cookies y localStorage
2. Abrir nuevamente: `cursos/derecho-no-abogados/index.html`
3. Registrarte con otro email: `otro@gmail.com`
4. **Resultado esperado**: Modal de pago aparece

### 5.4 Verificar Logs

1. Abrir Google Sheet
2. Ir a hoja "Logs"
3. Deberías ver registros de:
   - `CHECK_ACCESS` con resultado `access_granted` o `access_denied`

### 5.5 Probar Pago Real (Modo Test)

**IMPORTANTE**: Stripe debe estar en "Modo de Prueba"

1. Clic en el botón de pago del modal
2. Usar tarjeta de prueba de Stripe:
   ```
   Número: 4242 4242 4242 4242
   Fecha: Cualquier fecha futura
   CVC: Cualquier 3 dígitos
   ```
3. Completar pago
4. Verificar redirect a página de agradecimiento

---

## 6. Gestión de Compradores

### 6.1 Agregar Comprador Manualmente

Si alguien paga por transferencia o OXXO:

1. Abrir Google Sheet
2. Agregar fila en "Compradores":
   ```
   Email: cliente@example.com
   Curso: derecho-no-abogados
   Fecha Pago: [Fecha actual]
   Monto: 500
   ID Transacción: OXXO-[REFERENCIA]
   Estado: Activo
   ```

### 6.2 Revocar Acceso

Para quitar acceso a alguien:

1. Buscar su fila en "Compradores"
2. Cambiar columna "Estado" a: `Revocado`
3. El sistema bloqueará acceso en 24 horas

### 6.3 Ver Estadísticas

Visita en tu navegador:
```
TU_URL_DE_APPS_SCRIPT?action=stats
```

Ver compradores de un curso específico:
```
TU_URL_DE_APPS_SCRIPT?action=listPurchasers&course=derecho-no-abogados
```

---

## 7. Solución de Problemas

### Problema: Modal de pago no aparece

**Solución:**
1. Abrir Consola del Navegador (F12)
2. Ver si hay errores de JavaScript
3. Verificar que el script esté cargado: `console.log(window.EmpricaAccess)`

### Problema: API no responde

**Solución:**
1. Verificar URL de Apps Script en `payment-access-control.js`
2. Probar la API directamente en navegador
3. Revisar permisos del script

### Problema: Usuario pagó pero no tiene acceso

**Solución:**
1. Verificar email en Google Sheet
2. Verificar que el email coincida exactamente (sin espacios)
3. Limpiar cache: `EmpricaAccess.clearCache()`

### Problema: Stripe no acepta tarjetas mexicanas

**Solución:**
1. Verificar que la cuenta Stripe esté verificada
2. Activar métodos de pago locales
3. Contactar soporte de Stripe

---

## 📞 Soporte

Si necesitas ayuda:
- WhatsApp: +52 998 257 0828
- Email: jorge_clemente@empirica.mx

---

## ✅ Checklist Final

Antes de poner el sistema en producción:

- [ ] Cuenta Stripe activada y verificada
- [ ] Payment Links creados con metadata correcta
- [ ] Google Sheet configurado con ID correcto
- [ ] Apps Script desplegado y probado
- [ ] URLs actualizadas en payment-access-control.js
- [ ] Script agregado a ambas páginas de cursos
- [ ] Página de agradecimiento creada
- [ ] Pruebas de acceso exitosas
- [ ] Prueba de pago en modo test exitosa
- [ ] Logs funcionando correctamente

---

## 🎉 ¡Listo!

Tu sistema de pagos está configurado y funcionando.
