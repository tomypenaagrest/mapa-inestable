# Spec 01 — Arquitectura del sitio (MVP)

**Proyecto:** Mapa Inestable · Plataforma propia
**Versión:** 1.0 (draft)
**Autor:** Tomás (con Claude)
**Fecha:** 27 abr 2026
**Status:** En revisión

---

## 1. Contexto

Mapa Inestable se publica hoy en Substack. El proyecto se está moviendo hacia una plataforma propia que permita:

- Publicar análisis estructurados (método de 4 pasos por país)
- Mantener un mapa invertido como interfaz pública
- Curar despachos semanales que integran los análisis
- Conservar la trazabilidad de fuentes como parte del sistema, no como nota al pie
- Disparar el flujo editorial desde sugerencias generadas por IA a partir de noticias (ver Spec 02)

El sistema visual ya está definido (dirección **Grabado** — ver `design-system.md`), y existe un prototipo funcional del home (`home-prototype.html`). Esta spec define las páginas que faltan para tener un MVP usable.

---

## 2. Objetivos

| Objetivo | Métrica de éxito |
|---|---|
| Sustituir Substack como canal principal | Tomás puede publicar el despacho semanal en la plataforma sin volver a Substack |
| Hacer trazable cada análisis | Cada pieza muestra país, eje, fecha y fuente primaria sin clic adicional |
| Hacer navegable el corpus | Un lector puede entrar al sitio y, en menos de 3 clics, llegar a cualquier análisis del archivo |
| Aplicar la dirección Grabado a todo | Cero hex hardcodeado fuera de los tokens; consistencia tipográfica entre páginas |
| Permitir producir desde la propia plataforma | Tomás escribe, edita y compone despachos sin usar otra herramienta |

---

## 3. Alcance del MVP

### 3.1. Entra (v1)

**Páginas públicas:**

1. Home (ya implementado como prototipo)
2. Análisis individual
3. Despacho semanal
4. Página de país
5. Mapa interactivo full-screen

**Páginas privadas (admin):**

6. Editor de análisis
7. Compositor de despacho
8. Inbox de sugerencias (skeleton — su carga depende de Spec 02)

### 3.2. Queda fuera (v2+)

- Páginas de eje individuales (`/eje/desorientacion`, etc.) — los ejes son visibles en home, mapa y filtros, suficiente para v1
- Archivo / buscador full-text del corpus completo
- Página de método pedagógica
- Página de autores referenciados (Roy, Han, Harari…)
- Comentarios o anotaciones de lectores
- Sistema de tags transversales más allá de los 6 ejes
- Suscripciones de pago / tiers

### 3.3. Supuestos

- Audiencia v1 son los lectores actuales del Substack + algunos nuevos curiosos. No se necesita escala masiva.
- Single-author al inicio. Multi-author se diseña pero no se construye.
- El motor de sugerencias por IA (Spec 02) entrega **eventos detectados** que el editor consume — esa interfaz se especifica acá como contrato (sección 7).

---

## 4. Mapa de páginas (rutas)

```
PÚBLICO
├─ /                              Home
├─ /analisis/[pais-slug]/[título-slug]   Análisis individual
├─ /pais/[slug]                   Página de país (perfil + timeline)
├─ /despachos/[año]/[semana]      Despacho semanal (ej. /despachos/2026/47)
├─ /despachos                     Listado de despachos
└─ /mapa                          Mapa interactivo full-screen

PRIVADO (admin)
├─ /admin                         Dashboard
├─ /admin/inbox                   Sugerencias del motor IA (Spec 02)
├─ /admin/analisis/nuevo          Editor — análisis nuevo
├─ /admin/analisis/[id]/editar    Editor — análisis existente
├─ /admin/despacho/nuevo          Compositor — despacho nuevo
├─ /admin/despacho/[id]/editar    Compositor — despacho existente
└─ /admin/fuentes                 Configuración de fuentes RSS por país
```

---

## 5. Especificación de páginas públicas

### 5.1. Home

**Estado:** Implementado como `home-prototype.html`. Esta sección registra el contrato y deudas pendientes.

**Propósito:** Vista de entrada con análisis featured, mapa de la semana, grilla de análisis recientes, ejes pedagógicos, despachos previos, suscripción.

**Datos requeridos:**

