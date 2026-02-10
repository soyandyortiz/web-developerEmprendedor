/**
 * Sistema SEO Principal - GuambraWeb
 * Integra todos los módulos de optimización SEO
 */

import { seoConfig, generateMetaTags, updateMetaTags } from './meta-tags.js';
import { optimizeImageLoading, validateAltTags, preconnectImageDomains } from './image-optimization.js';
import { generateSEOReport, autoFixSemanticIssues, extractContentOutline } from './semantic-validator.js';
import { initPerformanceOptimizations, generatePerformanceReport } from './performance.js';

/**
 * Clase principal del sistema SEO
 */
class SEOManager {
  constructor() {
    this.initialized = false;
    this.currentPage = this.detectCurrentPage();
    this.reports = {
      semantic: null,
      performance: null,
      images: null
    };
  }

  /**
   * Detecta la página actual
   */
  detectCurrentPage() {
    const path = window.location.pathname;
    
    if (path.includes('desarrollo-web-riobamba')) return 'desarrolloWeb';
    if (path.includes('apps-a-medida')) return 'appsAMedida';
    if (path.includes('personalizador')) return 'personalizador';
    
    return 'home';
  }

  /**
   * Inicializa el sistema SEO completo
   */
  async init() {
    if (this.initialized) {
      console.warn('SEO Manager ya está inicializado');
      return;
    }

    console.log('🚀 Inicializando Sistema SEO de GuambraWeb...\n');

    try {
      // 1. Optimizar metaetiquetas
      this.updatePageMeta();

      // 2. Optimizar imágenes
      this.optimizeImages();

      // 3. Validar estructura semántica
      this.validateStructure();

      // 4. Optimizar performance
      this.optimizePerformance();

      // 5. Añadir datos estructurados adicionales
      this.addStructuredData();

      // 6. Configurar monitoreo
      this.setupMonitoring();

      this.initialized = true;
      console.log('✅ Sistema SEO inicializado correctamente\n');

      // Generar reporte inicial en desarrollo
      if (this.isDevelopment()) {
        setTimeout(() => this.generateFullReport(), 2000);
      }

    } catch (error) {
      console.error('❌ Error al inicializar SEO Manager:', error);
    }
  }

  /**
   * Actualiza las metaetiquetas de la página
   */
  updatePageMeta() {
    console.log('📝 Actualizando metaetiquetas...');
    updateMetaTags(this.currentPage);
    console.log('✓ Metaetiquetas actualizadas\n');
  }

  /**
   * Optimiza todas las imágenes
   */
  optimizeImages() {
    console.log('🖼️ Optimizando imágenes...');
    optimizeImageLoading();
    preconnectImageDomains();
    console.log('✓ Imágenes optimizadas\n');
  }

  /**
   * Valida la estructura semántica
   */
  validateStructure() {
    console.log('🏗️ Validando estructura semántica...');
    
    // Validar y corregir automáticamente
    const fixes = autoFixSemanticIssues();
    
    // Generar reporte
    this.reports.semantic = generateSEOReport();
    
    console.log('✓ Estructura validada\n');
  }

  /**
   * Optimiza el rendimiento
   */
  optimizePerformance() {
    console.log('⚡ Optimizando rendimiento...');
    initPerformanceOptimizations();
    console.log('✓ Rendimiento optimizado\n');
  }

  /**
   * Añade datos estructurados adicionales
   */
  addStructuredData() {
    console.log('📊 Añadiendo datos estructurados...');

    // BreadcrumbList
    this.addBreadcrumbs();

    // WebSite con SearchAction
    this.addWebsiteSchema();

    // Organization
    this.addOrganizationSchema();

    console.log('✓ Datos estructurados añadidos\n');
  }

  /**
   * Añade breadcrumbs estructurados
   */
  addBreadcrumbs() {
    const breadcrumbs = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: []
    };

    const path = window.location.pathname;
    const parts = path.split('/').filter(p => p);

    breadcrumbs.itemListElement.push({
      '@type': 'ListItem',
      position: 1,
      name: 'Inicio',
      item: seoConfig.siteUrl
    });

    parts.forEach((part, index) => {
      const name = this.formatBreadcrumbName(part);
      const url = seoConfig.siteUrl + '/' + parts.slice(0, index + 1).join('/');
      
      breadcrumbs.itemListElement.push({
        '@type': 'ListItem',
        position: index + 2,
        name: name,
        item: url
      });
    });

