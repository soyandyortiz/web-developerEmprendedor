document.addEventListener('DOMContentLoaded', () => {
    
    // --- Elements ---
    const businessTypeSelect = document.getElementById('business-type');
    const visualThemeRadios = document.querySelectorAll('input[name="visual-theme"]');
    const fontStyleRadios = document.querySelectorAll('input[name="font-style"]');
    
    // Color Inputs
    const headerBgInput = document.getElementById('header-bg');
    const headerTextInput = document.getElementById('header-text');
    const bodyBgInput = document.getElementById('body-bg');
    const bodyTextInput = document.getElementById('body-text');
    const footerBgInput = document.getElementById('footer-bg');
    const footerTextInput = document.getElementById('footer-text');
    const cardBgInput = document.getElementById('card-bg');
    const cardTextInput = document.getElementById('card-text');
    const cardShadowCheckbox = document.getElementById('card-shadow');
    
    const previewContainer = document.getElementById('preview-content');
    const generateSummaryBtn = document.getElementById('generate-summary-btn');
    const summaryModal = document.getElementById('summary-modal');
    
    // Modal Actions
    const downloadBtn = document.getElementById('download-btn');
    // Note: whatsappBtn removed as per request

    // --- State ---
    const state = {
        businessType: 'technology',
        theme: 'modern',
        colors: {
            header: { bg: '#0F172A', text: '#ffffff' },
            body: { bg: '#1e293b', text: '#f8fafc' },
            footer: { bg: '#020617', text: '#94a3b8' },
            card: { bg: '#334155', text: '#ffffff', shadow: true }
        },
        font: 'modern',
        brand: { primary: '#8b5cf6', secondary: '#06b6d4' } 
    };

    // --- Data Templates ---
    const contentData = {
        technology: {
            heroTitle: 'El Futuro es Digital',
            heroSubtitle: 'Soluciones de software de vanguardia para escalar tu negocio.',
            cta: 'Ver Demo',
            servicesTitle: 'Nuestra Tecnología',
            services: [
                { title: 'Cloud', icon: '☁️', desc: 'Infraestructura escalable.' },
                { title: 'IA', icon: '🤖', desc: 'Inteligencia artificial aplicada.' },
                { title: 'Cyber', icon: '🔒', desc: 'Seguridad de grado militar.' }
            ],
            aboutTitle: 'Innovación Constante',
            aboutDesc: 'Desarrollamos el mañana con código limpio y arquitecturas robustas.',
            contactTitle: 'Inicia tu Proyecto'
        },
        medical: {
            heroTitle: 'Cuidamos de tu Salud',
            heroSubtitle: 'Tecnología avanzada y especialistas dedicados a tu bienestar.',
            cta: 'Agendar Cita',
            servicesTitle: 'Especialidades',
            services: [
                { title: 'Cardiología', icon: '❤️', desc: 'Cuidado integral del corazón.' },
                { title: 'Pediatría', icon: '👶', desc: 'Atención para los más pequeños.' },
                { title: 'Laboratorio', icon: '🔬', desc: 'Análisis clínicos precisos.' }
            ],
            aboutTitle: 'Nuestra Clínica',
            aboutDesc: 'Comprometidos con la excelencia médica y el trato humano.',
            contactTitle: 'Ubicación'
        },
        restaurant: {
            heroTitle: 'Sabores Inolvidables',
            heroSubtitle: 'Una experiencia culinaria única en el corazón de la ciudad.',
            cta: 'Reservar Mesa',
            servicesTitle: 'Nuestro Menú',
            services: [
                { title: 'Platos', icon: '🍽️', desc: 'Especialidades del chef.' },
                { title: 'Bebidas', icon: '🍷', desc: 'Vinos y cócteles selectos.' },
                { title: 'Postres', icon: '🍰', desc: 'Dulces artesanales.' }
            ],
            aboutTitle: 'Nuestra Historia',
            aboutDesc: 'Pasión por la cocina tradicional fusionada con toques modernos.',
            contactTitle: 'Visítanos'
        },
        education: {
            heroTitle: 'Aprende sin Límites',
            heroSubtitle: 'La plataforma educativa que se adapta a tu ritmo de vida.',
            cta: 'Ver Cursos',
            servicesTitle: 'Programas',
            services: [
                { title: 'Online', icon: '💻', desc: 'Clases en vivo y grabadas.' },
                { title: 'Mentoria', icon: '👨‍🏫', desc: 'Acompañamiento personalizado.' },
                { title: 'Comunidad', icon: '👥', desc: 'Red de estudiantes global.' }
            ],
            aboutTitle: 'Misión Educativa',
            aboutDesc: 'Formamos a los líderes del futuro con metodología práctica.',
            contactTitle: 'Inscríbete'
        },
        store: {
            heroTitle: 'Estilo y Calidad',
            heroSubtitle: 'Descubre los mejores productos al mejor precio.',
            cta: 'Ver Catálogo',
            servicesTitle: 'Categorías',
            services: [
                { title: 'Nuevos', icon: '✨', desc: 'Lo último en tendencias.' },
                { title: 'Ofertas', icon: '🏷️', desc: 'Descuentos imperdibles.' },
                { title: 'Premium', icon: '💎', desc: 'Calidad superior garantizada.' }
            ],
            aboutTitle: 'Nuestra Tienda',
            aboutDesc: 'Comprometidos con ofrecerte la mejor experiencia de compra.',
            contactTitle: 'Ayuda'
        },
        services: {
            heroTitle: 'Soluciones Profesionales',
            heroSubtitle: 'Expertos dedicados a potenciar tus resultados.',
            cta: 'Contáctanos',
            servicesTitle: 'Servicios',
            services: [
                { title: 'Consultoría', icon: '📊', desc: 'Asesoramiento estratégico.' },
                { title: 'Gestión', icon: '📑', desc: 'Optimización de recursos.' },
                { title: 'Legal', icon: '⚖️', desc: 'Respaldo jurídico total.' }
            ],
            aboutTitle: 'Experiencia',
            aboutDesc: 'Años de trayectoria brindando confianza y resultados.',
            contactTitle: 'Oficinas'
        },
        other: {
            heroTitle: 'Tu Visión, Tu Web',
            heroSubtitle: 'Creamos espacios digitales únicos para proyectos únicos.',
            cta: 'Empezar',
            servicesTitle: 'Lo Que Hacemos',
            services: [
                { title: 'Creatividad', icon: '🎨', desc: 'Diseño fuera de la caja.' },
                { title: 'Estrategia', icon: '🎯', desc: 'Objetivos claros.' },
                { title: 'Impacto', icon: '🚀', desc: 'Resultados medibles.' }
            ],
            aboutTitle: 'Nosotros',
            aboutDesc: 'Un equipo multidisciplinario listo para cualquier reto.',
            contactTitle: 'Contacto'
        }
    };

    // --- Logic ---
    
    function recommendStyles(type) {
        const suggestions = {
            technology: { 
                theme: 'modern', font: 'modern',
                header: { bg: '#0F172A', text: '#ffffff' },
                body: { bg: '#1e293b', text: '#f8fafc' },
                footer: { bg: '#020617', text: '#94a3b8' },
                card: { bg: '#334155', text: '#ffffff', shadow: true },
                brand: { primary: '#8b5cf6', secondary: '#06b6d4' }
            },
            medical: { 
                theme: 'minimal', font: 'modern',
                header: { bg: '#ffffff', text: '#0ea5e9' },
                body: { bg: '#f8fafc', text: '#334155' },
                footer: { bg: '#f1f5f9', text: '#64748b' },
                card: { bg: '#ffffff', text: '#0f172a', shadow: false },
                brand: { primary: '#0ea5e9', secondary: '#38bdf8' }
            },
            restaurant: { 
                theme: 'elegant', font: 'elegant',
                header: { bg: '#1c1917', text: '#fde68a' },
                body: { bg: '#292524', text: '#fafaf9' },
                footer: { bg: '#0c0a09', text: '#a8a29e' },
                card: { bg: '#44403c', text: '#f5f5f4', shadow: true },
                brand: { primary: '#d97706', secondary: '#92400e' }
            },
            education: { 
                theme: 'dynamic', font: 'modern',
                header: { bg: '#2563eb', text: '#ffffff' },
                body: { bg: '#ffffff', text: '#1e293b' },
                footer: { bg: '#1e293b', text: '#cbd5e1' },
                card: { bg: '#f1f5f9', text: '#0f172a', shadow: true },
                brand: { primary: '#f59e0b', secondary: '#3b82f6' }
            },
            store: { 
                theme: 'modern', font: 'modern',
                header: { bg: '#ffffff', text: '#111827' },
                body: { bg: '#f9fafb', text: '#1f2937' },
                footer: { bg: '#111827', text: '#e5e7eb' },
                card: { bg: '#ffffff', text: '#000000', shadow: true },
                brand: { primary: '#ec4899', secondary: '#db2777' }
            },
            services: { 
                theme: 'corporate', font: 'corporate',
                header: { bg: '#1e40af', text: '#ffffff' },
                body: { bg: '#f3f4f6', text: '#1e293b' },
                footer: { bg: '#1e3a8a', text: '#bfdbfe' },
                card: { bg: '#ffffff', text: '#1e293b', shadow: true },
                brand: { primary: '#1e40af', secondary: '#64748b' }
            },
            other: { 
                theme: 'creative', font: 'creative',
                header: { bg: '#111827', text: '#10b981' },
                body: { bg: '#000000', text: '#ffffff' },
                footer: { bg: '#111827', text: '#6ee7b7' },
                card: { bg: '#1f2937', text: '#e5e7eb', shadow: true },
                brand: { primary: '#10b981', secondary: '#8b5cf6' }
            }
        };

        const rec = suggestions[type] || suggestions.technology;

        // Update State
        state.businessType = type;
        state.theme = rec.theme;
        state.font = rec.font;
        state.colors = {
            header: rec.header,
            body: rec.body,
            footer: rec.footer,
            card: rec.card
        };
        state.brand = rec.brand;

        // Update UI Inputs
        const themeRadio = document.querySelector(`input[name="visual-theme"][value="${rec.theme}"]`);
        if(themeRadio) themeRadio.checked = true;

        const fontRadio = document.querySelector(`input[name="font-style"][value="${rec.font}"]`);
        if(fontRadio) fontRadio.checked = true;
        
        headerBgInput.value = rec.header.bg;
        headerTextInput.value = rec.header.text;
        bodyBgInput.value = rec.body.bg;
        bodyTextInput.value = rec.body.text;
        footerBgInput.value = rec.footer.bg;
        footerTextInput.value = rec.footer.text;
        cardBgInput.value = rec.card.bg;
        cardTextInput.value = rec.card.text;
        cardShadowCheckbox.checked = rec.card.shadow;

        renderPreview();
    }

    function updateState(event) {
        if (event && event.target && event.target.id === 'business-type') {
            recommendStyles(event.target.value);
            return;
        }

        // Manual Updates
        state.businessType = businessTypeSelect.value;
        const checkedTheme = document.querySelector('input[name="visual-theme"]:checked');
        if(checkedTheme) state.theme = checkedTheme.value;

        const checkedFont = document.querySelector('input[name="font-style"]:checked');
        if(checkedFont) state.font = checkedFont.value;
        
        state.colors.header.bg = headerBgInput.value;
        state.colors.header.text = headerTextInput.value;
        state.colors.body.bg = bodyBgInput.value;
        state.colors.body.text = bodyTextInput.value;
        state.colors.footer.bg = footerBgInput.value;
        state.colors.footer.text = footerTextInput.value;
        state.colors.card.bg = cardBgInput.value;
        state.colors.card.text = cardTextInput.value;
        state.colors.card.shadow = cardShadowCheckbox.checked;

        renderPreview();
    }

    function renderPreview() {
        const data = contentData[state.businessType] || contentData.technology;
        
        // Font Mapping
        let fontStyle = '';
        switch(state.font) {
            case 'modern': fontStyle = "'Outfit', sans-serif"; break;
            case 'elegant': fontStyle = "'Playfair Display', serif"; break;
            case 'corporate': fontStyle = "'Roboto', sans-serif"; break;
            case 'creative': fontStyle = "'Montserrat Alternates', sans-serif"; break; 
            default: fontStyle = 'sans-serif';
        }

        // Theme Mapping
        let borderRadius = '0';
        let btnClasses = '';
        
        switch(state.theme) {
            case 'minimal': borderRadius = '0px'; btnClasses = 'border border-current px-6 py-2 uppercase tracking-wide hover:bg-white/10'; break;
            case 'modern': borderRadius = '16px'; btnClasses = 'rounded-full shadow-lg hover:scale-105 transition-transform'; break;
            case 'elegant': borderRadius = '2px'; btnClasses = 'border-b-2 border-current px-4 py-2 hover:opacity-80'; break;
            case 'creative': borderRadius = '20px 4px 20px 4px'; btnClasses = 'rounded-xl border-2 border-current shadow-[4px_4px_0px_0px_currentColor] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_currentColor] transition-all'; break;
            case 'corporate': borderRadius = '4px'; btnClasses = 'rounded hover:opacity-90 shadow-sm'; break;
            case 'dynamic': borderRadius = '12px'; btnClasses = '-skew-x-12 transform hover:skew-x-0 transition-transform'; break;
            default: borderRadius = '8px'; btnClasses = 'rounded-lg';
        }
        
        // Styles
        const containerStyle = `
            font-family: ${fontStyle};
            background-color: ${state.colors.body.bg};
            color: ${state.colors.body.text};
            min-height: 100%;
            display: flex;
            flex-direction: column;
        `;
        const headerStyle = `background-color: ${state.colors.header.bg}; color: ${state.colors.header.text};`;
        const footerStyle = `background-color: ${state.colors.footer.bg}; color: ${state.colors.footer.text};`;
        const cardStyle = `
            background-color: ${state.colors.card.bg};
            color: ${state.colors.card.text};
            border-radius: ${borderRadius};
            ${state.colors.card.shadow ? 'box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);' : 'border: 1px solid rgba(128,128,128, 0.2);'}
        `;

        // HTML
        const html = `
            <div style="${containerStyle}">
                <nav class="h-16 flex items-center justify-between px-8 sticky top-0 z-10 border-b border-current/10" style="${headerStyle}">
                    <div class="font-bold text-xl tracking-tight">Logo</div>
                     <div class="hidden md:flex gap-6 text-sm font-medium opacity-80">
                        <span class="cursor-pointer hover:opacity-100">Inicio</span>
                        <span class="cursor-pointer hover:opacity-100">Servicios</span>
                        <span class="cursor-pointer hover:opacity-100">Contacto</span>
                    </div>
                </nav>
                <header class="py-20 px-8 text-center flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden" 
                        style="background: linear-gradient(180deg, ${state.colors.header.bg} 0%, ${state.colors.body.bg} 100%); color: ${state.colors.header.text}">
                    <h1 class="text-4xl md:text-5xl font-bold mb-6 relative z-10 leading-tight">${data.heroTitle}</h1>
                    <p class="text-lg opacity-80 max-w-2xl mx-auto mb-10 relative z-10">${data.heroSubtitle}</p>
                    <button class="${btnClasses} px-8 py-3 font-bold text-white transition-all relative z-10" style="background-color: ${state.brand.primary}; border-radius: ${borderRadius}">
                        ${data.cta}
                    </button>
                     <div class="absolute top-10 right-10 w-20 h-20 opacity-20 rounded-full blur-xl" style="background: ${state.brand.secondary}"></div>
                    <div class="absolute bottom-10 left-10 w-32 h-32 opacity-20 rounded-full blur-xl" style="background: ${state.brand.primary}"></div>
                </header>
                <section class="py-16 px-8 relative z-10">
                    <h2 class="text-3xl font-bold text-center mb-12" style="color: ${state.colors.body.text}">${data.servicesTitle}</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        ${data.services.map((service) => `
                            <div class="p-6 transition-transform hover:-translate-y-1" style="${cardStyle}">
                                <div class="text-4xl mb-4">${service.icon}</div>
                                <h3 class="text-xl font-bold mb-2" style="color: ${state.brand.primary}">${service.title}</h3>
                                <p class="text-sm opacity-80">${service.desc}</p>
                            </div>
                        `).join('')}
                    </div>
                </section>
                <section class="py-16 px-8 relative overflow-hidden">
                    <div class="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
                        <div class="w-full md:w-1/2 aspect-video bg-gray-500/20 relative overflow-hidden" style="border-radius: ${borderRadius}">
                             <div class="absolute inset-0 flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest">[ Img Placeholder ]</div>
                        </div>
                         <div class="w-full md:w-1/2">
                              <h2 class="text-3xl font-bold mb-6" style="color: ${state.brand.primary}">${data.aboutTitle}</h2>
                              <p class="text-lg opacity-80 leading-relaxed">${data.aboutDesc}</p>
                         </div>
                    </div>
                </section>
                <footer class="py-10 px-8 mt-auto text-center text-sm opacity-80 border-t border-white/5" style="${footerStyle}">
                    <div class="mb-4 font-bold text-lg">${data.contactTitle}</div>
                    <p class="mb-4 text-xs opacity-60">123 Street, City - Country</p>
                    <p>&copy; 2024 ${data.heroTitle.split(' ')[0]} Corp.</p>
                </footer>
            </div>
        `;

        previewContainer.innerHTML = html;
    }

    // --- Summary & Logic ---
    function getSystemObservations() {
        const obs = [];
        
        // Contrast check
        if (state.colors.body.bg === '#ffffff' && state.colors.body.text === '#ffffff') {
            obs.push("⚠️ Advertencia: El texto del cuerpo es igual al fondo. Considere aumentar el contraste.");
        }
        
        // Theme specific advice
        if (state.businessType === 'technology' && state.theme !== 'modern' && state.theme !== 'dynamic') {
             obs.push("💡 Tip: Para tecnología, los temas Moderno o Dinámico suelen tener mejor recepción.");
        }
        if (state.businessType === 'medical' && state.colors.body.bg !== '#f8fafc' && state.colors.body.bg !== '#ffffff') {
             obs.push("💡 Tip: En salud, los fondos claros transmiten mayor higiene y confianza.");
        }
        
        // Font advice
        if (state.font === 'creative' && state.businessType === 'corporate') {
            obs.push("💡 Tip: La fuente creativa puede ser arriesgada para un entorno 100% corporativo. Considere 'Corporativa' o 'Moderna'.");
        }

        if (obs.length === 0) {
            obs.push("✅ Excelente elección. La combinación de colores y tipografía es equilibrada y profesional.");
        }
        
        return obs.join("\n\n");
    }

    function generateSummaryText() {
         const business = businessTypeSelect.options[businessTypeSelect.selectedIndex].text;
         const theme = state.theme.charAt(0).toUpperCase() + state.theme.slice(1);
         const font = state.font.charAt(0).toUpperCase() + state.font.slice(1);
         const obs = getSystemObservations();
         
         return `
RESUMEN DE ESTILOS - GUAMBRAWEB
================================

DETALLES GENERALES
------------------
Tipo de Negocio: ${business}
Tema Visual: ${theme}
Tipografía: ${font}

PALETA DE COLORES
-----------------
Header: Fondo ${state.colors.header.bg} | Texto ${state.colors.header.text}
Cuerpo: Fondo ${state.colors.body.bg} | Texto ${state.colors.body.text}
Footer: Fondo ${state.colors.footer.bg} | Texto ${state.colors.footer.text}
Tarjetas: Fondo ${state.colors.card.bg} | Texto ${state.colors.card.text}
(${state.colors.card.shadow ? 'Con Sombra' : 'Sin Sombra'})

OBSERVACIONES DEL SISTEMA
-------------------------
${obs}

================================
Generado el: ${new Date().toLocaleString()}
`.trim();
    }

    function showSummary() {
         const business = businessTypeSelect.options[businessTypeSelect.selectedIndex].text;
         const theme = state.theme.charAt(0).toUpperCase() + state.theme.slice(1);
         const font = state.font.charAt(0).toUpperCase() + state.font.slice(1);
         
         // Update UI
         document.getElementById('modal-business').textContent = business;
         document.getElementById('modal-theme').textContent = theme;
         document.getElementById('modal-font').textContent = font;
         
         // Colors
         document.getElementById('modal-header-bg').style.backgroundColor = state.colors.header.bg;
         document.getElementById('modal-header-hex').textContent = state.colors.header.bg;
         
         document.getElementById('modal-body-bg').style.backgroundColor = state.colors.body.bg;
         document.getElementById('modal-body-hex').textContent = state.colors.body.bg;
         
         document.getElementById('modal-footer-bg').style.backgroundColor = state.colors.footer.bg;
         document.getElementById('modal-footer-hex').textContent = state.colors.footer.bg;
         
         document.getElementById('modal-card-bg').style.backgroundColor = state.colors.card.bg;
         document.getElementById('modal-card-hex').textContent = state.colors.card.bg;
         
         // Observations
         document.getElementById('modal-observations').textContent = getSystemObservations();

         summaryModal.classList.remove('hidden');
         setTimeout(() => {
             document.getElementById('summary-modal-content').classList.remove('scale-95', 'opacity-0');
             document.getElementById('summary-modal-content').classList.add('scale-100', 'opacity-100');
         }, 10);
    }
    
    function downloadSummary() {
        const text = generateSummaryText();
        const blob = new Blob([text], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resumen-guambraweb.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
    
    // sendToWhatsApp removed.
    
    function closeModal() {
         document.getElementById('summary-modal-content').classList.remove('scale-100', 'opacity-100');
         document.getElementById('summary-modal-content').classList.add('scale-95', 'opacity-0');
         setTimeout(() => {
            summaryModal.classList.add('hidden');
         }, 300);
    }

    // --- Init Listeners ---
    businessTypeSelect.addEventListener('change', updateState);
    visualThemeRadios.forEach(radio => radio.addEventListener('change', updateState));
    fontStyleRadios.forEach(radio => radio.addEventListener('change', updateState));
    
    headerBgInput.addEventListener('input', updateState);
    headerTextInput.addEventListener('input', updateState);
    bodyBgInput.addEventListener('input', updateState);
    bodyTextInput.addEventListener('input', updateState);
    footerBgInput.addEventListener('input', updateState);
    footerTextInput.addEventListener('input', updateState);
    cardBgInput.addEventListener('input', updateState);
    cardTextInput.addEventListener('input', updateState);
    cardShadowCheckbox.addEventListener('change', updateState);

    generateSummaryBtn.addEventListener('click', showSummary);
    document.getElementById('close-modal-btn').addEventListener('click', closeModal);
    summaryModal.addEventListener('click', (e) => {
        if (e.target === summaryModal) closeModal();
    });
    
    // Actions
    downloadBtn.addEventListener('click', downloadSummary);

    // Check for mobile on load (optional JS enforcement backup)
    function checkDevice() {
        if (window.innerWidth < 768) {
            // Logic handled by CSS overlay, but we can do extra checks if needed.
        }
    }
    window.addEventListener('resize', checkDevice);
    checkDevice();

    // Start
    recommendStyles('technology');
});
