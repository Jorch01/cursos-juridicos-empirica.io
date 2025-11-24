# 📊 Google Apps Script - Response Tracking Backend

Sistema de recolección de respuestas para el curso Legal English.

---

## 🚀 Quick Start (5 minutos)

1. **Crear Google Spreadsheet**
   - Ir a https://sheets.google.com
   - Crear hoja nueva: "Legal English - Student Responses"

2. **Abrir Apps Script**
   - En la hoja: Extensions > Apps Script
   - Reemplazar código con `Code.gs` de este directorio

3. **Ejecutar Setup**
   - Seleccionar función: `setupSpreadsheet`
   - Clic en Run (▶)
   - Autorizar permisos

4. **Deploy como Web App**
   - Deploy > New deployment > Web app
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Copiar URL del Web App

5. **Configurar en el Módulo**
   - Editar: `modulos/modulo-1/index.html`
   - Línea 2151: Pegar tu URL del Web App
   - Commit y push

**¡Listo!** Ya estás recolectando respuestas centralmente.

---

## 📁 Archivos en este Directorio

| Archivo | Descripción |
|---------|-------------|
| **Code.gs** | Código completo de Google Apps Script (copiar/pegar en Apps Script) |
| **GUIA-CONFIGURACION.md** | Guía paso a paso detallada con capturas conceptuales |
| **DIAGRAMA-FLUJO.md** | Diagramas visuales del flujo de datos |
| **README.md** | Este archivo - resumen rápido |

---

## 📊 ¿Qué Recolecta?

### 1. Respuestas de Ejercicios
- Email del estudiante
- Módulo y ejercicio específico
- Respuestas completas (JSON)
- Calificación (%)
- Timestamp

### 2. Encuestas de Evaluación
- Dificultad del módulo
- Calidad del contenido (1-5 estrellas)
- Parte más útil (texto libre)
- Sugerencias (texto libre)
- Tiempo invertido

### 3. Resumen por Estudiante
- Ejercicios completados
- Promedio de calificación
- Última actividad
- Status de encuesta

---

## 🔧 Funciones Principales del Script

```javascript
// En Google Apps Script (Code.gs)

setupSpreadsheet()           // Crear hojas automáticamente
testExerciseResponse()       // Probar envío de ejercicio
testSurvey()                // Probar envío de encuesta
doPost(e)                   // Recibir datos del sitio web
```

---

## 📈 Estructura de Datos

### Exercise_Responses
```
Timestamp | Email | Module | Exercise ID | Type | Answers (JSON) | Correct? | Score
```

### Module_Surveys
```
Timestamp | Email | Module | Difficulty | Quality | Most Useful | Suggestions | Time
```

### Summary (Auto-calculado)
```
Email | Module | Exercises Completed | Avg Score | Last Activity | Survey?
```

### Activity_Log (Sistema)
```
Timestamp | Event | Details
```

---

## 🎯 Configuración en el Código del Módulo

**Ubicación:** `cursos/legal-english/modulos/modulo-1/index.html`
**Línea:** ~2151

### Antes (Sin configurar):
```javascript
const BACKEND_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

### Después (Configurado):
```javascript
const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXX/exec';
                                                      ^^^^^^^^^^^^^^^^^^^^
                                                      Tu Script ID aquí
