---
spec: 16
titulo: Dashboard de país (rediseño tabular)
estado: borrador-r2
autor: Tomás (con Claude)
fecha: 2026-05-09
revision: 2026-05-09 (r2) — corrección: Spec 14 ya define Estructura material; eliminada propuesta errónea de Spec 17
depende_de: [01, 04, 07, 12, 12A, 12B, 13, 14, 14A, 15]
extiende: 12
resuelve: Spec 14 §10 pregunta #5 (relación Estructura material vs Pulso ciudadano), Spec 12 layout post-14A
implementa: dashboard-tabular-pais, multi-modo-lectura
---

# 16 · Dashboard de país (rediseño tabular)

## Resumen ejecutivo

`/pais/[slug]` hoy apila en scroll vertical: diagnóstico cualitativo, pregunta central, pulso ciudadano (Spec 12), contexto, análisis publicados, sidebar con ejes crónicos y fuentes monitoreadas. Para un lector recurrente que vuelve a la página con intenciones distintas (a veces ver novedades, a veces revisar diagnóstico, a veces buscar fuentes), el scroll lineal mezcla los modos en una lectura forzada y la página termina larga, densa, y poco navegable.

Esta spec convierte la página en **dashboard tabular de 6 solapas**. Cada solapa corresponde a un modo de uso. El header del país se mantiene fijo arriba; las solapas alternan el contenido principal sin recargar la página.

**Lo que entra:**
- Estructura tabular de 6 solapas con default `Publicaciones` y persistencia URL.
- Reorganización del contenido existente (Specs 12 y 14 absorbidas) en las solapas.
- Resolución de la pregunta abierta #5 de Spec 14: la "Estructura material" convive con "Pulso ciudadano" como **tab paralela** en el dashboard (no como sub-sección anidada ni como reemplazo).
- Comportamiento mobile: dropdown selector.

**Lo que NO entra:**
- Cambios al contenido del Pulso ciudadano (Spec 12 sigue siendo la fuente de la sección — solo cambia su contenedor).
- Cambios al contenido de Estructura material (Specs 14 y 14A son la fuente — esta spec define solo cómo se renderiza dentro del dashboard).
- Pipeline de datos macro (Spec 14B sigue pendiente — esta spec no la bloquea: la tab tolera estado placeholder).
- Comparativa cross-país (Spec 13 sigue siendo destino vía conector "Comparar →").
- Editor admin para `/pais/[slug]` (queda fuera de esta spec).

**Persona objetivo:** lector recurrente (Spec 15 §1). Vuelve a `/pais/argentina` con propósito distinto cada vez. La estructura tabular respeta el propósito sin obligarlo a scrollear lo que no busca.

---

## 1. Diagnóstico de la página actual

| Bloque | Contenido | Problema |
|---|---|---|
| Hero | País + bandera + último análisis | OK |
| Diagnóstico cualitativo | Texto narrativo del país | Largo, mezcla con pregunta central |
| Pregunta central | Una oración | Se pierde dentro del diagnóstico |
| Pulso ciudadano (Spec 12) | 12 indicadores LB | Bloque denso, expandido por default, suma scroll |
| Contexto | Texto colapsable | Existente pero sin estructura interna documentada |
| Análisis publicados | Listado cronológico | Al final — el lector que viene a buscar novedades scrollea de más |
| Sidebar | Ejes crónicos + fuentes monitoreadas | Compite con scroll principal |

**Costo cognitivo total:** ~3.500-5.000 píxeles de scroll en desktop, ~7.000-10.000 en mobile. Para una página visitada 2-3 veces por semana por el lector recurrente, eso es desproporcionado.

---

## 2. Estructura propuesta — dashboard de 6 solapas

```
┌──────────────────────────────────────────────────────────────────┐
│  HEADER DEL PAÍS (sticky)                                         │
│  ── Nombre país (Alfa Slab One 72px)                             │
│  ── Pregunta central (Fraunces italic 22px, 1-2 oraciones)       │
│  ── Meta: N análisis · última publicación: hace 3 días           │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  TABS (mono uppercase 13px, sticky bajo el header)                │
│  ▸ Publicaciones · Diagnóstico · Pulso · Estructura · Contexto · Fuentes │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  CONTENIDO DE LA TAB ACTIVA                                       │
│  (cambia sin recarga, URL se actualiza con ?tab=...)              │
│                                                                   │
│  ...                                                              │
└──────────────────────────────────────────────────────────────────┘
```

### 2.1 Las 6 solapas

| # | Slug URL | Label visible | Modo de uso | Default? |
|---|---|---|---|---|
| 1 | `publicaciones` | Publicaciones | Buscar novedades + recorrer corpus del país | **Sí** |
| 2 | `diagnostico` | Diagnóstico | Anclar el marco interpretativo del país | No |
| 3 | `pulso` | Pulso ciudadano | Ver evidencia cuantitativa subjetiva (LB) | No |
| 4 | `estructura` | Estructura material | Ver indicadores económicos / sociales | No |
| 5 | `contexto` | Contexto | Profundizar marco país (histórico, político, cultural) | No |
| 6 | `fuentes` | Fuentes | Ver qué se monitorea para producir análisis | No |

