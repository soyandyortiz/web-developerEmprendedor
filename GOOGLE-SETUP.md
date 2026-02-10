# 🔍 Guía de Configuración: Google Search Console y Analytics

## 📊 Google Search Console

### Paso 1: Verificar Propiedad del Sitio

#### Opción A: Verificación por Archivo HTML

1. Ve a [Google Search Console](https://search.google.com/search-console)
2. Haz clic en "Agregar propiedad"
3. Ingresa tu URL: `https://guambraweb.com`
4. Selecciona "Verificación por archivo HTML"
5. Descarga el archivo de verificación (ej: `google1234567890abcdef.html`)
6. Sube el archivo a la carpeta `public/` de tu proyecto
7. Verifica que sea accesible en: `https://guambraweb.com/google1234567890abcdef.html`
8. Haz clic en "Verificar" en Search Console

#### Opción B: Verificación por Meta Tag (Recomendada)

1. En Search Console, selecciona "Etiqueta HTML"
2. Copia la meta tag que te proporcionen
3. Añádela al `<head>` de `index.html`:

```html
<head>
  <!-- Google Search Console Verification -->
  <meta name="google-site-verification" content="TU_CODIGO_AQUI" />

  <!-- Resto de meta tags -->
  ...
</head>
```

4. Despliega los cambios
5. Haz clic en "Verificar"

### Paso 2: Enviar Sitemap

1. Una vez verificada la propiedad, ve a "Sitemaps" en el menú lateral
2. Ingresa la URL de tu sitemap: `https://guambraweb.com/sitemap.xml`
3. Haz clic en "Enviar"
4. Espera 24-48 horas para que Google procese el sitemap

### Paso 3: Configurar Parámetros de URL

1. Ve a "Configuración" → "Parámetros de URL"
2. Si usas parámetros de tracking (ej: `?utm_source=facebook`), configúralos como "No afecta el contenido"

### Paso 4: Solicitar Indexación de Páginas Principales

1. Ve a "Inspección de URLs"
2. Ingresa cada URL importante:
   - `https://guambraweb.com/`
   - `https://guambraweb.com/desarrollo-web-riobamba.html`
   - `https://guambraweb.com/apps-a-medida.html`
   - `https://guambraweb.com/personalizador.html`
3. Haz clic en "Solicitar indexación" para cada una

### Paso 5: Configurar Datos Demográficos

1. Ve a "Configuración" → "Configuración del sitio"
2. Establece:
   - **País de destino**: Ecuador
   - **Idioma**: Español

## 📈 Google Analytics 4

### Paso 1: Crear Propiedad

1. Ve a [Google Analytics](https://analytics.google.com)
2. Haz clic en "Administrar" → "Crear propiedad"
3. Configura:
   - **Nombre de la propiedad**: GuambraWeb
   - **Zona horaria**: (GMT-05:00) Ecuador
   - **Moneda**: Dólar estadounidense (USD)

### Paso 2: Crear Flujo de Datos

1. Selecciona "Web"
2. Ingresa:
   - **URL del sitio web**: `https://guambraweb.com`
   - **Nombre del flujo**: GuambraWeb - Sitio Principal
3. Habilita "Medición mejorada"
4. Copia el **ID de medición** (formato: `G-XXXXXXXXXX`)

### Paso 3: Instalar el Código de Seguimiento

Crea un archivo `src/analytics/google-analytics.js`:

```javascript
/**
 * Google Analytics 4 - GuambraWeb
 */

// Reemplaza con tu ID de medición real
const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";

/**
 * Inicializa Google Analytics
 */
export function initGoogleAnalytics() {
  // Verificar que no estemos en desarrollo
  if (window.location.hostname === "localhost") {
    console.log("Google Analytics deshabilitado en desarrollo");
    return;
  }

  // Cargar script de Google Analytics
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Inicializar gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
    send_page_view: true,
  });

  // Exportar gtag globalmente
  window.gtag = gtag;

  console.log("✓ Google Analytics inicializado");
}

/**
 * Registra un evento personalizado
 */
export function trackEvent(eventName, eventParams = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, eventParams);
    console.log("📊 Evento registrado:", eventName, eventParams);
  }
}

/**
 * Registra una conversión
 */
export function trackConversion(conversionName, value = 0) {
  trackEvent("conversion", {
    conversion_name: conversionName,
    value: value,
    currency: "USD",
  });
}

/**
 * Registra un clic en CTA
 */
export function trackCTAClick(ctaName, ctaLocation) {
  trackEvent("cta_click", {
    cta_name: ctaName,
    cta_location: ctaLocation,
  });
}

/**
 * Registra una vista de sección
 */
export function trackSectionView(sectionName) {
  trackEvent("section_view", {
    section_name: sectionName,
  });
}

// Auto-inicializar
if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGoogleAnalytics);
  } else {
    initGoogleAnalytics();
  }
}
```

Luego, importa en `index.html`:

```html
<!-- Google Analytics -->
<script type="module" src="/src/analytics/google-analytics.js"></script>
```

### Paso 4: Configurar Eventos de Conversión

En Google Analytics, ve a "Configurar" → "Eventos" y marca como conversiones:

1. **form_submit** (envío de formulario de contacto)
2. **whatsapp_click** (clic en botón de WhatsApp)
3. **cotizador_complete** (completar cotizador)
4. **phone_click** (clic en número de teléfono)

### Paso 5: Configurar Objetivos

1. Ve a "Configurar" → "Conversiones"
2. Crea conversiones personalizadas:
   - **Nombre**: Contacto por WhatsApp
   - **Evento**: whatsapp_click
   - **Valor**: $0 (o valor estimado de lead)

## 🎯 Eventos Personalizados a Implementar

### En el Código JavaScript

```javascript
import {
  trackEvent,
  trackCTAClick,
  trackConversion,
} from "./analytics/google-analytics.js";

// Rastrear clic en WhatsApp
document.querySelectorAll('a[href*="wa.me"]').forEach((link) => {
  link.addEventListener("click", () => {
    trackCTAClick("WhatsApp", link.closest("section")?.id || "unknown");
    trackConversion("whatsapp_contact", 10);
  });
});

// Rastrear envío de formulario
document.querySelector("#contact-form")?.addEventListener("submit", (e) => {
  trackEvent("form_submit", {
    form_name: "contact",
    form_location: "footer",
  });
  trackConversion("contact_form", 15);
});

// Rastrear completar cotizador
document.querySelector("#cotizador-form")?.addEventListener("submit", (e) => {
  trackEvent("cotizador_complete", {
    total_price: e.target.dataset.totalPrice || 0,
  });
  trackConversion("cotizador_complete", 20);
});

// Rastrear scroll a secciones
const sections = document.querySelectorAll("section[id]");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        trackEvent("section_view", {
          section_name: entry.target.id,
        });
      }
    });
  },
  { threshold: 0.5 },
);

sections.forEach((section) => observer.observe(section));
```

## 🔗 Vincular Search Console con Analytics

1. En Google Analytics, ve a "Administrar"
2. En la columna "Propiedad", haz clic en "Vínculos de Search Console"
3. Haz clic en "Vincular"
4. Selecciona tu propiedad de Search Console
5. Confirma el vínculo

## 📊 Informes Importantes a Monitorear

### En Google Search Console

1. **Rendimiento**
   - Clics totales
   - Impresiones
   - CTR promedio
   - Posición promedio
   - Consultas principales
   - Páginas principales

2. **Cobertura**
   - Páginas indexadas
   - Páginas excluidas
   - Errores de indexación

3. **Experiencia**
   - Core Web Vitals
   - Usabilidad móvil

4. **Mejoras**
   - Datos estructurados
   - Breadcrumbs
   - Sitelinks

### En Google Analytics

1. **Adquisición**
   - Tráfico orgánico
   - Fuentes de tráfico
   - Páginas de destino

2. **Interacción**
   - Páginas más vistas
   - Tiempo en página
   - Tasa de rebote

3. **Conversiones**
   - Eventos de conversión
   - Valor de conversión
   - Embudos de conversión

4. **Audiencia**
   - Ubicación geográfica
   - Dispositivos
   - Navegadores

## 🎯 Configuración de Alertas

### En Google Analytics

1. Ve a "Administrar" → "Alertas personalizadas"
2. Crea alertas para:
   - **Caída de tráfico**: Si las sesiones disminuyen >30% semana a semana
   - **Aumento de tráfico**: Si las sesiones aumentan >50% (para detectar picos)
   - **Tasa de rebote alta**: Si la tasa de rebote >70%

## 📱 Google Tag Manager (Opcional pero Recomendado)

### Ventajas

- Gestionar múltiples tags sin modificar código
- Implementar eventos sin desarrollador
- Testing A/B más fácil
- Integración con múltiples plataformas

### Configuración Básica

1. Crea una cuenta en [Google Tag Manager](https://tagmanager.google.com)
2. Crea un contenedor para el sitio web
3. Copia el código del contenedor
4. Pégalo en `index.html`:

```html
<!-- Google Tag Manager -->
<script>
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != "dataLayer" ? "&l=" + l : "";
    j.async = true;
    j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, "script", "dataLayer", "GTM-XXXXXXX");
</script>
<!-- End Google Tag Manager -->
```

5. Añade el noscript después del `<body>`:

```html
<!-- Google Tag Manager (noscript) -->
<noscript
  ><iframe
    src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
    height="0"
    width="0"
    style="display:none;visibility:hidden"
  ></iframe
></noscript>
<!-- End Google Tag Manager (noscript) -->
```

## 📈 Métricas Clave a Seguir

### KPIs Principales

1. **Tráfico Orgánico**: Objetivo +20% mensual
2. **Posición Promedio**: Objetivo Top 5 para palabras clave principales
3. **CTR**: Objetivo >3% en resultados de búsqueda
4. **Conversiones**: Objetivo 5-10 leads/mes
5. **Tasa de Rebote**: Objetivo <60%
6. **Tiempo en Página**: Objetivo >2 minutos

### Dashboard Recomendado

Crea un dashboard personalizado con:

- Tráfico orgánico (últimos 30 días vs período anterior)
- Top 10 palabras clave
- Top 5 páginas de destino
- Conversiones por fuente
- Core Web Vitals
- Dispositivos (móvil vs desktop)

## 🔔 Notificaciones y Reportes

### Configurar Reportes Automáticos

1. En Google Analytics, ve a "Explorar"
2. Crea un informe personalizado
3. Haz clic en "Compartir" → "Programar envío por correo"
4. Configura:
   - **Frecuencia**: Semanal (lunes por la mañana)
   - **Destinatarios**: tu email
   - **Formato**: PDF

### Reportes Recomendados

**Reporte Semanal:**

- Tráfico total
- Nuevos usuarios
- Conversiones
- Top 5 páginas

**Reporte Mensual:**

- Comparativa mes a mes
- Análisis de palabras clave
- Rendimiento de contenido
- Análisis de conversiones

---

## ✅ Checklist de Implementación

- [ ] Verificar propiedad en Google Search Console
- [ ] Enviar sitemap.xml
- [ ] Solicitar indexación de páginas principales
- [ ] Crear propiedad en Google Analytics 4
- [ ] Instalar código de seguimiento
- [ ] Configurar eventos de conversión
- [ ] Vincular Search Console con Analytics
- [ ] Configurar alertas personalizadas
- [ ] Crear dashboard de métricas
- [ ] Programar reportes automáticos
- [ ] (Opcional) Configurar Google Tag Manager

---

**Tiempo estimado de implementación**: 2-3 horas
**Tiempo para ver primeros datos**: 24-48 horas
**Tiempo para datos significativos**: 2-4 semanas

**Soporte**: Si necesitas ayuda, contacta a contacto@guambraweb.com