- 1 análisis featured (el más reciente o el seleccionado manualmente)
- N análisis activos en la semana actual (típicamente 4–6) con su eje activado
- 4–6 despachos previos
- Estado del mapa: qué países tienen análisis esa semana y con qué eje

**Deuda pendiente del prototipo:**

- El mapa SVG es estilizado a mano. Para v1 hay que reemplazarlo por GeoJSON Natural Earth simplificado, manteniendo la inversión.
- Los enlaces son `href="#"`. Cablear a las rutas reales una vez existan las páginas destino.
- El submit del newsletter alerta — conectar a ConvertKit o equivalente.

---

### 5.2. Análisis individual

**Propósito:** Mostrar un análisis completo aplicando el método de 4 pasos. Es la unidad atómica del proyecto.

**URL:** `/analisis/[pais-slug]/[título-slug]`
Ej: `/analisis/colombia/la-sospecha-antes-del-voto`

**Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│ [meta-bar: fecha publicación, edición]                      │
├─────────────────────────────────────────────────────────────┤
│ [HEADER del sitio compartido]                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   COLOMBIA · DESORIENTACIÓN EPISTEMOLÓGICA  [breadcrumb]    │
│                                                             │
│         La sospecha antes del voto                          │
│         (Fraunces 4xl, ink, max 22ch)                       │
│                                                             │
│         A 103 días del fin del mandato, Petro pone…         │
│         (lede — Lora lg, ink-soft)                          │
│                                                             │
│         ─────────                                           │
│         Por Mapa Inestable · 27 abr 2026 · 8 min            │
│                                                             │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│  ASIDE       │   CONTENIDO (4 pasos)                        │
│  sticky      │                                              │
│              │   ┌─ Disparador ──────────────────┐          │
│  - País      │   │ La escena concreta…           │          │
│    Colombia  │   └────────────────────────────────┘          │
│  - Eje       │                                              │
│    Desorient.│   ┌─ Desplazamiento ──────────────┐          │
│  - Fuente    │   │ Del evento al proceso…        │          │
│    La Silla  │   └────────────────────────────────┘          │
│    Vacía ↗   │                                              │
│  - Autor     │   ┌─ Conceptualización ───────────┐          │
│  - Fecha     │   │ Interpretación a través de…   │          │
│              │   └────────────────────────────────┘          │
│  - Compartir │                                              │
│              │   ┌─ Apertura ────────────────────┐          │
│              │   │ Pregunta sin respuesta…       │          │
│              │   └────────────────────────────────┘          │
│              │                                              │
│              │   ─────────────────                           │
│              │   Cita primaria (citation block)             │
│              │                                              │
│              │   Análisis relacionados (cross-reference)    │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

**Componentes clave:**

- **Hero textual** — sin imagen. Country mark + axis tag + h1 + lede. La tipografía es el visual.
- **Aside sticky** — bloque de metadata permanente mientras se lee. Diseño igual al `hero-source` del prototipo (mono uppercase, dt/dd inline) pero adaptado a contexto cream.
- **Bloques de los 4 pasos** — cada uno con su título en mono uppercase + cuerpo en Lora. Los títulos son numerados (`01 Disparador`, `02 Desplazamiento`…) en estilo display.
- **Citation block** — versión expandida del `source-block` del hero. Incluye fuente, autor, medio, fecha de publicación, URL clicable. Es el nodo de trazabilidad — visualmente prominente, no nota al pie.
- **Cross-reference** — al pie, dos columnas: "Más sobre Colombia" (3 análisis del mismo país) y "Más sobre Desorientación" (3 análisis del mismo eje).

**Estados:**

- Normal (publicado y leíble)
- Draft (404 público, accesible solo desde admin con preview header)
-404 (slug no existe)

**Datos requeridos (modelo lógico):**

```
Analysis {
  id, slug, country, week, year
  title, lede
  step_disparador (rich text)
  step_desplazamiento (rich text)
  step_conceptualizacion (rich text)
  step_apertura (rich text)
  axes_activated [list of axis_slug, with one marked primary]
  source_primary { url, medium, author, published_at }
  sources_secondary [list of {url, medium, ...}]
  reading_time_min
  status: draft | published
  published_at
}
```

**Aplicación Grabado:**

