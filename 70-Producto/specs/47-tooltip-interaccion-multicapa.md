---
spec: 47
titulo: Tooltip enriquecido e interacción multi-capa — contexto cruzado sin abandonar single-select
fecha: 2026-05-21
autor: Tomás (con Claude · Cowork)
estado: borrador-r1
revision: 2026-05-21 (r1) — primera escritura. Foco: tooltip enriquecido con chips compactos de las otras 3 capas sobre país hover, manteniendo single-select como ancla (decisión 9 del epic intacta). Hereda contrato Layer (Spec 39), patrón A.4 tooltip+drawer (Spec 42), distinción magnitud/dirección B.4 (Spec 42/43), glyph orientado (Spec 44), y la infraestructura de onboarding/glosario (Spec 46). Comparación país×país queda fuera de scope r1 por decisión explícita de Tomás. 1 decisión visual abierta para sesión de Product Design separada (Anexo A)
epic: 03
afecta:
  - platform/frontend/src/components/MapaTorresGarcia.tsx (extender tooltip on-hover y on-tap para renderizar contexto multi-capa)
  - platform/frontend/src/components/LayerTooltip.tsx (NUEVO — extracción del tooltip a su propio componente, hoy inline en MapaTorresGarcia)
  - platform/frontend/src/components/LayerLegend.tsx (extender — micro-acción "pin lectura cruzada" que persiste el contexto del país pineado bajo la leyenda)
  - platform/frontend/src/components/LayerReadingDrawer.tsx (extender — bloque "Otras capas para este país" en el header del drawer)
  - platform/frontend/src/lib/layers.ts (extender contrato con helper `getCrossLayerSnapshot(slug, date)` que devuelve la última lectura de cada capa para un país en una fecha; sin breaking changes)
  - platform/frontend/src/lib/cross-layer.ts (NUEVO — implementación del helper + tipo `CrossLayerSnapshot`)
  - platform/frontend/src/lib/pinned-country-state.ts (NUEVO — persistencia local del país pineado para lectura cruzada persistente)
  - platform/frontend/src/styles/tooltip.css (NUEVO o ampliación — tokens y animaciones del tooltip enriquecido)
  - 70-Producto/lecturas-capas/_glossary-multicapa.md (NUEVO — extensión del glosario para términos nuevos: lectura cruzada, snapshot, país pineado)
  - 70-Producto/design-system/mapa/tooltip-mockups/ (NUEVO directorio para mockups del Anexo A — layout del tooltip enriquecido)
depende_de: [39, 42, 46]
depende_blanda_de: [43, 44, 45]
relaciona_con:
  - EPIC-03 (esta spec cierra la decisión 4 del epic — capa activa única — al confirmar que single-select es el ancla y resolver el "qué pasa con las otras 3 capas" vía tooltip enriquecido en lugar de multi-activación)
  - Spec 39 (contrato Layer y posición del tooltip de hover en el mapa)
  - Spec 39B (página dedicada por capa — el drawer enriquecido de esta spec apunta hacia esa página cuando el lector quiere profundizar en una de las 3 capas no-activas)
  - Spec 42 (patrón A.4 tooltip mínimo + drawer completo — esta spec lo extiende)
  - Spec 43 (cadencia trimestral con fallback runtime — esta spec respeta `getLastPeriodBefore` para cada capa al armar el snapshot cruzado)
  - Spec 44 (glyph orientado pro-mercado/pro-estado — la lectura cruzada debe mostrar el glyph cuando viento aparece como capa no-activa)
  - Spec 45 (presión, pendiente — la lectura cruzada incorporará presión cuando Spec 45 cierre)
  - Spec 46 (onboarding + glosario — esta spec puede agregar una pantalla al overlay y términos al glosario)
desbloquea:
  - Spec 48 (modo risk management — el snapshot cruzado es el primitivo conceptual del que un export multi-capa podría servirse)
  - Spec 39B — el bloque "Otras capas" del drawer hace de puente con la página dedicada profunda
prioridad: media
---

# 47 · Tooltip enriquecido e interacción multi-capa

## Resumen ejecutivo

Cuando se diseñó la arquitectura del EPIC 03 (Spec 39 r2), la decisión #4 fijó **single-select de capa en v1**: una sola capa activa a la vez, multi-capa simultánea (dos capas pintando colores distintos al mismo tiempo) postergada como decisión condicional a esta spec. Tres meses de diseño después, con Specs 42-44 cerradas en r2 y Spec 45 pendiente, la pregunta original — "¿conviene activar dos capas a la vez en v1?" — se puede responder con más evidencia: cada capa tiene su propia paleta terracota con sesgo distinto (Spec 42 base, Spec 43 cálido, Spec 44 ocre profundo, Spec 45 reservado), su propia escala de buckets (4 o 5), su propia cadencia (semanal, trimestral, trimestral con fallback, anual), su propio mecanismo visual de dirección (B.4 para precipitación/temperatura, glyph orientado V3 para viento). **Activar dos al mismo tiempo significaría diseñar cómo se mezclan cuatro sistemas que están deliberadamente cerrados como distintos** — es trabajo grande, abre decisiones nuevas, y el costo de no hacerlo en v1 es bajo si hay una alternativa que cubre la necesidad real.

La necesidad real es **comparativa**: el lector que pasa el cursor por Brasil con la capa Precipitación activa quiere saber, en el mismo gesto, **cuánto está pasando en las otras capas**. No necesita el mapa pintado de cuatro colores; necesita que ese país, en ese momento, le dé los cuatro valores de un golpe sin tener que cambiar manualmente de capa cuatro veces. Esa necesidad se cubre **sin** multi-activación: enriqueciendo el tooltip y el drawer con un **snapshot cruzado** del país hover bajo la fecha del slider.

Esta spec resuelve eso. Mantiene single-select como ancla — la decisión #4 del epic queda confirmada, no rota — y agrega tres piezas de contexto cruzado:

1. **Tooltip enriquecido sobre país hover** (~320px, modesta ampliación del A.4 actual): además del valor de la capa activa (heredado tal cual), chips compactos con la última lectura de las otras 3 capas para ese país en la fecha del slider. Cuando viento es una capa no-activa, su chip incluye el mini-glyph orientado V3 (Spec 44) además del valor.
2. **Bloque "Otras capas para este país" en el header del drawer**: cuando el lector clickea para abrir el reading drawer, el bloque que hoy muestra solo el valor de la capa activa se enriquece con un panel desplegable lateral que repite el snapshot cruzado. Cada chip del snapshot lleva un link `[Cambiar a esta capa →]` que activa la capa y deja el drawer del mismo país abierto.
3. **Micro-acción "pin lectura cruzada"** en la leyenda: pinear un país convierte el snapshot cruzado en persistente debajo de la leyenda, hasta que el lector lo despineé. Útil para "agarrar" Brasil mientras se navega el slider y ver cómo se mueven las 4 capas a través del tiempo en un país elegido. **No es comparación entre países** (decisión explícita de Tomás — fuera de scope r1).

**Principio editorial.** El tooltip enriquecido refuerza el principio "el clima como sistema sin valoración moral" — al ver las cuatro capas juntas para un país, queda visible que un país puede estar caliente (salario subiendo), seco (PBI estancado), con viento pro-mercado y presión baja. Ningún país tiene un único color; tiene un perfil climático compuesto que las cuatro capas captan parcialmente. Single-select para el mapa entero, multi-lectura para el país hover.

**Lo que entra en r1:**