    if (breadcrumbs.itemListElement.length > 1) {
      this.injectSchema(breadcrumbs, 'breadcrumbs');
    }
  }

  /**
   * Añade schema de WebSite con SearchAction
   */
  addWebsiteSchema() {
    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: seoConfig.siteName,
      url: seoConfig.siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${seoConfig.siteUrl}/buscar?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    };

    this.injectSchema(websiteSchema, 'website');
  }

  /**
   * Añade schema de Organization
   */
  addOrganizationSchema() {
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: seoConfig.siteName,
      url: seoConfig.siteUrl,
      logo: `${seoConfig.siteUrl}/assets/logotipo.png`,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+593-98-265-0929',
        contactType: 'customer service',
        areaServed: 'EC',
        availableLanguage: ['Spanish']
      },
      sameAs: [
        'https://www.facebook.com/guambraweb',
        'https://www.instagram.com/guambraweb',
        'https://twitter.com/guambraweb'
      ]
    };

    this.injectSchema(organizationSchema, 'organization');
  }

  /**
   * Inyecta un schema en el head
   */
  injectSchema(schema, id) {
    const existingScript = document.getElementById(`schema-${id}`);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = `schema-${id}`;
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
  }

  /**
   * Formatea el nombre del breadcrumb
   */
  formatBreadcrumbName(slug) {
    const names = {
      'desarrollo-web-riobamba': 'Desarrollo Web',
      'apps-a-medida': 'Aplicaciones a Medida',
      'personalizador': 'Cotizador'
    };

    return names[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Configura monitoreo de métricas
   */
  setupMonitoring() {
    // Monitorear cambios de visibilidad
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.trackPageView();
      }
    });

    // Monitorear errores de carga de recursos
    window.addEventListener('error', (e) => {
      if (e.target.tagName === 'IMG') {
        console.error('Error cargando imagen:', e.target.src);
      }
    }, true);
  }

  /**
   * Registra una vista de página
   */
  trackPageView() {
    // Aquí se puede integrar con Google Analytics, etc.
    console.log('📊 Página vista:', this.currentPage);
  }

  /**
   * Genera un reporte completo de SEO
   */
  async generateFullReport() {
    console.log('\n' + '='.repeat(50));
    console.log('📋 REPORTE COMPLETO DE SEO - GUAMBRAWEB');
    console.log('='.repeat(50) + '\n');

    console.log(`📄 Página actual: ${this.currentPage}`);
    console.log(`🌐 URL: ${window.location.href}`);
    console.log(`📅 Fecha: ${new Date().toLocaleString('es-EC')}\n`);

    // Reporte semántico
    console.log('━'.repeat(50));
    this.reports.semantic = generateSEOReport();

    // Reporte de performance
    console.log('━'.repeat(50));
    this.reports.performance = generatePerformanceReport();

    // Reporte de imágenes
    console.log('━'.repeat(50));
    console.log('\n🖼️ IMÁGENES:');
    validateAltTags();

    // Estructura de contenido
    console.log('\n━'.repeat(50));
    extractContentOutline();

    console.log('\n' + '='.repeat(50));
    console.log('✅ Reporte completado');
    console.log('='.repeat(50) + '\n');

    return this.reports;
  }

  /**
   * Verifica si está en desarrollo
   */
  isDevelopment() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1';
  }

  /**
   * Obtiene el score SEO general
   */
  getSEOScore() {
    let score = 100;
    const deductions = [];

    // Verificar H1
    const h1Count = document.querySelectorAll('h1').length;
    if (h1Count === 0) {
      score -= 20;
      deductions.push('Sin H1 (-20)');
    } else if (h1Count > 1) {
      score -= 10;
      deductions.push('Múltiples H1 (-10)');
    }

    // Verificar meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc || metaDesc.content.length < 120) {
      score -= 15;
      deductions.push('Meta description insuficiente (-15)');
    }

    // Verificar imágenes sin alt
    const imagesWithoutAlt = Array.from(document.querySelectorAll('img'))
      .filter(img => !img.alt || img.alt.trim() === '').length;
    if (imagesWithoutAlt > 0) {
      score -= Math.min(imagesWithoutAlt * 5, 20);
      deductions.push(`${imagesWithoutAlt} imágenes sin alt (-${Math.min(imagesWithoutAlt * 5, 20)})`);
    }

    // Verificar canonical
    const canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      score -= 10;
      deductions.push('Sin canonical (-10)');
    }

    // Verificar structured data
    const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
    if (structuredData.length === 0) {
      score -= 15;
      deductions.push('Sin datos estructurados (-15)');
    }

    console.log('\n📊 SEO SCORE:', score, '/100');
    if (deductions.length > 0) {
      console.log('\nDeducciones:');
      deductions.forEach(d => console.log(`  - ${d}`));
    }

    return { score, deductions };
  }
}

// Crear instancia global
const seoManager = new SEOManager();

// Exportar instancia y funciones útiles
export default seoManager;
export { seoManager, SEOManager };

// Inicializar automáticamente cuando el DOM esté listo
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => seoManager.init());
  } else {
    seoManager.init();
  }

  // Exportar funciones globales para debugging
  window.seoManager = seoManager;
  window.getSEOScore = () => seoManager.getSEOScore();
  window.getSEOReport = () => seoManager.generateFullReport();
}
