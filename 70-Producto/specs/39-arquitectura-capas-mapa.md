---
spec: 39
titulo: Arquitectura de capas analíticas en el mapa y elaboración de /mapa como explorador
estado: borrador-r2
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-18
revision: 2026-05-18 (r2) — cerradas las 8 decisiones tácticas abiertas en r1; agregado JSON de polígonos como single source of truth en el vault; agregado Gaussian blur al render de capa para respetar la dirección estética Grabado; agregada referencia a Spec 39B (página dedicada de documentación)
epic: 03
afecta:
  - platform/frontend/src/app/mapa/page.tsx
  - platform/frontend/src/app/mapa/MapaExplorer.tsx (rediseño completo del layout)
  - platform/frontend/src/components/MapaTorresGarcia.tsx (extender: rendering de capa activa con Gaussian blur; leer polígonos del JSON del vault en vez de hardcoded)
  - platform/frontend/src/components/MapaHeatmapSection.tsx (mínimo: agregar CTA "Explorar capas analíticas →")
  - platform/frontend/src/components/LayerController.tsx (NUEVO)
  - platform/frontend/src/components/LayerLegend.tsx (NUEVO)
  - platform/frontend/src/components/LayerTimeSlider.tsx (NUEVO)
  - platform/frontend/src/components/LayerReadingDrawer.tsx (NUEVO)
  - platform/frontend/src/lib/layers.ts (NUEVO — registry + contrato común de capas)
  - platform/frontend/src/lib/layers/precipitacion.ts (placeholder NUEVO — Spec 42 lo implementa)
  - platform/frontend/src/lib/layers/temperatura.ts (placeholder NUEVO — Spec 43 lo implementa)
  - platform/frontend/src/lib/layers/viento.ts (placeholder NUEVO — Spec 44 lo implementa)
  - platform/frontend/src/lib/layers/presion.ts (placeholder NUEVO — Spec 45 lo implementa)
  - 70-Producto/lecturas-capas/ (NUEVO directorio en el vault, una .md por capa)
  - 70-Producto/design-system/mapa/paises-poligonos.json (SSOT de hot-zones por país, ya creado en r2)
depende_de: [22, 33]
depende_blanda_de: [37]
relaciona_con:
  - EPIC-03 (esta spec implementa las decisiones 2, 3, 4, 7, 8, 9, 10 del epic)
  - Spec 22 (mapa Torres García — intocable, esta spec se monta encima)
  - Spec 33 (panel lateral del mapa en home — sigue funcionando igual)
  - Spec 14A (24 indicadores macro — fuente potencial de las capas)
  - Spec 12A (Latinobarómetro — fuente potencial de capa presión)
  - Spec 39B (página dedicada de documentación por capa — spec hija para la "documentación profunda del análisis" que no entra en el reading drawer corto)
desbloquea:
  - Specs 42-45 (cada capa individual) — todas pueden empezar en paralelo una vez que esta spec defina el contrato
  - Spec 46 (sistema de leyenda y onboarding) — se monta sobre el LayerLegend que define esta spec
  - Spec 47 (tooltip e interacción multi-capa) — se monta sobre el contrato de hover/click que define esta spec
  - Spec 39B (página dedicada de documentación) — depende del contrato de Spec 39 + de Spec 42 implementada
prioridad: alta
---

# 39 · Arquitectura de capas analíticas en el mapa y elaboración de `/mapa` como explorador

## Resumen ejecutivo

EPIC 03 introduce cuatro capas analíticas (viento, temperatura, presión, precipitación) sobre el mapa Torres García. Esta spec es la **spec madre del epic**: define el contrato común que cualquier capa debe implementar, el controlador de UI (toggle, time slider, leyenda, reading drawer) y el layout completo del `/mapa` elaborado. Las capas individuales viven en Specs 42-45 y todas dependen de esta.

**Reframe respecto a la lectura inicial del epic.** En la primera escritura del epic (r1) se asumía que las capas vivían "sobre el mapa" como una pieza única, ambigua entre home y `/mapa`. En la conversación del 2026-05-18 con screenshots del sitio en mano (`/` vs `/mapa`) Tomás decidió:

> **El home se mantiene como está: mapa navegacional, panel lateral con agenda + esta semana, columna de últimos análisis. Las capas analíticas viven exclusivamente en `/mapa`, que pasa de ser un placeholder a ser el corazón analítico del producto. El home gana un CTA discreto "Explorar capas analíticas →" que invita a entrar.**

Este reframe resuelve una tensión real del epic — los controles tipo Windy (time slider, toggle de 4 capas, leyenda) no caben en la jerarquía actual del home sin romperla, y caben perfectos en una superficie dedicada. También clarifica el alcance de la decisión 3 del epic ("doble lectura editorial/risk management"): ambas lecturas viven dentro de `/mapa`, sin necesidad de dos rutas.

**Principio editorial agregado en r2: transparencia metodológica.** El proyecto se posiciona contra la desorientación epistemológica como eje analítico. Eso impone una obligación interna: las capas analíticas no pueden ser una caja negra. Esta spec cierra dos piezas que se complementan — el **reading drawer corto** (qué representa la capa, cómo se lee, 2-5 párrafos sin salir del mapa) y la referencia a **Spec 39B**, una página dedicada por capa que documenta el método con profundidad: fuente primaria, pipeline, buckets y umbrales, casos límite, descarga del JSON crudo. La frase de Tomás que abre Spec 39B es "no esconder los trucos del mago"; el principio es trazabilidad de método, análoga a la trazabilidad de citas del proyecto.

**Lo que entra en r2:**

- Contrato `Layer` que cualquier capa debe implementar (tipos TypeScript, estructura de datos, métodos esperados).
- Registry `LAYERS` en `lib/layers.ts` que las cuatro capas pueblan.
- Modelo de tiempo por capa (cada capa con su cadencia, leyenda con fecha explícita).
- Componente `<LayerController>` (rail izquierdo de `/mapa`): toggle de capas + time slider + filtros existentes país/eje. **Glyphs SVG custom** por capa (no emojis — preserva la dirección estética Grabado).
- Componente `<LayerLegend>` (**esquina superior derecha del mapa**, colapsable): escala de colores + fecha del dato mostrado + nombre de la capa + fuente abreviada + link al reading drawer.
- Componente `<LayerTimeSlider>` (debajo del mapa, full-width): control temporal unificado 2021-hoy.
- Componente `<LayerReadingDrawer>` (drawer derecho on-demand): lectura editorial corta de la capa activa, renderizada como **full markdown** (tablas, listas, links, imágenes) desde un `.md` del vault.
- Layout completo del `/mapa` elaborado (desktop / tablet / mobile).
- Extensión a `<MapaTorresGarcia>` para renderizar el fill de hot-zones según `layer.getValueForCountry(slug, period)`, **con filtro Gaussian blur SVG sobre cada polígono cuando hay capa activa** para difuminar las fronteras y respetar el carácter simbólico del dibujo (las fronteras de país no son cartográficas; el dibujo Torres García no tiene divisiones nacionales).
- **Polígonos de hot-zones leídos desde `70-Producto/design-system/mapa/paises-poligonos.json`** (single source of truth del vault, ya creado en r2). El componente deja de hardcodear los polígonos. Iteraciones futuras con `herramienta-hotzones.html` → exportar JSON → reemplazar archivo → sin cambio de código.
- CTA "Explorar capas analíticas →" en el home (mínima intervención sobre `<MapaHeatmapSection>`).
- Vault: nuevo directorio `70-Producto/lecturas-capas/` con un `.md` por capa (placeholder en r1, contenido editorial llega con cada Spec 42-45).

**Lo que NO entra en r2 (queda en specs hijas):**