- Fondo `--mi-bg-paper` — en página de análisis se usa el papel cream, no el terracota dominante. La densidad del texto pide ojos descansados.
- El hero textual tiene `border-bottom: var(--mi-border-bold)` — sin sombra. El énfasis viene del peso tipográfico, no del shadow.
- Los bloques de los 4 pasos tienen `border: var(--mi-border-thick)` y `box-shadow: var(--mi-shadow-card)` — son cards "impresas" sobre el papel.
- El citation block invierte: `background: var(--mi-bg-dark)`, texto en `--mi-bg-paper` y oro. Es el sello de trazabilidad — debería sentirse como un certificado.

---

### 5.3. Despacho semanal

**Propósito:** Integración editorial publicable de los análisis de la semana. Es lo que mandan al newsletter — reemplaza el formato Substack.

**URL:** `/despachos/[año]/[semana]`
Ej: `/despachos/2026/47`

**Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│  [Mapa Inestable · header + meta-bar]                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              DESPACHO Nº 47                                 │
│              Año II · Semana del 21 al 27 abr 2026          │
│                                                             │
│              [Título del despacho]                          │
│              (Alfa Slab One 4xl, uppercase)                 │
│                                                             │
│              [Manifiesto/entrada de la semana — Fraunces]   │
│              (texto introductorio que enmarca los análisis  │
│               de la semana, escrito por Tomás)              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─ ANÁLISIS 01 ─────────────────────────────────────────┐  │
│  │ COLOMBIA · DESORIENTACIÓN                             │  │
│  │ La sospecha antes del voto                            │  │
│  │ [snippet del análisis: lede + apertura]               │  │
│  │ Leer completo →                                       │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                             │
│  [conector — texto de transición de Tomás]                  │
│                                                             │
│  ┌─ ANÁLISIS 02 ─────────────────────────────────────────┐  │
│  │ ARGENTINA · MEDIACIONES                               │  │
│  │ El revés de la motosierra                             │  │
│  │ [snippet]                                             │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                             │
│  …                                                          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│         CIERRE                                              │
│         (texto de cierre — Fraunces italic, lg)             │
│                                                             │
│         La pregunta de la semana:                           │
│         "¿…?"                                               │
│                                                             │
│         [Suscribite al despacho — bloque de captación]      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Componentes clave:**

- **Encabezado del despacho** — número grande de edición, semana, título manifesto.
- **Bloque-entrada** — texto introductorio (lede del despacho) escrito por el autor. Renderizado con dropcap.
- **Análisis incluidos** — versiones "snippet" de cada análisis. Solo los 4 pasos colapsados a lede + apertura, con CTA al análisis completo. **Nunca** el cuerpo entero (eso vive en la página individual).
- **Conectores editoriales** — bloques de prosa entre análisis, escritos por el autor, que articulan el hilo narrativo de la semana.
- **Cierre** — pregunta de la semana, agradecimientos, suscripción.

**Estados:**

- Programado (visible en lista pero página da 404 hasta `published_at`)
- Publicado
- Draft

**Datos requeridos:**

```
Dispatch {
  id, year, week
  title, entrada (rich text), cierre (rich text), pregunta_semana
  blocks: ordered list of {
    type: 'analysis' | 'connector'
    analysis_id (if type=analysis)
    body (if type=connector)
  }
  status, published_at
}
```

**Aplicación Grabado:**

- Fondo `--mi-bg` (terracota dominante). Los bloques de análisis "snippet" son cards en `--mi-bg-paper` con `--mi-shadow-card`. La pieza completa parece una hoja política impresa.
- El cierre tiene un `--mi-shadow-hero` y borde grueso — es el sello del despacho.

---

### 5.4. Página de país

**Propósito:** Vista profunda de un país. Perfil estructural + timeline de análisis + ejes activos + fuentes que se monitorean.

**URL:** `/pais/[slug]`
Ej: `/pais/colombia`

**Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│  [HEADER del sitio]                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌──────────────────────┐                                 │
│   │                      │   COLOMBIA                       │
│   │   [Mapa enfocado:    │   (Alfa Slab One display)       │
│   │    Sudamérica con    │                                 │
│   │    Colombia          │   Última edición · Sem 47        │
│   │    iluminada]        │   Eje activado · Desorient.      │
│   │                      │                                 │
│   │   (silueta invertida │   [perfil estructural — texto    │
│   │   con el resto       │    breve sobre el país: ejes     │
│   │   atenuado)          │    crónicos, transformaciones    │
│   │                      │    en curso]                     │
│   └──────────────────────┘                                 │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   EJES CRÓNICOS DE COLOMBIA                                 │
│   ┌─────────┬─────────┬─────────┬─────────┐                │
│   │ Desor.  │ Mediac. │ Estetiz │ ...     │                │
│   │ ████░░  │ ███░░░  │ ██░░░░  │ ...     │ (intensidad)   │
│   └─────────┴─────────┴─────────┴─────────┘                │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   TIMELINE DE ANÁLISIS                                      │
│                                                             │
│   2026 ────●──●──●─────●────●──●── (con tooltips)          │
│            │  │  │     │    │  │                            │
│            ↓                                                │
│   ┌─ ABR 27 ──────────────────────────┐                    │
│   │ La sospecha antes del voto        │                    │
│   │ Eje · Desorientación              │                    │
│   └────────────────────────────────────┘                    │
│   ┌─ ABR 14 ──────────────────────────┐                    │
│   │ ...                                │                    │
│   └────────────────────────────────────┘                    │
│   …                                                         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   FUENTES MONITOREADAS                                      │
│   - El Espectador  (medio hegemónico)                       │
│   - La Silla Vacía (alternativo / análisis)                 │
│   - Semana                                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Componentes clave:**

- **Mini-mapa de país enfocado** — la silueta de Sudamérica invertida con el país en cuestión coloreado por su eje activo, el resto atenuado a `opacity: 0.25`.
- **Perfil estructural** — texto curado por Tomás sobre los procesos de fondo del país (no un análisis semanal — el "estado del país"). Lectura referencial, raramente cambia.
- **Mapa de calor de ejes crónicos** — barra con los 6 ejes mostrando intensidad histórica. No es un dato semanal, es un agregado.
- **Timeline de análisis** — línea horizontal con dots que representan análisis en el tiempo, ordenados desc. Hover = preview, click = navega al análisis.
- **Lista de fuentes monitoreadas** — qué medios se siguen para ese país, con etiquetas de tipo (hegemónico / alternativo / análisis).

**Estados:**

- País con análisis (estado normal)
- País sin análisis aún (estado "sin entradas" — muestra perfil estructural y "este país aún no tiene análisis publicados")

**Datos requeridos:**

```
Country {
  slug, name, perfil_estructural (rich text)
  ejes_cronicos: { axis_slug -> intensity 0-5 }
  fuentes: [{ name, url, type: hegemonic|alternative|analysis }]
}
```

(Los análisis individuales se consultan filtrando `Analysis WHERE country = X`.)

**Aplicación Grabado:**

- Fondo `--mi-bg`. Mini-mapa sobre `--mi-bg-paper` con `--mi-shadow-card`. El nombre del país en `--mi-text-display` Alfa Slab One — domina la vista.
- La timeline horizontal usa los colores semánticos de eje para los dots.

---

### 5.5. Mapa interactivo full-screen

**Propósito:** El mapa invertido como herramienta de exploración principal. La interfaz signature del proyecto. Visible siempre en `/mapa`.

**URL:** `/mapa`

**Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│  [HEADER + MAPA toolbar]                                    │
├──────────────────────────┬──────────────────────────────────┤
│                          │                                  │
│                          │   FILTROS                        │
│      [Mapa invertido     │   Eje: [todos ▼]                 │
│       de Sudamérica      │   Semana: [Sem 47 ▼]             │
│       full-canvas,       │   Estado: [activo ▼]             │
│       países como        │                                  │
│       paths interactivos]│   ─────────                      │
│                          │                                  │
│      Hover → tooltip     │   PAÍS SELECCIONADO              │
│      Click → panel       │   Colombia                       │
│      lateral             │                                  │
│                          │   Última pieza:                  │
│                          │   La sospecha antes del voto     │
│                          │   Desorientación · Sem 47        │
│                          │                                  │
│                          │   Ver perfil completo →          │
│                          │                                  │
│                          │   ─────────                      │
│                          │                                  │
│                          │   LEYENDA                        │
│                          │   ● Desorient.                   │
│                          │   ● Mediaciones                  │
│                          │   ● Desrepres.                   │
│                          │   …                              │
│                          │                                  │
└──────────────────────────┴──────────────────────────────────┘
```

**Comportamiento:**

- El mapa ocupa ~70% del viewport (panel lateral 380–420px sticky a la derecha).
- Al cargar, los países muestran el estado de la semana actual.
- Cambiar el filtro de semana re-renderea los colores y dots.
- Click en país → panel lateral se actualiza con el último análisis y un link al perfil.
- Filtro de eje atenúa los países donde ese eje no está activo (`opacity: 0.25`) y mantiene en color normal los activos.

**Datos requeridos:**

- GeoJSON de Sudamérica (Natural Earth 1:50m simplificado a ~5MB)
- Mapa de `(country, week, axis_primary)` para cada combinación con análisis

**Aplicación Grabado:**

- Fondo del mapa: `--mi-bg`. SVG con la silueta del continente en `--mi-bg-paper`.
- Panel lateral en `--mi-bg-paper` con `border-left: var(--mi-border-bold)`.
- Toolbar en `--mi-bg-dark` (verde-negro) con metadata mono.

**Open question:** ¿En mobile el mapa es navegable o se reemplaza por una lista? → ver sección 9.

---

## 6. Especificación de páginas privadas (admin)

### 6.1. Editor de análisis

**Propósito:** Donde Tomás escribe los análisis. Estructura forzada de los 4 pasos.

**URL:** `/admin/analisis/nuevo` o `/admin/analisis/[id]/editar`

**Layout (split):**

```
┌─────────────────────────────────────────────────────────────┐
│  [Admin header: status, save, publicar, vista previa]       │
├──────────────────────────────────┬──────────────────────────┤
│                                  │                          │
│  [Form fields]                   │  [Preview en vivo]       │
│  - País [select]                 │  ←  renderea el análisis │
│  - Título                        │      como página final   │
│  - Lede                          │                          │
│  - Disparador (rich text)        │                          │
│  - Desplazamiento (rich text)    │                          │
│  - Conceptualización             │                          │
│  - Apertura                      │                          │
│  - Eje primario [select]         │                          │
│  - Ejes secundarios [multi]      │                          │
│  - Fuente primaria               │                          │
│    - URL                         │                          │
│    - Medio                       │                          │
│    - Autor                       │                          │
│    - Fecha publicación           │                          │
│  - Fuentes secundarias [+]       │                          │
│  - Status: draft | published     │                          │
│                                  │                          │
└──────────────────────────────────┴──────────────────────────┘
```

**Comportamiento:**

- Auto-save cada 10 segundos en draft.
- Preview en vivo a la derecha (renderiza la página de análisis individual).
- Botón "Publicar" hace tres cosas: cambia status, asigna `published_at`, regenera el caché del home si el análisis es de la semana actual.
- Validaciones bloqueantes para publicar:
  - Todos los 4 pasos completos
  - Fuente primaria con URL válida
  - Al menos un eje marcado como primario
  - Tiempo de lectura calculado automáticamente

**Aplicación Grabado:**

- El admin puede ser visualmente "menos Grabado" — es interna, prioriza eficiencia. Mantiene la tipografía y los colores del sistema, pero los borders pueden afinarse a `--mi-border-thick` y la densidad subir.

---

### 6.2. Compositor de despacho

**Propósito:** Donde Tomás integra los análisis de la semana en un despacho publicable.

**URL:** `/admin/despacho/nuevo` o `/admin/despacho/[id]/editar`

**Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│  [Header: año/semana, save, publicar, programar]            │
├──────────────────────────┬──────────────────────────────────┤
│                          │                                  │
│  ANÁLISIS DISPONIBLES    │   DESPACHO EN CONSTRUCCIÓN       │
│  (de la semana)          │                                  │
│                          │   Título: ____________           │
│  ┌──────────────────┐    │   Entrada: [rich text]           │
│  │ COL · Desorient. │    │                                  │
│  │ La sospecha…     │    │   ┌─ Análisis 01 ──┐ ↑ ↓ X      │
│  │  + agregar       │    │   │ COL · Desor.   │             │
│  └──────────────────┘    │   │ La sospecha    │             │
│                          │   └────────────────┘             │
│  ┌──────────────────┐    │   ┌─ Conector ─────┐ ↑ ↓ X      │
│  │ ARG · Mediac.    │    │   │ [texto…]        │             │
│  │ El revés…        │    │   └────────────────┘             │
│  │  + agregar       │    │   ┌─ Análisis 02 ──┐ ↑ ↓ X      │
│  └──────────────────┘    │   │ ARG · Mediac.  │             │
│                          │   └────────────────┘             │
│  …                       │   …                              │
│                          │   + agregar conector             │
│                          │                                  │
│                          │   Cierre: [rich text]            │
│                          │   Pregunta semana: ____          │
│                          │                                  │
└──────────────────────────┴──────────────────────────────────┘
```