- Tooltip enriquecido on-hover en `<MapaTorresGarcia>` con: (a) nombre del país y nº de análisis (existente), (b) bloque de la capa activa heredado de A.4 (sello + nombre capa + período + valor con signo y label), (c) bloque nuevo "Otras capas" con 3 chips compactos (uno por capa no-activa), cada uno con glyph + label corto + valor formateado + flecha de tendencia si `delta`. Para viento, el chip muestra el mini-glyph V3 orientado en lugar de la flecha de tendencia.
- Extracción del tooltip a su propio componente `<LayerTooltip>` (hoy es inline en `<MapaTorresGarcia>` post-Spec 42).
- Bloque "Otras capas para este país" en el header del `<LayerReadingDrawer>`: panel colapsable que repite el snapshot con links de "Cambiar a esta capa →".
- Micro-acción `[📌 Pinear lectura de este país]` en la leyenda al hacer hover/click sobre un país. Al pinear, debajo de la leyenda aparece un mini-panel persistente con el snapshot cruzado del país pineado, que se actualiza cada vez que el slider cambia. Se despinea con un botón `[× Despinear]`.
- Helper `getCrossLayerSnapshot(slug, date)` en `lib/cross-layer.ts` que toma un país y una fecha del slider, llama a cada `LAYERS[capa].getLastPeriodBefore(date)`, luego `LAYERS[capa].getValueForCountry(slug, period)`, y devuelve un objeto `CrossLayerSnapshot` con las 4 lecturas (cada una con period real, value, glyph, sí/no-data, quality).
- Extensión del contrato Layer (Spec 39) con un campo opcional nuevo `chipFormat?(value): { label: string; tone: "neutral" | "positive" | "negative" }` que cada capa puede usar para formatear su valor en el chip cruzado (e.g. precipitación: "+3.2% crec." con tone positive; viento: glyph V3 + "+2 pro-merc." con tone neutral; presión: "índice 38" con tone neutral). Si una capa no implementa este método, se usa el `formatted` por default.
- Mobile (no hay hover): el tap sobre un país abre **directo** el drawer con el bloque "Otras capas" expandido por default. El tooltip enriquecido no se renderiza en mobile — el A.4 ya había hecho esta decisión para el tooltip básico, esta spec la hereda.
- Accesibilidad: el tooltip tiene `role="tooltip"` y se anuncia con `aria-describedby` desde el polígono del país; los chips son focusables si el mapa está en modo teclado.

**Lo que NO entra en r1:**