- Implementación interna de cada capa (qué fuente exacta, qué cálculo, qué buckets) → Specs 42-45.
- Pipeline de ingestión de datos macroeconómicos y políticos → Specs 40, 41.
- Multi-capa simultánea (dos capas activas a la vez, modo bivariate o split) → Spec 47. **V1 de esta spec: una sola capa activa por vez.**
- Tooltip de hover por país con valor de la capa → contrato definido acá, render fino en Spec 47.
- Onboarding visual / tour de la metáfora climática → Spec 46.
- Modo risk management con export/alertas/snapshot → Spec 48 (condicional).
- Granularidad subnacional (Brasil, Argentina) → spec posterior si hay caso (decisión 10 del epic).
- Cambios al mapa del home más allá del CTA → fuera de scope.
- Cambios al panel lateral del home (Spec 33) → fuera de scope, el panel sigue funcionando igual.
- **Página dedicada de documentación profunda por capa** (`/mapa/capas/[id]`) → Spec 39B. Placeholder creado, se diseña post-Spec 42 con material editorial real.

---

## Estado actual

### `/mapa` hoy

Inspeccionado en `platform/frontend/src/app/mapa/MapaExplorer.tsx` (297 líneas) y verificado con screenshot del sitio en producción (`mapa-inestable-v1.vercel.app/mapa`):

- Rail izquierdo de 240px con dos bloques de filtros (botones de país AR..VE y botones de eje).
- Botón "Limpiar filtros ✕" cuando hay filtros activos.
- Mapa Torres García al centro con `variant="explorer"` (mismo componente que el home).
- Bajo el mapa, sección "Resultados" que dice literalmente **"Los resultados del corpus filtrado aparecerán aquí cuando el backend esté conectado"**.

Es decir: el `/mapa` está implementado a nivel de scaffolding (filtros funcionan, URL state funciona, mapa responde a filtros) pero el espacio principal de la página está vacío. Es la superficie con más espacio para crecer del sitio y la candidata natural para alojar el explorador analítico que el epic propone.

### El mapa del home hoy

`MapaHeatmapSection` (en `src/components/MapaHeatmapSection.tsx`) ocupa el viewport entero del home (`height: var(--mi-mapa-max-h, calc(100vh - 100px))`). El layout es:

- A la izquierda, el `<MapaTorresGarcia variant="home">` con aspect ratio fijo `1280/1380`.
- A la derecha, `<AnalisisColumn>` con los últimos análisis del diario.
- Tooltip flotante on-hover sobre el país.
- `<CountryModalPanel>` con la sección Agenda (Spec 33) cuando se clickea un país.

El home está denso y bien aprovechado. Meterle un controlador de capas + time slider + leyenda lo rompería. **No se toca el home**, salvo agregarle un CTA discreto a `/mapa`.

### Lo que ya existe del lado de datos

- `lib/macro-indicators.ts` carga `data/indicators-macro/indicators-macro.json` con 26 indicadores (15 con datos, 11 stubs). Incluye `a2-crecimiento-pbi` (PBI), `a6-inflacion-ipc` (inflación), entre otros. Spec 42 (capa precipitación) probablemente reuse este pipeline.
- `lib/latinobarometro.ts` carga `data/latinobarometro-2024/indicators.json`. Spec 45 (capa presión) probablemente reuse este pipeline.
- No existe nada de capa viento (Spec 44) ni de capa temperatura como "salario real" específicamente (Spec 43); ambos pipelines se construyen en Specs 41 y 43 respectivamente.

Esto confirma que precipitación y presión son las dos capas "casi gratis" del lado de datos — refuerza la decisión de arrancar por precipitación en Spec 42.

---

## Propuesta

### 1. El reframe en una imagen

```
ANTES (lectura ambigua del epic r1)
┌────────────────────────────┐  ┌────────────────────────────┐
│  HOME                       │  │  /MAPA                     │
│  Mapa Torres García         │  │  Mapa Torres García        │
│  + 4 capas toggleables ¿?   │  │  + filtros país/eje        │
│  + time slider ¿?           │  │  + 4 capas toggleables ¿?  │
│  + leyenda ¿?               │  │  + ...                     │
└────────────────────────────┘  └────────────────────────────┘
                          ↑
            Confuso: dos superficies con el mismo rol


DESPUÉS (reframe de esta spec)
┌────────────────────────────┐  ┌────────────────────────────┐
│  HOME — navegacional        │  │  /MAPA — analítico          │
│  Mapa Torres García         │  │  Mapa Torres García         │
│  + hot-zones                │  │  + 4 capas toggleables      │
│  + panel lateral agenda     │  │  + time slider 2021-hoy     │
│  + columna análisis         │  │  + leyenda flotante         │
│  + CTA "Explorar capas →"   │  │  + reading drawer           │
└────────────────────────────┘  └────────────────────────────┘
                          ↑
        Cada superficie tiene un rol claro y no compite
```

### 2. Contrato común de capa — `interface Layer`

Cualquier capa que se sume al sistema debe implementar este contrato. Las cuatro capas del epic (precipitación, temperatura, viento, presión) son cuatro implementaciones distintas del mismo contrato.

```ts
// platform/frontend/src/lib/layers.ts

export type LayerId = "precipitacion" | "temperatura" | "viento" | "presion";

export type LayerCategory =
  | "macro"          // capas que vienen de datos macro (precipitación, temperatura)
  | "institucional"  // capas que vienen de encuestas (presión)
  | "editorial";     // capas con codificación editorial híbrida (viento)

export type LayerCadence =
  | "semanal"
  | "mensual"
  | "trimestral"
  | "anual";

export type LayerScaleType =
  | "continuous"    // ej. crecimiento del PBI: gradient de un color al opuesto
  | "diverging"     // ej. viento pro-mercado/pro-estado: escala bipolar con centro neutro
  | "categorical";  // ej. fases de un ciclo: colores discretos sin orden numérico

export interface LayerPeriod {
  /** Identificador estable, ej. "2024-Q4", "2024-12", "2024", "2024-W18" */
  key: string;
  /** Fecha ISO del último día del período. Permite ordenar y comparar con el slider. */
  date: string;
  /** Label humano, ej. "Q4 2024", "diciembre 2024", "2024", "sem 18 · 2024" */
  label: string;
}

export interface LayerBucket {
  /** Índice en la escala. Para diverging: negativos a izquierda, positivos a derecha, 0 = centro neutro. */
  bucketIndex: number;
  /** Label humano: "alto", "+3pp", "muy pro-estado". */
  label: string;
  /** Color CSS válido. Puede ser var() del DS o hex explícito. */
  color: string;
  /** Rango cubierto (opcional, para tooltip de leyenda): "PBI > 4%" */
  rangeDescription?: string;
}

export interface LayerLegend {
  type: LayerScaleType;
  buckets: LayerBucket[];
  /** Color para "sin dato" para este país en este período. Default: gris neutro. */
  noDataColor?: string;
  /** Color para "dato congelado / estimado / no oficial". Default: misma escala con patrón rayado opcional. */
  qualityFlagColor?: string;
}

export interface LayerSource {
  /** Nombre humano: "World Bank", "Latinobarómetro", "Coding editorial Mapa Inestable". */
  name: string;
  /** URL canónica de la fuente, para citas. */
  url: string;
  /** ISO YYYY-MM-DD — última actualización conocida del dataset upstream. */
  publishedDate: string;
  /** ISO YYYY-MM-DD — último día que el pipeline corrió contra la fuente. */
  lastFetched: string;
}

export type LayerQuality = "oficial" | "estimado" | "congelado";

export interface LayerValue {
  /** Valor numérico crudo. */
  raw: number;
  /** Valor formateado para tooltip: "3.2%", "USD 12.500", "+2.3 pp", "pro-mercado". */
  formatted: string;
  /** Bucket de la escala — drive del color en el mapa. */
  bucketIndex: number;
  /** Delta respecto al período anterior (opcional). Útil para flecha de tendencia en tooltip. */
  delta?: number;
  /** Bandera de calidad del dato. */
  quality: LayerQuality;
}

export interface Layer {
  id: LayerId;
  /** Label largo: "Precipitación · crecimiento económico". */
  label: string;
  /** Label corto para el toggle: "Precipitación". */
  shortLabel: string;
  /**
   * Glyph SVG custom para el toggle. Decisión r2: NO emojis — rompen la dirección
   * estética Grabado. Cada capa expone una ruta a un SVG en `/public/mapa/glyphs/<id>.svg`
   * diseñado coherente con el resto del proyecto (terracota, trazo manuscrito).
   * Los 4 glyphs se diseñan dentro de cada Spec 42-45 o como bloque del design system.
   */
  glyphSrc: string;         // "/mapa/glyphs/precipitacion.svg"
  category: LayerCategory;
  /** Una o dos frases que el reading drawer abre con. */
  description: string;
  /** Unidad humana: "% del PBI", "USD constantes", "índice 0-100". */
  unit: string;
  cadence: LayerCadence;
  legend: LayerLegend;
  source: LayerSource;
  /** Períodos disponibles, ordenados ascendente. El último es el más reciente. */
  periods: LayerPeriod[];
  /** Período preseleccionado al activar la capa por primera vez. Default: último período. */
  defaultPeriod: LayerPeriod;
  /**
   * Devuelve el valor para un país en un período específico, o null si no hay dato.
   * El controlador llama a esta función al renderizar, no se calculan todos los valores upfront.
   */
  getValueForCountry(countrySlug: string, period: LayerPeriod): LayerValue | null;
  /**
   * Devuelve el último período <= una fecha dada. Esto resuelve la decisión 8 del epic:
   * "cada capa muestra siempre con su última lectura disponible al momento que apunta el slider".
   */
  getLastPeriodBefore(date: string): LayerPeriod | null;
  /** Slug del .md en `70-Producto/lecturas-capas/` con la lectura editorial larga. */
  readingGuideSlug: string;
}

/** Registry de capas — cualquier consumidor importa esta constante. */
export const LAYERS: Record<LayerId, Layer>;
```

