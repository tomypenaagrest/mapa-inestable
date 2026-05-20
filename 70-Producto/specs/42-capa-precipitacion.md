---
spec: 42
titulo: Capa precipitación — crecimiento económico como primera capa analítica del mapa
estado: borrador-r2
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-20
revision: 2026-05-20 (r2) — cerradas las 3 decisiones visuales del Anexo A en sesión de Product Design (A.4 combinación tooltip + drawer; B.4 dirección solo en leyenda y tooltip; C.4 glyph nube + gotas). Restricción A.5 del Anexo A relajada conscientemente. AC15 reescrito
epic: 03
afecta:
  - platform/frontend/src/lib/layers/precipitacion.ts (NUEVO — implementación concreta del contrato Layer de Spec 39)
  - platform/frontend/src/components/LayerReadingDrawer.tsx (extender para mostrar subindicadores — patrón nuevo que despertará Spec 43-45)
  - platform/frontend/src/components/LayerLegend.tsx (extender para escala secuencial con dirección)
  - platform/frontend/src/components/MapaTorresGarcia.tsx (consumir glyph de precipitación + decidir cómo se renderiza la distinción crecimiento/recesión)
  - platform/frontend/src/styles/layers.css (NUEVO o ampliación — tokens `--mi-precipitacion-*`)
  - 70-Producto/design-system/mapa/glyphs/precipitacion.svg (SSOT en vault — entregado 2026-05-20, glyph C.4 nube + gotas)
  - 70-Producto/design-system/mapa/glyphs/precipitacion-recesion.svg (SSOT en vault — entregado 2026-05-20, reservado por B.4, no se referencia desde el frontend)
  - 70-Producto/design-system/mapa/glyphs/README.md (NUEVO — documenta el patrón vault → frontend para glyphs)
  - platform/frontend/public/mapa/glyphs/precipitacion.svg (copia sincronizada desde el vault; lectura del frontend)
  - 70-Producto/lecturas-capas/precipitacion.md (NUEVO — reading guide markdown del drawer)
  - 70-Producto/design-system/cover-style-guide.md (referencia, no se edita)
