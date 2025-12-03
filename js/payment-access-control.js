/**
 * ============================================
 * SISTEMA DE CONTROL DE ACCESO Y PAGOS
 * Empírica Legal Lab - Stripe + Google Sheets
 * ============================================
 */

(function() {
    'use strict';

    // ═══════════════════════════════════════
    // ⚙️ CONFIGURACIÓN
    // ═══════════════════════════════════════
    const CONFIG = {
        // URL del Google Apps Script Web App
        GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwoB76CQ6v9xVPL4ryywRmJdIobmHy9Fe3eSAKpZoYrEVgtOttxVWOIpPo-pe6PydbY/exec',

        // Links de pago de Stripe
        STRIPE_LINKS: {
            'derecho-no-abogados': 'https://buy.stripe.com/00wfZi0mj12v18L02k7EQ00',
            'legal-english': 'https://buy.stripe.com/14AeVe3yvbH95p18yQ7EQ01'
        },

        // Identificador del curso actual (se detecta automáticamente)
        currentCourse: null,

        // Storage keys
        STORAGE_KEYS: {
            email: 'empirica_user_email',
            hasAccess: 'empirica_has_access_',
            lastCheck: 'empirica_last_check_'
        }
    };

    // ═══════════════════════════════════════
    // 🔍 DETECTAR CURSO ACTUAL
    // ═══════════════════════════════════════
    function detectCurrentCourse() {
        const path = window.location.pathname;

        if (path.includes('derecho-no-abogados')) {
            return 'derecho-no-abogados';
        } else if (path.includes('legal-english')) {
            return 'legal-english';
        }
        return null;
    }

    // ═══════════════════════════════════════
    // 🆓 DETECTAR SI ES MÓDULO GRATUITO
    // ═══════════════════════════════════════
    function isFreeModule() {
        const path = window.location.pathname;
        // Módulo 1 de Legal English es gratuito
        return path.includes('legal-english/modulos/modulo-1');
    }

    // ═══════════════════════════════════════
    // 📧 VERIFICAR ACCESO EN GOOGLE SHEETS
    // ═══════════════════════════════════════
    async function checkAccessInDatabase(email, course) {
        try {
            const url = `${CONFIG.GOOGLE_SCRIPT_URL}?action=checkAccess&email=${encodeURIComponent(email)}&course=${course}`;

            const response = await fetch(url);
            const data = await response.json();

            return data.hasAccess || false;
        } catch (error) {
            console.error('Error verificando acceso:', error);
            return false;
        }
    }

    // ═══════════════════════════════════════
    // 💾 GUARDAR ESTADO DE ACCESO LOCAL
    // ═══════════════════════════════════════
    function saveAccessState(course, hasAccess) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.hasAccess + course, hasAccess);
        localStorage.setItem(CONFIG.STORAGE_KEYS.lastCheck + course, Date.now());
    }

    // ═══════════════════════════════════════
    // ⏰ VERIFICAR SI NECESITA REVALIDAR
    // ═══════════════════════════════════════
    function needsRevalidation(course) {
        const lastCheck = localStorage.getItem(CONFIG.STORAGE_KEYS.lastCheck + course);
        if (!lastCheck) return true;

        // Revalidar cada 24 horas
        const ONE_DAY = 24 * 60 * 60 * 1000;
        return (Date.now() - parseInt(lastCheck)) > ONE_DAY;
    }

    // ═══════════════════════════════════════
    // 🔐 VERIFICAR ACCESO PRINCIPAL
    // ═══════════════════════════════════════
    async function verifyAccess() {
        const course = detectCurrentCourse();

        // Si no es una página de curso, no hacer nada
        if (!course) {
            console.log('No es una página de curso, acceso libre');
            return true;
        }

        CONFIG.currentCourse = course;

        // Si es módulo gratuito, verificar acceso gratuito
        if (isFreeModule()) {
            const hasFreeAccess = localStorage.getItem('empirica_free_module_1');
            if (hasFreeAccess === 'true') {
                console.log('✅ Acceso gratuito al Módulo 1 concedido');
                return true;
            }
            console.log('🆓 Módulo gratuito - Se requiere email');
            return false;
        }

        // Obtener email del usuario (guardado después del pago)
        const userEmail = localStorage.getItem(CONFIG.STORAGE_KEYS.email);

        // Si no hay email, el usuario no ha pagado
        if (!userEmail) {
            console.log('Sin email guardado - Usuario debe pagar');
            return false;
        }

        // Verificar si tenemos un estado de acceso válido en cache
        const cachedAccess = localStorage.getItem(CONFIG.STORAGE_KEYS.hasAccess + course);

        if (cachedAccess === 'true' && !needsRevalidation(course)) {
            console.log('Acceso verificado desde cache');
            return true;
        }

        // Verificar en la base de datos
        console.log('Verificando acceso en base de datos...');
        const hasAccess = await checkAccessInDatabase(userEmail, course);

        // Guardar resultado
        saveAccessState(course, hasAccess);

        return hasAccess;
    }

    // ═══════════════════════════════════════
    // 💳 MOSTRAR MODAL DE ACCESO
    // ═══════════════════════════════════════
    function showPaymentModal() {
        const course = CONFIG.currentCourse;
        const stripeLink = CONFIG.STRIPE_LINKS[course];

        const courseName = course === 'derecho-no-abogados'
            ? 'Derecho para No Abogados'
            : 'Legal English: Anglo-American Law in Action';

        const price = course === 'derecho-no-abogados' ? '$500 MXN' : '$5,000 MXN';

        const modalHTML = `
            <div id="paymentModal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(27, 44, 39, 0.95);
                backdrop-filter: blur(10px);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            ">
                <div style="
                    background: white;
                    border-radius: 24px;
                    max-width: 650px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
                    animation: slideUp 0.4s ease;
                ">
                    <!-- Header -->
                    <div style="
                        background: linear-gradient(135deg, #1B2C27 0%, #2D4A3E 100%);
                        color: white;
                        padding: 40px 30px;
                        text-align: center;
                        border-radius: 24px 24px 0 0;
                    ">
                        <div style="font-size: 4rem; margin-bottom: 15px;">🔒</div>
                        <h2 style="font-size: 2rem; margin: 0 0 10px 0; font-weight: 700;">
                            Acceso Restringido
                        </h2>
                        <p style="margin: 0; opacity: 0.9; font-size: 1.1rem;">
                            Este contenido está disponible solo para estudiantes inscritos
                        </p>
                    </div>

                    <!-- Contenido -->
                    <div style="padding: 40px 35px;">
                        <div style="
                            background: #F0FDF4;
                            border-left: 4px solid #10B981;
                            padding: 20px;
                            border-radius: 10px;
                            margin-bottom: 30px;
                        ">
                            <h3 style="color: #1B2C27; margin: 0 0 15px 0; font-size: 1.4rem;">
                                📚 ${courseName}
                            </h3>
                            <p style="margin: 0 0 10px 0; color: #2C3E50; font-size: 1.1rem;">
                                <strong>Inversión:</strong> ${price}
                            </p>
                            <p style="margin: 0; color: #6C757D; font-size: 0.95rem;">
                                Incluye certificado oficial con firma electrónica SAT
                            </p>
                        </div>

                        <!-- Tabs -->
                        <div style="display: flex; gap: 10px; margin-bottom: 25px; border-bottom: 2px solid #E1E8E5;">
                            <button onclick="switchAccessTab('payment')" id="tabPayment" style="
                                flex: 1;
                                padding: 15px;
                                background: linear-gradient(135deg, #10B981 0%, #059669 100%);
                                color: white;
                                border: none;
                                border-radius: 8px 8px 0 0;
                                font-size: 1rem;
                                font-weight: 600;
                                cursor: pointer;
                                transition: all 0.3s ease;
                            ">
                                💳 Inscribirme
                            </button>
                            <button onclick="switchAccessTab('email')" id="tabEmail" style="
                                flex: 1;
                                padding: 15px;
                                background: white;
                                color: #1B2C27;
                                border: 2px solid #E1E8E5;
                                border-bottom: none;
                                border-radius: 8px 8px 0 0;
                                font-size: 1rem;
                                font-weight: 600;
                                cursor: pointer;
                                transition: all 0.3s ease;
                            ">
                                📧 Verificar Acceso
                            </button>
                        </div>

                        <!-- Contenido Tab Payment -->
                        <div id="contentPayment" style="display: block;">
                            <div style="margin-bottom: 25px;">
                                <h4 style="color: #1B2C27; margin-bottom: 15px; font-size: 1.2rem;">
                                    ✨ Al inscribirte obtendrás:
                                </h4>
                                <ul style="list-style: none; padding: 0; margin: 0;">
                                    <li style="padding: 8px 0; padding-left: 30px; position: relative; color: #2C3E50;">
                                        <span style="position: absolute; left: 0; color: #10B981;">✓</span>
                                        Acceso completo e ilimitado al curso
                                    </li>
                                    <li style="padding: 8px 0; padding-left: 30px; position: relative; color: #2C3E50;">
                                        <span style="position: absolute; left: 0; color: #10B981;">✓</span>
                                        Todos los videos, ejercicios y materiales
                                    </li>
                                    <li style="padding: 8px 0; padding-left: 30px; position: relative; color: #2C3E50;">
                                        <span style="position: absolute; left: 0; color: #10B981;">✓</span>
                                        Certificado/Diploma oficial incluido
                                    </li>
                                    <li style="padding: 8px 0; padding-left: 30px; position: relative; color: #2C3E50;">
                                        <span style="position: absolute; left: 0; color: #10B981;">✓</span>
                                        Soporte por WhatsApp
                                    </li>
                                </ul>
                            </div>

                            <a href="${stripeLink}" target="_blank" style="
                                display: block;
                                width: 100%;
                                padding: 18px;
                                background: linear-gradient(135deg, #10B981 0%, #059669 100%);
                                color: white;
                                border: none;
                                border-radius: 12px;
                                font-size: 1.2rem;
                                font-weight: 700;
                                text-decoration: none;
                                text-align: center;
                                cursor: pointer;
                                transition: all 0.3s ease;
                                margin-bottom: 15px;
                            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(16, 185, 129, 0.3)'"
                               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                                💳 Pagar Ahora - ${price}
                            </a>

                            <p style="text-align: center; margin-top: 15px; font-size: 0.9rem; color: #6C757D;">
                                🔒 Pago seguro procesado por Stripe
                            </p>
                        </div>

                        <!-- Contenido Tab Email -->
                        <div id="contentEmail" style="display: none;">
                            <div style="
                                background: #FEF3C7;
                                border-left: 4px solid #F59E0B;
                                padding: 15px;
                                border-radius: 8px;
                                margin-bottom: 20px;
                            ">
                                <p style="margin: 0; color: #92400E; font-size: 0.95rem;">
                                    <strong>ℹ️ ¿Ya pagaste o tienes acceso autorizado?</strong><br>
                                    Ingresa tu email para verificar tu acceso al curso.
                                </p>
                            </div>

                            <form id="emailAccessForm" onsubmit="verifyEmailAccess(event); return false;">
                                <div style="margin-bottom: 20px;">
                                    <label style="
                                        display: block;
                                        color: #1B2C27;
                                        font-weight: 600;
                                        margin-bottom: 8px;
                                        font-size: 1rem;
                                    ">
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        id="verifyEmail"
                                        placeholder="tu-email@ejemplo.com"
                                        required
                                        style="
                                            width: 100%;
                                            padding: 15px;
                                            border: 2px solid #E1E8E5;
                                            border-radius: 8px;
                                            font-size: 1rem;
                                            box-sizing: border-box;
                                            transition: all 0.3s ease;
                                        "
                                        onfocus="this.style.borderColor='#10B981'"
                                        onblur="this.style.borderColor='#E1E8E5'"
                                    >
                                </div>

                                <button type="submit" id="verifyBtn" style="
                                    display: block;
                                    width: 100%;
                                    padding: 18px;
                                    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
                                    color: white;
                                    border: none;
                                    border-radius: 12px;
                                    font-size: 1.1rem;
                                    font-weight: 700;
                                    cursor: pointer;
                                    transition: all 0.3s ease;
                                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(16, 185, 129, 0.3)'"
                                   onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                                    🔍 Verificar Acceso
                                </button>

                                <div id="verifyMessage" style="
                                    margin-top: 15px;
                                    padding: 15px;
                                    border-radius: 8px;
                                    display: none;
                                    text-align: center;
                                    font-weight: 600;
                                "></div>
                            </form>

                            <p style="text-align: center; margin-top: 20px; font-size: 0.85rem; color: #6C757D;">
                                💡 Si acabas de pagar, espera unos minutos o contacta por WhatsApp
                            </p>
                        </div>

                        <!-- Botón de WhatsApp (siempre visible) -->
                        <a href="https://wa.me/529982570828?text=Hola,%20tengo%20preguntas%20sobre%20el%20curso%20de%20${encodeURIComponent(courseName)}"
                           target="_blank" style="
                            display: block;
                            width: 100%;
                            padding: 15px;
                            background: white;
                            color: #1B2C27;
                            border: 2px solid #E1E8E5;
                            border-radius: 12px;
                            font-size: 1rem;
                            font-weight: 600;
                            text-decoration: none;
                            text-align: center;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            margin-top: 20px;
                        " onmouseover="this.style.borderColor='#10B981'; this.style.color='#10B981'"
                           onmouseout="this.style.borderColor='#E1E8E5'; this.style.color='#1B2C27'">
                            📱 Contactar por WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.body.style.overflow = 'hidden';
    }

    // ═══════════════════════════════════════
    // 🆓 MODAL GRATUITO (SOLO EMAIL)
    // ═══════════════════════════════════════
    function showFreeAccessModal() {
        const modalHTML = `
            <div id="freeAccessModal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(27, 44, 39, 0.95);
                backdrop-filter: blur(10px);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            ">
                <div style="
                    background: white;
                    border-radius: 24px;
                    max-width: 550px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
                    animation: slideUp 0.4s ease;
                ">
                    <!-- Header -->
                    <div style="
                        background: linear-gradient(135deg, #10B981 0%, #059669 100%);
                        color: white;
                        padding: 40px 30px;
                        text-align: center;
                        border-radius: 24px 24px 0 0;
                    ">
                        <div style="font-size: 4rem; margin-bottom: 15px;">🎁</div>
                        <h2 style="font-size: 2rem; margin: 0 0 10px 0; font-weight: 700;">
                            ¡Módulo 1 GRATIS!
                        </h2>
                        <p style="margin: 0; opacity: 0.9; font-size: 1.1rem;">
                            Accede al primer módulo sin costo
                        </p>
                    </div>

                    <!-- Contenido -->
                    <div style="padding: 40px 35px;">
                        <div style="
                            background: #F0FDF4;
                            border-left: 4px solid #10B981;
                            padding: 20px;
                            border-radius: 10px;
                            margin-bottom: 25px;
                        ">
                            <h3 style="color: #1B2C27; margin: 0 0 10px 0; font-size: 1.3rem;">
                                📚 Legal English: Anglo-American Law in Action
                            </h3>
                            <p style="margin: 0; color: #2C3E50; font-size: 1rem;">
                                Prueba el <strong>Módulo 1 completamente gratis</strong> antes de inscribirte al curso completo
                            </p>
                        </div>

                        <div style="margin-bottom: 25px;">
                            <h4 style="color: #1B2C27; margin-bottom: 15px; font-size: 1.1rem;">
                                ✨ En este módulo aprenderás:
                            </h4>
                            <ul style="list-style: none; padding: 0; margin: 0;">
                                <li style="padding: 8px 0; padding-left: 30px; position: relative; color: #2C3E50;">
                                    <span style="position: absolute; left: 0; color: #10B981;">✓</span>
                                    Fundamentos de los sistemas judiciales US/UK
                                </li>
                                <li style="padding: 8px 0; padding-left: 30px; position: relative; color: #2C3E50;">
                                    <span style="position: absolute; left: 0; color: #10B981;">✓</span>
                                    Vocabulario legal esencial en inglés
                                </li>
                                <li style="padding: 8px 0; padding-left: 30px; position: relative; color: #2C3E50;">
                                    <span style="position: absolute; left: 0; color: #10B981;">✓</span>
                                    Ejercicios interactivos y actividades
                                </li>
                            </ul>
                        </div>

                        <form id="freeAccessForm" onsubmit="submitFreeAccess(event); return false;">
                            <div style="margin-bottom: 20px;">
                                <label style="
                                    display: block;
                                    color: #1B2C27;
                                    font-weight: 600;
                                    margin-bottom: 8px;
                                    font-size: 1rem;
                                ">
                                    Ingresa tu email para acceder
                                </label>
                                <input
                                    type="email"
                                    id="freeAccessEmail"
                                    placeholder="tu-email@ejemplo.com"
                                    required
                                    style="
                                        width: 100%;
                                        padding: 15px;
                                        border: 2px solid #E1E8E5;
                                        border-radius: 8px;
                                        font-size: 1rem;
                                        box-sizing: border-box;
                                        transition: all 0.3s ease;
                                    "
                                    onfocus="this.style.borderColor='#10B981'"
                                    onblur="this.style.borderColor='#E1E8E5'"
                                >
                            </div>

                            <button type="submit" id="freeAccessBtn" style="
                                display: block;
                                width: 100%;
                                padding: 18px;
                                background: linear-gradient(135deg, #10B981 0%, #059669 100%);
                                color: white;
                                border: none;
                                border-radius: 12px;
                                font-size: 1.2rem;
                                font-weight: 700;
                                cursor: pointer;
                                transition: all 0.3s ease;
                            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(16, 185, 129, 0.3)'"
                               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                                🎁 Acceder Gratis al Módulo 1
                            </button>

                            <div id="freeAccessMessage" style="
                                margin-top: 15px;
                                padding: 15px;
                                border-radius: 8px;
                                display: none;
                                text-align: center;
                                font-weight: 600;
                            "></div>
                        </form>

                        <p style="text-align: center; margin-top: 20px; font-size: 0.85rem; color: #6C757D;">
                            🔒 Tu email solo se usará para enviarte información del curso
                        </p>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.body.style.overflow = 'hidden';
    }

    // ═══════════════════════════════════════
    // 📧 PROCESAR ACCESO GRATUITO
    // ═══════════════════════════════════════
    window.submitFreeAccess = async function(event) {
        event.preventDefault();

        const emailInput = document.getElementById('freeAccessEmail');
        const submitBtn = document.getElementById('freeAccessBtn');
        const message = document.getElementById('freeAccessMessage');
        const email = emailInput.value.trim();

        if (!email) {
            return;
        }

        // Deshabilitar botón y mostrar estado de carga
        submitBtn.disabled = true;
        submitBtn.innerHTML = '⏳ Procesando...';
        message.style.display = 'none';

        try {
            // Guardar email en Google Sheets para seguimiento
            const course = CONFIG.currentCourse;
            const registerUrl = `${CONFIG.GOOGLE_SCRIPT_URL}?action=registerFreeAccess&email=${encodeURIComponent(email)}&course=${course}&module=modulo-1`;

            await fetch(registerUrl);

            // Guardar email y otorgar acceso localmente
            localStorage.setItem(CONFIG.STORAGE_KEYS.email, email);
            localStorage.setItem('empirica_free_module_1', 'true');

            message.style.display = 'block';
            message.style.background = '#D1FAE5';
            message.style.color = '#065F46';
            message.innerHTML = '✅ ¡Acceso concedido!<br>Disfrutando del Módulo 1...';

            // Disparar evento
            window.dispatchEvent(new CustomEvent('empiricaFreeAccessGranted', {
                detail: { email: email, module: 'modulo-1' }
            }));

            // Ocultar modal y permitir acceso
            setTimeout(() => {
                document.getElementById('freeAccessModal').remove();
                document.body.style.overflow = '';
            }, 1500);

        } catch (error) {
            console.error('Error procesando acceso gratuito:', error);

            message.style.display = 'block';
            message.style.background = '#FEF3C7';
            message.style.color = '#92400E';
            message.innerHTML = '⚠️ Error de conexión. Reintenta o contacta por WhatsApp.';

            submitBtn.disabled = false;
            submitBtn.innerHTML = '🎁 Acceder Gratis al Módulo 1';
        }
    };

    // ═══════════════════════════════════════
    // 🔄 CAMBIAR ENTRE TABS DEL MODAL
    // ═══════════════════════════════════════
    window.switchAccessTab = function(tab) {
        const tabPayment = document.getElementById('tabPayment');
        const tabEmail = document.getElementById('tabEmail');
        const contentPayment = document.getElementById('contentPayment');
        const contentEmail = document.getElementById('contentEmail');

        if (tab === 'payment') {
            // Activar tab de pago
            tabPayment.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
            tabPayment.style.color = 'white';
            tabPayment.style.border = 'none';

            tabEmail.style.background = 'white';
            tabEmail.style.color = '#1B2C27';
            tabEmail.style.border = '2px solid #E1E8E5';
            tabEmail.style.borderBottom = 'none';

            contentPayment.style.display = 'block';
            contentEmail.style.display = 'none';
        } else if (tab === 'email') {
            // Activar tab de email
            tabEmail.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
            tabEmail.style.color = 'white';
            tabEmail.style.border = 'none';

            tabPayment.style.background = 'white';
            tabPayment.style.color = '#1B2C27';
            tabPayment.style.border = '2px solid #E1E8E5';
            tabPayment.style.borderBottom = 'none';

            contentEmail.style.display = 'block';
            contentPayment.style.display = 'none';
        }
    };

    // ═══════════════════════════════════════
    // ✉️ VERIFICAR EMAIL CONTRA GOOGLE SHEETS
    // ═══════════════════════════════════════
    window.verifyEmailAccess = async function(event) {
        event.preventDefault();

        const emailInput = document.getElementById('verifyEmail');
        const verifyBtn = document.getElementById('verifyBtn');
        const verifyMessage = document.getElementById('verifyMessage');
        const email = emailInput.value.trim();

        if (!email) {
            return;
        }

        // Deshabilitar botón y mostrar estado de carga
        verifyBtn.disabled = true;
        verifyBtn.innerHTML = '⏳ Verificando...';
        verifyMessage.style.display = 'none';

        try {
            const course = CONFIG.currentCourse;

            // Verificar en Google Sheets
            const hasAccess = await checkAccessInDatabase(email, course);

            if (hasAccess) {
                // ✅ ACCESO CONCEDIDO
                localStorage.setItem(CONFIG.STORAGE_KEYS.email, email);
                saveAccessState(course, true);

                verifyMessage.style.display = 'block';
                verifyMessage.style.background = '#D1FAE5';
                verifyMessage.style.color = '#065F46';
                verifyMessage.innerHTML = '✅ Acceso verificado correctamente!<br>Recargando la página...';

                // Disparar evento para que el sistema de progreso pueda escucharlo
                window.dispatchEvent(new CustomEvent('empiricaAccessGranted', {
                    detail: { email: email, course: course }
                }));

                // Recargar la página después de 1.5 segundos
                setTimeout(() => {
                    location.reload();
                }, 1500);

            } else {
                // ❌ ACCESO DENEGADO
                verifyMessage.style.display = 'block';
                verifyMessage.style.background = '#FEE2E2';
                verifyMessage.style.color = '#991B1B';
                verifyMessage.innerHTML = '❌ Email no encontrado o sin acceso autorizado.<br>Por favor, inscríbete o contacta por WhatsApp.';

                // Rehabilitar botón
                verifyBtn.disabled = false;
                verifyBtn.innerHTML = '🔍 Verificar Acceso';
            }

        } catch (error) {
            console.error('Error verificando acceso:', error);

            verifyMessage.style.display = 'block';
            verifyMessage.style.background = '#FEF3C7';
            verifyMessage.style.color = '#92400E';
            verifyMessage.innerHTML = '⚠️ Error de conexión. Por favor, intenta de nuevo o contacta por WhatsApp.';

            // Rehabilitar botón
            verifyBtn.disabled = false;
            verifyBtn.innerHTML = '🔍 Verificar Acceso';
        }
    };

    // ═══════════════════════════════════════
    // 🚫 BLOQUEAR CONTENIDO PREMIUM
    // ═══════════════════════════════════════
    function blockPremiumContent() {
        // Bloquear videos
        const videos = document.querySelectorAll('iframe, video');
        videos.forEach(video => {
            video.style.filter = 'blur(10px)';
            video.style.pointerEvents = 'none';
        });

        // Bloquear enlaces a ejercicios y materiales
        const restrictedLinks = document.querySelectorAll('a[href*="video.html"], a[href*="ejercicios.html"], a[href*="presentacion.html"]');
        restrictedLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // Mostrar modal apropiado según el tipo de módulo
                if (isFreeModule()) {
                    showFreeAccessModal();
                } else {
                    showPaymentModal();
                }
            });
        });

        // Mostrar modal automáticamente
        setTimeout(() => {
            if (isFreeModule()) {
                showFreeAccessModal();
            } else {
                showPaymentModal();
            }
        }, 2000);
    }

    // ═══════════════════════════════════════
    // 🎬 INICIALIZACIÓN
    // ═══════════════════════════════════════
    async function init() {
        console.log('🔐 Iniciando sistema de control de acceso...');

        const hasAccess = await verifyAccess();

        if (!hasAccess && CONFIG.currentCourse) {
            console.log('❌ Acceso denegado - Bloqueando contenido premium');
            blockPremiumContent();
        } else {
            console.log('✅ Acceso concedido');
        }
    }

    // ═══════════════════════════════════════
    // 🚀 EJECUTAR AL CARGAR LA PÁGINA
    // ═══════════════════════════════════════
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Exponer función para forzar verificación (útil para debugging)
    window.EmpricaAccess = {
        recheck: init,
        clearCache: function(course) {
            if (!course) course = CONFIG.currentCourse;
            localStorage.removeItem(CONFIG.STORAGE_KEYS.hasAccess + course);
            localStorage.removeItem(CONFIG.STORAGE_KEYS.lastCheck + course);
            console.log('Cache limpiado para:', course);
        }
    };

})();