Notas sobre el contrato:

- **Cada capa decide cuándo, cómo y desde dónde se cargan sus datos.** El contrato no impone formato de almacenamiento. Una capa puede cargar desde un `.json` en `src/data/`, otra puede leer del vault con `fs.readFileSync`, otra puede mezclar. La única obligación es exponer los métodos.
- **`getValueForCountry` se llama en render**, no en build. Para 10 países × 4 capas × N períodos visibles, el cálculo es trivial; no hay riesgo de performance.
- **`getLastPeriodBefore` cierra el modelo de tiempo por capa.** Si el slider está en sem 20 · 2026 y la capa presión sólo tiene `2023` (anual), la capa devuelve `2023` y la leyenda lo dice explícito.
- **`quality: "congelado"`** se usa cuando el dato es el último disponible pero la fuente lleva varios períodos sin actualizar — útil para que el render visual indique honestamente que ese país está "stale" sin esconderlo.
- **El reading guide vive en el vault, no en el código.** Patrón análogo a las agendas (Spec 27) y los borradores diarios (Spec 23): el contenido editorial se edita en markdown, el código sólo lo renderiza.

### 3. Registry de capas + placeholders

```ts
// platform/frontend/src/lib/layers.ts

import { precipitacionLayer } from "./layers/precipitacion";
import { temperaturaLayer }   from "./layers/temperatura";
import { vientoLayer }         from "./layers/viento";
import { presionLayer }        from "./layers/presion";

export const LAYERS: Record<LayerId, Layer> = {
  precipitacion: precipitacionLayer,
  temperatura:   temperaturaLayer,
  viento:        vientoLayer,
  presion:       presionLayer,
};

export function getLayer(id: LayerId): Layer {
  return LAYERS[id];
}

/** Helper para el time slider: devuelve el rango global cubierto por todas las capas. */
export function getGlobalDateRange(): { start: string; end: string } {
  // Mínimo: 2021-01-01 (decisión 9 del epic: profundidad 5 años)
  // Máximo: la fecha más reciente entre los `defaultPeriod.date` de las cuatro capas
  ...
}
```

Los archivos `layers/precipitacion.ts`, `layers/temperatura.ts`, `layers/viento.ts`, `layers/presion.ts` se crean en esta spec como **stubs que cumplen el contrato pero devuelven null/datos sintéticos**. Cada Spec 42-45 los reemplaza con la implementación real cuando le toque. Esto desbloquea Spec 39 para mergearse antes de que las cuatro capas estén implementadas — el `/mapa` ya muestra el controlador, sólo que los toggles dicen "Próximamente" hasta que cada capa real entre.

**Polígonos de hot-zones desde el vault (r2).** El componente `MapaTorresGarcia.tsx` hoy hardcodea los 10 polígonos de país como una constante `HOTZONES`. A partir de esta spec, los polígonos viven en `70-Producto/design-system/mapa/paises-poligonos.json` como single source of truth del vault — formato `{ "ar": [[x,y],[x,y],...], "br": [[...]] }`. El componente lo importa al cargar (o vía sync script tipo el de portadas de Spec 37). Esto convierte la iteración de las hot-zones en un flujo editorial puro: Tomás abre `herramienta-hotzones.html`, ajusta polígonos, exporta JSON, reemplaza el archivo del vault, el sitio levanta los nuevos polígonos sin cambio de código.

### 4. Componente `<LayerController>`

Vive en el rail izquierdo de `/mapa`. Tres bloques apilados verticalmente:

```
┌─ rail izquierdo 280px ──────────┐
│                                  │
│  CAPAS                           │  ← header mono uppercase
│  ┌──────────────────────────┐   │
│  │ ◉ [glyph] Precipitación   │   │  ← capa activa (radio button-like)
│  │   crecimiento económico   │   │     SVG custom + shortLabel + categoría
│  ├──────────────────────────┤   │
│  │ ○ [glyph] Temperatura     │   │
│  │   salario real            │   │
│  ├──────────────────────────┤   │
│  │ ○ [glyph] Viento          │   │
│  │   pro-mercado / pro-estado│   │
│  ├──────────────────────────┤   │
│  │ ○ [glyph] Presión         │   │
│  │   instituciones           │   │
│  ├──────────────────────────┤   │
│  │ ○ (ninguna) — navegación  │   │  ← modo "sin capa", igual que home
│  └──────────────────────────┘   │
│                                  │
│  FILTRAR POR                     │
│  País:  [AR] [BO] [BR] ...       │  ← filtros existentes (sin cambios)
│  Eje:   Deculturación  ✓         │
│         Erosión de mediac. ☐     │
│         ...                      │
│                                  │
│  [Limpiar filtros ✕]             │
│                                  │
└──────────────────────────────────┘
```

**Comportamiento:**

- **Single-select de capa en v1.** Click sobre una capa la activa y desactiva las demás. Esto cumple la decisión 9 del epic ("UI toggleable") en la lectura mínima — multi-active queda para Spec 47.
- "Sin capa" siempre presente como opción explícita. Es la lectura "puramente cartográfica" del mapa, equivalente al home.
- Los filtros país/eje **se mantienen funcionando** sobre el corpus editorial (resultados al pie del mapa). No interactúan con la capa activa en v1 — son ortogonales.
- La capa activa se persiste en URL como `?capa=precipitacion`. Default sin query: "Sin capa".
- Si la capa activa cambia, el time slider re-ancla al `defaultPeriod` de la nueva capa.

