/**
 * Generador de Sitemap Dinámico
 * GuambraWeb - Actualiza sitemap.xml automáticamente
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const config = {
  siteUrl: 'https://guambraweb.com',
  outputPath: path.join(__dirname, '../../public/sitemap.xml'),
  lastmod: new Date().toISOString().split('T')[0]
};

// Páginas del sitio
const pages = [
  {
    loc: '/',
    priority: 1.0,
    changefreq: 'weekly'
  },
  {
    loc: '/desarrollo-web-riobamba.html',
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    loc: '/apps-a-medida.html',
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    loc: '/personalizador.html',
    priority: 0.8,
    changefreq: 'monthly'
  }
];

// Secciones importantes (anclas)
const sections = [
  { loc: '/#portafolio', priority: 0.7, changefreq: 'weekly' },
  { loc: '/#nosotros', priority: 0.7, changefreq: 'monthly' },
  { loc: '/#servicios', priority: 0.8, changefreq: 'weekly' },
  { loc: '/#proceso', priority: 0.6, changefreq: 'monthly' },
  { loc: '/#testimonios', priority: 0.6, changefreq: 'weekly' },
  { loc: '/#faq', priority: 0.5, changefreq: 'monthly' },
  { loc: '/#contacto', priority: 0.7, changefreq: 'monthly' }
];

/**
 * Genera el XML del sitemap
 */
function generateSitemap() {
  const allUrls = [...pages, ...sections];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';
  xml += '\n';

  allUrls.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${config.siteUrl}${page.loc}</loc>\n`;
    xml += `    <lastmod>${config.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
    xml += '\n';
  });

  xml += '</urlset>\n';

  return xml;
}

/**
 * Guarda el sitemap en el archivo
 */
function saveSitemap() {
  try {
    const xml = generateSitemap();
    
    // Crear directorio si no existe
    const dir = path.dirname(config.outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Guardar archivo
    fs.writeFileSync(config.outputPath, xml, 'utf8');
    
    console.log('✅ Sitemap generado exitosamente');
    console.log(`📁 Ubicación: ${config.outputPath}`);
    console.log(`📊 Total de URLs: ${pages.length + sections.length}`);
    console.log(`📅 Fecha: ${config.lastmod}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error al generar sitemap:', error);
    return false;
  }
}

/**
 * Valida el sitemap generado
 */
function validateSitemap() {
  try {
    const xml = fs.readFileSync(config.outputPath, 'utf8');
    
    // Validaciones básicas
    const checks = {
      hasXmlDeclaration: xml.startsWith('<?xml'),
      hasUrlset: xml.includes('<urlset'),
      hasUrls: xml.includes('<url>'),
      hasLoc: xml.includes('<loc>'),
      validUrlCount: (xml.match(/<url>/g) || []).length === pages.length + sections.length
    };

    const allValid = Object.values(checks).every(check => check === true);

    if (allValid) {
      console.log('\n✅ Sitemap válido');
      console.log('   - Declaración XML: ✓');
      console.log('   - Elemento urlset: ✓');
      console.log('   - URLs presentes: ✓');
      console.log('   - Elementos loc: ✓');
      console.log(`   - Cantidad de URLs: ✓ (${pages.length + sections.length})`);
    } else {
      console.log('\n⚠️ Problemas encontrados en el sitemap:');
      Object.entries(checks).forEach(([check, valid]) => {
        if (!valid) {
          console.log(`   - ${check}: ✗`);
        }
      });
    }

    return allValid;
  } catch (error) {
    console.error('❌ Error al validar sitemap:', error);
    return false;
  }
}

/**
 * Añade una nueva página al sitemap
 */
export function addPage(loc, priority = 0.5, changefreq = 'monthly') {
  pages.push({ loc, priority, changefreq });
  console.log(`✓ Página añadida: ${loc}`);
}

/**
 * Elimina una página del sitemap
 */
export function removePage(loc) {
  const index = pages.findIndex(p => p.loc === loc);
  if (index !== -1) {
    pages.splice(index, 1);
    console.log(`✓ Página eliminada: ${loc}`);
    return true;
  }
  console.log(`⚠️ Página no encontrada: ${loc}`);
  return false;
}

/**
 * Lista todas las páginas del sitemap
 */
export function listPages() {
  console.log('\n📋 Páginas en el sitemap:\n');
  console.log('PÁGINAS PRINCIPALES:');
  pages.forEach(page => {
    console.log(`  ${page.loc} (prioridad: ${page.priority})`);
  });
  console.log('\nSECCIONES:');
  sections.forEach(section => {
    console.log(`  ${section.loc} (prioridad: ${section.priority})`);
  });
  console.log(`\nTotal: ${pages.length + sections.length} URLs\n`);
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 Generador de Sitemap - GuambraWeb\n');
  
  const success = saveSitemap();
  
  if (success) {
    validateSitemap();
    listPages();
  }
}

export { saveSitemap, validateSitemap, listPages };
