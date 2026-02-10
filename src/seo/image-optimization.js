/**
 * Sistema de Optimización de Imágenes para SEO
 * GuambraWeb - Lazy Loading, WebP, y Alt Tags automáticos
 */

/**
 * Configuración de optimización de imágenes
 */
export const imageConfig = {
  // Lazy loading offset (cuántos px antes de que la imagen entre en viewport)
  lazyLoadOffset: 200,
  
  // Calidad de compresión para WebP
  webpQuality: 80,
  
  // Tamaños responsive predefinidos
  breakpoints: {
    mobile: 480,
    tablet: 768,
    desktop: 1200,
    wide: 1920
  },

  // Alt tags por defecto según contexto
  defaultAlts: {
    portfolio: 'Proyecto de desarrollo web realizado por GuambraWeb en Riobamba',
    service: 'Servicio de desarrollo web en Riobamba, Ecuador',
    team: 'Equipo de desarrollo de GuambraWeb',
    testimonial: 'Cliente satisfecho de GuambraWeb',
    logo: 'GuambraWeb - Desarrollo Web en Riobamba'
  }
};

/**
 * Inicializa el lazy loading para todas las imágenes
 */
export function initLazyLoading() {
  // Verificar soporte nativo de lazy loading
  if ('loading' in HTMLImageElement.prototype) {
    // Usar lazy loading nativo
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      img.src = img.dataset.src;
      img.loading = 'lazy';
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
      }
    });
  } else {
    // Fallback: Intersection Observer
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            loadImage(img);
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: `${imageConfig.lazyLoadOffset}px`
      }
    );

    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => imageObserver.observe(img));
  }
}

/**
 * Carga una imagen lazy
 * @param {HTMLImageElement} img - Elemento de imagen
 */
function loadImage(img) {
  const src = img.dataset.src;
  const srcset = img.dataset.srcset;

  if (!src) return;

  // Crear una nueva imagen para precargar
  const tempImg = new Image();
  
  tempImg.onload = () => {
    img.src = src;
    if (srcset) {
      img.srcset = srcset;
    }
    img.classList.add('loaded');
    img.removeAttribute('data-src');
    img.removeAttribute('data-srcset');
  };

  tempImg.onerror = () => {
    console.error(`Error loading image: ${src}`);
    img.classList.add('error');
  };

  tempImg.src = src;
}

/**
 * Genera alt tags descriptivos automáticamente
 * @param {string} context - Contexto de la imagen (portfolio, service, etc.)
 * @param {string} customText - Texto personalizado opcional
 * @returns {string} Alt tag optimizado para SEO
 */
export function generateAltTag(context, customText = '') {
  const baseAlt = imageConfig.defaultAlts[context] || 'Imagen de GuambraWeb';
  
  if (customText) {
    return `${customText} - ${baseAlt}`;
  }
  
  return baseAlt;
}

/**
 * Valida y corrige todos los alt tags en la página
 */
export function validateAltTags() {
  const images = document.querySelectorAll('img');
  let missingAlt = 0;

  images.forEach((img, index) => {
    if (!img.alt || img.alt.trim() === '') {
      // Intentar inferir contexto de la imagen
      const context = inferImageContext(img);
      const altTag = generateAltTag(context, `Imagen ${index + 1}`);
      
      img.alt = altTag;
      missingAlt++;
      
      console.warn(`Alt tag añadido automáticamente: ${altTag}`);
    }
  });

  if (missingAlt > 0) {
    console.log(`✓ ${missingAlt} alt tags corregidos automáticamente`);
  } else {
    console.log('✓ Todos los alt tags están correctos');
  }
}

/**
 * Infiere el contexto de una imagen basándose en su ubicación
 * @param {HTMLImageElement} img - Elemento de imagen
 * @returns {string} Contexto inferido
 */
function inferImageContext(img) {
  const parent = img.closest('[id], [class]');
  if (!parent) return 'default';

  const id = parent.id || '';
  const classes = parent.className || '';
  const combined = (id + ' ' + classes).toLowerCase();

  if (combined.includes('portfolio') || combined.includes('proyecto')) return 'portfolio';
  if (combined.includes('servicio') || combined.includes('service')) return 'service';
  if (combined.includes('equipo') || combined.includes('team')) return 'team';
  if (combined.includes('testimonio') || combined.includes('testimonial')) return 'testimonial';
  if (combined.includes('logo')) return 'logo';

  return 'default';
}

/**
 * Genera srcset responsive para una imagen
 * @param {string} basePath - Ruta base de la imagen
 * @param {string} filename - Nombre del archivo
 * @param {string} extension - Extensión del archivo
 * @returns {string} Atributo srcset
 */
export function generateSrcset(basePath, filename, extension) {
  const { mobile, tablet, desktop, wide } = imageConfig.breakpoints;
  
  return `
    ${basePath}/${filename}-${mobile}w.${extension} ${mobile}w,
    ${basePath}/${filename}-${tablet}w.${extension} ${tablet}w,
    ${basePath}/${filename}-${desktop}w.${extension} ${desktop}w,
    ${basePath}/${filename}-${wide}w.${extension} ${wide}w
  `.trim();
}

/**
 * Detecta soporte de WebP
 * @returns {Promise<boolean>}
 */
export async function supportsWebP() {
  if (!self.createImageBitmap) return false;

  const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  const blob = await fetch(webpData).then(r => r.blob());
  
  return createImageBitmap(blob).then(() => true, () => false);
}

/**
 * Añade soporte de WebP con fallback
 */
export async function initWebPSupport() {
  const hasWebP = await supportsWebP();
  
  if (hasWebP) {
    document.documentElement.classList.add('webp');
  } else {
    document.documentElement.classList.add('no-webp');
  }

  // Reemplazar imágenes con versión WebP si está disponible
  if (hasWebP) {
    const images = document.querySelectorAll('img[data-webp]');
    images.forEach(img => {
      const webpSrc = img.dataset.webp;
      if (webpSrc) {
        img.src = webpSrc;
      }
    });
  }
}

/**
 * Optimiza el rendimiento de carga de imágenes
 */
export function optimizeImageLoading() {
  // Priorizar imágenes above-the-fold
  const aboveFoldImages = document.querySelectorAll('img[data-priority="high"]');
  aboveFoldImages.forEach(img => {
    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
    // Añadir fetchpriority para navegadores modernos
    img.setAttribute('fetchpriority', 'high');
  });

  // Inicializar lazy loading para el resto
  initLazyLoading();

  // Validar alt tags
  validateAltTags();

  // Inicializar soporte WebP
  initWebPSupport();
}

/**
 * Preconectar a dominios de imágenes externas
 */
export function preconnectImageDomains() {
  const domains = [
    'https://images.unsplash.com',
    'https://cdn.guambraweb.com'
  ];

  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

// Inicializar automáticamente cuando el DOM esté listo
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', optimizeImageLoading);
  } else {
    optimizeImageLoading();
  }
}