### 5. Componente `<LayerTimeSlider>`

Vive debajo del mapa, full-width del área del mapa (no del rail). Sólo visible cuando hay una capa activa.

```
┌── área del mapa ──────────────────────────────────────────────┐
│                                                                │
│                       (mapa Torres García)                     │
│                                                                │
└────────────────────────────────────────────────────────────────┘
┌── time slider ────────────────────────────────────────────────┐
│ 2021                                              ▼  hoy       │
│ ├──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──    │
│                                                          ●     │  ← thumb del slider
│                                                                │
│ Mostrando: Q4 2024 · último dato ≤ semana 20 · 2026            │  ← contexto explícito
└────────────────────────────────────────────────────────────────┘
```

**Comportamiento:**

- Rango global: 2021-01-01 a hoy (decisión 9 del epic).
- Marcas cada 6 meses, label cada año.
- El thumb se mueve por arrastre o por teclado (← →, Home, End, Page Up/Down).
- Al cambiar la fecha del slider, se llama `layer.getLastPeriodBefore(slider.date)` y se actualiza el render del mapa + la leyenda.
- La línea "Mostrando: ..." dice **dos cosas**: el período del dato real (`Q4 2024`) y la fecha que apunta el slider (`semana 20 · 2026`). Si la capa está "stale" (último dato hace >2 cadencias), agregar visual "⚠ dato congelado".
- Persistencia en URL: `?capa=precipitacion&t=2026-W20`. Compartible.

### 6. Componente `<LayerLegend>`

Vive flotante en la **esquina superior derecha** del área del mapa (decisión cerrada en r2; en r1 estaba propuesta inferior derecha). Sólo visible cuando hay una capa activa.

Razón de la posición superior derecha: en el mapa Torres García el sur está arriba; las cruces de Bogotá, Quito, Caracas y la silueta del norte caen en la parte inferior del dibujo, donde la leyenda hubiese competido visualmente. El cuadrante superior derecho tiene menos densidad gráfica (sol, estrellas, espacio en blanco) y absorbe mejor un panel flotante.

```
┌─ leyenda ───────────────────────────────┐
│                                          │
│  [glyph] Precipitación · % del PBI       │  ← glyph SVG custom + capa + unidad
│  Q4 2024 · semana 20 · 2026              │  ← período del dato + fecha del slider
│                                          │
│  ▓▓▓ < -1%   recesión                    │
│  ░░░ -1 a 1% estancamiento               │
│  ▒▒▒ 1 a 3%  crecimiento moderado        │
│  ▓▓▓ > 3%    expansión                   │
│                                          │
│  Fuente: World Bank · pulled 2026-05-10  │  ← cita compacta
│  [ⓘ Leer guía de lectura]                │  ← abre <LayerReadingDrawer>
│  [↗ Documentación completa]              │  ← link a Spec 39B (`/mapa/capas/precipitacion`)
│                                          │
└──────────────────────────────────────────┘
```

**Comportamiento:**

- Colapsable a un chip mínimo (`[glyph] Precipitación`) con un toggle ▼/▲.
- Click en `[ⓘ Leer guía]` abre el `<LayerReadingDrawer>` (sección 7).
- Click en `[↗ Documentación completa]` navega a `/mapa/capas/<layerId>` (Spec 39B). Mientras Spec 39B no esté implementada, el link puede esconderse o llevar a una página 404 estilizada que diga "documentación profunda — próximamente". Decisión de UX para implementación.
- En mobile: la leyenda no flota — pasa a ser una franja debajo del time slider, full-width.

### 7. Componente `<LayerReadingDrawer>`

Drawer derecho que abre cuando el lector clickea `[ⓘ Leer guía de lectura]` en la leyenda. Carga el contenido del `.md` correspondiente del vault: `70-Producto/lecturas-capas/<readingGuideSlug>.md`.

Estructura del `.md`:

```markdown
---
layer: precipitacion
titulo: "Precipitación · cómo se lee la capa de crecimiento económico"
---

# Por qué precipitación

[1-2 párrafos: por qué la metáfora climática, qué representa esta capa
 dentro del marco del proyecto, cómo se conecta con los 6 ejes]

# Qué muestra exactamente

[Definición operativa del indicador, qué fuente, qué frecuencia, qué
 períodos están disponibles, qué pasa con países que no actualizan]

# Cómo leer los colores

[Mapping bucket → significado político-económico. Ej. "expansión" no es
 "bueno", "recesión" no es "malo" — son estados estructurales]

# Limitaciones y honestidad

[Qué NO captura esta capa. Por ej., el PBI esconde distribución; por eso
 hay una capa Temperatura aparte. Sirve para que el lector calibre.]

# Para profundizar

- Link al análisis editorial más reciente que toca la capa
- Link a la fuente primaria
- Link al README del pipeline si aplica
```

El contenido lo escribe Tomás (o Eche) por capa, no se infiere. Esta spec deja el directorio creado + un placeholder por capa con el frontmatter y los headers; el contenido real entra con cada Spec 42-45.

### 8. Extensión a `<MapaTorresGarcia>`

El componente actual ya recibe `filters: { pais, eje }`. Se agrega un prop opcional:

```ts
export interface MapaTorresGarciaProps {
  variant: "home" | "explorer";
  filters?: { pais?: string[]; eje?: string[]; };
  countryAnalysisCounts?: Record<string, number>;
  // NUEVO:
  activeLayer?: {
    layer: Layer;
    period: LayerPeriod;
  };
  onCountryClick?: (slug: string) => void;
  onCountryHover?: (slug: string | null) => void;
}
```

Cuando `activeLayer` está definido, el render de cada hot-zone cambia:

1. Se llama `activeLayer.layer.getValueForCountry(slug, activeLayer.period)`.
2. Si devuelve `null`: fill = `layer.legend.noDataColor` (gris neutro), opacity 0.3.
3. Si devuelve un `LayerValue`: fill = `layer.legend.buckets[v.bucketIndex].color`, opacity 0.55.
4. **Filtro Gaussian blur SVG aplicado sobre el polígono** — decisión cerrada en r2. Cada polígono lleno se renderiza con `filter="url(#capa-blur)"`, donde el filtro `<feGaussianBlur stdDeviation="15">` (valor inicial, tunear visualmente) difumina los bordes. Las fronteras nacionales no son cartográficas y el dibujo de Torres García no tiene divisiones por país; el difuminado preserva el carácter simbólico del mapa.
5. El estado `hover` se mantiene como overlay aditivo (borde dorado), no reemplaza el fill de la capa.
6. El estado `active` (país filtrado) se mantiene como borde más grueso.

**Detalle del filtro SVG.** Definir una vez al inicio del overlay:

```xml
<defs>
  <filter id="capa-blur" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="15" />
  </filter>
</defs>
```

Notas:
- El `stdDeviation` se tunea durante implementación. 15-25 es el rango razonable según pruebas iniciales; valores bajos dejan ver más el borde del polígono, valores altos borran la asociación con el país.
- Cuidado con países chicos (Uruguay, Ecuador): el blur fuerte puede evaporarlos. Posibles mitigaciones: `stdDeviation` por país, o piso de opacidad sobre el centro del polígono. Decisión táctica para implementación.
- El filtro se aplica **solo** al fill de capa, no a las cruces de capitales ni a las hot-zones cuando están en estado hover/active sin capa.

**Cuando NO hay `activeLayer`** (modo "Sin capa"): el componente se comporta exactamente como hoy. Sin filtro Gaussian blur, sin fill de capa. Esto preserva el home sin cambios.