**Decisión r1:** la default es `publicaciones`. El lector recurrente prioritariamente vuelve a buscar novedades; ofrecerle eso primero respeta la persona de Spec 15.

### 2.2 Orden visual de las tabs

El orden propuesto sigue una progresión editorial:

```
[ Publicaciones (novedades) ] → [ Diagnóstico (marco) ] → [ Pulso (datos subjetivos) ] →
[ Estructura (datos objetivos) ] → [ Contexto (profundización) ] → [ Fuentes (metaeditorial) ]
```

De lo más fresco/operativo (publicaciones) a lo más estructural/meta (fuentes). El lector que viene por novedades se queda en la primera; el que está investigando recorre hacia la derecha.

---

## 3. Header del país (sticky)

### 3.1 Anatomía

```
┌──────────────────────────────────────────────────────────────────┐
│  ARGENTINA                                                        │
│                                                                   │
│  ¿Cómo se sostiene un sistema político cuando los partidos        │
│  tradicionales pierden capacidad de mediación?                    │
│                                                                   │
│  ─────────────────────────────────────────────────────────────   │
│  18 análisis · última: hace 3 días · ejes activos: 3              │
└──────────────────────────────────────────────────────────────────┘
```

- **Nombre del país:** `--mi-font-display` (Alfa Slab One) 72px desktop / 48px mobile, color `--mi-ink` sobre `--mi-bg-paper`.
- **Pregunta central:** `--mi-font-title` (Fraunces) italic, 22px desktop / 18px mobile, color `--mi-ink-soft`. Es el ancla editorial — siempre visible.
- **Meta row:** mono 13px, color `--mi-ink-mute`. Tres datos: total de análisis, última publicación (relativa), cantidad de ejes activos en los últimos 90 días.

### 3.2 Comportamiento sticky

- **Desktop:** al scrollear, el header se reduce a una versión condensada (40px de altura): solo nombre del país + pregunta central truncada en una línea. Las tabs quedan justo debajo, también sticky.
- **Mobile:** mismo principio pero el dropdown de tabs (§7) reemplaza la barra de tabs en el sticky condensado.

### 3.3 Frame strip de país

Bajo la meta row aparece el **frame strip de país** (similar al `<FrameStripInline>` del análisis individual, Spec 15 §4.2):

```
EJES CRÓNICOS  ▸ DESORIENTACIÓN EPISTEMOLÓGICA · ESTETIZACIÓN · DESREPRESENTACIÓN
```

Mono uppercase 13px, axis pills con color de eje. Click sobre un eje navega a `/ejes/[slug]?pais=argentina` (filtro pre-aplicado). Define visualmente que este país tiene una "personalidad estructural" más allá de las publicaciones individuales.

---

## 4. Especificación por solapa

### 4.1 Tab `Publicaciones` (default)

**Contenido:**

```
┌──────────────────────────────────────────────────────────────────┐
│  SUB-FILTRO TEMPORAL (mono chips)                                 │
│  [ Recientes (8) ]  [ 2026 (12) ]  [ 2025 (4) ]  [ Todas (18) ]   │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  FILTRO POR EJE (axis pills, multi-select)                        │
│  [✓ Desorientación] [ Estetización ] [ Desrepresentación ] ...    │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  GRID DE CARDS (3 col desktop / 2 tablet / 1 mobile)              │
│  ┌────────┐ ┌────────┐ ┌────────┐                                │
│  │ Card   │ │ Card   │ │ Card   │  Card de análisis Spec 11/01  │
│  └────────┘ └────────┘ └────────┘                                │
│                                                                   │
│  + paginación numerada o "Ver más" si > 18                        │
└──────────────────────────────────────────────────────────────────┘
```

**Sub-filtro temporal:** chips horizontales. El default es `Recientes` (últimos 90 días o últimos 8 análisis, lo que sea menor). Click en un chip cambia el conjunto mostrado.

**Filtro por eje:** axis pills multi-select. Si el lector tiene `followedAxes` en localStorage (Spec 15 §5.2), los suyos aparecen pre-marcados.

**Estado vacío del filtro:** "No hay análisis que combinen [Desorientación] y [Estetización] en este recorte. Probá ampliar el período o quitar un eje."

**Cards:** mismo componente que en home (Spec 11) y archivo (Spec 05). Markers de leído / nuevo desde lastVisit (Spec 15 §5.4) aplican.

**Por qué unificar Recientes y Total:** una sola tab con sub-toggle evita duplicar UI y permite al lector ajustar el alcance temporal sin saltar tabs.

### 4.2 Tab `Diagnóstico`

**Contenido:**

