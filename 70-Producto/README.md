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
│   ├── specs/             Especificaciones de features (01-33) + bug reports (BUG-NNN)
│   ├── mockups/           Previews HTML de componentes (referencia visual antes de implementar)
│   └── design-system/     Tokens CSS, guía visual, prototipo HTML
└── platform/              La plataforma web
    ├── START.md            Instrucciones de arranque (dev local)
    ├── frontend/           Next.js 15, App Router, TypeScript
    │   ├── src/app/        Rutas (páginas)
    │   ├── src/components/ Componentes reutilizables
    │   ├── src/lib/        Datos y lógica compartida
    │   └── public/         Estáticos (favicon.svg, GeoJSON del mapa)
    ├── backend/            FastAPI + PostgreSQL (pendiente de completar)
    └── data/               Datasets externos procesados (Latinobarómetro, futuros)
        └── latinobarometro-2024/    Pipeline Python + indicators.json (ver Spec 12B)
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
| `components/MapaSudamerica.tsx` | Mapa D3.js con GeoJSON — Sudamérica invertida con hot-zones por país (Spec 22) |
| `components/CountryDashboard.tsx` | Dashboard tabular del país (Spec 16): 6 tabs — publicaciones, diagnóstico, pulso, estructura, contexto, fuentes. Spec 27 agrega una 7ma tab (agenda) entre publicaciones y diagnóstico. |

---

## Datos y librerías (`src/lib/`)

| Archivo | Qué contiene |
|---|---|
| `lib/ejes.ts` | Datos de los 6 ejes: slug, nombre, definición, texto pedagógico, autores. También `AXIS_KEY_TO_SLUG` y mock de análisis por eje. |
| `lib/country-data.ts` | Perfiles de países: ejes crónicos, fuentes monitoreadas, análisis mock |
| `lib/content.ts` | Parser de archivos `.md` del vault — `getCountrySections`, `getAllAgentDrafts`, etc. |
| `lib/analisis.ts` | Tipos y helpers de análisis (`AnalisisEntry`, filtros). Pendiente conexión con publicaciones del vault (Spec 26). |
| `lib/latinobarometro.ts` | Loader de los 12 indicadores LB 2024 desde `data/latinobarometro-2024/indicators.json` (Spec 12B) |
| `lib/macro-indicators.ts` | Loader de los 24 indicadores macro (Spec 14A). Pipeline pendiente; tolera estado placeholder. |
| `lib/agendas.ts` | (Spec 27 — pendiente) Loader de agendas por país desde `15-Países/agendas/<slug>.md` |
| `lib/api.ts` | Cliente HTTP preparado para el backend (no activo) |

---

## Datasets externos (`platform/data/`)

Datos de fuentes externas procesados con Python y serializados a JSON para consumo del frontend. Cada dataset vive en su propio subdirectorio con: el código del pipeline, el output JSON committed al repo, un README con metodología, y los archivos crudos en `raw/` (gitignored).

| Carpeta | Contenido | Estado | Spec |
|---|---|---|---|
| `latinobarometro-2024/` | Microdatos LB 2024 → 12 indicadores × 17 países (`indicators.json`, 30 KB) | ✓ Generado y validado | [12B](specs/12B-pipeline-lb2024.md) |

**Convención:** los CSV/PDF crudos se mantienen fuera del repo (`.gitignore`). El JSON producido sí se committea — es chico, reproducible desde el pipeline, y debe estar disponible para el frontend en build sin pasos adicionales.

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

