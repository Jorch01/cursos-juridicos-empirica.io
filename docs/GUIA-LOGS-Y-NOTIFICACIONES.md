# 📊 Sistema de Logs y Notificaciones - Guía Completa

## 🎯 ¿Qué incluye este sistema?

### ✅ **1. Logs Detallados de Actividad**
- Registra CADA acceso al sistema
- Detecta actividad sospechosa automáticamente
- Auto-limpieza (mantiene últimos 1000 logs)
- Información registrada:
  - Timestamp
  - Acción realizada
  - Email del usuario
  - Curso accedido
  - Resultado (éxito/fallo)
  - User Agent del navegador
  - Info adicional

### ✅ **2. Estadísticas en Tiempo Real**
- Total de accesos (últimos 7 días)
- Accesos exitosos vs. denegados
- Tasa de éxito
- Usuarios únicos
- Actividad por curso

### ✅ **3. Detección de Actividad Sospechosa**
- Detecta más de 10 intentos en 5 minutos
- Marca automáticamente como sospechoso
- Útil para detectar:
  - Ataques de fuerza bruta
  - Compartir de credenciales
  - Bots automatizados

### ✅ **4. Notificaciones por Email (Opcional)**
- Email al admin cuando hay una compra
- Email de bienvenida al comprador
- Fácil de activar/desactivar

---

## 🚀 Cómo Implementar

### PASO 1: Desplegar el Nuevo Backend

1. **Abre tu proyecto de Google Apps Script** actual
2. **Reemplaza TODO el código** con el contenido de:
   ```
   docs/BACKEND-CON-LOGS-Y-NOTIFICACIONES.js
   ```

3. **Guarda el proyecto** (Ctrl+S)

4. **Crea una NUEVA implementación:**
   - Deploy → Manage deployments
   - Haz clic en el lápiz ✏️
   - Configuration → New version
   - Deploy

5. **Copia la URL** (debe ser la misma que antes)

---

### PASO 2: Probar el Sistema

#### Prueba A: Logs Básicos

Abre en tu navegador:
```
TU-URL?action=stats
```

Deberías ver algo como:
```json
{
  "success": true,
  "stats": {
    "derecho-no-abogados": 2,
    "legal-english": 0,
    "total": 2
  },
  "activity": {
    "period": "Últimos 7 días",
    "totalAccess": 15,
    "successfulAccess": 12,
    "deniedAccess": 3,
    "uniqueUsers": 2,
    "successRate": "80.0%"
  }
}
```

#### Prueba B: Ver Logs Recientes

```
TU-URL?action=logs
```

Deberías ver los últimos 50 logs en detalle.

#### Prueba C: Estadísticas Personalizadas

```
TU-URL?action=activityStats&days=30
```

Muestra estadísticas de los últimos 30 días.

---

### PASO 3: Activar Notificaciones por Email (Opcional)

#### ⚠️ Requisito Previo

Para que funcionen las notificaciones por email, necesitas configurar los **permisos de Gmail** en Google Apps Script.

#### Configuración

1. **En el archivo del backend, encuentra la línea 14:**
   ```javascript
   const EMAIL_CONFIG = {
     adminEmail: 'jorge_clemente@empirica.mx',  // Tu email
     enabled: false  // ← Cambiar a true
   };
   ```

2. **Cambia `enabled` a `true`:**
   ```javascript
   enabled: true
   ```

3. **Cambia `adminEmail` a tu email:**
   ```javascript
   adminEmail: 'tu-email@gmail.com',
   ```

4. **Guarda y re-despliega** (Deploy → New version)

5. **Autoriza permisos de Gmail:**
   - La primera vez que se ejecute, Google pedirá permisos
   - Autoriza el acceso a Gmail

#### ¿Qué emails se envían?

**A) Email al Admin (cuando alguien compra):**
```
Asunto: 🎉 Nueva compra: derecho-no-abogados
---
Hola,

Tienes una nueva compra en Empírica Legal Lab:

📧 Email: comprador@ejemplo.com
📚 Curso: derecho-no-abogados
💰 Monto: $500 MXN
🕐 Fecha: 13/11/2025, 10:30 AM

El usuario ya tiene acceso automático al curso.
```

**B) Email de Bienvenida al Comprador:**
```
Asunto: ✅ Bienvenido a Derecho para No Abogados
---
Hola,

¡Gracias por tu compra! Ya tienes acceso completo al curso.

🎓 ¿Cómo acceder?
1. Ve a: https://cursos-juridicos-empirica.io/cursos/derecho-no-abogados/
2. Si te pide verificación, usa este email: comprador@ejemplo.com

📱 ¿Necesitas ayuda?
Contáctanos por WhatsApp: +52 998 257 0828
```

---

## 📊 Cómo Ver las Estadísticas

### Opción A: Desde el Navegador

**URL para estadísticas generales:**
```
https://script.google.com/macros/s/TU-URL/exec?action=stats
```

**URL para logs recientes:**
```
https://script.google.com/macros/s/TU-URL/exec?action=logs
```

**URL para estadísticas de últimos 30 días:**
```
https://script.google.com/macros/s/TU-URL/exec?action=activityStats&days=30
```

### Opción B: Desde Google Sheets

Tu Google Sheet ahora tiene 3 pestañas:

1. **Compradores** - Lista de todos los compradores
2. **Logs** - Registro detallado de actividad
3. **Estadisticas** - Resumen diario (se actualiza automáticamente)

#### Ver Logs en la Hoja "Logs":

Columnas:
- **A**: Timestamp
- **B**: Acción
- **C**: Email
- **D**: Curso
- **E**: Resultado
- **F**: Info adicional
- **G**: User Agent