Las cruces de capitales se mantienen siempre visibles encima de cualquier capa — son referencia geográfica, no parte de la capa.

### 9. Layout completo de `/mapa` elaborado

**Justificación.** Tomás dejó el call abierto sobre el layout pero fijó la restricción: "el diseño tiene que ser funcional a optimizar la lectura del mapa interactivo (opciones, leyendas, etc.)". La propuesta de esta spec es **tres zonas**: rail izquierdo con controles, mapa central con time slider abajo y leyenda flotante, drawer derecho para lectura editorial larga on-demand. Esta distribución es la que mejor mantiene el mapa como protagonista visual y deja los controles operativos accesibles sin esconderlos.

**Desktop ≥ 1240px:**

```
┌────────────────────────────────────────────────────────────────┐
│  HEADER (existente)                                             │
├────────────────────────────────────────────────────────────────┤
│  METABAR (existente: "← Inicio · Mapa · click → filtrar...")    │
├──────────┬─────────────────────────────────────────────────────┤
│          │                                                      │
│  RAIL    │   ┌──────────────────────────────────────────────┐  │
│  IZQ     │   │                              ┌─ leyenda ──┐  │  │
│  280px   │   │                              │ [gly]Prec. │  │  │
│          │   │                              │ Q4 2024    │  │  │
│  CAPAS   │   │         MAPA TORRES GARCÍA   │ ▓░▒▓       │  │  │
│  - prec  │   │         (área central,       │ [ⓘ guía]  │  │  │
│  - temp  │   │          aspect ratio fijo)  │ [↗ docs]   │  │  │
│  - vien  │   │                              └────────────┘  │  │
│  - pres  │   │                                               │  │
│  - none  │   │              (fill de capa con                │  │
│          │   │               Gaussian blur SVG               │  │
│  FILTROS │   │               sobre cada polígono)            │  │
│  País    │   │                                               │  │
│  Eje     │   └──────────────────────────────────────────────┘  │
│  Limpiar │   ┌── time slider ────────────────────────────────┐  │
│          │   │ 2021 ────────────────────────●──────── hoy    │  │
│          │   │ Mostrando: Q4 2024 · dato ≤ sem 20 · 2026     │  │
│          │   └──────────────────────────────────────────────┘  │
│          │                                                      │
│          │   ┌── resultados ─────────────────────────────────┐  │
│          │   │ Corpus filtrado: 12 análisis                   │  │
│          │   │ [card] [card] [card] ...                       │  │
│          │   └──────────────────────────────────────────────┘  │
└──────────┴─────────────────────────────────────────────────────┘
                                                  ┌─ drawer der. ─┐
                                                  │ (on-demand,   │
                                                  │ 380px, slide  │
                                                  │ desde la der.)│
                                                  │               │
                                                  │ Reading guide │
                                                  │ markdown      │
                                                  │ renderizado   │
                                                  │               │
                                                  │ [Cerrar ×]    │
                                                  └───────────────┘
```

**Tablet 768-1239px:**

- Rail izquierdo colapsa a icon-only (60px) con tooltips. Click expande temporalmente como overlay.
- El mapa toma todo el ancho restante.
- Time slider y leyenda igual que desktop.
- Drawer derecho mantiene 380px, slide normal.

**Mobile ≤ 767px:**

- Rail izquierdo desaparece. Se reemplaza por un **bottom sheet** invocado por un botón flotante "▼ Capas y filtros".
- El bottom sheet contiene CAPAS arriba, FILTROS abajo, scrolleable.
- Time slider full-width debajo del mapa.
- Leyenda: deja de flotar, se convierte en franja entre el mapa y el time slider.
- Reading drawer: ocupa el viewport entero como modal.
- Resultados al pie como hoy, scroll vertical.

### 10. CTA "Explorar capas analíticas →" en el home

Único cambio al home en esta spec. Se agrega un CTA discreto **debajo** del bloque `<MapaHeatmapSection>`, dentro del padding existente del home. No interfiere con el mapa ni con la columna de análisis.

```tsx
// en src/app/page.tsx, después del MapaHeatmapSection y antes del bloque "Esta semana"

<div style={{
  padding: "var(--mi-space-3) var(--mi-space-5)",
  borderBottom: "var(--mi-border-bold)",
  background: "var(--mi-bg-paper)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "var(--mi-space-3)",
}}>
  <span style={{
    fontFamily: "var(--mi-font-mono)",
    fontSize: "var(--mi-text-xs)",
    color: "var(--mi-ink-mute)",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  }}>
    Cuatro capas sobre el mapa: viento, temperatura, presión, precipitación
  </span>
  <Link href="/mapa" className="mi-btn mi-btn--ghost">
    Explorar capas analíticas →
  </Link>
</div>
```

Decisión consciente: **no se agrega CTA dentro del SVG del mapa** (cero modificaciones al SVG, igual que Spec 33). El CTA vive en el flujo vertical del home, como una franja narrativa más.

### 11. URL state en `/mapa`

| Param | Valores | Comportamiento |
|---|---|---|
| `pais` | slug, repetible | Existente. Filtra el corpus de la sección resultados |
| `eje` | slug, repetible | Existente. Filtra el corpus de la sección resultados |
| `periodo` | "todos" \| year | Existente. Filtra el corpus por año |
| `capa` | `precipitacion` \| `temperatura` \| `viento` \| `presion` | **NUEVO**. Capa activa. Default sin query: sin capa |
| `t` | ISO date `YYYY-MM-DD` o ISO week `YYYY-Www` | **NUEVO**. Fecha del slider. Default: `defaultPeriod` de la capa activa |
| `guia` | `1` cuando el reading drawer está abierto | **NUEVO**. Permite compartir un link con el drawer abierto |

Ejemplo compartible: `/mapa?capa=precipitacion&t=2024-Q4&pais=br&guia=1` → entra con la capa precipitación activa, slider en Q4 2024, Brasil resaltado, reading drawer abierto.

### 12. Hover y click sobre país con capa activa

Spec 47 cubre el detalle del tooltip multi-capa. Esta spec define el contrato mínimo:

- **Hover** (sin capa activa): comportamiento actual — borde dorado + nombre del país + nº de análisis.
- **Hover** (con capa activa): además del comportamiento actual, agregar al tooltip una línea con `layer.label`, `value.formatted`, flecha de tendencia si `value.delta`, y bandera de calidad si `value.quality !== "oficial"`. Ejemplo:
  ```
  Brasil · 14 análisis
  💧 Precipitación: 3.2% (↑ +0.7 pp)
  ```
- **Click** (sin capa activa): toggle filtro de país (comportamiento actual de `/mapa`).
- **Click** (con capa activa): mismo comportamiento — toggle filtro de país. La capa no cambia el modelo de interacción.
- **Doble click**: navegar a `/pais/[slug]` (atajo existente).

---

## Archivos a tocar