### Features (numeradas)

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
| `specs/09-vision-proximo-desarrollo.md` | Visión próximo desarrollo | Referencia futura |
| `specs/10-integracion-latinobarometro.md` | Integración Latinobarómetro (marco general) | Referencia base para Spec 12 |
| `specs/11-rediseno-home-dashboard.md` | Rediseño de home como dashboard | Pendiente |
| `specs/12-pulso-ciudadano-ficha-pais.md` | Pulso ciudadano LB 2024 en ficha de país | Datos listos · UI integrada en Spec 16 |
| `specs/12A-curaduria-12-indicadores.md` | Anexo 12A — curaduría de 12 indicadores | ✓ Cerrada |
| `specs/12B-pipeline-lb2024.md` | Anexo 12B — pipeline de carga LB2024 | ✓ Ejecutada |
| `specs/13-pagina-comparativa-paises.md` | Página comparativa cross-país (LB 2024) | Pendiente · post-Spec 12 |
| `specs/14-indicadores-estructurales.md` | Indicadores estructurales (marco macro) | Marco cerrado · pipeline pendiente |
| `specs/14A-curaduria-24-indicadores.md` | Anexo 14A — curaduría de 24 indicadores macro | ✓ Cerrada |
| `specs/15-capas-de-contexto-y-journey.md` | Capas de contexto y journey del lector recurrente | Pendiente |
| `specs/16-dashboard-de-pais.md` | Dashboard de país (rediseño tabular) | **Implementada** (shell + 6 tabs) |
| `specs/17-modelo-de-contenido-ensayos-publicaciones-pais.md` | Modelo de contenido ensayos / publicaciones / país | Pendiente |
| `specs/18-bugfixes-header-y-mapa.md` | Bugfixes header y mapa | Pendiente |
| `specs/19-ensayos-como-revista.md` | Ensayos como revista | Pendiente |
| `specs/20-sidebar-autores-conceptos.md` | Sidebar autores y conceptos | Pendiente |
| `specs/21-identidad-visual-logo-escalador.md` | Identidad visual — logo escalador | **Implementada** |
| `specs/22-mapa-interactivo-torres-garcia.md` | Mapa interactivo Torres García con hot-zones | **Implementada** |
| `specs/23-frontmatter-en-agente-diario.md` | Frontmatter del agente diario | **Implementada** (borradores con YAML estructurado) |
| `specs/24-promover-borrador-a-publicacion.md` | Promover borrador del agente a publicación | **Implementada** (`scripts/promote-draft.mjs` + npm run) |
| `specs/25-pipeline-de-produccion-visible.md` | Pipeline de producción visible | Pendiente |
| `specs/26-cargar-publicaciones-del-vault-al-sitio.md` | Cargar publicaciones del vault al sitio | En curso |
| `specs/27-agendas-por-pais.md` | Agendas por país (tab vivo del dashboard) | Borrador r1 |
| `specs/28-scheduled-task-agendas-cowork.md` | Scheduled task semanal de agendas (Cowork) | **Implementada** (10 tasks + `npm run promote-agenda`) |
| `specs/29-calendario-agentes-automaticos.md` | Calendario de agentes automáticos (documento vivo) | Borrador r1 |
| `specs/30-home-derivada-del-corpus.md` | Home derivada del corpus real (sin fixtures) | Borrador r1 · post-Spec 26 |
| `specs/31-despachos-del-vault-al-sitio.md` | Despachos del vault al sitio (/despachos y detalle) | Borrador r1 · post-Spec 26 |
| `specs/32-vista-publica-borradores-diarios.md` | Vista pública de borradores diarios del agente | Borrador r1 |
| `specs/33-agendas-en-el-mapa-home.md` | Agendas en el panel lateral del mapa de la home | Borrador r2 · post-Spec 27 |

### Bug reports

| Archivo | Título | Estado |
|---|---|---|
| `specs/BUG-001-detalle-analisis-hardcodeado.md` | Detalle de análisis hardcodeado (`MOCK_ANALYSIS`) | Abordado en Spec 26 |
| `specs/BUG-002-country-dashboard-analyses-vacios.md` | Dashboard de país con análisis vacíos | Abordado en Spec 26 |
| `specs/BUG-003-meta-aside-overlap.md` | Meta aside overlap | Pendiente |
| `specs/BUG-003-mapa-desbordante-dashboard.md` | Mapa desbordante en dashboard | Pendiente |
| `specs/BUG-004-copy-content-no-recursa-subcarpetas.md` | `copy-content.js` no recursa, bloquea visibilidad de agendas y diarios | Fix listo · pendiente commit/deploy |

### QA docs

| Archivo | Título |
|---|---|
| `specs/QA-05-archivo-buscador.md` | QA del archivo y buscador (Spec 05) |

Para ejecutar una spec: leer el archivo completo antes de escribir una línea de código. Las specs definen el layout, los datos requeridos y los criterios de aceptación. Para el sistema de agentes automáticos, leer Spec 29 (calendario unificado).

**Mockups:** referencia visual de componentes en `mockups/`. Convención: `NN-{nombre}-mockup.html`, donde `NN` corresponde al número de spec asociada.

---

## Cómo arrancar el frontend en desarrollo

```bash
cd platform/frontend
npm install
npm run dev
# http://localhost:3000
```

El backend no es necesario para el frontend actual — los datos son hardcoded en `src/lib/`.

### Cómo regenerar los datasets externos

Si se actualiza un CSV crudo en `platform/data/<dataset>/raw/`, regenerar el JSON con:

```bash
cd platform/data/latinobarometro-2024
python3 build_indicators.py
```

Tiempo de ejecución <2 segundos. Output: `indicators.json` actualizado. Validación cruda contra el informe oficial documentada en el README del subdirectorio.

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
