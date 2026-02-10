// Main JavaScript File
// Handles Navigation, Cart, Smooth Scroll, and Interactions

// WhatsApp Integration
window.sendToWhatsApp = function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value;

    const text = `Hola GuambraWeb, me interesa el servicio de *${service}*.%0A%0A*Mi información:*%0A- Nombre: ${name}%0A- Correo: ${email}%0A%0A*Mensaje:*%0A${message}`;
    
    window.open(`https://wa.me/593982650929?text=${text}`, '_blank');
}

// Modal Logic
window.openModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('active');
         // Also handle Tailwind 'hidden' class if present (from my new component implementation)
        if(modal.classList.contains('hidden')) {
             modal.classList.remove('hidden');
             setTimeout(() => {
                const inner = modal.querySelector('div[class*="transform"]');
                if(inner) {
                    inner.classList.remove('scale-95', 'opacity-0');
                    inner.classList.add('scale-100', 'opacity-100');
                }
             }, 10);
        }
        document.body.style.overflow = 'hidden';
    }
}

window.closeModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) {
        // Animation for Tailwind version
        const inner = modal.querySelector('div[class*="transform"]');
        if(inner) {
             inner.classList.remove('scale-100', 'opacity-100');
             inner.classList.add('scale-95', 'opacity-0');
             setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
             }, 300);
        } else {
            // Fallback for old CSS version
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
}

// Close modal on click outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal') || event.target.id.endsWith('-modal')) {
        // Check if click was on overlay (the modal div itself)
        if(event.target.classList.contains('active') || !event.target.classList.contains('hidden')) {
             // Find ID
             const id = event.target.id;
             closeModal(id);
        }
    }
}

// Cart Logic
// Cart Logic
// Use a more modern notification if possible, or keep simple alert but formatted better
window.addToCart = function(planName, price) {
    const formattedPrice = typeof price === 'number' ? `$${price}` : `$${price}`;
    // Consider replacing with a custom toast notification in future
    alert(`✅ ¡Excelente elección!\n\nHas agregado: ${planName}\nTotal estimado: ${formattedPrice}\n\nTe redirigiremos al checkout pronto (Simulado).`);
    console.log(`Cart Update: ${planName} added. Value: ${price}`);
}

// Mobile Menu Logic
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.getElementById('close-menu-btn');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default behavior
            mobileMenu.classList.remove('translate-x-full');
            document.body.style.overflow = 'hidden';
            console.log('Menu opened');
        });

        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                mobileMenu.classList.add('translate-x-full');
                document.body.style.overflow = '';
                console.log('Menu closed via button');
            });
        }

        // Close on link click
        const links = mobileMenu.querySelectorAll('a, button[onclick*="scrollIntoView"]');
        links.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('translate-x-full');
                document.body.style.overflow = '';
                console.log('Menu closed via link');
            });
        });
    } else {
        console.error('Mobile menu elements not found');
    }

    // Navbar scroll effect
    const navbar = document.querySelector('header#main-nav');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('bg-black/80', 'backdrop-blur-md', 'shadow-lg');
                navbar.classList.remove('bg-transparent');
            } else {
                if (navbar.getAttribute('data-transparent') === 'true') {
                    navbar.classList.remove('bg-black/80', 'backdrop-blur-md', 'shadow-lg');
                    navbar.classList.add('bg-transparent');
                }
            }
        });
    }
});

// Portfolio Scroll Logic
window.scrollPortfolio = function(direction) {
    const container = document.getElementById('portfolio-container');
    if (container) {
        // Scroll width of one card + gap approx, or just half container
        const firstCard = container.querySelector('div');
        if(firstCard) {
            const cardWidth = firstCard.offsetWidth;
            const gap = 24; // gap-6 is 1.5rem = 24px
            const scrollAmount = direction === 'left' ? -(cardWidth + gap) : (cardWidth + gap);
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }
}
