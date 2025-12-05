# 🔐 Instrucciones para Configurar el Sistema de Acceso

## Problema Detectado

El sistema de autenticación no estaba funcionando porque el Google Apps Script **no tenía implementada la función `checkAccess`** que verifica si un usuario tiene acceso al curso.

## Solución Implementada

Se ha agregado la funcionalidad completa de control de acceso al archivo `Code.gs`.

---

## 📋 Pasos para Actualizar el Sistema

### 1. Actualizar el Google Apps Script

1. Abre tu Google Sheet del curso Legal English
2. Ve a **Extensiones > Apps Script**
3. **Reemplaza todo el contenido** del archivo `Code.gs` con el nuevo código que está en este directorio
4. Guarda los cambios (Ctrl+S o Cmd+S)
5. **Importante**: Despliega una nueva versión del Web App:
   - Click en **Implementar > Gestionar implementaciones**
   - Click en el ícono de lápiz (✏️) junto a la implementación activa
   - En "Versión", selecciona **Nueva versión**
   - Agrega una descripción: "Agregar sistema de control de acceso"
   - Click en **Implementar**

### 2. Verificar la Estructura de tu Hoja "Usuarios_Activos"

El script buscará una hoja llamada **"Usuarios_Activos"** con la siguiente estructura:

| Email | Curso | Status | Tipo de Acceso | Fecha de Registro | Notas |
|-------|-------|--------|----------------|-------------------|-------|
| usuario@ejemplo.com | legal-english | activo | pago-completo | 2025-12-01 | Cliente VIP |
| otro@ejemplo.com | legal-english | activo | pago-completo | 2025-11-28 | |

### Columnas importantes:
- **Columna A (Email)**: El correo electrónico del usuario
- **Columna B (Curso)**: El ID del curso (`legal-english` o `derecho-no-abogados`)
- **Columna C (Status)**: Debe ser `activo`, `active`, `si`, `yes`, o `1` para tener acceso

### 3. Si tu hoja tiene un nombre diferente

Si tu hoja de usuarios activos tiene un nombre diferente (por ejemplo, "Active Users" o "Usuarios"), tienes dos opciones:

**Opción A - Renombrar tu hoja:**
1. Click derecho en la pestaña de la hoja
2. Renombrar a: `Usuarios_Activos`

**Opción B - Cambiar el código:**
1. En el archivo `Code.gs`, línea 24, cambia:
   ```javascript
   ACTIVE_USERS: 'Usuarios_Activos'
   ```
   Por el nombre real de tu hoja, por ejemplo:
   ```javascript
   ACTIVE_USERS: 'Active Users'
   ```

### 4. Si las columnas están en diferente orden

Si tu hoja tiene las columnas en diferente orden, necesitas ajustar el código en la función `handleCheckAccess` (líneas 555-557):

```javascript
const rowEmail = String(row[0]).toLowerCase().trim();   // Columna A (índice 0)
const rowCourse = String(row[1]).toLowerCase().trim();  // Columna B (índice 1)
const rowStatus = String(row[2]).toLowerCase().trim();  // Columna C (índice 2)
```

Cambia los números según tu estructura. Por ejemplo, si el email está en la columna B:
```javascript
const rowEmail = String(row[1]).toLowerCase().trim();   // Columna B (índice 1)
```

---

## 🧪 Probar el Sistema

### Desde la consola del navegador:

1. Abre tu sitio del curso en el navegador
2. Abre la consola de desarrollo (F12)
3. Ejecuta este código (reemplaza con tu email):

```javascript
fetch('https://script.google.com/macros/s/AKfycbwoB76CQ6v9xVPL4ryywRmJdIobmHy9Fe3eSAKpZoYrEVgtOttxVWOIpPo-pe6PydbY/exec?action=checkAccess&email=TU_EMAIL@ejemplo.com&course=legal-english')
  .then(r => r.json())
  .then(data => console.log(data));
```

Deberías ver una respuesta como:
```json
{
  "status": "success",
  "hasAccess": true,
  "email": "tu_email@ejemplo.com",
  "course": "legal-english"
}
```

---

## 🔍 Solución de Problemas

### Error: "Email no encontrado"

**Causa**: Tu email no está en la hoja de Usuarios_Activos o el nombre de la hoja es incorrecto.

**Solución**:
1. Verifica que tu email esté exactamente igual en la hoja (sin espacios extra)
2. Verifica que la columna Status tenga el valor `activo`
3. Verifica que el nombre de la hoja sea `Usuarios_Activos`

### Error: "Active users sheet not configured"

**Causa**: El script no encuentra la hoja de usuarios activos.

**Solución**:
1. Crea una hoja llamada `Usuarios_Activos` (respetando mayúsculas y minúsculas)
2. O cambia el nombre en el código como se explicó arriba

### El email está en la hoja pero sigue sin funcionar

**Causa**: Posible discrepancia en el formato del email o la estructura de columnas.

**Solución**:
1. Asegúrate que el email no tenga espacios al inicio o final
2. Verifica que la columna Status tenga exactamente uno de estos valores:
   - `activo`
   - `active`
   - `si`
   - `yes`
   - `1`
3. Verifica que el curso coincida: debe ser exactamente `legal-english` (minúsculas, con guión)

---

## 📊 Logs de Actividad

El sistema registra todas las verificaciones de acceso en la hoja **Activity_Log**:

- Cada vez que alguien intenta verificar acceso
- Si el acceso fue concedido o denegado
- Fecha y hora de cada verificación

Esto te ayudará a diagnosticar problemas.

---

## ✅ Checklist de Verificación

- [ ] Actualicé el código en Google Apps Script
- [ ] Desplegué una nueva versión del Web App
- [ ] Mi hoja se llama "Usuarios_Activos" o actualicé el nombre en el código
- [ ] La hoja tiene las columnas: Email, Curso, Status
- [ ] Mi email está en la hoja con status "activo"
- [ ] El curso está escrito como "legal-english"
- [ ] Probé el acceso y funcionó correctamente

---

## 🆘 Contacto

Si después de seguir estas instrucciones sigues teniendo problemas, revisa:

1. La hoja **Activity_Log** para ver qué está pasando
2. La consola del navegador (F12) para ver errores JavaScript
3. Que la URL del Google Apps Script sea la correcta en `payment-access-control.js`
