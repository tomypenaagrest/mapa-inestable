---
spec: 54
titulo: Performance budget LATAM — LCP, FCP, bundle, imágenes, fuentes calibrados a 4G
estado: lista
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-26
afecta:
  - platform/frontend/next.config.js (image optimization, font optimization, bundle analyzer)
  - platform/frontend/src/app/layout.tsx (preconnect, font preload, viewport meta)
  - platform/frontend/src/components/*.tsx (lazy loading, dynamic imports donde corresponda)
  - platform/frontend/public/covers/ (Spec 37 — conversión PNG → WebP en el sync)
  - platform/frontend/scripts/sync-covers.mjs (Spec 37 — sumar paso de conversión a WebP)
  - platform/frontend/package.json (bundle size limit en CI, lighthouse-ci)
  - 70-Producto/design-system/design-system.md (notas sobre carga de fuentes)
depende_de: [22, 37, 49, 50, 51, 52, 53]
relaciona_con: [Spec 22 §18.5 (extiende los performance targets que esa spec declaró), Spec 37 (portadas — esta spec define la conversión a WebP), Spec 49 (mapa con touch handlers — esta spec define el budget del componente), Spec 50 (reading — esta spec define el budget del article CSS), Spec 51 (home — esta spec define el budget del home), Spec 52 (país — esta spec define el budget del dashboard), Spec 53 (drawer — esta spec define el budget del componente), EPIC-04 (sexta y última spec hija)]
prioridad: alta
bloqueante_de: AE1 + AE7 del epic (LCP < 2.5s + bundle inicial home ≤ 250KB)
desbloquea: lanzamiento de julio con confianza de que el sitio carga rápido en LATAM 4G urbano sin sorpresas en device real
---

# 54 · Performance budget LATAM — LCP, FCP, bundle, imágenes, fuentes calibrados a 4G

## Resumen ejecutivo

EPIC-04 declaró performance como una de las cuatro condiciones del lanzamiento. Spec 22 §18.5 había declarado LCP < 2.5s en 4G simulado como meta inicial. Esta spec consolida el sistema completo de performance budget para mobile LATAM, calibrado a la decisión cerrada en EPIC-04 r5: **target = 4G LATAM, no 3G**. El supuesto operativo: el lector tipo de Mapa Inestable accede desde 4G urbano o WiFi (suscriptor potencial de Substack pago en LATAM). El caso 3G inestable existe pero no es el target — se acepta degradación gradual en ese 5-10% del mercado.

Esta spec no es de UI: es **transversal y técnica**. Define presupuestos concretos por vista (KB de bundle, ms de LCP, KB de imagen máximo), reglas de carga (lazy, priority, code splitting), y cómo se mide en CI antes de cada merge. Hereda decisiones de las otras 5 specs del epic (50, 51, 52, 53, 49) y las traduce a constraints operativos.

**Outcome.** Un lector LATAM 4G urbano carga el home en < 2.5s LCP / < 1.8s FCP, el bundle JS del home pesa ≤ 250KB gzipped, las fuentes no causan flash de texto invisible (FOIT), las portadas se sirven en WebP con fallback automático a PNG, y las vistas críticas (home, país, análisis) tienen presupuestos individuales medidos en CI. Si una PR rompe el budget, no merge.

**Lo que entra en r1:**

- Tabla de presupuestos por vista: LCP, FCP, CLS, INP, bundle JS inicial, bundle CSS, imagen LCP máx.
- Estrategia de imágenes: WebP con fallback PNG, `next/image` con `sizes` y `priority`, lazy loading below-the-fold.
- Estrategia de fuentes: 4 familias con weights mínimos, `font-display: swap`, preload de las críticas, self-hosting vía `@fontsource` (Spec 50 ya las usa así).
- Estrategia de hidratación: server components donde posible, dynamic imports para componentes pesados (mapa, heatmap, carrusel).
- Code splitting por ruta (Next.js App Router lo hace automático — esta spec confirma que se usa).
- Lighthouse-ci en CI con el budget declarativo.
- Pasos concretos de validación pre-merge.
- Cross-refs a las otras specs del epic.

**Lo que NO entra en r1:**

- Service Worker / PWA / offline. Diferido a EPIC-05.
- CDN externo (Cloudflare, Cloudinary). Vercel deployment cubre lo necesario para r1.
- Optimización para 3G. La decisión de target = 4G cierra esto.
- Server-Side rendering del mapa SVG (ya es SSR por defecto en Next.js App Router).
- Compression Brotli específico (Vercel ya lo hace por default).
- Critical CSS inline. Next.js App Router lo maneja; no requiere intervención manual.
- A/B testing de variantes de performance. Diferido.

---

## Estado actual

### En Spec 22 §18.5

Declaró:
- LCP < 2.5s en 4G simulado.
- Bundle SVG del mapa ≤ 80KB.
- FCP < 1.8s en 4G.
- Total Blocking Time < 200ms.

Esta spec **extiende** esos targets a todas las vistas críticas y los formaliza con metodología de medición.

### En las otras specs de EPIC-04

| Spec | Decisión con impacto de performance |
|---|---|
| 50 (reading) | Article CSS dedicado ≤ 8KB gzipped, fuentes con `font-display: swap`, sin imágenes externas obligatorias |
| 51 (home) | Mapa SVG inline, sin imágenes arriba del fold, footer post-fold con lazy fonts |
| 52 (país) | Heatmap 6×12 reusa Spec 50; sparklines SVG inline (sin librería chart) |
| 53 (drawer) | `focus-trap-react` ~3KB gzipped (OK para budget); drawer estado en CSS, no JS pesado |
| 49 (mapa touch) | `useMapGestures` hook custom (sin librería); `transform: translate3d()` GPU |

### En el frontend

Hoy `next.config.js` tiene `images.formats: ['image/webp']` y `swcMinify: true` (Next 13+ default). No hay `bundle analyzer` corriendo en CI. No hay `lighthouse-ci`. Las fuentes se cargan desde Google Fonts (no self-hosted con `@fontsource`).

Esta spec corrige todos esos puntos.

---

## Propuesta

### 1. Presupuestos por vista

Vistas críticas del lanzamiento de julio (las 4 que EPIC-04 declaró). Cada una con sus targets:

| Vista | LCP target | FCP target | CLS | INP | Bundle JS inicial | Bundle CSS | Imagen LCP máx |
|---|---|---|---|---|---|---|---|
| **Home** (`/`) | < 2.5s | < 1.8s | < 0.1 | < 200ms | ≤ 250KB gz | ≤ 30KB gz | n/a (mapa SVG inline) |
| **Página de país** (`/pais/[slug]`) | < 2.5s | < 1.8s | < 0.1 | < 200ms | ≤ 220KB gz | ≤ 35KB gz | n/a (sin portada por default) |
| **Lectura de análisis** (`/analisis/.../[slug]`, `/publicaciones/[slug]`, `/despachos/[slug]`, `/ensayos/[slug]`) | < 2.0s | < 1.5s | < 0.1 | < 200ms | ≤ 180KB gz | ≤ 25KB gz | ≤ 80KB (portada in-flow 3:2) |
| **Mapa standalone** (`/mapa`) | < 2.5s | < 1.8s | < 0.1 | < 200ms | ≤ 260KB gz | ≤ 30KB gz | n/a |

**Notas:**

- **Home y mapa** tienen budgets ligeramente más altos (250-260KB) porque incluyen el mapa SVG (~25KB) + lógica de gestos (Spec 49, ~15KB).
- **Lectura** es la más liviana (180KB) porque es renderizado server-first con poca interactividad arriba del fold.
- **Imagen LCP** solo aplica a lectura (la portada in-flow es el elemento más grande arriba del fold).

**Vistas secundarias** (archivo, ejes, conceptos, autores, /buscador): mismo target que la más liviana (180KB JS / 25KB CSS) — no son foco del epic pero no deben degradar.

### 2. Estrategia de imágenes

**Formato.** WebP con fallback automático a PNG.

```jsx
// next.config.js
module.exports = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [360, 414, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
  }
};
```

**Componente.** `next/image` siempre, nunca `<img>` directo.

```jsx
<Image
  src="/covers/diario/argentina-sin-cruzadas.webp"
  alt="Argentina sin cruzadas"
  width={360}
  height={240}
  sizes="(max-width: 640px) 100vw, 50vw"
  priority={isHero}  // true solo para LCP element
  placeholder="blur"
  blurDataURL={...}
/>
```

**Tres reglas críticas:**

1. **El elemento LCP siempre con `priority={true}`** y `fetchpriority="high"`. Sin esto, el LCP se duplica.
2. **`sizes` obligatorio** para que Next genere el `srcset` correcto y no mande 1920px a un mobile 360.
3. **`placeholder="blur"`** en todas las imágenes para evitar CLS (layout shift cuando la imagen carga).

**Conversión PNG → WebP en el sync.** Spec 37 define `scripts/sync-covers.mjs`. Esta spec extiende el script para convertir cada PNG a WebP en el mismo paso (vía `sharp`). Ambos archivos viven en `public/covers/`; Next decide cuál servir según `Accept` header del browser.

```js
// scripts/sync-covers.mjs (extension)
import sharp from 'sharp';

async function syncCover(srcPath, destPath) {
  await fs.copyFile(srcPath, destPath); // PNG
  await sharp(srcPath)
    .webp({ quality: 80 })
    .toFile(destPath.replace('.png', '.webp')); // WebP
}
```

WebP a quality 80 reduce ~50% el peso vs PNG sin pérdida visible para portadas.

**Imágenes externas (RSS, embeds futuros).** No las tenemos en r1. Si aparecen, vía `next/image` con dominio whitelisteado.

### 3. Estrategia de fuentes

**4 familias activas (Spec 50):** Alfa Slab One, Fraunces (400 italic + 600), Lora (400 + 400 italic + 600), IBM Plex Mono (400 + 500). Total = 4 familias × ~2-3 weights = ~8 archivos de fuente.

**Self-host con `@fontsource`.** No usar Google Fonts CDN externo (peor LCP por preconnect + DNS lookup + descarga de archivo grande). Usar `@fontsource/lora`, `@fontsource/fraunces`, etc. — los archivos quedan en el bundle del sitio.

```bash
npm install @fontsource/alfa-slab-one @fontsource/fraunces @fontsource/lora @fontsource/ibm-plex-mono
```

**Subsetting latin.** Solo cargar el subset latin (no cyrillic, no greek, no vietnamese). `@fontsource` provee `@fontsource/lora/latin-400.css` para cargar solo el subset que el sitio usa. Reducción típica: 60-70% del peso por archivo.

**Loading strategy.**

- `font-display: swap` global: el texto se renderiza con fuente de sistema mientras la custom carga (evita FOIT).
- **Preload** solo de las 2 críticas para arriba del fold: Alfa Slab One (display, country names) + Lora 400 (body de lede + bloques editoriales). Las otras se descargan sin preload (lazy).

```jsx
// app/layout.tsx
<link
  rel="preload"
  href="/_next/static/media/alfa-slab-one-latin-400.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>
<link
  rel="preload"
  href="/_next/static/media/lora-latin-400.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>
```

**Peso estimado:** 4 familias × ~15KB woff2 latin-400 subseteado = ~60KB total. Con preload de 2 críticas y lazy del resto, el bundle inicial paga ~30KB de fuente.

### 4. Estrategia de hidratación

**Server Components donde posible.** Next.js App Router por default. Componentes que no necesitan interactividad client-side (article body de Spec 50, página de país con tabs cuyo contenido es estático, footer, header navigation links) → server components → 0 JS al cliente.

**Dynamic imports para componentes pesados.**

```jsx
import dynamic from 'next/dynamic';

const MapaTorresGarcia = dynamic(() => import('@/components/MapaTorresGarcia'), {
  ssr: true,           // sí queremos el SVG en el HTML inicial
  loading: () => <MapaSkeleton />,
});

const Carousel = dynamic(() => import('@/components/Carousel'), {
  ssr: false,          // el carousel hidrata client-side, no necesita SSR
  loading: () => <CarouselSkeleton />,
});

const HeatmapAxisTime = dynamic(() => import('@/components/HeatmapAxisTime'), {
  ssr: true,
});
```

**Componentes a dynamic-import (mobile especialmente):**

- `Carousel` (Spec 51) — solo se ve post-fold.
- `HeatmapAxisTime` (Spec 52 + Spec 51) — solo se ve post-fold.
- `MobileNavDrawer` (Spec 53) — solo carga si el lector hace tap en ☰.
- `MapGestures` hook (Spec 49) — el hook se incluye en el bundle del mapa, no dynamic-import; pero los gestos solo se activan en `touchstart` (lazy attach del listener).

**Lo que NO se dynamic-importa:**

- `MapaTorresGarcia` — es el LCP element del home. Debe estar en el HTML inicial.
- `ThisWeekBlock` — arriba del fold.
- `ArticleBody` (Spec 50) — arriba del fold en lectura.

### 5. Code splitting

**Por ruta.** Next.js App Router lo hace automático: cada `page.tsx` genera su propio chunk. Esto significa que el bundle del home (250KB) NO incluye el JS de la página de país (220KB) ni de lectura (180KB) — cada uno se carga al navegar.

**Por componente.** Vía `dynamic()` como en §4.

**Shared chunks.** Lo común a todas las rutas (header, footer, design tokens) va en un `framework.js` compartido. Next lo maneja automáticamente.

**Análisis pre-merge.** Correr `@next/bundle-analyzer` localmente cuando se sume una nueva dependencia para ver el impacto. Si una dependencia es > 30KB gzipped, evaluar alternativa o lazy-import.

### 6. CSS

**Tailwind con purge agresivo.** El config de Tailwind detecta clases usadas en `tsx` y elimina el resto. CSS final ≤ 25-35KB gzipped por vista.

**CSS por archivo dedicado donde hay sistema.**

- `article.css` (Spec 50) — solo carga en rutas de lectura. ≤ 8KB gz.
- `country-page.css` (Spec 52) — solo carga en `/pais/[slug]`. ≤ 6KB gz.
- `home-mobile.css` (Spec 51) — solo carga en `/`. ≤ 5KB gz.
- `map.css` (Spec 49) — carga en home + `/mapa`. ≤ 4KB gz.

**Tokens del design system** (`design-tokens.css`) en `globals.css` — siempre. ≤ 3KB gz.

### 7. Métricas de medición

**Lighthouse-ci en CI.** Cada PR corre Lighthouse mobile en las 4 vistas críticas. Si falla algún budget, no merge.

Configuración propuesta (`lighthouserc.json`):

```json
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:3000",
        "http://localhost:3000/pais/argentina",
        "http://localhost:3000/analisis/borradores/argentina-sin-cruzadas",
        "http://localhost:3000/mapa"
      ],
      "settings": {
        "preset": "desktop",
        "throttlingMethod": "simulate",
        "throttling": {
          "rttMs": 150,
          "throughputKbps": 1638.4,
          "cpuSlowdownMultiplier": 4
        },
        "screenEmulation": {
          "mobile": true,
          "width": 360,
          "height": 800,
          "deviceScaleFactor": 2.625
        }
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.85 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 1800 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-blocking-time": ["warn", { "maxNumericValue": 200 }]
      }
    }
  }
}
```

**Bundle size limit en CI.** `size-limit` o `@next/bundle-analyzer` con threshold por ruta. Ejemplo `.size-limit.json`:

```json
[
  { "path": ".next/static/chunks/app/page-*.js", "limit": "250 KB" },
  { "path": ".next/static/chunks/app/pais/**/page-*.js", "limit": "220 KB" },
  { "path": ".next/static/chunks/app/analisis/**/page-*.js", "limit": "180 KB" }
]
```

**Validación en device real.** Antes del lanzamiento, correr WebPageTest desde nodos LATAM (São Paulo o Buenos Aires si están disponibles) con perfil 4G. Si los números coinciden con Lighthouse simulado, alta confianza. Si difieren > 30%, investigar.

### 8. Imágenes específicas del proyecto

**Portadas Gemini (Spec 37).** Ya están como PNG. Conversión a WebP en el sync (§2). Quality 80. Reducción ~50%.

**Logo del proyecto (Spec 21).** SVG inline en el header. No es imagen.

**Mapa Torres García.** SVG inline en el componente. No es imagen.

**Cruces de capitales del mapa.** Parte del SVG del mapa. No es imagen.

**Conclusión:** el sitio tiene **muy pocas imágenes** comparado con un sitio editorial típico. Las únicas son las portadas de los análisis. Eso es ventaja de performance.

### 9. Fuentes específicas — peso estimado

Calculo del peso de fuentes con `@fontsource` latin subseteado:

| Familia | Weight | Tamaño aprox (woff2 latin subset) |
|---|---|---|
| Alfa Slab One | 400 | ~14KB |
| Fraunces | 400 italic | ~22KB |
| Fraunces | 600 | ~22KB |
| Lora | 400 | ~18KB |
| Lora | 400 italic | ~19KB |
| Lora | 600 | ~18KB |
| IBM Plex Mono | 400 | ~16KB |
| IBM Plex Mono | 500 | ~16KB |

**Total con todos los weights:** ~145KB. **Solo crítico para arriba del fold (preload):** Alfa Slab 400 + Lora 400 = ~32KB.

El resto se carga sin preload — el lector ya está leyendo cuando llegan.

### 10. Acceptance criteria

Para cerrar Spec 54 como `implementada-completa`, deben pasar **todos** los siguientes en Lighthouse mobile (preset 360×800 throttling 4G fast) sobre las 4 vistas críticas:

| # | Criterio | Vista | Target |
|---|---|---|---|
| AE1 | LCP | Home | < 2.5s |
| AE2 | LCP | Página país | < 2.5s |
| AE3 | LCP | Lectura | < 2.0s |
| AE4 | LCP | /mapa | < 2.5s |
| AE5 | FCP | Todas | < 1.8s |
| AE6 | CLS | Todas | < 0.1 |
| AE7 | Bundle JS inicial home | Home | ≤ 250KB gz |
| AE8 | Bundle JS inicial país | Página país | ≤ 220KB gz |
| AE9 | Bundle JS inicial lectura | Lectura | ≤ 180KB gz |
| AE10 | Imagen LCP lectura | Lectura | ≤ 80KB (WebP) |
| AE11 | Sin FOIT (flash of invisible text) | Todas | Texto visible desde FCP |
| AE12 | Sin layout shift por imagen tardía | Todas | placeholder="blur" en todas |
| AE13 | Lighthouse-ci en CI corriendo | CI | Verde en main branch |
| AE14 | Validación WebPageTest desde nodo LATAM | Todas | Números dentro de ±30% del simulado |

---

## Lo que entra y no entra en r1 (resumen)

| Entra | No entra |
|---|---|
| Targets por vista (LCP, FCP, CLS, INP, bundles) | Service Worker / PWA / offline |
| WebP con fallback PNG + `next/image` | CDN externo (Cloudflare, Cloudinary) |
| Self-host de 4 familias con `@fontsource` + subset latin | Optimización para 3G |
| Preload de 2 fuentes críticas | Critical CSS inline manual |
| Dynamic imports de componentes post-fold | A/B testing de variantes |
| Lighthouse-ci en CI con assertions | Compression Brotli específico |
| Size-limit por ruta en CI | Variantes con SSG vs ISR caso por caso |
| Validación en device real LATAM | |

---

## Cross-refs y actualizaciones

- `70-Producto/specs/22-mapa-interactivo-torres-garcia.md` §18.5: marcar como EXTENDIDO por Spec 54 (esta spec mantiene los targets de 22 y los pone en sistema medible).
- `70-Producto/specs/37-portadas-en-el-sitio.md` §2: actualizar el pipeline `sync-covers.mjs` para incluir conversión a WebP. Schema del frontmatter no cambia (sigue siendo `cover_image: 90-Portadas/...png`).
- `70-Producto/specs/50-reading-experience-mobile.md` §6: confirmar que el budget de `article.css` es ≤ 8KB gz como ya se declaró.
- `70-Producto/specs/51-home-mobile.md`: confirmar el budget del home ≤ 250KB JS / 30KB CSS.
- `70-Producto/specs/52-pagina-pais-mobile.md`: confirmar el budget de la página país ≤ 220KB JS / 35KB CSS.
- `70-Producto/specs/53-navegacion-mobile.md`: confirmar que `MobileNavDrawer` y `focus-trap-react` están dentro del budget del home (el drawer se carga lazy al primer tap en ☰).
- `70-Producto/specs/49-touch-handlers-mapa.md`: confirmar que `useMapGestures` ~15KB está dentro del budget del home.
- `70-Producto/design-system/design-system.md`: agregar nota en §Implementación técnica sobre el self-host de fuentes con `@fontsource` (reemplaza Google Fonts CDN).

---

## Implementación

| # | Tarea | Estimación | Dependencia |
|---|---|---|---|
| 1 | Migrar fuentes de Google Fonts CDN a `@fontsource` (instalar paquetes, importar en globals, eliminar `<link>` externos) | 1.5h | — |
| 2 | Agregar preload de fuentes críticas en `app/layout.tsx` | 30min | tarea 1 |
| 3 | Configurar `next/image` en todos los components que usen imágenes (`CoverImage` Spec 37, eventual nuevo) con `sizes`, `priority` selectivo, `placeholder="blur"` | 2h | — |
| 4 | Extender `scripts/sync-covers.mjs` con conversión PNG→WebP via `sharp` | 1h | — |
| 5 | Convertir las 11+ portadas existentes a WebP (correr el sync una vez) | 15min | tarea 4 |
| 6 | Dynamic import de componentes post-fold (Carousel, HeatmapAxisTime, MobileNavDrawer) | 2h | — |
| 7 | Configurar `@next/bundle-analyzer` localmente y validar bundles actuales vs targets | 1.5h | tareas 1, 3, 6 |
| 8 | Instalar y configurar `lighthouse-ci` con `lighthouserc.json` | 2h | tarea 7 |
| 9 | Instalar `size-limit` con `.size-limit.json` por ruta | 1h | tarea 7 |
| 10 | Sumar Lighthouse-ci + size-limit al workflow de CI (GitHub Actions o equivalente) | 1.5h | tareas 8, 9 |
| 11 | Validación inicial en device real (Samsung A54) sobre las 4 vistas con DevTools throttling 4G fast | 2h | tarea 10 |
| 12 | Validación WebPageTest desde nodo LATAM (São Paulo si está disponible) | 1h | tarea 11 |
| 13 | Cross-refs: actualizar Specs 22, 37, 50, 51, 52, 53, 49, design system | 1h | tareas 1-12 |

**Estimación total:** 17 horas (~2 días de trabajo).

**Orden de implementación:** tareas 1-2 primero (fuentes — impacto inmediato en LCP). Tarea 3 en paralelo (imágenes). Tarea 4-5 en paralelo (WebP). Después tareas 6-7 (dynamic imports + análisis). Después tareas 8-10 (CI). Tareas 11-12 al final (validación). Tarea 13 cualquier momento.

---

## Maqueta

Sin mockups visuales. Spec 54 es transversal y técnica. La "maqueta" es la tabla de presupuestos del §1 + la configuración de `lighthouserc.json` del §7.

---

## Histórico

| Fecha | Cambio | Razón |
|---|---|---|
| 2026-05-26 | Creación de la spec en estado `lista`. Tabla de presupuestos calibrada a 4G (decisión cerrada en EPIC-04 r5). Sistema medible en CI con Lighthouse y size-limit | Sexta y última spec hija de EPIC-04. Cierra el epic. El sistema de performance está pensado para garantizar la promesa del lanzamiento de julio: el lector LATAM 4G urbano carga el sitio sin notar lag |
