# Plan de implementación — Wizard de presupuesto rápido

## Resumen

Agregar un estimador de presupuesto interactivo en el Hero de la home, que funcione como wizard de 4 pasos. Resultado: rango de precio estimado + envío a WhatsApp. Botón flotante para minimizar/restaurar. Página `/cotizar` para presupuesto detallado (fase 2).

---

## Arquitectura de archivos

```
src/
├── data/
│   └── prices.json                    ← NUEVO: precios base (fuente única de verdad)
├── components/
│   ├── sections/
│   │   └── Hero.astro                 ← MODIFICAR: layout 2 columnas
│   └── budget/
│       ├── BudgetWizard.astro         ← NUEVO: wrapper Astro del wizard
│       └── budget-wizard.js           ← NUEVO: lógica JS del wizard (client-side)
├── layouts/
│   └── BaseLayout.astro               ← MODIFICAR: agregar botón flotante presupuesto
├── pages/
│   ├── index.astro                    ← SIN CAMBIOS (Hero ya importado)
│   └── cotizar.astro                  ← NUEVO (fase 2): página presupuesto detallado
└── styles/
    └── global.css                     ← SIN CAMBIOS
```

---

## Fase 1: Wizard en el Hero (implementar ahora)

### Paso 1 — Crear `src/data/prices.json`

Archivo centralizado de precios. En un futuro se puede generar desde un Google Sheet o Excel.

```json
{
  "version": "2026-04-11",
  "currency": "ARS",
  "items": {
    "bocaToma": {
      "label": "Cambio/instalación boca de toma",
      "price": 30000,
      "unit": "unidad"
    },
    "bocaLuz": {
      "label": "Boca de luz (punto de iluminación)",
      "price": 20000,
      "unit": "unidad"
    },
    "canalizacionSuperficial": {
      "label": "Canalización superficial PVC",
      "price": 10000,
      "unit": "metro"
    },
    "canalizacionEmbutida": {
      "label": "Canalización embutida",
      "price": 20000,
      "unit": "metro"
    },
    "tableroBase": {
      "label": "Tablero seccional (1 térmica + 1 diferencial)",
      "price": 40000,
      "unit": "unidad"
    },
    "termicaAdicional": {
      "label": "Térmica adicional",
      "price": 15000,
      "unit": "unidad"
    },
    "protectorTension": {
      "label": "Protector de tensión",
      "price": 40000,
      "unit": "unidad"
    },
    "deteccionFalla": {
      "label": "Detección de falla (hasta 3hs)",
      "price": 120000,
      "unit": "servicio"
    },
    "tendidoCable": {
      "label": "Tendido de cable principal",
      "price": 15000,
      "unit": "metro"
    }
  },
  "surcharges": {
    "edificioAntiguo": {
      "label": "Edificio +20 años antigüedad",
      "factor": 0.15,
      "condition": "tipo === 'depto' && antiguedad > 20"
    },
    "pisoAlto": {
      "label": "Piso 5 o superior",
      "factor": 0.10,
      "condition": "tipo === 'depto' && piso >= 5"
    }
  },
  "estimateMargin": 0.20,
  "whatsapp": "5491173644604"
}
```

**Notas para el futuro:**
- Este JSON se puede generar automáticamente con un script `scripts/sync-prices.js` que lea un Google Sheet vía API y escriba el JSON.
- Alternativa más simple: editar este JSON directo cuando cambien los precios, hacer commit y deploy.

---

### Paso 2 — Crear `src/components/budget/BudgetWizard.astro`

Componente wrapper que importa los precios en build-time y los inyecta al JS del wizard.

```astro
---
// src/components/budget/BudgetWizard.astro
import prices from '@/data/prices.json';
---

<div id="budget-wizard-root" class="w-full max-w-[400px]"></div>

<script define:vars={{ prices }}>
  // Inyectar precios como variable global para el wizard
  window.__BUDGET_PRICES__ = prices;
</script>

<script src="./budget-wizard.js"></script>
```

**Por qué este enfoque:**
- `define:vars` inyecta el JSON de precios en build-time → el wizard siempre usa los precios actuales del deploy.
- El JS es vanilla (sin React/framework), se carga solo en las páginas que usen el componente.
- No necesita hidratación de framework → peso mínimo.

---

### Paso 3 — Crear `src/components/budget/budget-wizard.js`

Este es el archivo JS principal del wizard. Tomar el código del prototipo validado y adaptarlo:

**Cambios respecto al prototipo:**

1. **Leer precios de `window.__BUDGET_PRICES__`** en lugar de tenerlos hardcodeados:
```javascript
const cfg = window.__BUDGET_PRICES__;
const P = {};
Object.entries(cfg.items).forEach(([k, v]) => { P[k] = v.price; });
const MARGIN = cfg.estimateMargin;
const WA = cfg.whatsapp;
```

