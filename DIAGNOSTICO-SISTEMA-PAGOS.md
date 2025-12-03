# 🔧 Diagnóstico: Sistema de Pagos No Funciona

## ❓ Problema Reportado
"Ya no aparece el módulo de correos registrados para usuarios que ya adquirieron el curso"

## 🔍 Causa Probable
Confusión entre dos Google Sheets diferentes del sistema.

---

## 📋 Verificación Paso a Paso

### Paso 1: Identificar los Google Sheets Correctos

Debes tener **DOS Google Sheets separados**:

#### **Google Sheet A: Sistema de Pagos/Acceso**
**URL del Backend:**
```
https://script.google.com/macros/s/AKfycbw1sBsOVp6lnpyvc9IvLk4xgpjEZus0IOmLOrcDgep7aI-xYcOMgtXrofkseaeS4x8mZw/exec
```

**Hojas que debe tener:**
- ✅ `Compradores` (Email, Curso, Fecha Pago, Monto, ID Transacción, Estado)
- ✅ `Logs` (Timestamp, Acción, Email, Curso, Resultado, IP)

**Cómo encontrar este Sheet:**
1. Ve a https://drive.google.com
2. Busca "Compradores Empírica Legal Lab" o similar
3. Abre el Google Sheet
4. Verifica que tenga la hoja "Compradores"

**Si NO encuentras este Google Sheet:**
- Necesitas crearlo siguiendo: `docs/setup-google-sheet.js`

---

#### **Google Sheet B: Sistema de Progreso del Curso**
**URL del Backend:**
```
https://script.google.com/macros/s/AKfycbzmy0xE77HIsOsQWw_Cbmd5nlV6ZKrD_whuqgbjQtuZkWPUtqOwx4r4uosdg9Iyj4u3/exec
```

**Hojas que debe tener:**
- ✅ `Exercise_Responses` (respuestas de ejercicios)
- ✅ `Module_Surveys` (encuestas de módulos)
- ✅ `Summary` (resumen de progreso)
- ✅ `Activity_Log` (registro de actividades)

**Este Sheet NO debe tener la hoja "Compradores"**

---

### Paso 2: Verificar URLs en el Código

#### Verificar URL del Sistema de Pagos

Abre `js/payment-access-control.js` línea 16:

```javascript
GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbw1sBsOVp6lnpyvc9IvLk4xgpjEZus0IOmLOrcDgep7aI-xYcOMgtXrofkseaeS4x8mZw/exec'
```

Esta URL debe apuntar al **Google Sheet A** (el de Compradores).

#### Verificar URL del Sistema de Progreso

Abre `cursos/legal-english/modulos/modulo-1/index.html` línea 2368:

```javascript
const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbzmy0xE77HIsOsQWw_Cbmd5nlV6ZKrD_whuqgbjQtuZkWPUtqOwx4r4uosdg9Iyj4u3/exec';
```

Esta URL debe apuntar al **Google Sheet B** (el de Exercise Responses).

---

### Paso 3: Verificar que la Hoja "Compradores" Existe

1. Abre el **Google Sheet A** (Sistema de Pagos)
2. En la parte inferior, busca las pestañas de hojas
3. Debe aparecer: `Compradores` y `Logs`

**Si no aparece:**
- ¿Está oculta? Click derecho en las pestañas > "Mostrar todas las hojas"
- ¿Fue eliminada? Revisa el historial: File > Version history

---

### Paso 4: Probar el Sistema de Pagos

#### Agregar un Usuario de Prueba Manualmente

1. Abre el **Google Sheet A** (Compradores)
2. Ve a la hoja `Compradores`
3. Agrega una fila con:
   - Email: tu email
   - Curso: `legal-english`
   - Fecha Pago: Hoy
   - Monto: $5000
   - ID Transacción: `TEST-001`
   - Estado: `activo`

#### Probar Acceso en el Sitio

1. Abre el curso en modo incógnito
2. El sistema debería:
   - Pedir tu email
   - Verificar en Google Sheet A
   - Permitir el acceso

---

## 🚨 Escenarios de Error Comunes

### Error 1: "No encuentro la hoja Compradores"
**Solución:** Estás buscando en el Google Sheet B (Progreso). Busca el Google Sheet A (Pagos).

### Error 2: "El Google Sheet de Pagos no existe"
**Solución:** Debes crearlo:
1. Crear nuevo Google Sheet
2. Ir a Extensiones > Apps Script
3. Copiar código de `docs/setup-google-sheet.js`
4. Ejecutar `setupSheet()`

### Error 3: "Tengo la hoja pero no funciona el sistema"
**Solución:** Verifica que el Apps Script esté desplegado:
1. Abre el Google Sheet A
2. Extensiones > Apps Script
3. Implementar > Administrar implementaciones
4. Debe tener una implementación activa

### Error 4: "Las URLs están mezcladas"
**Solución:**
- `payment-access-control.js` debe apuntar al Sheet A (Compradores)
- `modulo-1/index.html` debe apuntar al Sheet B (Progreso)

---

## ✅ Checklist de Verificación

- [ ] Tengo DOS Google Sheets separados
- [ ] El Google Sheet A tiene la hoja "Compradores"
- [ ] El Google Sheet B tiene las hojas de Exercise_Responses
- [ ] Las URLs en el código están correctas
- [ ] Los Apps Scripts están desplegados
- [ ] Puedo ver datos en la hoja "Compradores"

---

## 🔄 Si Todo Está Correcto pero Aún No Funciona

### Revisar Consola del Navegador

1. Abre el curso
2. Presiona F12 (abre DevTools)
3. Ve a la pestaña "Console"
4. Busca errores en rojo

### Revisar Logs en Google Sheet

1. Abre Google Sheet A
2. Ve a la hoja "Logs"
3. Verifica las últimas entradas
4. Busca errores

---

## 📞 Siguiente Paso

**Si la hoja "Compradores" realmente desapareció:**

Podemos ejecutar el script de configuración automática para recrearla:

```javascript
// En Google Sheet A > Extensions > Apps Script
// Copiar y ejecutar el código de: docs/setup-google-sheet.js
```

**Si el problema es otro:**

Dime exactamente qué ves cuando:
1. Abres el Google Sheet de pagos
2. Qué hojas aparecen en la parte inferior
3. Qué error ves en el curso (si hay alguno)

---

## 💡 Resumen

**MIS CAMBIOS NO AFECTARON EL SISTEMA DE PAGOS** porque modifiqué un Google Sheet diferente (el de progreso de ejercicios).

El problema probablemente es:
1. Estás buscando en el Google Sheet equivocado
2. La hoja está oculta
3. Nunca se creó el Google Sheet de pagos
4. Alguien borró la hoja accidentalmente

Verifica estos puntos y dime qué encuentras.
