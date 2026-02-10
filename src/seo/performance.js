/**
 * Optimización de Performance para SEO
 * GuambraWeb - Core Web Vitals y velocidad de carga
 */

/**
 * Configuración de performance
 */
export const performanceConfig = {
  // Umbrales de Core Web Vitals
  thresholds: {
    LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
    FID: { good: 100, needsImprovement: 300 },   // First Input Delay
    CLS: { good: 0.1, needsImprovement: 0.25 },  // Cumulative Layout Shift
    FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint
    TTFB: { good: 800, needsImprovement: 1800 }  // Time to First Byte
  },

  // Recursos a precargar
  criticalResources: [
    { href: '/src/styles/global.css', as: 'style' },
    { href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;900&display=swap', as: 'style' }
  ],

  // Recursos a preconectar
  preconnectDomains: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://cdn.tailwindcss.com'
  ]
};

/**
 * Mide Core Web Vitals
 */
export function measureCoreWebVitals() {
  const metrics = {
    LCP: null,
    FID: null,
    CLS: null,
    FCP: null,
    TTFB: null
  };

  // Verificar soporte de PerformanceObserver
  if (!('PerformanceObserver' in window)) {
    console.warn('PerformanceObserver no está disponible');
    return metrics;
  }

  // Largest Contentful Paint (LCP)
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      metrics.LCP = lastEntry.renderTime || lastEntry.loadTime;
      
      logMetric('LCP', metrics.LCP, performanceConfig.thresholds.LCP);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    console.warn('No se pudo medir LCP:', e);
  }

  // First Input Delay (FID)
  try {
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        metrics.FID = entry.processingStart - entry.startTime;
        logMetric('FID', metrics.FID, performanceConfig.thresholds.FID);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
  } catch (e) {
    console.warn('No se pudo medir FID:', e);
  }

  // Cumulative Layout Shift (CLS)
  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          metrics.CLS = clsValue;
        }
      }
      logMetric('CLS', metrics.CLS, performanceConfig.thresholds.CLS);
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    console.warn('No se pudo medir CLS:', e);
  }

  // First Contentful Paint (FCP)
  try {
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          metrics.FCP = entry.startTime;
          logMetric('FCP', metrics.FCP, performanceConfig.thresholds.FCP);
        }
      });
    });
    fcpObserver.observe({ entryTypes: ['paint'] });
  } catch (e) {
    console.warn('No se pudo medir FCP:', e);
  }

  // Time to First Byte (TTFB)
  try {
    const navigationEntry = performance.getEntriesByType('navigation')[0];
    if (navigationEntry) {
      metrics.TTFB = navigationEntry.responseStart - navigationEntry.requestStart;
      logMetric('TTFB', metrics.TTFB, performanceConfig.thresholds.TTFB);
    }
  } catch (e) {
    console.warn('No se pudo medir TTFB:', e);
  }

  return metrics;
}

/**
 * Registra una métrica con su evaluación
 */
function logMetric(name, value, thresholds) {
  if (value === null || value === undefined) return;

  let status = '🔴 Pobre';
  if (value <= thresholds.good) {
    status = '🟢 Bueno';
  } else if (value <= thresholds.needsImprovement) {
    status = '🟡 Necesita mejora';
  }

  const unit = name === 'CLS' ? '' : 'ms';
  console.log(`${name}: ${value.toFixed(2)}${unit} - ${status}`);
}

/**
 * Optimiza recursos críticos
 */
export function optimizeCriticalResources() {
  // Precargar recursos críticos
  performanceConfig.criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    if (resource.type) link.type = resource.type;
    if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
    document.head.appendChild(link);
  });

  // Preconectar a dominios externos
  performanceConfig.preconnectDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  console.log('✓ Recursos críticos optimizados');
}

/**
 * Optimiza fuentes web
 */
export function optimizeFonts() {
  // Añadir font-display: swap a las fuentes
  const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
  fontLinks.forEach(link => {
    if (!link.href.includes('display=')) {
      link.href += link.href.includes('?') ? '&display=swap' : '?display=swap';
    }
  });

  console.log('✓ Fuentes optimizadas con font-display: swap');
}

/**
 * Implementa resource hints
 */
export function implementResourceHints() {
  // DNS Prefetch para dominios de terceros
  const dnsPrefetchDomains = [
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com'
  ];

  dnsPrefetchDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });

  console.log('✓ Resource hints implementados');
}

/**
 * Reduce el impacto de JavaScript de terceros
 */
