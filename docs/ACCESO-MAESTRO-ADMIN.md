# 🔑 CÓDIGOS DE ACCESO MAESTRO - EMPÍRICA LEGAL LAB

**Guarda este archivo en un lugar seguro - te da acceso completo a todos los cursos**

---

## 🚀 ACCESO RÁPIDO (Método 1 - Más Fácil)

**Copia y pega esto en la consola del navegador (F12):**

```javascript
localStorage.setItem('empirica_admin_access', 'granted')
```

Luego recarga la página (F5).

✅ **Listo - tienes acceso completo y permanente**

---

## 🔐 ACCESO CON CÓDIGO (Método 2)

**Código maestro:** `empirica2025`

**Opción A - Desde la consola:**
```javascript
empiricaAdmin('empirica2025')
```

**Opción B - Desde la URL:**
```
?master=empirica2025
```

Ejemplo:
```
https://tu-sitio.com/cursos/derecho-no-abogados/?master=empirica2025
```

---

## ✅ VERIFICAR QUE FUNCIONA

Después de activar el acceso, en la consola deberías ver:

```
🔓 Acceso maestro activo - Acceso concedido
✅ Acceso concedido
```

Y NO deberías ver el modal de pago.

---

## 🗑️ DESACTIVAR ACCESO MAESTRO

Si necesitas probarlo sin acceso:

```javascript
localStorage.removeItem('empirica_admin_access')
```

Luego recarga la página.

---

## 🔄 LIMPIAR CACHÉ DE CURSO

Si un curso no actualiza tu acceso:

**Para Derecho:**
```javascript
EmpricaAccess.clearCache('derecho-no-abogados')
EmpricaAccess.recheck()
```

**Para Legal English:**
```javascript
EmpricaAccess.clearCache('legal-english')
EmpricaAccess.recheck()
```

---

## 📱 ACCESO EN DIFERENTES DISPOSITIVOS

El acceso maestro se guarda **por navegador y dispositivo**.

Si quieres acceso en:
- **Tu laptop** → Activa el código ahí
- **Tu teléfono** → Activa el código ahí
- **Otro navegador** → Activa el código ahí

Cada dispositivo/navegador necesita activación independiente.

---

## 🆘 SOLUCIÓN RÁPIDA SI NO FUNCIONA

1. **Abre consola del navegador:** F12 (Windows/Linux) o Cmd+Option+J (Mac)
2. **Copia y pega esto:**
   ```javascript
   localStorage.setItem('empirica_admin_access', 'granted')
   location.reload()
   ```
3. **Presiona Enter**
4. **La página se recarga automáticamente con acceso completo**

---

## 📋 RESUMEN DE COMANDOS ÚTILES

### Activar acceso:
```javascript
localStorage.setItem('empirica_admin_access', 'granted')
```

### Verificar si tienes acceso:
```javascript
localStorage.getItem('empirica_admin_access')
// Debe devolver: "granted"
```

### Limpiar todo y empezar de cero:
```javascript
localStorage.clear()
location.reload()
```

### Ver qué email tienes guardado:
```javascript
localStorage.getItem('empirica_user_email')
```

### Cambiar email guardado:
```javascript
localStorage.setItem('empirica_user_email', 'tu-email@ejemplo.com')
```

---

## 🔒 SEGURIDAD

**NO COMPARTAS:**
- ❌ Este archivo
- ❌ El código `empirica2025`
- ❌ Los comandos de acceso maestro

**SÍ PUEDES COMPARTIR:**
- ✅ Los enlaces de pago de Stripe
- ✅ Las URLs de los cursos

---

## 🎯 CASOS DE USO COMUNES

### Caso 1: Quiero acceder desde mi computadora personal
```javascript
localStorage.setItem('empirica_admin_access', 'granted')
```
Recarga la página. Listo.

### Caso 2: Quiero acceder desde mi teléfono
Abre el navegador móvil → Inspeccionar (si está disponible) o usa:
```
https://tu-sitio.com/cursos/derecho-no-abogados/?master=empirica2025
```

### Caso 3: Probé el sistema y ahora quiero volver a tener acceso
```javascript
localStorage.setItem('empirica_admin_access', 'granted')
location.reload()
```

### Caso 4: Quiero simular ser un usuario sin acceso
```javascript
localStorage.clear()
location.reload()
```

Luego, para volver a tener acceso:
```javascript
localStorage.setItem('empirica_admin_access', 'granted')
location.reload()
```

---

## 📞 SOPORTE

Si algo no funciona:

1. Abre modo incógnito/privado
2. Ejecuta el comando de acceso maestro
3. Prueba el curso
4. Si sigue sin funcionar, limpia el caché del navegador

---

**Creado:** 2025-11-11
**Actualizado:** 2025-11-11
**Confidencial** - Solo para uso administrativo

---

## 💾 BACKUP DE ESTE ARCHIVO

Guarda este archivo en:
- [ ] Tu computadora local
- [ ] Google Drive / Dropbox
- [ ] Notas seguras del teléfono
- [ ] Gestor de contraseñas (recomendado)
