/**
 * Sistema de Metaetiquetas Dinámicas para SEO
 * GuambraWeb - Desarrollo Web en Riobamba
 */

export const seoConfig = {
  // Configuración global del sitio
  siteName: 'GuambraWeb',
  siteUrl: 'https://guambraweb.com',
  defaultImage: '/assets/og-image.jpg',
  twitterHandle: '@guambraweb',
  locale: 'es_EC',
  
  // Palabras clave locales prioritarias
  localKeywords: [
    'desarrollo web riobamba',
    'páginas web riobamba',
    'software riobamba',
    'aplicaciones web ecuador',
    'desarrollo software ecuador',
    'programador riobamba',
    'diseño web riobamba',
    'e-commerce riobamba'
  ],

  // Configuración por página
  pages: {
    home: {
      title: 'Desarrollo Web en Riobamba | Páginas Web y Software a Medida',
      description: 'Desarrollo de páginas web, aplicaciones web y software a medida en Riobamba, Ecuador. Soluciones digitales profesionales para impulsar tu negocio. ¡Cotiza gratis!',
      keywords: [
        'desarrollo web riobamba',
        'páginas web riobamba',
        'software a medida riobamba',
        'aplicaciones web ecuador',
        'diseño web riobamba',
        'programador riobamba',
        'desarrollo software ecuador',
        'sitios web profesionales'
      ],
      canonical: 'https://guambraweb.com/',
      ogType: 'website',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'GuambraWeb',
        description: 'Desarrollo de software, páginas web y aplicaciones web en Riobamba, Ecuador',
        url: 'https://guambraweb.com',
        telephone: '+593-98-265-0929',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Riobamba',
          addressRegion: 'Chimborazo',
          addressCountry: 'EC'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '-1.6711',
          longitude: '-78.6475'
        },
        priceRange: '$$',
        areaServed: {
          '@type': 'Country',
          name: 'Ecuador'
        },
        serviceArea: {
          '@type': 'GeoCircle',
          geoMidpoint: {
            '@type': 'GeoCoordinates',
            latitude: '-1.6711',
            longitude: '-78.6475'
          },
          geoRadius: '500000'
        }
      }
    },

    desarrolloWeb: {
      title: 'Desarrollo Web en Riobamba | Páginas Web Profesionales desde $30',
      description: 'Creamos páginas web profesionales en Riobamba desde $30. Diseño responsive, optimizado para Google, con hosting incluido. ¡Cotiza tu sitio web ahora!',
      keywords: [
        'desarrollo web riobamba',
        'páginas web riobamba',
        'diseño web riobamba',
        'sitios web económicos',
        'páginas web baratas riobamba',
        'desarrollo web ecuador',
        'hosting riobamba',
        'dominios ecuador'
      ],
      canonical: 'https://guambraweb.com/desarrollo-web-riobamba.html',
      ogType: 'website',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Desarrollo de Páginas Web',
        provider: {
          '@type': 'LocalBusiness',
          name: 'GuambraWeb',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Riobamba',
            addressRegion: 'Chimborazo',
            addressCountry: 'EC'
          }
        },
        areaServed: {
          '@type': 'Country',
          name: 'Ecuador'
        },
        offers: {
          '@type': 'AggregateOffer',
          lowPrice: '30',
          highPrice: '90',
          priceCurrency: 'USD'
        }
      }
    },

    appsAMedida: {
      title: 'Aplicaciones Web a Medida | Desarrollo de Software Personalizado',
      description: 'Desarrollamos aplicaciones web y software a medida en Riobamba. Sistemas de gestión, e-commerce, CRM y soluciones empresariales personalizadas.',
      keywords: [
        'aplicaciones web a medida',
        'software personalizado riobamba',
        'desarrollo software ecuador',
        'sistemas de gestión',
        'e-commerce ecuador',
        'crm personalizado',
        'software empresarial',
        'aplicaciones corporativas'
      ],
      canonical: 'https://guambraweb.com/apps-a-medida.html',
      ogType: 'website',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Desarrollo de Aplicaciones Web a Medida',
        provider: {
          '@type': 'LocalBusiness',
          name: 'GuambraWeb'
        },
        areaServed: {
          '@type': 'Country',
          name: 'Ecuador'
        }
      }
    },

    personalizador: {
      title: 'Cotizador Online | Calcula el Precio de tu Página Web',
      description: 'Cotiza tu página web online de forma gratuita. Elige las características que necesitas y obtén un presupuesto instantáneo para tu proyecto web.',
      keywords: [
        'cotizador web',
        'precio página web',
        'presupuesto web',
        'cotizar sitio web',
        'calculadora web',
        'costo desarrollo web'
      ],
      canonical: 'https://guambraweb.com/personalizador.html',
      ogType: 'website',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Cotizador de Páginas Web',
        applicationCategory: 'BusinessApplication',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        }
      }
    }
  }
};