export function optimizeThirdPartyScripts() {
  // Cargar scripts de terceros de forma asíncrona
  const thirdPartyScripts = document.querySelectorAll('script[src*="cdn"], script[src*="analytics"]');
  
  thirdPartyScripts.forEach(script => {
    if (!script.hasAttribute('async') && !script.hasAttribute('defer')) {
      script.setAttribute('defer', '');
    }
  });

  console.log('✓ Scripts de terceros optimizados');
}

/**
 * Implementa estrategia de caché
 */
export function implementCacheStrategy() {
  // Service Worker para caché (básico)
  if ('serviceWorker' in navigator) {
    // Solo registrar en producción
    if (window.location.hostname !== 'localhost') {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('✓ Service Worker registrado:', registration);
        })
        .catch(error => {
          console.warn('Error al registrar Service Worker:', error);
        });
    }
  }
}

/**
 * Reduce el tamaño del DOM
 */
export function analyzeDOMSize() {
  const domSize = document.querySelectorAll('*').length;
  const domDepth = getMaxDOMDepth(document.body);

  console.log(`📊 Tamaño del DOM: ${domSize} elementos`);
  console.log(`📊 Profundidad del DOM: ${domDepth} niveles`);

  if (domSize > 1500) {
    console.warn('⚠️ El DOM tiene más de 1500 elementos. Considera simplificar la estructura.');
  }

  if (domDepth > 32) {
    console.warn('⚠️ El DOM tiene más de 32 niveles de profundidad. Considera aplanar la estructura.');
  }

  return { size: domSize, depth: domDepth };
}

/**
 * Calcula la profundidad máxima del DOM
 */
function getMaxDOMDepth(element, depth = 0) {
  if (!element.children || element.children.length === 0) {
    return depth;
  }

  let maxDepth = depth;
  for (const child of element.children) {
    const childDepth = getMaxDOMDepth(child, depth + 1);
    maxDepth = Math.max(maxDepth, childDepth);
  }

  return maxDepth;
}

/**
 * Genera reporte completo de performance
 */
export function generatePerformanceReport() {
  console.log('\n⚡ REPORTE DE PERFORMANCE');
  console.log('═══════════════════════════════════════\n');

  // Medir Core Web Vitals
  console.log('📊 Core Web Vitals:');
  const metrics = measureCoreWebVitals();

  // Analizar tamaño del DOM
  console.log('\n🏗️ Estructura del DOM:');
  analyzeDOMSize();

  // Analizar recursos cargados
  console.log('\n📦 Recursos Cargados:');
  analyzeLoadedResources();

  console.log('\n═══════════════════════════════════════\n');

  return metrics;
}

/**
 * Analiza recursos cargados
 */
function analyzeLoadedResources() {
  const resources = performance.getEntriesByType('resource');
  
  const resourceTypes = {
    script: [],
    stylesheet: [],
    image: [],
    font: [],
    other: []
  };

  resources.forEach(resource => {
    const type = resource.initiatorType;
    const size = resource.transferSize || 0;
    const duration = resource.duration;

    const info = {
      name: resource.name.split('/').pop(),
      size: (size / 1024).toFixed(2) + ' KB',
      duration: duration.toFixed(2) + ' ms'
    };

    if (type === 'script') resourceTypes.script.push(info);
    else if (type === 'css' || type === 'link') resourceTypes.stylesheet.push(info);
    else if (type === 'img') resourceTypes.image.push(info);
    else if (resource.name.includes('font')) resourceTypes.font.push(info);
    else resourceTypes.other.push(info);
  });

  console.log(`   Scripts: ${resourceTypes.script.length}`);
  console.log(`   Hojas de estilo: ${resourceTypes.stylesheet.length}`);
  console.log(`   Imágenes: ${resourceTypes.image.length}`);
  console.log(`   Fuentes: ${resourceTypes.font.length}`);
  console.log(`   Otros: ${resourceTypes.other.length}`);

  // Calcular tamaño total
  const totalSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
  console.log(`\n   Tamaño total: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
}

/**
 * Inicializa todas las optimizaciones de performance
 */
export function initPerformanceOptimizations() {
  console.log('🚀 Inicializando optimizaciones de performance...\n');

  optimizeCriticalResources();
  optimizeFonts();
  implementResourceHints();
  optimizeThirdPartyScripts();
  implementCacheStrategy();

  // Medir performance después de la carga
  window.addEventListener('load', () => {
    setTimeout(() => {
      generatePerformanceReport();
    }, 2000);
  });

  console.log('✓ Optimizaciones de performance inicializadas\n');
}

// Exportar función global para uso en consola
if (typeof window !== 'undefined') {
  window.checkPerformance = generatePerformanceReport;
}

// Auto-inicializar en desarrollo
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  initPerformanceOptimizations();
}
