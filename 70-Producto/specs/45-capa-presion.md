---
spec: 45
titulo: Capa presión — densidad institucional desde Latinobarómetro como cuarta y última capa analítica del mapa
estado: borrador-r1
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-21
revision: 2026-05-21 (r1) — cierre del diseño de las 4 capas analíticas del EPIC 03. Hereda contrato `Layer` (Spec 42), patrones A.4/B.4 (Spec 42 r2) y C.4 (sistema de glyphs cerrado en Spec 42/43/44 r2). 4 divergencias locales documentadas: (a) escala sobre valor absoluto del compuesto en lugar de variación interanual; (b) indicador principal compuesto (promedio simple de 3 indicadores LB) en lugar de un solo slug del pipeline macro; (c) `noData` estricto por período sin fallback `getLastWaveBefore`; (d) etiqueta bucket 0 = "Vacío institucional". Pre-requisito operativo declarado en frontmatter: curar 4 olas históricas de Latinobarómetro (2018, 2020, 2021, 2023) antes del handoff a VS Code; la ola 2024 ya está
epic: 03
afecta:
  - platform/frontend/src/lib/layers/presion.ts (REESCRIBIR — el stub de Spec 39 con datos sintéticos y paleta diverging violeta-verde se reemplaza por implementación real sobre el JSON de Latinobarómetro multi-ola)
  - platform/frontend/src/lib/latinobarometro.ts (EXTENDER — agregar tipos y helpers para serie multi-ola: `getWaveByYear`, `getAvailableWaves`, `getCountryDataByWave`)
  - platform/frontend/src/data/latinobarometro-2024/ (RENOMBRAR a `latinobarometro/` y EXTENDER con `indicators-historical.json` que incluye 5 olas)
  - platform/data/latinobarometro-2024/ (RENOMBRAR a `latinobarometro/` y EXTENDER con `build_indicators_historical.py` que procesa 5 olas)
  - platform/frontend/src/styles/layers.css (EXTENDER — agregar tokens `--mi-presion-0..4` siguiendo el patrón de las otras 3 capas)
  - 70-Producto/design-system/mapa/glyphs/presion.svg (NUEVO — SSOT en vault, entregable de la sesión de Product Design del Anexo A)
  - platform/frontend/public/mapa/glyphs/presion.svg (REEMPLAZAR — hoy hay un placeholder; se reemplaza con la copia sincronizada del vault una vez resuelto Anexo A)
  - 70-Producto/design-system/mapa/glyphs/README.md (ACTUALIZAR — marcar `presion.svg` como activo con eje compositivo elegido)
  - 70-Producto/lecturas-capas/presion.md (REESCRIBIR — el esqueleto actual arrastra el malentendido "Latinobarómetro no corre todos los años" como descripción del producto académico; se reescribe con la estructura definitiva: intro + cómo se lee + subindicadores + lectura por país piloto AR/BR/CL + otros países + método + limitaciones)
  - 70-Producto/design-system/cover-style-guide.md (referencia, no se edita)
depende_de: [39, 12A, 14A]
depende_blanda_de: [22, 37, 42, 43, 44]
relaciona_con:
  - EPIC-03 (esta spec implementa la decisión 6 del epic: presión = índices de Latinobarómetro; cuarta y última capa analítica diseñada, cierra el bloque "diseño de capas" del epic)
  - Spec 39 (arquitectura de capas — esta spec puebla el contrato Layer en su slot `presion`)
  - Spec 39B (página dedicada de documentación — el reading guide de esta spec es insumo de Spec 39B cuando se diseñe)
  - Spec 12A (curaduría de los 12 indicadores LB 2024 — fuente conceptual del compuesto principal y los 4 subindicadores)
  - Spec 14A (curaduría de los 24 indicadores estructurales — los 3 del cluster Erosión de mediaciones que componen el compuesto principal vienen del subconjunto LB)
  - Spec 42 (capa precipitación — ancla del patrón visual y técnico: contrato `LayerSubIndicator`, modelo de tiempo por capa, escala secuencial intensidad, A.4 tooltip+drawer, B.4 dirección solo en leyenda/tooltip, C.4 glyph "principal + secundarios")
  - Spec 43 (capa temperatura — segunda capa que validó herencia con divergencias locales chicas)
  - Spec 44 (capa viento — tercera capa que probó el método de divergencias mayores documentadas, abrió precedente de divergir B.4)
desbloquea:
  - Spec 46 (leyenda + onboarding visual) — ahora con las 4 capas diseñadas se puede arrancar
  - Spec 47 (tooltip + interacción multi-capa) — idem
  - Spec 39B (página dedicada por capa) — sigue postergada hasta que las 4 capas estén implementadas
pre_requisitos_operativos:
  - "Curar 4 olas históricas de Latinobarómetro (2018, 2020, 2021, 2023) en el pipeline `platform/data/latinobarometro/`, manteniendo el mismo schema que la ola 2024 ya curada. La ola 2020 puede tener cobertura parcial por COVID (LB declaró metodología 'modo crisis' ese año) — registrar la limitación en el JSON. Estimación: ~1 semana de trabajo análogo al build_indicators.py actual. Output esperado: `platform/data/latinobarometro/indicators-historical.json` con array `waves[]` de 5 elementos (2018, 2020, 2021, 2023, 2024). Spec 45 NO se implementa en VS Code hasta que este pendiente esté cerrado."
prioridad: alta
---

# 45 · Capa presión — densidad institucional desde Latinobarómetro

## Resumen ejecutivo

Esta spec implementa la **cuarta y última capa analítica del EPIC 03**. Cierra el bloque "diseño de las 4 capas" del epic. Después de Spec 45 r1, lo que sigue son los pasos operativos (pre-requisitos de Spec 43/44/45) y el diseño de Spec 46 (leyenda + onboarding) y Spec 47 (tooltip multi-capa), que asumen 2+ capas implementadas en producción.

La capa lee el clima atmosférico institucional como **presión barométrica**: alta presión = instituciones con peso simbólico, capaces de mediar la vida colectiva; baja presión = aire enrarecido, instituciones vaciadas. El indicador principal es un **compuesto de confianza institucional**: el promedio simple de la confianza en partidos, congreso y poder judicial (los 3 indicadores del eje "Erosión de mediaciones" curados en Spec 12A). Los 3 quedan como subindicadores desagregados en el drawer; un cuarto subindicador "elecciones fraudulentas" (eje Desorientación epistemológica, `invertGood: true`) suma una mirada sobre el suelo epistémico de la democracia.

Spec 45 hereda contrato técnico y dos de los tres patrones visuales que Spec 42 r2 dejó cerrados (A.4 tooltip + drawer, B.4 dirección solo en leyenda/tooltip, C.4 glyph "principal + secundarios"). **B.4 se hereda sin tensión** — divergir como hizo Spec 44 no aplica acá porque la magnitud "confianza alta vs baja" ya es la lectura completa, no hay una dirección auxiliar que codificar. La capa diverge del patrón Spec 42/43/44 en cuatro cosas distintas:

1. **Escala sobre valor absoluto del compuesto, no sobre variación interanual.** Spec 42/43 calculan Δ% year-over-year; Spec 44 codifica un rank discreto -3..+3. Spec 45 toma el valor del compuesto (0-100% en escala porcentual) y lo bucketea sobre la distribución empírica de los 17 países LB. La dirección "presión sube o baja" entre olas no se codifica en r1 — la lectura entre olas vive en el bloque "Lectura editorial" del drawer cuando hace falta y en las sparklines del bloque "Subindicadores".
2. **Indicador principal compuesto.** Spec 42/43 usaron un slug único del pipeline macro; Spec 44 usó un rank único del coding. Spec 45 calcula un promedio simple de 3 slugs LB en runtime. El compuesto vive en `lib/layers/presion.ts`, no en el JSON crudo. Las 3 dimensiones que lo componen quedan visibles en el drawer como subindicadores.
3. **`noData` estricto por período sin fallback `getLastWaveBefore`.** Spec 44 (viento) usó fallback "última semana publicada" porque la cadencia es alta (semanal) y el coding tiene laguna gradual. Spec 45 trata cada ola como una medición autocontenida — si el país no estuvo en la ola del slider (gap real de cobertura LB), render `noData` sin extrapolar. Más estricto epistemológicamente, coherente con el espíritu del proyecto ("desorientación epistemológica" hace daño si la propia capa cubre gaps con datos viejos).
4. **Etiqueta del bucket 0 = "Vacío institucional".** Más cargada que "sin cambio" (Spec 42), "Estancado" (Spec 43) o "Neutro" (Spec 44). Razón: la metáfora atmosférica "baja presión = aire enrarecido = aire que no se puede respirar = vacío" funciona literal, no requiere lectura editorial extra. La etiqueta absorbe la carga sin tornarse panfletaria — describe el clima, no acusa al gobierno.

**Metáfora climática.** La confianza ciudadana en las instituciones se lee como presión atmosférica: confianza alta = instituciones con peso, capaces de absorber tensión; confianza baja = aire enrarecido, instituciones que existen formalmente pero pierden gravedad. La metáfora es operativa: la decisión del bucket 0 = "Vacío institucional" la usa literal.

**Lo que entra en r1:**