```
┌──────────────────────────────────────────────────────────────────┐
│  DIAGNÓSTICO ESTRUCTURAL                                          │
│  Texto cualitativo (Lora 19px, máx 60ch)                         │
│  3-5 párrafos. Lo que era el "diagnóstico cualitativo" hoy.       │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  EJES CRÓNICOS — bloque ampliado                                  │
│                                                                   │
│  Para cada eje activo, una card:                                  │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │ DESORIENTACIÓN EPISTEMOLÓGICA                            │     │
│  │ Activo desde: sem 12 · 2025                              │     │
│  │ Frecuencia: 8 análisis (45% de los publicados)           │     │
│  │ Última activación: hace 3 días                           │     │
│  │                                                           │     │
│  │ Por qué es crónico en este país (1-2 oraciones):         │     │
│  │ "El régimen mediático ..."                                │     │
│  └─────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  MATRIZ EJE × TIEMPO (heatmap)                                    │
│                                                                   │
│           sem 1  2  3  4  ...  17  18                            │
│  Desorient. ▓ ▓ ▓     ▓ ▓ ▓                                      │
│  Estetiz.       ▓ ▓ ▓             ▓                              │
│  Desrep.    ▓        ▓ ▓     ▓ ▓                                  │
│  Mediac.                                                          │
│  Dec.                                                             │
│  Atención         ▓                                               │
│                                                                   │
│  18 semanas más recientes. Click en celda → análisis.             │
└──────────────────────────────────────────────────────────────────┘
```

**Diagnóstico estructural:** texto cualitativo en frontmatter del país, máximo 60 caracteres por línea (Spec 04 ya define escalas). Markdown con formato editorial.

**Ejes crónicos:** cards con metadata cuantitativa derivada del corpus. Frecuencia de activación calculada a partir de los análisis publicados con tag de eje.

**Matriz eje × tiempo:** heatmap de 6 ejes × 18 semanas (configurable). Color de la celda intensifica el `--mi-axis-{nombre}` según frecuencia. Click en celda navega al análisis (o al primero si hay varios). Reusa el componente del home (Spec 11 §4.6) con `country=` filtrado.

**Componente nuevo:** `<ChronicAxisCard>` (§9.1).

### 4.3 Tab `Pulso ciudadano` (extiende Spec 12)

**Contenido:** lo que Spec 12 ya define, sin cambios de contenido. Cambia solo el contenedor (de sección scroll a tab).

```
┌──────────────────────────────────────────────────────────────────┐
│  PULSO CIUDADANO · LATINOBARÓMETRO 2024                           │
│                                                                   │
│  12 indicadores agrupados por eje (orden de Spec 12 H4):          │
│                                                                   │
│  → DESREPRESENTACIÓN — 3 indicadores                              │
│    [IndicatorCard] [IndicatorCard] [IndicatorCard]                │
│                                                                   │
│  → EROSIÓN DE MEDIACIONES — 3 indicadores                         │
│    [IndicatorCard] [IndicatorCard] [IndicatorCard]                │
│                                                                   │
│  → DESORIENTACIÓN EPISTEMOLÓGICA — 2 indicadores                  │
│    ...                                                            │
│                                                                   │
│  Footer: Informe completo → · Metodología                         │
└──────────────────────────────────────────────────────────────────┘
```

**Cambios respecto a Spec 12:**

1. La sección **deja de ser expandida por default en la página**: ahora ocupa todo el contenido del tab, no compite con otras secciones.
2. Se elimina la decisión de Spec 12 §4 H4 "expandida por defecto" (era una decisión de UI dentro del scroll vertical; en el dashboard el problema desaparece).
3. Se agrega al inicio de la tab un **resumen de tres números**: "el país está #N de 17 en X · top 3 en Y · último en Z" — síntesis editorial extraída de los 12 indicadores. Componente: `<PulsoSummary>` (§9.2). Lo escribe Tomás, no se calcula automáticamente.
4. Cada `<IndicatorCard>` mantiene el botón "Comparar →" que navega a Spec 13.

**Migración:** los componentes `<IndicatorCard>` y `<IndicatorBar>` de Spec 12 se reusan tal cual. La integración (H4 de Spec 12) ahora apunta al contenido del tab, no a una `<section>` en `pais/[slug]/page.tsx`.

### 4.4 Tab `Estructura material`

**Origen:** Spec 14 (marco general) + Spec 14A (curaduría — set cerrado de 24 indicadores en 4 familias). Esta spec **no define el contenido** — define cómo se renderiza dentro del dashboard tabular. Pipeline pendiente: Spec 14B (no bloqueante; la tab tolera estado placeholder hasta que el JSON se commitee).

**Sub-nav anchored — las 4 familias de Spec 14 §4:**

```
┌──────────────────────────────────────────────────────────────────┐
│  SUB-NAV (anchors scroll)                                         │
│  • Riqueza · Comercio · Empleo · Sociales                         │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  A · GENERACIÓN DE RIQUEZA E INDUSTRIAS                           │
│  6 indicadores                                                    │
│                                                                   │
│  ┌────────────────────────────┐ ┌────────────────────────────┐   │
│  │ A1 · PBI PER CÁPITA (PPP)  │ │ A2 · CRECIMIENTO REAL DEL  │   │
│  │  USD 2017 constantes        │ │       PBI                   │   │
│  │                             │ │                             │   │
│  │  US$ 26.505                 │ │  +2,7% 2023                │   │
│  │  ▁▂▃▂▄▅▆▅▆▄ (sparkline 10y) │ │  ▁▃▂▁▄▃▅▆▄ (sparkline)     │   │
│  │  Δ +6,9% vs 2018            │ │  Δ promedio 1,8% últ. 5y   │   │
│  │  Calidad: oficial           │ │  Calidad: oficial          │   │
│  │  → Banco Mundial WDI       │ │  → CEPALSTAT               │   │
│  └────────────────────────────┘ └────────────────────────────┘   │
│  ... 4 cards más ...                                              │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  B · VÍNCULOS DE COMERCIO EXTERIOR                                │
│  6 indicadores                                                    │
│  ...                                                              │
└──────────────────────────────────────────────────────────────────┘
... C · Empleo · ... D · Sociales ...
```

