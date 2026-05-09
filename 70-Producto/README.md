# Mapa Inestable — Contexto de plataforma

Documento de referencia para agentes y colaboradores que trabajen en la plataforma técnica. Describe qué existe, dónde vive, cómo está organizado y cuáles son las reglas que no se negocian.

---

## El proyecto en una oración

Mapa Inestable es una plataforma de análisis político estructural sobre Sudamérica. Identifica transformaciones profundas —no coyuntura— a través de seis ejes conceptuales propios y un método de cuatro pasos.

El sitio vive en producción en Vercel. El vault de conocimiento vive en Obsidian. Son dos sistemas que se complementan.

---

## Estructura del repositorio

```
/ (raíz = vault Obsidian)
├── 10-Ejes/               Marco conceptual: los 6 ejes desarrollados
├── 20-Metodo/             El método de 4 pasos y principios editoriales
├── 30-Autores/            Notas sobre autores de referencia (Roy, Han, Harari, Huntington...)
├── 35-Conceptos-clave/    Conceptos transversales con sus fuentes
├── 40-Disparadores/       Escenas/eventos procesados como disparadores
├── 50-Publicaciones/      Índice del Substack (publicaciones ya salidas)
├── 60-Borradores/         Piezas en desarrollo
├── 70-Producto/           ← ESTÁS ACÁ
│   ├── README.md          Este archivo
│   ├── specs/             Especificaciones de features (01-09)
│   └── design-system/     Tokens CSS, guía visual, prototipo HTML
└── platform/              La plataforma web
    ├── START.md            Instrucciones de arranque (dev local)
    ├── frontend/           Next.js 15, App Router, TypeScript
    │   ├── src/app/        Rutas (páginas)
    │   ├── src/components/ Componentes reutilizables
    │   ├── src/lib/        Datos y lógica compartida
    │   └── public/         Estáticos (favicon.svg, GeoJSON del mapa)
    └── backend/            FastAPI + PostgreSQL (pendiente de completar)
```

---

## Stack técnico

| Capa | Tecnología | Estado |
|---|---|---|
| Frontend | Next.js 15 (App Router), TypeScript, React | Activo en prod |
| Estilos | CSS custom properties (sin framework) | Activo |
| Fuentes | Google Fonts via `next/font` | Activo |
| Deploy | Vercel (rootDirectory: `platform/frontend`) | Activo |
| Backend | FastAPI (Python) | Skeleton — no conectado al frontend |
| Base de datos | PostgreSQL | Pendiente |
| Contenido | Archivos `.md` del vault, bundleados en build | Activo (parcial) |

