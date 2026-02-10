/**
 * Validador de Estructura Semántica HTML para SEO
 * GuambraWeb - Verifica H1, H2, H3 y estructura correcta
 */

/**
 * Configuración de validación semántica
 */
export const semanticConfig = {
  // Reglas de estructura de headings
  headingRules: {
    h1: {
      max: 1,
      required: true,
      message: 'Debe haber exactamente un H1 por página'
    },
    h2: {
      min: 2,
      message: 'Se recomienda al menos 2 H2 por página'
    },
    h3: {
      min: 0,
      message: 'Los H3 deben estar dentro de secciones H2'
    }
  },

  // Elementos semánticos requeridos
  requiredSemanticElements: [
    'header',
    'main',
    'footer',
    'nav'
  ],

  // Atributos ARIA recomendados
  ariaRecommendations: {
    nav: 'navigation',
    aside: 'complementary',
    form: 'form',
    search: 'search'
  }
};

/**
 * Valida la estructura de headings de la página
 * @returns {Object} Resultado de la validación
 */
export function validateHeadingStructure() {
  const results = {
    valid: true,
    errors: [],
    warnings: [],
    info: {}
  };

  // Contar headings
  const h1Count = document.querySelectorAll('h1').length;
  const h2Count = document.querySelectorAll('h2').length;
  const h3Count = document.querySelectorAll('h3').length;
  const h4Count = document.querySelectorAll('h4').length;
  const h5Count = document.querySelectorAll('h5').length;
  const h6Count = document.querySelectorAll('h6').length;

  results.info = {
    h1: h1Count,
    h2: h2Count,
    h3: h3Count,
    h4: h4Count,
    h5: h5Count,
    h6: h6Count
  };

  // Validar H1
  if (h1Count === 0) {
    results.valid = false;
    results.errors.push('❌ No se encontró ningún H1. Cada página debe tener exactamente un H1.');
  } else if (h1Count > 1) {
    results.valid = false;
    results.errors.push(`❌ Se encontraron ${h1Count} H1. Debe haber exactamente uno por página.`);
  } else {
    results.info.h1Text = document.querySelector('h1').textContent.trim();
  }

  // Validar H2
  if (h2Count < 2) {
    results.warnings.push(`⚠️ Solo hay ${h2Count} H2. Se recomienda al menos 2 para mejor estructura SEO.`);
  }

  // Validar jerarquía de headings
  const headingHierarchy = validateHeadingHierarchy();
  if (!headingHierarchy.valid) {
    results.valid = false;
    results.errors.push(...headingHierarchy.errors);
  }

  return results;
}

/**
 * Valida que la jerarquía de headings sea correcta (no saltar niveles)
 * @returns {Object} Resultado de validación
 */
function validateHeadingHierarchy() {
  const results = {
    valid: true,
    errors: []
  };

  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  let previousLevel = 0;

  headings.forEach((heading, index) => {
    const currentLevel = parseInt(heading.tagName.substring(1));
    
    // Verificar que no se salten niveles
    if (currentLevel - previousLevel > 1) {
      results.valid = false;
      results.errors.push(
        `❌ Salto de jerarquía detectado: ${heading.tagName} después de H${previousLevel}. ` +
        `Texto: "${heading.textContent.trim().substring(0, 50)}..."`
      );
    }

    previousLevel = currentLevel;
  });

  return results;
}

/**
 * Valida elementos semánticos HTML5
 * @returns {Object} Resultado de validación
 */
export function validateSemanticElements() {
  const results = {
    valid: true,
    errors: [],
    warnings: [],
    info: {}
  };

  // Verificar elementos semánticos requeridos
  semanticConfig.requiredSemanticElements.forEach(element => {
    const count = document.querySelectorAll(element).length;
    results.info[element] = count;

    if (count === 0) {
      results.warnings.push(`⚠️ No se encontró el elemento semántico <${element}>`);
    }
  });

  // Verificar que main tenga contenido
  const main = document.querySelector('main');
  if (main && main.children.length === 0) {
    results.errors.push('❌ El elemento <main> está vacío');
    results.valid = false;
  }

  // Verificar landmarks ARIA
  const landmarkResults = validateARIALandmarks();
  results.warnings.push(...landmarkResults.warnings);

  return results;
}

/**
 * Valida landmarks ARIA
 * @returns {Object} Resultado de validación
 */
function validateARIALandmarks() {
  const results = {
    warnings: []
  };

  Object.entries(semanticConfig.ariaRecommendations).forEach(([element, role]) => {
    const elements = document.querySelectorAll(element);
    elements.forEach(el => {
      if (!el.hasAttribute('role') && !el.hasAttribute('aria-label')) {
        results.warnings.push(
          `⚠️ Se recomienda añadir role="${role}" o aria-label al elemento <${element}>`
        );
      }
    });
  });

  return results;
}