2. **Usar las variables CSS del proyecto** (ya presentes en global.css) en lugar de colores hardcodeados. Mapeo:
   - `#b87a0a` → `var(--color-secondary-700)` (el dorado/amber del theme)
   - `rgba(184,122,10,...)` → `var(--color-secondary-500)` con opacidad
   - Blanco sobre fondo oscuro → heredar del Hero (el wizard vive dentro del Hero con `bg-primary-900`)
   - Bordes → `rgba(255,255,255,0.12)` (ya que está sobre fondo oscuro)

3. **Render target:** montar en `#budget-wizard-root`

4. **Botón "Presupuesto detallado"** → navegar a `/cotizar`

5. **Estado minimizado:** cuando se minimiza, en lugar de crear su propio botón flotante, dispara un `CustomEvent` para que el botón flotante del layout lo maneje:
```javascript
document.dispatchEvent(new CustomEvent('budget-wizard-minimize'));
```

**Estructura del JS (pseudocódigo):**
```
- Lee precios de window.__BUDGET_PRICES__
- Estado interno (objeto plano, misma estructura del prototipo)
- Funciones de render por paso (innerHTML, no framework)
- Función calc() para el cálculo
- Función buildWhatsAppMessage()
- Función render() que evalúa el paso actual y pinta
- Event listeners via onclick inline (mismo patrón del prototipo)
- Inputs numéricos editables + botones ±
```

El código completo del prototipo interactivo que validaste es la base. Solo cambian los 5 puntos de arriba.

---

### Paso 4 — Modificar `src/components/sections/Hero.astro`

**Estado actual:** una sola columna con `max-w-3xl` para el texto.

**Estado nuevo:** grid de 2 columnas en desktop, stack en mobile.

```astro
---
import { Icon } from 'astro-icon/components';
import { siteConfig } from '@/config/site.config';
import Button from '@/components/common/Button.astro';
import BudgetWizard from '@/components/budget/BudgetWizard.astro';

const { business } = siteConfig;
---

<section class="relative" aria-label="Presentación principal">
  <div class="relative min-h-[65vh] md:min-h-screen flex items-center bg-primary-900">
    <div class="absolute inset-0 bg-gradient-to-br from-primary-900/80 via-primary-800/60 to-primary-900/90" />

    <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 w-full">
      <!-- CAMBIO: de max-w-3xl a grid 2 columnas -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        <!-- Columna izquierda: texto (sin cambios en contenido) -->
        <div class="max-w-2xl">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {business.name}
          </h1>
          <p class="mt-4 text-lg md:text-xl text-primary-200 font-medium">
            {business.tagline}
          </p>
          <p class="mt-3 text-base md:text-lg text-neutral-200">
            {business.description}
          </p>
          <div class="mt-8 flex flex-wrap gap-4">
            <Button href="/services" variant="outline" size="lg"
              class="border-white text-white hover:bg-white/10">
              Nuestros Servicios
            </Button>
          </div>
          <!-- Contacto directo (mismo código actual) -->
          <div class="mt-8 flex flex-wrap items-center gap-6">
            <!-- ... WhatsApp + teléfono igual que ahora ... -->
          </div>
        </div>

        <!-- Columna derecha: wizard -->
        <div class="flex justify-center lg:justify-end">
          <BudgetWizard />
        </div>

      </div>
    </div>
  </div>
</section>
```

**Cambios clave:**
- `max-w-3xl` → `grid grid-cols-1 lg:grid-cols-2`
- Se elimina el botón "Solicitar Presupuesto" (el wizard lo reemplaza)
- Se mantiene botón "Nuestros Servicios"
- En mobile: texto arriba, wizard abajo (stack natural del grid)
- `h1` baja de `text-6xl` a `text-5xl` en `md` para dar espacio al wizard
- Gap de 16 entre columnas en desktop

---

### Paso 5 — Modificar `src/layouts/BaseLayout.astro`

Agregar el botón flotante de presupuesto al lado del de WhatsApp.

```astro
---
// ... imports existentes ...
import BudgetFloat from '@/components/budget/BudgetFloat.astro';
---

<!-- ... todo el HTML existente ... -->
    <Footer />
    <WhatsAppFloat />
    <BudgetFloat />   <!-- NUEVO -->
  </body>
</html>
```

---

### Paso 6 — Crear `src/components/budget/BudgetFloat.astro`

Botón flotante que aparece cuando el wizard se minimiza o cuando el usuario scrollea fuera del Hero.

```astro
---
// src/components/budget/BudgetFloat.astro
---

<button
  id="budget-float-btn"
  class="fixed bottom-24 right-6 z-50 hidden items-center gap-2 
         bg-secondary-600 hover:bg-secondary-700 text-white 
         rounded-full px-5 py-3 shadow-lg transition-all
         font-display font-semibold text-sm"
  aria-label="Abrir presupuesto rápido"
>
  <span class="text-lg">⚡</span>
  Presupuesto
</button>

<script>
  const btn = document.getElementById('budget-float-btn');
  const hero = document.querySelector('[aria-label="Presentación principal"]');

  // Mostrar cuando el wizard se minimiza
  document.addEventListener('budget-wizard-minimize', () => {
    btn.classList.remove('hidden');
    btn.classList.add('flex');
  });

  // Click → scroll al hero y restaurar wizard
  btn.addEventListener('click', () => {
    hero?.scrollIntoView({ behavior: 'smooth' });
    document.dispatchEvent(new CustomEvent('budget-wizard-restore'));
    btn.classList.add('hidden');
    btn.classList.remove('flex');
  });

  // Mostrar/ocultar basado en scroll (si el wizard está visible en el hero)
  const observer = new IntersectionObserver(
    ([entry]) => {
      // Si el hero NO es visible y el wizard no fue minimizado manualmente
      if (!entry.isIntersecting) {
        btn.classList.remove('hidden');
        btn.classList.add('flex');
      } else {
        btn.classList.add('hidden');
        btn.classList.remove('flex');
      }
    },
    { threshold: 0.1 }
  );

  if (hero) observer.observe(hero);
</script>
```

