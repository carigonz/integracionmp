# Business Blueprint

Sitio web estatico reutilizable para negocios y profesionales. Personalizable mediante un unico archivo de configuracion y contenido en MDX/JSON.

**Tech stack:** Astro 5 | MDX | Tailwind CSS v4 | Content Collections | Iconify/Lucide

**Resultado:** sitio SEO-optimizado, responsivo, con structured data (schema.org), formulario de contacto, y deploy automatico a GitHub Pages.

---

## Inicio rapido

**Prerrequisitos:** Node.js 22+

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (http://localhost:4321)
npm run dev

# Build de produccion (output en ./dist/)
npm run build

# Preview del build local
npm run preview

# Chequeo de tipos TypeScript
npm run check
```

---

## Estructura del proyecto

```
├── public/                      Assets estaticos (logo, favicon, OG image)
├── src/
│   ├── config/
│   │   └── site.config.ts       Configuracion central del sitio
│   ├── data/
│   │   ├── services/*.mdx       Contenido de servicios
│   │   ├── blog/*.mdx           Posts del blog
│   │   ├── faq/faq.json         Preguntas frecuentes
│   │   ├── team/team.json       Miembros del equipo
│   │   └── testimonials/        Testimonios de clientes
│   │       └── testimonials.json
│   ├── pages/                   Rutas del sitio (file-based routing)
│   ├── layouts/                 Shells de pagina (Base, Page, Blog, Service)
│   ├── components/
│   │   ├── layout/              Header, Footer, Navigation
│   │   ├── sections/            Hero, ServicesGrid, Stats, CTA, FAQ, Contact
│   │   ├── blocks/              Piezas reutilizables
│   │   ├── common/              Button, Card, Container, SectionWrapper
│   │   └── seo/                 SEOHead, SchemaOrg
│   ├── styles/
│   │   └── global.css           Tema de colores y tipografia (Tailwind v4)
│   ├── types/                   Tipos TypeScript compartidos
│   └── content.config.ts        Definicion de Content Collections
├── astro.config.mjs             Configuracion de Astro y dominio
└── package.json
```

---

## Configuracion central

Todo el sitio se controla desde `src/config/site.config.ts`. Este es el unico archivo que necesitas editar para personalizar la identidad del negocio.

### business

Datos del negocio que se usan en header, footer, SEO y schema.org.

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| `name` | string | Nombre comercial |
| `legalName` | string? | Razon social (para copyright en footer) |
| `tagline` | string | Eslogan corto |
| `description` | string | Descripcion para SEO y meta tags |
| `foundedYear` | number | Anio de fundacion |
| `email` | string | Email de contacto |
| `phone` | string | Telefono con formato visible (ej: `+54 11 1234-5678`) |
| `whatsapp` | string? | Numero de WhatsApp sin espacios ni signos (ej: `5491112345678`) |
| `address` | object | `{ street, city, state, zip, country }` |
| `geo` | object | `{ latitude, longitude }` para schema.org |
| `hours` | object | `{ weekdays, saturday, sunday }` textos de horarios |
| `socialMedia` | array | `[{ platform, url, label }]` -- plataformas: `instagram`, `facebook`, `linkedin`, `twitter`, `youtube`, `google` |

### site

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| `url` | string | URL de produccion (ej: `https://www.minegocio.com`) |
| `locale` | string | Locale del sitio (ej: `es-AR`, `es-MX`, `en-US`) |

> **Importante:** el dominio tambien debe coincidir en `astro.config.mjs` (propiedad `site` en linea 9).

### theme

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| `logoText` | string? | Texto que se muestra junto al logo. Si no se define, usa `business.name` |

### seo

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| `defaultTitle` | string | Titulo por defecto de la pagina principal |
| `titleTemplate` | string | Template para titulos internos (ej: `%s \| MiNegocio`) |
| `defaultImage` | string | Ruta a la imagen OG por defecto (ej: `/og-default.jpg`) |
| `schemaType` | string | Tipo de schema.org del negocio (ej: `Electrician`, `Plumber`, `Dentist`, `Restaurant`) |
| `areaServed` | string[] | Zonas de cobertura para schema.org |

### navigation

Array de items del menu principal. Soporta un nivel de subitems via `children`.

```typescript
navigation: [
  { label: 'Inicio', href: '/' },
  {
    label: 'Servicios',
    href: '/services',
    children: [
      { label: 'Mi Servicio', href: '/services/mi-servicio' },
    ],
  },
  { label: 'Contacto', href: '/contact' },
]
```

Los items con href `/blog` o `/team` se ocultan automaticamente cuando sus feature flags estan desactivados.

### stats

Array de metricas que se muestran en la seccion de estadisticas del home.

```typescript
stats: [
  { value: '10+', label: 'Anios de experiencia', icon: 'lucide:calendar-check' },
  { value: '500+', label: 'Clientes', icon: 'lucide:users' },
]
```

### process

Pasos del proceso de trabajo, mostrados como timeline en el home.

```typescript
process: [
  { title: 'Contacto', description: 'Descripcion del paso...', icon: 'lucide:phone-call' },
]
```

### integrations

| Integracion | Campos | Descripcion |
|-------------|--------|-------------|
| `forms` | `provider: 'web3forms'`, `accessKey` | Formulario de contacto. Obtener key en [web3forms.com](https://web3forms.com) |
| `analytics` | `provider`, `siteId?`, `scriptUrl?` | Provider: `umami`, `plausible`, o `none` |
| `maps` | `embedUrl` | URL de embed de Google Maps |

### features

Flags booleanos para activar/desactivar secciones del sitio.

| Flag | Default | Efecto |
|------|---------|--------|
| `blog` | false | Muestra/oculta el link a `/blog` en la navegacion |
| `team` | true | Muestra/oculta el link a `/team` en la navegacion |
| `testimonials` | true | Habilita la seccion de testimonios |
| `faq` | true | Habilita la seccion de FAQ |
| `whatsappButton` | true | Muestra el boton flotante de WhatsApp (requiere `business.whatsapp`) |

---

## Colores y tipografia

Los colores y fuentes se configuran en `src/styles/global.css` usando variables CSS de Tailwind v4 con formato OKLCH.

### Paleta de colores

El sitio usa 4 escalas de color, cada una con 10 tonos (50-900):

| Escala | Hue OKLCH | Uso | Color por defecto |
|--------|-----------|-----|-------------------|
| `primary` | ~250 | Botones, links, acentos principales | Azul |
| `secondary` | ~85 | Acentos secundarios, badges | Ambar/dorado |
| `accent` | ~160 | Detalles, highlights | Verde |
| `neutral` | 0 | Textos, fondos, bordes | Gris |

Para cambiar el color principal del sitio, modificar el **tercer valor (hue)** de las variables `--color-primary-*`:

```css
/* Ejemplo: cambiar primary de azul (250) a rojo (25) */
--color-primary-500: oklch(0.55 0.20 25);
```

Referencia rapida de hues OKLCH:
- 0-30: Rojos
- 30-90: Naranjas/Amarillos
- 90-150: Verdes
- 150-210: Cyan/Turquesa
- 210-270: Azules
- 270-330: Violetas/Magentas
- 330-360: Rojos

### Tipografia

Las fuentes se definen con dos variables:

```css
--font-display: "Inter", system-ui, sans-serif;  /* Titulos */
--font-body: "Inter", system-ui, sans-serif;      /* Texto general */
```

Para cambiar la fuente:
1. Editar las variables en `src/styles/global.css`
2. Actualizar el link de Google Fonts en `src/layouts/BaseLayout.astro` (lineas 29-32)

---

## Imagenes y assets

Todos los assets estaticos van en la carpeta `public/`.

| Asset | Ruta | Formato | Donde se usa |
|-------|------|---------|--------------|
| Logo | `public/logo.png` | PNG (recomendado: fondo transparente) | Header |
| Favicon | `public/favicon.svg` | SVG | Tab del navegador |
| OG Image | `public/og-default.jpg` | JPG (1200x630 recomendado) | Previews en redes sociales |

### Iconos

El sitio usa iconos de [Lucide](https://lucide.dev) a traves de `astro-icon`. Se referencian con el formato `lucide:nombre-del-icono`.

Ejemplos:
- `lucide:home` -- casa
- `lucide:phone-call` -- telefono
- `lucide:shield-check` -- escudo con check
- `lucide:building-2` -- edificio

Explorar el catalogo completo en [lucide.dev/icons](https://lucide.dev/icons).

---

## Gestion de contenido

El contenido se gestiona mediante Astro Content Collections, definidas en `src/content.config.ts`.

### Servicios

**Ubicacion:** `src/data/services/*.mdx`

Cada archivo MDX representa un servicio. El nombre del archivo se convierte en el slug de la URL (ej: `mi-servicio.mdx` -> `/services/mi-servicio`).

**Frontmatter:**

```yaml
---
title: "Nombre del Servicio"
description: "Descripcion para SEO (max ~160 caracteres)"
excerpt: "Resumen corto para la tarjeta en la grilla"
icon: "lucide:wrench"
order: 1
featured: true
tags: ["tag1", "tag2"]
---
```

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| `title` | string | Nombre del servicio |
| `description` | string | Descripcion larga para SEO |
| `excerpt` | string | Texto de la tarjeta en la grilla de servicios |
| `icon` | string | Icono Lucide para la tarjeta |
| `order` | number | Orden de aparicion (menor = primero) |
| `featured` | boolean | Si `true`, se destaca en la grilla |
| `tags` | string[] | Tags para categorizar |

Debajo del frontmatter, escribir el contenido del servicio en Markdown/MDX.

### Blog

**Ubicacion:** `src/data/blog/*.mdx`

Para activar el blog: setear `features.blog: true` en `site.config.ts` y agregar el item de navegacion:

```typescript
{ label: 'Blog', href: '/blog' }
```

**Frontmatter:**

```yaml
---
title: "Titulo del Post"
description: "Descripcion para SEO"
pubDate: 2025-12-15
author: "Nombre del Autor"
tags: ["tag1", "tag2"]
draft: false
---
```

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| `title` | string | Titulo del post |
| `description` | string | Descripcion para SEO |
| `pubDate` | date | Fecha de publicacion (YYYY-MM-DD) |
| `updatedDate` | date? | Fecha de ultima actualizacion |
| `author` | string | Nombre del autor |
| `tags` | string[] | Tags del post |
| `draft` | boolean | Si `true`, no se publica |

### Testimonios

**Ubicacion:** `src/data/testimonials/testimonials.json`

```json
{
  "items": [
    {
      "name": "Nombre del Cliente",
      "role": "Cargo",
      "company": "Empresa o contexto",
      "quote": "Texto del testimonio...",
      "rating": 5
    }
  ]
}
```

### Equipo

**Ubicacion:** `src/data/team/team.json`

```json
{
  "items": [
    {
      "name": "Nombre Completo",
      "role": "Cargo",
      "bio": "Biografia corta...",
      "email": "email@ejemplo.com",
      "certifications": ["Certificacion 1", "Certificacion 2"],
      "order": 1
    }
  ]
}
```

### FAQ

**Ubicacion:** `src/data/faq/faq.json`

```json
{
  "items": [
    {
      "question": "Pregunta frecuente?",
      "answer": "Respuesta detallada...",
      "category": "general",
      "order": 1
    }
  ]
}
```

---

## Navegacion y rutas

### Rutas disponibles

| Ruta | Pagina | Archivo |
|------|--------|---------|
| `/` | Home | `src/pages/index.astro` |
| `/about` | Nosotros | `src/pages/about.astro` |
| `/contact` | Contacto | `src/pages/contact.astro` |
| `/team` | Equipo | `src/pages/team.astro` |
| `/services` | Listado de servicios | `src/pages/services/index.astro` |
| `/services/[slug]` | Detalle de servicio | `src/pages/services/[slug].astro` |
| `/blog` | Listado de posts | `src/pages/blog/index.astro` |
| `/blog/[slug]` | Post individual | `src/pages/blog/[slug].astro` |

### Menu de navegacion

Se define en `siteConfig.navigation`. Soporta un nivel de subitems con la propiedad `children` (usado para el dropdown de servicios).

Los items con href `/blog` o `/team` se filtran automaticamente del menu si su feature flag esta desactivado.

---

## SEO y Schema.org

El sitio incluye SEO automatico en todas las paginas:

- **Meta tags:** title, description, canonical URL, OG tags, Twitter cards
- **Schema.org structured data:**
  - `LocalBusiness` (tipo configurable via `seo.schemaType`)
  - `FAQPage` en la seccion de FAQ
  - `BreadcrumbList` en paginas internas
  - `BlogPosting` en posts del blog

Configurar `seo.schemaType` segun el tipo de negocio. Valores comunes de schema.org:
`Electrician`, `Plumber`, `Dentist`, `Restaurant`, `LegalService`, `AccountingService`, `AutoRepair`, `BeautySalon`, `HealthAndBeautyBusiness`.

---

## Integraciones

### Formulario de contacto (Web3Forms)

1. Crear una cuenta en [web3forms.com](https://web3forms.com)
2. Copiar el Access Key
3. Pegarlo en `siteConfig.integrations.forms.accessKey`

### Analytics

Soporte para Umami o Plausible:

```typescript
analytics: {
  provider: 'umami',       // 'umami' | 'plausible' | 'none'
  siteId: 'tu-site-id',
  scriptUrl: 'https://analytics.tu-dominio.com/script.js',
}
```

### Google Maps

Obtener la URL de embed desde Google Maps (Compartir > Incorporar un mapa) y pegarla en `siteConfig.integrations.maps.embedUrl`.

### WhatsApp

El boton flotante de WhatsApp se activa cuando `features.whatsappButton` es `true` y `business.whatsapp` tiene un numero valido (sin espacios ni signos, ej: `5491112345678`).

---

## Deploy

El proyecto incluye un workflow de GitHub Actions (`.github/workflows/deploy.yml`) que despliega automaticamente a GitHub Pages.

**Setup:**
1. En el repositorio de GitHub, ir a Settings > Pages
2. En "Build and deployment", seleccionar source **GitHub Actions**
3. Cada push a `main` dispara el build y deploy automatico

**Requisitos del workflow:**
- Node.js 22
- Build con `npm ci` + `npm run build`
- Output en `dist/`

---

## Checklist de personalizacion rapida

Pasos minimos para adaptar el blueprint a un nuevo negocio:

- [ ] Editar `src/config/site.config.ts` con los datos del negocio
- [ ] Actualizar el dominio en `astro.config.mjs` (propiedad `site`)
- [ ] Reemplazar `public/logo.png` con el logo del negocio
- [ ] Reemplazar `public/favicon.svg`
- [ ] Crear `public/og-default.jpg` (1200x630)
- [ ] Ajustar la paleta de colores en `src/styles/global.css`
- [ ] Crear/editar archivos MDX en `src/data/services/`
- [ ] Editar `src/data/faq/faq.json` con preguntas del negocio
- [ ] Editar `src/data/team/team.json` con el equipo
- [ ] Editar `src/data/testimonials/testimonials.json`
- [ ] Obtener y configurar el Access Key de Web3Forms
- [ ] Activar/desactivar features segun necesidad
- [ ] Verificar que los items de `navigation` correspondan a servicios existentes