- **Comparación país×país** (pinear Argentina y comparar con Brasil mostrando deltas). Decisión explícita de Tomás — fuera de scope. Mencionada como spec posterior o evolución r3.
- **Multi-capa simultánea** (dos capas pintando el mapa al mismo tiempo, con mezcla cromática o split-screen). Decisión explícita de Tomás — mantener single-select como ancla. Si en r2 aparece evidencia que justifique cambiar, va como spec aparte (Spec 47B o reapertura de #4 del epic).
- **Snapshot cruzado de >4 capas.** El sistema está cerrado a 4 capas por el epic; si en el futuro se suma una quinta (e.g. capa "atención" mencionada en preguntas abiertas del epic), va como decisión de epic, no acá.
- **Selección múltiple de países pineados** (pin > 1). Solo se pinea un país a la vez. Pinear otro despinea el anterior.
- **Export del snapshot cruzado** (CSV, imagen, copy al portapapeles). Esos elementos viven en Spec 48 (modo risk management).
- **Tooltip enriquecido en el home `/`.** El home es navegacional puro (Spec 39 §10), no tiene capa activa. El tooltip del home queda como Spec 33 lo dejó — agenda + nº análisis. Las capas son territorio exclusivo de `/mapa`.

---

## Estado actual

### Lo que ya existe

- **Tooltip básico on-hover en el mapa** (Spec 39 §12): nombre del país + nº de análisis (modo "sin capa") + valor de la capa activa con signo y label (modo con capa activa). Hoy es inline en `<MapaTorresGarcia>`, no es componente propio.
- **Patrón A.4 (Spec 42 r2)**: tooltip mínimo on-hover ~280px (sello + nombre + período + valor) sin subindicadores; drawer ~380px on-click con bloque "Lectura" + bloque "Subindicadores". Cerrado y heredable a Specs 43-45.
- **Distinción B.4 (Spec 42/43 r2)**: el color del mapa codifica solo magnitud; la dirección crecimiento/recesión aparece en leyenda y tooltip. Hoy el tooltip muestra `+3.2% crecimiento` o `-1.8% recesión` con tono distinto.
- **Glyph orientado V3 (Spec 44 r2)**: cuando viento es la capa activa, el polígono lleva un mini-glyph encima orientado izq/der según `rank` del coding. Glyph definido como SSOT en `viento.svg` + `viento-neutro.svg`.
- **Contrato `Layer`** (Spec 39) con `getValueForCountry(slug, period)`, `getLastPeriodBefore(date)`, `LayerValue { raw, formatted, bucketIndex, delta?, quality }`. Lo que necesita esta spec ya está en el contrato.
- **`MapaTorresGarcia.tsx`** ya consume el contrato `Layer`, aplica fill con Gaussian blur, renderiza el tooltip on-hover/on-click. La extensión de esta spec se monta sobre la arquitectura existente, no rompe nada.
- **Helper `getLastPeriodBefore`** en cada capa: ya resuelto por Spec 39 y verificado por implementaciones 42/43/44. Esta spec lo orquesta para las 4 capas en una sola llamada del cliente.
- **Infraestructura de onboarding y glosario** (Spec 46): permite agregar términos nuevos ("snapshot cruzado", "país pineado", "lectura cruzada") al glosario sin diseñar UI nueva.

### Lo que NO existe todavía

- Ningún cliente del frontend llama a las 4 capas a la vez. Hoy el `activeLayer` se pasa como prop al mapa y a la leyenda; las otras 3 capas ni siquiera se cargan en runtime.
- El tooltip vive inline en `<MapaTorresGarcia>` — más de 50 líneas dentro del componente del mapa. Esta spec lo extrae a `<LayerTooltip>` para que sea componible y mantenible.
- No hay micro-acciones en la leyenda (pin, share, etc.). El componente `<LayerLegend>` (Spec 39 §6 + Spec 46 §4) tiene espacio en el footer para una acción nueva.
- No hay persistencia de "país pineado". `localStorage` sí existe (Spec 46), pero no hay una clave dedicada para este caso.
- El header del `<LayerReadingDrawer>` muestra el valor de la capa activa pero no las otras tres. Es un buen lugar para repetir el snapshot cruzado.

### Lo que esta spec habilita

- Que un lector pueda leer el perfil climático completo de un país en un solo gesto, sin cambiar de capa 4 veces.
- Que la decisión #4 del epic (single-select v1) se cierre con evidencia, no por demora — esta spec confirma que single-select es el ancla y resuelve la pregunta abierta con un mecanismo distinto al considerado en r1 del epic.
- Que el `snapshot cruzado` sea un primitivo reutilizable: Spec 48 (risk management) puede usarlo para export multi-capa; Spec 39B puede usarlo para mostrar "qué pasaba en las otras capas mientras [esta capa] tenía este valor"; futuras agendas por país pueden referenciarlo.
- Que la transición single-select ↔ otra capa sea fluida: click en `[Cambiar a esta capa →]` desde el snapshot cruzado activa la capa nueva con el drawer del país pineado abierto. Cero pérdida de contexto.

---

## Propuesta

### 1. El tooltip enriquecido `<LayerTooltip>`

Componente nuevo, extraído de `<MapaTorresGarcia>`. Recibe como props el país hover, el `activeLayer` (puede ser `null` en modo sin capa), la fecha del slider, y los `LAYERS` completos. Internamente llama a `getCrossLayerSnapshot(slug, slider.date)` y renderiza tres zonas verticales:

```
┌─ tooltip ~320px ─────────────────────────────────────┐
│                                                       │
│  BR · Brasil                                          │  ← header país (heredado)
│  14 análisis · agenda activa                         │     existente del tooltip
│                                                       │     pre-Spec 47
│  ─────────────────────────────────────────           │
│                                                       │
│  [glyph nube] Precipitación · Q4 2024                │  ← bloque capa activa
│  +3.2% crecimiento  ↗ +0.7 pp                        │     heredado A.4 (Spec 42)
│                                                       │     identidad fuerte:
│                                                       │     glyph 24px + label
│                                                       │     completo + valor
│                                                       │     grande + delta
│                                                       │
│  ─────────────────────────────────────────           │
│                                                       │
│  OTRAS CAPAS                                          │  ← mono uppercase
│                                                       │
│  [gly term]  Temperatura · Q3 2024                   │
│              +1.4% salario real      ↗               │
│                                                       │
│  [gly V3→]   Viento · sem 19 · 2026                 │
│              +2 pro-mercado          ⚠ congelado     │
│                                                       │
│  [gly TBD]   Presión · 2023                          │
│              índice 38               (sin delta)     │
│                                                       │
│                                                       │
│  [📌 Pinear lectura de este país]                    │  ← micro-acción
└───────────────────────────────────────────────────────┘
```

**Reglas de render del bloque "Otras capas":**

- **Una fila por capa no-activa.** Si hay 4 capas en el sistema y 1 está activa, se renderizan 3 chips. Si el sistema crece a 5 (improbable según epic), se renderizan 4. La estructura no presupone número.
- **Cada fila lleva:** mini-glyph 18-20px de la capa + label corto (e.g. "Temperatura · Q3 2024") + valor formateado + indicador de delta o calidad.
- **Si la capa no tiene dato para ese país en esa fecha** (`getValueForCountry` retorna null): la fila se renderiza con `sin dato · última lectura disponible: [fecha o "ninguna"]` en gris claro. No se oculta — la ausencia es información (decisión 8 del epic).
- **Si la capa está stale (`quality: "congelado"`):** se renderiza el badge mínimo `⚠ congelado` al lado del valor. Coherente con Spec 46 §4.1.
- **Para viento (Spec 44):** el mini-glyph V3 orientado reemplaza la flecha de tendencia. La asimetría intrínseca del glyph carga la dirección (Spec 44 r2 §18.b). El delta sigue siendo válido pero se omite del chip para no duplicar información.
- **Sin subindicadores en el tooltip.** El A.4 lo dejó claro para la capa activa; esta spec replica la regla para las 3 no-activas. Los subindicadores siguen viviendo solo en el drawer.
- **Tono editorial:** los labels usan el lenguaje de las decisiones de cada capa. Para precipitación: "crecimiento" / "recesión" (Spec 42 B.4). Para temperatura: el bucket label con la etiqueta semántica latina ("estancado" en bucket 0, Spec 43). Para viento: "pro-mercado" / "pro-estado" / "neutro" (Spec 44). Para presión (pendiente Spec 45): el label se define cuando Spec 45 cierre.

**Performance.** `getCrossLayerSnapshot` se llama una vez por país hover, no en cada frame de animación. El cálculo es ligero (4 lookups en `LAYERS`). Memoización por `(slug, sliderDate)` para evitar re-cálculo cuando se mueve el slider con un país hover persistente. Memoización TTL = `Infinity` mientras el componente esté mounted; se invalida al cambiar de país o fecha.

**Posición y dimensiones.** Heredado de Spec 39: el tooltip flota cerca del cursor, max-width 320px (vs ~280px del A.4 original — la franja extra está justificada por las 3 filas nuevas). En desktop, la posición vertical sigue el cursor; en breakpoint estrecho desktop el tooltip se ancla al lateral derecho del mapa. En mobile no se renderiza (ver mobile abajo).

**Comportamiento sin capa activa** (`activeLayer === null`): el tooltip muestra solo el header país (nombre + análisis + agenda). El bloque "Otras capas" no se renderiza — sin capa activa, no hay anclaje a una capa principal y desplegar las 4 al mismo tiempo sería pedirle al lector que lea cuatro contextos sin foco. La comparativa solo aparece cuando hay capa activa. Esto preserva el comportamiento del `/mapa` modo navegación (Spec 39 §11 modo "Sin capa").

**Comportamiento en mobile (≤767px).** El tap sobre un país abre directo el drawer; el tooltip enriquecido no se renderiza. Esto es coherente con la decisión de A.4 de Spec 42 r2 ("en mobile el tap abre el drawer directo"). La franja del drawer en mobile (Spec 39 §9) se enriquece con el bloque "Otras capas" expandido por default (ver §3).

### 2. Pin lectura de este país — micro-acción en el tooltip y leyenda

La micro-acción `[📌 Pinear lectura de este país]` al pie del tooltip pinea el país en cuestión. Al pinear:

- El tooltip se cierra con la salida normal del cursor.
- En la leyenda flotante (esquina superior derecha), debajo del bloque "Cómo se lee esta capa" y arriba del footer con fuente, aparece un **panel persistente** que repite el snapshot cruzado para el país pineado:

```
┌─ leyenda (después de Spec 46 §4) ──────────┐
│ ...                                         │
│ ...                                         │
│ Fuente: World Bank · pulled 2026-05-10     │
│                                             │
│ ─── Lectura pineada ─── [× Despinear]      │
│                                             │
│ BR · Brasil                                 │
│                                             │
│ [glyph nube]  Prec.   +3.2% crec.    ↗     │
│ [gly term]    Temp.   +1.4% sal.     ↗     │
│ [gly V3→]     Vient.  +2 pro-merc.   ⚠     │
│ [gly TBD]     Pres.   índice 38      ─     │
│                                             │
│ [ⓘ Cómo se lee este mapa]                  │
└─────────────────────────────────────────────┘
```

- El panel pineado se actualiza automáticamente cuando el lector mueve el slider: cada nueva fecha → nuevo `getCrossLayerSnapshot(pineado, fechaNueva)` → nuevas filas.
- Al cambiar de capa activa, el panel pineado se mantiene: muestra siempre las 4 capas sin importar cuál esté activa en el mapa. La capa activa queda implícitamente en el centro del mapa, el panel funciona como sombra que sigue al país pineado.
- Solo se pinea un país a la vez. Pinear otro despinea el anterior. El despinear se hace explícito con `[× Despinear]` o al recargar la página (no persiste entre sesiones por default — ver decisión 7).

**Persistencia local** (`pinned-country-state.ts`): la clave `mi.mapa.pinned-country.v1` guarda `{ countrySlug, pinnedAt: ISO }`. Se setea al pinear, se borra al despinear. En la próxima sesión se restaura — el lector que vuelve a `/mapa` ve la lectura pineada del país que dejó. Si no quiere persistencia entre sesiones (decisión 7 abierta), se omite el `localStorage` y se usa solo `useState` del componente.

**Acceso desde el panel pineado al país real del mapa.** Click sobre el nombre del país en el panel pineado (`BR · Brasil`) hace pan/zoom al hot-zone correspondiente y abre el drawer del país. Atajo de navegación.

### 3. Bloque "Otras capas para este país" en el header del drawer

Cuando el lector clickea un país (no hover), el reading drawer (Spec 39 §7 + Spec 42 §A.4) se abre con su header habitual:

```
┌─ drawer (header existente) ────────────────────┐
│ BR · Brasil  · Q4 2024 ←→                      │
│                                                 │
│ [glyph nube] PRECIPITACIÓN                     │
│ +3.2% crecimiento  ↗ +0.7 pp                   │
│                                                 │
│ ─────────────────────────────────────          │
│                                                 │
│ # Lectura  (sección heredada)                  │
│ ...                                             │
│                                                 │
│ ─────────────────────────────────────          │
│                                                 │
│ # Subindicadores  (sección heredada)           │
│ ...                                             │
└─────────────────────────────────────────────────┘
```

Esta spec agrega entre el bloque de la capa activa y la sección "# Lectura" un panel desplegable:

```
┌─ drawer (después de Spec 47) ──────────────────┐
│ BR · Brasil  · Q4 2024 ←→                      │
│                                                 │
│ [glyph nube] PRECIPITACIÓN                     │
│ +3.2% crecimiento  ↗ +0.7 pp                   │
│                                                 │
│ [▼ Otras capas para este país]                 │  ← desplegable nuevo
│                                                 │
│ ┌─ expandido ────────────────────────────────┐ │
│ │                                              │ │
│ │ [glyph term]  Temperatura · Q3 2024         │ │
│ │ +1.4% sal. real  ↗  [Cambiar a esta capa →] │ │
│ │                                              │ │
│ │ [gly V3→]     Viento · sem 19 · 2026        │ │
│ │ +2 pro-merc. ⚠ congelado                    │ │
│ │ [Cambiar a esta capa →]                     │ │
│ │                                              │ │
│ │ [gly TBD]     Presión · 2023                │ │
│ │ índice 38                                    │ │
│ │ [Cambiar a esta capa →]                     │ │
│ │                                              │ │
│ └──────────────────────────────────────────────┘ │
│                                                  │
│ ─────────────────────────────────────           │
│                                                  │
│ # Lectura (heredada)                            │
│ ...                                              │
└──────────────────────────────────────────────────┘
```

**Diferencia con el tooltip de hover:**

- El **tooltip** es lectura rápida — chips compactos con valor + delta + glyph, sin links.
- El **bloque en el drawer** es lectura intermedia — añade los links `[Cambiar a esta capa →]` que dejan el drawer del mismo país abierto y activan la capa nueva. Conserva el flow.

**Click en `[Cambiar a esta capa →]`:**

1. Cambia `activeLayer` al ID de la capa del chip.
2. El slider se ancla al `defaultPeriod` de la capa nueva (si el período actual está fuera del rango de la nueva).
3. El drawer del mismo país se mantiene abierto, con el bloque "[glyph capa] PRECIPITACIÓN" reemplazado por el de la nueva capa.
4. URL state se actualiza: `?capa=X&t=Y&pais=Z`.
5. Animación 200ms entre states, respeta `prefers-reduced-motion`.

**Mobile (≤767px).** El bloque "Otras capas para este país" en el drawer se expande **por default** (vs colapsado en desktop) porque mobile no tiene tooltip de hover y este es el único lugar donde el lector ve la lectura cruzada.

### 4. Extensión al contrato `Layer`

Dos extensiones, ambas opcionales:

```ts
// platform/frontend/src/lib/layers.ts

export interface LayerChipFormat {
  /** Label corto para el chip en el snapshot cruzado, e.g. "Prec." o "Vient." */
  shortChipLabel: string;
  /** Tono semántico del chip — gobierna color de fondo discreto del chip */
  tone: "neutral" | "positive" | "negative";
  /** True si el chip debe renderizar el glyph de la capa con orientación (caso viento V3) */
  useOrientedGlyph: boolean;
}

export interface Layer {
  // ... campos existentes (Spec 39 + Spec 46)

  /**
   * Formato del chip cuando esta capa aparece como NO-activa dentro de un snapshot cruzado
   * (en tooltip enriquecido, drawer "Otras capas", o panel pineado).
   * Si no se implementa, se usa: { shortChipLabel: shortLabel.slice(0,5), tone: "neutral", useOrientedGlyph: false }
   * Requisito de Spec 47 § 4.
   */
  formatCrossLayerChip?(value: LayerValue): LayerChipFormat;
}
```

**Por capa:**

- **Precipitación** (Spec 42): `tone = "positive"` si `direction === "crecimiento"` y bucket ≥ 2; `tone = "negative"` si `direction === "recesion"` y bucket ≥ 2; `tone = "neutral"` en otros casos.
- **Temperatura** (Spec 43): `tone = "positive"` si bucket > 0 con sentido alentador; `tone = "negative"` si bucket > 0 con sentido alarmante. Spec 43 define la lectura semántica del tono.
- **Viento** (Spec 44): `tone = "neutral"` siempre (la capa no asigna valor moral a una dirección). `useOrientedGlyph = true`.
- **Presión** (Spec 45 pendiente): se define cuando Spec 45 cierre. Default en r1: `tone = "neutral"`.

### 5. Helper `getCrossLayerSnapshot`

Nuevo archivo `lib/cross-layer.ts`:

```ts
import { LAYERS, LayerId, Layer, LayerValue, LayerPeriod, LayerChipFormat } from "./layers";

export interface CrossLayerChip {
  layerId: LayerId;
  layer: Layer;
  period: LayerPeriod | null;       // null si no hay período <= date
  value: LayerValue | null;          // null si no hay dato
  chipFormat: LayerChipFormat;       // si layer.formatCrossLayerChip no existe, usa default
}

export interface CrossLayerSnapshot {
  countrySlug: string;
  sliderDate: string;                // ISO YYYY-MM-DD
  chips: CrossLayerChip[];           // siempre las 4 (o N) capas, en orden definido por Spec 39
}

export function getCrossLayerSnapshot(
  countrySlug: string,
  sliderDate: string,
): CrossLayerSnapshot {
  const chips: CrossLayerChip[] = (Object.keys(LAYERS) as LayerId[]).map((id) => {
    const layer = LAYERS[id];
    const period = layer.getLastPeriodBefore(sliderDate);
    const value = period ? layer.getValueForCountry(countrySlug, period) : null;
    const chipFormat: LayerChipFormat = value && layer.formatCrossLayerChip
      ? layer.formatCrossLayerChip(value)
      : { shortChipLabel: layer.shortLabel.slice(0, 5), tone: "neutral", useOrientedGlyph: false };
    return { layerId: id, layer, period, value, chipFormat };
  });
  return { countrySlug, sliderDate, chips };
}

/** Versión memoizada por (countrySlug, sliderDate) para uso en el componente del tooltip. */
export const getCrossLayerSnapshotMemo = createMemo(getCrossLayerSnapshot);
```

**Llamadas desde el frontend:**

- `<LayerTooltip>`: al renderizar, llama `getCrossLayerSnapshotMemo(slug, sliderDate)`.
- `<LayerReadingDrawer>`: al abrir/cambiar país, llama el helper.
- `<LayerLegend>` (panel pineado): al pinear o al cambiar slider con país pineado, llama el helper.

**Memoization.** Una sola entrada en cache por `(slug, sliderDate)`. Se invalida al cambiar de país o slider; no se invalida al cambiar de capa activa porque el snapshot incluye las 4 capas. Esto evita 3 llamadas idénticas en paralelo desde tooltip + drawer + pineado cuando los tres están activos.

### 6. Persistencia del país pineado

Nuevo archivo `lib/pinned-country-state.ts`:

```ts
const KEY = "mi.mapa.pinned-country.v1";

export interface PinnedCountryState {
  version: "v1";
  countrySlug: string;
  pinnedAt: string; // ISO
}

export function getPinnedCountry(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PinnedCountryState;
    return parsed.version === "v1" ? parsed.countrySlug : null;
  } catch {
    return null;
  }
}

export function setPinnedCountry(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ version: "v1", countrySlug: slug, pinnedAt: new Date().toISOString() } satisfies PinnedCountryState),
    );
  } catch {
    // localStorage deshabilitado, ignora silencioso
  }
}

export function clearPinnedCountry(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
```

**SSR-safe**, mismo patrón que `onboarding-state.ts` de Spec 46. La persistencia entre sesiones es opt-in por convención: el panel pineado aparece al cargar `/mapa` solo si hay clave guardada. Si en r2 se decide que NO persiste entre sesiones, basta con no llamar `setPinnedCountry` (solo estado local). Decisión #7 abierta.

### 7. URL state

Esta spec **no** agrega nuevos query params. Los existentes (`capa`, `t`, `pais`, `eje`, `periodo`, `guia` — todos definidos por Spec 39 §11) cubren los casos.

- **País pineado** se persiste solo en `localStorage`, no en URL, porque no es estado compartible en sentido editorial — es un asistente personal de lectura del usuario individual. Compartir un link con país pineado podría confundir más que aclarar. Si en r2 aparece evidencia que justifique compartirlo, se agrega `?pin=br`.
- **Tooltip pineado** vs **país pineado**: el tooltip se cierra siempre al sacar el cursor. El "país pineado" es el panel en la leyenda — son cosas distintas con vocabularios distintos.

### 8. Anexo A · decisión visual pendiente

El layout funcional del tooltip enriquecido queda cerrado en r1. La decisión visual abierta es **cómo se diferencia visualmente el chip de cada una de las 3 capas no-activas para que el lector reconozca la capa sin leer el label**:

- **D.1 Glyph como única ancla visual.** El mini-glyph de cada capa (18-20px) es lo que identifica visualmente cada chip. El fondo y bordes son todos iguales (e.g. paleta neutra del DS). Simple, coherente con el sistema de glyphs cerrado.
- **D.2 Glyph + acento cromático por capa.** Cada chip lleva un borde lateral de 2-3px con el color principal de la paleta de la capa (`--mi-precipitacion-2`, `--mi-temperatura-2`, `--mi-viento-2`, `--mi-presion-2`). Identidad cromática reforzada pero compite con el resto del color del tooltip.
- **D.3 Fila de chips con bandas de fondo.** Cada chip tiene un fondo de banda apenas teñido con la paleta de la capa (alpha bajo, e.g. 8%). Más ruido visual, identidad más fuerte.
- **D.4 Solo tipografía + glyph.** Sin diferenciación cromática. El nombre de la capa en mono uppercase + el glyph. Más austero, alinea con dirección Grabado.

La decisión queda abierta para sesión de Product Design separada. Brief autocontenido en §Anexo A al final del documento.

---

## Archivos a tocar

| Archivo | Acción |
|---|---|
| `platform/frontend/src/components/LayerTooltip.tsx` | NUEVO — extracción del tooltip inline + extensión con bloque "Otras capas" + micro-acción "Pinear" |
| `platform/frontend/src/components/MapaTorresGarcia.tsx` | EXTENDER — reemplazar tooltip inline con `<LayerTooltip>`. Pasar `LAYERS`, `sliderDate`, callbacks de pin |
| `platform/frontend/src/components/LayerLegend.tsx` | EXTENDER — agregar el panel pineado debajo del footer existente; render condicional al `pinnedCountry` |
| `platform/frontend/src/components/LayerReadingDrawer.tsx` | EXTENDER — agregar bloque desplegable "Otras capas para este país" en el header, antes de la sección "# Lectura" |
| `platform/frontend/src/lib/layers.ts` | EXTENDER — agregar tipos `LayerChipFormat` + método opcional `formatCrossLayerChip` al `interface Layer` |
| `platform/frontend/src/lib/cross-layer.ts` | NUEVO — helper `getCrossLayerSnapshot` + memoizada `getCrossLayerSnapshotMemo` |
| `platform/frontend/src/lib/pinned-country-state.ts` | NUEVO — get / set / clear persistencia de país pineado |
| `platform/frontend/src/lib/layers/precipitacion.ts` | EXTENDER — implementar `formatCrossLayerChip` (a coordinar con Spec 42 r3 o queda como TODO) |
| `platform/frontend/src/lib/layers/temperatura.ts` | EXTENDER — idem para Spec 43 |
| `platform/frontend/src/lib/layers/viento.ts` | EXTENDER — `formatCrossLayerChip` con `useOrientedGlyph: true` |
| `platform/frontend/src/lib/layers/presion.ts` | EXTENDER — placeholder hasta Spec 45 |
| `platform/frontend/src/styles/tooltip.css` | NUEVO o EXTENSIÓN — tokens del tooltip enriquecido + animaciones |
| `70-Producto/lecturas-capas/_glossary-multicapa.md` | NUEVO — términos para el glosario del onboarding (Spec 46): snapshot cruzado, país pineado, lectura cruzada |
| `70-Producto/lecturas-capas/_onboarding.md` | EXTENDER — agregar términos del glosario o (opcional) una pantalla "Cómo se leen las capas juntas" si Tomás decide |
| `70-Producto/design-system/mapa/tooltip-mockups/` | NUEVO directorio para mockups del Anexo A — los 4 candidatos D.1/D.2/D.3/D.4 del layout del chip |

---

## Criterios de aceptación

| # | Criterio | Verificación |
|---|---|---|
| AC1 | Hover sobre país con capa activa muestra tooltip enriquecido con tres bloques: header país + capa activa A.4 + "Otras capas" con 3 chips | Inspect on-hover, los 3 bloques presentes |
| AC2 | Hover sobre país sin capa activa muestra solo el header país (modo navegación heredado) | Modo "Sin capa": el bloque "Otras capas" no aparece |
| AC3 | Cada chip de "Otras capas" muestra mini-glyph + label corto + período + valor formateado + delta o calidad | Inspect: cada chip tiene los 5 elementos |
| AC4 | El chip de viento (cuando NO es la capa activa) usa el mini-glyph V3 orientado (Spec 44) en lugar de flecha de tendencia | Inspect: chip viento con dato `rank > 0` → glyph apunta derecha; `rank < 0` → izquierda; `rank = 0` → variante neutro |
| AC5 | Si una capa no tiene dato para el país en esa fecha (`getValueForCountry` → null), el chip muestra "sin dato · última lectura: [fecha]" en gris claro | Mock con país que no tiene dato → fila renderiza el mensaje |
| AC6 | Si una capa está congelada (`quality === "congelado"`), el chip incluye `⚠ congelado` | Mock con dato stale → badge visible en el chip |
| AC7 | Mobile (≤767px) no muestra tooltip enriquecido; el tap abre directo el drawer con el bloque "Otras capas" expandido por default | DevTools mobile: tap → drawer abre, bloque "Otras capas" visible y expandido |
| AC8 | El componente `<LayerTooltip>` está extraído de `<MapaTorresGarcia>` y recibe props limpios (`country`, `activeLayer`, `sliderDate`, `LAYERS`) | Inspect el código: tooltip ya no está inline en MapaTorresGarcia, sigue el patrón de componente propio |
| AC9 | Click en `[📌 Pinear lectura de este país]` en el tooltip cierra el tooltip y renderiza el panel pineado en la leyenda flotante | Click → tooltip se cierra, panel persistente aparece debajo del footer de la leyenda |
| AC10 | El panel pineado se actualiza al mover el slider (las 4 filas reflejan los nuevos períodos según `getLastPeriodBefore` de cada capa) | Mover slider con país pineado → todas las filas cambian si corresponde |
| AC11 | El panel pineado se mantiene al cambiar de capa activa | Cambiar de precipitación a temperatura con BR pineado → el panel sigue mostrando las 4 capas |
| AC12 | `[× Despinear]` borra el panel pineado y la clave `mi.mapa.pinned-country.v1` de `localStorage` | Click → panel desaparece + `localStorage.getItem` retorna null |
| AC13 | Pinear un país nuevo despinea el anterior | Pinear BR, luego pinear AR → panel muestra AR, no BR |
| AC14 | Click en el nombre del país en el panel pineado (`BR · Brasil`) hace pan del mapa al hot-zone del país y abre su drawer | Click → mapa centra al país + drawer abierto |
| AC15 | El drawer (`<LayerReadingDrawer>`) muestra el bloque desplegable "[▼ Otras capas para este país]" entre el header y "# Lectura" | Inspect: bloque presente |
| AC16 | El bloque "Otras capas" del drawer está colapsado por default en desktop y expandido por default en mobile | Inspect breakpoints |
| AC17 | Cada chip del drawer tiene un link `[Cambiar a esta capa →]` que activa la capa, ancla el slider al período válido, mantiene el drawer del mismo país abierto | Click → `?capa` cambia, slider se ajusta, drawer sigue del mismo país |
| AC18 | El contrato `Layer` admite `formatCrossLayerChip?(value): LayerChipFormat` como método opcional. Si no se implementa, se usa el default `{ shortChipLabel, tone: "neutral", useOrientedGlyph: false }` | `pnpm typecheck` pasa; capa que no implementa el método → chip degradado |
| AC19 | El helper `getCrossLayerSnapshot(slug, date)` devuelve un objeto con `chips: CrossLayerChip[]` de longitud N (= cantidad de capas registradas en `LAYERS`) | Unit test |
| AC20 | El helper memoizada `getCrossLayerSnapshotMemo` no recalcula para el mismo `(slug, date)` en la misma sesión | Test: hover sobre BR dos veces seguidas → solo 1 cálculo (verificar con spy) |
| AC21 | Persistencia de país pineado entre sesiones: cerrar y reabrir `/mapa` con la clave guardada → panel pineado vuelve | Setear pin, recargar, panel visible |
| AC22 | `prefers-reduced-motion: reduce` desactiva animaciones del tooltip y del bloque desplegable | DevTools simula → sin animaciones |
| AC23 | El tooltip tiene `role="tooltip"` y es accesible vía `aria-describedby` desde el polígono del país | Inspect ARIA + axe-core sin violaciones críticas |
| AC24 | Type-check pasa. `next build` completa sin errores | `pnpm typecheck && pnpm build` |
| AC25 | El layout visual del chip (decisión #16 del Anexo A) está implementado según la opción elegida en Product Design | Inspect: chip coincide con mockup elegido |

AC25 queda **cerrado en r2** con la sesión de Product Design.

---

## Edge cases

- **Una capa stub sin datos reales** (e.g. Spec 45 antes de implementarse). El chip muestra `sin dato` y un link al `/mapa/capas/presion` (Spec 39B) que dirá "Próximamente". No rompe; conserva el espacio visual.
- **Lector pinea un país y luego cambia el sistema de capas (e.g. la cantidad de capas crece de 4 a 5).** La clave `mi.mapa.pinned-country.v1` lleva versión; bumpear a `v2` cuando el sistema cambie sustantivamente. Para v1 → v2: la clave antigua se ignora silenciosamente al cargar.
- **`getLastPeriodBefore` retorna null** para todas las capas en una fecha muy temprana (ej. slider en 2020 antes del piso 2021 de Spec 39). El tooltip muestra "sin dato" para las 3 filas del bloque "Otras capas". El panel pineado muestra lo mismo. La leyenda principal ya tenía manejo de este caso (Spec 39 §6).
- **Lector pinea un país que no aparece en el corpus editorial** (e.g. un país sin agenda activa). Funciona igual — el snapshot cruzado no depende del corpus, solo de las capas. El pan del mapa al país sigue funcionando.
- **El slider está en una fecha con capa activa "viento" stale + país pineado con viento congelado**. El chip del panel pineado muestra `⚠ congelado`; el bloque de capa activa (heredado) muestra `⚠` también. Doble badge en superficies distintas — coherente y honesto.
- **Hover muy rápido entre países** (cursor barre el mapa). El componente debounce el tooltip 100ms para no recalcular el snapshot por cada frame de movimiento. Sin debounce, hover sobre 10 países en 1 segundo dispara 10 cálculos — innecesario.
- **Lector llega con un link compartido con país pineado en `localStorage` previo** (sesión anterior persistida). El panel aparece. Si querés ese estado solo dentro de una sesión, desmarcar persistencia (decisión #7 abierta).
- **Múltiples renderers del snapshot al mismo tiempo** (tooltip + drawer + panel pineado). La memoización por `(slug, sliderDate)` evita 3 cálculos. Sin memoización, los tres componentes hacen el mismo cálculo en paralelo → desperdicio.
- **Capa con dato pero `formatCrossLayerChip` returns inválido** (e.g. `tone: "rainbow"`). El componente del chip degrada a `tone: "neutral"` y loggea warning. No rompe.
- **El drawer está abierto en modo mobile** (Spec 39 §9: el drawer ocupa el viewport entero como modal). El bloque "Otras capas" expandido por default puede empujar la sección "# Lectura" abajo; el lector scrollea. Aceptable.

---

## Decisiones tomadas

### Cerradas en r1 (sesión 2026-05-21)

| # | Tema | Decisión | Razón |
|---|---|---|---|
| 1 | Mecánica multi-capa | **Single-select + tooltip cruzado** (opción 1 de 3 ofrecidas a Tomás) | Mantiene la decisión #4 del epic intacta como ancla. Resuelve la necesidad comparativa del lector sin pagar el costo de mezclar 4 sistemas de paleta/escala/cadencia/dirección deliberadamente cerrados como distintos |
| 2 | Comparación país×país | **Fuera de scope en r1** | Decisión explícita de Tomás. La spec se enfoca en lectura cruzada por país, no en comparación entre dos países. Si en r2 aparece evidencia que justifique pin > 1, va como spec aparte |
| 3 | Estructura del tooltip enriquecido | Tres bloques: header país + capa activa A.4 heredada + "Otras capas" con N-1 chips | Capa activa preserva A.4 sin tocar (identidad visual de la lectura principal). Las otras capas en chips compactos como contexto, no como protagonistas |
| 4 | Render del chip de viento | Mini-glyph V3 orientado en lugar de flecha de tendencia | El glyph V3 ya carga la dirección (Spec 44 r2 §18.b). Duplicar con flecha sería redundante; mostrar la flecha sin el glyph perdería identidad de capa |
| 5 | Sin capa activa | Tooltip no renderiza bloque "Otras capas" | Sin anclaje a una capa principal, mostrar las 4 al mismo tiempo sería pedirle al lector que lea 4 contextos sin foco. La comparativa solo aparece cuando hay capa activa |
| 6 | Mobile | Tap → drawer directo con "Otras capas" expandido por default; no se renderiza tooltip enriquecido | Coherente con A.4 de Spec 42 r2. El drawer es la única superficie con espacio para el snapshot en mobile |
| 7 | Persistencia del país pineado entre sesiones | **localStorage con clave versionada** `mi.mapa.pinned-country.v1` | Patrón heredado de Spec 46. Si en r2 se decide no persistir, basta con no llamar `setPinnedCountry`. Default = persistir hasta tener evidencia en contra |
| 8 | Pin único | Solo se pinea un país a la vez; pinear otro despinea el anterior | Mantiene scope acotado y descarta comparación país×país (decisión 2). Si en r2 se quiere pin > 1, va como spec aparte |
| 9 | Acceso desde el panel pineado al mapa | Click en `BR · Brasil` → pan al hot-zone + drawer abierto | Atajo natural sin agregar UI. El panel sigue al país, el click vuelve al mapa |
| 10 | Bloque en el drawer | Desplegable "Otras capas para este país" con links `[Cambiar a esta capa →]` que conservan el drawer del mismo país abierto | Cero pérdida de contexto al cambiar de capa desde el drawer. El flow lectura cruzada → activación de capa nueva → drawer del mismo país queda fluido |
| 11 | Extensión del contrato | `formatCrossLayerChip?(value): LayerChipFormat` como método opcional. Default si no se implementa: `{ shortChipLabel: shortLabel.slice(0,5), tone: "neutral", useOrientedGlyph: false }` | Mantiene la arquitectura limpia: contrato sin contenido editorial, cada capa aporta su formato. Si una capa no lo implementa, el chip degrada silencioso |
| 12 | Helper en lib | `getCrossLayerSnapshot(slug, date)` + memoizada por `(slug, sliderDate)` en `lib/cross-layer.ts` | Primitivo reutilizable: tooltip + drawer + panel pineado consumen el mismo helper. Memoization evita 3 cálculos paralelos |
| 13 | Sin nuevos query params | `?capa`, `?t`, `?pais`, `?eje`, `?periodo`, `?guia` ya cubren los casos. País pineado vive solo en localStorage | El pin es asistente personal del lector, no estado editorial compartible. Si en r2 hay evidencia de que conviene compartirlo, se agrega `?pin=br` |
| 14 | Debounce del tooltip | 100ms en hover para evitar recalcular el snapshot por cada frame | Hover rápido sobre 10 países dispararía 10 cálculos sin debounce. 100ms es perceptible solo en hover muy lento |
| 15 | Glosario | Términos nuevos ("snapshot cruzado", "país pineado", "lectura cruzada") se agregan al glosario de Spec 46 vía `_glossary-multicapa.md`, sin diseñar UI nueva | Reusa la infraestructura de Spec 46. Si Spec 47 sale antes de que Spec 46 cierre en r2, el archivo queda placeholder hasta el merge |
| 16 | Patrón heredable | Si el sistema crece a 5 capas (improbable según epic), `getCrossLayerSnapshot` itera sobre las claves de `LAYERS` sin asumir N=4 | El primitivo es N-agnóstico. Spec 48 (risk management) puede consumirlo para export; futuras agendas por país pueden referenciarlo |

### Cerradas condicionales para r2 (sesión de Product Design separada)

| # | Tema | Decisión | Estado |
|---|---|---|---|
| 17 | Diferenciación visual del chip de cada capa no-activa | **D.1 / D.2 / D.3 / D.4** — cuatro candidatos a elegir en sesión de Product Design (Mapa Inestable Design System · spec47/index.html) | Abierta — brief autocontenido en §Anexo A |

---

## Decisiones abiertas (tácticas, para implementación o para r3)

Las decisiones bloqueantes están cerradas. Lo que queda como decisión menor para la implementación:

1. **Posición exacta del panel pineado dentro de la leyenda.** Esta spec dice "debajo del footer existente con fuente"; el orden visual exacto (antes del botón `[ⓘ Cómo se lee este mapa]` o después) se cierra en implementación con la leyenda r2 de Spec 46 efectivamente renderizando.

2. **Animación de pan/zoom al país** cuando se clickea el nombre en el panel pineado (AC14). Esta spec no fija la animación; opciones: salto instantáneo, scroll suave, zoom progresivo. Decisión de implementación.

3. **Si el helper `getCrossLayerSnapshot` debe limpiarse al cambiar de capa.** La memoización por `(slug, sliderDate)` se invalida en cambio de slider y de país, pero no en cambio de capa activa porque las 4 capas viven en el snapshot. Si se ve evidencia de bug, agregar invalidación.

4. **Compartibilidad del país pineado en URL.** En r1, no se comparte (decisión 13). Si en r2 emerge demanda, agregar `?pin=br`.

5. **Si pinear pone al país en estado "filtrado" del corpus editorial.** Hoy `/mapa` filtra el corpus de la sección resultados por país clickeado. ¿El pin debería filtrar también? Esta spec lo deja **desacoplado** — pinear no filtra, filtrar no pinea. Si en producción aparece confusión, evaluar acoplar en r2.

6. **Renderer del bloque "Otras capas" del drawer.** Si la implementación reusa `<LayerTooltip>` (con responsive switch) o duplica el código en `<LayerReadingDrawer>` es decisión del implementador.

7. **Pin > 1 (comparación país×país).** Mencionada en decisión #2 como out-of-scope r1. Pendiente para r2 si emerge demanda.

8. **Onboarding del tooltip enriquecido.** Spec 46 §decisión 15 anticipa que Spec 47 puede sumar una pantalla al overlay. Esta spec no lo hace por default — agrega términos al glosario pero no una pantalla nueva. Si en producción la lectura cruzada confunde al primer uso, agregar pantalla en r2.

---

## No incluido en esta spec

- Multi-capa simultánea (2+ capas pintando el mapa al mismo tiempo). Decisión explícita.
- Comparación país×país. Decisión explícita.
- Export del snapshot cruzado (CSV, imagen, copy). Spec 48 (risk management).
- Pin > 1 país. Decisión explícita.
- Tooltip enriquecido en el home `/`. Fuera de scope — el home no tiene capa activa.
- Snapshot temporal cruzado (e.g. "ver Brasil en los 4 trimestres del último año en las 4 capas"). Fuera de scope r1; posible spec posterior si emerge demanda.
- Cambios a `<MapaTorresGarcia>` más allá del refactor del tooltip. El polígono, hot-zones, Gaussian blur quedan intactos.
- Cambios al panel lateral del home (Spec 33). El home queda como Spec 39 §10 lo dejó.

---

## Implementación sugerida

Esta spec se diseña en Cowork (este documento es el handoff). La implementación la ejecuta una sesión de **Claude Code en VS Code** sobre `platform/frontend/`. Orden recomendado:

1. **Extender `lib/layers.ts`** con `LayerChipFormat` y `formatCrossLayerChip?`. Actualizar los 4 stubs con implementación o TODO. Typecheck pasa.
2. **Crear `lib/cross-layer.ts`** con `getCrossLayerSnapshot` y la memoizada. Unit tests con fixture de 4 capas stub.
3. **Crear `lib/pinned-country-state.ts`** con SSR-safe getters/setters. Unit tests.
4. **Extraer `<LayerTooltip>` de `<MapaTorresGarcia>`.** Refactor mecánico, sin cambio funcional en este paso. Verificar que el tooltip básico (modo sin capa activa) sigue funcionando idéntico.
5. **Extender `<LayerTooltip>` con el bloque "Otras capas".** Agregar 3 chips, render por capa con `formatCrossLayerChip`. Renderizar mini-glyph V3 orientado para viento. Cerrar AC1-AC6.
6. **Mobile: en breakpoint ≤767px, no renderizar tooltip; tap → drawer.** Cerrar AC7.
7. **Agregar micro-acción `[📌 Pinear]` al pie del tooltip.** Click → `setPinnedCountry(slug)` + cerrar tooltip. Cerrar AC9.
8. **Extender `<LayerLegend>` con el panel pineado.** Render condicional al `pinnedCountry` desde el state global o context. Reaccionar al cambio de slider (subscribe). Cerrar AC10-AC14.
9. **Extender `<LayerReadingDrawer>` con el bloque "Otras capas para este país".** Colapsado en desktop, expandido en mobile. Cerrar AC15-AC17.
10. **Implementar `[Cambiar a esta capa →]`** desde el drawer: cambia `activeLayer`, ancla slider si fuera de rango, mantiene drawer del mismo país abierto. Cerrar AC17.
11. **Implementar memoización + debounce** en `<LayerTooltip>` (100ms). Cerrar AC20.
12. **Agregar accesibilidad** (`role="tooltip"`, `aria-describedby`, axe-core sin violaciones críticas). Cerrar AC23.
13. **Crear `_glossary-multicapa.md`** en `70-Producto/lecturas-capas/` con los 3 términos nuevos. Verificar que el glosario chip de Spec 46 los incorpora.
14. **Sesión Product Design** para Anexo A (decisión #17) → entregar mockup del chip elegido al vault y sincronizar tokens al frontend. Cerrar AC25.
15. **Type-check y `next build`.** Cerrar AC24.
16. **Smoke test cruzado:** activar precipitación → hover sobre BR → ver tooltip enriquecido → pinear BR → mover slider → ver panel pineado actualizado → click en nombre BR del panel → mapa pan + drawer abierto → expandir "Otras capas" en drawer → click `[Cambiar a temperatura]` → drawer queda en BR con capa temperatura → despinear → todo limpio.

Tiempo estimado: **3-5 días** de implementación. Bloqueante crítico: ninguno. Bloqueante condicional: Anexo A (D.1/D.2/D.3/D.4) — la spec puede mergearse con un layout default (D.1, el más conservador) y AC25 cierra después.

---

## Histórico

| Fecha | Cambio | Razón |
|---|---|---|
| 2026-05-21 | Creación de la spec en sesión de Cowork. r1 cierra 16 decisiones técnicas + 1 decisión visual abierta (Anexo A). Resuelve la decisión #4 del epic (multi-capa) confirmando single-select como ancla y agregando tooltip cruzado como mecanismo alternativo | Tomás eligió "single-select + tooltip cruzado" sobre dos alternativas (dual-layer split-screen, dual-layer bivariate). La elección preserva la coherencia visual cerrada por Specs 42-44 (paletas, escalas, glyphs distintos) y resuelve la necesidad comparativa real del lector |

---

## Anexo A · brief para sesión de Product Design (Mapa Inestable Design System · spec47/index.html)

### Decisión 17 · Diferenciación visual del chip de cada capa no-activa en el snapshot cruzado

**El problema.** El bloque "Otras capas" del tooltip enriquecido (y del panel pineado y del drawer) muestra N-1 filas, una por cada capa no-activa. Cada fila tiene mini-glyph + label corto + valor + indicador. Necesitamos resolver cómo se diferencia visualmente cada chip para que el lector reconozca la capa **sin leer el label** — la lectura cruzada es rápida, escanea de arriba abajo, no detallada.

**Restricciones.**

- Cada capa tiene su propia paleta cerrada (precipitación terracota base, temperatura cálido, viento ocre profundo, presión TBD). No introducir colores nuevos.
- El mini-glyph 18-20px ya carga identidad visual de cada capa. Es el primer ancla.
- El espacio es chico — tooltip 320px de ancho, ~24px de alto por fila. No hay lugar para grandes adornos.
- Debe coexistir con la decisión B.4 de Specs 42/43 (el color en el mapa codifica solo magnitud) — el chip puede llevar color de la capa, pero ese color **no debe** confundir al lector haciéndole creer que codifica un valor cuantitativo.
- Debe escalar al panel pineado (mismo formato del chip pero contexto persistente abajo de la leyenda) y al bloque del drawer (con `[Cambiar a esta capa →]` agregado al chip).
- En mobile el chip se renderiza en el drawer (más espacio) — el diseño debe funcionar a 24-32px de alto sin saturarse.

**Opciones a explorar (no exhaustivas).**

**D.1 · Glyph como única ancla visual.** El mini-glyph es lo que identifica visualmente cada chip. El fondo, bordes y texto son todos iguales (paleta neutra del DS). Simple, coherente con el sistema de glyphs cerrado en 3 ejes compositivos por Specs 42-44. Riesgo: si el lector no recuerda los glyphs, pierde identificación rápida.

**D.2 · Glyph + acento cromático por capa.** Cada chip lleva un borde lateral de 2-3px con el color principal de la capa (`--mi-precipitacion-2`, etc.). Identidad cromática reforzada con costo bajo. Riesgo: el color del borde puede competir visualmente con el badge de calidad `⚠ congelado` que también vive en ámbar.

**D.3 · Fila de chips con bandas de fondo.** Cada chip tiene un fondo de banda apenas teñido con la paleta de la capa (alpha 6-10%). Más identidad pero más ruido visual; el tooltip queda con 3 bandas de colores distintos, riesgo de "stripe" molesto. Mitigación: alpha muy bajo para que sea sutil.

**D.4 · Solo tipografía + glyph.** Sin diferenciación cromática. El nombre de la capa en mono uppercase + el glyph. Más austero, alinea con dirección Grabado. Riesgo: lectura cruzada visualmente menos diferenciable que D.2 o D.3.

**Criterios de evaluación.**

- (a) **Reconocimiento sin texto** — el lector que conoce el sistema, ¿identifica cada chip en < 1 segundo solo por su forma visual (glyph + tono)?
- (b) **No-conflicto con badge de calidad** — `⚠ congelado` en ámbar no debe competir con el color de identidad de la capa.
- (c) **Coherencia con B.4** — el color del chip no debe leerse como valor cuantitativo. Si D.2/D.3 introducen color de la paleta de la capa, ese color debe ser claramente decorativo, no representar magnitud (la magnitud está en el texto del valor).
- (d) **Escalabilidad multi-superficie** — el chip se renderiza en tooltip (320px ancho), panel pineado en leyenda (~280px ancho), drawer (~340px ancho con link extra). Debe funcionar en las tres.
- (e) **Costo de implementación** — D.1 y D.4 son baratos; D.2 exige tokens nuevos; D.3 exige composición compleja con fondo.

**Entregable esperado.** Mockups exploratorios de las 4 opciones (más una opción combinada si emerge) en `70-Producto/design-system/mapa/tooltip-mockups/`. Decisión final en el HTML del sitio de Product Design. Si la decisión introduce tokens nuevos (D.2), entregar lista de tokens CSS para `styles/tooltip.css`.

**Cierre.** La decisión #17 se cierra al elegir entre D.1, D.2, D.3, D.4 (o variante combinada) y entregar mockup. AC25 cierra entonces.

---

## Glosario

- **Capa activa:** la capa actualmente seleccionada en el `<LayerController>` (Spec 39 §4). Pintada en el mapa, lectura principal del lector.
- **Capa no-activa:** una de las restantes 3 (o N-1) capas del sistema. No pintada en el mapa, accesible vía el snapshot cruzado.
- **Snapshot cruzado:** objeto `CrossLayerSnapshot` con los últimos valores de las N capas para un país y una fecha del slider. Producido por `getCrossLayerSnapshot(slug, sliderDate)`.
- **Chip cruzado:** una fila del bloque "Otras capas" del tooltip / drawer / panel pineado. Lleva mini-glyph + label corto + valor + delta o badge de calidad.
- **País pineado:** país elegido por el lector vía `[📌 Pinear]` cuyo snapshot cruzado vive persistente debajo de la leyenda. Solo uno a la vez. Persistido en `localStorage`.
- **Lectura cruzada:** el acto de leer las N capas para un país en simultáneo, sin cambiar de capa activa en el mapa. Modelo de lectura habilitado por esta spec.
- **Mini-glyph orientado V3 (viento):** versión chica del `viento.svg` (Spec 44 r2) usada en el chip cruzado de viento. Aplica `transform: scaleX(-1)` cuando `direccion === "pro-estado"`. Si `rank === 0`, usa `viento-neutro.svg`.
- **Modo navegación / sin capa activa:** estado de `/mapa` donde no hay capa pintada; el tooltip muestra solo header país. Heredado de Spec 39 §11.