/**
 * Genera las metaetiquetas para una página específica
 * @param {string} pageKey - Clave de la página en seoConfig.pages
 * @returns {string} HTML con las metaetiquetas
 */
export function generateMetaTags(pageKey) {
  const page = seoConfig.pages[pageKey];
  if (!page) {
    console.warn(`SEO config not found for page: ${pageKey}`);
    return '';
  }

  const keywords = [...page.keywords, ...seoConfig.localKeywords].join(', ');
  const ogImage = page.ogImage || seoConfig.defaultImage;

  return `
    <!-- SEO Meta Tags -->
    <title>${page.title}</title>
    <meta name="description" content="${page.description}" />
    <meta name="keywords" content="${keywords}" />
    <meta name="author" content="${seoConfig.siteName}" />
    <link rel="canonical" href="${page.canonical}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${page.ogType}" />
    <meta property="og:url" content="${page.canonical}" />
    <meta property="og:title" content="${page.title}" />
    <meta property="og:description" content="${page.description}" />
    <meta property="og:image" content="${seoConfig.siteUrl}${ogImage}" />
    <meta property="og:locale" content="${seoConfig.locale}" />
    <meta property="og:site_name" content="${seoConfig.siteName}" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${page.canonical}" />
    <meta name="twitter:title" content="${page.title}" />
    <meta name="twitter:description" content="${page.description}" />
    <meta name="twitter:image" content="${seoConfig.siteUrl}${ogImage}" />
    <meta name="twitter:site" content="${seoConfig.twitterHandle}" />
    
    <!-- Geo Tags para SEO Local -->
    <meta name="geo.region" content="EC-H" />
    <meta name="geo.placename" content="Riobamba" />
    <meta name="geo.position" content="-1.6711;-78.6475" />
    <meta name="ICBM" content="-1.6711, -78.6475" />
    
    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
      ${JSON.stringify(page.schema, null, 2)}
    </script>
  `;
}

/**
 * Actualiza las metaetiquetas dinámicamente (para SPAs)
 * @param {string} pageKey - Clave de la página
 */
export function updateMetaTags(pageKey) {
  const page = seoConfig.pages[pageKey];
  if (!page) return;

  // Actualizar título
  document.title = page.title;

  // Actualizar meta description
  updateMetaTag('name', 'description', page.description);

  // Actualizar meta keywords
  const keywords = [...page.keywords, ...seoConfig.localKeywords].join(', ');
  updateMetaTag('name', 'keywords', keywords);

  // Actualizar canonical
  updateLinkTag('canonical', page.canonical);

  // Actualizar Open Graph
  updateMetaTag('property', 'og:title', page.title);
  updateMetaTag('property', 'og:description', page.description);
  updateMetaTag('property', 'og:url', page.canonical);

  // Actualizar Twitter
  updateMetaTag('name', 'twitter:title', page.title);
  updateMetaTag('name', 'twitter:description', page.description);
  updateMetaTag('name', 'twitter:url', page.canonical);

  // Actualizar Schema.org
  updateSchema(page.schema);
}

function updateMetaTag(attr, attrValue, content) {
  let tag = document.querySelector(`meta[${attr}="${attrValue}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, attrValue);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function updateLinkTag(rel, href) {
  let tag = document.querySelector(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
}

function updateSchema(schema) {
  let scriptTag = document.querySelector('script[type="application/ld+json"]');
  if (!scriptTag) {
    scriptTag = document.createElement('script');
    scriptTag.setAttribute('type', 'application/ld+json');
    document.head.appendChild(scriptTag);
  }
  scriptTag.textContent = JSON.stringify(schema, null, 2);
}