**Posicionamiento:** `bottom-24` para que quede arriba del botón de WhatsApp (`bottom-6`). Ambos en `right-6`.

---

## Fase 2: Página `/cotizar` (implementar después)

Página completa con formulario detallado donde el usuario puede:
- Subir fotos, planos, videos
- Dar medidas exactas
- Describir el trabajo en detalle
- Dejar datos de contacto (nombre, email, teléfono, dirección)
- Recibir los datos pre-cargados si viene del wizard rápido (via query params)

**Archivo:** `src/pages/cotizar.astro`

**Flujo:**
1. El botón "Presupuesto detallado" del wizard navega a `/cotizar?tipo=depto&piso=3&ant=25&trabajos=bt,can&cbt=8&mcan=15&tcan=embutida`
2. La página lee los query params y pre-llena el formulario
3. El usuario completa info adicional + sube archivos
4. Submit → envía email (vía Formspree, Resend, o similar)

**No implementar aún.** Primero validar la fase 1 en producción.

---

## Resumen de archivos a crear/modificar

| Archivo | Acción | Complejidad |
|---|---|---|
| `src/data/prices.json` | CREAR | Baja — copiar JSON de arriba |
| `src/components/budget/BudgetWizard.astro` | CREAR | Baja — wrapper simple |
| `src/components/budget/budget-wizard.js` | CREAR | Media — adaptar prototipo validado |
| `src/components/budget/BudgetFloat.astro` | CREAR | Baja — botón + observer |
| `src/components/sections/Hero.astro` | MODIFICAR | Media — cambiar layout a 2 col |
| `src/layouts/BaseLayout.astro` | MODIFICAR | Baja — agregar 1 import + 1 línea |

**No se toca:** `index.astro`, `global.css`, `package.json` (no hay dependencias nuevas).

---

## Instrucciones para Claude Code

Si vas a usar Claude Code en tu terminal, copiá este prompt:

```
Necesito implementar un wizard de presupuesto rápido en mi proyecto Astro.

CONTEXTO:
- Proyecto en /Users/carigonz/code/web-app
- Astro 5 + Tailwind 4 (ver package.json)
- Colores del theme en src/styles/global.css (secondary-* es el dorado/amber)
- Hero actual en src/components/sections/Hero.astro (columna única)
- Layout en src/layouts/BaseLayout.astro (tiene WhatsAppFloat)

ARCHIVOS ADJUNTOS AL PROYECTO en claude.ai (ver plan completo):
- PLAN_IMPLEMENTACION_WIZARD.md — plan detallado con código de cada archivo
- presupuesto-wizard.jsx — prototipo funcional del wizard (React, adaptar a vanilla JS)

TAREAS EN ORDEN:
1. Crear src/data/prices.json (copiar del plan)
2. Crear src/components/budget/BudgetWizard.astro (wrapper)
3. Crear src/components/budget/budget-wizard.js (adaptar prototipo a vanilla JS, leer precios de window.__BUDGET_PRICES__, usar CSS vars del theme sobre fondo oscuro primary-900)
4. Modificar src/components/sections/Hero.astro (grid 2 col, wizard en la derecha)
5. Crear src/components/budget/BudgetFloat.astro (botón flotante con IntersectionObserver)
6. Modificar src/layouts/BaseLayout.astro (importar BudgetFloat)

IMPORTANTE:
- El wizard es 100% vanilla JS, sin React ni dependencias nuevas
- Los precios salen de prices.json inyectado via define:vars
- El wizard vive sobre bg-primary-900 (fondo oscuro) → textos blancos, bordes con alpha blanco
- El color de acento es secondary-600/700 (dorado)
- Mobile: stack (texto arriba, wizard abajo). Desktop: 2 columnas
- Botón flotante ⚡ aparece al scrollear fuera del Hero, posicionado arriba del botón WhatsApp
```

---

## Orden de trabajo recomendado

1. Crear `prices.json` → verificar que el import funcione
2. Crear `budget-wizard.js` + `BudgetWizard.astro` → testear aislado
3. Modificar `Hero.astro` → verificar layout 2 columnas responsive
4. Crear `BudgetFloat.astro` + modificar `BaseLayout.astro` → verificar botón flotante
5. Test completo del flujo: wizard → resultado → WhatsApp → minimizar → flotante → scroll → restaurar
6. Deploy y validar en mobile