| Archivo | Acción |
|---|---|
| `platform/frontend/src/lib/layers.ts` | NUEVO — tipos `Layer`, `LayerPeriod`, `LayerValue`, etc. + registry `LAYERS` |
| `platform/frontend/src/lib/layers/precipitacion.ts` | NUEVO — stub que cumple el contrato, datos sintéticos en r1. Spec 42 lo reemplaza |
| `platform/frontend/src/lib/layers/temperatura.ts` | NUEVO — stub. Spec 43 lo reemplaza |
| `platform/frontend/src/lib/layers/viento.ts` | NUEVO — stub. Spec 44 lo reemplaza |
| `platform/frontend/src/lib/layers/presion.ts` | NUEVO — stub. Spec 45 lo reemplaza |
| `platform/frontend/src/components/MapaTorresGarcia.tsx` | EXTENDER — (a) leer polígonos desde `paises-poligonos.json` del vault en vez de la constante hardcoded; (b) agregar prop `activeLayer`; (c) lógica de fill condicional con filtro Gaussian blur cuando hay capa activa; (d) preservar comportamiento sin cambio cuando no hay capa |
| `70-Producto/design-system/mapa/paises-poligonos.json` | YA CREADO en r2 — es el SSOT de hot-zones del vault. El componente lo importa (o lee vía sync-script). Iteraciones futuras editan este archivo, no el .tsx |
| `platform/frontend/src/components/LayerController.tsx` | NUEVO — rail izquierdo de `/mapa` con toggle de capas + filtros existentes |
| `platform/frontend/src/components/LayerLegend.tsx` | NUEVO — leyenda flotante, colapsable |
| `platform/frontend/src/components/LayerTimeSlider.tsx` | NUEVO — time slider full-width debajo del mapa |
| `platform/frontend/src/components/LayerReadingDrawer.tsx` | NUEVO — drawer derecho que renderiza el `.md` de la guía de lectura |
| `platform/frontend/src/app/mapa/MapaExplorer.tsx` | REDISEÑO — nuevo layout 3 zonas, integra LayerController/Legend/TimeSlider/ReadingDrawer |
| `platform/frontend/src/app/mapa/page.tsx` | Sin cambios funcionales — sigue importando MapaExplorer |
| `platform/frontend/src/app/page.tsx` | AGREGAR — franja con CTA "Explorar capas analíticas →" debajo del MapaHeatmapSection |
| `platform/frontend/src/components/MapaHeatmapSection.tsx` | Sin cambios |
| `70-Producto/lecturas-capas/` | NUEVO directorio. Con un `.md` placeholder por capa (frontmatter + headers, sin contenido) |
| `70-Producto/lecturas-capas/precipitacion.md` | NUEVO placeholder |
| `70-Producto/lecturas-capas/temperatura.md` | NUEVO placeholder |
| `70-Producto/lecturas-capas/viento.md` | NUEVO placeholder |
| `70-Producto/lecturas-capas/presion.md` | NUEVO placeholder |

---

## Criterios de aceptación

| # | Criterio | Verificación |
|---|---|---|
| AC1 | El home no cambia visualmente, salvo la aparición de una franja con CTA "Explorar capas analíticas →" debajo del mapa | Diff visual home antes/después: sólo la franja nueva |
| AC2 | El CTA del home navega a `/mapa` sin query | Click → URL = `/mapa` |
| AC3 | `/mapa` muestra el nuevo layout 3 zonas (rail izq · mapa · time slider abajo) | Inspect: la página tiene rail 280px + área de mapa + time slider full-width |
| AC4 | El rail izquierdo muestra las 4 capas + opción "Sin capa", una activa a la vez | Click en una capa: las demás se deseleccionan |
| AC5 | Activar una capa cambia el fill de los hot-zones según el bucket de la capa | Pick precipitación (con stub): cada país se colorea según su bucket sintético |
| AC6 | El time slider sólo aparece con una capa activa | Sin capa: slider oculto. Con capa: slider visible |
| AC7 | Mover el slider re-renderiza el mapa con el dato del último período ≤ a la fecha del slider | Mover slider de 2025 a 2022: cada país cambia color al período anterior |
| AC8 | La leyenda muestra (a) nombre de capa, (b) unidad, (c) período del dato real, (d) escala de buckets con color y label, (e) fuente, (f) link a la guía | Inspect: leyenda contiene los 6 elementos |
| AC9 | Click en `[ⓘ Leer guía]` abre el reading drawer con el contenido del `.md` correspondiente | Click: drawer abre desde la derecha, contenido del .md renderizado |
| AC10 | URL state de capa + período es compartible | Copiar `/mapa?capa=precipitacion&t=2024-Q4`, abrir en otra ventana: estado restaurado |
| AC11 | Sin capa activa, `/mapa` se comporta como antes de esta spec (filtros país/eje + mapa de navegación) | Smoke test: deseleccionar capa, todo sigue funcionando |
| AC12 | Mobile (≤767px): rail izquierdo se reemplaza por bottom sheet | Inspect mobile: botón flotante "▼ Capas y filtros" presente |
| AC13 | El panel lateral del home (Spec 33) sigue funcionando igual | Click en país en home: agenda y "esta semana" aparecen como antes |
| AC14 | Type-check pasa. `next build` completa sin errores | `pnpm typecheck && pnpm build` |
| AC15 | Las cuatro capas stub no rompen el mapa: una capa sin datos reales muestra todos los países con `noDataColor` | Activar precipitación stub: render no crashea, países en gris neutro |
| AC16 | Cuando una capa está activa, el fill de cada país se renderiza con Gaussian blur, sin línea de borde visible entre países | Inspect: el SVG tiene `<filter id="capa-blur">` aplicado; visualmente, las fronteras se difuminan |
| AC17 | Los polígonos de hot-zones vienen del JSON del vault, no de una constante hardcoded en el .tsx | Grep en `MapaTorresGarcia.tsx`: no debe quedar la constante `HOTZONES` literal con coordenadas; debe haber import del JSON |
| AC18 | La leyenda flota en la esquina superior derecha del mapa | Inspect: `<LayerLegend>` posicionado top-right del contenedor del mapa |
| AC19 | Los toggles del LayerController usan glyph SVG custom (no emoji) | Inspect: `<img>` o `<svg>` con `src` o contenido apuntando a `/mapa/glyphs/<id>.svg` |
| AC20 | La leyenda incluye un link "[↗ Documentación completa]" que apunta a `/mapa/capas/<id>` (página de Spec 39B) | Click: navega a `/mapa/capas/precipitacion`. En r2 mientras Spec 39B no esté implementada, puede ser 404 estilizado |

---

## Edge cases

- **Capa activa pero país sin dato en el período actual** → fill = `layer.legend.noDataColor` (gris neutro), opacity reducida. Tooltip lo dice: "sin dato para [País] en [período]".
- **Slider en una fecha anterior al primer período disponible de la capa** → `getLastPeriodBefore` devuelve null. Render: todos los países en `noDataColor`. Leyenda muestra "Sin datos disponibles antes de [primer período]".
- **Capa "stale"** (último período > 2 cadencias atrás): leyenda muestra `⚠ dato congelado`, drawer de lectura puede aclarar por qué. El render sigue mostrando el último valor disponible — la decisión 8 del epic prioriza honestidad temporal sobre "blanco".
- **Reading drawer abierto, usuario cambia de capa** → el drawer se actualiza al `.md` de la nueva capa. Mantiene el drawer abierto.
- **`/mapa` cargado con `?capa=` inválido** (ej. typo `?capa=precipitaccion`): fallback a "Sin capa", log warning. Query param se limpia silenciosamente.
- **Cuatro stubs simultáneos en r1** → el toggle muestra las cuatro como "Próximamente · [shortLabel]". La opción "Sin capa" es la única "viva" hasta que las capas reales (Specs 42-45) entren.
- **El home se renderiza server-side; el time slider y la capa activa son client-side.** Asegurar que `<LayerController>`, `<LayerTimeSlider>` etc. tengan `"use client"`. El registry `LAYERS` debe ser importable desde ambos lados (sin top-level `fs.readFileSync` en el módulo).
- **`prefers-reduced-motion`**: animaciones del slider, drawer y toggle se reducen a transiciones instantáneas.

---

## Decisiones tomadas

### Cerradas en r1 (sesión 2026-05-18, primera pasada)