- Implementación de `lib/layers/presion.ts` que cumple el contrato `Layer` de Spec 39, reemplazando el stub sintético con paleta diverging actual.
- Extensión de `lib/latinobarometro.ts` para soportar serie multi-ola (`getAvailableWaves()`, `getWaveByYear()`, `getCountryDataByWave()`).
- Indicador principal: **compuesto de confianza institucional** = promedio simple de `confianza-partidos`, `confianza-congreso`, `confianza-judicial` (3 indicadores del eje "Erosión de mediaciones" curados en Spec 12A). Calculado en runtime por país-ola.
- 4 subindicadores: los 3 que componen el principal (desagregados con sparklines) + `elecciones-fraudulentas` (eje Desorientación, `invertGood: true`).
- Escala secuencial intensidad: **5 buckets de confianza institucional** (0 a 4) sobre el valor absoluto del compuesto en escala porcentual.
- Paleta — tokens CSS `--mi-presion-0..4` — derivada del DS Grabado. Definición tentativa en §3.3, confirmación de hex final en Anexo A si Product Design lo ajusta.
- Glyph SVG custom **abierto en Anexo A** (decisión #15). Restricciones heredadas: no reusar ondas/sinusoides (consumido por viento); cuarto eje compositivo libre — vocabularios disponibles según README de glyphs: anillos/círculos concéntricos, barras, asterismos, contornos verticales más altos que el termómetro, eje vertical abierto.
- Reading guide markdown reescrito en `70-Producto/lecturas-capas/presion.md` con contenido editorial curado para los 3 países piloto (ARG, BRA, CHI) + introducción general que aplica a los 10 países LB del proyecto.
- Patrón A.4 cerrado (heredado de Spec 42 r2): tooltip mínimo en hover (~280px) con valor del compuesto y rango + reading drawer (~380px) con encabezado + bloque "Lectura" + bloque "Subindicadores" con 4 sparklines de 5 puntos (las 5 olas).
- Patrón B.4 cerrado (heredado de Spec 42 r2 sin tensión): mapa muestra solo magnitud del compuesto; el bloque "Dirección" de la leyenda se reinterpreta como bloque "Lectura" que describe cómo leer la escala (presión alta vs baja).
- Test fixture: con los 3 países piloto + 5 olas del JSON histórico, validar que el compuesto se calcula correctamente y que los gaps de cobertura por país-ola se manejan con `noData` estricto.

**Lo que NO entra en r1:**

- **Glyph SVG definitivo de presión** — abierto en Anexo A (decisión #15). Resuelve en r2.
- **Reading guide editorial completo de los 7 países no-piloto** (BO, CO, EC, PE, PY, UY, VE). Se completa en r3 después de validar el patrón visual con AR/BR/CL en producción.
- **Curación de las 4 olas históricas** — pendiente operativo declarado en frontmatter (~1 semana de trabajo análogo al build_indicators.py actual). No es parte del diseño de la spec.
- **Olas LB anteriores a 2018** (1995-2017) — fuera del horizonte de 5 años del epic (decisión 10 del epic).
- **Indicador de variación entre olas** (Δ% confianza vs ola previa) — la capa muestra valor absoluto del compuesto. La variación se ve en las sparklines del drawer, no en el color del polígono.
- **Subnacional Brasil/Argentina** — granularidad país (decisión 10 del epic).
- **Multi-capa simultánea** (presión + precipitación al mismo tiempo) — Spec 47.

---

## Estado actual

### Lo que ya existe (gracias a Specs 12A + 14A + 39 + 42 implementadas)

- `platform/data/latinobarometro-2024/indicators.json` versión `lb2024-v20250817` (computed_at 2026-05-09) con los 12 indicadores curados en Spec 12A para la ola 2024. Cobertura **10/10 países del proyecto, 12/12 indicadores cada uno, sin gaps en 2024**. Schema validado contra el informe oficial dentro de ±1pp.
- `platform/frontend/src/data/latinobarometro-2024/indicators.json` — copia sincronizada del JSON al frontend.
- `platform/frontend/src/lib/latinobarometro.ts` — lib con tipos `IndicatorCountryData`, `Indicator`, constantes `LB_META`, `INDICATORS`, `COVERED_COUNTRIES`, `AXIS_KEY_MAP` y helpers `getIndicatorsByAxis(axisKey)`, `getCountryData(indicator, slug)`, `getCountryIndicators(slug)`, `formatValue(indicator, value)`, `axisDisplayKey(rawAxis)`. **Toda la lib asume una sola ola**, sin tipos ni helpers para serie multi-ola.
- `lib/layers.ts` con contrato `Layer` extendido (`subIndicators?`, `editorialByCountry?`), `LayerSubIndicator` con `invertGood` y `getSeries(slug)`, y registry `LAYERS.presion` apuntando al stub actual.
- `lib/layers/presion.ts` es un **stub** de Spec 39: datos sintéticos para los 10 países en años 2021-2024 (inventados, no del pipeline real), 4 buckets con paleta diverging violeta-ocre-verde (no Grabado), sin subindicadores, sin `editorialByCountry`, sin tokens `--mi-presion-*`. Esta spec lo reescribe entero.
- `public/mapa/glyphs/presion.svg` existe pero como **placeholder lucide** (no es trazo Grabado ni respeta el viewBox 48×48 del sistema). Se reemplaza cuando Anexo A esté resuelto.
- `70-Producto/lecturas-capas/presion.md` existe como **esqueleto con placeholders** que arrastra el malentendido "Latinobarómetro no corre todos los años en todos los países, períodos disponibles 2021-2024" — describe el producto académico como si fuera el estado del pipeline. Esta spec reescribe el archivo entero.
- `70-Producto/design-system/mapa/glyphs/README.md` declara explícitamente: para Spec 45 (presión), no reusar ondas/sinusoides (consumido por viento). Vocabularios disponibles: anillos/círculos concéntricos, barras, asterismos, contornos verticales más altos que el termómetro, eje vertical abierto.

### Lo que NO existe todavía

- JSON histórico multi-ola: `platform/data/latinobarometro/indicators-historical.json` (o equivalente) con 5 olas (2018, 2020, 2021, 2023, 2024) en formato compatible con el schema actual. **Pendiente operativo declarado en frontmatter.**
- Tipos y helpers para serie multi-ola en `lib/latinobarometro.ts`.
- Implementación real de `presionLayer` (hoy el stub).
- Tokens CSS `--mi-presion-{0..4}` en `styles/layers.css`.
- Glyph definitivo `presion.svg` en el vault.
- Reading guide reescrito de presión (`70-Producto/lecturas-capas/presion.md`).

---

## Propuesta

### 1. Indicador principal y subindicadores

La capa expone **un indicador principal compuesto** y **cuatro subindicadores**.

| Rol | Slug / cómputo | Unidad | Cadencia primaria | Cadencia fallback | Cobertura prevista (post-pipeline histórico) | `invertGood` |
|---|---|---|---|---|---|---|
| **Principal** | **Compuesto "Confianza institucional"** = promedio simple de `confianza-partidos`, `confianza-congreso`, `confianza-judicial` por país-ola | % (0-100) | anual nativa (5 olas: 2018, 2020, 2021, 2023, 2024) | sin fallback — `noData` estricto si falta alguno de los 3 componentes para esa ola | 10/10 países del proyecto en olas con cobertura completa; gaps reales según calendario LB | n/a (la "dirección" del compuesto es la magnitud — alta vs baja confianza) |
| Subindicador 1 — partidos | `confianza-partidos` | % | anual (mismas 5 olas) | — | depende de gaps de LB por país-ola | false (más alto = mejor) |
| Subindicador 2 — congreso | `confianza-congreso` | % | anual (mismas 5 olas) | — | depende de gaps | false (más alto = mejor) |
| Subindicador 3 — judicial | `confianza-judicial` | % | anual (mismas 5 olas) | — | depende de gaps | false (más alto = mejor) |
| Subindicador 4 — elecciones fraudulentas | `elecciones-fraudulentas` | % | anual (mismas 5 olas) | — | depende de gaps | **true** (más alto = peor) |

**Por qué un compuesto y no un solo slug.** Decisión de Tomás 2026-05-21 (sesión de diseño): "presión institucional" como metáfora del epic no es una sola institución sino la **densidad agregada** de mediaciones. Tomar uno solo (ej. confianza-partidos, 17% regional) sesga la lectura hacia la institución más erosionada. El promedio simple de las 3 instituciones del eje "Erosión de mediaciones" curado en Spec 12A captura la magnitud agregada y deja las 3 dimensiones visibles en el drawer (con sparklines) para que el lector pueda inspeccionar qué institución está cargando más peso.

**Por qué `elecciones-fraudulentas` como 4° subindicador.** Decisión de Tomás 2026-05-21. Las opciones eran (a) `apoyo-democracia` del eje Desrepresentación, (b) `no-representado-parlamento` que se duplica conceptualmente con confianza-congreso, (c) `elecciones-fraudulentas` del eje Desorientación, (d) `aprobacion-gobierno` del eje Contexto. Se eligió (c) porque saca la mirada del cluster instituciones-formales y la lleva a "el suelo epistémico de la democracia": cuando la mayoría cree que las elecciones son fraudulentas, la confianza institucional pierde una pared portante. Es lectura más heterodoxa y rica narrativamente — compatible con el espíritu editorial del proyecto.

**Por qué el compuesto se calcula en runtime y no se pre-procesa al JSON.** Decisión técnica: mantener el JSON crudo (12 indicadores por ola, schema ya validado) sin agregar derivados. El compuesto es decisión del frontend que puede cambiar (ej. una iteración posterior podría ponderar por confiabilidad estadística o agregar un 4° indicador). Que viva en `lib/layers/presion.ts` lo hace inspectable y modificable sin re-correr el pipeline. Costo: cálculo mínimo en runtime (3 lecturas + promedio), negligible.

Lectura editorial vive en el reading guide markdown (§5). El código solo carga los 4 indicadores LB necesarios y calcula el compuesto por país-ola.

### 2. Modelo de tiempo y contrato Layer

El contrato `LayerPeriod` de Spec 39 permite cadencia mixta. Para presión:

- `cadence: "anual"` declarado en el `Layer`. Refleja la cadencia nativa de Latinobarómetro (LB no es anual estricto — hay años sin ola; el "anual" es intencional).
- `periods[]` se construye en runtime a partir de `getAvailableWaves()` de `lib/latinobarometro.ts` (helper nuevo que esta spec agrega). Cada ola del JSON histórico genera un `LayerPeriod`:
  - `{ key: "LB-2024", date: "2024-12-31", label: "Latinobarómetro 2024" }`
  - `{ key: "LB-2023", date: "2023-12-31", label: "Latinobarómetro 2023" }`
  - `{ key: "LB-2021", date: "2021-12-31", label: "Latinobarómetro 2021" }`
  - `{ key: "LB-2020", date: "2020-12-31", label: "Latinobarómetro 2020 · modo crisis COVID" }`
  - `{ key: "LB-2018", date: "2018-12-31", label: "Latinobarómetro 2018" }`
- `defaultPeriod` = última ola disponible (más reciente — al cierre del diseño, LB 2024).
- `getLastPeriodBefore(date)` recorre `periods[]` y devuelve el último `LayerPeriod` con `date ≤ date` — modelo de tiempo por capa de Spec 39.

**Comportamiento del slider entre olas.** Cuando el usuario mueve el slider a una fecha que cae entre dos olas (ej. 2022-06-15, entre LB 2021 y LB 2023):
- `getLastPeriodBefore` devuelve LB 2021.
- Para cada país, `getValueForCountry` retorna el compuesto de la ola activa (LB 2021), **no extrapola hacia 2022**.
- Países que no estuvieron en LB 2021 (gap real) renderean con `noData`, **sin fallback a LB 2018**. Esta es la divergencia local explícita (decisión #4 r1).
- La leyenda muestra explícitamente la ola activa (ej. "Latinobarómetro 2021") y los países en `noData` muestran tooltip "sin encuesta en LB 2021".

**Razón del `noData` estricto.** Spec 44 (viento) usó fallback "última semana publicada" porque la cadencia es alta (semanal) y el coding tiene laguna gradual previsible. Spec 45 trata cada ola LB como una medición autocontenida — usar fallback a una ola anterior cubriría visualmente un gap real con dato viejo, lo cual es deshonesto epistemológicamente y contradictorio con el espíritu del proyecto (la propia capa no debería "desorientar" tapando gaps). Si el país no estuvo en la ola activa, el `noData` lo dice.

### 3. Escala secuencial intensidad — 5 buckets sobre valor absoluto del compuesto

Mismo patrón que Spec 42/43 (escala secuencial intensidad, un solo tono) con **divergencia mayor**: los buckets se calculan sobre **valor absoluto del compuesto en escala porcentual**, no sobre variación interanual. Esto es la decisión #1 r1 documentada explícitamente abajo.

#### 3.1 Buckets

5 buckets del **valor absoluto del compuesto "Confianza institucional"** (promedio simple de las 3 confianzas), en escala porcentual 0-100%.

| `bucketIndex` | Magnitud | Rango de compuesto (%) | Label editorial |
|---|---|---|---|
| 0 | mínima | ≤ 15% | **"Vacío institucional"** (divergencia vs Spec 42/43/44) |
| 1 | leve | 15% – 25% | "Erosión profunda" |
| 2 | moderada | 25% – 35% | "Erosión visible" |
| 3 | fuerte | 35% – 45% | "Densidad media" |
| 4 | extrema | > 45% | "Densidad alta" |

**Divergencia local #1 — escala sobre valor absoluto del compuesto.** Mientras Spec 42/43 calculan buckets sobre variación interanual y Spec 44 sobre rank discreto, Spec 45 toma el valor absoluto del compuesto. Razón: LB es una encuesta de niveles (qué porcentaje confía hoy), no de variaciones. El valor 17% regional de confianza-partidos en 2024 dice algo sustantivo independiente de qué era ayer. La variación entre olas vive en las sparklines del drawer; el color del polígono codifica el estado actual.

**Divergencia local #2 — etiqueta del bucket 0 = "Vacío institucional".** Mientras Spec 42 etiquetó "sin cambio" (neutro), Spec 43 "Estancado" (carga latam activa) y Spec 44 "Neutro" (semanal sin movimiento), Spec 45 etiqueta el bucket más bajo como "Vacío institucional". Razón: la metáfora atmosférica "baja presión = aire enrarecido = vacío" funciona literal — no requiere lectura editorial extra. La etiqueta absorbe la carga sin tornarse panfletaria: describe el clima, no acusa al gobierno. Decisión confirmada por Tomás 2026-05-21.

**Calibración de rangos.** Las 3 confianzas LB tienen distribución regional baja: confianza-partidos 17% regional (top Uruguay 36%, bottom Colombia/Perú/Bolivia ~10%), confianza-congreso 24% (top UY 49%, bottom Perú 7%), confianza-judicial 28% (top El Salvador 51%, bottom Bolivia 13%). El promedio simple regional 2024 está alrededor de **23%** — cae en bucket 1 ("Erosión profunda"). Top país (Uruguay) probablemente en bucket 4 (~45%). Bottom (Colombia/Perú/Bolivia) en bucket 0 ("Vacío institucional", ~10-12%). Esta distribución cubre los 5 buckets razonablemente — sin bucket fantasma.

**Caveat de calibración.** Una vez curadas las 4 olas históricas (pre-requisito operativo), verificar la distribución empírica del compuesto a lo largo del tiempo. Si las olas más antiguas (2018) tienen sistemáticamente más confianza y el bucket 4 absorbe la mitad de los datapoints, conviene recalibrar en r2. Esta revisión queda agendada en Decisiones abiertas §5.

**Sin separación magnitud / dirección.** Spec 42/43/44 separan magnitud y dirección porque la variación tiene signo (mejora/caída). En Spec 45, la "dirección" del compuesto coincide con la magnitud — un valor 50% es "alta confianza, presión alta", un valor 10% es "vacío, presión baja". No hay dimensión separable. `LayerValue` no expone ni `direction()` ni un label como "+X mejora" — solo el valor y su categoría:

```ts
{
  raw: compuesto,                                  // 23.4 (% del promedio)
  formatted: `${compuesto.toFixed(1)}% confianza institucional`,
  bucketIndex: bucketOnCompuesto(compuesto),       // 0-4 según rango
  delta: deltaVsPrevWave,                          // opcional, para tooltip
  quality: worstQuality(qualities3),               // peor calidad de los 3 componentes
}
```

#### 3.2 Por qué no separar magnitud y dirección (divergencia local #3)

La separación magnitud + dirección de Spec 42/43/44 tiene sentido cuando la magnitud absoluta del valor es ambigua sin signo (un +3% puede ser bueno o malo dependiendo del contexto). En LB las confianzas son intuitivamente lineales: más confianza es más densidad institucional, menos es menos. La dirección NO existe como dimensión separada — está absorbida en el valor del compuesto. Forzar una separación crearía un artificio (ej. inventar "alta vs baja" como labels artificiales) y rompería la coherencia conceptual de la métrica.

#### 3.3 Paleta — tokens CSS (tentativa, confirma Anexo A)

Definición concreta de tokens, terracota base con 5 pasos de saturación. La paleta de presión **no replica los hex de precipitación, temperatura ni viento**: usa una variante levemente desplazada hacia el ladrillo oscuro (más "tierra apisonada que aire") para diferenciar las capas cuando estén visibles juntas (Spec 47).

```css
/* platform/frontend/src/styles/layers.css (extensión) */

:root {
  /* Escala secuencial presión — un solo tono, 5 pasos de saturación, sesgo ladrillo */
  --mi-presion-0: #e9d8d0;  /* bucket 0 · Vacío institucional — base lavada cálida */
  --mi-presion-1: #d9b4a5;  /* bucket 1 · Erosión profunda */
  --mi-presion-2: #c08274;  /* bucket 2 · Erosión visible */
  --mi-presion-3: #9c5240;  /* bucket 3 · Densidad media */
  --mi-presion-4: #6a3322;  /* bucket 4 · Densidad alta */

  /* Sin variantes direccionales — la capa no tiene dirección separada de magnitud.
     Los tokens existen como alias del base para consumo programático genérico desde LayerLegend. */
  --mi-presion-direccion-base: var(--mi-presion-2, currentColor);

  /* Sin dato — gris del DS. Importante en esta capa por el "noData estricto" de la decisión #4. */
  --mi-presion-nodata: var(--mi-ink-mute);

  /* Quality flag — congelado / estimado. LB 2020 modo crisis COVID se rendea con quality estimado
     porque el trabajo de campo se hizo en modo telefónico/online en lugar de presencial, lo cual
     altera levemente la comparabilidad. */
  --mi-presion-stale: var(--mi-paper-shade);
}
```

**Decisión tentativa — Anexo A confirma o ajusta:**

- Paleta ladrillo elegida porque (a) coherente con DS Grabado, (b) diferenciable de precipitación (terracota base), temperatura (terracota cálido) y viento (ocre profundo). La presión institucional como "tierra apisonada" tiene sentido metafórico: es densidad acumulada, no fluidez (precipitación) ni calor (temperatura) ni movimiento (viento). Product Design puede ajustar hex en Anexo A.
- Sin tokens `direccion-*` poblados — divergencia explícita vs el patrón de Spec 42/43/44 que mantienen alias direccionales aunque sean iguales al base. En presión, esta dimensión no existe.

### 4. Implementación de `presionLayer`

Esqueleto del módulo. Deriva del patrón Spec 42/43 con ajustes para serie multi-ola LB y compuesto en runtime:

```ts
// platform/frontend/src/lib/layers/presion.ts

import type { Layer, LayerPeriod, LayerValue, LayerSubIndicator, LayerQuality } from "../layers";
import {
  getAvailableWaves,       // NUEVO helper de lib/latinobarometro.ts
  getCountryDataByWave,    // NUEVO helper de lib/latinobarometro.ts
  type WaveYear,           // NUEVO tipo de lib/latinobarometro.ts
} from "../latinobarometro";

const PRINCIPAL_COMPONENTS = [
  "confianza-partidos",
  "confianza-congreso",
  "confianza-judicial",
] as const;

const SUBINDICADORES_EXTRA = [
  { slug: "elecciones-fraudulentas", label: "Elecciones fraudulentas", unit: "%", invertGood: true },
] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

export function bucketOnCompuesto(compuesto: number): number {
  if (compuesto <= 15) return 0;
  if (compuesto <= 25) return 1;
  if (compuesto <= 35) return 2;
  if (compuesto <= 45) return 3;
  return 4;
}

function worstQuality(qs: LayerQuality[]): LayerQuality {
  if (qs.includes("congelado")) return "congelado";
  if (qs.includes("estimado"))  return "estimado";
  return "oficial";
}

/** Computa el compuesto Confianza Institucional para un país en una ola.
 *  Devuelve null si falta cualquiera de los 3 componentes (noData estricto). */
function computeCompuesto(
  countrySlug: string,
  waveYear: WaveYear,
): { value: number; quality: LayerQuality } | null {
  const components = PRINCIPAL_COMPONENTS.map(slug =>
    getCountryDataByWave(slug, countrySlug, waveYear)
  );
  if (components.some(c => c === null)) return null; // noData estricto
  const value = components.reduce((sum, c) => sum + c!.value, 0) / components.length;
  // LB 2020 modo crisis → quality estimado; resto oficial.
  const quality: LayerQuality = waveYear === 2020 ? "estimado" : "oficial";
  return { value, quality };
}

// ── Construcción de períodos ──────────────────────────────────────────────────

function buildPeriods(): LayerPeriod[] {
  const waves = getAvailableWaves(); // [2018, 2020, 2021, 2023, 2024] (orden cronológico)
  return waves.map(year => ({
    key: `LB-${year}`,
    date: `${year}-12-31`,
    label: year === 2020
      ? "Latinobarómetro 2020 · modo crisis COVID"
      : `Latinobarómetro ${year}`,
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
      const waveYear = Number(period.key.replace("LB-", "")) as WaveYear;
      const dp = getCountryDataByWave(slug, countrySlug, waveYear);
      if (!dp) return null;
      return {
        raw: dp.value,
        formatted: `${dp.value.toFixed(1)}%`,
        bucketIndex: 0, // los subindicadores no se bucketean en r1 — el drawer los muestra como sparkline + valor
        quality: waveYear === 2020 ? "estimado" : "oficial",
      };
    },
    getSeries(countrySlug) {
      // 5 puntos (5 olas) en lugar de 8 de Spec 42/43 — divergencia menor
      const waves = getAvailableWaves();
      return waves.flatMap(year => {
        const dp = getCountryDataByWave(slug, countrySlug, year);
        if (!dp) return [];
        return [{
          key: `LB-${year}`,
          value: dp.value,
          quality: (year === 2020 ? "estimado" : "oficial") as LayerQuality,
        }];
      });
    },
  };
}

// ── Textos editoriales piloto (AR, BR, CL) ───────────────────────────────────

const EDITORIAL: Record<string, string> = {
  ar: "<TEXTO CURADO — pendiente de redacción editorial cuando las 4 olas históricas estén curadas y se vea la trayectoria real. Estructura sugerida: fase actual de la confianza institucional argentina (compuesto y desagregado), comportamiento típico de las 3 confianzas, lectura cruzada con elecciones-fraudulentas (en AR 2024: 73% creen fraudulentas, dato muy alto para una democracia con tradición electoral), comentario sobre la divergencia partidos vs judicial.>",
  br: "<TEXTO CURADO — Brasil suele mostrar baja confianza institucional con alta polarización. Estructura sugerida: confianza-partidos en mínimos históricos, confianza-congreso fluctuante, judicial cargada por causas Lava Jato y STF. Lectura cruzada con elecciones-fraudulentas en context post-2018.>",
  cl: "<TEXTO CURADO — Chile como ancla regional pero con erosión post-2019. Estructura sugerida: confianza institucional alta pre-2019, caída fuerte con el estallido social, parcial recuperación. Lectura comparativa con apoyo-democracia (Chile 60%, top 4) y baja percepción de elecciones fraudulentas (Chile 16%, bottom 1 — caso atípico positivo).>",
};

// ── Layer ─────────────────────────────────────────────────────────────────────

const PERIODS = buildPeriods();

export const presionLayer: Layer = {
  id: "presion",
  label: "Presión · densidad institucional",
  shortLabel: "Presión",
  glyphSrc: "/mapa/glyphs/presion.svg",
  category: "institucional",
  description: "La densidad simbólica de las instituciones democráticas. Presión alta = instituciones con peso, capaces de mediar la vida colectiva; presión baja = aire enrarecido, vacío institucional. Compuesto = promedio simple de confianza en partidos, congreso y poder judicial (Latinobarómetro).",
  unit: "% promedio de confianza institucional (Latinobarómetro)",
  cadence: "anual",

  legend: {
    type: "continuous",
    buckets: [
      { bucketIndex: 0, label: "Vacío institucional",  color: "var(--mi-presion-0)", rangeDescription: "compuesto ≤ 15%" },
      { bucketIndex: 1, label: "Erosión profunda",     color: "var(--mi-presion-1)", rangeDescription: "15% < compuesto ≤ 25%" },
      { bucketIndex: 2, label: "Erosión visible",      color: "var(--mi-presion-2)", rangeDescription: "25% < compuesto ≤ 35%" },
      { bucketIndex: 3, label: "Densidad media",       color: "var(--mi-presion-3)", rangeDescription: "35% < compuesto ≤ 45%" },
      { bucketIndex: 4, label: "Densidad alta",        color: "var(--mi-presion-4)", rangeDescription: "compuesto > 45%" },
    ],
    noDataColor: "var(--mi-presion-nodata, #5C6638)",
    qualityFlagColor: "var(--mi-presion-stale, #C8B894)",
  },

  source: {
    name: "Latinobarómetro 2018–2024 (5 olas curadas, Spec 12A)",
    url: "https://www.latinobarometro.org/",
    publishedDate: "2026-05-09", // se actualiza al hidratar las 4 olas históricas
    lastFetched: "2026-05-09",
  },

  periods: PERIODS,
  defaultPeriod: PERIODS[PERIODS.length - 1],

  getValueForCountry(countrySlug, period): LayerValue | null {
    const waveYear = Number(period.key.replace("LB-", "")) as WaveYear;
    const compuesto = computeCompuesto(countrySlug, waveYear);
    if (!compuesto) return null; // noData estricto por país-ola
    // Delta vs ola previa (opcional para tooltip)
    const waves = getAvailableWaves();
    const prevYear = waves[waves.indexOf(waveYear) - 1];
    const prevCompuesto = prevYear ? computeCompuesto(countrySlug, prevYear) : null;
    const delta = prevCompuesto ? compuesto.value - prevCompuesto.value : undefined;
    return {
      raw: compuesto.value,
      formatted: `${compuesto.value.toFixed(1)}% confianza institucional`,
      bucketIndex: bucketOnCompuesto(compuesto.value),
      delta,
      quality: compuesto.quality,
    };
  },

  getLastPeriodBefore(date): LayerPeriod | null {
    const sorted = [...PERIODS].sort((a, b) => b.date.localeCompare(a.date));
    return sorted.find(p => p.date <= date) ?? null;
  },

  readingGuideSlug: "presion",

  subIndicators: [
    makeSubIndicator("confianza-partidos",      "Partidos",                 "%", false),
    makeSubIndicator("confianza-congreso",      "Congreso",                 "%", false),
    makeSubIndicator("confianza-judicial",      "Poder judicial",           "%", false),
    makeSubIndicator("elecciones-fraudulentas", "Elecciones fraudulentas",  "%", true),
  ],

  editorialByCountry: EDITORIAL,
};
```

Las funciones helper (`bucketOnCompuesto`, `worstQuality`, `computeCompuesto`, `buildPeriods`, `makeSubIndicator`) quedan en el mismo archivo y los tests les apuntan directo.

**Diferencias estructurales vs `precipitacion.ts`, `temperatura.ts` y `viento.ts`:**

- Importa de `lib/latinobarometro.ts` (extendido para multi-ola), no de `lib/macro-indicators.ts` ni `lib/viento.ts`.
- `buildPeriods` opera sobre `getAvailableWaves()` (lista de años de ola), no sobre series trimestrales/mensuales ni semanales.
- `getValueForCountry` computa el compuesto en runtime, no lee un dato directo.
- `noData` estricto sin fallback `getLastWaveBefore` — divergencia local #4.
- `subIndicators.getSeries` devuelve hasta 5 puntos (las 5 olas) en lugar de 8 trimestres/años.
- `quality` se calcula desde `worstQuality` de los 3 componentes; `LB 2020` siempre `"estimado"` por modo COVID.

### 5. Reading guide markdown (reescritura completa)

El archivo actual `70-Producto/lecturas-capas/presion.md` se reescribe entero. La estructura definitiva:

```markdown
---
layer: presion
title: Presión · densidad institucional
last_updated: 2026-05-21
---

# Presión

Una frase de entrada con la metáfora barométrica. Por qué la confianza ciudadana en las instituciones se lee como presión atmosférica: alta presión = instituciones con peso simbólico capaces de mediar la vida colectiva; baja presión = aire enrarecido, instituciones que existen formalmente pero pierden gravedad. Conexión con el eje "Erosión de mediaciones".

## Cómo se lee

- Qué representa el color (valor absoluto del compuesto "Confianza institucional" = promedio simple de confianza en partidos, congreso y poder judicial).
- Por qué los 5 buckets cargan etiqueta editorial fuerte ("Vacío institucional", "Erosión profunda", "Erosión visible", "Densidad media", "Densidad alta"): la metáfora barométrica funciona literal — no hay neutralidad cuando la mayoría no confía.
- Qué representa cada ola del slider (las 5 olas curadas de Latinobarómetro: 2018, 2020, 2021, 2023, 2024). LB 2020 se hizo en modo crisis COVID (trabajo de campo telefónico/online) — la capa lo marca como `quality: estimado`.
- Por qué la capa NO usa fallback "última ola anterior con dato" cuando hay un gap real de cobertura LB. Si Bolivia no estuvo en LB 2018, el país se renderea como `noData`, sin extrapolar — coherente con el espíritu del proyecto (la propia capa no debería desorientar tapando gaps).

## Subindicadores

- **Partidos** (`confianza-partidos`) — la institución peor evaluada de toda la región. 17% regional 2024.
- **Congreso** (`confianza-congreso`) — 24% regional 2024.
- **Poder judicial** (`confianza-judicial`) — 28% regional 2024. Captura la dimensión "justicia para ricos vs pobres" que el informe LB destaca.
- **Elecciones fraudulentas** (`elecciones-fraudulentas`) — `invertGood: true` (más alto = peor). 61% regional 2024 — 12 de 17 países LB tienen mayoría que considera las elecciones fraudulentas. Cuando se erosiona la creencia en el mecanismo electoral, se pierde el suelo epistémico de la democracia. Sumar este 4° subindicador hace visible esa fragilidad.

## Lectura por país (piloto r1)

### Argentina
<TEXTO CURADO — pendiente de redacción editorial cuando las 4 olas históricas estén curadas. Estructura sugerida: fase actual de la confianza institucional argentina (compuesto y desagregado en las 3 confianzas), comportamiento histórico, lectura cruzada con elecciones-fraudulentas (AR 2024: ~73% creen fraudulentas — dato muy alto para una democracia con tradición electoral fuerte).>

### Brasil
<TEXTO CURADO — Brasil suele mostrar baja confianza institucional con alta polarización. Estructura sugerida: confianza-partidos en mínimos históricos, confianza-congreso fluctuante, judicial cargada por causas Lava Jato y STF. Lectura cruzada con elecciones-fraudulentas post-2018.>

### Chile
<TEXTO CURADO — Chile como ancla regional pero con erosión post-2019. Estructura sugerida: confianza institucional alta pre-2019, caída fuerte con el estallido social, parcial recuperación. Caso atípico: baja percepción de elecciones fraudulentas (16%, bottom 1 regional).>

## Otros países

> Lectura curada pendiente para Bolivia, Colombia, Ecuador, Paraguay, Perú, Uruguay, Venezuela. El compuesto y los 4 subindicadores están disponibles en el mapa para los 10 países LB del proyecto (con cobertura dependiente de la presencia de cada país en cada ola); la lectura editorial se completa en r3.

Países con gaps de cobertura LB notables (verificar al curar las 4 olas históricas):
- Bolivia: ausencia en algunas olas anteriores a 2018 (irrelevante para este horizonte).
- Venezuela: presencia en todas las olas pero `quality: estimado` desde 2018 por dificultades de trabajo de campo.

## Fuente y método

- Indicador principal: compuesto "Confianza institucional" = promedio simple de los 3 indicadores LB del eje "Erosión de mediaciones" (Spec 12A): confianza-partidos, confianza-congreso, confianza-judicial.
- 4° subindicador: elecciones-fraudulentas (eje Desorientación epistemológica).
- Pipeline: `latinobarometro-v1.0.0` multi-ola (5 olas curadas: 2018, 2020, 2021, 2023, 2024).
- Cadencia expuesta al slider: anual, una entrada por ola disponible.
- Cobertura: 10/10 países del proyecto LB (los 17 países LB incluyen 7 países fuera del horizonte: CR, DO, MX, SV, GT, HN, PA).
- Último refresh: ver leyenda del mapa.

## Limitaciones

- LB es una encuesta de niveles, no de variaciones — el color del polígono codifica el estado actual del compuesto, no su evolución. La evolución vive en las sparklines del bloque "Subindicadores" del drawer.
- LB 2020 se hizo en modo crisis COVID (trabajo de campo telefónico/online). La capa lo marca con `quality: estimado` y la leyenda lo aclara explícitamente. La comparabilidad con olas anteriores/posteriores no es perfecta.
- LB 2018 puede tener gaps específicos por país (verificar al curar). La capa muestra `noData` estricto, sin fallback a ola previa — decisión deliberada documentada en §3.
- El compuesto promedio simple es una decisión metodológica: pondera igual partidos (17% regional, más erosionado), congreso (24%) y judicial (28%). Una ponderación distinta cambiaría los buckets; el código permite cambiarla sin re-correr el pipeline.
- Buckets calibrados sobre la distribución empírica regional 2024. Si las olas más antiguas (2018, 2021) tienen sistemáticamente más confianza, conviene recalibrar en r2.
- "Elecciones fraudulentas" como 4° subindicador es decisión editorial (sumar una mirada heterodoxa al cluster instituciones-formales). Otras opciones consideradas: `apoyo-democracia`, `no-representado-parlamento`, `aprobacion-gobierno`. Ver §1 de la spec.
```

### 6. Patrón de subindicadores — el plano técnico

Heredado del contrato `LayerSubIndicator` ya implementado por Spec 42 en `lib/layers.ts`. Esta spec lo consume sin modificar el contrato.

Diferencias operativas vs Spec 42/43:

- **Sparklines de 5 puntos en lugar de 8.** Latinobarómetro tiene 5 olas curadas. `getSeries` devuelve hasta 5 puntos. El componente `LayerReadingDrawer` debe soportar variar el número de puntos (probable que ya lo haga vía contrato `LayerSubIndicator.getSeries(slug)` que devuelve array de longitud variable).
- **3 subindicadores con `invertGood: false`** (partidos, congreso, judicial — más alto = mejor) + **1 con `invertGood: true`** (elecciones-fraudulentas). Patrón análogo a Spec 43 (3 invierten + 1 no invierte), pero con el signo opuesto.
- **3 de los 4 subindicadores son componentes del principal compuesto.** El drawer muestra los 3 desagregados — el lector puede ver cuál institución está cargando más peso del compuesto. El 4° (elecciones-fraudulentas) es la mirada externa al cluster.

### 7. Cobertura editorial — piloto vs no-piloto

| Plano | 3 países piloto (AR, BR, CL) | 7 países restantes (BO, CO, EC, PE, PY, UY, VE) |
|---|---|---|
| Color de la capa en el mapa | Renderizado con compuesto real (cuando 3 componentes disponibles en la ola activa) | Renderizado con compuesto real |
| Hover / tooltip con valor compuesto | Sí | Sí |
| Subindicadores en drawer (4 sparklines de 5 puntos cada una) | Sí, con valor real (excepto cuando el país tiene gap en una ola → `sin dato` en esa entrada de la sparkline) | Sí, con valor real |
| Reading drawer largo (al click) — bloque "Lectura" curado | Texto curado editorialmente | Texto mínimo: "Lectura editorial pendiente — ver introducción de la capa" + link a `presion.md` |
| Reading guide markdown (`presion.md`) | Sección curada con contexto histórico, lectura de subindicadores | Mención en sección "Otros países" como pendiente |

**Por qué Argentina, Brasil, Chile específicamente.** Mismos motivos que Spec 42 y Spec 43 (consistencia entre capas + polos extremos + ancla de estabilidad + cobertura editorial preexistente en `15-Países/`). Confirmado por Tomás 2026-05-21. Notable para esta capa específicamente:

- **AR** — caso atípico de confianza alta en algunas instituciones (CSJN 2024) con desconfianza profunda en otras (partidos). Apoyo-democracia top regional (75%). Elecciones-fraudulentas muy alto (~73%) — combinación tensa.
- **BR** — confianza estructuralmente baja con alta polarización pos-2018. Patrón "Lava Jato sigue presente en el imaginario" relevante.
- **CL** — ancla regional pre-2019, caída fuerte con estallido social, recuperación parcial. Único país de la región con baja percepción de elecciones fraudulentas (16%, bottom 1).

---

## Archivos a tocar

| Archivo | Acción |
|---|---|
| `platform/data/latinobarometro-2024/` | RENOMBRAR a `platform/data/latinobarometro/` (sin sufijo de año) — refleja que el pipeline ahora es multi-ola, no exclusivo de 2024 |
| `platform/data/latinobarometro/build_indicators.py` | EXTENDER para soportar iteración multi-ola. Schema del output cambia a `{ version, computed_at, n_countries_per_wave, waves: [{ year, n_total, indicators: [...] }] }`. Pre-requisito operativo declarado en frontmatter |
| `platform/data/latinobarometro/raw/` | EXTENDER con CSVs de 2018, 2020, 2021, 2023 (pre-requisito operativo — gitignored como el 2024) |
| `platform/data/latinobarometro/indicators-historical.json` | NUEVO — output del pipeline multi-ola. ~150 KB estimado (12 indicadores × 17 países × 5 olas) |
| `platform/frontend/src/data/latinobarometro/indicators-historical.json` | NUEVO — copia sincronizada del JSON multi-ola al frontend |
| `platform/frontend/src/lib/latinobarometro.ts` | EXTENDER — agregar tipos `WaveYear`, `Wave`, helpers `getAvailableWaves()`, `getWaveByYear(year)`, `getCountryDataByWave(slug, country, year)`. Mantener helpers actuales (`getIndicatorsByAxis`, etc.) operando sobre la última ola por default |
| `platform/frontend/src/lib/layers/presion.ts` | REESCRIBIR — reemplaza el stub sintético con la implementación descripta en §4 |
| `platform/frontend/src/styles/layers.css` | EXTENDER — agregar tokens `--mi-presion-*`. Si Spec 42/43/44 todavía no crearon el archivo en VS Code (probable), Spec 45 lo crea inicializándolo con los tokens de las cuatro capas |
| `70-Producto/design-system/mapa/glyphs/presion.svg` | NUEVO — SSOT en vault, entregable de la sesión de Product Design del Anexo A |
| `platform/frontend/public/mapa/glyphs/presion.svg` | REEMPLAZAR — placeholder lucide actual por la copia sincronizada del vault una vez resuelto Anexo A |
| `70-Producto/design-system/mapa/glyphs/README.md` | ACTUALIZAR — marcar `presion.svg` como activo con eje compositivo elegido (cuarto del sistema) |
| `70-Producto/lecturas-capas/presion.md` | REESCRIBIR — el esqueleto actual arrastra el malentendido sobre Latinobarómetro como producto académico; estructura definitiva en §5 |

---

## Criterios de aceptación

| # | Criterio | Verificación |
|---|---|---|
| AC1 | `presionLayer` cumple el contrato `Layer` de Spec 39 (typecheck pasa) | `tsc --noEmit` |
| AC2 | **Condicional al pre-requisito operativo:** con `indicators-historical.json` curado para las 5 olas, los 10 países del proyecto renderizan con color de bucket correcto para al menos una ola (LB 2024 ya disponible) | Smoke test: activar capa, inspeccionar fill de los 10 polígonos para LB 2024 |
| AC3 | Sin el pipeline histórico hidratado (estado actual), la capa renderiza solo LB 2024 con datos reales y los demás períodos vacíos. El `defaultPeriod` queda en LB 2024. La leyenda muestra "5 olas declaradas, 1 curada (2024)" hasta que el pre-requisito esté cerrado | Mock el JSON con solo wave 2024 → verificar render |
| AC4 | `getValueForCountry` retorna valor formateado con `% confianza institucional` (ej. `23.4% confianza institucional`). Sin signo, sin label "mejora/caída" — divergencia explícita vs Spec 42/43 | Test unitario con fixtures de compuestos conocidos |
| AC5 | `bucketOnCompuesto(10) === 0`, `bucketOnCompuesto(20) === 1`, `bucketOnCompuesto(30) === 2`, `bucketOnCompuesto(40) === 3`, `bucketOnCompuesto(50) === 4` | Test unitario |
| AC6 | `computeCompuesto("ar", 2024)` calcula el promedio simple de los 3 componentes para Argentina en LB 2024 con tolerancia ±0.1pp | Test unitario con fixture real del JSON ola 2024 |
| AC7 | `computeCompuesto("xx", 2018)` devuelve `null` cuando alguno de los 3 componentes del compuesto no está disponible — `noData` estricto, sin fallback a otra ola | Test unitario con fixture donde 1 de 3 componentes es `null` |
| AC8 | `buildPeriods()` produce 5 `LayerPeriod` con keys `LB-2018`, `LB-2020`, `LB-2021`, `LB-2023`, `LB-2024`. El label de LB-2020 incluye "modo crisis COVID" | Test unitario |
| AC9 | `getLastPeriodBefore("2022-06-15")` devuelve la `LayerPeriod` `LB-2021` (la última ≤ esa fecha) | Test unitario |
| AC10 | `subIndicators` expone los 4 indicadores con `getValueForCountry` y `getSeries` funcionales. `invertGood` correcto: confianza-partidos/congreso/judicial = false, elecciones-fraudulentas = true | Test unitario: cada subindicador devuelve valor para AR-2024 y series de hasta 5 puntos |
| AC11 | Reading guide markdown se renderiza correctamente en el drawer para ARG, BRA, CHI | Click en AR → drawer muestra sección "Argentina" con texto curado |
| AC12 | Para los 7 países no-piloto, el drawer muestra el mensaje genérico + link a la intro | Click en BO → drawer dice "Lectura editorial pendiente" + link |
| AC13 | Cuando un país no estuvo en la ola activa del slider, el polígono renderea con `noData` color y el tooltip muestra "sin encuesta en Latinobarómetro {year}" — sin fallback a ola previa | Mock un país sin entry en LB 2018 → inspeccionar render y tooltip |
| AC14 | LB 2020 se rendea con quality flag `--mi-presion-stale` overlay sutil; tooltip incluye "modo crisis COVID" | Mover slider a LB 2020 → inspeccionar quality flag |
| AC15 | Glyph SVG `presion.svg` definitivo entregado por Product Design (decisión #15 del Anexo A) en viewBox 48×48, `currentColor`, trazo Grabado. SSOT en `70-Producto/design-system/mapa/glyphs/presion.svg`. Frontend lee la copia sincronizada en `platform/frontend/public/mapa/glyphs/presion.svg`. El glyph usa un eje compositivo NO usado por las otras 3 capas (no horizontal cerrado, no vertical cerrado, no horizontal abierto), y NO reusa el vocabulario de ondas/sinusoides consumido por viento | Inspect DOM del LayerController + diff binario `vault ↔ public/` |
| AC16 | Tokens CSS `--mi-presion-{0..4}` están definidos y el contraste con `--mi-paper` cumple WCAG AA para texto sobre fill | Lighthouse / contrast checker |
| AC17 | Sparklines del drawer renderizan hasta 5 puntos por subindicador (en lugar de los 8 de Spec 42/43); cuando un país tiene gap en una ola, esa entrada se omite de la sparkline (no se rendea como cero) | Click en AR → drawer muestra 4 sparklines, cada una con 5 puntos máx; click en un país con gap → sparklines con menos puntos |
| AC18 | El compuesto principal NO tiene direction "mejora/caída" — el formatted del tooltip es solo `XX.X% confianza institucional` sin label adicional. La leyenda no incluye bloque "Dirección" — divergencia explícita vs Spec 42/43/44, en su lugar incluye un bloque "Lectura" que describe cómo leer la escala (presión alta vs baja) | Inspección visual: hover sobre BR muestra `XX.X% confianza institucional`; leyenda muestra bloque "Lectura" con texto "presión alta = instituciones con peso; presión baja = aire enrarecido" |

AC2 queda **condicional al pre-requisito operativo** (curación de las 4 olas históricas). AC3 cubre el comportamiento del frontend mientras el pipeline aún no está hidratado. AC15 queda abierto hasta Anexo A r2. El resto cierra en la sesión VS Code.

---

## Edge cases

- **País sin entry en la ola activa** (gap real de cobertura LB) → `computeCompuesto` retorna `null`. Render: fill con `noDataColor`. Tooltip: "sin encuesta en Latinobarómetro {year}". **Sin fallback a ola previa** — divergencia local #4.
- **País con entry pero falta uno de los 3 componentes del compuesto** (raro, pero técnicamente posible si el cuestionario LB de esa ola no incluyó la pregunta para ese país) → `computeCompuesto` retorna `null`. Mismo render que el caso anterior, tooltip más específico: "componente faltante (partidos/congreso/judicial)".
- **Compuesto en frontera entre buckets** — un valor de exactamente 15% cae en bucket 0 (`Vacío institucional`, regla `≤`). Documentado en el reading guide.
- **LB 2020 (modo crisis COVID)** → quality `"estimado"` global. Polígonos renderizados con overlay `--mi-presion-stale` sutil. Tooltip incluye "modo crisis COVID". La comparabilidad de las sparklines con olas previas/posteriores no es perfecta — el reading guide lo documenta.
- **Valor del compuesto con `NaN`** (caso teórico si los componentes son strings inválidos) → tratamiento idéntico a "sin dato". El typecheck del JSON debería prevenirlo.
- **Período pre-2018** → slider lo bloquea con el `start` del rango global de capas (Spec 39, decisión 10 del epic: profundidad 5 años desde 2021 — pero LB 2018 es la ola anterior más cercana, se incluye en el rango efectivo).
- **Cambio de pipeline version** (lb2024-v20250817 → lb-historical-v1.0.0) → la spec asume schema multi-ola estable. Si cambia, esta spec re-vasalla en r2.
- **País fuera del proyecto pero presente en LB** (CR, DO, MX, SV, GT, HN, PA) → el JSON los incluye pero `presionLayer.getValueForCountry` solo se llama desde el componente del mapa para los 10 países del proyecto. Los datos extra del JSON no se usan en r1 (forward-compatible si el proyecto se expande a Centroamérica).
- **Sparkline con un solo punto** (país que solo estuvo en una ola) → el componente de sparkline debe renderear "dot único" en lugar de línea (mostrar el valor disponible con una marca, no una línea de un punto). Esto es responsabilidad del LayerReadingDrawer, no de esta spec.
- **Ola activa LB 2020 + país que SÍ estuvo pero con `quality: estimado`** → render del fill con bucket correspondiente al compuesto + overlay quality flag. El compuesto se calcula igual; solo el quality cambia.

---

## Decisiones tomadas

### Cerradas en r1 (sesión 2026-05-21)

| # | Tema | Decisión | Razón |
|---|---|---|---|
| 1 | Alcance temporal | **Pre-requisito operativo: curar 4 olas históricas (2018, 2020, 2021, 2023)** además de la 2024 ya hidratada. ~1 semana de trabajo en el pipeline `latinobarometro/` análogo al `build_indicators.py` actual | Tomás eligió "serie histórica completa (5+ olas)" en sesión 2026-05-21. Habilita sparklines reales en el drawer (5 puntos por subindicador) + lectura comparativa entre olas. El pre-requisito operativo es análogo a los de Spec 43 (hidratar c7 contra OIT) y Spec 44 (cobertura mínima de coding). Bloquea el handoff a VS Code, no el diseño |
| 2 | Indicador principal | **Compuesto "Confianza institucional"** = promedio simple de `confianza-partidos` + `confianza-congreso` + `confianza-judicial`, calculado en runtime por país-ola | Tomás eligió "Compuesto: confianza institucional" en sesión 2026-05-21. Alineado con la decisión 6 del epic (presión = índices de Latinobarómetro). El cluster "Erosión de mediaciones" de Spec 12A materializa exactamente la metáfora "presión institucional" — no inventa metodología nueva |
| 3 | Subindicadores | **4 subindicadores**: los 3 que componen el principal (desagregados) + `elecciones-fraudulentas` (eje Desorientación epistemológica). `invertGood` correcto por subindicador: partidos/congreso/judicial = false, elecciones-fraudulentas = true | Tomás eligió "elecciones-fraudulentas" como 4° en sesión 2026-05-21. La elección saca la mirada del cluster instituciones-formales y la lleva a "el suelo epistémico de la democracia" — heterodoxa pero rica narrativamente, compatible con el espíritu editorial del proyecto |
| 4 | Tipo de escala | **Secuencial intensidad** (un solo tono, más oscuro = más extremo) sobre **valor absoluto del compuesto** en escala porcentual. NO sobre variación interanual — divergencia local #1 vs Spec 42/43; NO sobre rank discreto — divergencia local #1 vs Spec 44 | LB es una encuesta de niveles (qué porcentaje confía hoy), no de variaciones. El valor 17% regional de confianza-partidos dice algo sustantivo independiente de qué era ayer. La variación entre olas vive en las sparklines del drawer; el color del polígono codifica el estado actual de la presión |
| 5 | Buckets de magnitud | **5 buckets** sobre el compuesto (`≤15%`, `15-25%`, `25-35%`, `35-45%`, `>45%`). Cobertura empírica de la distribución regional 2024 (compuesto medio ~23%, top UY ~45%, bottom Colombia/Perú/Bolivia ~10%) cubre los 5 buckets sin fantasmas | Calibración tentativa basada en la distribución 2024. Caveat: una vez curadas las 4 olas históricas, verificar la distribución empírica completa — si las olas más antiguas tienen sistemáticamente más confianza y el bucket 4 absorbe la mitad de los datapoints, recalibrar en r2 |
| 6 | Etiqueta del bucket 0 | **"Vacío institucional"** — divergencia local #2 vs Spec 42 ("sin cambio"), Spec 43 ("Estancado"), Spec 44 ("Neutro") | Tomás eligió "Vacío institucional" en sesión 2026-05-21. La metáfora atmosférica "baja presión = aire enrarecido = vacío" funciona literal — no requiere lectura editorial extra. La etiqueta absorbe la carga sin tornarse panfletaria: describe el clima, no acusa al gobierno |
| 7 | Labels de los demás buckets | "Erosión profunda" (1), "Erosión visible" (2), "Densidad media" (3), "Densidad alta" (4). Los buckets 1 y 2 cargan vocabulario del eje "Erosión de mediaciones"; los buckets 3 y 4 cargan el contrapeso "densidad" como metáfora positiva de presión institucional alta | Coherente con el lenguaje del eje conceptual de Spec 14A y con la métaphora barométrica. Decisión local de Spec 45 que escala la carga semántica del bucket 0 al resto de la escala |
| 8 | Paleta | Terracota con sesgo ladrillo oscuro, 5 pasos de saturación (`--mi-presion-0..4`). Hex tentativos en §3.3; Product Design confirma en Anexo A | Coherente con DS Grabado. Diferenciable de precipitación (terracota base), temperatura (terracota cálido) y viento (ocre profundo). La presión institucional como "tierra apisonada" tiene sentido metafórico: densidad acumulada, no fluidez ni calor ni movimiento |
| 9 | Cobertura editorial r1 | Piloto **AR/BR/CL** (igual que Spec 42 y Spec 43, no AR-solo como Spec 44). El JSON LB 2024 tiene cobertura 10/10 países; sin razón operativa para acortar el piloto editorial | Tomás eligió "AR/BR/CL como Spec 42 y Spec 43" en sesión 2026-05-21. Spec 44 acortó a AR solo por realidad del coding manual — acá no hay realidad operativa que justifique. Consistencia entre capas estructurales (precipitación, temperatura, presión) |
| 10 | Cobertura técnica r1 | Los 10 países LB del proyecto renderizan con compuesto real (cuando 3 componentes disponibles) una vez cumplido el pre-requisito operativo. Sin distinción piloto/no-piloto a nivel técnico (igual que Spec 42/43) | Datos disponibles 10/10 en LB 2024. Forzar "color solo para piloto" sería desperdiciar la cobertura y crear discontinuidad UX |
| 11 | Cadencia | `cadence: "anual"` declarado. Slider anual nativo, períodos construidos desde `getAvailableWaves()`. **Sin fallback `getLastWaveBefore`** — divergencia local #4 | Decisión 8 del epic (modelo de tiempo por capa). LB es anual nativa (con gaps específicos). El `noData` estricto evita extrapolar visualmente entre olas |
| 12 | Manejo de gaps | **`noData` estricto** por país-ola. Si el país no estuvo en la ola del slider, render `noData` sin fallback a ola previa — divergencia local #4 vs el patrón Spec 44 (que sí usó `getLastVientoBeforeWeek`) | Tomás eligió "noData estricto por período" en sesión 2026-05-21. LB es una encuesta de niveles; usar dato de una ola anterior cubriría visualmente un gap real con dato viejo (dato de 2018 mostrado como si fuera 2021). Inadecuado epistemológicamente y contradictorio con el espíritu del proyecto |
| 13 | B.4 (dirección visual) | **Hereda intacto de Spec 42 r2** — color codifica solo magnitud. **NO diverge como Spec 44**: no hay una "dirección" auxiliar separable de la magnitud (alta confianza ↔ baja confianza es lectura monodimensional). La leyenda no incluye bloque "Dirección" — en su lugar incluye un bloque "Lectura" que describe cómo leer la escala. Reformulación local del patrón B.4 vs Spec 42/43 que mantienen bloque "Dirección" | Decisión cerrada por análisis del modelo conceptual: la "presión" en la metáfora barométrica es siempre magnitud, sin signo. Forzar un bloque "Dirección" sería un artificio. Esta NO es divergencia del patrón B.4 sino reformulación local del componente "Dirección" de la leyenda — el principio de B.4 (color = solo magnitud) se hereda íntegro |
| 14 | Patrón A.4 — tooltip + drawer | Heredado intacto de Spec 42 r2: tooltip mínimo (~280px) con valor compuesto + drawer (~380px) con encabezado + bloque "Lectura" + bloque "Subindicadores" con 4 sparklines de hasta 5 puntos (las 5 olas) cada una. Una sparkline con `invertGood: true` (elecciones-fraudulentas) — coloreada según convención del DS heredada | Coherencia con Spec 42/43/44 a nivel de jerarquía visual. La única diferencia operativa: 5 puntos máx en lugar de 8 |

### Decisiones técnicas implícitas (cerradas por consecuencia)

Estas son consecuencias mecánicas de las decisiones grandes; no son decisiones nuevas sino derivadas. Se documentan para que sean revisables explícitamente:

- **Quality flag de LB 2020.** Todas las entradas de la ola 2020 se rendean con `quality: "estimado"` por el modo crisis COVID (trabajo de campo telefónico/online en lugar de presencial). El overlay `--mi-presion-stale` sutil + tooltip explícito comunican la limitación. LB no marca explícitamente esta ola como "estimado" en su microdato, pero el informe oficial 2020 sí lo documenta — la spec lo recoge.
- **Compuesto en runtime, no pre-procesado.** El compuesto vive en `lib/layers/presion.ts`. Cambiar la ponderación o agregar/quitar componentes no requiere re-correr el pipeline. El JSON crudo sigue siendo los 12 indicadores LB.
- **`getValueForCountry` y `subIndicators[i].getValueForCountry` consumen del mismo helper `getCountryDataByWave`.** El principal lo usa para calcular el compuesto; los subindicadores lo usan para devolver el valor desagregado. Caching es responsabilidad del componente del frontend, no de la spec.
- **`subIndicators[i].getSeries` devuelve hasta 5 puntos.** En lugar de los 8 trimestres/años de Spec 42/43. Las sparklines del drawer deben manejar arrays de longitud variable.
- **Las sparklines con `invertGood: true` se colorean según la convención del DS para "más alto = peor"** (terracota oscura para tendencia mala, tinta para tendencia buena). El subindicador `elecciones-fraudulentas` queda en `invertGood: true` — su sparkline subiendo se lee como "peor", coherente con la lectura editorial.

---

## Decisiones abiertas — para r2 (Anexo A · Product Design)

### 15 · Diseño del glyph SVG `presion.svg`

**Brief autocontenido en Anexo A de esta spec.**

Esta es la **única decisión visual abierta** de Spec 45. Las otras 14 decisiones técnicas están cerradas. Una vez resuelta en sesión de Product Design, Spec 45 bumpea a borrador-r2 (mismo patrón que Spec 42 → r2, Spec 43 → r2, Spec 44 → r2).

### Condicionales para r3 — re-evaluaciones con evidencia operativa

1. **Calibración de buckets una vez curadas las 4 olas históricas.** Si las olas anteriores (2018, 2021) tienen sistemáticamente más confianza y el bucket 4 absorbe más del 50% de los datapoints, reescalar los rangos. Decisión esperada en r2-r3 tras correr el pipeline completo.
2. **Cobertura editorial completa de los 7 países no-piloto** (BO, CO, EC, PE, PY, UY, VE) en el reading guide. Se completa en r3 después de validar el patrón con AR/BR/CL en producción.
3. **Ponderación del compuesto.** En r1 el compuesto es promedio simple de las 3 confianzas. Si en producción aparece evidencia de que una institución carga más peso conceptualmente (ej. confianza-partidos es la peor medida de toda la región, su ponderación arrastraría al compuesto), considerar ponderaciones distintas. Decisión condicional r3.
4. **Agregar más subindicadores al drawer (5° o 6°).** En r1 son 4. Si el lector pide ver `apoyo-democracia` o `no-representado-parlamento` al lado, agregarlos en r3 sin tocar el compuesto principal.
5. **Curar olas LB previas a 2018** (1995-2017). Spec 12A registra que LB tiene serie histórica de 30 años. Para Mapa Inestable, el horizonte 5 años (decisión 10 del epic) corta en 2021 — el LB 2018 es la única excepción incluida. Si el horizonte se extiende en futuras specs, agregar olas 2017, 2015, 2013, etc.
6. **Discoverability del compuesto.** Si en producción aparece evidencia de que los usuarios no entienden que el color refleja un compuesto (esperan un dato directo), reforzar la leyenda con la fórmula explícita (`promedio simple de partidos + congreso + judicial`). Mitigación inicial: el bloque "Lectura" del drawer abre con esa fórmula explicitada.
7. **Comportamiento del slider en LB 2020 modo crisis.** Si los usuarios confunden el quality flag con "datos viejos", agregar un mensaje explícito en el panel del slider cuando la ola activa es 2020. Decisión condicional.

### Caveats heredables para Specs futuras

- **Patrón B.4 reinterpretado para capas sin dirección.** Spec 45 hereda el principio de B.4 (color = solo magnitud) sin tensión, pero **reformula el bloque "Dirección" de la leyenda como bloque "Lectura"** porque no hay dirección separable de la magnitud. Esto NO es divergencia de B.4 — es adaptación del componente "Dirección" cuando la dimensión no aplica. Cualquier futura capa cuya magnitud absorba toda la lectura puede heredar este patrón sin reabrir B.4.
- **Compuestos en runtime como patrón.** Spec 45 es la primera capa que usa un indicador principal compuesto. Si futuras capas necesitan compuestos (ej. una eventual capa "atención" como sugerida en pregunta abierta #3 del epic), el patrón "calcular en runtime en `lib/layers/<id>.ts`" es replicable. Mantener el JSON crudo y los componentes inspectables es la clave.
- **Subindicadores como componentes del principal.** Spec 45 usa 3 de 4 subindicadores como componentes desagregados del compuesto principal. El patrón es nuevo respecto a Spec 42/43 (donde los subindicadores eran indicadores distintos al principal). Habilita una lectura "ver de qué se compone el principal" directamente en el drawer. Replicable en futuras capas compuestas.
- **`noData` estricto vs fallback.** Spec 44 usó fallback (`getLastVientoBeforeWeek`) por cadencia alta y laguna previsible; Spec 45 usó `noData` estricto por cadencia baja y gaps reales no extrapolables. El principio operativo: el fallback es válido cuando la laguna es esperada/operativa; el `noData` estricto es válido cuando la laguna refleja ausencia real de medición. Heredable para Spec 46/47 si introducen mecanismos cross-capa que necesiten decidir cómo cubrir gaps.

---

## No incluido en esta spec

- Diseño final del glyph `presion.svg` → Anexo A (bloqueante para r2).
- Reading guide curado para Bolivia, Colombia, Ecuador, Paraguay, Perú, Uruguay, Venezuela → r3.
- Curación de las 4 olas históricas (2018, 2020, 2021, 2023) → pre-requisito operativo, no de esta spec.
- Página dedicada de documentación profunda → Spec 39B (post-implementación de las 4 capas).
- Multi-capa simultánea → Spec 47.
- Subnacional (Brasil, Argentina) → spec posterior, granularidad país por decisión 10 del epic.
- Compuesto con ponderaciones distintas al promedio simple → decisión condicional r3.
- Más de 4 subindicadores → decisión condicional r3.
- Olas LB previas a 2018 → fuera del horizonte de 5 años del epic.
- Indicador de variación entre olas como capa propia → la variación vive en sparklines del drawer, no en el color del polígono.

---

## Implementación sugerida

Orden recomendado en sesión de VS Code (asumiendo el pre-requisito operativo cumplido y Anexo A cerrado en r2):

1. **Pre-requisito operativo (sesión separada con red):** ejecutar `build_indicators_historical.py` (extensión del script actual) para curar las 4 olas históricas de LB. Verificar contra el informe oficial de cada año (cross-check ±1pp). Output: `platform/data/latinobarometro/indicators-historical.json`.
2. **Extender `lib/latinobarometro.ts`** con tipos `WaveYear`, `Wave`, helpers `getAvailableWaves()`, `getWaveByYear(year)`, `getCountryDataByWave(slug, country, year)`. Mantener helpers actuales operando sobre la última ola por default. Pasar typecheck.
3. **Renombrar carpetas** `latinobarometro-2024` → `latinobarometro` en `platform/data/` y `platform/frontend/src/data/`. Sincronizar el JSON multi-ola al frontend.
4. **Extender `layers.css`** con tokens `--mi-presion-0..4` + `--mi-presion-nodata` + `--mi-presion-stale`. Si Spec 42/43/44 no crearon el archivo (probable), crearlo con los tokens de las 4 capas. Smoke test: 5 colores distinguibles entre sí.
5. **Reescribir `lib/layers/presion.ts`** con `bucketOnCompuesto`, `worstQuality`, `computeCompuesto`, `buildPeriods`, `makeSubIndicator`, `getValueForCountry`, `getLastPeriodBefore`. Pasar typecheck.
6. **Tests unitarios** de las 5 funciones helper + de `getValueForCountry` con fixtures de AR-2024, BR-2024, CL-2024 + casos de noData (país sin entry, componente faltante).
7. **Sincronizar glyph SVG `presion.svg`** desde el SSOT del vault (`70-Producto/design-system/mapa/glyphs/presion.svg`, entregado en r2) al frontend (`platform/frontend/public/mapa/glyphs/presion.svg`). Verificar diff binario `vault ↔ public/`. Reemplazar el placeholder lucide actual.
8. **Verificar `LayerLegend.tsx`** soporta el bloque "Lectura" en lugar de "Dirección" cuando la capa lo declara (necesario porque B.4 se reformula localmente para Spec 45). Si el componente asume el bloque "Dirección" fijo, refactor pequeño para hacerlo opcional o reemplazable.
9. **Verificar `LayerReadingDrawer.tsx`** soporta sparklines de longitud variable (5 puntos para presión, 8 para precipitación/temperatura). Probable que ya lo soporte por contrato `LayerSubIndicator.getSeries` que devuelve array de longitud variable, pero verificar al implementar.
10. **Reescribir `70-Producto/lecturas-capas/presion.md`** con contenido para ARG, BRA, CHI + intro general + sección "Otros países pendientes" + sección de método y limitaciones.
11. **Smoke test integrado**: activar capa Presión desde `/mapa`, navegar las 5 olas con el slider, abrir drawer en los 3 países piloto + 1 no-piloto, mover slider a un año entre olas (ej. 2022), verificar que el render usa LB 2021 y que países sin entry renderean `noData`. Verificar AC1-AC18.
12. **Actualizar README del design-system** para reflejar el cuarto eje compositivo del sistema de glyphs (decidido en Anexo A r2).

Tiempo estimado:
- Pasos 2-12 (asumiendo pre-requisito cumplido y Anexo A cerrado en r2): **2-3 días** en VS Code.
- Pre-requisito operativo (curación de las 4 olas históricas, paso 1): **~1 semana** de trabajo separado.
- Cierre de Anexo A en sesión dedicada de Product Design: **1 sesión** (más corta que Spec 44 — una sola decisión, no acoplada).

---

## Anexo A · Brief para sesión de Product Design

Este anexo es **autocontenido**. Se puede extraer y llevar a una sesión separada de Product Design sin necesidad de leer el resto de Spec 45.

### A.1 Contexto del producto

**Mapa Inestable** es una plataforma de análisis político-cultural de Sudamérica. Su pieza central es un **mapa Torres García invertido** (sur arriba, referencia a "América Invertida" de 1943) con hot-zones por país que abren análisis editoriales. Sitio actual: https://mapa-inestable-v1.vercel.app/mapa.

El epic en curso (EPIC 03) agrega cuatro **capas analíticas** estilo Windy sobre el mapa: viento, temperatura, presión, precipitación. Las tres primeras (Spec 42 precipitación, Spec 43 temperatura, Spec 44 viento) ya están diseñadas con sus respectivos glyphs cerrados en sesiones de Product Design anteriores. Spec 45 implementa la **cuarta y última capa real — presión = densidad institucional desde Latinobarómetro**.

Con Spec 45 r1 cerrada, las 4 capas del epic quedan diseñadas — el epic entra en fase de "ejecución pura" (pre-requisitos operativos + Specs 46/47).

### A.2 Dirección estética anclas

- **Nombre del estilo:** Grabado.
- **Tipografía display:** Alfa Slab One.
- **Color dominante:** terracota (`#b85a32` aproximado).
- **Color neutro:** papel crema (`#f4ead8`), tinta oscura (`#1f1813`).
- **Sin border-radius.** Todo cuadrado.
- **Sombras duras**, no difusas.
- Las fronteras del mapa están difuminadas con Gaussian blur (Spec 39).
- **Glyphs SVG custom**, no emojis. Cada capa tiene su propio glyph dibujado a mano alzada en el espíritu del proyecto.
- Sistema de glyphs cerrado en Spec 42/43/44 r2: "elemento principal + elementos secundarios" en trazo manuscrito Grabado, `viewBox="0 0 48 48"`, `stroke="currentColor"`, `fill="none"`, `stroke-width` 1.5-2.5.

Referencias en el vault:
- `70-Producto/design-system/design-system.md` — tokens completos.
- `70-Producto/design-system/cover-style-guide.md` — guía de portadas (estilo aplicable).
- `70-Producto/design-system/mapa/glyphs/README.md` — patrón del sistema de glyphs + inventario + ejes compositivos consumidos.
- `70-Producto/design-system/mapa/glyphs/precipitacion.svg` — ancla horizontal cerrada (nube + 3 gotas).
- `70-Producto/design-system/mapa/glyphs/temperatura.svg` — ancla vertical cerrada (termómetro + 3 marcas).
- `70-Producto/design-system/mapa/glyphs/viento.svg` — ancla horizontal abierta (onda 3-humps + punta direccional + 2 mini-ondas).
- `70-Producto/design-system/mapa/glyphs/viento-neutro.svg` — variante neutra de viento (dashes estáticos en vez de mini-ondas, sin punta).

### A.3 Lo que Spec 45 deja cerrado (no reabrir)

- **Indicador principal** = compuesto "Confianza institucional" (promedio simple de partidos + congreso + judicial), calculado en runtime sobre el JSON multi-ola LB.
- **4 subindicadores** = los 3 componentes del compuesto + elecciones-fraudulentas.
- **Escala secuencial intensidad** sobre valor absoluto del compuesto (no sobre variación). 5 buckets: `≤15%`, `15-25%`, `25-35%`, `35-45%`, `>45%`.
- **Etiquetas de buckets** = "Vacío institucional" (0), "Erosión profunda" (1), "Erosión visible" (2), "Densidad media" (3), "Densidad alta" (4).
- **Paleta de magnitud**: 5 pasos de terracota con sesgo ladrillo (`--mi-presion-0..4`, hex tentativos en §3.3). Product Design puede ajustar dentro del DS Grabado.
- **Cobertura editorial piloto r1** = Argentina, Brasil, Chile.
- **5 olas LB**: 2018, 2020 (modo crisis COVID), 2021, 2023, 2024.
- **A.4** (UI subindicadores) = heredado de Spec 42 r2: tooltip + drawer con 4 sparklines de hasta 5 puntos cada una.
- **B.4** (color = solo magnitud) = heredado de Spec 42 r2, reformulado localmente para esta capa (sin bloque "Dirección" en la leyenda; en su lugar bloque "Lectura" descriptivo). Esto NO es divergencia del patrón — es adaptación del componente "Dirección" cuando la dimensión no aplica.
- **Cadencia** = anual nativa (5 olas declaradas).
- **`noData` estricto** sin fallback a ola previa cuando hay gap de cobertura LB.

### A.4 Decisión única · Glyph viento SVG `presion.svg`

**El problema.** Spec 45 cerró toda la lógica técnica de la capa presión. Falta diseñar el glyph SVG que el LayerController usa para representarla en la lista de capas (y eventualmente en headers del drawer y la leyenda).

**Restricciones heredadas del sistema (cerradas en Spec 42/43/44 r2):**

- `viewBox="0 0 48 48"`, `stroke="currentColor"`, `fill="none"`, `stroke-width` entre 1.5 y 2.5.
- Patrón "elemento principal + secundarios" cerrado en Spec 42 r2 (C.4).
- El glyph debe leer a **24px** (LayerController) y a **36px** (drawer header opcional).
- **Cuarto eje compositivo del sistema.** Los tres ejes ya consumidos son:
  - Horizontal cerrado → precipitación (nube + gotas).
  - Vertical cerrado → temperatura (termómetro + marcas).
  - Horizontal abierto → viento (onda + punta).
  - **Libre para Spec 45**: opciones consideradas en el README de glyphs como vocabularios disponibles: anillos/círculos concéntricos, barras (sólidas o apiladas), asterismos (puntos como constelación), contornos verticales más altos que el termómetro, eje vertical abierto, formas radiales con anclaje central, etc.
- **Vocabulario reservado para viento, NO REUSAR:** ondas/sinusoides (consumido por `viento.svg` — T.4 fue descartado para temperatura precisamente para preservarlo allí, y Spec 44 r2 lo consumió en P.1).

**Restricciones específicas a esta capa:**

- El glyph debe leer **encima del fill terracota-ladrillo** del polígono (5 niveles de saturación: claro a oscuro). El stroke del glyph necesita contraste sobre el bucket más oscuro (`--mi-presion-4` ≈ `#6a3322` tentativo). Tentativa actual: stroke `--mi-ink` (tinta oscura). Product Design puede proponer un token alternativo.
- El polígono ya tiene Gaussian blur de Spec 39 — el glyph se rendea encima del fill difuminado.
- **No requiere variantes direccionales.** El compuesto es monodimensional (alta vs baja confianza). Un solo SVG cubre toda la capa, sin necesidad de mecánica V3 (espejado por `scaleX`) ni variantes neutras como Spec 44. **Esto simplifica fuerte el brief vs Spec 44.**

**Material conceptual disponible para inspirar el motivo gráfico:**

- **Metáfora barométrica.** Presión atmosférica. Un barómetro tradicional tiene una aguja sobre un dial circular — sugiere vocabularios radiales/circulares con anclaje central. Pero usar literal un "manómetro" puede ser demasiado figurativo y romper el espíritu Grabado del sistema.
- **Densidad acumulada.** La "presión institucional" es densidad — peso simbólico que se acumula. Sugiere vocabularios de capas/estratos, anillos concéntricos (cada anillo = una institución), o columnas apiladas (cada columna = una dimensión de confianza).
- **Vacío vs lleno.** Las etiquetas de los buckets ("Vacío institucional" ↔ "Densidad alta") refuerzan una dicotomía hueco/sólido. Sugiere vocabularios donde el "principal + secundarios" puede leerse como "estructura central + elementos que la sostienen" o "núcleo + entorno".
- **Coherencia con el cluster "Erosión de mediaciones".** El indicador principal es agregado de 3 instituciones: partidos, congreso, judicial. Un glyph con 3 elementos secundarios visibles (paralelo a las "3 gotas" de precipitación o las "3 marcas" de temperatura) refuerza la coherencia conceptual con el contenido de la capa.

**Opciones tentativas (no exhaustivas — Product Design puede proponer otras):**

1. **P1 · Anillos concéntricos + asterismo central.** Tres anillos concéntricos (3 instituciones) con un punto/asterisco central que representa el compuesto agregado. Eje compositivo: radial centrado. Riesgo: rotacionalmente simétrico, va contra la preferencia del sistema por ejes claros — mitigable con asimetría intencional (ej. los 3 anillos no son perfectamente concéntricos).
2. **P2 · Barras verticales apiladas.** Tres barras verticales de alturas distintas (3 instituciones) sobre una base horizontal sólida. Eje compositivo: vertical abierto, complementa el vertical cerrado de temperatura. La altura de la barra del medio podría leerse como el compuesto.
3. **P3 · Columna central + 3 elementos laterales.** Una columna central vertical (compuesto) flanqueada por 3 marcas laterales chicas (3 instituciones). Eje compositivo: vertical abierto centrado.
4. **P4 · Contorno arquitectónico.** Un perfil de fachada (columna + capitel + entablamento) — referencia visual al "edificio institucional". Carga literal pero reconocible. Eje compositivo: vertical cerrado más alto que el termómetro (≤ 1.5x altura). Riesgo: figurativo, puede ser demasiado literal.
5. **P5 · Asterismo institucional.** 3 puntos formando un triángulo (3 instituciones) con un cuarto punto central (el compuesto). Eje compositivo: asterismo geométrico. Coherencia con el lenguaje visual del proyecto (el logo del proyecto incluye un asterisco — ver `70-Producto/design-system/logo`).
6. **P6 · Otra** que Product Design proponga (incluyendo combinaciones de los anteriores).

**Cuestiones a resolver en la sesión:**

- Qué eje compositivo nuevo aporta al sistema (no horizontal cerrado, no vertical cerrado, no horizontal abierto — debe ser distinto).
- Si el motivo gráfico evoca la metáfora "presión / densidad institucional" sin caer en lo figurativo (manómetro literal, edificio público con techo y columnas, etc.).
- Si los 3 elementos secundarios materializan las 3 confianzas del compuesto sin forzar la lectura (idealmente el lector las decodifica intuitivamente, no necesita explicación textual).
- Si el glyph se lee bien a 24px sobre los 5 buckets de fill (incluido el bucket 4 más oscuro `--mi-presion-4`).

**Outputs esperados de la sesión de Product Design.**

- 3-5 propuestas (SVGs o sketches) idealmente con render simulado a 24px sobre los 5 buckets de fill.
- Para cada propuesta: motivo gráfico, eje compositivo, qué representa cada secundario, qué metáfora absorbe el motivo principal.
- Recomendación con razón breve. Idealmente la razón conecta con los patrones formales del sistema (forma compositiva, paralelismo con las otras 3 capas).

**Outputs del cierre.**

- 1 SVG final entregado a `70-Producto/design-system/mapa/glyphs/presion.svg`.
- Actualización del README del directorio marcando `presion.svg` como activo + agregando el cuarto eje compositivo al inventario + cerrando la sección "Heredable para Spec 45" del README.
- Decisión registrada en Spec 45 §Decisiones tomadas como cerrada en r2 (decisión #15).

### A.5 Modo de operación

- Esta sesión puede correr en cualquier herramienta (Cowork con un skill diferente, Figma, sesión de diseño visual standalone).
- El resultado se ingresa de vuelta a Spec 45 como decisión #15 cerrada → la spec bumpea a borrador-r2.
- Una vez cerrada r2 + cumplido el pre-requisito operativo (curación de las 4 olas históricas), la spec va a VS Code para implementación final.
- Esta es la **última sesión de Product Design del epic** (Specs 42, 43, 44 ya tienen sus glyphs cerrados). Con Spec 45 r2, el sistema de glyphs queda consolidado en 4 ejes compositivos distintos.

---

## Histórico

| Fecha | Cambio | Razón |
|---|---|---|
| 2026-05-21 | Creación de la spec en sesión de Cowork. r1 cierra 14 decisiones (combinación de heredadas de Spec 42 r2 + decisiones cerradas con Tomás en sesión 2026-05-21). 4 divergencias locales documentadas: (a) escala sobre valor absoluto del compuesto en lugar de variación interanual; (b) indicador principal compuesto (promedio simple de 3 indicadores LB) en lugar de un solo slug del pipeline macro; (c) `noData` estricto por período sin fallback `getLastWaveBefore`; (d) etiqueta bucket 0 = "Vacío institucional". B.4 hereda intacto pero el componente "Dirección" de la leyenda se reformula localmente como bloque "Lectura" porque la magnitud absorbe toda la lectura (sin dirección separable). Queda 1 decisión abierta (#15 glyph SVG `presion.svg`) que se resuelve en sesión de Product Design — Anexo A la documenta autocontenidamente. Pre-requisito operativo registrado en frontmatter: curar 4 olas históricas LB (2018, 2020, 2021, 2023) antes del handoff a VS Code | Cuarta y última capa real del EPIC 03. Cierra el bloque "diseño de capas" del epic. Hereda contrato técnico y patrones A.4/B.4/C.4 de Spec 42 r2. El método de "patrón heredado + divergencias locales documentadas" que Spec 43 inauguró y Spec 44 escaló (a 5 divergencias) llega acá a su forma más pulida: 4 divergencias, cada una con razón explícita arraigada en la naturaleza del dato Latinobarómetro. El brief para Product Design es chico (un glyph, sin sub-decisiones acopladas) — más chico que Spec 44 (acoplada motivo + mecánica) y similar a Spec 43 (un glyph único). Con Spec 45 r2 cerrada, el sistema de glyphs queda consolidado en 4 ejes compositivos distintos |

---

## Glosario

- **Capa principal:** la dimensión que manda el color del país en el mapa. Para presión, el compuesto "Confianza institucional".
- **Compuesto:** promedio simple de confianza-partidos, confianza-congreso y confianza-judicial. Calculado en runtime en `lib/layers/presion.ts`, no pre-procesado al JSON.
- **Confianza institucional:** porcentaje de personas que declaran "mucha + algo" de confianza en una institución dada (cómputo estándar de Latinobarómetro, ver Spec 12A).
- **LB / Latinobarómetro:** Corporación Latinobarómetro, encuesta anual (con olas reales que no necesariamente son anuales) sobre opinión pública en América Latina.
- **Ola:** una edición específica de Latinobarómetro (LB 2018, LB 2020, LB 2021, LB 2023, LB 2024). El proyecto cura 5 olas en r1.
- **LB 2020 modo crisis:** la ola 2020 se hizo en modo telefónico/online por COVID, en lugar de presencial. Quality flag `"estimado"` global.
- **Bucket de magnitud:** uno de los 5 niveles de la escala (0..4) sobre el valor absoluto del compuesto. Mismo número que Spec 42/43 (5), divergencia explícita vs Spec 44 (4).
- **`noData` estricto:** cuando un país no tiene entry en la ola activa, el polígono renderea sin dato sin fallback a ola previa. Divergencia local #4 vs Spec 44 que sí usa fallback (`getLastVientoBeforeWeek`).
- **Subindicador desagregado del principal:** uno de los 3 indicadores que componen el compuesto (partidos, congreso, judicial), expuesto en el drawer con su sparkline propia.
- **Subindicador externo:** el 4° subindicador (elecciones-fraudulentas), que no es componente del compuesto principal pero suma una mirada heterodoxa al cluster.
- **Cobertura piloto:** AR/BR/CL en r1 (idem Spec 42/43, no idem Spec 44 que pilotó solo AR por realidad operativa).
- **Cobertura técnica:** los 10 países LB del proyecto renderean con compuesto real una vez cumplido el pre-requisito operativo.
- **Reading guide:** el `.md` del vault que el drawer renderiza como full markdown.
- **Pre-requisito operativo:** ítem en frontmatter que el equipo de implementación debe cumplir antes de la corrida en VS Code. Para Spec 45: curación de las 4 olas históricas LB.
- **`getCountryDataByWave(slug, country, year)`:** helper nuevo de `lib/latinobarometro.ts` que esta spec agrega. Devuelve el datapoint de un indicador para un país en una ola específica.
- **`computeCompuesto(country, wave)`:** helper local de `lib/layers/presion.ts` que calcula el promedio simple de las 3 confianzas. Devuelve `null` si falta cualquiera de los 3 componentes (`noData` estricto).
- **Bloque "Lectura":** reformulación local del bloque "Dirección" de la leyenda. Describe cómo leer la escala (presión alta vs baja) en lugar de dirección de variación. Heredable por futuras capas sin variación.
- **Anexo A:** brief autocontenido para Product Design. Cierra decisión #15 (glyph SVG `presion.svg`, sin sub-decisiones acopladas).
- **Cuarto eje compositivo:** el eje compositivo nuevo del sistema de glyphs que Spec 45 ocupa (a definir en Anexo A r2). Los tres ya consumidos: horizontal cerrado (precipitación), vertical cerrado (temperatura), horizontal abierto (viento).