#### Filtrar Logs:

**Para ver solo accesos exitosos:**
1. Haz clic en la columna E (Resultado)
2. Filtro → "access_granted"

**Para ver solo un usuario:**
1. Haz clic en la columna C (Email)
2. Filtro → "usuario@ejemplo.com"

**Para ver actividad sospechosa:**
1. Haz clic en la columna F (Info adicional)
2. Filtro → Contiene "SUSPICIOUS"

---

## 🔍 Detectar Problemas

### Caso 1: Usuario reporta "no puedo acceder"

1. **Abre la hoja "Logs"**
2. **Filtra por su email** (columna C)
3. **Revisa la columna E (Resultado)**:
   - Si dice `access_denied` → No está en la lista de compradores
   - Si dice `access_granted` → El problema es del frontend (cache)

### Caso 2: Detectar compartir de cuenta

1. **Abre la hoja "Logs"**
2. **Filtra por un email**
3. **Revisa la columna G (User Agent)**:
   - Si ves MUCHOS user agents diferentes = múltiples dispositivos
   - Si ves la misma actividad desde IPs diferentes = sospechoso

### Caso 3: Ver actividad de un curso específico

1. **Abre la hoja "Logs"**
2. **Filtra por columna D (Curso)** = "derecho-no-abogados"
3. **Ordena por columna A (Timestamp)** más reciente primero

---

## 🛡️ Actividad Sospechosa

### ¿Qué se considera sospechoso?

El sistema marca automáticamente como sospechoso si detecta:
- **Más de 10 intentos de acceso en 5 minutos** del mismo email

### ¿Qué hacer si detectas actividad sospechosa?

**Opción A: Revocar Acceso**
1. Abre la hoja "Compradores"
2. Encuentra al usuario
3. Cambia columna F (Estado) de `activo` → `bloqueado`
4. El usuario ya no podrá acceder

**Opción B: Investigar**
1. Abre la hoja "Logs"
2. Filtra por ese email
3. Revisa User Agent y timestamp
4. Decide si es legítimo o abuso

---

## 📈 Estadísticas Disponibles

### Métricas Clave:

1. **Total de Accesos** - Cuántas veces verificaron acceso
2. **Accesos Exitosos** - Cuántos tenían permiso
3. **Accesos Denegados** - Cuántos fueron rechazados
4. **Usuarios Únicos** - Cuántos emails diferentes
5. **Tasa de Éxito** - % de accesos exitosos

### Ejemplo de Respuesta:

```json
{
  "period": "Últimos 7 días",
  "totalAccess": 45,
  "successfulAccess": 38,
  "deniedAccess": 7,
  "uniqueUsers": 5,
  "successRate": "84.4%"
}
```

**Interpretación:**
- 45 intentos de acceso totales
- 38 fueron exitosos (usuarios con permiso)
- 7 fueron denegados (sin permiso)
- 5 usuarios diferentes accedieron
- 84.4% de éxito (normal)

---

## ⚙️ Configuración Avanzada

### Cambiar Límite de Logs

Por defecto, se mantienen los últimos 1000 logs. Para cambiar:

**Línea 77 del backend:**
```javascript
if (numRows > 1001) {  // 1000 datos + 1 encabezado
```

Cambia a (por ejemplo, 2000 logs):
```javascript
if (numRows > 2001) {  // 2000 datos + 1 encabezado
```

### Cambiar Umbral de Actividad Sospechosa

Por defecto: 10 intentos en 5 minutos. Para cambiar:

**Línea 145 del backend:**
```javascript
if (accessCount > 10) {
```

Cambia a (por ejemplo, 20 intentos):
```javascript
if (accessCount > 20) {
```

---

## 🚨 Solución de Problemas

### Problema: "No veo estadísticas de actividad"

**Causa:** El endpoint no está devolviendo la info completa.

**Solución:**
1. Verifica que desplegaste la versión nueva del backend
2. Prueba la URL con `?action=activityStats&days=7`
3. Si da error, revisa que el backend no tenga errores de sintaxis

### Problema: "Los emails no se envían"

**Causa 1:** `enabled: false` en configuración

**Solución:** Cambiar a `enabled: true` y re-desplegar

**Causa 2:** No has autorizado permisos de Gmail

**Solución:**
1. En Apps Script, ejecuta manualmente la función `notifyAdmin`
2. Te pedirá permisos → Autoriza
3. Ya funcionarán los emails automáticos

**Causa 3:** Email de destinatario incorrecto

**Solución:** Verifica `adminEmail` en la configuración

### Problema: "Veo muchos logs duplicados"

**Causa:** Es normal si el usuario recarga la página varias veces

**No es problema** - El sistema auto-limpia cuando hay más de 1000 logs

---

## 📋 Checklist de Implementación

- [ ] Desplegué el nuevo backend con logs
- [ ] Probé `?action=stats` y funciona
- [ ] Probé `?action=logs` y veo los logs
- [ ] Veo la pestaña "Logs" en mi Google Sheet
- [ ] (Opcional) Activé notificaciones por email
- [ ] (Opcional) Autoricé permisos de Gmail
- [ ] Recibí el email de prueba correctamente

---

## 🎯 Próximos Pasos

Una vez que tengas esto funcionando, puedes:

1. **Crear dashboards en Google Data Studio** con los datos de logs
2. **Configurar alertas automáticas** cuando hay actividad sospechosa
3. **Implementar webhooks de Stripe** para automatización completa
4. **Agregar límite de dispositivos por usuario**

---

**¿Listo?** Despliega el nuevo backend y empieza a monitorear tu sitio como un pro 🚀
