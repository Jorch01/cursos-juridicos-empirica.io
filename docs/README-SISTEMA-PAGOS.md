# 🎯 Sistema de Pagos - Quick Start

## 📚 Archivos Creados

1. **`js/payment-access-control.js`** - Script principal de control de acceso
2. **`docs/google-apps-script-backend.js`** - Backend para Google Apps Script
3. **`docs/GUIA-CONFIGURACION-PAGOS.md`** - Guía completa paso a paso
4. **`gracias.html`** - Página de agradecimiento post-pago

## ⚡ Pasos Rápidos para Activar

### 1. Configurar Stripe (15 minutos)
- Crear cuenta en https://stripe.com/mx
- Crear 2 Payment Links:
  - Derecho para No Abogados: $500 MXN
  - Legal English: $5,000 MXN
- Agregar metadata: `course: nombre-del-curso`
- Copiar los links generados

### 2. Configurar Google Sheet (5 minutos)
- Crear nuevo Google Sheet
- Nombrar: "Compradores Empírica Legal Lab"
- Copiar el ID del Sheet (está en la URL)

### 3. Configurar Google Apps Script (10 minutos)
- Ir a https://script.google.com
- Nuevo proyecto
- Copiar código de: `docs/google-apps-script-backend.js`
- Reemplazar `SHEET_ID` con tu ID
- Desplegar como Web App
- Copiar URL generada

### 4. Configurar el Sitio Web (5 minutos)
Editar `js/payment-access-control.js`:

```javascript
const CONFIG = {
    GOOGLE_SCRIPT_URL: 'TU_URL_DE_APPS_SCRIPT',  // Pegar aquí
    STRIPE_LINKS: {
        'derecho-no-abogados': 'TU_LINK_STRIPE_1',  // Pegar aquí
        'legal-english': 'TU_LINK_STRIPE_2'  // Pegar aquí
    },
    // ...
};
```

### 5. Probar el Sistema
1. Agregar tu email en Google Sheet (hoja "Compradores")
2. Abrir curso y verificar acceso
3. Probar con otro email sin agregar (debe mostrar modal de pago)

## 📖 Documentación Completa

Para instrucciones detalladas, consulta:
- **`docs/GUIA-CONFIGURACION-PAGOS.md`** - Guía completa con screenshots

## 🆘 Solución Rápida de Problemas

### Modal no aparece
```javascript
// En consola del navegador:
console.log(window.EmpricaAccess);
```

### Usuario tiene acceso pero no puede entrar
```javascript
// En consola del navegador:
EmpricaAccess.clearCache();
```

### Ver logs de acceso
- Abrir Google Sheet > Hoja "Logs"

## 💰 Costos

- **Stripe**: 3.6% + $3 MXN por transacción
- **Google Sheets**: Gratis
- **Google Apps Script**: Gratis

## 🚀 Estado Actual

- ✅ Sistema implementado
- ⚠️ Necesita configuración (3 URLs)
- ⏳ Listo para activar

## 📞 Soporte

Jorge Israel Clemente Marié
- WhatsApp: +52 998 257 0828
- Email: jorge_clemente@empirica.mx

---

**Tiempo total de configuración: ~35 minutos**
