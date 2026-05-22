---
spec: 43
titulo: Capa temperatura — salario real como termómetro del poder adquisitivo
estado: borrador-r2
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-21 (r2)
revision: 2026-05-21 (r2) — cierra decisión #17 (glyph SVG `temperatura.svg`) en sesión de Product Design (spec43/index.html). Glyph elegido: T.1 termómetro + 3 marcas, en trazo Grabado, patrón principal + secundarios del sistema (paralelo formal a precipitacion.svg). SSOT del SVG queda en `70-Producto/design-system/mapa/glyphs/temperatura.svg`. AC15 queda parcialmente cerrado (la parte SSOT entregada; la sincronización al frontend se cierra en la sesión VS Code donde se implementa la spec). Heredada r1: contrato y patrones de Spec 42 r2 con 3 divergencias locales documentadas
epic: 03
afecta:
  - platform/frontend/src/lib/layers/temperatura.ts (REESCRIBIR — el stub de Spec 39 con datos sintéticos se reemplaza por implementación real)
  - platform/frontend/src/styles/layers.css (EXTENDER — agregar tokens `--mi-temperatura-0..4` siguiendo el patrón de `--mi-precipitacion-*`; este archivo aún no existe y nace con la implementación de Spec 42)
  - 70-Producto/design-system/mapa/glyphs/temperatura.svg (NUEVO — SSOT en vault, queda como entregable de la sesión de Product Design del Anexo A)
  - platform/frontend/public/mapa/glyphs/temperatura.svg (REEMPLAZAR — hoy hay un placeholder lucide-style 24×24 sin trazo Grabado; se reemplaza con la copia sincronizada del vault una vez resuelto Anexo A)
  - 70-Producto/design-system/mapa/glyphs/README.md (ACTUALIZAR — marcar `temperatura.svg` como activo)
  - 70-Producto/lecturas-capas/temperatura.md (NUEVO — reading guide markdown con texto curado para AR/BR/CL + intro general)
  - 70-Producto/design-system/cover-style-guide.md (referencia, no se edita)
depende_de: [39, 40, 42]
depende_blanda_de: [22, 37]
relaciona_con:
  - EPIC-03 (esta spec implementa la decisión 4 del epic: temperatura = salario real con desigualdad como complemento; ahora cerrada con set de subindicadores definido)
  - Spec 39 (arquitectura de capas — esta spec puebla el contrato Layer en su slot `temperatura`)
  - Spec 39B (página dedicada de documentación — el reading guide de esta spec es insumo de Spec 39B cuando se diseñe)
  - Spec 40 (pipeline macro — fuente de c7-salario-real-mensual, c1-desempleo, c2-informalidad, d3-gini, a1-pbi-pc-ppp; dependencia operativa explícita: pipeline tiene que estar corrido con red para hidratar c7 antes de implementar esta spec)
  - Spec 42 (capa precipitación — ancla del patrón: contrato `LayerSubIndicator`, modelo de tiempo por capa, escala secuencial intensidad, A.4 tooltip+drawer, B.4 dirección solo en leyenda/tooltip, C.4 glyph nube+gotas)
desbloquea:
  - Spec 44 (capa viento) — hereda del patrón Spec 42 + Spec 43; el caveat de B.4 para viento sigue pendiente de su propia spec
  - Spec 45 (capa presión) — hereda
pre_requisitos_operativos:
  - "Correr `python platform/data/indicators-macro/build_indicators_macro.py` desde laptop con acceso a internet contra OIT ILOSTAT (código `EAR_4MTH_SEX_ECO_CUR_NB_M`) para hidratar `c7-salario-real-mensual.series_mensual`. Este pendiente está agendado en Spec 40 §Próximos pasos del EPIC 03 y NO requiere spec nueva. Spec 43 NO se implementa en VS Code hasta que este pendiente esté cerrado."
prioridad: alta
---

# 43 · Capa temperatura — salario real como termómetro del poder adquisitivo

## Resumen ejecutivo

Esta spec implementa la **segunda capa analítica real** del EPIC 03, después de Spec 42 (precipitación). Hereda el contrato técnico y los tres patrones visuales que Spec 42 r2 dejó cerrados (A.4 combinación tooltip + drawer, B.4 dirección solo en leyenda y tooltip, C.4 glyph "elemento principal + secundarios"). Las divergencias locales son tres y están documentadas:

1. **Etiqueta del bucket 0** = "Estancado" (no "sin cambio" como Spec 42). En el contexto latinoamericano, un salario real que no se mueve mientras hay inflación o expectativa de mejora **no es neutral, es señal activa de tensión**. La etiqueta absorbe esa carga semántica.
2. **Set de subindicadores con `invertGood`** = tres de los cuatro invierten (`c1-desempleo`, `c2-informalidad`, `d3-gini`: más alto = peor). En Spec 42 solo dos invierten (`a6-inflacion-ipc`, `b6-deuda-pbi`). El patrón del contrato `LayerSubIndicator` ya soporta el flag — no hay cambio técnico, solo más uso del flag.
3. **Dependencia operativa de pipeline c7-salario-real-mensual hidratado**. Spec 42 podía operar con `a2-crecimiento-pbi` ya poblado (anual) con `series_trimestral` opcional pendiente. Spec 43 NO tiene fallback: c7 es solo mensual y está stub. El handoff a VS Code está condicionado al pre-requisito operativo declarado en frontmatter.

**Metáfora climática.** El salario real se lee como temperatura: salario que sube = clima cálido (calor del poder adquisitivo creciendo); salario que cae = clima frío (poder adquisitivo erosionado); salario congelado = clima estancado (sensación térmica que no se mueve aunque haya viento). La metáfora es operativa, no decorativa — los rótulos de los buckets se leen como percepción térmica con la cifra económica directa al lado.

**Lo que entra en r1:**