**Anatomía de cada card** (definida por Spec 14 §7.1: sparkline + valor + delta):

- Header: micro-label mono uppercase con código del indicador (ej. `A1 · PBI PER CÁPITA (PPP)`).
- Cifra grande: Alfa Slab One 52px desktop / 36px mobile, color `--mi-ink`.
- Sparkline: serie de 10-15 años (campo `series` del JSON de Spec 14B), trazo de 2px en color del eje primary del indicador o `--mi-ink-mute` cuando `axis_primary` es null. Sin radius, sin blur. Alta tolerable inline ~28px.
- Año de la observación: mono 13px al lado de la cifra (ej. "2023").
- Delta: una línea mono 13px con dos lecturas posibles: `Δ +6,9% vs 2018` (delta vs hace 5 años, default) o `Δ promedio 1,8% últ. 5 años` (cuando la cifra principal ya es una tasa).
- Marker de calidad: mono 11px chip pequeño con valor de `quality` (Spec 14 §6.2). Estilos por estado:
  - `oficial` — sin estilo especial, color `--mi-ink-mute`.
  - `revisado` — color `--mi-ink-mute`, paréntesis "(revisado)".
  - `estimado` — chip cream con border thick, "estimado".
  - `cuestionado` — chip cream con border `--mi-accent-warn`, "cuestionado".
  - `congelado` — chip oscuro `--mi-bg-dark` con texto cream, "congelado · última obs. 2014" (la fecha viene del datapoint).
- Footer: cita al pie con la fuente. Mono 11px, link a `source.url` (Spec 14 §6.2). Formato: `→ Banco Mundial WDI · pulled 2026-05-09`.

**Componente:** `<IndicatorCardMacro>` (variante de `<IndicatorCard>` de Spec 12). Reusa el chasis pero suma sparkline y marker de calidad. Documentado en §9.

**Por qué tab paralela a Pulso (no anidada ni reemplazo):** resuelve la pregunta abierta #5 de Spec 14. Pulso ciudadano (subjetividad colectiva, datos LB) y Estructura material (sustrato objetivo, datos macro) son dos lentes complementarias. Forzar al lector a abrirlas en una sola tab oculta la distinción epistemológica entre encuesta de opinión y estadística estructural — la separación las protege.

**Color del eje en cada card:** Spec 14 schema declara `axis_primary` y `axis_secondary[]` por indicador. La sparkline usa el color de `axis_primary` cuando existe; cuando es null (indicadores transversales como PBI per cápita), la sparkline va en `--mi-ink-mute`. Esto sigue el principio del DS (axis-color carga semántica) sin forzar un mapeo 1:1.

**Cita global al pie de la tab:**

```
─────────────────────────────────────────────────────────
24 INDICADORES · 4 FUENTES PRIMARIAS · ÚLTIMA ACTUALIZACIÓN: 2026-05-01
[Banco Mundial] [CEPALSTAT] [OIT] [FMI] [UN COMTRADE] [PNUD] [UNODC] [OPS]
Metodología y política de calidad → /metodo#datos-macro
─────────────────────────────────────────────────────────
```

Mono uppercase 13px, chips de fuentes con link al sitio oficial. Link al método explica las decisiones (regional > nacional, manejo de quiebres, política de calidad — todas ya documentadas en Spec 14 §2.3 y §12).

**Estado vacío (placeholder mientras 14B no esté ejecutada):**

```
┌──────────────────────────────────────────────────────────────────┐
│  ESTRUCTURA MATERIAL — PRÓXIMAMENTE                              │
│                                                                  │
│  Esta tab mostrará los 24 indicadores macro del país             │
│  (riqueza, comercio, empleo, sociales) con series de 10-15       │
│  años, sparklines y trazabilidad completa.                       │
│                                                                  │
│  Curaduría editorial cerrada en Spec 14A.                        │
│  Pipeline en construcción (Spec 14B).                            │
└──────────────────────────────────────────────────────────────────┘
```

Card cream con border-thick, shadow-card. Sin sparklines truchos, sin números mockup. Editorial honesto.

**Componente reusado:** `<IndicatorCardMacro>` cuando hay datos; `<TabPlaceholder>` cuando no.

### 4.5 Tab `Contexto`

Tomás señaló que esta tab "tiene subsecciones" pero no las definió. Propongo una estructura de 4 sub-secciones; queda como decisión pendiente confirmar el set.