| # | Tema | Decisión | Razón |
|---|---|---|---|
| 1 | Dónde viven las capas | Exclusivamente en `/mapa` | Reframe de Tomás 2026-05-18: el home está denso, `/mapa` está vacío y es la superficie con espacio para crecer. Doble lectura editorial/risk encaja mejor en una superficie dedicada |
| 2 | Cómo conoce el home las capas | Sólo vía CTA "Explorar capas analíticas →" | El home se mantiene como mapa navegacional puro. Cero cambios al `MapaHeatmapSection` |
| 3 | Layout de `/mapa` elaborado | 3 zonas: rail izquierdo controles · mapa central · drawer derecho on-demand | Optimiza la lectura del mapa: el mapa es protagonista, controles accesibles sin esconderlos, lectura larga sólo cuando se pide |
| 4 | Capas activas simultáneas en v1 | Una sola (single-select) | Multi-capa es engañosamente compleja (mezcla de colores, overlap visual). Spec 47 la cubre cuando haya ≥2 capas reales para evaluar |
| 5 | Modelo de tiempo | Por capa, con fecha explícita en leyenda (decisión 8 del epic) | Honestidad: cada capa tiene su cadencia y eso se muestra. Slider unificado, datos por capa |
| 6 | Profundidad histórica | 2021 a hoy (decisión 9 del epic) | Cubre la cobertura del proyecto, no infla el slider |
| 7 | Granularidad geográfica | Nivel país (decisión 10 del epic) | Subnacional cuadruplica el costo. Queda como spec posterior |
| 8 | Contrato técnico | `interface Layer` con métodos `getValueForCountry` y `getLastPeriodBefore` | El registry no impone formato de datos — cada capa decide su almacenamiento |
| 9 | Reading guide | `.md` en `70-Producto/lecturas-capas/` (vault, no código) | Mismo patrón que agendas (Spec 27) y diario (Spec 23) — contenido editorial editable sin redeploy |
| 10 | Stubs en r1 | Las 4 capas se crean como stubs que cumplen el contrato, devuelven datos sintéticos / null | Permite mergear Spec 39 antes de que Specs 42-45 estén implementadas. El controlador, slider, leyenda y layout son testables en r1 |
| 11 | Orden de implementación de capas reales | Precipitación primero (Spec 42), después el resto | Decisión confirmada del epic; valida arquitectura punta a punta con la capa más simple |

### Cerradas en r2 (sesión 2026-05-18, segunda pasada — cierre de las 8 tácticas de r1 + 3 nuevas)

| # | Tema | Decisión | Razón |
|---|---|---|---|
| 12 | Glyph de cada capa | **Glyphs SVG custom**, no emojis. Cada capa expone `glyphSrc: "/mapa/glyphs/<id>.svg"`. Los SVGs se diseñan dentro de cada Spec 42-45 o como bloque del design system | Los emojis rompen la dirección estética Grabado. Tomás confirmó "no romper la dirección estética por favor" |
| 13 | Color para "sin dato" y bandera de calidad | Gris neutro para sin dato + stripes diagonales sobre el color del bucket para `quality !== "oficial"` (estimado / congelado) | Distinguible sin agregar colores nuevos al sistema. Honesto sobre el estado del dato |
| 14 | Librería de rendering | SVG en v1 (no Canvas / WebGL). Capas se renderizan como fill de hot-zones con filtro Gaussian blur. Si Spec 44 (viento) pide partículas, esa spec re-abre la decisión | Mantiene un único stack de render coherente con el SVG actual del mapa |
| 15 | Posición de la leyenda flotante | **Esquina superior derecha** del área del mapa | En el mapa Torres García el sur está arriba; el cuadrante superior derecho tiene menos densidad gráfica (sol, estrellas, blanco). Inferior derecha competiría con las cruces de Bogotá / Quito / Caracas |
| 16 | Default al entrar a `/mapa` | "Sin capa" en v1. Re-decidir cuando Spec 42 esté implementada y haya material para activar por default | Preserva el comportamiento actual de `/mapa` mientras las capas no son la oferta principal del sitio |
| 17 | Formato del reading drawer | **Full markdown** (tablas, listas, links, imágenes) renderizado desde el `.md` del vault | Permite riqueza editorial sin parsers custom. La implementación elige `remark + remark-html` o equivalente |
| 18 | Animación de transición entre períodos del slider | Transición de fill de 250ms al mover el slider | Coherente con cómo lo hace Windy. Si la capa tiene buckets divergentes muy contrastados y marea, se reduce o quita en r3 |
| 19 | Drawer corto vs página dedicada | **Ambas piezas, distintos tiempos**: el reading drawer corto (esta spec) + página dedicada de documentación profunda en **Spec 39B** (placeholder creado, se diseña post-Spec 42) | Tomás: "tiene que haber una versión sobre el mapa pero quisiera poder hacer una página extra después sobre la documentación del análisis, para no esconder los trucos del mago". Materializa el principio editorial de transparencia metodológica |
| 20 | Polígonos de hot-zones | Viven en `70-Producto/design-system/mapa/paises-poligonos.json` como single source of truth del vault. El componente `MapaTorresGarcia.tsx` deja de hardcodearlos y lee del JSON | Las hot-zones son fuente editorial de uso permanente (la mayoría de los datos se indexan por país). Hardcodearlas en .tsx convierte cada iteración con la herramienta-hotzones.html en un cambio de código innecesario |
| 21 | Render de fronteras con capa activa | **Gaussian blur SVG** sobre el fill de cada polígono cuando hay capa activa. `stdDeviation` inicial 15-25, a tunear visualmente. Sin filtro cuando no hay capa | El mapa Torres García es simbólico, no cartográfico. Las fronteras nacionales no existen en el dibujo. Fronteras duras al activar una capa romperían la dirección estética |
| 22 | Página dedicada de documentación | **Spec 39B** creada como placeholder. Se diseña post-Spec 42, con material editorial real sobre el que documentar | No tiene sentido especificar "documentación profunda de una capa" antes de tener una capa funcionando |

---

## Decisiones abiertas (tácticas, para implementación o para r3)

