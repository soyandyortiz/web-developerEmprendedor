document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-configurator-btn');
    const container = document.getElementById('configurador-web');
    let currentStepIndex = 0;

    // State object to store user data
    // State object to store user data
    window.wizardState = {
        package: { selected: null, extras: [], basePrice: 0 },
        final_options: { 
            domain: null, 
            hosting: null, 
            corporate_email: null 
        }
    };

    // Configuration for the Steps - SIMPLIFIED TO 2 STEPS (Package + Final Options)
    const stepsConfig = [
        {
            id: 'package',
            title: 'Elige tu Plan',
            subtitle: 'Selecciona el paquete que mejor se adapte a tus necesidades.',
            type: 'package_cards',
            packages: [
                {
                    id: 'basico',
                    name: 'Plan Básico',
                    basePrice: 30,
                    icon: 'bx-camera',
                    color: 'violet',
                    included: [
                        'Hasta 5 páginas: Inicio, Nosotros, Portafolio Profesional, Contacto',
                        '5 imágenes incluidas',
                        'Integración con Redes Sociales',
                        'Cambios: hasta 3 (24 horas)',
                        'Entrega: 24 horas'
                    ]
                },
                {
                    id: 'intermedio',
                    name: 'Plan Intermedio',
                    basePrice: 50,
                    icon: 'bx-briefcase',
                    color: 'cyan',
                    included: [
                        'Todo lo del Plan Básico',
                        'Hasta 8 páginas: +Servicios con WhatsApp',
                        '10 imágenes incluidas',
                        'SEO estándar',
                        'Cambios: hasta 5 (48 horas)',
                        'Entrega: 48 horas'
                    ]
                },
                {
                    id: 'avanzado',
                    name: 'Plan Avanzado',
                    basePrice: 70,
                    icon: 'bx-store-alt',
                    color: 'green',
                    included: [
                        'Todo lo del Plan Intermedio',
                        'Hasta 10 páginas o más',
                        'SEO avanzado: Metas, Schema, Speed',
                        'Google Search Console',
                        'Botón WhatsApp flotante + Backups',
                        'Cambios: hasta 10 (5 días)',
                        'Entrega: 3 a 5 días'
                    ]
                }
            ],
            globalExtras: [
                { id: 'blog', label: 'Blog', price: 25 },
                { id: 'tienda', label: 'Tienda con pedidos a WhatsApp (4 productos)', price: 75 },
                { id: 'mapa', label: 'Mapa de Google', price: 5 },
                { id: 'whatsapp_float', label: 'WhatsApp flotante', price: 10 }
            ],
            includedAll: [
                'Sitio optimizado',
                'Manual de uso y Video'
            ]
        },
        {
            id: 'final_options',
            title: 'Últimas Decisiones',
            subtitle: 'Solo 3 opciones rápidas para completar tu presupuesto.',
            type: 'final_options',
            options: [
                {
                    id: 'domain',
                    label: 'Dominio',
                    icon: 'bx-globe',
                    choices: [
                        { 
                            id: 'free', 
                            label: 'Dominio gratuito', 
                            description: 'tunegocio.miplataforma.com',
                            price: 0 
                        },
                        { 
                            id: 'custom', 
                            label: 'Dominio propio', 
                            description: 'tunegocio.com',
                            price: 12 
                        }
                    ]
                },
                {
                    id: 'hosting',
                    label: 'Hosting',
                    icon: 'bx-server',
                    choices: [
                        { 
                            id: 'free', 
                            label: 'Hosting gratuito 6 meses', 
                            description: 'Ideal para comenzar',
                            price: 0 
                        },
                        { 
                            id: 'professional', 
                            label: 'Hosting profesional', 
                            description: 'Mayor velocidad y recursos',
                            price: 20 
                        }
                    ]
                },
                {
                    id: 'corporate_email',
                    label: 'Correo Corporativo (opcional)',
                    icon: 'bx-envelope',
                    choices: [
                        { 
                            id: 'yes', 
                            label: 'Sí quiero correo', 
                            description: 'contacto@tunegocio.com',
                            price: 25 
                        },
                        { 
                            id: 'no', 
                            label: 'No necesito', 
                            description: 'Usaré mi correo personal',
                            price: 0 
                        }
                    ]
                }
            ]
        }
    ];

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            startBtn.classList.add('hidden');
            document.getElementById('configurator-placeholder')?.classList.add('hidden');
            initWizard();
        });
    }

    function initWizard() {
        container.innerHTML = ''; // Clear container
        container.classList.remove('min-h-0');
        container.classList.add('min-h-[400px]');
        renderStep(currentStepIndex);
        setTimeout(() => {
            container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }

    function renderStep(index, animate = true) {
        const step = stepsConfig[index];
        const isFirst = index === 0;
        const isLast = index === stepsConfig.length - 1;

        const stepElement = document.createElement('div');
        stepElement.className = `w-full bg-antigravity-panel border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-md ${animate ? 'animate-fade-in-up' : ''} transition-all duration-500`;
        stepElement.setAttribute('data-step', index);

        // Header
        const headerHTML = `
            <div class="mb-8 border-b border-white/5 pb-4">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-mono text-antigravity-cyan tracking-widest uppercase">Paso ${index + 1} de ${stepsConfig.length}</span>
                    <div class="flex gap-1">
                        ${stepsConfig.map((_, i) => `
                            <div class="w-8 h-1 rounded-full ${i <= index ? 'bg-antigravity-cyan' : 'bg-white/10'} transition-colors duration-300"></div>
                        `).join('')}
                    </div>
                </div>
                <h2 class="text-3xl font-bold text-white mb-2">${step.title}</h2>
                <p class="text-gray-400 font-light text-lg">${step.subtitle}</p>
            </div>
        `;

        if (step.type === 'package_cards') {
            const packagesHTML = `
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    ${step.packages.map(pkg => {
                        const isSelected = window.wizardState.package?.selected === pkg.id;
                        const colorClasses = {
                            violet: 'border-antigravity-violet/50 hover:border-antigravity-violet bg-antigravity-violet/5',
                            cyan: 'border-antigravity-cyan/50 hover:border-antigravity-cyan bg-antigravity-cyan/5',
                            green: 'border-green-500/50 hover:border-green-500 bg-green-500/5'
                        };
                        const selectedClass = isSelected ? colorClasses[pkg.color] : 'border-white/10 hover:border-white/30';
                        
                        return `
                            <div class="package-card ${selectedClass} border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${isSelected ? 'ring-2 ring-offset-2 ring-offset-black' : ''}" 
                                 onclick="selectPackage('${pkg.id}')"
                                 data-package="${pkg.id}">
                                <div class="text-center mb-4">
                                    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-3">
                                        <i class='bx ${pkg.icon} text-4xl text-${pkg.color === 'violet' ? 'antigravity-violet' : pkg.color === 'cyan' ? 'antigravity-cyan' : 'green-500'}'></i>
                                    </div>
                                    <h3 class="text-lg font-bold text-white mb-2">${pkg.name}</h3>
                                    <div class="text-3xl font-bold text-white">
                                        $${pkg.basePrice} <span class="text-sm text-gray-400">USD</span>
                                    </div>
                                    <p class="text-xs text-gray-500 mt-1">Precio base</p>
                                </div>
                                
                                <div class="mb-4">
                                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Incluye:</p>
                                    <ul class="space-y-1">
                                        ${pkg.included.map(item => `
                                            <li class="flex items-center gap-2 text-sm text-gray-300">
                                                <i class='bx bx-check text-green-400 min-w-[16px]'></i>
                                                <span class="text-left">${item}</span>
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                                
                                ${isSelected ? `
                                    <div class="mt-4 pt-4 border-t border-white/10">
                                        <div class="flex items-center justify-center gap-2 text-green-400">
                                            <i class='bx bx-check-circle text-xl'></i>
                                            <span class="text-sm font-semibold">Seleccionado</span>
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>

                <!-- Global Extras Section -->
                ${step.globalExtras ? `
                    <div class="mb-8">
                        <h3 class="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">
                            <i class='bx bx-plus-circle text-antigravity-cyan mr-2'></i>Extras Opcionales
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${step.globalExtras.map(extra => {
                                const selectedExtras = window.wizardState.package?.extras || [];
                                const isSelected = selectedExtras.includes(extra.id);
                                const currentPkgId = window.wizardState.package?.selected;
                                
                                // Disable "WhatsApp flotante" if Plan Avanzado is selected
                                let isDisabled = false;
                                let disabledText = '';
                                if (currentPkgId === 'avanzado' && extra.id === 'whatsapp_float') {
                                    isDisabled = true;
                                    disabledText = '(Incluido en Plan Avanzado)';
                                }

                                return `
                                    <label class="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/30 cursor-pointer transition-colors ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}">
                                        <div class="flex items-center gap-3">
                                            <input type="checkbox" 
                                                   class="w-5 h-5 rounded border-white/20 bg-black/40 text-antigravity-cyan focus:ring-antigravity-cyan"
                                                   ${isSelected || (isDisabled && currentPkgId === 'avanzado') ? 'checked' : ''}
                                                   ${isDisabled ? 'disabled' : ''}
                                                   onchange="toggleExtra('${extra.id}')">
                                            <div>
                                                <span class="text-sm font-medium text-white">${extra.label}</span>
                                                ${isDisabled ? `<span class="block text-xs text-green-400 font-bold">${disabledText}</span>` : ''}
                                            </div>
                                        </div>
                                        <span class="text-lg font-bold text-antigravity-cyan">$${extra.price}</span>
                                    </label>
                                `;
                            }).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Included All Section -->
                ${step.includedAll ? `
                    <div class="bg-gradient-to-r from-antigravity-violet/10 to-antigravity-cyan/10 rounded-2xl p-6 border border-white/10 mb-8">
                        <h3 class="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <i class='bx bx-gift text-xl text-antigravity-violet'></i>
                            Incluido en todos los planes:
                        </h3>
                        <div class="flex flex-wrap gap-4 md:gap-8 justify-center md:justify-start">
                            ${step.includedAll.map(item => `
                                <div class="flex items-center gap-2">
                                    <i class='bx bx-check-circle text-green-400 text-xl'></i>
                                    <span class="text-gray-200 font-medium">${item}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            `;
            
            stepElement.innerHTML = headerHTML + packagesHTML;
            
            const buttonsHTML = `
                <div class="flex justify-between items-center pt-6 border-t border-white/5">
                    <button onclick="prevStep()" class="px-6 py-3 text-gray-400 hover:text-white font-semibold transition-colors flex items-center gap-2 group">
                        <i class='bx bx-left-arrow-alt text-xl group-hover:-translate-x-1 transition-transform'></i>
                        Cancelar
                    </button>
                    
                    <button onclick="nextStep()" class="btn-glow px-8 py-3 bg-gradient-to-r from-antigravity-violet to-antigravity-cyan text-white font-bold rounded-full shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2 transform hover:scale-105">
                        Siguiente
                        <i class='bx bx-right-arrow-alt text-xl'></i>
                    </button>
                </div>
            `;
            stepElement.innerHTML += buttonsHTML;

        } else if (step.type === 'final_options') {
            // Calculate current total
            const packageData = stepsConfig[0].packages.find(p => p.id === window.wizardState.package.selected);
            let basePrice = packageData ? packageData.basePrice : 0;
            
            // Add extras (GLOBAL)
            if (window.wizardState.package.extras && stepsConfig[0].globalExtras) {
                window.wizardState.package.extras.forEach(extraId => {
                    const extra = stepsConfig[0].globalExtras.find(e => e.id === extraId);
                    // Check if extra is included in package (e.g. advanced + whatsapp_float)
                    const isIncluded = (window.wizardState.package.selected === 'avanzado' && extraId === 'whatsapp_float');
                    
                    if (extra && !isIncluded) basePrice += extra.price;
                });
            }
            
            // Add final options
            let finalOptionsPrice = 0;
            step.options.forEach(option => {
                const selected = window.wizardState.final_options[option.id];
                if (selected) {
                    const choice = option.choices.find(c => c.id === selected);
                    if (choice) finalOptionsPrice += choice.price;
                }
            });
            
            const totalBudget = basePrice + finalOptionsPrice;
            
            const optionsHTML = `
                <div class="space-y-6 mb-8">
                    ${step.options.map(option => {
                        const selectedChoice = window.wizardState.final_options[option.id];
                        return `
                            <div class="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <div class="flex items-center gap-3 mb-4">
                                    <div class="w-12 h-12 rounded-full bg-antigravity-violet/20 flex items-center justify-center">
                                        <i class='bx ${option.icon} text-2xl text-antigravity-violet'></i>
                                    </div>
                                    <h3 class="text-lg font-bold text-white">${option.label}</h3>
                                </div>
                                <div class="space-y-3">
                                    ${option.choices.map(choice => {
                                        const isSelected = selectedChoice === choice.id;
                                        return `
                                            <label class="flex items-center justify-between p-4 rounded-xl border-2 ${isSelected ? 'border-antigravity-cyan bg-antigravity-cyan/10' : 'border-white/10 hover:border-white/30'} cursor-pointer transition-all group">
                                                <div class="flex items-center gap-3">
                                                    <input type="radio" 
                                                           name="${option.id}" 
                                                           value="${choice.id}"
                                                           ${isSelected ? 'checked' : ''}
                                                           onchange="selectFinalOption('${option.id}', '${choice.id}')"
                                                           class="w-5 h-5 text-antigravity-cyan focus:ring-antigravity-cyan">
                                                    <div>
                                                        <div class="text-white font-semibold">${choice.label}</div>
                                                        <div class="text-sm text-gray-400">${choice.description}</div>
                                                    </div>
                                                </div>
                                                <div class="text-xl font-bold ${choice.price > 0 ? 'text-antigravity-cyan' : 'text-green-400'}">
                                                    ${choice.price > 0 ? '+$' + choice.price : 'Gratis'}
                                                </div>
                                            </label>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <!-- Budget Display -->
                <div class="bg-gradient-to-r from-antigravity-violet/20 to-antigravity-cyan/20 rounded-3xl p-8 border-2 border-antigravity-cyan/50 mb-8 text-center">
                    <div class="text-sm text-gray-400 uppercase tracking-wider mb-2">👉 Tu presupuesto base estimado:</div>
                    <div class="text-6xl font-bold text-white mb-2" id="total-budget">$${totalBudget}</div>
                    <div class="text-sm text-gray-400 mb-6">USD</div>
                    
                    <div class="text-sm text-gray-300 bg-black/20 rounded-xl p-4 border border-white/5 space-y-2">
                        <p>🔹 <strong>Pago inicial:</strong> 50% + recepción de contenido.</p>
                        <p>🔹 <strong>Condiciones:</strong> La cotización es fija. En caso de requerir más servicios, por favor contáctanos directamente a nuestro WhatsApp.</p>
                    </div>
                </div>
                
                <!-- WhatsApp Buttons Section -->
                <div class="mb-4">
                    <p class="text-center text-xs text-antigravity-cyan font-bold uppercase tracking-widest mb-4">
                        Enviar mensaje precargado al desarrollador para conocer sus necesidades
                    </p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <button onclick="sendToWhatsApp(true)" class="px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-green-900/20">
                            <i class='bx bxl-whatsapp text-2xl'></i>
                            Afinar detalles por WhatsApp
                        </button>
                        <button onclick="sendToWhatsApp(false)" class="px-6 py-4 bg-antigravity-cyan hover:bg-cyan-400 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-cyan-900/20">
                            <i class='bx bx-chat text-2xl'></i>
                            Conversar sobre mi presupuesto
                        </button>
                    </div>
                </div>

                <!-- Navigation (Back) -->
                <div class="text-center">
                    <button onclick="prevStep()" class="text-gray-400 hover:text-white font-medium transition-colors flex items-center justify-center gap-2 mx-auto group py-2">
                        <i class='bx bx-left-arrow-alt text-xl group-hover:-translate-x-1 transition-transform'></i>
                        Regresar / Cambiar Plan
                    </button>
                </div>
                
                <!-- Disclaimer -->
                <p class="text-xs text-gray-500 text-center italic mt-6">
                    * Al hacer clic, se enviará la información seleccionada para facilitar la atención.
                </p>
            `;
            
            stepElement.innerHTML = headerHTML + optionsHTML;
        }
        
        container.innerHTML = '';
        container.appendChild(stepElement);
    }
    
    // Override selectPackage to sync UI (e.g. disable included extras)
    window.selectPackage = function(packageId) {
        window.wizardState.package.selected = packageId;
        renderStep(currentStepIndex, false);
    };

    // Navigation functions (PrevStep already handles persistence because window.wizardState is global)
    window.prevStep = function() {
        if (currentStepIndex > 0) {
            currentStepIndex--;
            renderStep(currentStepIndex);
        } else {
             if(confirm("¿Quieres cancelar la configuración?")) {
                const container = document.getElementById('configurador-web');
                container.innerHTML = '';
                document.getElementById('start-configurator-btn').classList.remove('hidden');
                document.getElementById('configurator-placeholder')?.classList.remove('hidden');
                currentStepIndex = 0;
            }
        }
    };

    window.nextStep = function() {
        if (validateCurrentStep()) {
            if (currentStepIndex < stepsConfig.length - 1) {
                currentStepIndex++;
                renderStep(currentStepIndex);
            }
        }
    };

    function validateCurrentStep() {
        const step = stepsConfig[currentStepIndex];
        
        if (step.type === 'package_cards') {
            if (!window.wizardState.package.selected) {
                alert('Por favor selecciona un paquete para continuar');
                return false;
            }
            return true;
        }
        return true;
    }

    // Select final option and update budget
    window.selectFinalOption = function(optionId, choiceId) {
        window.wizardState.final_options[optionId] = choiceId;
        
        // Recalculate and update budget display
        const packageData = stepsConfig[0].packages.find(p => p.id === window.wizardState.package.selected);
        let basePrice = packageData ? packageData.basePrice : 0;
        
        // Add extras (GLOBAL)
        if (window.wizardState.package.extras && stepsConfig[0].globalExtras) {
            window.wizardState.package.extras.forEach(extraId => {
                const extra = stepsConfig[0].globalExtras.find(e => e.id === extraId);
                const isIncluded = (window.wizardState.package.selected === 'avanzado' && extraId === 'whatsapp_float');
                
                if (extra && !isIncluded) basePrice += extra.price;
            });
        }
        
        // Add final options
        let finalOptionsPrice = 0;
        const finalStep = stepsConfig[1];
        if (finalStep && finalStep.options) {
            finalStep.options.forEach(option => {
                const selected = window.wizardState.final_options[option.id];
                if (selected) {
                    const choice = option.choices.find(c => c.id === selected);
                    if (choice) finalOptionsPrice += choice.price;
                }
            });
        }
        
        const totalBudget = basePrice + finalOptionsPrice;
        const budgetEl = document.getElementById('total-budget');
        if (budgetEl) {
            budgetEl.textContent = '$' + totalBudget;
        }
    };
    
    // Send to WhatsApp
    window.sendToWhatsApp = function(detailed = true) {
        const step = stepsConfig[1];
        // Validate final options
        for (const opt of step.options) {
             if (!window.wizardState.final_options[opt.id]) {
                  alert(`Por favor selecciona una opción para ${opt.label} antes de continuar.`);
                  return;
             }
        }

        const packageData = stepsConfig[0].packages.find(p => p.id === window.wizardState.package.selected);
        if (!packageData) {
            alert('Por favor selecciona un paquete primero');
            return;
        }
        
        let message = '¡Hola! Me interesa un sitio web:\n\n';
        message += `📦 *Paquete:* ${packageData.name}\n`;
        message += `💰 *Precio base:* $${packageData.basePrice}\n\n`;
        
        // Extras
        if (window.wizardState.package.extras && window.wizardState.package.extras.length > 0) {
            message += '*Extras seleccionados:*\n';
            window.wizardState.package.extras.forEach(extraId => {
                const extra = stepsConfig[0].globalExtras.find(e => e.id === extraId);
                if (extra) {
                    const isIncluded = (window.wizardState.package.selected === 'avanzado' && extraId === 'whatsapp_float');
                    if (isIncluded) {
                         message += `✓ ${extra.label} (Incluido)\n`;
                    } else {
                         message += `✓ ${extra.label} (+$${extra.price})\n`;
                    }
                }
            });
            message += '\n';
        }
        
        // Final options - ALWAYS send details now
        message += '*Opciones finales:*\n';
        if (step && step.options) {
            step.options.forEach(option => {
                const selected = window.wizardState.final_options[option.id];
                if (selected) {
                    const choice = option.choices.find(c => c.id === selected);
                    if (choice) {
                        message += `• ${option.label}: ${choice.label}`;
                        if (choice.price > 0) message += ` (+$${choice.price})`;
                        message += '\n';
                    }
                }
            });
        }
        message += '\n';
        
        // Total
        let total = packageData.basePrice;
        if (window.wizardState.package.extras && stepsConfig[0].globalExtras) {
            window.wizardState.package.extras.forEach(extraId => {
                const extra = stepsConfig[0].globalExtras.find(e => e.id === extraId);
                const isIncluded = (window.wizardState.package.selected === 'avanzado' && extraId === 'whatsapp_float');
                if (extra && !isIncluded) total += extra.price;
            });
        }
        
        if (step && step.options) {
            step.options.forEach(option => {
                const selected = window.wizardState.final_options[option.id];
                if (selected) {
                    const choice = option.choices.find(c => c.id === selected);
                    if (choice) total += choice.price;
                }
            });
        }
        
        message += `*💵 TOTAL ESTIMADO: $${total} USD*\n\n`;
        message += detailed ? 'Me gustaría afinar los detalles.' : 'Me gustaría conversar sobre este presupuesto.';
        message += '\n\n*Condiciones:* Pago inicial 50% + recepción de contenido. Cotización fija.';
        
        const whatsappNumber = '593982650929';
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    };

    // Navigation functions
    window.prevStep = function() {
        if (currentStepIndex > 0) {
            currentStepIndex--;
            renderStep(currentStepIndex);
        } else {
            // Optional: confirm exit or scroll back up
             if(confirm("¿Quieres cancelar la configuración?")) {
                const container = document.getElementById('configurador-web');
                container.innerHTML = '';
                document.getElementById('start-configurator-btn').classList.remove('hidden');
                document.getElementById('configurator-placeholder')?.classList.remove('hidden');
                currentStepIndex = 0;
            }
        }
    };

    window.nextStep = function() {
        if (validateCurrentStep()) {
            if (currentStepIndex < stepsConfig.length - 1) {
                currentStepIndex++;
                renderStep(currentStepIndex);
            }
        }
    };

    function validateCurrentStep() {
        const step = stepsConfig[currentStepIndex];
        
        if (step.type === 'package_cards') {
            if (!window.wizardState.package.selected) {
                alert('Por favor selecciona un paquete para continuar.');
                return false;
            }
            return true;
        } 
        
        return true;
    }

    // Expose start function for consistency
    window.startConfigurator = function() {
        const container = document.getElementById('configurador-web');
        const startBtn = document.getElementById('start-configurator-btn');
        if (container) {
            container.classList.remove('hidden');
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if(startBtn) startBtn.click();
        }
    }
    
    // Select final option and update budget
    window.selectFinalOption = function(optionId, choiceId) {
        window.wizardState.final_options[optionId] = choiceId;
        
        // Recalculate and update budget display
        const packageData = stepsConfig[0].packages.find(p => p.id === window.wizardState.package.selected);
        let basePrice = packageData ? packageData.basePrice : 0;
        
        // Add extras (GLOBAL)
        if (window.wizardState.package.extras && stepsConfig[0].globalExtras) {
            window.wizardState.package.extras.forEach(extraId => {
                const extra = stepsConfig[0].globalExtras.find(e => e.id === extraId);
                const isIncluded = (window.wizardState.package.selected === 'avanzado' && extraId === 'whatsapp_float');
                
                if (extra && !isIncluded) basePrice += extra.price;
            });
        }
        
        // Add final options
        let finalOptionsPrice = 0;
        const finalStep = stepsConfig[1];
        if (finalStep && finalStep.options) {
            finalStep.options.forEach(option => {
                const selected = window.wizardState.final_options[option.id];
                if (selected) {
                    const choice = option.choices.find(c => c.id === selected);
                    if (choice) finalOptionsPrice += choice.price;
                }
            });
        }
        
        const totalBudget = basePrice + finalOptionsPrice;
        const budgetEl = document.getElementById('total-budget');
        if (budgetEl) {
            budgetEl.textContent = '$' + totalBudget;
        }
    };
    
    // Send to WhatsApp
    window.sendToWhatsApp = function(detailed = true) {
        const step = stepsConfig[1];
        // Validate final options
        for (const opt of step.options) {
             if (!window.wizardState.final_options[opt.id]) {
                  alert(`Por favor selecciona una opción para ${opt.label} antes de continuar.`);
                  return;
             }
        }

        const packageData = stepsConfig[0].packages.find(p => p.id === window.wizardState.package.selected);
        if (!packageData) {
            alert('Por favor selecciona un paquete primero');
            return;
        }
        
        let message = '¡Hola! Me interesa un sitio web:\n\n';
        message += `📦 *Paquete:* ${packageData.name}\n`;
        message += `💰 *Precio base:* $${packageData.basePrice}\n\n`;
        
        // Extras
        if (window.wizardState.package.extras && window.wizardState.package.extras.length > 0) {
            message += '*Extras seleccionados:*\n';
            window.wizardState.package.extras.forEach(extraId => {
                const extra = stepsConfig[0].globalExtras.find(e => e.id === extraId);
                if (extra) {
                    const isIncluded = (window.wizardState.package.selected === 'avanzado' && extraId === 'whatsapp_float');
                    if (isIncluded) {
                         message += `✓ ${extra.label} (Incluido)\n`;
                    } else {
                         message += `✓ ${extra.label} (+$${extra.price})\n`;
                    }
                }
            });
            message += '\n';
        }
        
        // Final options
        if (detailed) {
            message += '*Opciones finales:*\n';
            if (step && step.options) {
                step.options.forEach(option => {
                    const selected = window.wizardState.final_options[option.id];
                    if (selected) {
                        const choice = option.choices.find(c => c.id === selected);
                        if (choice) {
                            message += `• ${option.label}: ${choice.label}`;
                            if (choice.price > 0) message += ` (+$${choice.price})`;
                            message += '\n';
                        }
                    }
                });
            }
            message += '\n';
        }
        
        // Total
        let total = packageData.basePrice;
        if (window.wizardState.package.extras && stepsConfig[0].globalExtras) {
            window.wizardState.package.extras.forEach(extraId => {
                const extra = stepsConfig[0].globalExtras.find(e => e.id === extraId);
                const isIncluded = (window.wizardState.package.selected === 'avanzado' && extraId === 'whatsapp_float');
                if (extra && !isIncluded) total += extra.price;
            });
        }
        
        if (step && step.options) {
            step.options.forEach(option => {
                const selected = window.wizardState.final_options[option.id];
                if (selected) {
                    const choice = option.choices.find(c => c.id === selected);
                    if (choice) total += choice.price;
                }
            });
        }
        
        message += `*💵 TOTAL ESTIMADO: $${total} USD*\n\n`;
        message += detailed ? 'Me gustaría afinar los detalles.' : 'Me gustaría conversar sobre este presupuesto.';
        
        const whatsappNumber = '593982650929';
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    };
});