```
┌──────────────────────────────────────────────────────────────────┐
│  SUB-NAV INTERNA (no son tabs anidados — son anchors scroll)      │
│  • Histórico · Político-institucional · Cultural · Demográfico    │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  HISTÓRICO                                                        │
│  Periodización relevante para entender el presente.               │
│  3-4 párrafos editoriales.                                        │
│                                                                   │
│  Línea de tiempo opcional (hitos): años clave + eventos.          │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  POLÍTICO-INSTITUCIONAL                                           │
│  Sistema de gobierno, partidos principales, gobierno actual,      │
│  fechas de próximas elecciones, constitución vigente.             │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  CULTURAL                                                         │
│  Singularidades culturales relevantes para el marco interpretativo│
│  del proyecto. Ej: el rol del fútbol en Argentina, la herencia    │
│  evangélica en Brasil, etc.                                       │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  DEMOGRÁFICO                                                      │
│  Población, urbanización, edad mediana, composición étnica si     │
│  es relevante.                                                    │
└──────────────────────────────────────────────────────────────────┘
```

**Sub-nav vs sub-tabs:** propongo sub-nav con anchors scroll (no sub-tabs anidados). Razón: el contenido de Contexto se lee secuencial cuando es la primera vez; tabs anidados forzarían a entender la estructura de antemano. El sub-nav es un índice, no un fragmentador.

**Source of truth:** cada subsección viene del frontmatter o del cuerpo del `.md` del país en el vault (`15-Países/`). El render es server-rendered desde ese archivo.

**Componente:** `<CountryContextSection>` con sub-nav sticky en el tope del tab cuando se scrollea.

**Si una subsección está vacía:** se omite del sub-nav y del scroll. La tab se adapta — un país con poco contexto cultural documentado no tiene esa sub-sección.

### 4.6 Tab `Fuentes`

**Contenido:**

```
┌──────────────────────────────────────────────────────────────────┐
│  FUENTES MONITOREADAS                                             │
│  Los medios y publicaciones que se siguen para producir el        │
│  análisis de este país.                                           │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  GRID DE TARJETAS DE FUENTE (2 col desktop / 1 mobile)            │
│                                                                   │
│  ┌──────────────────────────────────────────────────────┐        │
│  │ INFOBAE                                               │        │
│  │ Hegemónico · Buenos Aires · desde 2024                │        │
│  │ → infobae.com                                         │        │
│  │ Citado en: 12 análisis                                │        │
│  └──────────────────────────────────────────────────────┘        │
│                                                                   │
│  ┌──────────────────────────────────────────────────────┐        │
│  │ EL DESTAPE                                            │        │
│  │ Alternativo · Buenos Aires · desde 2024               │        │
│  │ → eldestapeweb.com                                    │        │
│  │ Citado en: 7 análisis                                 │        │
│  └──────────────────────────────────────────────────────┘        │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  NOTA METAEDITORIAL                                               │
│  Por qué se eligen estas fuentes. Cómo se equilibra entre         │
│  hegemónicas y alternativas. Cuándo se incorporan nuevas.         │
└──────────────────────────────────────────────────────────────────┘
```

**Tarjeta de fuente — anatomía:**
- Header: nombre del medio en Alfa Slab One 22px.
- Tipo (mono uppercase): `Hegemónico` / `Alternativo` / `Análisis` (matching la taxonomía de Spec 01 modelo de datos `sources.type`).
- Ubicación + fecha de incorporación al monitoreo.
- URL externa con flecha (`→`).
- Métrica: en cuántos análisis del país aparece citada.

**Datos:** vienen del modelo `sources` de Spec 01 + cruce con frontmatter de los análisis (campo `fuentes_citadas[]` que ya está propuesto en Spec 07 y debería incluirse en el editor).

**Nota metaeditorial:** texto corto editorial al pie. Lo escribe Tomás. Documentar la editorialidad de la curaduría es coherente con el principio de trazabilidad del CLAUDE.md raíz.

**Componente:** `<SourceCard>` (§9.3).

---

## 5. URL state y persistencia

### 5.1 Esquema de URL

```
/pais/argentina                           → tab=publicaciones (default)
/pais/argentina?tab=diagnostico           → tab Diagnóstico
/pais/argentina?tab=pulso&indicador=apoyo-democracia
                                          → tab Pulso, scroll a indicador específico
/pais/argentina?tab=contexto#historico    → tab Contexto, scroll a sub-sección histórica
/pais/argentina?tab=publicaciones&periodo=2025&eje=desorientacion
                                          → tab Publicaciones con filtros aplicados
```

### 5.2 Reglas

- **Tab activa siempre en `?tab=`.** Si no hay query param, default `publicaciones`.
- **Sub-estados van como query params adicionales** (no como hash, salvo el caso de anchor a sub-sección de Contexto).
- **Back/forward del browser** funciona — cambio de tab = `history.pushState`.
- **Compartibilidad:** si Tomás manda `/pais/chile?tab=pulso&indicador=corrupcion`, el destinatario ve exactamente eso.
- **Refresh** preserva el estado completo.

### 5.3 Deep-linking desde otros lados del sitio

