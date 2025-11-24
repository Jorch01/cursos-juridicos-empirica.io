# 📚 Guía de Configuración: Google Sheets + Apps Script
## Sistema de Recolección de Respuestas - Legal English Course

---

## 🎯 Objetivo

Configurar un sistema backend gratuito que recolecte automáticamente:
- ✅ Respuestas de ejercicios de estudiantes
- ✅ Encuestas de evaluación de módulos
- ✅ Calificaciones y progreso

**Todo centralizado en una hoja de Google Sheets.**

---

## 📋 PARTE 1: Crear Google Spreadsheet

### Paso 1: Crear Nueva Hoja de Cálculo

1. Ve a https://sheets.google.com
2. Clic en **"+ Blank"** (crear hoja en blanco)
3. Nombrarla: **"Legal English - Student Responses"**

### Paso 2: Copiar el ID del Spreadsheet

1. En la URL, copiar el ID del spreadsheet:
   ```
   https://docs.google.com/spreadsheets/d/[ESTE_ES_EL_ID]/edit
   ```
   Ejemplo:
   ```
   https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/edit
                                        ^^^^^^^^^^^^^^^^^^^
                                        Este es el ID
   ```
2. **Guardar este ID** - lo necesitarás después (opcional)

---

## 📋 PARTE 2: Configurar Google Apps Script

### Paso 3: Abrir Editor de Apps Script

1. En tu hoja de Google Sheets, ir a:
   **Extensions > Apps Script**
   (o **Extensiones > Apps Script** en español)

2. Se abrirá una nueva pestaña con el editor de código

### Paso 4: Reemplazar el Código

1. Verás un archivo llamado `Code.gs` con código de ejemplo
2. **Borrar todo el código existente**
3. **Copiar y pegar** el contenido completo del archivo `Code.gs` que creamos

   📁 El archivo está en:
   ```
   cursos-juridicos-empirica.io/
   └── cursos/
       └── legal-english/
           └── google-apps-script/
               └── Code.gs
   ```

4. Guardar: **Ctrl + S** o clic en el ícono de diskette

### Paso 5: Nombrar el Proyecto

1. En la parte superior, donde dice "Untitled project"
2. Cambiar a: **"Legal English Response Collector"**
3. Guardar

---

## 📋 PARTE 3: Configurar las Hojas

### Paso 6: Ejecutar Setup Inicial

1. En el editor de Apps Script, buscar la función `setupSpreadsheet` en el código
2. En el menú desplegable (arriba), seleccionar: **setupSpreadsheet**
3. Clic en **▶ Run** (Ejecutar)

4. **Primera vez:** Aparecerá un diálogo de autorización:
   - Clic en **"Review Permissions"** (Revisar permisos)
   - Seleccionar tu cuenta de Google
   - Aparecerá: "Google hasn't verified this app"
   - Clic en **"Advanced"** (Avanzado)
   - Clic en **"Go to Legal English Response Collector (unsafe)"**
     *(Es seguro porque es tu propio script)*
   - Clic en **"Allow"** (Permitir)

5. Esperar a que termine la ejecución (5-10 segundos)

6. Aparecerá un mensaje: **"Setup Complete"**

### Paso 7: Verificar las Hojas Creadas

1. Volver a tu Google Spreadsheet
2. Deberías ver **4 pestañas nuevas**:
   - 📝 **Exercise_Responses** - Todas las respuestas de ejercicios
   - 📊 **Module_Surveys** - Todas las encuestas
   - 📈 **Summary** - Resumen por estudiante y módulo
   - 📋 **Activity_Log** - Log de actividad del sistema

---

## 📋 PARTE 4: Deploy como Web App

### Paso 8: Deploy del Script

1. En el editor de Apps Script, ir a:
   **Deploy > New deployment** (o **Implementar > Nueva implementación**)

2. Clic en el ícono de ⚙️ (engranaje) junto a "Select type"

3. Seleccionar: **"Web app"**

4. Configurar:
   - **Description:** "Legal English Response Collector v1"
   - **Execute as:** **Me** (tu email)
   - **Who has access:** **Anyone** (Cualquiera)
     *(Importante: Debe ser "Anyone" para que funcione desde tu sitio web)*

5. Clic en **Deploy** (Implementar)

6. Aparecerá un diálogo de autorización:
   - Clic en **"Authorize access"** (Autorizar acceso)
   - Seleccionar tu cuenta
   - Permitir acceso

### Paso 9: Copiar la Web App URL

1. Después de deploy, aparecerá un diálogo con:
   - **Web app URL:** `https://script.google.com/macros/s/ABC123.../exec`

2. **¡MUY IMPORTANTE!** Copiar esta URL completa
   - Debe terminar en `/exec`
   - Ejemplo:
     ```
     https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXX/exec
     ```

3. **Guardar esta URL** en un lugar seguro

---

## 📋 PARTE 5: Conectar con tu Sitio Web

### Paso 10: Actualizar el Código del Módulo

1. Ir al archivo:
   ```
   cursos/legal-english/modulos/modulo-1/index.html
   ```

2. Buscar la línea **2098** (aproximadamente)
   Encontrarás:
   ```javascript
   const BACKEND_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```

3. **Reemplazar** con tu URL real:
   ```javascript
   const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXX/exec';
   ```

4. Guardar el archivo

### Paso 11: Commit y Push

Hacer commit de los cambios:

```bash
git add cursos/legal-english/modulos/modulo-1/index.html
git commit -m "Configure Google Sheets backend for response tracking"
git push
```

---

## 📋 PARTE 6: Testing

### Paso 12: Probar desde Apps Script

1. Volver al editor de Apps Script
2. En el menú desplegable de funciones, seleccionar: **testExerciseResponse**
3. Clic en **▶ Run**
4. Ir a tu Google Sheet - deberías ver una fila nueva en **Exercise_Responses**