```

---

## 🧪 Testing

### Test 1: Desde Apps Script (Backend)
1. Ir a Apps Script editor
2. Seleccionar función: `testExerciseResponse`
3. Run (▶)
4. Ver datos en hoja "Exercise_Responses"

### Test 2: Desde el Sitio Web (Frontend)
1. Abrir módulo en navegador
2. Completar ejercicio
3. Click "Check Answers"
4. Abrir consola (F12) - ver logs:
   ```
   ✅ Data sent to backend successfully
   ```
5. Verificar en Google Sheet

---

## 🔐 Permisos y Seguridad

### ¿Por qué "Anyone" en el deploy?

El script necesita ser accesible desde tu sitio web público (GitHub Pages). Esto es seguro porque:

✅ El script solo **acepta** datos (POST), no expone datos
✅ Solo tú tienes acceso a la Google Sheet con las respuestas
✅ No hay autenticación OAuth necesaria para los estudiantes
✅ Es el método estándar para forms públicos

### Datos de Estudiantes

- **Email:** Del sistema de pagos (localStorage)
- **Anónimos:** Si no hay email, se guarda como "anonymous"
- **Privacidad:** Solo tú ves la hoja con todos los datos

---

## 🚨 Troubleshooting

| Problema | Solución |
|----------|----------|
| ⚠️ "Backend not configured" | Verificar que copiaste la URL correcta en línea 2151 |
| ⚠️ "Permission denied" | Re-deploy con "Who has access: **Anyone**" |
| ⚠️ No aparecen datos en Sheet | Verificar Activity_Log para errores |
| ⚠️ CORS error en consola | Normal con mode: 'no-cors' - los datos se envían igual |
| ⚠️ Script deshabilitado | Ir a script.google.com y reactivar |

---

## 📱 Menú Personalizado en Google Sheets

Después del setup, verás:

```
📚 Legal English
├── ⚙️ Setup Spreadsheet
├── 🧪 Test Exercise Response
├── 🧪 Test Survey
├── ─────────────────
├── 📊 Generate Report (coming soon)
└── 📧 Email Summary (coming soon)
```

---

## 💡 Tips

### Ver Logs en Apps Script
1. Apps Script Editor > Executions
2. Ver historial de ejecuciones
3. Click en una ejecución para ver logs

### Exportar Datos
```javascript
// En la consola del navegador (sitio web)
exportResponses()  // Descarga JSON local

// En Google Sheets
File > Download > CSV / Excel
```

### Compartir Acceso de Solo Lectura
```
Google Sheet > Share > Add people
Permissions: Viewer
```

---

## 🔄 Actualizar el Script

Si necesitas modificar el código:

1. Editar `Code.gs` en Apps Script
2. Guardar (Ctrl + S)
3. **No es necesario re-deploy** (los cambios son automáticos)
4. Excepto si cambias parámetros del Web App

---

## 📚 Documentación Completa

- **Setup Detallado:** [GUIA-CONFIGURACION.md](./GUIA-CONFIGURACION.md)
- **Flujo de Datos:** [DIAGRAMA-FLUJO.md](./DIAGRAMA-FLUJO.md)
- **Sistema General:** [../SISTEMA-REGISTRO-RESPUESTAS.md](../SISTEMA-REGISTRO-RESPUESTAS.md)

---

## ✅ Checklist de Configuración

- [ ] Google Sheet creado
- [ ] Código de Apps Script copiado
- [ ] setupSpreadsheet() ejecutado
- [ ] 4 hojas creadas (Responses, Surveys, Summary, Log)
- [ ] Web App deployed
- [ ] URL copiada
- [ ] URL configurada en modulo-1/index.html línea 2151
- [ ] Test desde Apps Script exitoso
- [ ] Test desde sitio web exitoso
- [ ] Datos visibles en Google Sheet

---

## 🎓 Aplicar a Otros Módulos

El **mismo backend URL** funciona para todos los módulos (1-15).

Solo necesitas:
1. Copiar el código de tracking de módulo-1
2. Cambiar `module: 'module-1'` → `module: 'module-2'`, etc.
3. Usar la misma URL de backend

---

## 📧 Soporte

**Autor:** Claude AI
**Contacto:** jorge_clemente@empirica.mx
**Proyecto:** Cursos Jurídicos Empírica - Legal English

---

## 🌟 Próximas Funcionalidades

- [ ] Dashboard visual con gráficos
- [ ] Reportes por email automáticos
- [ ] Alertas de bajo desempeño
- [ ] Exportación a PDF
- [ ] Integración con sistema de diplomas

---

**¡Tu sistema de tracking está listo para usar!** 🚀