| Fuente | Destino |
|---|---|
| Click en eje del frame strip de país (§3.3) | `/ejes/[slug]?pais=argentina` (sale de la página de país) |
| Click en card de análisis del archivo `/analisis` con filtro `pais=argentina` | `/pais/argentina?tab=publicaciones&periodo=...` |
| Botón "Comparar →" en `<IndicatorCard>` del tab Pulso | `/comparar/[indicador]` (Spec 13) |
| Footnote tipo `■` (estadística) en un análisis | `/pais/argentina?tab=pulso&indicador=...` |
| Mapa del home, click en país | `/pais/argentina` (default tab) |

---

## 6. Header sticky — comportamiento en scroll

### 6.1 Estados

| Posición de scroll | Header | Tabs |
|---|---|---|
| 0 (top) | Full (nombre + pregunta + meta + frame strip) | Visible debajo, no sticky aún |
| > 80px | Condensed (nombre + pregunta truncada en 1 línea) | Sticky, debajo del condensed |
| Dentro de un tab con scroll largo | Condensed sticky persistente | Sticky persistente |

### 6.2 Transición

- Animación: 200ms cubic-bezier(0.2, 0, 0, 1) — coherente con `--mi-easing`.
- Solo afecta altura y opacity de los elementos secundarios; el nombre del país nunca desaparece.
- En `prefers-reduced-motion: reduce`, la transición es instantánea.

### 6.3 Mobile

- Versión condensada del header en mobile: 56px de altura.
- Tabs colapsadas a dropdown (§7) ocupan otros 44px.
- Total altura sticky en mobile: 100px. Aceptable; deja viewport útil de ~568px en iPhone 13.

---

## 7. Mobile — dropdown selector

### 7.1 Decisión r1

En mobile (≤640px) las 6 tabs se colapsan a un **dropdown selector** (no scroll horizontal). Razón: 6 elementos en 360px de ancho fuerzan scroll horizontal con tabs muy comprimidas; el dropdown ofrece la lista clara con un solo gesto.

### 7.2 Anatomía

```
┌──────────────────────────────────────────────┐
│ TAB ACTIVA: PUBLICACIONES (8)            ▼   │  ← botón / select
└──────────────────────────────────────────────┘
```

Click expande un dropdown que muestra las 6 opciones con:
- Label de la tab (mono uppercase 13px)
- Count (cuando aplica): "(N)" en menor tamaño (ej. cantidad de análisis en `Publicaciones`, cantidad de indicadores en `Pulso`)
- La activa marcada con `▸` al inicio

### 7.3 Estilo

- Background `--mi-bg-paper`, border-thick `--mi-rule-soft`, sin radius (regla DS).
- Open: shadow-card, dropdown desciende debajo del botón, full-width del viewport.
- Cierre: tap fuera, tap en una opción, o tap en `×` del header del dropdown.

### 7.4 Comportamiento de tabla y grids dentro de tabs

- En mobile, todas las tarjetas (analyses cards, indicator cards, source cards) son full-width column única.
- Sub-filtros temporales del tab Publicaciones se mantienen como chips horizontales con scroll horizontal (es chip, no tab — el patrón es consistente con archivo y home).

---

## 8. Migración desde Specs 12 y 14

### 8.1 Qué cambia

| Aspecto | Spec 12 (vigente) | Spec 16 (propuesta) |
|---|---|---|
| Lugar del Pulso ciudadano | Sección expandida en scroll vertical, entre Pregunta central y Contexto | Tab dedicada en dashboard |
| Decisión "expandido por default" | Aplica al render de la sección dentro del scroll | Ya no aplica — la tab ocupa todo el área de contenido al activarse |
| `<IndicatorCard>` | Se renderiza en `pais/[slug]/page.tsx` directamente | Se renderiza dentro de `<TabPulso>` |
| Resumen de 3 números | No existe | Nuevo: `<PulsoSummary>` al inicio del tab (§4.3 punto 3) |
| Botón "Comparar →" | Existe en cada card | Se mantiene |

### 8.2 Qué NO cambia

- Curaduría de los 12 indicadores LB (Spec 12A) — sin cambios.
- Pipeline de datos LB (Spec 12B) — sin cambios.
- Tipado del módulo `latinobarometro-2024.ts` (Spec 12 H2) — sin cambios.
- Curaduría de los 24 indicadores macro (Spec 14A) — sin cambios.
- Schema del JSON macro (Spec 14 §6.2) — sin cambios.
- Política editorial de calidad y trazabilidad (Spec 14 §2 y §12) — sin cambios.
- Componentes `<IndicatorCard>` y `<IndicatorBar>` — sin cambios estructurales, solo se renderizan en distinto contenedor.

### 8.3 Status formal de las specs absorbidas

| Spec | Status post-16 | Acción de actualización |
|---|---|---|
| 12 | Vigente como fuente del Pulso. Solo cambia el contenedor. | Actualizar §4 H4 con nota: "El renderizado se mueve a una tab dentro del dashboard de país (ver Spec 16 §4.3). La decisión 'expandida por defecto' deja de aplicar." |
| 14 | Vigente como marco. La pregunta abierta #5 queda **resuelta** por esta spec. | Actualizar §10 tabla de preguntas: marcar #5 como resuelta, link a Spec 16 §4.4. |
| 14A | Vigente como curaduría. Sin cambios. | Ninguna. |
| 14B | Pendiente. Esta spec no la bloquea ni la acelera; declara cómo se renderiza el JSON cuando exista. | Ninguna. |

