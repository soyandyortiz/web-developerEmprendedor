document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.wizard-step');
    const nextBtns = document.querySelectorAll('.next-step');
    const prevBtns = document.querySelectorAll('.prev-step');
    const progressFill = document.getElementById('progress-fill');
    const currentStepNum = document.getElementById('current-step-num');
    
    let currentStep = 0;

    // Initial Setup
    updateStepVisibility(0);

    // Next Buttons
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    updateStepVisibility(currentStep);
                }
            } else {
                // Optional: Shake effect or error message
                alert("Por favor completa los campos requeridos.");
            }
        });
    });

    // Prev Buttons
    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateStepVisibility(currentStep);
            }
        });
    });

    function updateStepVisibility(index) {
        steps.forEach((step, i) => {
            if (i === index) {
                step.classList.remove('hidden');
                // Small delay to allow 'hidden' removal to register before opacity transition
                setTimeout(() => {
                    step.classList.remove('opacity-0', 'translate-x-8');
                    step.classList.add('opacity-100', 'translate-x-0');
                }, 10);
            } else {
                step.classList.add('opacity-0', 'translate-x-8');
                setTimeout(() => {
                    step.classList.add('hidden');
                    step.classList.remove('opacity-100', 'translate-x-0');
                }, 300); // Wait for transition out
            }
        });

        // Update Progress
        if (progressFill) {
            const percent = ((index + 1) / steps.length) * 100;
            progressFill.style.width = `${percent}%`;
        }
        
        // Update Step Number Indicator
        if (currentStepNum) {
            currentStepNum.textContent = index + 1;
        }
    }

    function validateStep(stepIndex) {
        const currentStepEl = steps[stepIndex];
        const requiredInputs = currentStepEl.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('border-red-500');
            } else {
                input.classList.remove('border-red-500');
            }
        });
        
        return isValid;
    }

    // Dashboard Toggle Logic
    const dashboardCheck = document.getElementById('dashboard-check');
    const metricsContainer = document.getElementById('metrics-container');
    
    if (dashboardCheck && metricsContainer) {
        dashboardCheck.addEventListener('change', (e) => {
            if (e.target.checked) {
                metricsContainer.classList.remove('max-h-0', 'opacity-0');
                metricsContainer.classList.add('max-h-[500px]', 'opacity-100', 'mt-6');
            } else {
                metricsContainer.classList.remove('max-h-[500px]', 'opacity-100', 'mt-6');
                metricsContainer.classList.add('max-h-0', 'opacity-0');
            }
        });
    }

    // Interactive Selection for Cards (Modules)
    const selectableCards = document.querySelectorAll('.selectable-card');
    selectableCards.forEach(card => {
        card.addEventListener('click', () => {
            const checkbox = card.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            
            if (checkbox.checked) {
                card.classList.add('border-antigravity-cyan', 'bg-antigravity-cyan/10');
                card.classList.remove('border-white/10', 'bg-white/5');
            } else {
                card.classList.remove('border-antigravity-cyan', 'bg-antigravity-cyan/10');
                card.classList.add('border-white/10', 'bg-white/5');
            }
        });
    });
    // Final Step Logic
    const finishBtn = document.querySelector('.finish-step'); // We'll add this class to the button
    
    // Helper to collect data
    function getFormData() {
        const form = document.getElementById('app-wizard-form');
        const formData = new FormData(form);
        
        // Basic Info
        const businessName = formData.get('business_name') || 'No especificado';
        const businessType = formData.get('business_type') || 'No especificado';
        const city = formData.get('city') || 'Riobamba, Ecuador';
        const problemDesc = formData.get('problem_desc') || 'No especificado';
        const contactName = formData.get('contact_name') || 'No especificado';
        const contactEmail = formData.get('contact_email') || 'No especificado';

        // Dashboard Metrics
        const dashboardRequested = document.getElementById('dashboard-check').checked;
        let metrics = [];
        if (dashboardRequested) {
            const metricChecks = document.querySelectorAll('#metrics-container input[type="checkbox"]:checked');
            metricChecks.forEach(check => {
                const label = check.nextElementSibling.textContent.trim();
                metrics.push(label);
            });
            const otherMetric = document.querySelector('#metrics-container input[type="text"]')?.value;
            if (otherMetric) metrics.push(otherMetric);
        }

        // Modules
        let modules = [];
        const moduleChecks = document.querySelectorAll('.selectable-card input[type="checkbox"]:checked');
        moduleChecks.forEach(check => {
             // Find the label span inside the card
             const card = check.closest('.selectable-card');
             const label = card.querySelector('span').textContent.trim();
             modules.push(label);
        });
        const otherModule = document.querySelector('.wizard-step[data-step="3"] input[type="text"]')?.value;
        if(otherModule) modules.push(otherModule);

        // Construct Text
        return `SOLICITUD DE APLICACIÓN WEB A MEDIDA
----------------------------------------
CONTACTO:
Nombre Encargado: ${contactName}
Email: ${contactEmail}

DATOS DEL NEGOCIO:
Ciudad: ${city}
Nombre del negocio: ${businessName}
Tipo de negocio: ${businessType}
Problema a resolver: ${problemDesc}

DASHBOARD SOLICITADO:
${dashboardRequested ? (metrics.length > 0 ? metrics.map(m => `- ${m}`).join('\n') : 'Sí, con métricas estándar') : 'No solicitado'}

MÓDULOS REQUERIDOS:
${modules.length > 0 ? modules.map(m => `- ${m}`).join('\n') : 'Ninguno seleccionado'}

OBSERVACIONES ADICIONALES:
${otherModule || 'Ninguna'}
`;
    }

    window.downloadRequirements = function() {
        const text = getFormData();
        const blob = new Blob([text], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Requisitos_App_GuambraWeb.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    window.copyToClipboard = function() {
        const text = getFormData();
        navigator.clipboard.writeText(text).then(() => {
            alert("¡Copiado! Ahora puedes pegarlo en tu correo o mensaje.");
        }).catch(err => {
            console.error('Error al copiar: ', err);
            alert("No se pudo copiar automáticamente. Por favor inténtalo manualmente descargando el archivo.");
        });
    }

    window.sendToWhatsAppApp = function() {
        const text = getFormData();
        const encodedText = encodeURIComponent(text);
        const phoneNumber = "593982650929"; 
        const url = `https://wa.me/${phoneNumber}?text=${encodedText}`;
        window.open(url, '_blank');
    }

    window.startAppWizard = function() {
        const section = document.getElementById('app-wizard-section');
        if (section) {
            section.classList.remove('hidden');
            // Allow browser to render removal of hidden before animating/scrolling
            setTimeout(() => {
                 section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
        }
    }
});