5. Repetir con: **testSurvey**
6. Verificar que aparece en **Module_Surveys**

### Paso 13: Probar desde el Sitio Web

1. Abrir tu sitio web en el navegador
2. Ir a: `https://tu-sitio.com/cursos/legal-english/modulos/modulo-1/`
3. Completar un ejercicio y hacer clic en "Check Answers"
4. Abrir la consola del navegador (F12)
5. Buscar mensajes que digan:
   ```
   Backend not configured. Data saved locally only
   ```
   *(Si ves este mensaje, significa que hay un error en la URL)*

6. Si está configurado correctamente, verás:
   ```javascript
   Response saved successfully
   ```

7. **Verificar en Google Sheets:**
   - Ir a tu hoja de cálculo
   - Refrescar la página (F5)
   - Deberías ver la nueva respuesta en **Exercise_Responses**

---

## 📊 Estructura de los Datos

### Hoja: Exercise_Responses

| Timestamp | Email | Module | Exercise ID | Exercise Type | User Answers (JSON) | All Correct? | Score (%) | Session Info |
|-----------|-------|--------|-------------|---------------|---------------------|--------------|-----------|--------------|
| 2025-11-24 10:30 | estudiante@example.com | module-1 | exercise1 | matching | ["a","b","c"...] | YES | 100 | system |

### Hoja: Module_Surveys

| Timestamp | Email | Module | Difficulty | Quality (1-5) | Most Useful | Suggestions | Time Spent |
|-----------|-------|--------|------------|---------------|-------------|-------------|------------|
| 2025-11-24 10:45 | estudiante@example.com | module-1 | appropriate | 5 | Matching exercises | More examples | 45_60 |

### Hoja: Summary

| Email | Module | Exercises Completed | Average Score (%) | Last Activity | Survey Completed? |
|-------|--------|---------------------|-------------------|---------------|-------------------|
| estudiante@example.com | module-1 | 11 | 94.5 | 2025-11-24 10:45 | YES |

---

## 🔧 Solución de Problemas

### Problema: "Access Denied" o "Permission Denied"

**Solución:**
1. Verificar que el deploy esté configurado como **"Anyone"** en "Who has access"
2. Re-deploy:
   - Deploy > Manage deployments
   - Clic en ✏️ (edit)
   - Cambiar "Who has access" a **"Anyone"**
   - Deploy

### Problema: No se reciben datos en la hoja

**Diagnóstico:**
1. Abrir consola del navegador (F12) en tu sitio
2. Buscar errores en rojo
3. Verificar que la URL del backend sea correcta (debe terminar en `/exec`)

**Solución:**
1. Verificar que copiaste la URL correcta del Web App
2. Verificar que no hay espacios extra en la URL
3. Verificar que la URL esté entre comillas: `'https://...'`

### Problema: CORS Error

**Solución:**
- Esto es normal con `mode: 'no-cors'` en el código
- Los datos se siguen enviando correctamente
- No afecta la funcionalidad

### Problema: "Script has been disabled"

**Solución:**
1. Ir a https://script.google.com
2. Buscar tu proyecto
3. Asegurarte de que esté habilitado
4. Re-deploy si es necesario

---

## 📱 Menú Personalizado en Google Sheets

Después del setup, verás un nuevo menú en tu hoja de cálculo:

**📚 Legal English**
- ⚙️ Setup Spreadsheet
- 🧪 Test Exercise Response
- 🧪 Test Survey
- ─────────
- 📊 Generate Report (próximamente)
- 📧 Email Summary (próximamente)

---

## 🔐 Seguridad y Privacidad

### Datos Seguros
- ✅ Los datos están en **tu cuenta de Google**
- ✅ Solo **tú** tienes acceso a la hoja de cálculo
- ✅ El script corre bajo **tu cuenta**
- ✅ Los estudiantes **no pueden ver** las respuestas de otros

### Compartir Acceso
Para dar acceso de solo lectura a otra persona:
1. En Google Sheets: Share > Add people
2. Elegir: **Viewer** (Solo lectura)

---

## 🚀 Próximos Pasos

### 1. Aplicar a Otros Módulos
Repite el proceso para los módulos 2-15:
- Cada módulo usa el **mismo backend URL**
- Solo cambia el `module: 'module-2'` en el código

### 2. Crear Dashboards
Usa Google Data Studio para visualizar:
- Progreso de estudiantes
- Ejercicios más difíciles
- Calificaciones promedio

### 3. Automatización con Triggers
Configurar triggers para:
- Enviar emails automáticos cuando un estudiante complete un módulo
- Generar reportes semanales
- Alertas de estudiantes con bajo desempeño

---

## 📧 Soporte

Si tienes problemas:
1. Revisar el **Activity_Log** en la hoja de cálculo
2. Contactar: **jorge_clemente@empirica.mx**

---

## ✅ Checklist Final

Antes de terminar, verifica:

- [ ] Google Sheet creado
- [ ] Apps Script código copiado y guardado
- [ ] `setupSpreadsheet()` ejecutado exitosamente
- [ ] 4 hojas creadas (Exercise_Responses, Module_Surveys, Summary, Activity_Log)
- [ ] Web App deployed como "Anyone"
- [ ] URL del Web App copiada
- [ ] URL actualizada en `modulo-1/index.html` línea 2098
- [ ] Cambios committed y pushed a GitHub
- [ ] Tests ejecutados desde Apps Script (testExerciseResponse, testSurvey)
- [ ] Test desde sitio web completado
- [ ] Datos visibles en Google Sheets

---

**¡Listo! Tu sistema de recolección de respuestas está configurado y funcionando.** 🎉
