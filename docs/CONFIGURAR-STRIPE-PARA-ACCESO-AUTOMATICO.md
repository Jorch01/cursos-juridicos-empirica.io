# 🔐 Configurar Stripe para Acceso Automático

Esta guía te explica cómo configurar tus enlaces de pago de Stripe para que los compradores tengan acceso automático al curso después de pagar, **sin necesidad de registrarse manualmente**.

---

## 🎯 ¿Qué hace esto?

Cuando un usuario compra un curso en Stripe, Stripe lo redirige a la página de agradecimiento (`gracias.html`) **con su email incluido en la URL**. El sistema entonces:

1. Detecta el email automáticamente
2. Lo guarda en el navegador del usuario
3. Le da acceso inmediato al curso

**Sin fricción, sin registros manuales, sin confusiones.**

---

## ⚙️ Pasos para Configurar

### **Paso 1: Accede a tus Payment Links en Stripe**

1. Ve a https://dashboard.stripe.com
2. En el menú izquierdo, haz clic en **"Payment Links"** (Enlaces de Pago)
3. Verás tus dos enlaces creados:
   - Derecho para No Abogados ($500 MXN)
   - Legal English ($5,000 MXN)

---

### **Paso 2: Editar el Payment Link de "Derecho para No Abogados"**

1. Haz clic en el enlace de **Derecho para No Abogados**
2. Haz clic en el botón **"Edit link"** (Editar enlace) o los tres puntos `...` → **"Edit"**
3. Busca la sección **"After payment"** (Después del pago)
4. Selecciona **"Redirect to a page"** (Redirigir a una página)
5. En el campo de URL, pega esto:

```
https://TU-DOMINIO.com/gracias.html?curso=derecho-no-abogados&email={CUSTOMER_EMAIL}
```

**⚠️ IMPORTANTE:** Reemplaza `TU-DOMINIO.com` con tu dominio real. Por ejemplo:
- Si usas GitHub Pages: `https://tuusuario.github.io/tu-repo`
- Si tienes dominio propio: `https://empirica.mx`

**Ejemplo completo:**
```
https://jorch01.github.io/cursos.empirica.mx/gracias.html?curso=derecho-no-abogados&email={CUSTOMER_EMAIL}
```

6. Haz clic en **"Save"** (Guardar)

---

### **Paso 3: Editar el Payment Link de "Legal English"**

Repite el mismo proceso pero con esta URL:

```
https://TU-DOMINIO.com/gracias.html?curso=legal-english&email={CUSTOMER_EMAIL}
```

**Ejemplo completo:**
```
https://jorch01.github.io/cursos.empirica.mx/gracias.html?curso=legal-english&email={CUSTOMER_EMAIL}
```

---

## 🔍 ¿Qué significa `{CUSTOMER_EMAIL}`?

`{CUSTOMER_EMAIL}` es una **variable dinámica de Stripe** que se reemplaza automáticamente con el email real del comprador.

Por ejemplo, si Juan compra el curso con el email `juan@gmail.com`, Stripe lo redirigirá a:

```
https://tu-sitio.com/gracias.html?curso=derecho-no-abogados&email=juan@gmail.com
```

El sistema entonces:
1. Lee `email=juan@gmail.com` de la URL
2. Guarda `juan@gmail.com` en el navegador de Juan
3. Juan ahora tiene acceso al curso automáticamente

---

## ✅ Verificar que Funciona

### **Prueba en Modo Test (Recomendado)**

1. En Stripe Dashboard, activa **"Test mode"** (arriba a la derecha)
2. Ve a tus Payment Links en modo test
3. Configúralos igual que arriba
4. Haz una compra de prueba usando:
   - Tarjeta de prueba: `4242 4242 4242 4242`
   - Fecha: Cualquier fecha futura
   - CVC: Cualquier 3 dígitos
   - Email: Tu email real de prueba
5. Después del "pago", deberías ser redirigido a `gracias.html`
6. Abre la consola del navegador (F12) y verás:
   ```
   ✅ Email guardado automáticamente: tu-email@ejemplo.com
   ✅ Acceso concedido para: derecho-no-abogados
   ```
7. Haz clic en "Ir a Mi Curso" y deberías tener acceso sin ver el modal de pago

---

## 🚨 Solución de Problemas

### **Problema 1: Redirige pero no guarda el email**

**Causa:** La URL no tiene `{CUSTOMER_EMAIL}`

**Solución:** Verifica que la URL en Stripe incluya **exactamente** `{CUSTOMER_EMAIL}` (con llaves y mayúsculas)

---

### **Problema 2: Aparece el modal de pago después de comprar**

**Causa:** El email no se guardó en localStorage

**Solución:**
1. Abre la consola del navegador (F12)
2. Ejecuta: `localStorage.getItem('empirica_user_email')`
3. Si devuelve `null`, el email no se guardó
4. Verifica que la URL tenga el parámetro `email=`
5. Recarga la página de gracias con el email en la URL

---

### **Problema 3: Los compradores reales no pueden acceder**

**Causa:** Probablemente configuraste los links en **Test mode** pero no en **Live mode**

**Solución:**
1. En Stripe Dashboard, desactiva "Test mode"
2. Ve a Payment Links (ahora verás los links reales)
3. Edita cada link con las URLs correctas
4. Guarda los cambios

---

## 📋 Checklist Final

Antes de lanzar al público, verifica:

- [ ] **Payment Link de Derecho** tiene URL correcta con `{CUSTOMER_EMAIL}`
- [ ] **Payment Link de Legal English** tiene URL correcta con `{CUSTOMER_EMAIL}`
- [ ] URLs usan el dominio correcto (no localhost)
- [ ] Probaste una compra de prueba y funcionó
- [ ] El email se guardó automáticamente en localStorage
- [ ] Pudiste acceder al curso sin ver el modal de pago
- [ ] Los links están configurados tanto en **Test mode** como en **Live mode**

---

## 🎓 Flujo Completo del Usuario

1. Usuario visita tu sitio
2. Ve el curso libremente (sin registro)
3. Intenta acceder a un video → Aparece modal de pago
4. Hace clic en "Inscribirme" → Va a Stripe
5. Paga con su email (ej: `cliente@gmail.com`)
6. Stripe lo redirige a: `gracias.html?curso=derecho-no-abogados&email=cliente@gmail.com`
7. El sistema guarda `cliente@gmail.com` automáticamente
8. Usuario hace clic en "Ir a Mi Curso"
9. ✅ **Tiene acceso completo sin más pasos**

---

## 🆘 Soporte

Si algo no funciona:

1. Revisa la consola del navegador (F12) para ver errores
2. Verifica que las URLs de Stripe estén correctas
3. Prueba en modo incógnito para descartar problemas de caché
4. Revisa que `gracias.html` esté accesible públicamente

---

**¿Dudas?** Contáctame: jorge_clemente@empirica.mx

---

*Última actualización: 2025-11-11*
