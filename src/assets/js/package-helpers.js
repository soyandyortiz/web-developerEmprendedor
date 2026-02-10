// Package selection functions for web configurator

// Initialize package state if not exists
if (!window.wizardState) {
    window.wizardState = { package: { selected: null, extras: [] } };
} else if (!window.wizardState.package) {
    window.wizardState.package = { selected: null, extras: [] };
}

// Select a package
window.selectPackage = function(packageId) {
    // Update state
    window.wizardState.package.selected = packageId;
    
    // Update UI - remove selection from all cards
    document.querySelectorAll('.package-card').forEach(card => {
        card.classList.remove('ring-2', 'ring-offset-2', 'ring-offset-black');
        card.classList.remove('border-antigravity-violet/50', 'hover:border-antigravity-violet', 'bg-antigravity-violet/5');
        card.classList.remove('border-antigravity-cyan/50', 'hover:border-antigravity-cyan', 'bg-antigravity-cyan/5');
        card.classList.remove('border-green-500/50', 'hover:border-green-500', 'bg-green-500/5');
        card.classList.add('border-white/10', 'hover:border-white/30');
    });
    
    // Add selection to clicked card
    const selectedCard = document.querySelector(`[data-package="${packageId}"]`);
    if (selectedCard) {
        selectedCard.classList.remove('border-white/10', 'hover:border-white/30');
        
        // Determine color based on package
        if (packageId === 'fotografos') {
            selectedCard.classList.add('border-antigravity-violet/50', 'hover:border-antigravity-violet', 'bg-antigravity-violet/5');
        } else if (packageId === 'servicios') {
            selectedCard.classList.add('border-antigravity-cyan/50', 'hover:border-antigravity-cyan', 'bg-antigravity-cyan/5');
        } else if (packageId === 'comercio') {
            selectedCard.classList.add('border-green-500/50', 'hover:border-green-500', 'bg-green-500/5');
        }
        
        selectedCard.classList.add('ring-2', 'ring-offset-2', 'ring-offset-black');
    }
    
    console.log('Package selected:', packageId, window.wizardState.package);
};

// Toggle extra feature
// Toggle extra feature
window.toggleExtra = function(extraId) {
    if (!window.wizardState.package.extras) {
        window.wizardState.package.extras = [];
    }
    
    const index = window.wizardState.package.extras.indexOf(extraId);
    if (index > -1) {
        // Remove extra
        window.wizardState.package.extras.splice(index, 1);
    } else {
        // Add extra
        window.wizardState.package.extras.push(extraId);
    }
    
    console.log('Extras updated:', window.wizardState.package.extras);
};