---

## 9. Componentes nuevos

### 9.1 `<ChronicAxisCard>`

**Anatomía:** card cream, border-thick `--mi-rule-soft`, padding 24px, shadow-card. Header con axis pill prominente (color del eje + nombre uppercase). Cuerpo: tres líneas mono ("Activo desde", "Frecuencia", "Última activación"). Pie: una oración cualitativa (Lora 17px italic) que justifica por qué el eje es crónico en ese país.

**Props:**
```ts
{
  axisKey: AxisKey;
  countrySlug: CountrySlug;
  activeSince: string;          // ej: "sem 12 · 2025"
  frequency: number;            // % de análisis del país
  lastActivation: string;       // relativo: "hace 3 días"
  qualitativeNote: string;      // 1-2 oraciones
}
```

**Datos:** se calcula a build-time iterando sobre los frontmatter de los análisis del país.

### 9.2 `<PulsoSummary>`

Strip al inicio del tab Pulso ciudadano. Ej:

```
─────────────────────────────────────────────────────────
ARGENTINA · #1 EN APOYO A LA DEMOCRACIA · TOP 3 EN POLARIZACIÓN · ÚLTIMO EN CONFIANZA EN PARTIDOS
─────────────────────────────────────────────────────────
```

Mono uppercase 13px, tres frases separadas por `·`. Lo escribe Tomás como síntesis editorial; no se calcula.

**Props:**
```ts
{
  countrySlug: CountrySlug;
  highlights: string[];   // ej: ["#1 en apoyo a la democracia", ...]
}
```

### 9.3 `<SourceCard>`

**Anatomía:** descrita en §4.6. Reutiliza patrones de tarjeta del DS (cream, border-thick, shadow-card) pero más densa: el contenido es metadata.

### 9.4 `<TabBar>` y `<TabDropdown>`

Componente del shell del dashboard. `<TabBar>` desktop, `<TabDropdown>` mobile. Se intercambian según viewport.

**Props comunes:**
```ts
{
  tabs: Tab[];           // [{ slug, label, count? }]
  activeSlug: string;
  onChange: (slug) => void;
}
```

### 9.5 `<CountryHeader>`

Header sticky descrito en §3 y §6. Se hace cargo del cambio de altura según scroll.

**Props:**
```ts
{
  country: Country;       // { slug, name, central_question, ... }
  metaStats: { totalAnalyses, lastPublishedRelative, activeAxesCount };
  chronicAxes: AxisKey[];
}
```

### 9.6 `<CountryContextSection>`

Container del tab Contexto con sub-nav anchored. Renderiza secciones en orden y omite las vacías.

### 9.7 `<IndicatorCardMacro>`

Variante de `<IndicatorCard>` (Spec 12) para datos macro. Cambios respecto al original:

- Suma sparkline inline de 10-15 años (campo `series` del JSON de Spec 14B).
- Suma marker de calidad con 5 estados (oficial / revisado / estimado / cuestionado / congelado), §4.4.
- Cambia el formato de comparación: en LB era ranking + promedio regional; acá es delta vs hace 5 años (o promedio de los últimos 5 años cuando la cifra es ya una tasa).
- Color del eje viene de `axis_primary`; cuando es null usa `--mi-ink-mute`.

**Props:**
```ts
{
  indicator: MacroIndicator;     // del JSON de Spec 14B
  country: CountrySlug;
  showSparkline?: boolean;       // default true; mobile reducido
  yearsBack?: number;            // default 5 para el delta
}
```

### 9.8 `<TabPlaceholder>`

Card para estado vacío de tab cuya data aún no existe. Anatomía descrita en §4.4 estado vacío. Reusable para cualquier tab futura que comparta el patrón "spec'eada pero sin datos todavía".

---

## 10. Roadmap por tab

Tres fases. Cada fase deja el dashboard funcional incrementalmente.

### Fase A — Shell + tabs implementables sin nuevos datos (1-2 sprints)

1. `<CountryHeader>` con condensed sticky.
2. `<TabBar>` desktop + `<TabDropdown>` mobile, con URL state.
3. Tab `Publicaciones` (datos ya disponibles — los análisis del país).
4. Tab `Diagnóstico` con texto cualitativo + heatmap matriz eje × tiempo (Spec 11 reusa) + `<ChronicAxisCard>`.
5. Tab `Contexto` con render desde el `.md` del vault (las subsecciones que ya estén escritas; el resto se omite).

**Por qué primero:** son las tabs que NO requieren datos nuevos. Hacen que el dashboard sea funcional y el rediseño visible.

### Fase B — Migración de Pulso + Fuentes (1 sprint)

1. Mover el render de Pulso a `<TabPulso>`.
2. Agregar `<PulsoSummary>` (texto a escribir por Tomás para los 10 países).
3. Tab `Fuentes` con `<SourceCard>` (datos del modelo `sources` de Spec 01).
4. Actualizar Spec 12 §4 H4 con la nota del cambio de contenedor.

**Por qué después:** depende del modelo de datos `sources` y del contenido editorial del summary.

### Fase C — Activación de la tab Estructura material