**Estado real del frontend:** el sitio funciona con datos hardcoded (mock). El backend existe como esqueleto pero el frontend no lo consume todavía. Los datos reales (análisis, países, fuentes) viven en los archivos lib/*.ts como constantes hasta que el backend esté listo.

---

## Páginas implementadas

| Ruta | Archivo | Estado |
|---|---|---|
| `/` | `src/app/page.tsx` | Implementada con datos mock |
| `/analisis/[pais]/[slug]` | `src/app/analisis/[pais]/[slug]/page.tsx` | Implementada con datos mock |
| `/pais/[slug]` | `src/app/pais/[slug]/page.tsx` | Implementada — lee `.md` del vault |
| `/despachos` | `src/app/despachos/page.tsx` | Implementada |
| `/despachos/[ano]/[semana]` | `src/app/despachos/[ano]/[semana]/page.tsx` | Implementada |
| `/ejes` | `src/app/ejes/page.tsx` | Implementada |
| `/ejes/[slug]` | `src/app/ejes/[slug]/page.tsx` | Implementada |
| `/ensayos` | `src/app/ensayos/page.tsx` | Implementada |
| `/ensayos/[slug]` | `src/app/ensayos/[slug]/page.tsx` | Implementada |
| `/mapa` | — | No implementada |
| `/autor/[slug]` | — | No implementada (Spec 07) |
| `/concepto/[slug]` | — | No implementada (Spec 07) |

---

## Componentes

| Archivo | Qué hace |
|---|---|
| `components/Logo.tsx` | Logo SVG de Sudamérica invertida. Props: `variant` (full/icon/wordmark), `size` (sm/md/lg), `color` |
| `components/SiteHeader.tsx` | Header del sitio con navegación |
| `components/SiteFooter.tsx` | Footer con links a ejes, países, hipótesis |
| `components/MapaSudamerica.tsx` | Mapa D3.js con GeoJSON — Sudamérica invertida |

---

## Datos y librerías (`src/lib/`)

| Archivo | Qué contiene |
|---|---|
| `lib/ejes.ts` | Datos de los 6 ejes: slug, nombre, definición, texto pedagógico, autores. También `AXIS_KEY_TO_SLUG` y mock de análisis por eje. |
| `lib/country-data.ts` | Perfiles de países: ejes crónicos, fuentes monitoreadas, análisis mock |
| `lib/content.ts` | Parser de archivos `.md` del vault para páginas de país |
| `lib/api.ts` | Cliente HTTP preparado para el backend (no activo) |

---

## El design system: dirección Grabado

**Todo el sistema visual está codificado en `src/app/globals.css` como CSS custom properties.**
No existe Tailwind, no existe styled-components, no existe ningún framework de CSS.

### Reglas que no se negocian

1. **Sin hex hardcodeados fuera de `globals.css`.** Siempre `var(--mi-*)`.
2. **Sin `border-radius`.** Todo es recto. `--mi-radius: 0`.
3. **Sombras sólidas, no difusas.** `box-shadow: 6px 6px 0 var(--mi-ink)` — nunca `blur`.
4. **Cuatro fuentes, una jerarquía:**
   - `var(--mi-font-display)` → Alfa Slab One — marcas, nombres de país, números grandes
   - `var(--mi-font-title)` → Fraunces — títulos pensados, lede
   - `var(--mi-font-body)` → Lora — prosa larga
   - `var(--mi-font-mono)` → IBM Plex Mono — metadata, fechas, tags, labels
5. **El sur arriba siempre.** El logo y el mapa tienen Sudamérica con el sur en el extremo superior. Es referencia a *América Invertida* de Torres García (1943) y es una declaración, no un truco.

### Paleta de colores

| Token | Valor | Uso |
|---|---|---|
| `--mi-bg` | `#C5663A` | Terracota. Fondo dominante del sitio |
| `--mi-bg-paper` | `#F4E9D2` | Crema. Páginas de lectura, cards |
| `--mi-bg-dark` | `#1F2A12` | Verde-negro. Footer, secciones inversas, citation block |
| `--mi-ink` | `#1F2A12` | Tinta principal (no es negro puro) |
| `--mi-accent-gold` | `#E8C58A` | Oro. Énfasis sobre fondos oscuros |

### Colores semánticos por eje

| Eje | axisKey (CSS) | Color |
|---|---|---|
| Deculturación | `deculturacion` | `#6B4A38` |
| Erosión de mediaciones | `mediaciones` | `#4A5C30` |
| Desrepresentación | `desrepresentacion` | `#8A4A55` |
| Estetización | `estetizacion` | `#B45729` |
| Desorientación epistemológica | `desorientacion` | `#2D4A6B` |
| Atención | `atencion` | `#C8993E` |

Uso: `var(--mi-axis-{axisKey})`. Ejemplo: `var(--mi-axis-mediaciones)`.

---

## Los 6 ejes — referencia rápida

| # | Nombre | Slug URL | axisKey (CSS) | Definición corta |
|---|---|---|---|---|
| 01 | Deculturación | `deculturacion` | `deculturacion` | La cultura deja de ser estructura normativa y pasa a funcionar como repertorio simbólico |
| 02 | Erosión de mediaciones | `erosion-de-mediaciones` | `mediaciones` | Las instituciones que organizaban la experiencia colectiva pierden peso o son reemplazadas por mediaciones opacas |
| 03 | Desrepresentación | `desrepresentacion` | `desrepresentacion` | Las instituciones políticas siguen existiendo pero pierden capacidad de generar identificación |
| 04 | Estetización | `estetizacion` | `estetizacion` | Los símbolos culturales circulan sin anclaje histórico, transformándose en productos consumibles |
| 05 | Desorientación epistemológica | `desorientacion-epistemologica` | `desorientacion` | Se debilita la capacidad de distinguir lo real, lo verdadero y lo relevante |
| 06 | Atención | `atencion` | `atencion` | La atención se convierte en la principal mediación invisible que organiza la experiencia |

**Importante:** el `axisKey` (para CSS vars) y el `slug` (para URLs) son distintos en algunos ejes. Ver `src/lib/ejes.ts` para el mapping completo (`AXIS_KEY_TO_SLUG`).

---

## Los 10 países

Argentina (`ar`), Brasil (`br`), Chile (`cl`), Colombia (`co`), Bolivia (`bo`), Perú (`pe`), Uruguay (`uy`), Paraguay (`py`), Ecuador (`ec`), Venezuela (`ve`).

---

## El método editorial (4 pasos)

Cada análisis sigue esta estructura obligatoria:

1. **Disparador** — una escena concreta: noticia, imagen, estadística
2. **Desplazamiento** — del evento al proceso estructural que revela
3. **Conceptualización** — interpretación a través de los ejes
4. **Apertura** — pregunta sin respuesta que mantiene la tensión abierta

Esto se refleja en el modelo de datos: `step_disparador`, `step_desplazamiento`, `step_conceptualizacion`, `step_apertura`.

---

## Modelo de datos (lógico)

```
Country     slug, name, perfil_estructural, ejes_cronicos[], fuentes[]
Axis        slug, name, definicion_corta, que_describe, autores_referenciados[]
Source      id, country_slug, name, url, rss_url, type (hegemonic|alternative|analysis)
Event       id, country_slug, title, url, medium, author, published_at, week, year
EventAxis   event_id, axis_slug, is_primary
Analysis    id, slug, country_slug, week, year,
            title, lede,
            step_disparador, step_desplazamiento, step_conceptualizacion, step_apertura,
            source_primary {url, medium, author, published_at},
            status (draft|published), published_at
AnalysisAxis  analysis_id, axis_slug, is_primary
Dispatch    id, year, week, title, entrada, cierre, pregunta_semana, status, published_at
DispatchBlock dispatch_id, order, type (analysis|connector), analysis_id?, body?
```

---

## Requisito de trazabilidad (no negociable)

Cada análisis debe declarar:
- Fuente primaria con URL
- Medio de comunicación
- Fecha de publicación
- Autor (cuando aplica)

Este requisito es estructural. El proyecto trata sobre desorientación epistemológica — no puede operar sin trazabilidad de sus propias fuentes.

---

## Specs del producto

| Archivo | Título | Estado |
|---|---|---|
| `specs/01-arquitectura-sitio.md` | Arquitectura del sitio (MVP) | Referencia base |
| `specs/02-mobile-responsive.md` | Mobile responsive | Pendiente |
| `specs/03-logo-portada.md` | Logo y portada | **Implementada** |
| `specs/04-paginas-ejes.md` | Páginas de eje individuales | **Implementada** |
| `specs/05-archivo-buscador.md` | Archivo y buscador | Pendiente |
| `specs/06-marco-conceptual-publico.md` | Marco conceptual público | Pendiente |
| `specs/07-puente-vault-sitio.md` | Puente vault → sitio | Pendiente |
| `specs/08-coherencia-editorial.md` | Coherencia editorial | Pendiente |
| `specs/09-vision-proximo-desarrollo.md` | Visión próximo desarrollo | Referencia futura (no scope inmediato) |
| `specs/10-integracion-latinobarometro.md` | Integración Latinobarómetro | Referencia futura |

Para ejecutar una spec: leer el archivo completo antes de escribir una línea de código. Las specs definen el layout, los datos requeridos y los criterios de aceptación.

---

## Cómo arrancar el frontend en desarrollo

```bash
cd platform/frontend
npm install
npm run dev
# http://localhost:3000
```

El backend no es necesario para el frontend actual — los datos son hardcoded en `src/lib/`.

---

## Decisiones de diseño que no se re-discuten

| Decisión | Resolución |
|---|---|
| Mapa invertido | Sur arriba — referencia explícita a Torres García. Siempre. |
| Sin border-radius | `0` en todo el sistema. |
| Sin framework CSS | CSS custom properties nativo. Sin Tailwind, sin styled-components. |
| Citas obligatorias | Cada análisis tiene fuente primaria con URL. No es opcional. |
| Sombras sólidas | `offset offset 0 color`. Sin blur. |
| Cuatro fuentes | Alfa Slab One + Fraunces + Lora + IBM Plex Mono. Sin excepciones. |
| Hex sólo en globals.css | Todo lo demás usa `var(--mi-*)`. |

---

## Lo que no existe todavía

- **Conexión frontend-backend**: el frontend no consume la API. Los datos son mocks en `lib/`.
- **Autenticación admin**: las páginas `/admin` no existen.
- **Mapa full-screen** (`/mapa`): el componente `MapaSudamerica.tsx` existe pero la página no.
- **Páginas de autor** (`/autor/[slug]`): referenciadas desde `/ejes/[slug]` pero retornan 404.
- **Páginas de concepto** (`/concepto/[slug]`): igual que autores.
- **Buscador full-text**: Spec 05, pendiente.
- **Mobile responsivo**: Spec 02, pendiente. El sitio no está optimizado para móvil.
