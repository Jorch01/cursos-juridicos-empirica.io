# Guía Rápida: Actualizar Google Sheets con Nuevas Columnas

## ⚠️ Problema

Tu Google Sheet fue creado ANTES de agregar las columnas de "Student Name" y "Email".
Por eso no ves esos datos aunque sí están llegando.

## ✅ Solución: Recrear las Hojas

### Opción 1: Recrear Automáticamente (Recomendado)

**Pasos:**

1. **Abrir Google Apps Script**
   - Ir a https://script.google.com
   - Abrir tu proyecto "Legal English Response Collector"

2. **Borrar hojas antiguas en Google Sheets**
   - Ir a tu Google Spreadsheet
   - Click derecho en cada pestaña:
     - `Exercise_Responses` → Delete
     - `Module_Surveys` → Delete
     - `Summary` → Delete
   - **NO borrar** `Activity_Log`

3. **Ejecutar Setup de Nuevo**
   - Volver a Apps Script
   - Función: `setupSpreadsheet`
   - Click **Run ▶**
   - Esperar 5-10 segundos

4. **Verificar Nuevas Hojas**
   - Ir a Google Spreadsheet
   - Refrescar (F5)
   - Deberías ver las hojas recreadas con nuevas columnas:

**Exercise_Responses:**
```
| Timestamp | Student Name | Email | Module | Exercise ID | Exercise Type | User Answers (JSON) | All Correct? | Score (%) |
```

**Module_Surveys:**
```
| Timestamp | Student Name | Email | Module | Difficulty | Quality (1-5) | Most Useful | Suggestions | Time Spent |
```

**Summary:**
```
| Student Name | Email | Module | Exercises Completed | Average Score (%) | Last Activity | Survey Completed? |
```

5. **Probar**
   - Completar un ejercicio en el módulo
   - Refrescar Google Sheet
   - Ahora DEBERÍA aparecer "Student Name" y "Email"

---

### Opción 2: Actualizar Manualmente (Si tienes datos importantes)

Si ya tienes datos en las hojas antiguas y NO quieres perderlos:

#### Para Exercise_Responses:

1. En Google Sheets, ir a `Exercise_Responses`
2. Click derecho en columna **B** → Insert 1 column left
3. En celda **B1** escribir: `Student Name`
4. Click derecho en columna **C** (la nueva) → Insert 1 column left
5. En celda **C1** escribir: `Email`
6. Ajustar el fondo de B1 y C1:
   - Seleccionar B1:C1
   - Color de fondo: `#1B2C27` (verde oscuro)
   - Color de texto: `#FFFFFF` (blanco)
   - Negrita

Estructura final:
```
A: Timestamp
B: Student Name (NUEVA)
C: Email (NUEVA)
D: Module
E: Exercise ID
F: Exercise Type
G: User Answers (JSON)
H: All Correct?
I: Score (%)
```

#### Para Module_Surveys:

1. Ir a `Module_Surveys`
2. Click derecho en columna **B** → Insert 1 column left
3. En celda **B1** escribir: `Student Name`
4. Click derecho en columna **C** → Insert 1 column left
5. En celda **C1** escribir: `Email`
6. Ajustar formato igual que arriba

#### Para Summary:

1. Ir a `Summary`
2. Click derecho en columna **A** → Insert 1 column left
3. En celda **A1** escribir: `Student Name`
4. La columna "Email" que estaba en A ahora está en B (correcto)

Estructura final:
```
A: Student Name (NUEVA)
B: Email
C: Module
D: Exercises Completed
E: Average Score (%)
F: Last Activity
G: Survey Completed?
```

---

## 🧪 Verificar que Funciona

1. Abrir el módulo en navegador
2. Ingresar nombre y email
3. Completar un ejercicio
4. Check Answers
5. Ir a Google Sheet
6. Refrescar (F5)
7. La nueva fila DEBE mostrar:
   - **Student Name:** Tu nombre
   - **Email:** Tu email
   - **Module:** module-1
   - Etc.

---

## 🔍 Si Sigues Sin Ver los Datos

### Diagnóstico:

1. **Abrir consola del navegador** (F12)
2. Completar ejercicio
3. Buscar en consola:
   ```
   📦 Data: {
     "studentName": "...",
     "studentEmail": "...",
     ...
   }
   ```

4. Si ves `studentName` y `studentEmail` en la consola → Datos se están enviando correctamente

5. Ir a **Activity_Log** en Google Sheet
6. Ver si hay errores recientes
7. Si dice algo como "Cannot read property '0' of undefined" → Las columnas están mal

### Solución Definitiva:

1. Borrar TODAS las hojas (excepto Activity_Log)
2. Ejecutar `setupSpreadsheet()` de nuevo
3. Empezar de cero

---

## 📝 Nota sobre Datos Antiguos

Si tenías datos antiguos **sin nombre y email**, ahora aparecerán como:
- Student Name: `Anonymous`
- Email: `not provided`

Los nuevos datos desde ahora tendrán nombre y email correctos.

---

## ✅ Checklist Final

- [ ] Hojas antiguas borradas (o columnas agregadas manualmente)
- [ ] `setupSpreadsheet()` ejecutado
- [ ] Nuevas hojas tienen columnas: Student Name, Email
- [ ] Test completado: nuevo ejercicio muestra nombre y email
- [ ] Activity_Log no muestra errores

---

**¿Necesitas ayuda?** Comparte screenshot de:
1. Estructura de columnas actual en Exercise_Responses
2. Mensajes de la consola (F12) al enviar ejercicio
3. Últimas líneas de Activity_Log