**Comportamiento:**

- Drag & drop de análisis desde el panel izquierdo al despacho.
- Reordenar bloques (análisis y conectores) con flechas o drag.
- Botón "agregar conector" inserta un bloque de texto entre dos análisis.
- "Programar" permite elegir `published_at` futuro (típicamente lunes 8am).
- Vista previa en otra pestaña (opcional v1) — ruta `/despachos/[año]/[semana]?preview=token`.

**Aplicación Grabado:** igual que editor de análisis.

---

### 6.3. Inbox de sugerencias (skeleton)

**Propósito:** Donde aparecen las sugerencias del motor IA (Spec 02). Cada sugerencia es un "tema detectado" con países asociados que Tomás puede convertir en análisis.

**URL:** `/admin/inbox`

**Layout (placeholder, definitivo en Spec 02):**

```
┌─────────────────────────────────────────────────────────────┐
│  TEMAS DETECTADOS · Semana 47                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─ [tema] Crisis de la representación sindical ────────┐   │
│  │ Países asociados: AR · CL · BR · UY                  │   │
│  │ Eje sugerido: Desrepresentación                      │   │
│  │ Fuentes detectadas: 14 piezas en la semana           │   │
│  │  → ver evidencia · → crear análisis · → archivar     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─ [tema] La sospecha electoral pre-comicios ─────────┐    │
│  │ Países asociados: CO · BO                            │   │
│  │ ...                                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Esta página depende de Spec 02.** Su contrato de datos se completa allá.

---

## 7. Componentes nuevos (extender el design system)

Los siguientes componentes aparecen en esta spec pero no están todavía en `design-system.md`. Hay que agregarlos cuando este doc esté aprobado:

| Componente | Aparece en | Notas |
|---|---|---|
| **Step block** (bloque 4 pasos) | Análisis individual | Card con número grande mono (01–04), título + body. Sombra `--mi-shadow-card`. |
| **Citation block (expanded)** | Análisis individual, despacho | Versión grande del `hero-source`. Fondo `--mi-bg-dark`, texto cream + oro. |
| **Cross-reference panel** | Análisis individual | Dos columnas con tarjetas chicas — "más de este país", "más de este eje". |
| **Analysis snippet** | Despacho | Versión condensada del análisis (lede + apertura, cta). Cards más chicas. |
| **Connector block** | Despacho | Bloque de prosa entre análisis. Italic Fraunces, sin border, max 60ch. |
| **Country profile mini-map** | Página de país | Silueta de Sudamérica con un país enfocado, resto atenuado. Reutiliza el SVG del home. |
| **Axis intensity bar** | Página de país | Barra horizontal de 6 segmentos (uno por eje), altura variable según intensidad histórica. |
| **Timeline horizontal** | Página de país | Línea con dots representando análisis en el tiempo. Hover muestra preview. |
| **Filter sidebar** | Mapa full-screen | Panel sticky derecho con selects de eje/semana/estado + leyenda. |
| **Admin form layout** | Editor, compositor | Patrón split (form izq, preview derecha). Densidad alta, tokens del sistema. |
| **Admin block-list** | Compositor | Lista reordenable con drag handles. Cada item es un bloque (análisis o conector). |
| **Status pill** | Listas en admin | `draft` (oro), `programmed` (verde), `published` (terracota). Mono uppercase. |

Estos componentes se especifican completos en una **revisión 1.1 del design-system.md** post-aprobación de esta spec.

---

## 8. Modelo de datos (resumen)

Esquema lógico mínimo para sostener el sitio. Detalle SQL queda fuera de esta spec — se finaliza al elegir stack.

```
Country (slug, name, perfil_estructural, ejes_cronicos[], fuentes[])
Axis (slug, name, definicion_corta, autores_referenciados[])
Source (id, country_slug, name, url, rss_url, type)
Event (id, country_slug, title, url, medium, author, published_at, week, year)
EventAxis (event_id, axis_slug, is_primary)        ← clasificación
Analysis (id, slug, country_slug, week, year,
          title, lede, step_disparador, step_desplazamiento,
          step_conceptualizacion, step_apertura,
          source_primary {url, medium, author, published_at},
          status, published_at)
