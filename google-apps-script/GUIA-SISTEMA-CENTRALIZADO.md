# Sistema Centralizado de Google Sheets

## Resumen

Este sistema unifica **todas** las funcionalidades de Google Sheets en un solo script y una sola hoja de cálculo, facilitando la administración del curso.

## Estructura del Google Sheet Centralizado

```
📊 Google Sheet: "Empirica - Sistema Central"
│
├── 📋 Compradores          → Registro de pagos y compradores
├── 📋 Usuarios_Activos     → Control de acceso (gratuito, cortesía, etc.)
├── 📋 Exercise_Responses   → Todas las respuestas de ejercicios
├── 📋 Student_Progress     → Progreso por estudiante/módulo
├── 📋 Module_Surveys       → Encuestas de satisfacción
├── 📋 Analytics            → Estadísticas agregadas
├── 📋 Activity_Log         → Log de actividad del sistema
└── 📋 Config               → Configuraciones del sistema
```

## Instalación Paso a Paso

### 1. Crear el Google Sheet

1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cálculo
3. Nómbrala: `Empirica - Sistema Central`

### 2. Crear el Google Apps Script

1. En el Google Sheet, ve a **Extensiones > Apps Script**
2. Elimina el código existente en `Code.gs`
3. Copia todo el contenido de `SISTEMA-CENTRALIZADO.gs` y pégalo
4. Guarda el proyecto (Ctrl+S)
5. Nombra el proyecto: `Empirica Backend Centralizado`

### 3. Configurar las Hojas

1. En el editor de Apps Script, ejecuta la función `setupSpreadsheet`
   - Haz clic en el menú desplegable de funciones
   - Selecciona `setupSpreadsheet`
   - Haz clic en ▶️ Ejecutar
2. Autoriza el script cuando se te solicite
3. Todas las hojas se crearán automáticamente con sus encabezados

### 4. Desplegar como Web App

1. Haz clic en **Deploy > New deployment**
2. Selecciona tipo: **Web app**
3. Configura:
   - **Description**: `Empirica Backend v2.0`
   - **Execute as**: `Me (tu email)`
   - **Who has access**: `Anyone`
4. Haz clic en **Deploy**
5. **COPIA LA URL** que aparece (la necesitarás)

### 5. Actualizar el Código Frontend

Actualiza la URL en **DOS archivos**:

#### Archivo 1: `/cursos/legal-english/shared/module-functions.js`

```javascript
const EMPIRICA_BACKEND_URL = 'https://script.google.com/macros/s/TU_SCRIPT_ID/exec';
```

#### Archivo 2: `/js/payment-access-control.js`

```javascript
GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/TU_SCRIPT_ID/exec',
```

**IMPORTANTE**: Ambos archivos deben tener la **MISMA URL**.

## Funcionalidades del Sistema

### Control de Acceso

| Acción | Método | Parámetros |
|--------|--------|------------|
| Verificar acceso | GET | `action=checkAccess&email=...&course=...` |
| Registrar acceso gratuito | GET | `action=registerFreeAccess&email=...&course=...&module=...` |
| Agregar comprador | GET | `action=addPurchaser&email=...&course=...&amount=...` |
| Listar compradores | GET | `action=listPurchasers&course=...` |
| Estadísticas | GET | `action=stats` |

### Respuestas de Ejercicios

| Acción | Método | Body (JSON) |
|--------|--------|-------------|
| Guardar respuesta | POST | `{ type: 'exercise_score', data: {...} }` |
| Guardar encuesta | POST | `{ type: 'survey', data: {...} }` |

### Obtener Progreso

| Acción | Método | Parámetros |
|--------|--------|------------|
| Progreso de estudiante | GET | `action=getProgress&email=...` |
| Historial completo | GET | `action=getStudentHistory&email=...` |

## Estructura de las Hojas

### Compradores
| Columna | Descripción |
|---------|-------------|
| Email | Email del comprador |
| Curso | ID del curso (legal-english, derecho-no-abogados) |
| Fecha Pago | Timestamp del pago |
| Monto | Cantidad pagada |
| ID Transacción | ID de Stripe u otro |
| Estado | activo, inactivo, cancelado |
| Método Pago | Stripe, manual, etc. |

### Usuarios_Activos
| Columna | Descripción |
|---------|-------------|
| Email | Email del usuario |
| Curso | ID del curso |
| Status | activo, inactivo |
| Tipo Acceso | free-modulo-1, cortesia, etc. |
| Fecha Registro | Cuándo se registró |
| Ultimo Acceso | Última actividad |
| Notas | Comentarios adicionales |

### Exercise_Responses
| Columna | Descripción |
|---------|-------------|
| Timestamp | Fecha/hora de la respuesta |
| Email | Email del estudiante |
| Nombre | Nombre del estudiante |
| Curso | ID del curso |
| Módulo | ID del módulo |
| Ejercicio | ID del ejercicio |
| Tipo | matching, fill-blank, etc. |
| Respuestas | JSON con las respuestas |
| Correcto | SI/NO |
| Puntuación | Ej: "5/5" |
| Porcentaje | 0-100 |

## Migración de Datos Existentes

Si ya tienes datos en el sistema anterior:

1. **Compradores**: Copia los datos de tu hoja actual a la nueva hoja `Compradores`
2. **Respuestas**: Los datos antiguos pueden quedarse donde están; el nuevo sistema empezará a guardar en la nueva ubicación

## Ventajas del Sistema Centralizado

| Antes | Ahora |
|-------|-------|
| 2+ Google Sheets separados | 1 solo Google Sheet |
| 2+ URLs de API diferentes | 1 sola URL |
| Datos dispersos | Todo en un lugar |
| Difícil generar reportes | Reportes fáciles |
| Múltiples scripts que mantener | 1 solo script |

## Solución de Problemas

### Error: "Script function not found"
- Asegúrate de haber copiado TODO el código del archivo `.gs`

### Error: "Access denied"
- Verifica que el deployment sea "Anyone" en "Who has access"

### Los datos no se guardan
- Verifica que la URL en el frontend sea correcta
- Revisa la consola del navegador para ver errores
- Revisa la hoja `Activity_Log` para ver los registros

### El acceso no se verifica correctamente
- Asegúrate de que el email esté exactamente igual en ambos sistemas
- Verifica que el status sea "activo" en la hoja correspondiente

## Contacto

Si tienes problemas con la instalación, contacta a:
- Email: jorge@empirica.io
- WhatsApp: +52 998 257 0828