/**
 * Genera un reporte completo de SEO semántico
 * @returns {Object} Reporte completo
 */
export function generateSEOReport() {
  console.log('🔍 Generando reporte de SEO semántico...\n');

  const headingResults = validateHeadingStructure();
  const semanticResults = validateSemanticElements();

  const report = {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    headings: headingResults,
    semantic: semanticResults,
    overall: headingResults.valid && semanticResults.valid
  };

  // Mostrar reporte en consola
  console.log('📊 REPORTE DE SEO SEMÁNTICO');
  console.log('═══════════════════════════════════════\n');

  console.log('📝 Estructura de Headings:');
  console.log(`   H1: ${headingResults.info.h1} ${headingResults.info.h1Text ? `("${headingResults.info.h1Text}")` : ''}`);
  console.log(`   H2: ${headingResults.info.h2}`);
  console.log(`   H3: ${headingResults.info.h3}`);
  console.log(`   H4: ${headingResults.info.h4}`);
  console.log(`   H5: ${headingResults.info.h5}`);
  console.log(`   H6: ${headingResults.info.h6}\n`);

  console.log('🏗️ Elementos Semánticos:');
  Object.entries(semanticResults.info).forEach(([element, count]) => {
    console.log(`   <${element}>: ${count}`);
  });
  console.log('');

  // Mostrar errores
  if (headingResults.errors.length > 0 || semanticResults.errors.length > 0) {
    console.log('❌ ERRORES:');
    [...headingResults.errors, ...semanticResults.errors].forEach(error => {
      console.log(`   ${error}`);
    });
    console.log('');
  }

  // Mostrar advertencias
  if (headingResults.warnings.length > 0 || semanticResults.warnings.length > 0) {
    console.log('⚠️ ADVERTENCIAS:');
    [...headingResults.warnings, ...semanticResults.warnings].forEach(warning => {
      console.log(`   ${warning}`);
    });
    console.log('');
  }

  // Resultado final
  if (report.overall) {
    console.log('✅ La estructura semántica es correcta\n');
  } else {
    console.log('❌ Se encontraron problemas en la estructura semántica\n');
  }

  console.log('═══════════════════════════════════════\n');

  return report;
}

/**
 * Corrige automáticamente problemas comunes de estructura
 */
export function autoFixSemanticIssues() {
  console.log('🔧 Intentando corregir problemas automáticamente...\n');

  let fixes = 0;

  // Añadir roles ARIA faltantes
  const nav = document.querySelector('nav');
  if (nav && !nav.hasAttribute('role')) {
    nav.setAttribute('role', 'navigation');
    fixes++;
  }

  const main = document.querySelector('main');
  if (main && !main.hasAttribute('role')) {
    main.setAttribute('role', 'main');
    fixes++;
  }

  const footer = document.querySelector('footer');
  if (footer && !footer.hasAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
    fixes++;
  }

  console.log(`✓ ${fixes} correcciones aplicadas automáticamente\n`);

  return fixes;
}

/**
 * Extrae y muestra la estructura de contenido para SEO
 */
export function extractContentOutline() {
  const outline = {
    title: document.title,
    h1: document.querySelector('h1')?.textContent.trim() || 'No H1 found',
    sections: []
  };

  const h2Elements = document.querySelectorAll('h2');
  h2Elements.forEach(h2 => {
    const section = {
      title: h2.textContent.trim(),
      subsections: []
    };

    // Buscar H3 siguientes hasta el próximo H2
    let nextElement = h2.nextElementSibling;
    while (nextElement && nextElement.tagName !== 'H2') {
      if (nextElement.tagName === 'H3') {
        section.subsections.push(nextElement.textContent.trim());
      }
      nextElement = nextElement.nextElementSibling;
    }

    outline.sections.push(section);
  });

  console.log('📑 Estructura de Contenido:');
  console.log(`\nTítulo: ${outline.title}`);
  console.log(`H1: ${outline.h1}\n`);
  
  outline.sections.forEach((section, i) => {
    console.log(`${i + 1}. ${section.title}`);
    section.subsections.forEach((sub, j) => {
      console.log(`   ${i + 1}.${j + 1}. ${sub}`);
    });
  });

  return outline;
}

// Ejecutar validación automática en desarrollo
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      generateSEOReport();
      extractContentOutline();
    }, 1000);
  });
}

// Exportar función global para uso en consola
if (typeof window !== 'undefined') {
  window.checkSEO = generateSEOReport;
  window.fixSEO = autoFixSemanticIssues;
  window.showOutline = extractContentOutline;
}