AnalysisAxis (analysis_id, axis_slug, is_primary)
AnalysisEvent (analysis_id, event_id)              ← un análisis se origina en uno o varios eventos
Dispatch (id, year, week, title, entrada, cierre, pregunta_semana, status, published_at)
DispatchBlock (dispatch_id, order, type, analysis_id, body)  ← analysis | connector
```

**Vínculo con Spec 02:** la tabla `Event` se llena por el motor de ingesta + IA. La clasificación inicial por eje (`EventAxis`) la hace el motor IA y el editor humano la confirma o corrige al crear el análisis.

---

## 9. Preguntas abiertas (hand-off)

Estas decisiones quedan pendientes y se resuelven en sus respectivas specs / discusiones:

| # | Pregunta | Resuelve en |
|---|---|---|
| 1 | ¿Cuál es el formato exacto de "tema detectado" que llega al inbox del editor? | Spec 02 |
| 2 | ¿La IA pre-clasifica el evento por eje, o solo identifica el tema y deja la clasificación al editor? | Spec 02 |
| 3 | ¿Cómo se vincula un análisis a los eventos que lo originaron? (relación 1:N evento → análisis) | Spec 02 |
| 4 | En mobile, ¿el mapa full-screen se mantiene o se reemplaza por lista? | Sesión de UX mobile |
| 5 | ¿El despacho se publica también en Substack automáticamente, o se reemplaza Substack? | Decisión de producto — no urgente para v1 técnica |
| 6 | ¿Hay tier de pago en v1? | Decisión de producto — v1 sin tiers |
| 7 | Stack final: ¿Next.js + Postgres en Railway, o SvelteKit + Supabase? | Decisión técnica al arrancar implementación |

---

## 10. Roadmap de implementación

Orden sugerido (cada bloque ~1 semana de trabajo):

```
Semana 1  ► Setup del proyecto
            - Stack: Next.js (App Router) + Postgres
            - Tokens.css importado, fonts, layout base
            - Página de análisis individual estática (con datos hardcoded)

Semana 2  ► Schema + admin mínimo
            - Migrations: Country, Axis, Source, Analysis, AnalysisAxis
            - Editor de análisis funcional (CRUD básico)
            - Conectar página pública al schema

Semana 3  ► Despachos
            - Migrations: Dispatch, DispatchBlock
            - Compositor de despacho
            - Página de despacho pública

Semana 4  ► Mapa full-screen + página de país
            - GeoJSON Natural Earth simplificado
            - Componente <InvertedMap /> reusable
            - Página de país con timeline + ejes crónicos

Semana 5  ► Hand-off a Spec 02
            - Schema de Event, EventAxis
            - Inbox skeleton listo para que la lógica IA lo llene

Semana 6  ► Pulido + migración de contenido
            - Importar análisis pasados desde el Substack / Obsidian vault
            - Testing, accesibilidad, performance
            - Deploy a producción
```

---

## 11. Criterios de aceptación

La v1 está completa cuando:

- [ ] Tomás escribe un análisis nuevo en el editor, lo publica, y aparece en el home + página de país + página individual.
- [ ] Tomás compone un despacho con 4 análisis, lo publica, y la URL `/despachos/2026/47` lo muestra correctamente.
- [ ] El mapa full-screen muestra los países activos de la semana y al click navega al análisis.
- [ ] La página de un país lista todos sus análisis ordenados por fecha.
- [ ] Cero `#xxx` hardcodeado en el código fuente — todo viene de los tokens.
- [ ] Lighthouse > 90 en performance, accesibilidad y SEO.
- [ ] El sitio se ve y opera bien en mobile (con la decisión que se tome para el mapa).

---

## 12. Notas finales

Esta spec asume que el contenido se sigue creando manualmente. El **disparo automático por IA desde noticias** —la idea que motiva la Spec 02— se conecta a este sistema como un **proveedor de eventos** y un **proveedor de sugerencias**: alimenta el inbox del editor, pero el editor humano sigue siendo el autor final.

Esa relación es deliberada. El proyecto trata sobre desorientación epistemológica; no podemos delegar la interpretación a la misma máquina que la produce. La IA cura la atención, no la conclusión.