depende_de: [39, 40]
depende_blanda_de: [22, 37]
relaciona_con:
  - EPIC-03 (esta spec implementa la decisión 5 del epic: precipitación = crecimiento económico; y resuelve la pregunta abierta #4 sobre subindicadores como patrón general)
  - Spec 39 (arquitectura de capas — esta spec puebla el contrato `Layer` con `precipitacionLayer`)
  - Spec 39B (página dedicada de documentación — el reading guide de esta spec es el insumo del que se nutre Spec 39B cuando se diseñe)
  - Spec 40 (pipeline macro — fuente de `a2-crecimiento-pbi` y de los 4 subindicadores)
  - Spec 14A (24 indicadores estructurales — origen conceptual de a2, a4, a5, a6, b6)
desbloquea:
  - Spec 43 (capa temperatura) — hereda el patrón de subindicadores cerrado por esta spec
  - Spec 44 (capa viento) — hereda el patrón de subindicadores
  - Spec 45 (capa presión) — hereda el patrón de subindicadores
  - Spec 39B (página dedicada por capa) — su contenido se diseña con esta spec implementada como caso piloto
prioridad: alta
---

# 42 · Capa precipitación — crecimiento económico

## Resumen ejecutivo

Esta spec implementa la **primera capa analítica real** del EPIC 03. Es deliberadamente la primera porque (a) el indicador base es directo de implementar técnicamente — Spec 40 ya dejó el pipeline `macro-v1.1.0` con `a2-crecimiento-pbi` poblado para los 10 países, y (b) inaugura tres patrones que las Specs 43, 44 y 45 heredan:

1. **El patrón de subindicadores**, hoy planteado como apertura #4 del epic. Esta spec lo cierra: una capa principal con 4 subindicadores que la enriquecen sin reemplazarla. Si el patrón funciona acá, se replica en temperatura, viento y presión.
2. **El patrón de cobertura editorial piloto**, derivado de la decisión de Tomás del 2026-05-20: Spec 42 cura el contenido del reading drawer + reading guide solo para 3 países piloto (Argentina, Brasil, Chile). Los 7 restantes renderizan con datos pero con drawer mínimo. Resto se cura en r2 cuando el patrón visual está estabilizado.
3. **El patrón de escala secuencial intensidad** (decidido por Tomás en esta sesión), que distingue magnitud por saturación de color y dirección (crecimiento ↔ recesión) por un mecanismo visual auxiliar que esta spec deja abierto a definición de Product Design.

**Metáfora climática.** El crecimiento económico se lee como precipitación: lluvia abundante = crecimiento sostenido, sequía = estancamiento o recesión. La metáfora es operativa, no decorativa — el lenguaje del bucket en la leyenda usa los términos económicos directos ("+3.2% PBI") con la metáfora como apoyo visual del glyph y la paleta, no como reemplazo.

**Lo que entra en r1:**

- Implementación de `lib/layers/precipitacion.ts` que cumple el contrato `Layer` de Spec 39.
- Indicador principal: `a2-crecimiento-pbi`, consumiendo `series_trimestral` con fallback a `series` (anual) cuando el pipeline aún no haya corrido con red.
- 4 subindicadores ligados a la capa: `a6-inflacion-ipc`, `a5-inversion-pbi`, `b6-deuda-pbi`, `a4-productividad-laboral`.
- Escala secuencial intensidad: 5 buckets de magnitud (0 a 4) + flag de dirección (`crecimiento` | `recesion`).
- Paleta — tokens CSS — derivada de la dirección Grabado (terracota dominante). Definición concreta en §3.3.
- Glyph SVG custom `precipitacion.svg` para el LayerController y el render sobre cada hot-zone.
- Reading guide markdown en `70-Producto/lecturas-capas/precipitacion.md` con contenido editorial curado para los 3 países piloto (ARG, BRA, CHI) + introducción general que aplica a los 10.
- Patrón de subindicadores con dos planos visuales (cerrado en r2 con A.4):
  - Tooltip de hover (~280px): valor PBI con signo y label, sin subindicadores.
  - Reading drawer (~380px): encabezado + bloque "Lectura" + bloque "Subindicadores" con 4 sparklines.
- Distinción crecimiento ↔ recesión (cerrado en r2 con B.4): mapa muestra solo magnitud; dirección aparece solo en leyenda y tooltip.
- Glyph SVG (cerrado en r2 con C.4): nube + gotas en trazo manuscrito Grabado.
- Test fixture: con los 3 países piloto + 5 períodos arbitrarios, validar que el render no rompe y que los buckets se distribuyen como se esperaría.

**Lo que NO entra en r2:**

- **Reading guide editorial completo de los 7 países no-piloto.** Se completa en r3 después de implementar Spec 42 y mirar el patrón en uso real.
- **Series sub-anuales pobladas** (`series_trimestral`). El contrato las soporta; la población depende de la corrida con red del pipeline (pendiente operativo de Spec 40 §pendientes). Spec 42 codea contra el contrato y degrada a `series` anual cuando trimestral está vacío.
- **Subnacional Brasil/Argentina** — granularidad país (decisión 10 del epic).
- **Algoritmo de detección automática de "ciclo recesivo" o "boom"** — la capa muestra valor crudo del PBI, no fases derivadas. Si después se quiere agregar una sub-vista por fase, va en spec posterior.
- **Multi-capa simultánea** (precipitación + temperatura al mismo tiempo) — Spec 47.

---

## Estado actual

### Lo que ya existe (gracias a Spec 40 implementada)

- `data/indicators-macro/indicators-macro.json` versión `macro-v1.1.0` con los 5 indicadores que esta spec necesita:
  - `a2-crecimiento-pbi` — cobertura **10/10 países**, unidad `%`, familia `riqueza`. Series anual 2010-2024. Trimestral 2021+ soportada por contrato, no poblada hasta corrida con red.
  - `a6-inflacion-ipc` — cobertura **10/10 países**, unidad `%`, familia `riqueza`. Anual 2010-2024.
  - `a5-inversion-pbi` — cobertura **10/10 países**, unidad `%`, familia `riqueza`. Anual 2010-2024.
  - `b6-deuda-pbi` — cobertura **10/10 países**, unidad `%`, familia `comercio` (clasificación legada del pipeline; no afecta esta spec). Anual 2010-2024.
  - `a4-productividad-laboral` — cobertura **9/10 países**, unidad `índice`, familia `riqueza`. Anual 2010-2024.
- `lib/macro-indicators.ts` ya tiene el lector del JSON y helpers `getIndicator(slug)`, `getByCountry(slug, country)`. Esta spec construye encima.
- Contrato `Layer` y registry `LAYERS` definidos en `lib/layers.ts` (Spec 39 implementada). El stub `precipitacionLayer` existe vacío — esta spec lo puebla.
- `MapaTorresGarcia.tsx` ya lee polígonos del JSON del vault y soporta `activeLayer` con Gaussian blur sobre el fill (Spec 39 implementada).

### Lo que NO existe todavía

- `lib/layers/precipitacion.ts` con implementación real — hoy es placeholder.
- `public/mapa/glyphs/precipitacion.svg` — no existe el archivo.
- `70-Producto/lecturas-capas/precipitacion.md` — el directorio existe (Spec 39), el .md no.
- Patrón de subindicadores en `LayerReadingDrawer` — ningún drawer renderiza subindicadores todavía porque no hay capas implementadas. Esta spec lo inaugura.
- Tokens CSS `--mi-precipitacion-*` — no existen.

---

## Propuesta

### 1. Indicador principal y subindicadores

La capa expone **un indicador principal** (crecimiento del PBI) y **cuatro subindicadores** que enriquecen la lectura sin competir con la dimensión principal.

| Rol | Slug | Unidad | Cadencia primaria | Cadencia fallback | Cobertura |
|---|---|---|---|---|---|
| **Principal** | `a2-crecimiento-pbi` | % | trimestral (cuando esté poblada) | anual | 10/10 |
| Subindicador 1 — inflación | `a6-inflacion-ipc` | % | anual | — | 10/10 |
| Subindicador 2 — inversión | `a5-inversion-pbi` | % del PBI | anual | — | 10/10 |
| Subindicador 3 — deuda | `b6-deuda-pbi` | % del PBI | anual | — | 10/10 |
| Subindicador 4 — productividad | `a4-productividad-laboral` | índice | anual | — | 9/10 |

**Por qué estos 4 y no otros.** El epic en su apertura #4 propuso este set y los datos confirmaron que existe cobertura para todos. La lógica conceptual: el crecimiento del PBI describe el caudal de la precipitación; los 4 subindicadores describen cómo está distribuida y qué tan sostenible es ese caudal:

- **Inflación** dice si la lluvia trae tormenta (precios disparados) o cae estable.
- **Inversión / PBI** dice si la lluvia está alimentando el suelo (formación de capital) o se está evaporando.
- **Deuda / PBI** dice de dónde viene el agua (recurso propio o financiamiento externo acumulado).
- **Productividad laboral** dice si el sistema convierte la lluvia en cosecha o no.

Esta lectura es editorial y vive en el reading guide markdown (§5). El código solo carga los 5 indicadores y los entrega al drawer.

### 2. Modelo de tiempo y contrato Layer

El contrato `LayerPeriod` de Spec 39 permite cadencia mixta. Para precipitación:

- `cadence: "trimestral"` declarado en el `Layer` (refleja la cadencia *intencional* de la capa).
- `periods[]` se construye en runtime:
  - Si `series_trimestral` tiene datos: períodos trimestrales `{ key: "2024-Q4", date: "2024-12-31", label: "Q4 2024" }`.
  - Si no, fallback: períodos anuales `{ key: "2024", date: "2024-12-31", label: "2024" }`. La cadence declarada queda en "trimestral" pero la leyenda muestra "datos anuales · cuarteado pendiente".
- `defaultPeriod` = último período disponible (más reciente).
- `getLastPeriodBefore(date)` recorre `periods[]` y devuelve el último ≤ `date` — modelo de tiempo por capa de Spec 39.

### 3. Escala secuencial intensidad — 5 buckets + dirección

Tomás eligió escala secuencial intensidad (un solo tono, más oscuro = más extremo) en la sesión del 2026-05-20. La implementación concreta:

#### 3.1 Buckets

5 buckets de **magnitud absoluta** del cambio del PBI, independientes de signo:

| `bucketIndex` | Magnitud | Rango de `|PBI %|` | Label editorial |
|---|---|---|---|
| 0 | mínima | ≤ 0.5% | "sin cambio" |
| 1 | leve | 0.5% – 1.5% | "leve" |
| 2 | moderada | 1.5% – 3% | "moderado" |
| 3 | fuerte | 3% – 6% | "fuerte" |
| 4 | extrema | > 6% | "extremo" |

**El signo del PBI se separa del bucket.** El `LayerValue` retorna:

```ts
{
  raw: pbiValue,                        // -2.5 o +3.1, signo incluido
  formatted: pbiValue >= 0 ? `+${pbiValue.toFixed(1)}% crecimiento` : `${pbiValue.toFixed(1)}% recesión`,
  bucketIndex: magnitudBucket(pbiValue),// 0-4 según |raw|
  delta: deltaVsPrevPeriod,             // opcional
  quality: "oficial",                   // según pipeline
}
```

Esto encaja con `LayerScaleType: "continuous"` del contrato — la escala es secuencial creciente en magnitud. La dirección es metadata adicional que cada componente del frontend decide cómo renderizar (Anexo A).

#### 3.2 Por qué separar magnitud y dirección

Tres motivos:

- **Honestidad metodológica.** Un crecimiento +3% y una recesión −3% comparten magnitud económica, pero la lectura cualitativa cambia. Mezclar magnitud y signo en una sola escala obligaría a buckets diverging (decisión que Tomás explícitamente descartó en la sesión).
- **Compatibilidad con el design system Grabado.** El proyecto tiene paleta terracota dominante. Usar terracota para crecimiento y un tono opuesto fuerte (azul intenso, verde) para recesión introduce un color que no está en la paleta. La separación permite mantener un solo tono y resolver la dirección con un mecanismo auxiliar (que Product Design define).
- **Extensibilidad a las otras capas.** Temperatura (salario real) tiene la misma estructura — magnitud del cambio + dirección (sube/baja). Si Spec 42 cierra el patrón "magnitud + dirección separada", Spec 43 lo hereda directo.

#### 3.3 Paleta — tokens CSS

Definición concreta de tokens, terracota base con 5 pasos de saturación:

```css
/* platform/frontend/src/styles/layers.css */

:root {
  /* Escala secuencial precipitación — un solo tono, 5 pasos de saturación */
  --mi-precipitacion-0: #f5e4dd;  /* bucket 0 · sin cambio — casi neutro, base terracota lavada */
  --mi-precipitacion-1: #e8b8a4;  /* bucket 1 · leve */
  --mi-precipitacion-2: #d68868;  /* bucket 2 · moderada */
  --mi-precipitacion-3: #b85a32;  /* bucket 3 · fuerte */
  --mi-precipitacion-4: #823816;  /* bucket 4 · extrema */
  
  /* Variantes para indicar dirección — uso depende de decisión Product Design (Anexo A) */
  --mi-precipitacion-direccion-crecimiento: var(--mi-precipitacion-base, currentColor);
  --mi-precipitacion-direccion-recesion: var(--mi-precipitacion-base, currentColor);
  /* Los hex finales de estas dos variables dependen del mecanismo elegido por Product Design.
     Opciones posibles:
     - Si glyph orientado: las dos comparten color, glyph se rota/cambia
     - Si trama: una sólida, la otra con patrón de líneas
     - Si signo en leyenda: las dos idénticas, distinción solo en valor formateado
   */
  
  /* Sin dato — gris del DS */
  --mi-precipitacion-nodata: var(--mi-ink-mute);
  
  /* Quality flag — congelado / estimado */
  --mi-precipitacion-stale: var(--mi-paper-shade);
}
```

**Decisión cerrada:** la paleta de magnitud es terracota porque (a) es coherente con la dirección Grabado, (b) deja el azul libre para temperatura/viento si se necesita, (c) la metáfora "precipitación = lluvia terracota" funciona si se lee como tormenta de tierra / aguacero seco (semánticamente raro pero estéticamente consistente con el proyecto).

**Decisión cerrada en r2 — B.4 (Anexo A):** la distinción crecimiento ↔ recesión vive solo en leyenda y tooltip. El mapa muestra solo magnitud (un PBI de +3% y un PBI de −3% comparten color). Las dos variantes `--mi-precipitacion-direccion-*` quedan iguales al color base. Ver decisión #14 en "Decisiones tomadas".

### 4. Implementación de `precipitacionLayer`

Esqueleto del módulo:

```ts
// platform/frontend/src/lib/layers/precipitacion.ts

import type { Layer, LayerPeriod, LayerValue } from "@/lib/layers";
import { getIndicator, getByCountry } from "@/lib/macro-indicators";

const PRINCIPAL = "a2-crecimiento-pbi";
const SUBINDICADORES = [
  "a6-inflacion-ipc",
  "a5-inversion-pbi",
  "b6-deuda-pbi",
  "a4-productividad-laboral",
] as const;

function buildPeriods(): LayerPeriod[] {
  const principal = getIndicator(PRINCIPAL);
  const anyCountry = Object.values(principal.by_country)[0];

  // Preferir trimestral si poblada
  const trimestral = anyCountry.series_trimestral;
  if (trimestral && trimestral.length > 0) {
    return trimestral.map(dp => ({
      key: `${dp.year}-Q${dp.quarter}`,
      date: quarterEndDate(dp.year, dp.quarter), // helper: "2024-12-31" para Q4
      label: `Q${dp.quarter} ${dp.year}`,
    }));
  }

  // Fallback anual
  return anyCountry.series.map(dp => ({
    key: String(dp.year),
    date: `${dp.year}-12-31`,
    label: String(dp.year),
  }));
}

function magnitudBucket(pbi: number): number {
  const abs = Math.abs(pbi);
  if (abs <= 0.5) return 0;
  if (abs <= 1.5) return 1;
  if (abs <= 3) return 2;
  if (abs <= 6) return 3;
  return 4;
}

function direction(pbi: number): "crecimiento" | "recesion" | "neutro" {
  if (Math.abs(pbi) <= 0.5) return "neutro";
  return pbi >= 0 ? "crecimiento" : "recesion";
}

export const precipitacionLayer: Layer = {
  id: "precipitacion",
  label: "Precipitación · crecimiento económico",
  shortLabel: "Precipitación",
  glyphSrc: "/mapa/glyphs/precipitacion.svg",
  category: "macro",
  description: "Estado del crecimiento económico. Lluvia abundante = crecimiento sostenido; sequía = estancamiento o recesión.",
  unit: "% del PBI",
  cadence: "trimestral",
  periods: buildPeriods(),
  defaultPeriod: /* último de periods[] */,
  legend: {
    type: "continuous",
    buckets: [
      { bucketIndex: 0, label: "sin cambio",  color: "var(--mi-precipitacion-0)", rangeDescription: "|PBI| ≤ 0.5%" },
      { bucketIndex: 1, label: "leve",        color: "var(--mi-precipitacion-1)", rangeDescription: "0.5% < |PBI| ≤ 1.5%" },
      { bucketIndex: 2, label: "moderado",    color: "var(--mi-precipitacion-2)", rangeDescription: "1.5% < |PBI| ≤ 3%" },
      { bucketIndex: 3, label: "fuerte",      color: "var(--mi-precipitacion-3)", rangeDescription: "3% < |PBI| ≤ 6%" },
      { bucketIndex: 4, label: "extremo",     color: "var(--mi-precipitacion-4)", rangeDescription: "|PBI| > 6%" },
    ],
    noDataColor: "var(--mi-precipitacion-nodata)",
    qualityFlagColor: "var(--mi-precipitacion-stale)",
  },
  source: {
    name: "Banco Mundial (NY.GDP.MKTP.KD.ZG) — pipeline macro-v1.1.0",
    url: "https://data.worldbank.org/indicator/NY.GDP.MKTP.KD.ZG",
    publishedDate: "2026-05-19",   // tomado del JSON.computed_at
    lastFetched: "2026-05-19",
  },
  getValueForCountry(slug, period): LayerValue | null {
    const country = getByCountry(PRINCIPAL, slug);
    if (!country) return null;
    const dp = findDatapointByPeriod(country, period);
    if (!dp) return null;
    return {
      raw: dp.value,
      formatted: formatPbi(dp.value),
      bucketIndex: magnitudBucket(dp.value),
      delta: deltaVsPrev(country, period),
      quality: dp.quality,
    };
  },
  getLastPeriodBefore(date): LayerPeriod | null { /* ... */ },
  readingGuideSlug: "precipitacion",
};
```

`findDatapointByPeriod`, `formatPbi`, `quarterEndDate`, `deltaVsPrev` quedan como helpers locales. Los tests les apuntan directo.

### 5. Reading guide markdown

Vive en `70-Producto/lecturas-capas/precipitacion.md`. El drawer lo renderiza como full markdown (Spec 39).

Estructura propuesta:

```markdown
---
layer: precipitacion
title: Precipitación · crecimiento económico
last_updated: 2026-05-20
---

# Precipitación

Una frase de entrada con la metáfora. Por qué se lee el crecimiento como lluvia.

## Cómo se lee

- Qué representa el color (magnitud del cambio del PBI).
- Qué representa el [glyph / trama / signo — texto se ajusta según decisión Product Design].
- Por qué se separa magnitud de dirección.

## Subindicadores

- **Inflación** — qué dice del régimen de precios.
- **Inversión / PBI** — qué dice de la formación de capital.
- **Deuda / PBI** — qué dice del financiamiento.
- **Productividad** — qué dice de la capacidad productiva.

## Lectura por país (piloto r1)

### Argentina
Texto curado editorialmente: contexto histórico de la serie, fases identificables, qué leer en los subindicadores para ARG específicamente.

### Brasil
Idem ARG.

### Chile
Idem ARG.

## Otros países

> Lectura curada pendiente para Bolivia, Colombia, Ecuador, Paraguay, Perú, Uruguay, Venezuela. El indicador principal y los subindicadores están disponibles en el mapa; la lectura editorial se completa en r2.

## Fuente y método

- Indicador: NY.GDP.MKTP.KD.ZG (Banco Mundial).
- Pipeline: `macro-v1.1.0`.
- Cadencia: anual con fallback trimestral cuando esté disponible.
- Último refresh: ver leyenda del mapa.

## Limitaciones

- Buckets de magnitud son arbitrarios; ver Decisiones cerradas §3.1.
- Los datos posteriores al último año del Banco Mundial pueden estar estimados (`quality: "estimado"`).
- Para algunos países la serie tiene gaps que no se rellenan (se renderizan como `noData`).
```

Esta estructura es la que las otras capas heredan. Spec 39B (página dedicada) profundiza sobre cada bloque cuando se diseñe.

### 6. Patrón de subindicadores — el plano técnico

Independiente de cómo Product Design resuelva la UI (Anexo A), el contrato técnico que esta spec deja inaugurado:

```ts
// Posible extensión al contrato Layer de Spec 39 — propuesto para r3 de Spec 39
export interface LayerSubIndicator {
  slug: string;                     // ej. "a6-inflacion-ipc"
  label: string;                    // "Inflación"
  unit: string;                     // "%"
  getValueForCountry(slug: string, period: LayerPeriod): LayerValue | null;
}

export interface Layer {
  // ... campos existentes ...
  subIndicators?: LayerSubIndicator[];
}
```

`precipitacionLayer` expone:

```ts
subIndicators: [
  { slug: "a6-inflacion-ipc",   label: "Inflación",     unit: "%",      getValueForCountry: ... },
  { slug: "a5-inversion-pbi",   label: "Inversión",     unit: "% PBI",  getValueForCountry: ... },
  { slug: "b6-deuda-pbi",       label: "Deuda",         unit: "% PBI",  getValueForCountry: ... },
  { slug: "a4-productividad-laboral", label: "Productividad", unit: "índice", getValueForCountry: ... },
]
```

El consumidor (LayerReadingDrawer y/o tooltip) llama a `subIndicators[i].getValueForCountry(slug, period)` para cada uno y los renderiza según el patrón visual que defina Product Design.

**Si Product Design opta por NO mostrar subindicadores en hover y sí en drawer, el contrato técnico es el mismo** — la diferencia es solo dónde se llama desde el frontend. Esto es deliberado: la spec deja el contrato cerrado y el render abierto.

### 7. Cobertura editorial — piloto vs no-piloto

| Plano | 3 países piloto (AR, BR, CL) | 7 países restantes (BO, CO, EC, PE, PY, UY, VE) |
|---|---|---|
| Color de la capa en el mapa | Renderizado con dato real | Renderizado con dato real |
| Hover / tooltip con valor PBI | Sí | Sí |
| Subindicadores (Anexo A define dónde) | Sí, con valor real | Sí, con valor real |
| Reading drawer corto (al click) | Texto curado editorialmente | Texto mínimo: "Lectura editorial pendiente — ver introducción de la capa" + link a `precipitacion.md` |
| Reading guide markdown (`precipitacion.md`) | Sección curada con contexto histórico, fases, lectura de subindicadores | Mención en sección "Otros países" como pendiente |

**Por qué este modelo de piloto.** El epic dejó claro en Pregunta #2 resuelta que las capas se publican "de a una, en orden: precipitación → temperatura → viento → presión", siendo Spec 42 el caso piloto que valida la arquitectura. Aplicar la misma lógica adentro de la spec — piloto editorial de 3 países antes de extender a 10 — permite iterar el patrón de drawer y subindicadores con menos superficie. Los datos están ahí para los 10; la curación humana se hace en dos tandas (r1 para 3, r2 para los otros 7).

**Por qué Argentina, Brasil, Chile específicamente.** Decisión de Tomás en la sesión:
- ARG y BRA son los polos económicos extremos de la región (volátil vs gigante).
- CHI funciona como ancla de estabilidad — útil para validar que la escala no se rompe con magnitudes chicas.
- Los tres tienen mejor cobertura editorial preexistente en el proyecto (ver `15-Países/`), lo que reduce la fricción de escribir el texto curado.

---

## Archivos a tocar

| Archivo | Acción |
|---|---|
| `platform/frontend/src/lib/layers/precipitacion.ts` | NUEVO — reemplaza el placeholder de Spec 39 con la implementación real |
| `platform/frontend/src/styles/layers.css` (o crear si no existe) | NUEVO/EXTENDER — agregar tokens `--mi-precipitacion-*` |
| `public/mapa/glyphs/precipitacion.svg` | NUEVO — placeholder con icono temporal; diseño final cae en Product Design |
| `70-Producto/lecturas-capas/precipitacion.md` | NUEVO — reading guide markdown, contenido para ARG/BRA/CHI + intro general |
| `platform/frontend/src/components/LayerReadingDrawer.tsx` | EXTENDER — soportar bloque de subindicadores (la forma exacta del bloque depende de Product Design) |
| `platform/frontend/src/components/LayerLegend.tsx` | EXTENDER — soportar escala secuencial con dirección (la forma exacta depende de Product Design) |
| `platform/frontend/src/components/MapaTorresGarcia.tsx` | EXTENDER — consumir `getValueForCountry` y renderizar dirección según mecanismo elegido en Anexo A |
| `platform/frontend/src/lib/layers.ts` | EXTENDER — opcionalmente agregar `subIndicators?: LayerSubIndicator[]` al contrato `Layer` (propuesta para r3 de Spec 39, decidible cuando se implemente Spec 42) |
| `70-Producto/specs/39-arquitectura-capas-mapa.md` | ACTUALIZAR si se confirma el patrón de subindicadores — agregar campo al contrato en r3 |

---

## Criterios de aceptación

| # | Criterio | Verificación |
|---|---|---|
| AC1 | `precipitacionLayer` cumple el contrato `Layer` de Spec 39 (typecheck pasa) | `tsc --noEmit` |
| AC2 | Los 10 países renderizan con color de bucket correcto para al menos un período | Smoke test: activar capa, inspeccionar fill de los 10 polígonos |
| AC3 | `getValueForCountry` retorna valor formateado correcto con signo (ej. "+3.2% crecimiento" o "-1.8% recesión") | Test unitario con fixtures de valores conocidos |
| AC4 | `magnitudBucket(0.3)` = 0, `magnitudBucket(2)` = 2, `magnitudBucket(7)` = 4 | Test unitario |
| AC5 | Cuando `series_trimestral` está poblada, los períodos del slider son trimestrales | Mock JSON con trimestrales → inspeccionar `precipitacionLayer.periods` |
| AC6 | Cuando `series_trimestral` está vacía, fallback a anual y la leyenda lo dice | Mock JSON sin trimestrales → inspeccionar leyenda |
| AC7 | `getLastPeriodBefore("2024-06-15")` devuelve el período del JSON ≤ esa fecha | Test unitario |
| AC8 | `subIndicators` expone los 4 indicadores con `getValueForCountry` funcional | Test unitario: cada subindicador devuelve valor para AR-2023 |
| AC9 | Reading guide markdown se renderiza correctamente en el drawer para ARG, BRA, CHI | Click en AR → drawer muestra sección "Argentina" con texto curado |
| AC10 | Para los 7 países no-piloto, el drawer muestra el mensaje genérico + link a la intro | Click en BO → drawer dice "Lectura editorial pendiente" + link |
| AC11 | Glyph SVG existe en `/public/mapa/glyphs/precipitacion.svg` (aunque sea placeholder) y carga en LayerController | Inspect DOM del controller |
| AC12 | Tokens CSS `--mi-precipitacion-{0..4}` están definidos y el contraste con `--mi-paper` cumple WCAG AA para texto sobre fill | Lighthouse / contrast checker |
| AC13 | La capa renderiza países con `quality: "estimado"` o `"congelado"` con el flag visual del DS (`--mi-precipitacion-stale`) | Mock un país con quality estimado → inspeccionar render |
| AC14 | El patrón de subindicadores definido por Product Design (Anexo A) está implementado en al menos el drawer | Test visual: drawer muestra los 4 subindicadores en el formato elegido |
| AC15 (r2) | El tooltip y el drawer muestran el valor formateado con signo + label explícito (`crecimiento` / `recesión` / `sin cambio`). La leyenda incluye un bloque "Dirección" que aclara que el color codifica solo magnitud. **No se requiere distinción visual en el mapa** (B.4 relaja la restricción A.5 del Anexo A) | Inspección visual: hover sobre ARG muestra `−1.8% recesión`; hover sobre BRA muestra `+2.5% crecimiento`; el fill de ambos polígonos es del mismo color si comparten bucket de magnitud; la leyenda incluye bloque "Dirección" con dos filas explicativas |

AC14 y AC15 quedan **cerrados en r2** con las decisiones A.4 y B.4 del Anexo A. AC11 también queda cerrado con C.4 (glyph nube + gotas, versión seca entregada pero no referenciada).

---

## Edge cases

- **País sin dato para un período** (`undefined` en series) → `getValueForCountry` retorna `null`. Render: fill con `noDataColor`. Hover: tooltip dice "sin dato para este período".
- **Bucket 0 (sin cambio)** — un PBI de +0.3% se rendea como bucket 0 (`sin cambio`) con dirección `neutro`. El tooltip muestra "+0.3% sin cambio" (no "crecimiento"). Esto evita falsos positivos: oscilaciones marginales no se leen como movimiento.
- **Período pre-2010** (más allá del rango del pipeline) → slider lo bloquea con el `start` del rango global de capas (Spec 39).
- **Dato con `quality: "estimado"`** → render usa `--mi-precipitacion-stale` como overlay sutil; tooltip incluye "estimado". Patrón heredado de Spec 40 §decisiones #6 y #13.
- **Trimestral parcialmente poblado** (algunos países sí, otros no) → la capa usa trimestral si **al menos un país** tiene serie trimestral. Países sin trimestral aparecen como `noData` en períodos trimestrales y aparecen con dato en períodos anuales del fallback. (Decisión a confirmar en r2 si aparece el caso real.)
- **Frontera entre buckets** — un PBI de exactamente 1.5% cae en bucket 1 (`leve`, regla `≤`). Documentado en el reading guide.
- **PBI nulo o `NaN`** → tratamiento idéntico a "sin dato".
- **Cambio de pipeline version** (macro-v1.1.0 → macro-v1.2.0) → la spec asume que la estructura del JSON es estable según el contrato público de Spec 40. Si cambia, esta spec re-vasalla en r2.

---

## Decisiones tomadas

### Cerradas en r1 (sesión 2026-05-20)

| # | Tema | Decisión | Razón |
|---|---|---|---|
| 1 | Alcance r1 | Capa **completa** con indicador principal + 4 subindicadores desde v1, no solo el indicador principal | Tomás eligió "completa" en sesión. La spec inaugura el patrón de subindicadores que las 3 capas restantes heredan; aislarlo a una iteración posterior implicaría rediseñar contrato Layer cuando llegue Spec 43 |
| 2 | Indicador principal | `a2-crecimiento-pbi` del pipeline `macro-v1.1.0` | Definido en decisión 5 del epic. Disponible 10/10 países |
| 3 | Subindicadores | Los 4 propuestos por el epic (`a6-inflacion-ipc`, `a5-inversion-pbi`, `b6-deuda-pbi`, `a4-productividad-laboral`) | Verificado en `indicators-macro.json`: los 4 existen con cobertura 9-10/10. Lectura editorial conceptual encaja con la metáfora climática |
| 4 | Tipo de escala | **Secuencial intensidad** (un solo tono, más oscuro = más extremo). Magnitud y signo se separan | Tomás eligió "secuencial intensidad" en sesión. Compatible con paleta Grabado (terracota dominante). Patrón heredable por Specs 43-45 |
| 5 | Buckets de magnitud | 5 buckets (0-4) con rangos `≤0.5%`, `≤1.5%`, `≤3%`, `≤6%`, `>6%` aplicados al valor absoluto | Cobertura empírica razonable de la distribución de la serie 2010-2024 en los 10 países. Los rangos pueden ajustarse en r2 si el render visual sugiere que el bucket 2 (moderado) absorbe demasiado |
| 6 | Paleta | Terracota base con 5 pasos de saturación (`--mi-precipitacion-0..4`). Hex concretos definidos en §3.3 | Decisión Grabado de Mapa Inestable. Coherente con el resto del DS. Deja el azul libre para otras capas |
| 7 | Cobertura editorial r1 | Piloto de 3 países (ARG, BRA, CHI) con drawer + reading guide curados. Otros 7 con drawer genérico + datos crudos | Tomás eligió "Argentina, Brasil, Chile" en sesión. Patrón coherente con el rollout en olas del epic (resuelta pregunta #2) |
| 8 | Cobertura técnica r1 | Todos los 10 países renderizan con color + hover + subindicadores. La diferencia piloto/no-piloto es solo editorial | Datos disponibles 10/10 en el pipeline. Forzar "color solo para piloto" sería desperdiciar datos disponibles y crear discontinuidad UX |
| 9 | Cadencia | `cadence: "trimestral"` declarado, con fallback runtime a anual cuando `series_trimestral` esté vacía | Decisión 8 del epic (modelo de tiempo por capa). Compatible con la realidad operativa: trimestral está soportado por contrato Spec 40 pero pendiente de corrida con red |
| 10 | Patrón de subindicadores — contrato técnico | Extender contrato `Layer` con `subIndicators?: LayerSubIndicator[]` opcional (propuesta r3 para Spec 39). Cada subindicador tiene su propio `getValueForCountry` | Permite implementar el render sin esperar a que Product Design cierre el aspecto visual. El contrato es independiente del aspecto |
| 11 | Reading guide markdown | Un solo `precipitacion.md` con secciones por país piloto + intro general + sección "Otros países" como pendiente | Spec 39 establece que el reading guide es full markdown desde el vault. Esta spec ajusta a la realidad de la cobertura editorial piloto |
| 12 | Render de quality flag | Países con `quality: "estimado"` o `"congelado"` se renderizan con un overlay sutil usando `--mi-precipitacion-stale`. Tooltip incluye la etiqueta | Heredado de Spec 40 §decisiones #6 y #13 (transparencia metodológica) |

### Cerradas en r2 (sesión de Product Design 2026-05-20 — Mapa Inestable Design System · spec42/index.html)

#### 13 · Decisión A · UI de subindicadores → **A.4 combinación tooltip mínimo + drawer completo**

- **Hover sobre país** → tooltip mínimo flotante (~280px):
  - Sello mono del código de país (ej. `AR`).
  - Nombre del país en Alfa Slab One.
  - Período activo (ej. `Q4 2024 · PBI`).
  - Valor PBI grande en Fraunces con signo + label: `−1.8% recesión` (rojo terracota) o `+2.5% crecimiento` (tinta).
  - CTA: `Click · abrir análisis →`.
  - **Sin subindicadores en el tooltip.**
- **Click sobre país** → drawer lateral derecho (~380px):
  - Encabezado (sello, nombre, período, valor PBI grande).
  - Bloque "Lectura" con narrativa editorial (solo para los 3 pilotos AR/BR/CL en r1; resto con drawer genérico).
  - Bloque "Subindicadores" con 4 filas: cada una con etiqueta + valor + sparkline de 8 períodos. Tendencia codificada en el color de la sparkline (tinta para tendencia buena, terracota oscura para tendencia mala), considerando `invertGood` cuando aplica (inflación y deuda invierten — más alto = peor).
- **Mobile** → sin hover; el tap abre directamente el drawer. La tooltip mínima se omite.

**Razón:** respeta el principio "el indicador principal manda el color, los subindicadores enriquecen sin desplazar"; gesto progresivo que no satura la lectura rápida; funciona en mobile sin componente especial; patrón replicable a las 3 capas restantes sin tocar el contrato `Layer`.

**Compromiso aceptado:** no permite comparar subindicadores entre países sin abrir cada drawer. Mitigación: el drawer respeta el slider de período, así que mover el slider con el drawer abierto permite ver la evolución del país elegido a través del tiempo.

**Update al contrato técnico:** la propuesta de `LayerSubIndicator[]` (decisión 10 de r1) sigue válida sin cambios. El único consumidor de subindicadores es el `LayerReadingDrawer`, no el tooltip.

#### 14 · Decisión B · Distinción crecimiento ↔ recesión → **B.4 solo en leyenda y tooltip**

- **Mapa muestra solo magnitud.** Un PBI de +3% y un PBI de −3% se rendean con el mismo color (mismo bucket). El polígono lleva fill `--mi-precipitacion-{bucketIndex}`, sin ningún mecanismo visual adicional para distinguir signo.
- **La dirección aparece en dos superficies textuales:**
  - **Tooltip / drawer:** valor formateado siempre con signo y label explícito: `−1.8% recesión` (en color terracota warm `--mi-accent-warn` o equivalente) vs `+2.5% crecimiento` (en tinta principal).
  - **Leyenda:** bloque "Dirección" debajo de la escala secuencial, con dos filas: `+ crecimiento (color = magnitud)` / `− recesión (mismo color, ver tooltip)`. La leyenda hace explícito el contrato semántico.

**Razón:** mapa más limpio (Tomás priorizó legibilidad del mapa sobre "diagnóstico de un vistazo"); coherencia total con la escala secuencial intensidad de r1; paleta única, mantiene Grabado sin pedirle al mapa que cargue significados que pueden vivir en texto; no reintroduce diverging (descartado en r1).

**Compromiso aceptado — relajación de la restricción A.5 del Anexo A:** el brief decía *"La distinción debe ser visible en el mapa sin abrir el tooltip — alguien que mira el mapa debe poder identificar 'este país está en recesión' sin pasar el mouse."* Esta restricción se relaja conscientemente en r2. Las otras restricciones (no segundo color, no romper escala secuencial, coherencia con dirección Grabado) tienen más peso editorial que la legibilidad inmediata de la dirección en el mapa. Un lector que quiera saber si un país está en recesión debe hacer hover (desktop) o tap (mobile).

**Implicancia en accesibilidad:** la dirección queda accesible solo a través de interacción, no de lectura visual pasiva. Aceptable para el público objetivo de Mapa Inestable (lector que entra a interpretar, no a "echar un vistazo"), pero conviene documentarlo en la guía de lectura y en el reading guide markdown.

#### 15 · Decisión C · Diseño del glyph SVG → **C.4 nube + gotas**

- Glyph SVG: nube simplificada en trazo manuscrito Grabado con tres gotas debajo de tamaños levemente distintos.
- **Tamaños obligatorios:** 24px (LayerController), 36px (drawer header, opcional), 56px (overlay del mapa — reservado pero **no usado en r2** por B.4).
- **Versión "seca"** (recesión): se diseña y se entrega como `precipitacion-recesion.svg`, pero **no se referencia desde el frontend** porque B.4 no requiere glyph por país. Queda disponible para una eventual r3 si se quisiera reincorporar una pista visual mínima en el mapa.
- Entregable del diseñador: SVG vectorial a 48px de viewBox con stroke variable 1.5-2.5px, paleta `currentColor` para integración con CSS.

**Razón:** aunque el glyph no carga la dirección en el mapa (por B.4), sigue siendo la firma visual de la capa en el LayerController, en headers del drawer y en la documentación. C.4 es el más elaborado de los 4 candidatos y comunica "precipitación" con mayor claridad sin texto.

**Compromisos:**
- El glyph es más detallado que las opciones alternativas — exige cuidado al escalar a 24px (puede saturarse). Mitigación: la versión 24px usa menos gotas o gotas más pequeñas para mantener legibilidad.
- El sistema de glyphs de las 4 capas debe diseñarse coherentemente con C.4 como ancla — todos los glyphs futuros (temperatura, viento, presión) deben acompañar el nivel de detalle de "nube + elementos" para no romper el sistema.

---

## Decisiones abiertas — condicionales para r3

No quedan decisiones bloqueantes para implementación. Lo que sigue son re-evaluaciones que se hacen con evidencia operativa:

1. **Si la implementación de A.4 muestra que el contrato `LayerSubIndicator` necesita campos adicionales** (ej. distinguir "vista corta" vs "vista larga", o pasar parámetros de la sparkline al subindicador), agregar campos opcionales en r3. La estructura base sigue siendo `{ slug, label, unit, getValueForCountry }`.
2. **Si el patrón visual de Spec 42 no traduce bien a Spec 43 (temperatura)** — porque la unidad y el rango son distintos —, esta spec deja explícito que el patrón es **propuesto, no impuesto**. Spec 43 puede divergir en r1 si hace falta.
3. **Caveat heredable para Spec 44 (viento):** la dirección pro-mercado ↔ pro-estado es la lectura principal de la capa viento, no auxiliar como en precipitación. Spec 44 debe revaluar si B.4 (dirección solo en leyenda y tooltip) sigue siendo apropiado o si se necesita un mecanismo visual de dirección sobre el mapa para esa capa específica.
4. **Cobertura editorial r3: completar los 7 países restantes** después de validar el patrón visual con el piloto AR/BR/CL en producción.
5. **Subindicadores trimestrales/mensuales**: hoy todos son anuales. Si más adelante alguno se popula con cadencia sub-anual, esta spec re-vasalla en r3.
6. **Discoverability de la dirección.** Si en producción aparece evidencia de que usuarios no descubren que el color codifica solo magnitud (ej. confunden recesión con crecimiento), revaluar B.4 e introducir mecanismo visual mínimo en el mapa (p.ej. dot pequeño en esquina del polígono recesivo). Mitigación inicial: reading guide markdown abre con ejemplo `−6.5% recesión vs +6.5% crecimiento → mismo color, lectura distinta`.

---

## No incluido en esta spec

- Reading guide curado para Bolivia, Colombia, Ecuador, Paraguay, Perú, Uruguay, Venezuela → r3.
- Página dedicada de documentación profunda → Spec 39B (post-Spec 42 implementada).
- Multi-capa simultánea → Spec 47.
- Algoritmo de detección de ciclos / fases → spec posterior si hay demanda.
- Subnacional (Brasil, Argentina) → spec posterior, granularidad país por decisión 10 del epic.

---

## Implementación sugerida

Orden recomendado en sesión de VS Code:

1. **Crear `layers.css`** con tokens `--mi-precipitacion-0..4` + `--mi-precipitacion-nodata` + `--mi-precipitacion-stale`. Smoke test: verificar que los 5 colores son distinguibles entre sí en el mapa.
2. **Implementar `lib/layers/precipitacion.ts`** con `buildPeriods`, `magnitudBucket`, `direction`, `getValueForCountry`, `getLastPeriodBefore`. Pasar typecheck.
3. **Tests unitarios** de las 5 funciones helper + de `getValueForCountry` con fixtures de AR 2023, BR 2020, CL 2022.
4. **Reemplazar el placeholder `precipitacionLayer`** en `lib/layers.ts` con el módulo real. Smoke test del registry `LAYERS.precipitacion`.
5. **Sincronizar glyph SVG C.4** desde el SSOT del vault (`70-Producto/design-system/mapa/glyphs/precipitacion.svg`, entregado 2026-05-20) al frontend (`platform/frontend/public/mapa/glyphs/precipitacion.svg`). El SVG está en `viewBox="0 0 48 48"` con `stroke="currentColor"` y `stroke-width="2"`, `stroke-linecap/linejoin="round"` — listo para usar sin tocar. Patrón análogo al de `paises-poligonos.json`: vault es fuente canónica, frontend lee copia sincronizada. **Caveat de C.4:** las 3 gotas son trazos inclinados; a 24px en el LayerController pueden quedar apretadas — verificar legibilidad al integrar; si hace falta, agregar una variante 24px optimizada en el vault. La versión `precipitacion-recesion.svg` también está en el vault pero **no se referencia** desde el frontend (B.4).
6. **Extender `LayerLegend.tsx`** para soportar `LayerScaleType: "continuous"` con 5 buckets + bloque "Dirección" debajo de la escala con dos filas (`+ crecimiento` / `− recesión`) que aclaren que el color codifica solo magnitud (B.4).
7. **Extender `LayerReadingDrawer.tsx`** con la estructura A.4: encabezado (sello + nombre + período + valor PBI grande con signo y label) + bloque "Lectura" (curado para AR/BR/CL, genérico para otros 7) + bloque "Subindicadores" con 4 filas (etiqueta + valor + sparkline de 8 períodos, tendencia codificada con `invertGood` para inflación y deuda).
8. **Extender `MapaTorresGarcia.tsx`** para consumir `precipitacionLayer.getValueForCountry(slug, period)` y aplicar `bucket.color` al fill (Gaussian blur ya implementado por Spec 39). **No se renderiza distinción de dirección en el mapa** (B.4). Implementar tooltip mínimo on-hover (~280px) con el contenido de A.4. En mobile, el tap abre directamente el drawer sin tooltip intermedio.
9. **Escribir `70-Producto/lecturas-capas/precipitacion.md`** con contenido para ARG, BRA, CHI + intro general + sección "Otros países pendiente". Sesión editorial separada.
10. **Smoke test integrado**: activar la capa desde `/mapa`, navegar 5 períodos con el slider, abrir drawer en los 3 países piloto + 1 no-piloto, verificar que todos AC1-AC13 se cumplen.
11. **Iteración post-Product Design**: cuando Anexo A esté resuelto, cerrar AC14, AC15 e iterar el glyph SVG final.

Tiempo estimado:
- Pasos 1-10 (sin Product Design): **2-3 días** en VS Code.
- Cierre de Anexo A en sesión dedicada de Product Design: 1 sesión.
- Iteración post-Product Design (paso 11): **0.5-1 día**.

---

## Anexo A · Brief para sesión de Product Design

Este anexo es **autocontenido**. Se puede extraer y llevar a una sesión separada de Product Design sin necesidad de leer el resto de Spec 42.

### A.1 Contexto del producto

**Mapa Inestable** es una plataforma de análisis político-cultural de Sudamérica. Su pieza central es un **mapa Torres García invertido** (sur arriba, referencia a "América Invertida" de 1943) con hot-zones por país que abren análisis editoriales. Sitio actual: https://mapa-inestable-v1.vercel.app/mapa.

El epic en curso (EPIC 03) agrega cuatro **capas analíticas** estilo Windy sobre el mapa: viento, temperatura, presión, precipitación. Spec 42 implementa la primera capa real — **precipitación = crecimiento económico**.

### A.2 Dirección estética anclas

- **Nombre del estilo:** Grabado.
- **Tipografía display:** Alfa Slab One.
- **Color dominante:** terracota (`#b85a32` aproximado).
- **Color neutro:** papel crema (`#f4ead8`), tinta oscura (`#1f1813`).
- **Sin border-radius.** Todo cuadrado.
- **Sombras duras**, no difusas.
- Las fronteras del mapa están difuminadas con Gaussian blur (Spec 39, decisión deliberada — el dibujo Torres García no es cartográfico, no debe parecerlo).
- **Glyphs SVG custom**, no emojis. Cada capa tiene su propio glyph dibujado a mano alzada en el espíritu del proyecto.

Referencias en el vault:
- `70-Producto/design-system/design-system.md` — tokens completos.
- `70-Producto/design-system/cover-style-guide.md` — guía de portadas (estilo aplicable).
- `70-Producto/design-system/mapa/` — assets del mapa actual.

### A.3 Lo que Spec 42 deja cerrado

Para no reabrir cosas que ya tienen decisión:

- **Indicador principal** = crecimiento del PBI, en %, escala secuencial intensidad (un solo tono, 5 buckets de magnitud).
- **4 subindicadores** = inflación, inversión/PBI, deuda/PBI, productividad laboral.
- **Paleta de magnitud**: 5 pasos de terracota (`--mi-precipitacion-0..4`, hex en §3.3 de Spec 42).
- **3 países piloto** = Argentina, Brasil, Chile (los 3 con drawer curado; los otros 7 con drawer genérico).
- La distinción magnitud/dirección **se separa** — el bucket capta solo magnitud absoluta, la dirección (crecimiento vs recesión) se resuelve visualmente con un mecanismo aparte (esto es lo que Product Design define).

### A.4 Decisión A · UI de subindicadores

**El problema.** Cada capa expone un indicador principal + 4 subindicadores. La capa principal manda el color del país en el mapa. Los subindicadores enriquecen la lectura — son contexto que vuelve la capa más densa interpretativamente sin desplazar al indicador principal. Pregunta: ¿dónde y cómo se ven los subindicadores?

**Restricciones.**

- Los subindicadores deben ser **opcionales en visibilidad**: un usuario que solo quiere la lectura rápida del PBI no debe sentirse obligado a procesar 4 valores más.
- Deben ser **fáciles de comparar entre países**: idealmente, al hacer hover sobre tres países distintos, se pueden comparar sus subindicadores sin abrir/cerrar drawers.
- El reading drawer es una superficie que en r1 se abre on-click sobre un país. Tiene espacio vertical generoso, soporta full markdown (tablas, links, listas).
- El tooltip de hover es un componente flotante chico, máximo 280px de ancho aproximado.
- El LayerController vive en el rail izquierdo, ocupa 240px de ancho.
- El patrón que se elija acá **se replica en Spec 43, 44 y 45** — cada capa tendrá sus propios 4 subindicadores. La elección de hoy compromete las próximas 3 capas.

**Opciones a explorar (no exhaustivas — Product Design puede proponer otras).**

1. **Sección expandida en el reading drawer** (al click sobre país).
   - Pro: espacio amplio para sparklines o mini-cards de cada subindicador.
   - Contra: no se comparan entre países sin cerrar/abrir.
2. **Chips en el tooltip de hover** (al pasar por encima).
   - Pro: comparación rápida entre países.
   - Contra: tooltip se carga; espacio para 4 chips legibles en 280px es ajustado.
3. **Controles "vista" en el LayerController** (el usuario elige qué sub-vista de precipitación quiere ver: PBI / inflación / inversión / deuda).
   - Pro: el mapa entero cambia para mostrar el subindicador.
   - Contra: rompe la idea "una sola capa con 4 dimensiones secundarias"; convierte cada subindicador en una capa fantasma.
4. **Combinación chips en hover + drawer expandido**.
   - Pro: lo mejor de ambos mundos.
   - Contra: más componentes que mantener.
5. **Algo más** — Product Design puede proponer.

**Outputs esperados de la sesión de Product Design.**

- 3-5 mockups (HTML, Figma, sketches escaneados — formato libre) con propuestas alternativas, incluyendo al menos 2 de las opciones listadas y al menos 1 propuesta novel.
- Para cada mockup: cómo se ve en desktop (mapa ~1200px ancho) y en mobile (~360px ancho).
- Criterios de evaluación que el diseñador usó para llegar a la propuesta final.
- Recomendación con razón breve.

### A.5 Decisión B · Distinción crecimiento ↔ recesión

**El problema.** La escala secuencial intensidad codifica la magnitud del cambio del PBI usando 5 pasos de saturación de un solo color (terracota). Eso significa que un crecimiento +3% y una recesión −3% **comparten exactamente el mismo color**. Hay que distinguir dirección sin reintroducir una segunda paleta (porque eso rompería el patrón secuencial y el design system Grabado).

**Restricciones.**

- No introducir un segundo color en el fill (eso volvería a diverging y rompe Decisión 4 cerrada por Tomás).
- ~~La distinción debe ser **visible en el mapa sin abrir el tooltip** — alguien que mira el mapa debe poder identificar "este país está en recesión" sin pasar el mouse.~~ **Esta restricción se relajó conscientemente en r2** al elegir B.4 (dirección solo en leyenda y tooltip). Las otras restricciones del Anexo A tuvieron más peso editorial que la legibilidad visual pasiva de la dirección.
- La distinción debe ser **accesible** — no depender solo de un mecanismo visual que un usuario con discapacidad cromática no pueda procesar.
- Debe **coexistir con el Gaussian blur del fill** del polígono (Spec 39).
- Debe ser **fácil de mostrar en la leyenda** — la leyenda tiene espacio acotado en la esquina superior derecha.
- El mecanismo se replica en Specs 43, 44, 45 — cualquier capa con dirección lo va a usar. **Caveat r2:** Spec 44 (capa viento) tiene la dirección como lectura principal (pro-mercado ↔ pro-estado); ese caso debe revaluar si B.4 sigue siendo apropiado o si se necesita un mecanismo visual específico.

**Opciones a explorar (no exhaustivas).**

1. **Glyph SVG orientado.** Cada hot-zona con capa activa tiene un glyph (gota) centrado encima. Crecimiento: gota normal (apunta hacia abajo, como cae la lluvia). Recesión: gota invertida o un símbolo distinto (gota seca, símbolo de evaporación).
2. **Trama sobre el fill.** Crecimiento: fill sólido. Recesión: patrón de líneas diagonales o puntos sobre el mismo color de fill.
3. **Anillo / borde.** Crecimiento: sin borde. Recesión: borde fino del color del bucket más oscuro alrededor de la hot-zona.
4. **Solo en leyenda y tooltip.** Mapa idéntico para crecimiento/recesión; la distinción aparece al leer el valor formateado ("−3.2% recesión"). Implica que el lector tenga que leer texto, no solo color.
5. **Inclinación o rotación del glyph.** Si se elige opción 1, la versión "recesión" no es un glyph distinto sino el mismo rotado 180° o inclinado.
6. **Algo más.**

**Outputs esperados de la sesión de Product Design.**

- 3-5 mockups con propuestas alternativas, considerando las 4 opciones listadas como mínimo.
- Mockup mostrando los 10 países con un mix de crecimiento (BRA, CHI) y recesión (ARG en algunos años) para demostrar legibilidad.
- Test rápido de accesibilidad cromática (simular daltonismo) en al menos 1 de las propuestas.
- Recomendación con razón.

### A.6 Decisión C · Diseño final del glyph `precipitacion.svg`

**El problema.** Cada capa tiene un glyph SVG custom usado en (a) el LayerController para el toggle, (b) eventualmente el render sobre cada hot-zone si Decisión B opta por glyph orientado. El glyph debe ser:

- Reconocible como "precipitación" sin texto.
- Coherente con el espíritu Grabado del proyecto (trazo manuscrito, no vectores limpios de ícono comercial).
- Funcional a 24px (controller) y a 48-64px (overlay sobre país en el mapa, si aplica).
- Distinguible de los glyphs de las otras 3 capas (que aún no se diseñaron, pero conviene pensarlo como sistema).

**Referencias.**

- `70-Producto/design-system/` para el lenguaje visual del proyecto.
- `70-Producto/design-system/cover-style-guide.md` (las portadas son el mejor ejemplo del trazo manuscrito que se busca).
- El glyph "precipitación" en Windy es una gota muy genérica; conviene divergir.

**Outputs esperados.**

- SVG final.
- Versión a 24px y a 48px (renderizada en imagen).
- Versión "crecimiento" y versión "recesión" si Decisión B opta por glyph orientado.
- Test sobre el mapa real (montaje rápido) para validar que se ve bien sobre el fill terracota.

### A.7 Modo de operación

- Esta sesión de Product Design puede correr en cualquier herramienta (Cowork con un skill diferente, Figma con un colaborador externo, sesión de diseño visual standalone).
- El resultado se ingresa de vuelta a Spec 42 como decisiones A, B, C cerradas → la spec bumpea a borrador-r2.
- Una vez cerrada r2, la spec va a VS Code para implementación final.

---

## Histórico

| Fecha | Cambio | Razón |
|---|---|---|
| 2026-05-20 | Creación de la spec en sesión de Cowork. r1 cierra 12 decisiones: alcance completo (indicador principal + 4 subindicadores), escala secuencial intensidad con 5 buckets de magnitud, separación magnitud/dirección, paleta terracota 5 pasos, cobertura editorial piloto en ARG/BRA/CHI con cobertura técnica en los 10, contrato técnico de subindicadores. Quedan 3 decisiones abiertas (A, B, C) que se resuelven en sesión de Product Design — Anexo A las documenta autocontenidamente | Primera capa real del EPIC 03. Implementa decisión 5 del epic (precipitación = crecimiento económico) y resuelve la pregunta abierta #4 del epic sobre patrón de subindicadores. El brief para Product Design permite paralelizar el diseño visual con la implementación técnica de la spec |
| 2026-05-20 (r2) | Cerradas las 3 decisiones visuales del Anexo A en sesión de Product Design (Mapa Inestable Design System · spec42/index.html). **A.4** combinación tooltip mínimo + drawer completo (subindicadores solo en drawer, tooltip lleva valor PBI con signo). **B.4** dirección solo en leyenda y tooltip (mapa muestra solo magnitud — restricción A.5 del Anexo A relajada conscientemente). **C.4** glyph nube + gotas (versión "seca" se entrega pero no se referencia desde el frontend). AC15 reescrito; AC11 y AC14 cerrados. Implementación sugerida pasos 5-8 actualizados con los detalles del cierre. La spec queda **lista para handoff a VS Code sin decisiones bloqueantes** | Sesión de Product Design cerró el Anexo A. Tomás priorizó "mapa limpio + lectura interpretativa en componentes laterales" sobre "diagnóstico de un vistazo" — coherente con el ADN editorial del proyecto. El patrón cerrado en r2 se ofrece como ancla para Specs 43-45 (con caveat para Spec 44 viento donde la dirección es la lectura principal) |
| 2026-05-20 (asset C.4 entregado) | Diseñador entregó los SVGs finales `precipitacion.svg` (crecimiento, nube + 3 trazos inclinados) y `precipitacion-recesion.svg` (versión seca, nube + ondas zigzag). Archivos archivados como SSOT en `70-Producto/design-system/mapa/glyphs/`. Creado README de la nueva carpeta documentando el patrón vault → frontend, el contrato visual (viewBox 48×48, `currentColor`, stroke 1.5-2.5px) y el inventario de glyphs del sistema. Implementación sugerida paso 5 actualizado: el dev de VS Code solo tiene que sincronizar el archivo al frontend, no esperar diseño | Cierra la dependencia visual de C.4. La spec deja de tener pendientes operativos antes de implementar — el dev puede arrancar los 11 pasos sin esperar nada externo |

---

## Glosario

- **Capa principal:** la dimensión que manda el color del país en el mapa. Para precipitación, el crecimiento del PBI.
- **Subindicador:** dimensión secundaria asociada a una capa, que enriquece la lectura sin reemplazar el color principal. Para precipitación, los 4 son inflación, inversión, deuda, productividad.
- **Bucket de magnitud:** uno de los 5 niveles de la escala (0-4). Se aplica al valor absoluto del PBI.
- **Dirección:** crecimiento (PBI > 0.5%), recesión (PBI < −0.5%), neutro (|PBI| ≤ 0.5%). Mecanismo visual definido en Anexo A.
- **Cobertura piloto:** los 3 países (ARG, BRA, CHI) con drawer curado en r1. El resto entra en r2.
- **Cobertura técnica:** los 10 países (todos los datos disponibles del pipeline). Aplica desde r1.
- **Reading guide:** el `.md` del vault que el drawer renderiza como full markdown.
- **Anexo A:** el brief autocontenido para Product Design. Cierra decisiones A (UI subindicadores), B (distinción crecimiento/recesión), C (glyph SVG).