1. Esperar ejecución de Spec 14B (pipeline `build_indicators_macro.py` → `indicators-macro.json`).
2. Implementar `<IndicatorCardMacro>` (§9.7) reusando el chasis de `<IndicatorCard>`.
3. Reemplazar `<TabPlaceholder>` por el render real de las 4 familias × 24 indicadores (§4.4).
4. Smoke test: las 10 fichas-país muestran cards con sparklines + delta + calidad por indicador, citas funcionan, fallback `congelado` se ve correcto en Venezuela.

**Por qué último:** depende de Spec 14B que está pendiente de ejecución. Hasta entonces la tab existe en el shell con estado placeholder honesto — el dashboard funciona sin ella poblada.

---

## 11. Decisiones tomadas (sesión r1, 2026-05-09)

| # | Tema | Decisión |
|---|---|---|
| 1 | Default tab | Publicaciones recientes |
| 2 | Cantidad de tabs | 6 (consolidación de 8 propuestas iniciales) |
| 3 | Mobile pattern | Dropdown selector |
| 4 | URL state | Persistente con `?tab=...` |
| 5 | Consolidación 1 | "Últimas publicaciones" + "Total" → una tab `Publicaciones` con sub-toggle temporal |
| 6 | Consolidación 2 | "Diagnóstico estructural" + "Ejes crónicos" → tab `Diagnóstico` con bloque de ejes interno |
| 7 | Tab `Estructura material` | Mantener como tab paralela a Pulso (no fusionada). Resuelve Spec 14 §10 #5 |
| 8 | Header sticky | Sí, con versión condensada al scroll |
| 9 | Migración Spec 12 | Pulso pasa a tab; el resto de Spec 12 sigue vigente |
| 10 | Sub-estructura de Contexto | Sub-nav anchors (no sub-tabs anidados) |
| 11 | Frame strip de país | Bajo el header, similar al frame strip del análisis individual |
| 12 | Orden visual | De operativo (Publicaciones) a estructural (Fuentes) |
| 13 | Origen de datos macro | Specs 14 + 14A (no contenido nuevo). Tab tolera placeholder hasta que 14B se ejecute |
| 14 | Color del eje en cards macro | Usa `axis_primary` del schema de Spec 14; `--mi-ink-mute` cuando es null |

---

## 12. Decisiones pendientes

1. **Subsecciones del tab `Contexto`.** Propuse 4 (Histórico, Político-institucional, Cultural, Demográfico). Confirmar el set, o agregar/quitar.
2. **`<PulsoSummary>` — quién lo escribe.** Asumo que Tomás. Si el volumen (10 países × actualización ocasional) es alto, considerar alternativas: extraerlo automáticamente del informe LB con LLM-assist.
3. **Texto editorial de `Fuentes`.** ¿Una nota metaeditorial común a todos los países, o una por país? Propongo común con anclaje al país cuando aplique.
4. **Eventos hito del Histórico de Contexto.** ¿Línea de tiempo gráfica o lista en prosa? Si gráfica, agregar componente `<TimelineHorizontal>`.
5. **Sparkline mobile.** En cards macro mobile (≤640px), ¿se muestra la sparkline reducida (~16px alta) o se oculta y se prioriza solo cifra + delta + calidad? Propuesta inicial: reducir a 16px y mantener.

**Decisiones que ya estaban pendientes y se cierran con esta revisión r2:**

- ~~Indicadores de Estructura material~~ → cerrada por Spec 14A.
- ~~Pipeline de datos macro~~ → ya definido en Spec 14 §6, ejecución en Spec 14B (no bloqueante).
- ~~Axis-coloring en cards macro~~ → cerrada en §11 #14.

---

## 13. Métricas de éxito

| Métrica | Antes (estimado) | Target después |
|---|---|---|
| Scroll total medio en `/pais/[slug]` | 4.500px desktop / 8.500px mobile | < 2.000px desktop / < 4.000px mobile en tab activa |
| Tiempo de carga inicial | (medir antes) | < 1.5s LCP |
| % de visitas que cambian de tab | n/a (sin tabs) | > 35% (señala que la estructura tabular se usa) |
| Tab más visitada | n/a | Esperado: Publicaciones (default) > 60% |
| Profundidad de uso | Análisis abiertos por sesión | Mantener o subir respecto a baseline |

Métricas agregadas y anónimas (Spec 15 §12). Sin tracking individual.

---

## 14. Glosario

- **Dashboard tabular:** página con header fijo y contenido organizado en solapas que alternan sin recargar.
- **Tab activa:** la solapa cuyo contenido está visible. Se persiste en URL como `?tab=`.
- **Frame strip de país:** banda mono uppercase con los ejes crónicos del país, similar al `<FrameStripInline>` del análisis individual (Spec 15 §4.2).
- **Pulso ciudadano:** los 12 indicadores Latinobarómetro 2024 (Spec 12).
- **Estructura material:** los 24 indicadores macro en 4 familias (Riqueza, Comercio, Empleo, Sociales) definidos en Specs 14 y 14A. Pipeline pendiente en Spec 14B.
- **Sub-nav anchors:** índice interno de un tab que scrollea a sub-secciones, sin ser tabs anidados.