Las 8 decisiones tácticas que estaban abiertas en r1 quedaron cerradas en r2 (decisiones #12-#19 arriba). Lo que queda como decisión para la implementación en VS Code:

1. **`stdDeviation` exacto del Gaussian blur.** R2 fija el rango 15-25; el valor concreto se tunea visualmente con la capa stub funcionando. Probable que países chicos (UY, EC) pidan un valor más bajo o un piso de opacidad sobre el centroide para no evaporarse. Si la decisión es por país, agregar campo opcional `blurStdDeviation?: number` en cada polígono del JSON.

2. **`stdDeviation` por país vs global.** Si en la implementación se ve que un único valor no funciona para todos los países, decidir si el JSON de polígonos crece con un campo opcional por país.

3. **Mecanismo de import del JSON de polígonos.** Dos opciones técnicas: (a) `import polygons from "@/data/paises-poligonos.json"` con `tsconfig.paths` apuntando al vault — limpio pero acopla el build al filesystem; (b) sync script tipo `sync-covers.mjs` de Spec 37 que copia el JSON a `public/mapa/` y se carga en runtime. Decisión del implementador en VS Code.

4. **Renderer de markdown del reading drawer.** Si no hay un renderer de markdown reutilizable en el frontend, decidir entre `remark + remark-html`, `react-markdown`, o un parser custom mínimo. La decisión cierra dentro de la sesión de implementación.

5. **404 estilizado vs link oculto cuando Spec 39B no está implementada.** El link `[↗ Documentación completa]` de la leyenda apunta a `/mapa/capas/<id>`. Mientras Spec 39B no exista, decidir si: (a) el link aparece pero lleva a un 404 estilizado tipo "documentación en construcción", o (b) el link directamente se esconde. Decisión de UX del implementador.

6. **Glyphs SVG concretos por capa.** El contrato fija que existan, pero el diseño visual de cada glyph se hace dentro de cada Spec 42-45 (o como bloque del design system aparte). En implementación r2, los 4 stubs pueden usar placeholders simples (un círculo o un símbolo neutral) hasta que las capas reales entren.

7. **Subcapas / sub-dimensiones por capa (planteada por Tomás 2026-05-18).** Cada una de las 4 capas tiene una dimensión principal que define el color del mapa (PBI para precipitación, salario real para temperatura, etc.) pero conceptualmente puede tener **subindicadores secundarios** que enriquecen la lectura (inflación + inversión + deuda para precipitación; ratio mediano/promedio + pobreza para temperatura; etc.). El patrón es real y aplica a las 4 capas. Decisión a cerrar dentro de cada Spec 42-45 si se materializa visualmente como: (a) chips de subindicadores en el tooltip de hover, (b) sección expandida en el reading drawer, (c) controles de "vista" dentro del LayerController (ej. "precipitación · vista crecimiento" / "precipitación · vista inflación"), o combinación. Si el patrón se confirma como general, conviene extender el contrato `Layer` de Spec 39 con un campo opcional `subIndicators?: SubIndicator[]` en r3. Por ahora queda abierto a nivel de cada capa.

---

## No incluido en esta spec

- **Implementación de cada capa real.** Specs 42 (precipitación), 43 (temperatura), 44 (viento), 45 (presión) cubren cada una su lógica interna.
- **Pipeline de ingestión.** Specs 40 (datos macro) y 41 (datos políticos para viento) cubren el lado backend.
- **Onboarding visual de la metáfora climática.** Spec 46.
- **Multi-capa simultánea, modos bivariate o split.** Spec 47.
- **Modo risk management (export, alertas, snapshot).** Spec 48 (condicional).
- **Granularidad subnacional para Brasil y Argentina.** Spec posterior si hay caso.
- **Cambios al mapa del home más allá del CTA.** Fuera de scope. Home queda como hoy + franja CTA.
- **Cambios al panel lateral del home (Spec 33).** Fuera de scope.
- **Cambios al SVG del mapa Torres García (Spec 22).** Fuera de scope. Cero edits al SVG.

---

## Implementación sugerida

Esta spec se diseña en Cowork (este documento es el handoff). La implementación la ejecuta una sesión de **Claude Code en VS Code** sobre `platform/frontend/`. Orden recomendado:

1. **Crear `lib/layers.ts`** con los tipos del contrato. Sin implementación de capas todavía.
2. **Crear los 4 stubs** en `lib/layers/`. Cada uno devuelve datos sintéticos para validar el render (ej. precipitación con valores random por país que cambian con el período del slider).
3. **Crear placeholders** en `70-Producto/lecturas-capas/` (4 archivos `.md` con frontmatter + headers vacíos).
4. **Refactor de polígonos a vault.** Mover la constante `HOTZONES` de `MapaTorresGarcia.tsx` al JSON ya creado en `70-Producto/design-system/mapa/paises-poligonos.json`. Resolver el mecanismo de import (decisión abierta #3). Verificar que el mapa sigue renderizando igual en `variant="home"`.
5. **Extender `MapaTorresGarcia.tsx`** con el prop `activeLayer` y la lógica de fill condicional. Agregar el filtro `<filter id="capa-blur">` con `<feGaussianBlur stdDeviation="15">` al inicio del overlay SVG. Aplicar `filter="url(#capa-blur)"` a los polígonos solo cuando hay capa activa. Verificar que `variant="home"` sigue funcionando igual (sin `activeLayer` pasado, sin filtro).
6. **Tunear el `stdDeviation` del blur visualmente** con la capa stub activa. Iterar hasta que las fronteras se difuminen sin que países chicos se evaporen.
7. **Crear `<LayerController>`** con el toggle de capas (glyphs SVG custom + shortLabel + categoría) + reuso de los filtros país/eje existentes de `MapaExplorer`.
8. **Crear `<LayerLegend>`** posicionada en superior derecha, con el render de buckets, fecha del dato real, fuente, link al reading drawer y link a `/mapa/capas/<id>` (Spec 39B).
9. **Crear `<LayerTimeSlider>`** con el rango global 2021-hoy.
10. **Crear `<LayerReadingDrawer>`** que renderiza el `.md`. Decidir renderer de markdown (decisión abierta #4).
11. **Rediseñar `MapaExplorer.tsx`** con el nuevo layout 3 zonas. Mantener el comportamiento existente de filtros + resultados al pie.
12. **Agregar la franja CTA** en `app/page.tsx`.
13. **Validar AC1-AC20** uno por uno.
12. **Type-check y `next build`.**
13. **Mobile responsive check** (DevTools, mínimo 360px).
14. **Smoke test cruzado:** abrir home → click CTA → en `/mapa` activar capa stub → mover slider → abrir reading drawer → cerrar → cambiar de capa → volver al home.

Tiempo estimado: **5-7 días** de trabajo de implementación bien hecho. Bloqueante crítico: ninguno — todos los inputs están definidos en esta spec.

---

## Histórico

| Fecha | Cambio | Razón |
|---|---|---|
| 2026-05-18 | Creación de la spec en sesión de Cowork. Reframe respecto al epic r1: las capas viven en `/mapa`, el home gana sólo un CTA | Conversación con Tomás 2026-05-18 con screenshots del sitio en mano. `/mapa` está prácticamente vacío y es la candidata natural a explorador analítico; el home está denso y no resiste meterle controles tipo Windy sin romperlo |
| 2026-05-18 (r2) | Cierre de las 8 decisiones tácticas que quedaban abiertas en r1. Agregado: (a) polígonos del vault como SSOT con JSON ya creado en `70-Producto/design-system/mapa/paises-poligonos.json`, (b) Gaussian blur SVG sobre el fill de capa para difuminar fronteras y respetar el carácter simbólico del dibujo Torres García, (c) referencia a Spec 39B para la página dedicada de documentación profunda por capa. Leyenda movida de inferior derecha a superior derecha. Se agregaron 6 criterios de aceptación nuevos (AC16-AC20) | Tomás cerró las 8 tácticas + actualizó los polígonos con `herramienta-hotzones.html` y pidió fronteras bien difuminadas + explicitó el principio de "no esconder los trucos del mago" como justificación de la página de documentación dedicada |

---

## Glosario

- **Capa (Layer):** una de las cuatro lecturas analíticas sobre el mapa (viento, temperatura, presión, precipitación). Cada una es una implementación concreta del contrato `interface Layer`.
- **Período (LayerPeriod):** unidad temporal de una capa, según su cadencia (semana, mes, trimestre, año). Cada capa expone sus períodos disponibles ordenados.
- **Bucket:** rango discreto dentro de la escala de una capa. Drive del color en el mapa.
- **Modelo de tiempo por capa:** cada capa muestra siempre con su última lectura disponible al momento que apunta el slider; la leyenda dice explícitamente la fecha del dato real y la fecha del slider.
- **Reading guide:** `.md` editorial por capa que vive en `70-Producto/lecturas-capas/`, accesible vía el `<LayerReadingDrawer>`.
- **Single-select de capa (v1):** una sola capa activa a la vez. Multi-capa queda para Spec 47.
- **Modo "Sin capa":** estado explícito del controlador donde no hay capa activa. `/mapa` se comporta como antes de esta spec.
- **Home preview:** el mapa del home, navegacional, sin capas. Esta spec lo deja intocado salvo por el CTA agregado.