- Implementación de `lib/layers/temperatura.ts` que cumple el contrato `Layer` de Spec 39, reemplazando el stub sintético.
- Indicador principal: `c7-salario-real-mensual` (índice base 2021=100, OIT ILOSTAT) — **requiere pipeline hidratado**.
- 4 subindicadores ligados a la capa: `c1-desempleo`, `c2-informalidad`, `d3-gini`, `a1-pbi-pc-ppp`. Cobertura ≥9/10 países cada uno (VE faltante en `d3-gini` y `a1-pbi-pc-ppp`).
- Escala secuencial intensidad: **5 buckets de magnitud de la variación interanual del índice** (0 a 4) + flag de dirección (`mejora` | `caida` | `estancado`).
- Paleta — tokens CSS `--mi-temperatura-0..4` — heredada del DS Grabado. Definición concreta en §3.3.
- Glyph SVG custom `temperatura.svg` **cerrado en r2** (Anexo A · decisión #17): **T.1 — termómetro + 3 marcas de escala**. Cuerpo (tubo + bulbo) en un único `<path>` cerrado con curvas Bezier, 3 marcas horizontales de longitudes asimétricas (4/3/4) sobre el costado derecho del tubo como micro-textura manuscrita. viewBox 48×48, `currentColor`, stroke-width 2, trazo Grabado. Entregado a `70-Producto/design-system/mapa/glyphs/temperatura.svg` (SSOT del vault). El glyph NO codifica dirección (B.4 heredado).
- Reading guide markdown en `70-Producto/lecturas-capas/temperatura.md` con contenido editorial curado para los 3 países piloto (ARG, BRA, CHI) + introducción general que aplica a los 10.
- Patrón A.4 cerrado (heredado de Spec 42 r2): tooltip mínimo en hover (~280px) con valor y label de dirección + reading drawer (~380px) con encabezado + bloque "Lectura" + bloque "Subindicadores" con 4 sparklines con `invertGood` por subindicador.
- Patrón B.4 cerrado (heredado de Spec 42 r2): mapa muestra solo magnitud; la dirección aparece en leyenda y tooltip/drawer.
- Test fixture: con los 3 países piloto + 5 períodos arbitrarios, validar que el render no rompe y que los buckets se distribuyen como se esperaría una vez hidratado el pipeline.

**Lo que NO entra en r1:**

- ~~**Glyph SVG definitivo de temperatura**~~ — **resuelto en r2** (Anexo A · decisión #17). Frontend pendiente de sincronizar desde el SSOT del vault en la próxima sesión de VS Code.
- **Reading guide editorial completo de los 7 países no-piloto** (BO, CO, EC, PE, PY, UY, VE). Se completa en r3 después de mirar el patrón en uso real con AR/BR/CL.
- **Hidratación del pipeline c7-salario-real-mensual** — pendiente operativo de Spec 40, no de esta spec.
- **Subnacional Brasil/Argentina** — granularidad país (decisión 10 del epic).
- **Cadencia mensual nativa expuesta al slider** — c7 viene mensual desde OIT, pero esta spec lo agrega a trimestral para alinear los `LayerPeriod[]` con Spec 42. Exposición mensual nativa es decisión condicional para r3.
- **Multi-capa simultánea** (precipitación + temperatura al mismo tiempo) — Spec 47.

---

## Estado actual

### Lo que ya existe (gracias a Spec 39 + Spec 40 + Spec 42 implementadas)

- `data/indicators-macro/indicators-macro.json` versión `macro-v1.1.0` con los 5 indicadores que esta spec necesita:
  - `c7-salario-real-mensual` — **cobertura 0/10 — STUB**. Estructura presente (10 países declarados con `series: []`). Hidratación requiere corrida del pipeline con red contra OIT ILOSTAT código `EAR_4MTH_SEX_ECO_CUR_NB_M`. Sin serie anual ni trimestral nativas.
  - `c1-desempleo` — cobertura **10/10 países**, unidad `%`, familia `empleo`. Serie anual 2010-2024. `invertGood: true`.
  - `c2-informalidad` — cobertura **10/10 países**, unidad `%`, familia `empleo`. Serie anual 2010-2024. `invertGood: true`.
  - `d3-gini` — cobertura **9/10 países** (falta VE), unidad `índice`, familia `sociales`. Serie anual 2010-2024 con algunos gaps. `invertGood: true`.
  - `a1-pbi-pc-ppp` — cobertura **9/10 países** (falta VE), unidad `USD`, familia `riqueza`. Serie anual 2010-2024. `invertGood: false`.
- `lib/macro-indicators.ts` ya tiene `getIndicator(id)` y `getByCountry(indicatorId, slug)` operativos (Spec 40 implementada).
- `lib/layers.ts` ya tiene el contrato `Layer` con `subIndicators?: LayerSubIndicator[]` y `editorialByCountry?: Record<string, string>` (Spec 42 implementada). `LayerSubIndicator` ya tiene `invertGood: boolean` y `getSeries(slug)` que devuelve hasta 8 puntos para sparkline.
- `lib/layers/temperatura.ts` es un **stub** de Spec 39 con datos sintéticos, 4 buckets (no 5), paleta diverging, sin subindicadores, sin `editorialByCountry`. Esta spec lo reescribe entero.
- `public/mapa/glyphs/temperatura.svg` existe como **placeholder lucide** (24×24, sin trazo Grabado). Se reemplaza cuando Anexo A esté resuelto.

### Lo que NO existe todavía

- Tokens CSS `--mi-temperatura-{0..4}` en `styles/layers.css` (el archivo en sí tampoco fue creado todavía — debe nacer con la implementación final de Spec 42 + Spec 43).
- Implementación real de `temperaturaLayer` (hoy el stub).
- Glyph definitivo `temperatura.svg` en el vault (`70-Producto/design-system/mapa/glyphs/`).
- Reading guide `70-Producto/lecturas-capas/temperatura.md`.
- Datos hidratados de `c7-salario-real-mensual` en el JSON (cobertura 0/10 hoy).

---

## Propuesta

### 1. Indicador principal y subindicadores

La capa expone **un indicador principal** (salario real mensual, índice base 2021=100) y **cuatro subindicadores** que enriquecen la lectura sin competir con la dimensión principal.

| Rol | Slug | Unidad | Cadencia primaria | Cadencia fallback | Cobertura prevista (post-hidratación) | `invertGood` |
|---|---|---|---|---|---|---|
| **Principal** | `c7-salario-real-mensual` | índice (base 2021=100) | mensual → agregado a trimestral en runtime | sin fallback (capa renderiza `noData` si pipeline no hidratado) | 10/10 (objetivo OIT) | n/a (la dirección se calcula como signo de la variación) |
| Subindicador 1 — desempleo | `c1-desempleo` | % | anual | — | 10/10 | **true** (más alto = peor) |
| Subindicador 2 — informalidad | `c2-informalidad` | % | anual | — | 10/10 | **true** (más alto = peor) |
| Subindicador 3 — desigualdad | `d3-gini` | índice | anual | — | 9/10 (sin VE) | **true** (más alto = peor) |
| Subindicador 4 — PBI per cápita | `a1-pbi-pc-ppp` | USD const 2017 | anual | — | 9/10 (sin VE) | false (más alto = mejor) |

**Por qué estos 4 y no otros.** La conversación de cierre del epic en r2 propuso "salario real con opción de combinar con ratio mediano/promedio como índice de desigualdad". El "ratio mediano/promedio" no existe en el pipeline — la mejor proxy disponible es `d3-gini`. La elección de los otros 3 sigue una lógica conceptual sistemática:

- **Desempleo** (`c1-desempleo`) — el salario real puede subir mientras el desempleo también sube si la población activa cae o la composición del mercado cambia. Ver desempleo al lado del salario real evita lecturas alegres falsas.
- **Informalidad** (`c2-informalidad`) — un salario real "promedio" mide poco si el 50% de los trabajadores están en la informalidad y no entran al cálculo (o entran mal). En Latam la proporción de informalidad cambia mucho por país (CL 21%, BO 64%): el subindicador hace visible esa estructura.
- **Desigualdad** (`d3-gini`) — el salario real medio puede crecer concentrado en deciles altos. El Gini al lado captura la distribución de quién se beneficia del calor.
- **PBI per cápita** (`a1-pbi-pc-ppp`) — el nivel general de riqueza. Da escala a la lectura: una recuperación de salario real desde un piso de pobreza vs desde un piso de clase media son lecturas distintas.

Esta lectura editorial vive en el reading guide markdown (§5). El código solo carga los 5 indicadores y los entrega al drawer con sus `invertGood` correctos.

### 2. Modelo de tiempo y contrato Layer

El contrato `LayerPeriod` de Spec 39 permite cadencia mixta. Para temperatura:

- `cadence: "trimestral"` declarado en el `Layer`. Refleja la cadencia *intencional* expuesta al slider. El indicador principal viene mensual desde OIT — se agrega a trimestral por **promedio simple** de los 3 meses del trimestre en runtime, para alinear los períodos con el slider de Spec 42.
- `periods[]` se construye en runtime:
  - Si `series_mensual` de c7 tiene datos: períodos trimestrales `{ key: "2024-Q4", date: "2024-12-31", label: "Q4 2024" }`. Se agrupan los meses 1-3 en Q1, 4-6 en Q2, etc., y se promedian.
  - Si `series_mensual` está vacía (pipeline no hidratado): `periods[]` se construye desde el primer subindicador con datos (`c1-desempleo`, anual). Períodos `{ key: "2024", date: "2024-12-31", label: "2024" }`. La capa muestra `noData` en todos los países (no hay c7) pero los subindicadores siguen funcionando en el drawer si se abre. Esto permite que la capa "exista" en el LayerController sin romper el frontend mientras se hidrata el pipeline.
- `defaultPeriod` = último período disponible.
- `getLastPeriodBefore(date)` recorre `periods[]` y devuelve el último ≤ `date` — modelo de tiempo por capa de Spec 39.

**Razón del fallback "soft":** Spec 42 podía caer a serie anual de PBI con dato real. Acá no hay fallback con dato real. La opción es **dejar la capa visible pero vacía** (todos los países en color `noData` con leyenda explicando que el pipeline está pendiente) en lugar de **ocultar la capa del controller**. La primera es preferible porque mantiene el contrato `Layer` íntegro, no rompe `LAYERS` y no requiere lógica condicional en el LayerController.

### 3. Escala secuencial intensidad — 5 buckets + dirección

Mismo patrón que Spec 42 §3, con divergencias locales claras.

#### 3.1 Buckets

5 buckets de **magnitud absoluta de la variación interanual del índice** de salario real, independientes de signo. La variación interanual (Δ%) compara el índice del trimestre actual con el mismo trimestre del año anterior (year-over-year).

| `bucketIndex` | Magnitud | Rango de `|Δ% salario real|` | Label editorial |
|---|---|---|---|
| 0 | mínima | ≤ 0.5% | **"Estancado"** (divergencia vs Spec 42) |
| 1 | leve | 0.5% – 1.5% | "leve" |
| 2 | moderada | 1.5% – 3% | "moderado" |
| 3 | fuerte | 3% – 6% | "fuerte" |
| 4 | extrema | > 6% | "extremo" |

**Divergencia local #1 — etiqueta del bucket 0.** Mientras Spec 42 etiquetó este bucket como "sin cambio" (neutro), Spec 43 lo etiqueta **"Estancado"**. Razón: en el contexto latinoamericano, un salario real que no se mueve mientras hay inflación o expectativa de mejora **no es neutral, es señal activa de tensión** (decisión confirmada por Tomás 2026-05-21). La etiqueta absorbe esa carga semántica. El reading guide markdown amplía el matiz.

**Calibración de rangos.** Heredada de Spec 42 sin recalibrar. La variación interanual del salario real en Latam tiene volatilidad comparable a la del PBI (caídas de 5-15% en años de crisis, recuperaciones de 5-10%). Los buckets pueden absorber esa variabilidad. **Caveat de calibración:** una vez hidratado el pipeline c7 contra OIT, conviene mirar la distribución empírica antes de mergear r2 — si el bucket 2 (`moderado`) absorbe >60% de los datapoints, conviene reescalar. Esta revisión queda agendada en Decisiones abiertas §5.

**El signo de la variación se separa del bucket** (igual que Spec 42). El `LayerValue` retorna:

```ts
{
  raw: variacionAnualPct,                          // -2.5 o +3.1, signo incluido
  formatted: variacionAnualPct >= 0
    ? `+${variacionAnualPct.toFixed(1)}% mejora`
    : `${variacionAnualPct.toFixed(1)}% caída`,
  bucketIndex: magnitudBucket(variacionAnualPct),  // 0-4 según |raw|
  delta: deltaVsPrevPeriod,                        // opcional
  quality: "oficial",                              // según pipeline
}
```

Esto encaja con `LayerScaleType: "continuous"` del contrato — la escala es secuencial creciente en magnitud. La dirección es metadata adicional que cada componente del frontend decide cómo renderizar (B.4 heredado: dirección solo en leyenda y tooltip/drawer, no en el mapa).

**Casos especiales del label `formatted`:**
- Si `|raw| ≤ 0.5%`: `formatted = "+0.2% estancado"` o `"−0.3% estancado"` (sin "mejora" ni "caída"). El bucket 0 absorbe la dirección en su propia etiqueta.
- Si `raw > 0.5%`: `formatted = "+X.X% mejora"`.
- Si `raw < -0.5%`: `formatted = "−X.X% caída"`.

#### 3.2 Por qué separar magnitud y dirección

Heredado tal cual de Spec 42 §3.2. Tres motivos: honestidad metodológica (mejora +3% y caída −3% comparten magnitud), compatibilidad con la paleta Grabado (terracota), extensibilidad a Specs 44 y 45.

#### 3.3 Paleta — tokens CSS

Definición concreta de tokens, terracota base con 5 pasos de saturación. La paleta de temperatura **no replica los hex de precipitación**: usa una variante levemente desplazada hacia el amarillo cálido (más "termo") para diferenciar las capas cuando ambas estén implementadas y, eventualmente, visibles juntas (Spec 47).

```css
/* platform/frontend/src/styles/layers.css (extensión) */

:root {
  /* Escala secuencial temperatura — un solo tono, 5 pasos de saturación, sesgo cálido */
  --mi-temperatura-0: #f1e6d4;  /* bucket 0 · estancado — neutro tibio, base crema cálida */
  --mi-temperatura-1: #e8c89a;  /* bucket 1 · leve */
  --mi-temperatura-2: #d4995a;  /* bucket 2 · moderada */
  --mi-temperatura-3: #b9682b;  /* bucket 3 · fuerte */
  --mi-temperatura-4: #834010;  /* bucket 4 · extrema */

  /* Variantes para indicar dirección — B.4 hereda de Spec 42: ambas iguales al color base.
     Color codifica solo magnitud; la dirección vive en leyenda y tooltip. */
  --mi-temperatura-direccion-mejora:    var(--mi-temperatura-base, currentColor);
  --mi-temperatura-direccion-caida:     var(--mi-temperatura-base, currentColor);
  --mi-temperatura-direccion-estancado: var(--mi-temperatura-base, currentColor);

  /* Sin dato — gris del DS */
  --mi-temperatura-nodata: var(--mi-ink-mute);

  /* Quality flag — congelado / estimado */
  --mi-temperatura-stale: var(--mi-paper-shade);
}
```

**Decisión cerrada:** la paleta es terracota con sesgo cálido porque (a) coherente con la dirección Grabado, (b) diferenciable de la paleta precipitación cuando ambas estén visibles (Spec 47), (c) la metáfora "temperatura cálida" se sostiene en el sesgo amarillo del tono base.

**Decisión cerrada — B.4 heredado:** distinción mejora/caída/estancado vive solo en leyenda y tooltip. Mapa muestra solo magnitud. Las tres variantes `--mi-temperatura-direccion-*` quedan iguales al color base.

### 4. Implementación de `temperaturaLayer`

Esqueleto del módulo (deriva directo de `precipitacion.ts`):

```ts
// platform/frontend/src/lib/layers/temperatura.ts

import type { Layer, LayerPeriod, LayerValue, LayerSubIndicator, LayerQuality } from "../layers";
import { getIndicator, getByCountry } from "../macro-indicators";

const PRINCIPAL = "c7-salario-real-mensual";
const SUBINDICADORES = [
  { slug: "c1-desempleo",     label: "Desempleo",      unit: "%",        invertGood: true  },
  { slug: "c2-informalidad",  label: "Informalidad",   unit: "%",        invertGood: true  },
  { slug: "d3-gini",          label: "Desigualdad",    unit: "Gini",     invertGood: true  },
  { slug: "a1-pbi-pc-ppp",    label: "PBI per cápita", unit: "USD PPP",  invertGood: false },
] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

function quarterEndDate(year: number, quarter: number): string {
  const monthEnd = [3, 6, 9, 12][quarter - 1];
  const lastDay = new Date(year, monthEnd, 0).getDate();
  return `${year}-${String(monthEnd).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
}

export function magnitudBucket(deltaPct: number): number {
  const abs = Math.abs(deltaPct);
  if (abs <= 0.5) return 0;
  if (abs <= 1.5) return 1;
  if (abs <= 3)   return 2;
  if (abs <= 6)   return 3;
  return 4;
}

export function direction(deltaPct: number): "mejora" | "caida" | "estancado" {
  if (Math.abs(deltaPct) <= 0.5) return "estancado";
  return deltaPct >= 0 ? "mejora" : "caida";
}

export function formatTemperatura(deltaPct: number): string {
  const dir = direction(deltaPct);
  const sign = deltaPct >= 0 ? "+" : "";
  const pct = `${sign}${deltaPct.toFixed(1)}%`;
  if (dir === "estancado") return `${pct} estancado`;
  return `${pct} ${dir}`;
}

/** Agrega serie mensual a trimestral por promedio simple de los 3 meses del trimestre. */
function aggregateMensualToTrimestral(mensual: Array<{ year: number; month: number; value: number; quality: LayerQuality }>) {
  const map = new Map<string, { year: number; quarter: number; values: number[]; qualities: LayerQuality[] }>();
  for (const dp of mensual) {
    const quarter = Math.ceil(dp.month / 3);
    const key = `${dp.year}-Q${quarter}`;
    const slot = map.get(key) ?? { year: dp.year, quarter, values: [], qualities: [] };
    slot.values.push(dp.value);
    slot.qualities.push(dp.quality);
    map.set(key, slot);
  }
  return [...map.values()].map(s => ({
    year: s.year,
    quarter: s.quarter,
    value: s.values.reduce((a, b) => a + b, 0) / s.values.length,
    quality: worstQuality(s.qualities),
  }));
}

function worstQuality(qs: LayerQuality[]): LayerQuality {
  if (qs.includes("congelado")) return "congelado";
  if (qs.includes("estimado"))  return "estimado";
  return "oficial";
}

/** Variación interanual: trimestre actual vs mismo trimestre del año anterior. */
function variacionInteranual(
  trimestres: Array<{ year: number; quarter: number; value: number }>,
  year: number,
  quarter: number
): number | null {
  const curr = trimestres.find(t => t.year === year && t.quarter === quarter);
  const prev = trimestres.find(t => t.year === year - 1 && t.quarter === quarter);
  if (!curr || !prev || prev.value === 0) return null;
  return ((curr.value - prev.value) / prev.value) * 100;
}

// ── Construcción de períodos ──────────────────────────────────────────────────

function buildPeriods(): LayerPeriod[] {
  const principal = getIndicator(PRINCIPAL);
  const countriesWithMensual = Object.values(principal.by_country)
    .filter(c => c.series_mensual && c.series_mensual.length > 0);

  if (countriesWithMensual.length > 0) {
    // Agregar mensual a trimestral con el primer país que tenga datos
    const trimestres = aggregateMensualToTrimestral(countriesWithMensual[0].series_mensual!);
    return trimestres.map(t => ({
      key: `${t.year}-Q${t.quarter}`,
      date: quarterEndDate(t.year, t.quarter),
      label: `Q${t.quarter} ${t.year}`,
    }));
  }

  // Fallback soft: pipeline no hidratado. Construir períodos anuales desde el primer subindicador con datos.
  const fallbackInd = getIndicator(SUBINDICADORES[0].slug); // c1-desempleo, anual 10/10
  const anyCountry = Object.values(fallbackInd.by_country)[0];
  return (anyCountry?.series ?? []).map(dp => ({
    key: String(dp.year),
    date: `${dp.year}-12-31`,
    label: String(dp.year),
  }));
}

// ── Subindicadores ────────────────────────────────────────────────────────────

function makeSubIndicator(
  slug: string,
  label: string,
  unit: string,
  invertGood: boolean,
): LayerSubIndicator {
  return {
    slug,
    label,
    unit,
    invertGood,
    getValueForCountry(countrySlug, period) {
      const country = getByCountry(slug, countrySlug);
      if (!country) return null;
      const year = Number(period.key.slice(0, 4));
      const dp = country.series.find(d => d.year === year);
      if (!dp) return null;
      const formatted = unit.startsWith("%")
        ? `${dp.value.toFixed(1)}%`
        : unit === "Gini"
        ? dp.value.toFixed(1)
        : unit === "USD PPP"
        ? `$${Math.round(dp.value).toLocaleString("es-AR")}`
        : `${dp.value.toFixed(1)}`;
      return {
        raw: dp.value,
        formatted,
        bucketIndex: 0,
        quality: dp.quality,
      };
    },
    getSeries(countrySlug) {
      const country = getByCountry(slug, countrySlug);
      if (!country) return [];
      return country.series.slice(-8).map(dp => ({
        key: String(dp.year),
        value: dp.value,
        quality: dp.quality as LayerQuality,
      }));
    },
  };
}

// ── Textos editoriales piloto (AR, BR, CL) ───────────────────────────────────

const EDITORIAL: Record<string, string> = {
  ar: "<TEXTO CURADO — pendiente de redacción editorial cuando c7 esté hidratado y se vean los rangos reales. Estructura: fase actual del salario real, lectura cruzada con desempleo y informalidad, comentario sobre Gini argentino, comentario sobre PBI per cápita relativo a la región.>",
  br: "<TEXTO CURADO — Brasil suele mostrar estabilidad. Estructura sugerida: salario real con rumbo estable, baja informalidad relativa para la región, Gini alto históricamente, PBI per cápita medio en la región. Tensión interpretativa: crecimiento sin redistribución.>",
  cl: "<TEXTO CURADO — Chile como ancla de estabilidad económica. Estructura sugerida: salario real recuperando post-pandemia, informalidad baja (21%), Gini medio-alto, PBI per cápita líder. Tensión interpretativa: estabilidad con desigualdad estructural.>",
};

// ── Layer ─────────────────────────────────────────────────────────────────────

const PERIODS = buildPeriods();

export const temperaturaLayer: Layer = {
  id: "temperatura",
  label: "Temperatura · salario real",
  shortLabel: "Temperatura",
  glyphSrc: "/mapa/glyphs/temperatura.svg",
  category: "macro",
  description: "El calor del poder adquisitivo. Salario real subiendo = clima cálido; cayendo = clima frío; estancado = sensación térmica que no se mueve.",
  unit: "% variación interanual del salario real (índice base 2021=100)",
  cadence: "trimestral",
  legend: {
    type: "continuous",
    buckets: [
      { bucketIndex: 0, label: "Estancado",  color: "var(--mi-temperatura-0)", rangeDescription: "|Δ%| ≤ 0.5%" },
      { bucketIndex: 1, label: "leve",       color: "var(--mi-temperatura-1)", rangeDescription: "0.5% < |Δ%| ≤ 1.5%" },
      { bucketIndex: 2, label: "moderado",   color: "var(--mi-temperatura-2)", rangeDescription: "1.5% < |Δ%| ≤ 3%" },
      { bucketIndex: 3, label: "fuerte",     color: "var(--mi-temperatura-3)", rangeDescription: "3% < |Δ%| ≤ 6%" },
      { bucketIndex: 4, label: "extremo",    color: "var(--mi-temperatura-4)", rangeDescription: "|Δ%| > 6%" },
    ],
    noDataColor: "var(--mi-temperatura-nodata, #5C6638)",
    qualityFlagColor: "var(--mi-temperatura-stale, #C8B894)",
  },
  source: {
    name: "OIT ILOSTAT (EAR_4MTH_SEX_ECO_CUR_NB_M) — pipeline macro-v1.1.0",
    url: "https://ilostat.ilo.org/topics/wages/",
    publishedDate: "2026-05-19",   // se actualiza al hidratar el pipeline
    lastFetched: "2026-05-19",
  },
  periods: PERIODS,
  defaultPeriod: PERIODS[PERIODS.length - 1],

  getValueForCountry(countrySlug, period) {
    const country = getByCountry(PRINCIPAL, countrySlug);
    if (!country || !country.series_mensual || country.series_mensual.length === 0) return null;
    if (!period.key.includes("-Q")) return null; // En modo fallback, principal no tiene valor
    const [yearStr, qStr] = period.key.split("-Q");
    const year = Number(yearStr);
    const quarter = Number(qStr);
    const trimestres = aggregateMensualToTrimestral(country.series_mensual);
    const variacion = variacionInteranual(trimestres, year, quarter);
    if (variacion === null) return null;
    const currT = trimestres.find(t => t.year === year && t.quarter === quarter);
    return {
      raw: variacion,
      formatted: formatTemperatura(variacion),
      bucketIndex: magnitudBucket(variacion),
      delta: undefined,
      quality: currT?.quality ?? "oficial",
    };
  },

  getLastPeriodBefore(date) {
    const sorted = [...PERIODS].sort((a, b) => b.date.localeCompare(a.date));
    return sorted.find(p => p.date <= date) ?? null;
  },

  readingGuideSlug: "temperatura",

  subIndicators: SUBINDICADORES.map(s =>
    makeSubIndicator(s.slug, s.label, s.unit, s.invertGood)
  ),

  editorialByCountry: EDITORIAL,
};
```

Las funciones helper (`magnitudBucket`, `direction`, `formatTemperatura`, `aggregateMensualToTrimestral`, `variacionInteranual`, `worstQuality`) quedan en el mismo archivo y los tests les apuntan directo.

### 5. Reading guide markdown

Vive en `70-Producto/lecturas-capas/temperatura.md`. El drawer lo renderiza como full markdown (Spec 39).

Estructura propuesta:

```markdown
---
layer: temperatura
title: Temperatura · salario real
last_updated: 2026-05-21
---

# Temperatura

Una frase de entrada con la metáfora térmica. Por qué el salario real es el termómetro del poder adquisitivo y por qué el congelamiento no es neutro.

## Cómo se lee

- Qué representa el color (magnitud de la variación interanual del índice de salario real).
- Qué representa la dirección (mejora / caída / estancado) y dónde se lee (leyenda + tooltip + drawer; no en el mapa — convención B.4 heredada de la capa precipitación).
- Por qué el bucket "Estancado" no es neutral: en Latam, un salario real que no se mueve mientras hay inflación o expectativa es señal activa de tensión.

## Subindicadores

- **Desempleo** — qué dice del tamaño del mercado laboral. `invertGood` = más alto es peor.
- **Informalidad** — qué dice de la estructura del trabajo. `invertGood` = más alto es peor. En Latam la dispersión es grande (CL 21%, BO 64%).
- **Desigualdad (Gini)** — qué dice de la distribución del ingreso. `invertGood` = más alto es peor.
- **PBI per cápita PPP** — qué dice del nivel general de riqueza. No invierte: más alto es mejor. Da escala a la lectura de salario real.

## Lectura por país (piloto r1)

### Argentina
<TEXTO CURADO — pendiente de redacción editorial una vez hidratado c7 y vistos los rangos reales. Estructura sugerida: fase del salario real en la serie reciente, comportamiento típico, lectura cruzada con desempleo y informalidad, comentario sobre Gini, comentario sobre PBI per cápita relativo.>

### Brasil
<TEXTO CURADO>

### Chile
<TEXTO CURADO>

## Otros países

> Lectura curada pendiente para Bolivia, Colombia, Ecuador, Paraguay, Perú, Uruguay, Venezuela. El indicador principal y los subindicadores están disponibles en el mapa (con cobertura 9-10/10 según el subindicador); la lectura editorial se completa en r3. Venezuela aparece sin dato para los subindicadores `d3-gini` y `a1-pbi-pc-ppp`.

## Fuente y método

- Indicador principal: OIT ILOSTAT `EAR_4MTH_SEX_ECO_CUR_NB_M` (salario medio mensual deflactado a real, indexado base 2021=100).
- Subindicadores: ver Spec 14A para detalle de cada uno.
- Pipeline: `macro-v1.1.0`.
- Cadencia expuesta al slider: trimestral, agregada por promedio simple desde la serie mensual original.
- Variación interanual: trimestre actual vs mismo trimestre del año anterior (year-over-year).
- Último refresh: ver leyenda del mapa.

## Limitaciones

- Buckets de magnitud heredan los rangos de la capa precipitación; pueden recalibrarse en r2 si la distribución empírica de la variación interanual del salario real lo sugiere.
- Los meses sin dato (`undefined`) se omiten del promedio trimestral; si un trimestre tiene <2 meses con dato, se trata como `noData` para evitar lecturas con base estadística débil.
- Para Venezuela los subindicadores `d3-gini` y `a1-pbi-pc-ppp` no están disponibles — el drawer los muestra como `sin dato`.
- Cobertura inicial del principal depende de la corrida del pipeline con red; ver Spec 40 §pendientes.
```

### 6. Patrón de subindicadores — el plano técnico

Heredado intacto de Spec 42 §6. El contrato `LayerSubIndicator` ya está implementado en `lib/layers.ts` (Spec 42 implementada). Esta spec lo consume sin modificar.

La única diferencia operativa: **tres de los cuatro subindicadores invierten** (`invertGood: true`), mientras que en precipitación solo dos invierten. El frontend ya soporta esto vía el flag — no requiere cambios.

### 7. Cobertura editorial — piloto vs no-piloto

| Plano | 3 países piloto (AR, BR, CL) | 7 países restantes (BO, CO, EC, PE, PY, UY, VE) |
|---|---|---|
| Color de la capa en el mapa | Renderizado con dato real (cuando c7 hidratado) | Renderizado con dato real (cuando c7 hidratado) |
| Hover / tooltip con valor variación | Sí | Sí |
| Subindicadores en drawer (sparklines, 8 puntos anuales) | Sí, con valor real (excepto VE en `d3-gini` y `a1-pbi-pc-ppp` → `sin dato`) | Sí, con valor real |
| Reading drawer largo (al click) — bloque "Lectura" curado | Texto curado editorialmente | Texto mínimo: "Lectura editorial pendiente — ver introducción de la capa" + link a `temperatura.md` |
| Reading guide markdown (`temperatura.md`) | Sección curada con contexto histórico, lectura de subindicadores | Mención en sección "Otros países" como pendiente |

**Por qué Argentina, Brasil, Chile específicamente.** Mismos motivos que Spec 42 (consistencia entre capas + polos extremos + ancla de estabilidad + cobertura editorial preexistente en `15-Países/`). Confirmado por Tomás 2026-05-21.

---

## Archivos a tocar

| Archivo | Acción |
|---|---|
| `platform/frontend/src/lib/layers/temperatura.ts` | REESCRIBIR — reemplaza el stub sintético de Spec 39 con la implementación real descripta en §4 |
| `platform/frontend/src/styles/layers.css` | EXTENDER — agregar tokens `--mi-temperatura-*`. Si el archivo aún no existe (Spec 42 todavía no lo creó en VS Code), Spec 43 lo crea inicializándolo con los tokens de ambas capas |
| `70-Producto/design-system/mapa/glyphs/temperatura.svg` | NUEVO — SSOT en vault, entregable de la sesión de Product Design del Anexo A |
| `platform/frontend/public/mapa/glyphs/temperatura.svg` | REEMPLAZAR — placeholder lucide actual por la copia sincronizada del vault una vez resuelto Anexo A |
| `70-Producto/design-system/mapa/glyphs/README.md` | ACTUALIZAR — marcar `temperatura.svg` como activo con referencia a la decisión de Anexo A |
| `70-Producto/lecturas-capas/temperatura.md` | NUEVO — reading guide markdown, contenido para ARG/BRA/CHI + intro general |

---

## Criterios de aceptación

| # | Criterio | Verificación |
|---|---|---|
| AC1 | `temperaturaLayer` cumple el contrato `Layer` de Spec 39 (typecheck pasa) | `tsc --noEmit` |
| AC2 | **Condicional al pre-requisito operativo:** con `c7-salario-real-mensual` hidratado, los 10 países renderizan con color de bucket correcto para al menos un período trimestral | Smoke test: activar capa, inspeccionar fill de los 10 polígonos |
| AC3 | Sin pipeline hidratado (estado actual del JSON), la capa renderiza con color `noData` en todos los países y la leyenda muestra mensaje explicativo "capa pendiente de hidratación de datos OIT" | Mock el JSON con `series_mensual: []` para todos los países → inspeccionar render |
| AC4 | `getValueForCountry` retorna valor formateado correcto con signo + label de dirección (ej. `+2.5% mejora`, `−1.8% caída`, `+0.2% estancado`) | Test unitario con fixtures de variaciones conocidas |
| AC5 | `magnitudBucket(0.3) === 0`, `magnitudBucket(2) === 2`, `magnitudBucket(7) === 4` | Test unitario |
| AC6 | `direction(0.3) === "estancado"`, `direction(-0.4) === "estancado"`, `direction(2.5) === "mejora"`, `direction(-3.1) === "caida"` | Test unitario |
| AC7 | `formatTemperatura(0.2) === "+0.2% estancado"`, `formatTemperatura(2.5) === "+2.5% mejora"`, `formatTemperatura(-1.8) === "-1.8% caida"` | Test unitario |
| AC8 | Agregación mensual → trimestral: dado un país con meses 1-3 = [100, 102, 104], el trimestre Q1 da value=102 | Test unitario de `aggregateMensualToTrimestral` |
| AC9 | Variación interanual: dado un trimestre Q1-2024 = 110 y Q1-2023 = 100, la variación es +10% | Test unitario de `variacionInteranual` |
| AC10 | `getLastPeriodBefore("2024-06-15")` devuelve el período del JSON ≤ esa fecha | Test unitario |
| AC11 | `subIndicators` expone los 4 indicadores con `getValueForCountry` y `getSeries` funcional. `invertGood` correcto: c1/c2/d3 = true, a1 = false | Test unitario: cada subindicador devuelve valor para AR-2023 y series de 8 puntos |
| AC12 | Reading guide markdown se renderiza correctamente en el drawer para ARG, BRA, CHI | Click en AR → drawer muestra sección "Argentina" con texto curado |
| AC13 | Para los 7 países no-piloto, el drawer muestra el mensaje genérico + link a la intro | Click en BO → drawer dice "Lectura editorial pendiente" + link |
| AC14 | Para Venezuela, el drawer muestra los subindicadores `d3-gini` y `a1-pbi-pc-ppp` como `sin dato` sin romper el render | Click en VE → drawer renderiza sin error, los dos subindicadores con etiqueta `sin dato` |
| AC15 | Glyph SVG `temperatura.svg` definitivo entregado por Product Design (T.1 — termómetro + 3 marcas, ver §Decisiones tomadas r2 · #17) en viewBox 48×48, `currentColor`, trazo Grabado. SSOT en `70-Producto/design-system/mapa/glyphs/temperatura.svg`. Frontend lee la copia sincronizada en `platform/frontend/public/mapa/glyphs/temperatura.svg` | Inspect DOM del LayerController + diff binario `vault ↔ public/` |
| AC16 | Tokens CSS `--mi-temperatura-{0..4}` están definidos y el contraste con `--mi-paper` cumple WCAG AA para texto sobre fill | Lighthouse / contrast checker |
| AC17 | La capa renderiza países con `quality: "estimado"` o `"congelado"` con el flag visual del DS (`--mi-temperatura-stale`) | Mock un país con quality estimado → inspeccionar render |
| AC18 | Tooltip y drawer muestran el valor formateado con signo + label explícito (`mejora` / `caída` / `estancado`). La leyenda incluye un bloque "Dirección" que aclara que el color codifica solo magnitud (B.4 heredado de Spec 42) | Inspección visual: hover sobre AR muestra `−X.X% caída` (o el valor que aplique), hover sobre BR muestra `+X.X% mejora`, fill de ambos comparte color si comparten bucket; leyenda incluye bloque "Dirección" con 3 filas explicativas (mejora / caída / estancado) |

**AC2 queda condicional** al pre-requisito operativo (pipeline hidratado). **AC15 queda cerrado del lado del SSOT** (vault) en r2; su sincronización al frontend (`public/mapa/glyphs/temperatura.svg`) se cierra en la sesión VS Code donde se implementa la spec. El resto cierra en la implementación VS Code.

---

## Edge cases

- **País sin dato para un trimestre** (sin meses suficientes en el trimestre) → `getValueForCountry` retorna `null`. Render: fill con `noDataColor`. Hover: tooltip dice "sin dato para este período".
- **Trimestre con <2 meses de dato** → se descarta y se trata como `noData`. El promedio simple con un solo dato es estadísticamente débil para una variación interanual.
- **Bucket 0 (estancado)** — una variación interanual de +0.3% se rendea como bucket 0 (`Estancado`) con dirección `estancado`. El tooltip muestra "+0.3% estancado". A diferencia de Spec 42, la etiqueta NO es neutral — el lector debe entender que "estancado" es señal activa (reading guide lo explicita).
- **Período pre-2021** (más allá del rango del pipeline mensual) → slider lo bloquea con el `start` del rango global de capas (Spec 39).
- **Dato con `quality: "estimado"` o `"congelado"`** → render usa `--mi-temperatura-stale` como overlay sutil; tooltip incluye la etiqueta. Si el trimestre se construye por promedio de meses con qualities mixtas, se aplica `worstQuality` (`congelado` > `estimado` > `oficial`).
- **Venezuela sin subindicadores `d3-gini` y `a1-pbi-pc-ppp`** → drawer muestra esos dos como `sin dato`. Los otros dos (`c1-desempleo`, `c2-informalidad`) sí están.
- **Frontera entre buckets** — una variación de exactamente 1.5% cae en bucket 1 (`leve`, regla `≤`). Documentado en el reading guide.
- **Variación nula o `NaN`** → tratamiento idéntico a "sin dato". Caso típico: cuando el período Q1-2023 no existe para hacer la comparación Q1-2024.
- **`prev.value === 0` en variación interanual** → división por cero evitada; retorna `null`. Caso teórico improbable para un índice 100=2021, pero defensivo.
- **Pipeline hidratado parcialmente** (solo algunos países tienen `series_mensual` poblada) → la capa expone los períodos trimestrales del primer país con datos; los países sin datos quedan como `noData` en esos períodos. La capa NO degrada a anual si al menos un país tiene mensual.
- **Cambio de pipeline version** (macro-v1.1.0 → macro-v1.2.0) → asumimos contrato JSON estable según Spec 40 §contrato público. Si cambia, esta spec re-vasalla en r2.

---

## Decisiones tomadas

### Cerradas en r1 (sesión 2026-05-21)

| # | Tema | Decisión | Razón |
|---|---|---|---|
| 1 | Alcance r1 | Capa **completa** con indicador principal + 4 subindicadores desde v1 | Misma razón que Spec 42 §decisión 1: la spec hereda el patrón inaugurado y mantenerlo consistente entre capas evita rediseños del contrato `Layer` |
| 2 | Indicador principal | `c7-salario-real-mensual` del pipeline `macro-v1.1.0` (índice base 2021=100, OIT ILOSTAT código `EAR_4MTH_SEX_ECO_CUR_NB_M`) | Definido en decisión 4 del epic. Tomás confirmó 2026-05-21 que la lectura "salario real como termómetro" es el ADN de la capa; el problema operativo de c7 stub se resuelve en Spec 40 (pendiente de corrida con red), no acá |
| 3 | Manejo del pipeline c7 no hidratado | Spec 43 declara dependencia operativa explícita en frontmatter (`pre_requisitos_operativos`). Implementación en VS Code se bloquea hasta que c7 esté poblado. La capa tiene fallback "soft" en runtime: si `series_mensual` está vacío, renderiza con `noData` en todos los países (no oculta la capa del LayerController) | Mantiene el contrato `Layer` íntegro sin lógica condicional en el LayerController. Honesto con el lector: la capa "existe" pero se ve vacía hasta que el dato llegue. Compatible con el patrón de AC condicionales de Spec 42 |
| 4 | Subindicadores | Los 4 confirmados por Tomás 2026-05-21: `c1-desempleo`, `c2-informalidad`, `d3-gini`, `a1-pbi-pc-ppp` | Verificado en `indicators-macro.json`: c1/c2/d5 cobertura 10/10, d3/a1 cobertura 9/10 (sin VE). Lectura sistémica documentada en §1 |
| 5 | `invertGood` por subindicador | `c1`/`c2`/`d3` = true; `a1` = false | Convención semántica: el flag indica si valores más altos son peores para la lectura humanista. Desempleo, informalidad y Gini altos son peores; PBI per cápita alto es mejor |
| 6 | Tipo de escala | **Secuencial intensidad** (un solo tono, más oscuro = más extremo). Magnitud y dirección se separan | Heredado de Spec 42 §decisión 4. Patrón estable para todas las capas del epic con caveat ya documentado para Spec 44 (viento) |
| 7 | Buckets de magnitud | 5 buckets (0-4) con rangos `≤0.5%`, `≤1.5%`, `≤3%`, `≤6%`, `>6%` aplicados al valor absoluto de la variación interanual | Heredados de Spec 42 §decisión 5. Caveat de calibración explícito: revisar distribución empírica una vez hidratado c7 antes de mergear r2 (ver decisiones abiertas §5) |
| 8 | Etiqueta del bucket 0 | **"Estancado"** (no "sin cambio") — **divergencia local consciente vs Spec 42** | En el contexto latinoamericano, un salario real que no se mueve mientras hay inflación o expectativa de mejora no es neutral, es señal activa de tensión. Confirmado por Tomás 2026-05-21 |
| 9 | Paleta | Terracota con sesgo cálido, 5 pasos de saturación. Hex concretos en §3.3 — diferentes a los de precipitación para diferenciar las capas | Coherente con DS Grabado. Diferenciación entre capas anticipa Spec 47 (multi-capa simultánea) |
| 10 | Cobertura editorial r1 | Piloto de 3 países (ARG, BRA, CHI) con drawer + reading guide curados. Otros 7 con drawer genérico + datos crudos | Confirmado por Tomás 2026-05-21: mantener consistencia con Spec 42 prioriza el vocabulario aprendido del lector |
| 11 | Cobertura técnica r1 | Todos los 10 países renderizan con color + hover + subindicadores. VE muestra subindicadores faltantes como `sin dato`. La diferencia piloto/no-piloto es solo editorial | Heredado de Spec 42 §decisión 8. Forzar "color solo para piloto" sería desperdiciar datos disponibles |
| 12 | Cadencia | `cadence: "trimestral"` declarado, agregando `series_mensual` de c7 a trimestral por promedio simple en runtime. Fallback soft a períodos anuales (de un subindicador) cuando c7 vacío | Alinea el slider con Spec 42 sin perder la cadencia más granular del pipeline. Promedio simple es la agregación más defensible sin asumir ponderaciones de calendario. Exposición mensual nativa queda como decisión condicional r3 |
| 13 | Variación interanual (no intertrimestral) | Definir la variación como year-over-year: trimestre actual vs mismo trimestre del año anterior | Quita el ruido estacional (los salarios reales tienen patrones estacionales fuertes en Latam — aguinaldos, paritarias por sector). Es la variación que mejor captura "movimiento estructural" en el sentido que pidió Tomás 2026-05-21 |
| 14 | Patrón A.4 — tooltip + drawer | Heredado intacto de Spec 42 r2. Tooltip mínimo (~280px) sin subindicadores; drawer (~380px) con encabezado + bloque "Lectura" + bloque "Subindicadores" con 4 sparklines (con `invertGood` por subindicador) | Coherencia visual entre capas. El contrato `LayerSubIndicator` ya soporta `invertGood` y `getSeries` — no requiere cambios técnicos |
| 15 | Patrón B.4 — dirección solo en leyenda y tooltip | Heredado intacto de Spec 42 r2 (confirmado por Tomás 2026-05-21). Mapa muestra solo magnitud; la leyenda incluye bloque "Dirección" con 3 filas (mejora / caída / estancado) | Coherencia con Spec 42. La discoverability sigue siendo decisión condicional para r3 si aparece evidencia de confusión en producción |
| 16 | Render de quality flag | Países con `quality: "estimado"` o `"congelado"` se renderizan con overlay sutil usando `--mi-temperatura-stale`. Cuando un trimestre se construye por promedio de meses con qualities mixtas, se aplica `worstQuality` (congelado > estimado > oficial) | Heredado de Spec 40 §decisiones #6 y #13 con extensión propia para la agregación mensual → trimestral |

### Cerradas en r2 (sesión 2026-05-21 · Product Design)

| # | Tema | Decisión | Razón |
|---|---|---|---|
| 17 | Glyph SVG `temperatura.svg` | **T.1 · Termómetro + 3 marcas de escala.** Cuerpo (tubo + bulbo) resuelto en un único `<path>` cerrado con curvas Bezier para que la silueta del bulbo no se rompa al reducir DPI; 3 marcas horizontales secundarias sobre el costado derecho del tubo con longitudes asimétricas 4/3/4 como micro-textura manuscrita. Formato: viewBox 48×48, `stroke="currentColor"`, `fill="none"`, `stroke-width="2"`, `stroke-linecap`/`linejoin="round"`. Una sola versión — sin variante "frío"/"caliente" sobre el mapa (B.4 heredado de Spec 42 r2). SSOT en `70-Producto/design-system/mapa/glyphs/temperatura.svg`; copia sincronizada al frontend (`platform/frontend/public/mapa/glyphs/temperatura.svg`) en la sesión VS Code donde se implementa la spec | Único candidato de los cinco evaluados (T.1 termómetro + marcas, T.2 sol + rayos, T.3 mercurio prominente, T.4 ondas, T.5 llama anidada + chispas) que mantuvo el patrón estructural del ancla del sistema — contorno cerrado principal + secundarios al costado, paralelo formal a `precipitacion.svg` (nube + 3 gotas) — y al mismo tiempo encajó literalmente con el ADN editorial de la spec ("salario real **como termómetro** del poder adquisitivo"). Forma vertical complementaria a la forma horizontal de precipitación: en el LayerController, donde las dos capas aparecen como toggles de 24px una arriba de la otra, esa diferencia de eje resuelve la lectura instantánea. Lee bien a 24px. Reserva los vocabularios de **ondas/sinusoides** para Spec 44 (viento) y de **chispas** sin compromisos visibles. T.2 (sol + rayos) queda archivado, no descartado para siempre: si en alguna iteración futura del sitio se diseña una página de portada de la capa (Spec 39B), el motivo solar puede reaparecer como ilustración no-glyph sin reabrir esta decisión |

---

## Decisiones abiertas — condicionales para r2/r3

No quedan decisiones bloqueantes para la implementación (más allá del pre-requisito operativo de hidratar c7). Lo que sigue son re-evaluaciones que se hacen con evidencia operativa:

1. **Recalibración de buckets.** Una vez hidratado c7 y vista la distribución empírica de la variación interanual del salario real en los 10 países (serie OIT 2021+), revisar si los rangos `≤0.5%`, `≤1.5%`, `≤3%`, `≤6%`, `>6%` capturan bien la distribución. Si el bucket 2 (`moderado`) absorbe >60% de los datapoints, reescalar. Decisión esperada en r2.
2. **Texto editorial de los 3 países piloto.** Las cápsulas de `EDITORIAL` quedan con placeholder `<TEXTO CURADO — ...>` en r1. La redacción final se hace cuando c7 esté hidratado y se vean los rangos reales (no tiene sentido escribir "Argentina cae 8%" sin confirmar si efectivamente cayó 8%). Tarea editorial separada, sin spec.
3. **Reading guide editorial r3: completar los 7 países restantes** (BO, CO, EC, PE, PY, UY, VE) después de validar el patrón visual con AR/BR/CL en producción.
4. **Exposición mensual nativa al slider.** Hoy se agrega a trimestral. Si en producción aparece evidencia de que vale exponer mensual (lectura granular es valiosa para algunos pa\íses), agregar como cadencia adicional. Implica cambios en el slider de Spec 39.
5. **Discoverability de la dirección** (heredado de Spec 42). Si aparece evidencia de confusión mejora/caída por color compartido, revaluar B.4 — pero el caveat para Spec 44 (viento) es prioritario en esa revisión.
6. **Caveat heredable para Spec 44 (viento)** — el caveat documentado en Spec 42 r2 sobre que la dirección pro-mercado ↔ pro-estado es la lectura principal de viento sigue vigente y debe revaluarse en su propia spec.
7. **Caveat heredable para Spec 45 (presión)** — Latinobarómetro entrega series anuales con muchos gaps; el patrón Spec 42/43 puede necesitar ajustes en la construcción de períodos.
8. **`d3-gini` y `a1-pbi-pc-ppp` para Venezuela** — si en alguna iteración futura llegan datos para VE (BM, BCV, fuentes alternativas), poblar sin cambios de código (el contrato lo soporta).

---

## No incluido en esta spec

- Reading guide curado para Bolivia, Colombia, Ecuador, Paraguay, Perú, Uruguay, Venezuela → r3.
- Hidratación de `c7-salario-real-mensual` desde OIT ILOSTAT → pendiente operativo de Spec 40.
- Página dedicada de documentación profunda → Spec 39B (post-implementación de las 4 capas).
- Multi-capa simultánea → Spec 47.
- Cadencia mensual nativa expuesta al slider → decisión condicional r3.
- Subnacional (Brasil, Argentina) → spec posterior, granularidad país por decisión 10 del epic.
- ~~Diseño final del glyph `temperatura.svg` → Anexo A.~~ **Cerrado en r2** (2026-05-21). SVG entregado al vault.

---

## Implementación sugerida

Orden recomendado en sesión de VS Code (asumiendo el pre-requisito operativo cumplido):

1. **Pre-requisito (laptop con red):** correr `python platform/data/indicators-macro/build_indicators_macro.py` para hidratar `c7-salario-real-mensual.series_mensual` contra OIT ILOSTAT. Verificar que el JSON tiene `n_countries_covered >= 6` en c7 después de la corrida. Si no, debugear la integración OIT antes de avanzar (no es trabajo de Spec 43 — es de Spec 40).
2. **Extender `layers.css`** con tokens `--mi-temperatura-0..4` + `--mi-temperatura-nodata` + `--mi-temperatura-stale`. Si Spec 42 todavía no creó el archivo, crearlo con tokens de ambas capas. Smoke test: verificar que los 5 colores son distinguibles entre sí y de los de precipitación.
3. **Reescribir `lib/layers/temperatura.ts`** con `aggregateMensualToTrimestral`, `variacionInteranual`, `magnitudBucket`, `direction`, `formatTemperatura`, `worstQuality`, `buildPeriods`, `getValueForCountry`, `getLastPeriodBefore`. Pasar typecheck.
4. **Tests unitarios** de las 7 funciones helper + de `getValueForCountry` con fixtures sintéticos (no datos reales — el pipeline puede no estar 100% hidratado al momento del test).
5. **Verificar que el registry `LAYERS.temperatura`** ya apunta al módulo real (sí — el import en `lib/layers.ts` ya está). Smoke test del registry.
6. **Sincronizar glyph SVG temperatura** desde el SSOT del vault (`70-Producto/design-system/mapa/glyphs/temperatura.svg`, cerrado en r2 como termómetro + bulbo + 3 marcas) al frontend (`platform/frontend/public/mapa/glyphs/temperatura.svg`), reemplazando el placeholder lucide actual.
7. **Extender `LayerLegend.tsx`** (si Spec 42 todavía no lo hizo) para mostrar bloque "Dirección" con 3 filas (mejora / caída / estancado). Heredado de Spec 42 con un ajuste: el bloque de temperatura tiene 3 filas (no 2 como precipitación) porque "estancado" es etiqueta visible, no solo neutro.
8. **Verificar `LayerReadingDrawer.tsx`** soporta la estructura A.4 con `invertGood` por subindicador (Spec 42 ya lo deja implementado). Verificar que la sparkline cambia color cuando `invertGood: true` y la tendencia va al alza (rojo terracota = mal) vs al baja (tinta = bien).
9. **Verificar `MapaTorresGarcia.tsx`** consume `temperaturaLayer.getValueForCountry(slug, period)` y aplica `bucket.color` al fill. Sin mecanismo visual de dirección en el mapa (B.4). Tooltip mínimo on-hover con el contenido del A.4.
10. **Escribir `70-Producto/lecturas-capas/temperatura.md`** con contenido para ARG, BRA, CHI (los textos editoriales finales se redactan cuando c7 esté hidratado para tener cifras reales — el archivo se crea con la estructura + intro general + placeholders para los 3 piloto + sección "Otros países pendiente").
11. **Smoke test integrado**: activar capa Temperatura desde `/mapa`, navegar 5 períodos con el slider, abrir drawer en los 3 países piloto + 1 no-piloto + Venezuela (para verificar fallback de subindicadores), verificar que todos AC1-AC18 se cumplen excepto AC12 (depende del texto editorial final). AC15 cerrado en r2 — verificación visual en este paso.

Tiempo estimado:
- Pasos 2-11 (asumiendo pre-requisito cumplido y Anexo A cerrado en r2): **1-2 días** en VS Code (más rápido que Spec 42 porque hereda mucho).

---

## Anexo A · Brief para sesión de Product Design

> **Cerrado en r2 (2026-05-21)** en sesión de Product Design (Mapa Inestable Design System · spec43/index.html). Decisión #17 resuelta como **T.1 — termómetro + 3 marcas de escala** sobre 4 candidatos alternativos (T.2 sol + rayos, T.3 mercurio prominente, T.4 ondas/sinusoides, T.5 llama anidada + chispas). Detalle en §Decisiones tomadas · "Cerradas en r2". El brief de abajo se conserva como registro del input que abrió la sesión. El comparador exploratorio que armó Cowork previo a la sesión vive en `outputs/spec43-glyph-temperatura-comparador.html`.

Este anexo es **autocontenido**. Se puede extraer y llevar a una sesión separada de Product Design sin necesidad de leer el resto de Spec 43.

### A.1 Contexto del producto

**Mapa Inestable** es una plataforma de análisis político-cultural de Sudamérica. Su pieza central es un **mapa Torres García invertido** (sur arriba, referencia a "América Invertida" de 1943) con hot-zones por país que abren análisis editoriales. Sitio actual: https://mapa-inestable-v1.vercel.app/mapa.

El epic en curso (EPIC 03) agrega cuatro **capas analíticas** estilo Windy sobre el mapa: viento, temperatura, presión, precipitación. La capa precipitación (Spec 42) ya está diseñada y lista para handoff. Spec 43 implementa la **segunda capa real — temperatura = salario real**.

### A.2 Dirección estética anclas

- **Nombre del estilo:** Grabado.
- **Tipografía display:** Alfa Slab One.
- **Color dominante:** terracota (`#b85a32` aproximado).
- **Color neutro:** papel crema (`#f4ead8`), tinta oscura (`#1f1813`).
- **Sin border-radius.** Todo cuadrado.
- **Sombras duras**, no difusas.
- Las fronteras del mapa están difuminadas con Gaussian blur (Spec 39, decisión deliberada — el dibujo Torres García no es cartográfico, no debe parecerlo).
- **Glyphs SVG custom**, no emojis. Cada capa tiene su propio glyph dibujado a mano alzada en el espíritu del proyecto.
- Sistema de glyphs cerrado en Spec 42 r2 (C.4): "elemento principal + elementos secundarios" en trazo manuscrito Grabado, `viewBox="0 0 48 48"`, `stroke="currentColor"`, `stroke-width` 1.5-2.5.

Referencias en el vault:
- `70-Producto/design-system/design-system.md` — tokens completos.
- `70-Producto/design-system/cover-style-guide.md` — guía de portadas (estilo aplicable).
- `70-Producto/design-system/mapa/glyphs/README.md` — patrón del sistema de glyphs + inventario.
- `70-Producto/design-system/mapa/glyphs/precipitacion.svg` — ancla visual del sistema (nube + 3 gotas).

### A.3 Lo que Spec 43 deja cerrado (no reabrir)

- **Indicador principal** = salario real mensual (índice base 2021=100, OIT ILOSTAT), escala secuencial intensidad (un solo tono, 5 buckets de magnitud de la variación interanual).
- **4 subindicadores** = desempleo, informalidad, Gini, PBI per cápita PPP. `invertGood` para los 3 primeros.
- **Paleta de magnitud**: 5 pasos de terracota con sesgo cálido (`--mi-temperatura-0..4`, hex en §3.3 de Spec 43).
- **3 países piloto** = Argentina, Brasil, Chile.
- **Etiqueta del bucket 0** = "Estancado" (divergencia local consciente vs "sin cambio" de Spec 42 — no se reabre).
- **A.4 y B.4** = heredados de Spec 42 r2 sin modificación.

### A.4 Decisión única · Diseño del glyph `temperatura.svg`

**El problema.** Cada capa tiene un glyph SVG custom usado en (a) el LayerController para el toggle, (b) opcionalmente el header del drawer. El glyph debe ser:

- Reconocible como "temperatura" sin texto.
- Coherente con el espíritu Grabado del proyecto (trazo manuscrito, no vectores limpios de ícono comercial).
- Consistente con el sistema "elemento principal + elementos secundarios" cerrado en Spec 42 r2.
- Funcional a 24px (controller) y a 36-48px (drawer header opcional).
- Distinguible de los glyphs de las otras 3 capas (precipitación ya cerrado como nube + gotas; viento y presión pendientes pero ya con un norte estético claro).

**Restricciones.**

- `viewBox="0 0 48 48"`, `stroke="currentColor"`, `fill="none"`, `stroke-width` entre 1.5 y 2.5.
- Patrón "elemento principal + secundarios" (decisión heredada de C.4 Spec 42). Para temperatura, candidatos naturales:
  - **Termómetro + marcas de escala** (analogía directa con el concepto físico de "temperatura").
  - **Sol + rayos** (más metafórico — calor del sol).
  - **Mercurio en columna + base ensanchada** (variante del termómetro, más abstracta).
- El glyph NO codifica dirección (B.4 heredado: no hay versión "frío" y versión "caliente" sobre el mapa). Una sola versión.
- Debe verse bien sobre fill terracota cálido (paleta de la capa).

**Outputs esperados de la sesión de Product Design.**

- 3-5 mockups (HTML, Figma, sketches escaneados — formato libre) con propuestas alternativas.
- Para cada mockup: cómo se ve a 24px y a 48px.
- Comparación visual con `precipitacion.svg` (ancla del sistema) para confirmar consistencia.
- Recomendación con razón breve.

**Outputs del cierre.**

- SVG final entregado a `70-Producto/design-system/mapa/glyphs/temperatura.svg`.
- Actualización del README del directorio marcando `temperatura.svg` como activo.
- Decisión registrada en Spec 43 §Decisiones tomadas como cerrada en r2.

### A.5 Modo de operación

- Esta sesión puede correr en cualquier herramienta (Cowork con un skill diferente, Figma, sesión de diseño visual standalone).
- El resultado se ingresa de vuelta a Spec 43 como decisión #17 cerrada → la spec bumpea a borrador-r2.
- Una vez cerrada r2 + hidratado el pipeline c7, la spec va a VS Code para implementación final.

---

## Histórico

| Fecha | Cambio | Razón |
|---|---|---|
| 2026-05-21 | Creación de la spec en sesión de Cowork. r1 cierra 16 decisiones técnicas (8 heredadas intactas de Spec 42, 8 nuevas o ajustadas). Las 3 divergencias locales documentadas: (a) etiqueta del bucket 0 = "Estancado" en lugar de "sin cambio" — confirmado por Tomás como lectura latam donde el congelamiento es señal activa; (b) set de subindicadores con 3 de 4 `invertGood: true` — propio del dominio del bienestar laboral; (c) dependencia operativa explícita del pipeline c7-salario-real-mensual hidratado contra OIT — Spec 40 tiene el pendiente. Queda 1 decisión abierta (#17 glyph SVG) que se resuelve en sesión de Product Design — Anexo A la documenta autocontenidamente. Pre-requisito operativo registrado en frontmatter | Segunda capa real del EPIC 03. Hereda contrato y patrones de Spec 42 r2 con divergencias mínimas y bien razonadas. El brief para Product Design es chico (solo el glyph) porque A.4/B.4 ya están cerrados y heredados; eso acelera el cierre r2 |
| 2026-05-21 (r2) | Cierra decisión #17 (glyph SVG `temperatura.svg`) en sesión de Product Design (Mapa Inestable Design System · spec43/index.html). Elegida **T.1** (termómetro + 3 marcas de escala) sobre 4 candidatos alternativos (T.2 sol + rayos; T.3 mercurio prominente; T.4 ondas/sinusoides; T.5 llama anidada + chispas), por consistencia con el patrón del ancla `precipitacion.svg` y por encaje literal con la metáfora editorial. El glyph entrega cuerpo (tubo + bulbo) en un único `<path>` cerrado con curvas Bezier + 3 marcas horizontales asimétricas (longitudes 4/3/4, micro-textura manuscrita). SVG entregado al vault como SSOT en `70-Producto/design-system/mapa/glyphs/temperatura.svg`; sincronización al frontend pendiente para la sesión VS Code. README de glyphs actualizado. AC15 reescrito y cerrado del lado del SSOT. EPIC 03 con entrada de histórico r8. T.4 (ondas/sinusoides) queda explícitamente reservado para Spec 44 (viento) como caveat heredable | El brief del Anexo A era chico (un solo glyph) y se cerró en una sesión. T.1 fue el único candidato que mantuvo el patrón del sistema sin romper alguna pieza estructural: T.2 (sol + rayos) descentra "principal anclado a un lado + secundarios al otro"; T.3 (mercurio prominente) absorbe los secundarios en el principal; T.5 (llama anidada + chispas) duplica el contorno cerrado y rompe la economía formal; T.4 (ondas) queda guardado para viento. La spec queda lista para implementación una vez hidratado el pipeline c7-salario-real-mensual (pre-requisito operativo de Spec 40). El comparador visual previo de Cowork (con 5 candidatos paralelos) queda en `outputs/spec43-glyph-temperatura-comparador.html` como artefacto de exploración — la decisión oficial se cerró en la sesión separada de Product Design |

---

## Glosario

- **Capa principal:** la dimensión que manda el color del país en el mapa. Para temperatura, la variación interanual del salario real.
- **Subindicador:** dimensión secundaria asociada a una capa, que enriquece la lectura sin reemplazar el color principal. Para temperatura, los 4 son desempleo, informalidad, Gini, PBI per cápita PPP.
- **Bucket de magnitud:** uno de los 5 niveles de la escala (0-4). Se aplica al valor absoluto de la variación interanual del índice.
- **Variación interanual (Δ% YoY):** trimestre actual vs mismo trimestre del año anterior. Quita ruido estacional.
- **Dirección:** mejora (Δ% > 0.5%), caída (Δ% < −0.5%), estancado (|Δ%| ≤ 0.5%). Mecanismo visual heredado de B.4: solo en leyenda y tooltip, no en el mapa.
- **`invertGood`:** flag del contrato `LayerSubIndicator` que invierte el código de color de la sparkline del drawer cuando "más alto = peor" (desempleo, informalidad, Gini).
- **Estancado:** bucket 0 con etiqueta editorial cargada. No es "sin cambio" neutro: en Latam el congelamiento de salarios reales es señal activa de tensión (reading guide explicita el matiz).
- **Cobertura piloto:** los 3 países (ARG, BRA, CHI) con drawer curado en r1. El resto entra en r3.
- **Cobertura técnica:** los 10 países (todos los datos disponibles del pipeline). Aplica desde r1 una vez hidratado c7. Venezuela queda sin dato para `d3-gini` y `a1-pbi-pc-ppp` (subindicadores).
- **Reading guide:** el `.md` del vault que el drawer renderiza como full markdown.
- **Anexo A:** el brief autocontenido para Product Design. Cierra decisión #17 (glyph SVG `temperatura.svg`).
- **Pre-requisito operativo:** el ítem en frontmatter que el equipo de implementación debe cumplir antes de la corrida en VS Code. Para Spec 43: hidratar c7 contra OIT.
