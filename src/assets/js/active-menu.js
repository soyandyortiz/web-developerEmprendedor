document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('#main-nav a[href^="#"]');

    function highlightMenu() {
        let scrollY = window.scrollY;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 150; // Offset for header height
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('text-antigravity-cyan', 'active-link'); // Remove active classes
                    if (link.getAttribute('href').includes(sectionId)) {
                        link.classList.add('text-antigravity-cyan', 'active-link'); // Add active class
                    }
                });
            }
        });
    }

    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', highlightMenu);
    }
});
