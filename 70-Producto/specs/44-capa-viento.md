---
spec: 44
titulo: Capa viento — orientación pro-mercado / pro-estado como tercera capa analítica del mapa
estado: borrador-r3
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-21 (r3)
revision: 2026-05-21 (r3) — **Spec 44 hereda el cambio de cadencia de Spec 41 r3 (semanal → trimestral).** La divergencia local (e) "cadencia semanal nativa con `getLastVientoBeforeWeek` como fallback" se cae como divergencia — la capa queda alineada con Spec 42/43 en cadencia. Spec 44 baja de 5 divergencias a 4. El módulo `lib/layers/viento.ts` se reescribe: `buildPeriods` usa `getAvailableQuarters()` en lugar de `getAvailableWeeks()`; `getValueForCountry` parsea key formato `YYYY-Q#` en lugar de `YYYY-W##`; `getLastVientoBeforeQuarter` reemplaza a `getLastVientoBeforeWeek`; `isoWeekEndDate` sale, `quarterEndDate` entra (helper compartido con Spec 43). El JSON consumido es `viento-v2.0.0` con `series_trimestral`. Decisión #10 (cadencia) y #11 (fallback del slider) reescritas. Pre-requisito operativo simplificado: AR ≥1 trimestre, BR/CL ≥1 trimestre, resto ≥1 trimestre (en lugar de N semanas). 2026-05-21 (r2) — cierra decisión #18 acoplada (18.a glyph + 18.b mecánica de orientación) en sesión de Product Design (Mapa Inestable Design System · spec44/index.html). Elegidos **P.1** (onda + punta direccional) sobre 4 candidatos alternativos y **V3** (asimetría intrínseca + neutro distinto, vía `transform: scaleX(-1)` por el componente del mapa) sobre 4 mecánicas alternativas. 2 SVGs entregados al vault como SSOT: `viento.svg` (activo, pro-mercado canónico) + `viento-neutro.svg` (variante propia para rank=0, no ausencia). AC15 cerrado del lado del SSOT; sincronización al frontend pendiente para la sesión VS Code. Vocabulario de ondas/sinusoides consumido por esta capa (caveat heredable Spec 42→44 cerrado). Sistema de glyphs queda con 3 ejes compositivos distintos: horizontal cerrado (precipitación), vertical cerrado (temperatura), horizontal abierto (viento). Heredada r1: contrato y patrones A.4/C.4 de Spec 42 r2 + 5 divergencias locales documentadas
epic: 03
afecta:
  - platform/frontend/src/lib/layers/viento.ts (REESCRIBIR — el stub de Spec 39 con datos sintéticos y escala diverging azul-terracota se reemplaza por implementación real sobre el JSON de Spec 41)
  - platform/frontend/src/styles/layers.css (EXTENDER — agregar tokens `--mi-viento-0..3` siguiendo el patrón de `--mi-precipitacion-*` y `--mi-temperatura-*`)
  - platform/frontend/src/components/MapaTorresGarcia.tsx (EXTENDER — render del glyph orientado sobre cada hot-zone activa cuando la capa viento está activa; mecánica visual de orientación es decisión Anexo A)
  - 70-Producto/design-system/mapa/glyphs/viento.svg (entregado 2026-05-21 r2 — SSOT en vault, glyph activo P.1 onda + punta direccional)
  - 70-Producto/design-system/mapa/glyphs/viento-neutro.svg (entregado 2026-05-21 r2 — SSOT en vault, variante propia para rank=0)
  - platform/frontend/public/mapa/glyphs/viento.svg (NUEVO — copia sincronizada del vault, pendiente sesión VS Code)
  - platform/frontend/public/mapa/glyphs/viento-neutro.svg (NUEVO — copia sincronizada del vault, pendiente sesión VS Code)
  - 70-Producto/design-system/mapa/glyphs/README.md (actualizado 2026-05-21 r2 — `viento.svg` + `viento-neutro.svg` activos en vault, sistema queda con 3 ejes compositivos distintos)
  - 70-Producto/lecturas-capas/viento.md (NUEVO — reading guide markdown con texto curado para AR + intro general que aplica a los 10)
depende_de: [39, 41]
depende_blanda_de: [22, 37, 42, 43]
relaciona_con:
  - EPIC-03 (esta spec implementa la decisión 1 del epic — capa viento como pro-mercado/pro-estado — y cierra la decisión condicional #3 de Spec 42 r2 / Spec 43 r2 sobre el caveat B.4 heredable para viento)
  - Spec 39 (arquitectura de capas — esta spec puebla el contrato Layer en su slot `viento`)
  - Spec 39B (página dedicada de documentación — el reading guide de esta spec es insumo de Spec 39B cuando se diseñe)
  - Spec 41 (pipeline político / coding viento — fuente exclusiva de datos de esta capa; el JSON compilado por `build_viento.mjs` es el único input)
  - Spec 41B (algoritmo híbrido — spec hija pospuesta. Cuando llegue, introduce componentes estructurados que habilitarán el bloque "Noticias por sector" como subindicadores en r3 de esta spec)
  - Spec 42 (capa precipitación — ancla del patrón visual: contrato `LayerSubIndicator`, modelo de tiempo por capa, escala secuencial intensidad, A.4 tooltip+drawer, C.4 glyph "principal + secundarios". B.4 NO se hereda — esta spec lo diverge conscientemente)
  - Spec 43 (capa temperatura — segunda capa que validó el patrón Spec 42 con divergencias locales. Spec 44 sigue el mismo método de divergencias documentadas)
desbloquea:
  - Spec 41B (la operación de coding viento manual durante r1/r2 de Spec 44 acumula material editorial — 8-12 semanas a futuro habilitan el diseño de Spec 41B)
  - Spec 45 (capa presión) — la divergencia de B.4 acá define el precedente para que Spec 45 pueda divergir también si el caso lo amerita
pre_requisitos_operativos:
  - "**Actualizado en r3 (cadencia trimestral).** Cobertura mínima de coding viento publicado: los 10 países con ≥1 trimestre en estado `publicada`. AR ya cumple con `2026-Q2.md` migrado (W18+W19 promediados, decisión #22 de Spec 41 r3). BR/CL y los 7 restantes alcanzan la cobertura cuando se publique el coding del primer trimestre cerrado del nuevo régimen (Q2-2026, publicable a partir del primer viernes del Q3 → 2026-07-03). Verificación: `node platform/data/coding-viento/build_viento.mjs --dry-run` debe reportar `Países con datos: 10/10` y `Archivos compilados: ≥10`. Spec 44 NO se implementa en VS Code hasta que este pendiente esté cerrado."
  - "~~Anexo A cerrado en sesión de Product Design (glyph SVG `viento.svg` + mecánica visual de orientación). Ver §Anexo A. El handoff a VS Code se hace recién con r2.~~ **Cerrado 2026-05-21 r2.** Glyph P.1 + mecánica V3. 2 SVGs entregados al vault (`viento.svg` + `viento-neutro.svg`). Sincronización al frontend (`platform/frontend/public/mapa/glyphs/`) sigue pendiente para la sesión VS Code de implementación."
prioridad: alta
---

# 44 · Capa viento — orientación pro-mercado / pro-estado

## Resumen ejecutivo

Esta spec implementa la **tercera capa analítica real** del EPIC 03, después de Spec 42 (precipitación) y Spec 43 (temperatura). Hereda el contrato técnico y dos de los tres patrones visuales que Spec 42 r2 dejó cerrados (A.4 tooltip + drawer; C.4 glyph "principal + secundarios"). **Diverge en B.4** porque en viento la dirección es la lectura principal, no auxiliar.

**El nodo crítico — caveat B.4 cerrado en favor del "glyph orientado".** Spec 42 r2 y Spec 43 r2 dejaron explícito que B.4 (dirección solo en leyenda/tooltip; mapa muestra solo magnitud) era "ancla con caveat para Spec 44". El caveat se cierra en esta spec en favor de la **opción glyph orientado sobre el mapa**: el color del país codifica solo la magnitud absoluta del rank (escala secuencial terracota, igual que Spec 42/43); cada hot-zone con dato lleva encima un glyph chico que apunta a izquierda o derecha según la dirección del coding semanal (pro-estado ↔ pro-mercado). Esto preserva la coherencia cromática del sistema, mantiene la escala secuencial intensidad sin reintroducir paleta diverging, y resuelve la pérdida de legibilidad pasiva que B.4 puro tendría sobre una capa cuya lectura principal es la dirección.

Las divergencias locales de Spec 44 son **cuatro** y están documentadas (en r1 eran 5; con el cambio de cadencia r3 cayó la quinta — ver Histórico r3):

1. **B.4 diverge en favor de glyph orientado** (decisión cerrada en esta spec; el caveat heredable de Spec 42/43 queda cerrado).
2. **Sin subindicadores en r1.** El JSON compilado por Spec 41 (`build_viento.mjs`) expone `rank`, `direccion`, `intensidad`, `justificativo`, `eventos[]`, `codificador` y `regimen` — **no tiene componentes estructurados** (policy/rhetoric/regulación) que se puedan exponer como sparklines. Esos componentes llegan recién con Spec 41B (algoritmo híbrido, pospuesto a 8-12 trimestres acumulados con la cadencia trimestral de r3). El drawer de Spec 44 muestra encabezado + bloque "Lectura editorial" + bloque "Eventos clave" renderizando los bullets del coding como lista, sin sparklines. Decisión condicional r4: cuando Spec 41B introduzca dimensiones estructuradas (regulación/desregulación por sector), agregar un bloque "Noticias por sector" como subindicadores.
3. **4 buckets de magnitud (0..3) en lugar de 5 (0..4).** El coding entrega rank entero `{-3, -2, -1, 0, 1, 2, 3}`. La magnitud absoluta toma 4 valores discretos: 0, 1, 2, 3. Mapear a 5 buckets como Spec 42/43 dejaría un bucket vacío. Spec 44 declara una escala de 4 buckets matcheando 1:1 la escala discreta nativa del coding.
4. **Cobertura piloto técnica solo AR.** Hoy solo Argentina tiene cobertura (Q2-2026 migrado en r3 desde W18+W19 promediados); los 9 países restantes esperan a que el editor codifique el primer trimestre cerrado en el nuevo régimen (Q2-2026, publicable a partir del viernes 2026-07-03). El pre-requisito operativo declarado en frontmatter exige cobertura mínima antes del handoff a VS Code, pero el "piloto editorial" del reading guide se acota a Argentina en r1 (no AR/BR/CL como Spec 42/43). BR y CL entran en r2/r3 cuando haya trimestre acumulado.

**Divergencia que se cayó en r3 (~~era la #5 en r1/r2~~):** la cadencia semanal nativa que Spec 44 declaraba en r1/r2 ya no es divergencia — con Spec 41 r3 toda la operación editorial pasa a trimestral, lo que alinea Spec 44 con Spec 42/43. El módulo `lib/layers/viento.ts` se simplifica considerablemente: `getAvailableQuarters()` y `getLastVientoBeforeQuarter()` reemplazan a sus equivalentes semanales, `isoWeekEndDate` sale, `quarterEndDate` (helper compartido con Spec 43) entra.

**Metáfora climática.** La orientación pro-mercado ↔ pro-estado se lee como dirección del viento dominante en la semana: el viento puede soplar fuerte hacia un lado, soplar suave hacia el otro, cambiar de dirección, o no soplar (calma). La magnitud del rank captura cuán fuerte fue el cambio en la semana; la dirección, hacia dónde sopló. La metáfora es operativa: la decisión del glyph orientado refuerza la lectura "soplar hacia" de un modo que ni precipitación ni temperatura necesitaban.

**Lo que entra en r1:**

- Implementación de `lib/layers/viento.ts` que cumple el contrato `Layer` de Spec 39, reemplazando el stub sintético.
- Indicador principal: `rank` (-3..+3) del coding manual editorial (Spec 41, JSON compilado en `platform/frontend/src/data/coding-viento/viento.json`).
- **Sin subindicadores** en r1. Bloque "Eventos clave" del drawer lee `eventos[]` del coding como lista de bullets.
- Escala secuencial intensidad: **4 buckets** de magnitud `|rank|` (0..3) + flag de dirección (`pro-estado` | `neutro` | `pro-mercado`).
- Paleta — tokens CSS `--mi-viento-0..3` — derivada del DS Grabado. Definición tentativa en §3.3, confirmación de hex final en Anexo A si Product Design lo ajusta.
- Glyph SVG custom **cerrado en r2** (Anexo A · decisión #18 acoplada). 2 SVGs entregados al vault: `viento.svg` (activo, P.1 onda + punta direccional, pro-mercado canónico) + `viento-neutro.svg` (variante propia para rank=0, V3 dashes estáticos sin punta). Mecánica V3: pro-estado se renderea con `transform: scaleX(-1)` aplicado por el componente del mapa a `viento.svg`. Sincronización al frontend pendiente para la sesión VS Code.
- Reading guide markdown en `70-Producto/lecturas-capas/viento.md` con contenido editorial curado para Argentina + introducción general que aplica a los 10 países.
- Patrón A.4 heredado de Spec 42 r2: tooltip mínimo (~280px) con valor rank + label de dirección; drawer (~380px) con encabezado + bloque "Lectura editorial" + bloque "Eventos clave" (lista de bullets) + bloque "Justificativo" (1-3 frases del coding).
- **B.4 diverge**: glyph orientado sobre el mapa por encima del fill de color.
- Modulación opcional por `intensidad` (campo 0-1 del coding): la saturación del fill se modula levemente dentro del bucket cuando el coding declara intensidad. Implementación específica en §3.4.
- Test fixture: con AR como único país con dato real + 5 períodos arbitrarios, validar que el render no rompe, que los buckets se distribuyen correctamente y que el glyph orientado se renderiza con la orientación correcta.

**Lo que NO entra en r1:**

- **Subindicadores estructurados.** Sin sparklines. El bloque "Noticias por sector" propuesto como evolución para r3 queda condicional al avance de Spec 41B.
- ~~**Diseño final del glyph viento.svg + mecánica visual de orientación** → Anexo A.~~ **Cerrado en r2** (P.1 + V3). 2 SVGs entregados al vault.
- **Reading guide editorial para los 9 países no-piloto** (BO, BR, CL, CO, EC, PE, PY, UY, VE). Se completa en r2 (BR y CL una vez con ≥2 semanas de coding) y r3 (los demás).
- **Hidratación del coding viento de los 9 países restantes** — pendiente operativo del editor (Tomás), no de esta spec. Está en la cadencia semanal de Spec 41.
- **Subnacional Brasil/Argentina** — granularidad país (decisión 10 del epic).
- **Algoritmo híbrido de coding** → Spec 41B (8-12 semanas).
- **Multi-capa simultánea** (viento + precipitación al mismo tiempo) → Spec 47.

---

## Estado actual

### Lo que ya existe (gracias a Spec 39 + Spec 41 + Spec 42 implementadas)

- `platform/frontend/src/data/coding-viento/viento.json` versión `viento-v1.0.0` con datos publicados:
  - **AR**: 2 entries publicadas (`2026-W18` rank +3 intensidad 0.85; `2026-W19` rank +1 intensidad 0.4) más 1 borrador W21 que el build ignora.
  - Otros 9 países: declarados en `COUNTRY_SLUGS` del build pero sin entries publicadas. Sus subcarpetas existen con un único `.md` de borrador W21 (recordatorio del 2026-05-20).
- `lib/viento.ts` con tipos `VientoData`, `VientoCountryData`, `VientoWeekEntry`, `VientoDireccion` (`"pro-estado" | "neutro" | "pro-mercado"`) y helpers: `getCountryViento(slug)`, `getLatestByCountry()`, `getVientoForWeek(slug, year, week)`, `getLastVientoBeforeWeek(slug, year, week)`, `getAvailableWeeks()`.
- `lib/layers.ts` con el contrato `Layer` extendido (`subIndicators?` y `editorialByCountry?`), `LayerSubIndicator` con `invertGood` y `getSeries`, y el registry `LAYERS.viento` apuntando al stub actual.
- `lib/layers/viento.ts` es un **stub** de Spec 39 con datos sintéticos -2..+2, paleta diverging azul-terracota, sin subindicadores, sin reading guide. Esta spec lo reescribe entero.
- `MapaTorresGarcia.tsx` ya consume `getValueForCountry` de capa activa y aplica `bucket.color` al fill con Gaussian blur. **Pendiente**: render de glyph orientado encima del polígono (la mecánica exacta depende de la decisión Anexo A).
- `70-Producto/design-system/mapa/glyphs/README.md` ya tiene reservado el vocabulario de **ondas/sinusoides** para `viento.svg` (caveat heredable cerrado en Spec 43 r2 cuando T.4 fue descartado para temperatura).
- `70-Producto/datos-viento/` con la estructura completa: 10 subcarpetas por país, README, `_compilado/viento.json`, `_recordatorio-2026-W21.md`.

### Lo que NO existe todavía

- Tokens CSS `--mi-viento-{0..3}` en `styles/layers.css` (el archivo en sí tampoco fue creado — debe nacer con la implementación de Spec 42 + Spec 43; Spec 44 lo extiende cuando llega).
- Implementación real de `vientoLayer` (hoy el stub).
- Glyph definitivo `viento.svg` en el vault (`70-Producto/design-system/mapa/glyphs/`).
- Reading guide `70-Producto/lecturas-capas/viento.md`.
- Coding viento publicado de los 9 países restantes (cobertura actual 1/10 — pre-requisito operativo declarado).
- Mecánica de render del glyph orientado en `MapaTorresGarcia.tsx` (depende de Anexo A).

---

## Propuesta

### 1. Indicador principal — el rank del coding

La capa expone **un único indicador principal** y **cero subindicadores** en r1.

| Rol | Slug | Unidad | Cadencia primaria | Cadencia fallback | Cobertura prevista (post-coding piloto) |
|---|---|---|---|---|---|
| **Principal** | `coding-viento.rank` | entero `-3..+3` (rank semanal viento) | semanal (lunes a domingo, ISO) | sin fallback de cadencia; el helper `getLastVientoBeforeWeek` cubre fechas intermedias | 10/10 una vez cerrado el pre-requisito operativo (AR ya 1/10) |

**Por qué cero subindicadores en r1.** Decisión local de Spec 44 que diverge del patrón Spec 42/43. El JSON compilado por `build_viento.mjs` no expone dimensiones estructuradas que se puedan graficar como sparklines comparables entre semanas — solo `rank` (agregado), `intensidad` (0-1 opcional, modulación), `justificativo` (texto libre) y `eventos[]` (lista de bullets de texto libre). Calcular subindicadores derivados (delta vs semana anterior, tendencia, volatilidad, cantidad de eventos) sería honesto técnicamente pero engañoso semánticamente: la volatilidad del coding refleja el ritmo de cobertura del codificador, no del país. Esperar a Spec 41B (8-12 semanas) introduce dimensiones interpretativas reales (regulación/desregulación por sector) que sí podrán graficarse.

**Evolución condicional para r3.** Cuando Spec 41B esté en producción, agregar un bloque "Noticias por sector" como subindicadores. Candidatos tentativos de dimensiones (no se cierran acá):

- **Regulación / desregulación** por sector (financiero, laboral, comercial, sectorial industrial).
- **Discurso del gobierno** (alineamiento ortodoxo vs heterodoxo en declaraciones públicas).
- **Anuncios fiscales** (gasto vs ajuste).
- **Política exterior económica** (alineamiento con bloques regionales o globales).

Cada dimensión sumaría un score y una serie histórica. La spec hija (41B) define el contrato exacto. Spec 44 r3 absorbe esa estructura siguiendo el patrón `LayerSubIndicator` ya implementado.

### 2. Modelo de tiempo y contrato Layer

El contrato `LayerPeriod` de Spec 39 permite cadencia mixta. Para viento:

- `cadence: "semanal"` declarado en el `Layer`. Refleja la cadencia nativa del coding (Spec 41 §1.3).
- `periods[]` se construye en runtime a partir de `getAvailableWeeks()` de `lib/viento.ts`:
  - Cada semana ISO con al menos 1 país publicado genera un `LayerPeriod` con `key: "2026-W19"`, `date: <último día ISO de la semana>`, `label: "W19 · 2026"` (o similar — confirmación de formato del label en §3.5).
  - Si `getAvailableWeeks()` está vacío (caso teórico — el pre-requisito operativo lo bloquea), `periods` queda con un único período sentinel del último viernes ISO con `noData` global.
- `defaultPeriod` = última semana de `periods[]`.
- `getLastPeriodBefore(date)`: convierte la fecha ISO al ISO week correspondiente, busca en `periods[]` la última `LayerPeriod` con `date ≤ date`. La key del período encontrado se descompone en `{year, week}` y se pasa a `getLastVientoBeforeWeek` por país en `getValueForCountry`.

**Comportamiento del slider entre semanas.** Cuando el usuario mueve el slider a una fecha que cae entre dos semanas con coding publicado:
- Para cada país, `getValueForCountry` llama a `getLastVientoBeforeWeek(slug, year, week)` y devuelve el `VientoWeekEntry` más reciente con `entry.year ≤ year` y `entry.week ≤ week`.
- Los países sin ningún coding publicado anterior a esa fecha renderizan con `noData`.
- La leyenda muestra explícitamente la semana ISO del período activo (no la fecha intermedia del slider).

**Compatibilidad con el slider de Spec 39.** Spec 39 declara el slider como continuo sobre el rango global `{ start: "2021-01-01", end: <hoy> }`. Spec 44 no requiere cambios al slider: el helper `getLastPeriodBefore` ya está en el contrato. La única afinación visual posible (que NO entra en r1) es que el slider muestre marks/ticks en las semanas disponibles cuando la capa viento esté activa, para que el usuario perciba la granularidad. Decisión condicional r3, no bloquea.

### 3. Escala secuencial intensidad — 4 buckets + dirección

Mismo patrón que Spec 42/43 (escala secuencial intensidad, magnitud y dirección separadas), con **divergencia local de 4 buckets** (en lugar de 5) y B.4 diverge en favor del glyph orientado.

#### 3.1 Buckets

4 buckets de **magnitud absoluta del rank**, matcheando 1:1 la escala discreta nativa del coding.

| `bucketIndex` | Magnitud | Rango de `|rank|` | Label editorial |
|---|---|---|---|
| 0 | mínima | `|rank| = 0` | **"Neutro"** — semana sin movimiento direccional |
| 1 | leve | `|rank| = 1` | "leve" |
| 2 | moderada | `|rank| = 2` | "moderado" |
| 3 | fuerte | `|rank| = 3` | "fuerte" |

**Divergencia local #3 — 4 buckets en lugar de 5.** El coding entrega rank entero `{-3, -2, -1, 0, 1, 2, 3}`. La magnitud `|rank|` toma 4 valores discretos: 0, 1, 2, 3. Forzar 5 buckets como Spec 42/43 dejaría el bucket 4 vacío permanentemente (sería un bucket fantasma sin posibilidad de ser poblado). Spec 44 declara 4 buckets matcheando 1:1 la escala discreta nativa. El componente `LayerLegend` debe soportar variar el número de buckets entre capas (esto ya está garantizado por el contrato `Layer.legend.buckets: LayerBucket[]` que es array variable).

**Divergencia local #4 — etiqueta del bucket 0 = "Neutro".** Mientras Spec 42 etiquetó "sin cambio" y Spec 43 "Estancado" (con carga semántica activa), Spec 44 vuelve a una etiqueta neutra. Razón: en el coding manual de Spec 41 (§1.3 decisión 3), `rank = 0` significa explícitamente "no hubo cambios materiales esta semana" — no implica neutralidad política del gobierno ni indefinición. La etiqueta "Neutro" coincide con la convención del pipeline (`direccion: "neutro"`) y no carga semántica que la decisión editorial no haya asignado. El reading guide markdown amplía el matiz: en un gobierno fuertemente orientado a un polo, una semana de rank 0 sigue siendo lectura — pero esa lectura vive en el texto, no en la etiqueta del bucket.

#### 3.2 Por qué separar magnitud y dirección

Heredado tal cual de Spec 42 §3.2 con ajuste para esta capa: **la separación es lo que habilita el glyph orientado**. Si la dirección se codificara en el color (paleta diverging), no habría necesidad de glyph orientado — y se rompería la coherencia cromática con Spec 42/43.

#### 3.3 Paleta — tokens CSS (tentativa, confirma Anexo A)

Definición concreta de tokens, terracota base con 4 pasos de saturación. La paleta de viento **no replica los hex de precipitación ni de temperatura**: usa una variante levemente desplazada hacia el ocre profundo (más "tierra que vuela") para diferenciar las capas cuando estén visibles juntas (Spec 47).

```css
/* platform/frontend/src/styles/layers.css (extensión) */

:root {
  /* Escala secuencial viento — un solo tono, 4 pasos de saturación, sesgo ocre profundo */
  --mi-viento-0: #ecdcc4;  /* bucket 0 · Neutro — base ocre lavado */
  --mi-viento-1: #d4b07c;  /* bucket 1 · leve */
  --mi-viento-2: #b08144;  /* bucket 2 · moderado */
  --mi-viento-3: #74511f;  /* bucket 3 · fuerte */

  /* B.4 diverge: dirección NO afecta el color del fill — vive en el glyph orientado.
     Las variantes "direccion-*" no se usan en esta capa; la convención del DS las mantiene
     declaradas como alias del color base para consistencia con Spec 42/43. */
  --mi-viento-direccion-pro-estado:  var(--mi-viento-base, currentColor);
  --mi-viento-direccion-neutro:      var(--mi-viento-base, currentColor);
  --mi-viento-direccion-pro-mercado: var(--mi-viento-base, currentColor);

  /* Sin dato — gris del DS */
  --mi-viento-nodata: var(--mi-ink-mute);

  /* Quality flag — congelado / estimado. El coding manual de Spec 41 declara siempre
     quality "oficial" porque es coding editorial firmado. El token queda declarado
     para forward-compatibility con Spec 41B (algoritmo híbrido) que sí podrá generar
     señales estimadas. */
  --mi-viento-stale: var(--mi-paper-shade);

  /* Color del glyph orientado sobre el mapa (Anexo A confirma; tentativa).
     Se usa para el stroke del glyph, sobre el fill terracota del polígono. */
  --mi-viento-glyph-stroke: var(--mi-ink, currentColor);
}
```

**Decisiones tentativas — Anexo A confirma o ajusta:**

- Paleta ocre profundo elegida porque (a) es coherente con el DS Grabado, (b) diferenciable de precipitación (terracota base) y temperatura (terracota con sesgo cálido), (c) la metáfora "viento que arrastra tierra" se sostiene en el sesgo ocre. Product Design puede ajustar hex en Anexo A.
- Los tokens `direccion-*` quedan declarados pero no se usan (B.4 diverge → la dirección vive en el glyph, no en el color). Mantener la convención del DS facilita consumo programático genérico desde `LayerLegend`.
- El stroke del glyph orientado (`--mi-viento-glyph-stroke`) tentativamente apunta a `--mi-ink` (tinta oscura del DS) para garantizar contraste sobre los 4 buckets de fill. Product Design puede proponer un token alternativo o variante por bucket si el glyph se pierde sobre `--mi-viento-3` (fuerte = más oscuro).

#### 3.4 Modulación por intensidad (campo opcional del coding)

Spec 41 §1.3 declara que la `intensidad` (0-1, opcional en el coding) **modula visualmente la saturación del color dentro del bucket**: un rank +2 con intensidad 0.9 se renderiza ligeramente más saturado que un rank +2 con intensidad 0.4. Esto permite distinguir "una semana decisiva" de "una semana habitual" sin agregar buckets nuevos.

Implementación tentativa en r1:

- Cuando el `VientoWeekEntry` declara `intensidad ∈ [0, 1]`, se aplica un overlay de opacidad sobre el fill del polígono: `opacity = 0.7 + 0.3 * intensidad` (rango efectivo 0.7 a 1.0).
- Cuando `intensidad` no está declarado (`undefined`), se asume 1.0 (sin modulación adicional).
- La leyenda no muestra la modulación de intensidad explícitamente — es contínua y solo modula sutilmente. El tooltip sí muestra "intensidad 0.85" cuando aplica.

**Caveat:** esta modulación interactúa con el render de Gaussian blur del fill (Spec 39). Verificar en implementación que la opacidad final del fill + blur sigue siendo distinguible entre buckets. Si aparece confusión visual, posponer modulación a r3.

#### 3.5 Formato del label de período y del valor formateado

`LayerPeriod.label` para una semana ISO 2026-W19:

- Opción tentativa A: `"Sem 19 · 2026"` (corto, lee bien en el slider).
- Opción tentativa B: `"W19 · 2026"` (más técnico, idéntico al nombre del archivo del coding).
- Opción tentativa C: `"5-11 mayo 2026"` (rango de fechas, más legible para lectores no técnicos).

Decisión tentativa: **opción A** (`"Sem 19 · 2026"`) por balance entre brevedad y claridad. Confirmación en r2 si la leyenda del slider lo hace ilegible.

`LayerValue.formatted` para un rank +2:

- `"+2 pro-mercado"` cuando `rank > 0`.
- `"−2 pro-estado"` cuando `rank < 0`.
- `"0 neutro"` cuando `rank = 0`.

(Heredando el patrón "signo + label" de Spec 42/43, pero el label viene del coding directamente, no se calcula desde el valor.)

### 4. Implementación de `vientoLayer`

Esqueleto del módulo (r3 — trimestral), deriva directo del patrón de Spec 42/43 y opera contra `lib/viento.ts` (que en r3 expone `series_trimestral` y los helpers trimestrales):

```ts
// platform/frontend/src/lib/layers/viento.ts (r3)

import type { Layer, LayerPeriod, LayerValue } from "../layers";
import {
  VIENTO_DATA,
  getLastVientoBeforeQuarter,
  getAvailableQuarters,
  type VientoQuarterEntry,
} from "../viento";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Último día del trimestre (formato ISO YYYY-MM-DD). Compartible con Spec 43. */
function quarterEndDate(year: number, quarter: number): string {
  const monthEnd = [3, 6, 9, 12][quarter - 1];
  const lastDay = new Date(year, monthEnd, 0).getDate();
  return `${year}-${String(monthEnd).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
}

export function magnitudBucket(rank: number): number {
  return Math.abs(rank); // 0, 1, 2, 3
}

export function direction(rank: number): "pro-estado" | "neutro" | "pro-mercado" {
  if (rank > 0) return "pro-mercado";
  if (rank < 0) return "pro-estado";
  return "neutro";
}

export function formatViento(rank: number): string {
  const sign = rank > 0 ? "+" : rank < 0 ? "−" : "";
  const dir = direction(rank);
  return `${sign}${Math.abs(rank)} ${dir}`;
}

// ── Construcción de períodos ──────────────────────────────────────────────────

function buildPeriods(): LayerPeriod[] {
  const quarters = getAvailableQuarters(); // [{year, quarter}] ordenadas cronológicamente
  if (quarters.length === 0) {
    // Fallback sentinel: el trimestre actual sin dato, para no romper el slider.
    const now = new Date();
    const year = now.getUTCFullYear();
    const quarter = Math.floor(now.getUTCMonth() / 3) + 1;
    return [{
      key: `${year}-Q${quarter}`,
      date: quarterEndDate(year, quarter),
      label: `Q${quarter} ${year}`,
    }];
  }
  return quarters.map(q => ({
    key: `${q.year}-Q${q.quarter}`,
    date: quarterEndDate(q.year, q.quarter),
    label: `Q${q.quarter} ${q.year}`,
  }));
}

// ── Textos editoriales piloto (solo AR en r1) ─────────────────────────────────

const EDITORIAL: Record<string, string> = {
  ar: "<TEXTO CURADO — pendiente de redacción editorial cuando haya ≥4 semanas de coding AR publicado. Estructura sugerida: fase actual del viento argentino (orientación dominante y velocidad), eventos pivote de las últimas semanas, lectura cruzada con otros marcos (ortodoxia macro vs heterodoxia institucional), comparación con W18 (rank +3 = revisión FMI + cambiaria + presupuesto) y W19 (rank +1 = calma normativa).>",
};

// ── Layer ─────────────────────────────────────────────────────────────────────

const PERIODS = buildPeriods();

export const vientoLayer: Layer = {
  id: "viento",
  label: "Viento · orientación pro-mercado / pro-estado",
  shortLabel: "Viento",
  glyphSrc: "/mapa/glyphs/viento.svg",
  category: "editorial",
  description: "Dirección y velocidad del cambio político-económico en el trimestre. Coding editorial manual: rank −3 (pro-estado) a +3 (pro-mercado). El color del país codifica la magnitud del movimiento; el glyph orientado codifica la dirección.",
  unit: "rank −3 (pro-estado) a +3 (pro-mercado)",
  cadence: "trimestral",

  legend: {
    type: "continuous",
    buckets: [
      { bucketIndex: 0, label: "Neutro",  color: "var(--mi-viento-0)", rangeDescription: "|rank| = 0 · semana sin movimiento direccional" },
      { bucketIndex: 1, label: "leve",    color: "var(--mi-viento-1)", rangeDescription: "|rank| = 1" },
      { bucketIndex: 2, label: "moderado", color: "var(--mi-viento-2)", rangeDescription: "|rank| = 2" },
      { bucketIndex: 3, label: "fuerte",  color: "var(--mi-viento-3)", rangeDescription: "|rank| = 3" },
    ],
    noDataColor: "var(--mi-viento-nodata, #5C6638)",
    qualityFlagColor: "var(--mi-viento-stale, #C8B894)",
  },

  source: {
    name: "Coding editorial Mapa Inestable (Spec 41) — viento-v1.0.0",
    url: "/mapa/capas/viento",   // página dedicada Spec 39B cuando exista
    publishedDate: VIENTO_DATA.computed_at,
    lastFetched: VIENTO_DATA.computed_at,
  },

  periods: PERIODS,
  defaultPeriod: PERIODS[PERIODS.length - 1],

  getValueForCountry(countrySlug, period): LayerValue | null {
    // Parsear key "YYYY-Q#" (r3 — antes era "YYYY-W##")
    const match = period.key.match(/^(\d{4})-Q(\d)$/);
    if (!match) return null;
    const year = Number(match[1]);
    const quarter = Number(match[2]);

    // Último trimestre publicado del país antes o en (year, quarter) — modelo de tiempo por capa
    const entry = getLastVientoBeforeQuarter(countrySlug, year, quarter);
    if (!entry) return null;

    return {
      raw: entry.rank,
      formatted: formatViento(entry.rank),
      bucketIndex: magnitudBucket(entry.rank),
      delta: undefined, // r1 no calcula delta; tooltip usa intensidad si está disponible
      quality: "oficial", // coding manual editorial firmado (Spec 41 §decisión 6)
    };
  },

  getLastPeriodBefore(date): LayerPeriod | null {
    const sorted = [...PERIODS].sort((a, b) => b.date.localeCompare(a.date));
    return sorted.find(p => p.date <= date) ?? null;
  },

  readingGuideSlug: "viento",

  // Sin subindicadores en r1 (decisión local de Spec 44).
  // subIndicators: undefined,

  editorialByCountry: EDITORIAL,
};
```

Las funciones helper (`magnitudBucket`, `direction`, `formatViento`, `isoWeekEndDate`, `buildPeriods`) quedan en el mismo archivo y los tests les apuntan directo.

**Diferencias estructurales vs `precipitacion.ts` y `temperatura.ts`:**

- Importa de `lib/viento.ts`, no de `lib/macro-indicators.ts`.
- `buildPeriods` opera sobre `getAvailableWeeks()` (semanal) en lugar de armar trimestres desde la serie.
- `getValueForCountry` delega a `getLastVientoBeforeWeek` en lugar de buscar el datapoint exacto del período.
- `quality` siempre `"oficial"` en r1.
- Sin `subIndicators` (la propiedad queda `undefined`).
- `editorialByCountry` declara solo `ar` en r1 (el frontend muestra el bloque "Lectura editorial" para AR con texto curado y un mensaje genérico para los otros 9).

### 5. Reading guide markdown

Vive en `70-Producto/lecturas-capas/viento.md`. El drawer lo renderiza como full markdown.

Estructura propuesta:

```markdown
---
layer: viento
title: Viento · orientación pro-mercado / pro-estado
last_updated: 2026-05-21
---

# Viento

Una frase de entrada con la metáfora. Por qué el cambio político-económico semanal se lee como dirección y velocidad del viento. Por qué el proyecto evita "izquierda/derecha" y usa "pro-mercado ↔ pro-estado" (decisión 1 del EPIC 03).

## Cómo se lee

- Qué representa el color (magnitud absoluta del rank: cuán fuerte fue el movimiento en la semana).
- Qué representa el glyph orientado sobre el polígono (dirección: pro-mercado, neutro, pro-estado). Decisión local de Spec 44: la dirección es la lectura principal de esta capa, por eso vive en el glyph del mapa y no solo en leyenda/tooltip como en precipitación o temperatura.
- Por qué el bucket "Neutro" no es lectura política, es semanal: el coding mide cambio en la semana, no posicionamiento absoluto del gobierno. Un gobierno fuertemente pro-mercado en una semana sin novedades materiales tiene rank 0.
- Por qué la cadencia es semanal y qué pasa cuando el slider apunta entre semanas (modelo de tiempo por capa heredado de Spec 39).

## Eventos clave por país-semana

> El drawer renderiza los `eventos[]` del coding como lista de bullets cuando el lector abre un país. Cada bullet sale literal del archivo `.md` del coding; el codificador (Tomás en r1) los formula con la fuente entre paréntesis y una flecha indicando si suman pro-mercado, pro-estado o neutral.

## Lectura por país (piloto r1)

### Argentina
<TEXTO CURADO — pendiente de redacción editorial cuando haya ≥4 semanas de coding AR publicado. Estructura sugerida: fase actual del viento argentino, eventos pivote, comparación con W18 / W19, lectura cruzada con orientación del gobierno.>

## Otros países

> Lectura curada pendiente para Bolivia, Brasil, Chile, Colombia, Ecuador, Paraguay, Perú, Uruguay, Venezuela. El coding está en curso (cobertura mínima a alcanzar antes de la implementación en VS Code: ver pre-requisito operativo de Spec 44). Brasil y Chile entran en r2 con ≥2 semanas; los demás en r3.

## Fuente y método

- Coding editorial Mapa Inestable, sistema definido en Spec 41 (pipeline `viento-v1.0.0`).
- Escala diverging discreta -3 a +3 (7 niveles), aplicada semana a semana.
- Cobertura semanal: cada viernes a las ~16-17 ART el editor codifica las 10 semanas en `70-Producto/datos-viento/<slug>/YYYY-W##.md` y las publica vía el skill `coding-viento`.
- Trazabilidad: cada coding lleva codificador, fecha, justificativo y eventos clave con fuente.
- Cuándo Spec 41B introducirá señales adicionales: ver cronograma del epic.

## Limitaciones

- El coding es interpretativo. Diferentes codificadores pueden asignar rank distinto a la misma semana (Spec 41 r2 declara codificador único en r1; multi-codificador se evalúa cuando aparezca).
- La capa muestra solo la última semana publicada antes de la fecha del slider. Países sin coding histórico aparecen como `sin dato`.
- Subindicadores ausentes en r1; bloque "Noticias por sector" llega en r3 con Spec 41B.
```

### 6. Patrón de subindicadores — el plano técnico

Heredado del contrato `LayerSubIndicator` (Spec 42) **pero no usado en r1.** El campo `subIndicators?` del contrato `Layer` queda `undefined` en `vientoLayer`. La estructura para r3 (cuando entre Spec 41B):

```ts
// Tentativa r3 — se cierra en sub-spec acoplada cuando Spec 41B esté en producción
vientoLayer.subIndicators = [
  { slug: "viento.regulacion",  label: "Regulación",      unit: "score",  invertGood: undefined, getValueForCountry: ..., getSeries: ... },
  { slug: "viento.fiscal",      label: "Política fiscal", unit: "score",  invertGood: undefined, getValueForCountry: ..., getSeries: ... },
  { slug: "viento.discurso",    label: "Discurso oficial",unit: "score",  invertGood: undefined, getValueForCountry: ..., getSeries: ... },
  { slug: "viento.exterior",    label: "Pol. exterior",   unit: "score",  invertGood: undefined, getValueForCountry: ..., getSeries: ... },
];
```

**Nota sobre `invertGood`.** Las dimensiones de viento no tienen un "mejor" o "peor" universal (la dirección pro-mercado no es buena ni mala en abstracto — depende del marco interpretativo del lector). Por eso `invertGood` para subindicadores de viento queda en `undefined` en lugar de `true`/`false`. La sparkline del drawer renderiza con color neutro para tendencia, no terracota-warn/tinta como en Spec 42/43. Eso es decisión local de Spec 44 r3 que se confirma cuando se cierre Spec 41B.

### 7. Cobertura editorial — piloto vs no-piloto

| Plano | 1 país piloto (AR) | 9 países restantes (BO, BR, CL, CO, EC, PE, PY, UY, VE) |
|---|---|---|
| Color de la capa en el mapa | Renderizado con dato real (cuando hay coding publicado) | Renderizado con dato real (una vez cumplido el pre-requisito operativo) |
| Glyph orientado sobre el polígono | Sí | Sí |
| Hover / tooltip con valor rank + dirección | Sí | Sí |
| Reading drawer largo (al click) — bloque "Lectura" curado | Texto curado editorialmente | Texto mínimo: "Lectura editorial pendiente — ver introducción de la capa" + link a `viento.md` |
| Reading drawer — bloque "Eventos clave" | Lista de `eventos[]` del coding más reciente del país | Lista de `eventos[]` del coding más reciente del país |
| Reading drawer — bloque "Justificativo" | Texto del campo `justificativo` del coding | Texto del campo `justificativo` del coding |
| Reading guide markdown (`viento.md`) | Sección curada con contexto histórico, fases identificables, lectura de eventos | Mención en sección "Otros países" como pendiente |

**Divergencia local #5 — piloto solo AR.** Spec 42/43 declaran piloto AR/BR/CL (3 países). Spec 44 declara piloto **solo AR** en r1 por la realidad operativa del coding: hoy solo AR tiene 2 semanas publicadas; BR y CL están en borrador. Entran en piloto editorial recién en r2 (cuando haya ≥2 semanas publicadas cada uno) y r3 (los demás). El pre-requisito operativo del frontmatter exige cobertura técnica mínima antes del handoff, pero el "piloto editorial" del reading guide es decisión independiente.

**Por qué AR y no esperar a tener 3 países piloto.** Decisión de Tomás (sesión 2026-05-21): el ritmo de coding semanal es la única forma de llegar a cobertura — bloquear Spec 44 hasta AR/BR/CL implicaría posponer la spec varias semanas. Es preferible diseñar la capa con AR como ancla, declarar el pre-requisito operativo en frontmatter para que el handoff a VS Code llegue con cobertura razonable, y dejar BR/CL para r2.

---

## Archivos a tocar

| Archivo | Acción |
|---|---|
| `platform/frontend/src/lib/layers/viento.ts` | REESCRIBIR — reemplaza el stub sintético con la implementación descripta en §4 |
| `platform/frontend/src/styles/layers.css` | EXTENDER — agregar tokens `--mi-viento-*`. Si Spec 42/43 todavía no crearon el archivo, Spec 44 lo crea inicializándolo con tokens de las tres capas |
| `70-Producto/design-system/mapa/glyphs/viento.svg` | NUEVO — SSOT en vault, entregable de la sesión de Product Design del Anexo A |
| `platform/frontend/public/mapa/glyphs/viento.svg` | NUEVO — copia sincronizada del vault una vez resuelto Anexo A |
| `70-Producto/design-system/mapa/glyphs/README.md` | ACTUALIZAR — marcar `viento.svg` como activo + agregar el patrón "glyph orientado" al sistema (qué capas pueden tener orientación y qué mecánica visual usar) |
| `70-Producto/lecturas-capas/viento.md` | NUEVO — reading guide markdown, contenido para AR + intro general |
| `platform/frontend/src/components/MapaTorresGarcia.tsx` | EXTENDER — render del glyph orientado sobre cada hot-zone con dato cuando la capa viento está activa. Mecánica visual de orientación según decisión Anexo A |
| `platform/frontend/src/components/LayerLegend.tsx` | VERIFICAR — debe soportar 4 buckets (no 5) cuando la capa lo declara. Si el componente asume 5 fijos, refactor para que consuma `legend.buckets.length`. Probable que Spec 42/43 ya lo dejaron variable, pero verificar al implementar |
| `platform/frontend/src/components/LayerReadingDrawer.tsx` | EXTENDER — soportar el bloque "Eventos clave" con lista de bullets cuando la capa expone eventos por país (vía un helper nuevo `getEventsForCountry` que esta spec agrega a `lib/viento.ts`) |

---

## Criterios de aceptación

| # | Criterio | Verificación |
|---|---|---|
| AC1 | `vientoLayer` cumple el contrato `Layer` de Spec 39 (typecheck pasa) | `tsc --noEmit` |
| AC2 | **Condicional al pre-requisito operativo:** con coding viento publicado para ≥10/10 países, los 10 países renderizan con color de bucket correcto en al menos un período | Smoke test: activar capa, inspeccionar fill de los 10 polígonos |
| AC3 | Cobertura parcial (hoy: solo AR con coding publicado) renderiza AR con color real, los otros 9 con `noData` color. La capa NO se oculta del LayerController | Smoke test sobre el JSON actual: solo AR tiene fill, los demás `noData` |
| AC4 | `getValueForCountry` retorna valor formateado correcto con signo + label de dirección (ej: `+2 pro-mercado`, `−2 pro-estado`, `0 neutro`) | Test unitario con fixtures de rank conocidos |
| AC5 | `magnitudBucket(0) === 0`, `magnitudBucket(2) === 2`, `magnitudBucket(-3) === 3` | Test unitario |
| AC6 | `direction(0) === "neutro"`, `direction(-2) === "pro-estado"`, `direction(3) === "pro-mercado"` | Test unitario |
| AC7 | `formatViento(0) === "0 neutro"`, `formatViento(2) === "+2 pro-mercado"`, `formatViento(-3) === "−3 pro-estado"` | Test unitario |
| AC8 | `buildPeriods` produce una `LayerPeriod[]` con tantos elementos como semanas hay en `getAvailableWeeks()`. Cada `LayerPeriod` tiene `key: "YYYY-W##"`, `date: <ISO domingo>`, `label: "Sem N · YYYY"` | Test unitario |
| AC9 | `getLastPeriodBefore("2026-05-15")` devuelve la `LayerPeriod` de la última semana publicada ≤ esa fecha (en el JSON actual: W19) | Test unitario |
| AC10 | `getValueForCountry("ar", { key: "2026-W21", ... })` devuelve el rank de W19 (última publicada antes de W21) gracias al fallback `getLastVientoBeforeWeek` | Test unitario |
| AC11 | Reading guide markdown se renderiza correctamente en el drawer para AR | Click en AR → drawer muestra sección "Argentina" con texto curado |
| AC12 | Para los 9 países no-piloto, el drawer muestra el mensaje genérico + link a la intro de la capa | Click en BO → drawer dice "Lectura editorial pendiente" + link |
| AC13 | El bloque "Eventos clave" del drawer renderiza la lista de `eventos[]` del último coding publicado de cada país (cuando exista) | Click en AR → drawer muestra los 3-4 bullets de eventos del coding W19 |
| AC14 | El bloque "Justificativo" del drawer renderiza el texto del campo `justificativo` del último coding publicado | Click en AR → drawer incluye el justificativo de W19 |
| AC15 | Glyph SVG `viento.svg` + `viento-neutro.svg` definitivos entregados por Product Design (Spec 44 r2 · #18.a + #18.b). Formato: viewBox 48×48, `stroke="currentColor"`, `fill="none"`, `stroke-width` 2 (con secundarios a 1.7), `stroke-linecap`/`linejoin="round"`. SSOT en `70-Producto/design-system/mapa/glyphs/` con copia sincronizada en frontend pendiente para sesión VS Code (`platform/frontend/public/mapa/glyphs/`) | Inspect DOM del LayerController + diff binario `vault ↔ public/` |
| AC16 | **Render del glyph orientado sobre cada hot-zone con dato (mecánica V3).** El componente del mapa aplica la siguiente lógica: (a) `rank === undefined` → no renderiza glyph; (b) `rank === 0` → renderea `viento-neutro.svg` tal cual; (c) `rank > 0` → renderea `viento.svg` tal cual (apunta a la derecha = pro-mercado); (d) `rank < 0` → renderea `viento.svg` envuelto en `<g transform="scaleX(-1) translate(-48, 0)">` (apunta a la izquierda = pro-estado). Tamaño visual: 24-32px sobre cada polígono. El glyph NO se renderiza sobre países con `noData` | Smoke test: activar capa viento, AR muestra `viento.svg` orientado a la derecha (último rank +1, pro-mercado); ningún otro país muestra glyph en r1 (sin coding publicado). Para AR W19 (rank +1) y AR W18 (rank +3) ambos renderean el mismo `viento.svg` sin scaleX (solo cambia el bucket de fill) |
| AC17 | Tokens CSS `--mi-viento-{0..3}` están definidos y el contraste con `--mi-paper` cumple WCAG AA para texto sobre fill | Lighthouse / contrast checker |
| AC18 | Modulación por intensidad: cuando el coding declara `intensidad ∈ [0,1]`, la opacidad del fill se modula entre 0.7 (intensidad 0) y 1.0 (intensidad 1). AR W18 con intensidad 0.85 se rendea con opacidad ~0.96; AR W19 con intensidad 0.4 con opacidad ~0.82. La diferencia es visible pero sutil | Smoke test: comparar fill de AR en W18 vs W19 |
| AC19 | Tooltip y drawer muestran el valor formateado con signo + label explícito (`pro-mercado` / `pro-estado` / `neutro`). La leyenda incluye un bloque "Dirección" que aclara la convención de orientación del glyph | Inspección visual: hover sobre AR muestra `+1 pro-mercado` (último coding); leyenda incluye bloque "Dirección" con 3 filas explicativas (pro-estado / neutro / pro-mercado) + ícono representativo del glyph orientado |
| AC20 | El slider del LayerController muestra correctamente el rótulo de período cuando la capa viento está activa (ej. "Sem 19 · 2026") y permite navegar a períodos vacíos donde la capa renderiza con `noData` global o última semana publicada según corresponda | Smoke test: mover slider a fechas anteriores a W18 → AR debe renderizar `noData`; mover slider a fechas entre W19 y W21 (no publicada) → AR debe renderizar el último publicado (W19) |

**AC2 queda condicional** al pre-requisito operativo (cobertura mínima de coding). **AC15 cerrado del lado del SSOT en r2** (SVGs entregados al vault); sincronización al frontend se cierra en la sesión VS Code. **AC16 con mecánica definida en r2** (V3 vía `scaleX(-1)`); verificación visual se cierra en la sesión VS Code. El resto cierra en la sesión VS Code.

---

## Edge cases

- **País sin ningún coding publicado en la historia** (caso actual de 9 países) → `getValueForCountry` retorna `null`. Render: fill con `noDataColor`. **No se renderiza glyph orientado** sobre ese país. Hover: tooltip dice "sin coding publicado para esta semana".
- **País con coding publicado en semanas pasadas pero no en la semana activa del slider** → `getLastVientoBeforeWeek` devuelve la última publicada anterior; render con bucket correspondiente y glyph orientado según esa última publicada. Leyenda del polígono muestra la fecha de la semana usada (ej: "última lectura: Sem 19").
- **Coding publicado con `rank` fuera del rango -3..+3** → caso ya bloqueado por `build_viento.mjs` (validación `VALID_RANKS`). Spec 44 asume el contrato del JSON.
- **`intensidad` faltante** → modulación de opacidad asume 1.0. No rompe.
- **`intensidad` fuera de [0,1]** → caso ya bloqueado por `build_viento.mjs` (warning + se ignora). Spec 44 asume el contrato.
- **Slider apunta a una fecha antes del coding más antiguo (W18-2026 hoy)** → `getLastPeriodBefore` devuelve el sentinel del fallback (si `getAvailableWeeks()` devolvió vacío) o `null` si hay períodos pero ninguno ≤ esa fecha. En ese caso `vientoLayer.defaultPeriod` se usa como fallback en runtime del componente que consume la capa (responsabilidad del componente).
- **Semana con coding publicado para algunos países y borradores para otros** → `build_viento.mjs` solo incluye `estado: publicada`. La capa muestra dato real para los publicados, `noData` para los que están en borrador.
- **Coding revisado/corregido** (sobrescritura del `.md` antes del próximo build) → el siguiente build incorpora el cambio. El frontend re-importa el JSON al rebuild. Sin manejo adicional en runtime.
- **Cambio de pipeline version** (viento-v1.0.0 → viento-v1.1.0) → asumimos contrato JSON estable según Spec 41 §contrato. Si cambia, esta spec re-vasalla en r2.
- **AR con rank 0 (semana neutra)** → render del fill bucket 0 + glyph orientado en variante neutra (Anexo A define qué variante se usa para neutro: posible "glyph quieto", posible "glyph ausente"). Decisión cerrada en r2 con Product Design.

---

## Decisiones tomadas

### Cerradas en r1 (sesión 2026-05-21)

| # | Tema | Decisión | Razón |
|---|---|---|---|
| 1 | Alcance r1 | Capa **mínima viable**: indicador principal único (rank del coding) + glyph orientado + reading guide + cobertura piloto AR. Sin subindicadores | El JSON del coding no expone componentes estructurados; calcular subindicadores derivados sería honesto técnicamente pero engañoso semánticamente. Esperar a Spec 41B introduce dimensiones reales |
| 2 | Indicador principal | `rank` (-3..+3) del coding manual editorial de Spec 41, vía el JSON compilado por `build_viento.mjs` | Definido en decisión 1 del epic + Spec 41 §1.3. Fuente única, sin pipeline externo |
| 3 | Sin subindicadores en r1 | El JSON expone `rank`, `direccion`, `intensidad`, `justificativo`, `eventos[]`. No hay dimensiones estructuradas comparables como sparklines | Divergencia local de Spec 44 vs el patrón Spec 42/43. Decisión condicional r3: cuando Spec 41B esté en producción, agregar bloque "Noticias por sector" como subindicadores |
| 4 | Tipo de escala | **Secuencial intensidad** (un solo tono, más oscuro = más extremo). Magnitud y dirección se separan | Heredado de Spec 42 §decisión 4 y Spec 43 §decisión 6. Patrón estable; la separación de magnitud y dirección es lo que habilita el glyph orientado |
| 5 | Buckets de magnitud | **4 buckets** (0..3) matcheando 1:1 la escala discreta nativa del coding (`|rank|` ∈ {0, 1, 2, 3}) — divergencia local vs Spec 42/43 (5 buckets) | Forzar 5 buckets dejaría el bucket 4 vacío permanentemente. Mejor matchear la escala nativa. El componente `LayerLegend` debe soportar variar el número de buckets entre capas (probable que ya lo soporte por contrato) |
| 6 | Etiqueta del bucket 0 | **"Neutro"** (no "sin cambio" como Spec 42 ni "Estancado" como Spec 43) — divergencia local consciente | El coding de Spec 41 ya usa `direccion: "neutro"` para `rank=0`. La etiqueta coincide con la convención del pipeline. `rank=0` no implica indefinición política ni neutralidad estática — significa "no hubo cambios materiales esta semana" |
| 7 | Paleta | Terracota con sesgo ocre profundo, 4 pasos de saturación. Hex tentativos en §3.3; Product Design confirma en Anexo A | Coherente con DS Grabado. Diferenciable de precipitación (terracota base) y temperatura (terracota cálido). Anticipa Spec 47 (multi-capa) |
| 8 | Cobertura editorial r1 | Piloto **solo AR** (no AR/BR/CL como Spec 42/43) — divergencia local | Realidad operativa: hoy solo AR tiene 2 semanas publicadas. BR y CL entran en r2. Decisión de Tomás 2026-05-21: no bloquear la spec por cobertura editorial |
| 9 | Cobertura técnica r1 | **Pre-requisito operativo** declarado en frontmatter: AR ≥4 semanas, BR/CL ≥2 semanas, resto ≥1 semana antes del handoff a VS Code. Después, los 10 países renderizan con dato real | Patrón análogo al pre-requisito de Spec 43 (hidratar c7 contra OIT). Bloquea el handoff sin bloquear el diseño |
| 10 | Cadencia | ~~`cadence: "semanal"` declarado~~. **Reescrita en r3 (2026-05-21):** `cadence: "trimestral"` (Spec 41 r3 bajó la cadencia editorial). Slider trimestral nativo, períodos construidos desde `getAvailableQuarters()`. Países sin coding del trimestre exacto caen al último publicado vía `getLastVientoBeforeQuarter` | Heredado de Spec 41 r3. Coherente con Spec 42/43. La divergencia "cadencia semanal" se cae como divergencia local |
| 11 | Fallback del slider | Modelo de tiempo por capa (decisión 8 del epic): último trimestre publicado antes de la fecha activa, por país. Sin snap del slider a trimestres en r1 | Honesto con el modelo de tiempo del epic. Snap a trimestres es decisión condicional r4 si aparece evidencia de que el slider continuo confunde |
| 12 | Velocidad del cambio | El `rank` (-3..+3) ya mide el cambio en la semana (no posicionamiento absoluto del gobierno) por decisión 3 de Spec 41. La "velocidad" del epic es esa cifra | Sin métrica adicional en r1. Sin delta vs semana anterior en tooltip. Sin capa "aceleración" |
| 13 | Modulación por intensidad | Cuando el `VientoWeekEntry` declara `intensidad ∈ [0,1]`, se aplica opacidad sobre el fill: `opacity = 0.7 + 0.3 * intensidad`. Sin `intensidad`, se asume 1.0 | Honesto con el coding (Spec 41 §1.3 ya declara que `intensidad` modula visualmente). Permite distinguir una semana decisiva (intensidad 0.9) de una semana habitual (intensidad 0.4) sin agregar buckets |
| 14 | Patrón A.4 — tooltip + drawer | Heredado intacto de Spec 42 r2 con ajuste: drawer sin sparklines, sin bloque "Subindicadores". El drawer tiene encabezado + bloque "Lectura editorial" (curado solo para AR) + bloque "Eventos clave" (lista de `eventos[]` del coding) + bloque "Justificativo" (texto del campo del coding) | Coherencia con Spec 42/43 a nivel de jerarquía visual. Las divergencias (sin subindicadores) están documentadas explícitamente |
| 15 | **B.4 diverge — glyph orientado sobre el mapa** | El color del polígono codifica solo magnitud (`bucketIndex` ∈ 0..3); cada hot-zone con dato lleva encima un glyph orientado (izquierda = pro-estado, derecha = pro-mercado, neutro = posible variante quieta o ausente — Anexo A decide). **Cierra la decisión condicional #3 de Spec 42 r2 y Spec 43 r2** sobre el caveat heredable de B.4 para viento | En viento la dirección es la lectura principal, no auxiliar. B.4 puro (solo en leyenda/tooltip) perdería legibilidad pasiva. Paleta diverging rompería la coherencia con Spec 42/43. Glyph orientado preserva coherencia cromática + visibilidad de dirección en el mapa |
| 16 | Render de quality flag | Coding manual siempre declara `quality: "oficial"` por convención de Spec 41 §decisión 6. Los tokens `--mi-viento-stale` quedan declarados para forward-compatibility con Spec 41B (que sí podrá generar señales estimadas) | Sin lógica de render condicional en r1 — pero forward-compatible |
| 17 | Modelo de tiempo para slider continuo | El slider de Spec 39 sigue continuo (sin cambios). Spec 44 no requiere ajustes al slider en r1. Decisión condicional r3: marcas/ticks en el slider para semanas disponibles cuando la capa viento está activa, si aparece evidencia de que el continuo confunde | Evitar churn en Spec 39. La feature de marcas se diseña con uso real, no en abstracto |

### Cerradas en r2 (sesión 2026-05-21 · Product Design)

Sesión de diseño en Mapa Inestable Design System (`spec44/index.html`). Decisión #18 era acoplada (motivo + mecánica) y se cerró en una sola sesión.

| # | Tema | Decisión | Razón |
|---|---|---|---|
| 18.a | Diseño del glyph viento | **P.1 · Onda + punta direccional.** Principal: onda sinusoidal de 3 humps que cruza horizontalmente (y ≈ 24), con extensión a la derecha que termina en una punta direccional (3 trazos formando una flecha aguda). Secundarios: 2 mini-ondas más cortas y finas (top y ≈ 14, bottom y ≈ 34, 1 hump cada una, `stroke-width: 1.7` vs 2 del principal). Elegido sobre P.2 (flecha + estela), P.3 (veleta vertical), P.4 (chevron desacoplado), P.5 (molinete rotacional) | (a) Materializa el caveat heredado de Spec 43 r2 (vocabulario ondas/sinusoides reservado para viento — T.4 fue descartado para temperatura precisamente para preservarlo acá). (b) Aporta un tercer eje compositivo nuevo al sistema: **stroke abierto horizontal**, distinto de los contornos cerrados de precipitación (horizontal) y temperatura (vertical). (c) La asimetría intrínseca (la punta sobresale del flujo de la onda) habilita lectura de dirección sin texto incluso a 24px sobre el bucket más oscuro. (d) P.3 colisiona con temperatura en LayerCtrl a 24px; P.5 rompe la preferencia del sistema por ejes claros; P.2 y P.4 cargan la dirección en elementos que pueden leerse como UI (label, chevron) en vez de glyph unitario |
| 18.b | Mecánica visual de orientación | **V3 · Asimetría intrínseca + neutro distinto.** 2 SVGs entregados: `viento.svg` (activo canónico, pro-mercado, apunta a la derecha) + `viento-neutro.svg` (variante propia para `rank=0`, NO ausencia — reemplaza mini-ondas por **dashes estáticos** 4 trazos horizontales cortos y la onda principal sin punta; significado editorial: "con dato pero sin movimiento direccional"). Pro-estado se renderea por código: `<g transform="scaleX(-1) translate(-48, 0)">` aplicado al `viento.svg` por el componente del mapa. Elegido sobre V1 (3 variantes separadas), V2 (rotación 180° pura), V4 (glyph + indicador chico desacoplado), V5 (glyph compuesto continuo) | (a) V1 habría requerido 3 SVGs duplicando trabajo de mantenimiento. (b) V2 habría obligado a que el activo fuera simétrico-rotable, descartando la asimetría que hace que la dirección se lea sin texto a 24px. (c) V4 lee como "icon + flecha de UI" más que como glyph unitario, rompe la unidad visual del par "principal + secundarios". (d) V5 es interesante pero complejo de implementar (interpolación) sin retorno equivalente cuando el rank es discreto. V3 es el mejor compromiso entre simplicidad técnica (2 SVGs + un `scaleX`), honestidad visual (cada variante tiene cuerpo propio: el neutro no es "versión apagada" del activo) y alineación con el sistema |

**Compromisos aceptados en r2:**

- **Stroke abierto a 24px sobre el bucket más oscuro.** Validado en tira de contraste de la sesión. La onda principal mantiene legibilidad sobre `--mi-viento-3` (≈ `#74511f`) con stroke en tinta oscura del DS. Si en producción se observa pérdida de contraste en monitores oscuros, considerar bajar `--mi-viento-3` un punto (tono `#7a5c25` aprox) — decisión condicional r3.
- **Render condicional preservado.** El glyph no aparece sobre países sin coding. En la cobertura técnica actual (1/10 al diseñarse la spec), solo AR muestra glyph. Es honesto con el lector: la capa existe pero la cobertura es gradual.
- **Posible variante de stroke-width por bucket o patrón solid/dashed para distinguir intensidades sin saturar la paleta** — decisión condicional r3 si aparece evidencia de confusión entre buckets contiguos con mismo glyph.

**Consumo del vocabulario de ondas/sinusoides cerrado.** El caveat heredable Spec 42→44 sobre el vocabulario reservado para viento queda **cerrado** con el consumo efectivo en P.1. Spec 45 (presión) hereda la restricción: no reusar ondas/sinusoides. README de glyphs actualizado con esta restricción y con la lista de vocabularios disponibles para Spec 45 (anillos, barras, asterismos, contornos verticales más altos, eje vertical abierto).

**Sistema de glyphs consolidado en 3 ejes compositivos distintos:**

| Eje compositivo | Capa | Glyph |
|---|---|---|
| Horizontal cerrado | Precipitación | nube + 3 gotas (C.4) |
| Vertical cerrado | Temperatura | termómetro + 3 marcas (T.1) |
| Horizontal abierto | Viento | onda + punta direccional (P.1) |

---

## Decisiones abiertas — para r3 (ya no quedan para r2)

### Cerradas en r3 (sesión 2026-05-21 — herencia del cambio de cadencia de Spec 41 r3)

| # | Tema | Decisión | Razón |
|---|---|---|---|
| 19 | Cadencia heredada de Spec 41 r3 | Spec 44 absorbe el cambio: `cadence: "trimestral"` (era "semanal"). Módulo `lib/layers/viento.ts` reescrito: `buildPeriods` usa `getAvailableQuarters()`; `getValueForCountry` parsea key `YYYY-Q#`; `getLastVientoBeforeQuarter` reemplaza a `getLastVientoBeforeWeek`; `quarterEndDate` (helper compartido con Spec 43) reemplaza a `isoWeekEndDate`. JSON consumido es `viento-v2.0.0` con `series_trimestral` | Cascada desde Spec 41 r3 (decisión #17). Coherencia con Spec 42/43 en cadencia. La divergencia (e) "cadencia semanal nativa" se cae como divergencia local — Spec 44 baja de 5 divergencias a 4 |
| 20 | Pre-requisito operativo reescrito | Antes: AR ≥4 semanas, BR/CL ≥2 semanas, resto ≥1 semana. **r3:** los 10 países con ≥1 trimestre publicado. AR ya cumple con `2026-Q2.md` migrado (decisión #22 de Spec 41 r3). Resto alcanza la cobertura al publicar el coding de Q2-2026 a partir del 2026-07-03 | Cadencia trimestral hace el pre-requisito mucho más liviano y alcanzable en un solo ciclo de cierre de trimestre |
| 21 | AC reescritos | AC8 (sobre buildPeriods con semanas) cambia a "buildPeriods produce LayerPeriod[] desde getAvailableQuarters() con key `YYYY-Q#`, date= último día del trimestre, label `Q# YYYY`". AC9 (getLastPeriodBefore con semana ISO) cambia a "devuelve LayerPeriod del último trimestre publicado ≤ esa fecha". AC10 (fallback con getLastVientoBeforeWeek) cambia a "fallback con getLastVientoBeforeQuarter — AR Q3-2026 devuelve Q2-2026 si Q3 no está publicado". AC20 (slider con marcas semanales) cambia a "slider con label trimestral; navegar a trimestre sin coding renderiza con último publicado por país" | Adaptación mecánica a la cadencia trimestral |
| 22 | Formato del label del período | Tentativa: `"Q2 2026"` (corto). Coincide con el label de Spec 43 (que también usa trimestres) — coherencia entre capas | Heredado de Spec 43 |

**Sin decisiones bloqueantes para r4.** La decisión #18 (acoplada 18.a + 18.b) cerró en r2 (sesión de Product Design 2026-05-21). El cambio r3 de cadencia es absorbente — no abre decisiones nuevas. Los SVGs están en el vault; el handoff a VS Code se hace una vez cumplido el pre-requisito operativo (cobertura mínima de 1 trimestre publicado por país, alcanzable a partir del 2026-07-03).

### Condicionales para r3 — re-evaluaciones con evidencia operativa

1. **Calibración de buckets.** Una vez cumplido el pre-requisito operativo y con varias semanas de coding acumulado, mirar la distribución empírica de `|rank|` en los 10 países. Si el bucket 1 (`leve`) absorbe >70% de los datapoints (caso probable porque el editor tiende a ranks moderados), reescalar o redefinir labels. Decisión esperada en r2-r3.
2. **Subindicadores estructurados.** Cuando Spec 41B esté en producción (8-12 semanas de coding acumulado), agregar el bloque "Noticias por sector" como `subIndicators`. Dimensiones tentativas: regulación, fiscal, discurso, exterior. Sub-spec acoplada a Spec 41B definirá el contrato exacto.
3. **Texto editorial curado para los 9 países restantes.** BR y CL entran en r2 (cuando haya ≥2 semanas publicadas cada uno). BO, CO, EC, PE, PY, UY, VE en r3 (con ≥4 semanas cada uno).
4. **Snap del slider a semanas.** Si aparece evidencia de que el slider continuo confunde al usuario sobre la cadencia de la capa viento, agregar modo "snap" al slider cuando la capa está activa. Requiere cambios a Spec 39 (r3).
5. **Marcas/ticks en el slider** para visualizar las semanas disponibles. Decisión condicional, no rompe contrato.
6. **Modulación por intensidad — verificación visual.** Si el overlay de opacidad sobre el Gaussian blur del fill produce confusión visual (los buckets dejan de ser distinguibles a baja intensidad), posponer modulación a r3 con un mecanismo alternativo (ej. trama sobre el fill).
7. **Discoverability de la convención del glyph orientado.** Si en producción aparece evidencia de que los usuarios no entienden que el glyph codifica dirección (esperan el color para eso), reforzar la leyenda con un ícono representativo del glyph orientado al lado del bloque "Dirección".
8. **Format del label de período.** Tentativa: `"Sem 19 · 2026"`. Si el slider de Spec 39 hace ilegible el label por espacio, ajustar a `"W19 · 2026"` o a rango de fechas.

### Caveats heredables para Specs futuras

- **Para Spec 45 (presión).** El caveat heredable de B.4 que Spec 42/43 documentaron y Spec 44 cerró diverge en favor del glyph orientado **es precedente local de Spec 44**, no patrón nuevo del sistema. Spec 45 debe revaluar B.4 según su propio caso de uso (Latinobarómetro tiene índices direccionales propios — confianza alta vs baja — donde la magnitud podría seguir siendo la lectura principal). Si Spec 45 decide divergir también, ese sería el segundo caso y empieza a ser patrón. Por ahora la divergencia es una.

---

## No incluido en esta spec

- Diseño final del glyph `viento.svg` + mecánica de orientación → Anexo A (bloqueante para r2).
- Reading guide curado para Bolivia, Brasil, Chile, Colombia, Ecuador, Paraguay, Perú, Uruguay, Venezuela → r2 (BR/CL) y r3 (los demás).
- Cobertura técnica completa (10/10 países con coding publicado) → pre-requisito operativo de cadencia del editor + Spec 41 (no de esta spec).
- Algoritmo híbrido de coding → Spec 41B (8-12 semanas).
- Subindicadores estructurados → r3 (acoplado a Spec 41B).
- Página dedicada de documentación profunda → Spec 39B (post-implementación de las 4 capas).
- Multi-capa simultánea → Spec 47.
- Subnacional (Brasil, Argentina) → spec posterior, granularidad país por decisión 10 del epic.
- Snap del slider a semanas → decisión condicional r3.
- Marcas/ticks en el slider para semanas disponibles → decisión condicional r3.

---

## Implementación sugerida

Orden recomendado en sesión de VS Code (asumiendo el pre-requisito operativo cumplido y Anexo A cerrado en r2):

1. **Pre-requisito operativo (Cowork + skill `coding-viento`):** publicar coding viento para AR ≥4 semanas, BR/CL ≥2 semanas, resto ≥1 semana. Verificar con `node platform/data/coding-viento/build_viento.mjs --dry-run`.
2. **Extender `layers.css`** con tokens `--mi-viento-0..3` + `--mi-viento-nodata` + `--mi-viento-stale` + `--mi-viento-glyph-stroke`. Si Spec 42/43 no crearon el archivo, crearlo con los tokens de las tres capas.
3. **Reescribir `lib/layers/viento.ts`** con `magnitudBucket`, `direction`, `formatViento`, `isoWeekEndDate`, `buildPeriods`, `getValueForCountry`, `getLastPeriodBefore`. Pasar typecheck.
4. **Tests unitarios** de las 5 funciones helper + de `getValueForCountry` con fixtures sintéticos.
5. **Sincronizar glyphs SVG viento** desde el SSOT del vault al frontend: copiar `70-Producto/design-system/mapa/glyphs/viento.svg` y `viento-neutro.svg` a `platform/frontend/public/mapa/glyphs/`.
6. **Extender `MapaTorresGarcia.tsx`** para renderizar el glyph orientado sobre cada polígono con dato real. Mecánica V3 cerrada en r2: (a) `rank === undefined` → no renderiza glyph; (b) `rank === 0` → renderea `viento-neutro.svg`; (c) `rank > 0` → renderea `viento.svg` tal cual; (d) `rank < 0` → renderea `viento.svg` envuelto en `<g transform="scaleX(-1) translate(-48, 0)">`. Pseudocódigo de referencia:

   ```tsx
   function renderVientoGlyph(country, size = 28) {
     if (country.rank === undefined) return null;
     if (country.rank === 0) {
       return <img src="/mapa/glyphs/viento-neutro.svg" width={size} height={size} />;
     }
     const flip = country.rank < 0;
     return (
       <g transform={flip ? `scale(-1 1) translate(-${size} 0)` : undefined}>
         <image href="/mapa/glyphs/viento.svg" width={size} height={size} />
       </g>
     );
   }
   ```

   Adaptar a la API real del componente (si usa `<svg>` inline con `<use href="#viento" />`, aplicar el transform al `<use>` directamente).
7. **Verificar `LayerLegend.tsx`** soporta 4 buckets dinámicos (probable que ya lo haga por contrato `legend.buckets: LayerBucket[]`). Si no, refactor pequeño para hacerlo data-driven.
8. **Extender `LayerReadingDrawer.tsx`** con los bloques "Eventos clave" y "Justificativo". Helper nuevo en `lib/viento.ts`: `getEventsForCountry(slug, period): string[]` y `getJustificativoForCountry(slug, period): string`. Ambos usan `getLastVientoBeforeWeek` internamente.
9. **Escribir `70-Producto/lecturas-capas/viento.md`** con contenido para AR (texto editorial final cuando haya ≥4 semanas para tener material) + intro general + sección "Otros países pendientes".
10. **Implementar modulación por intensidad** sobre el fill (opacidad). Verificar contra el Gaussian blur de Spec 39 que el resultado sigue distinguible entre buckets.
11. **Smoke test integrado**: activar capa Viento desde `/mapa`, navegar 5 períodos con el slider, abrir drawer en AR + 1 país no-piloto, mover slider a fechas entre semanas + a fechas anteriores al primer coding, verificar AC1-AC20 (AC15 y AC16 verifican el glyph y la orientación visualmente).

Tiempo estimado:
- Pasos 2-11 (asumiendo pre-requisito cumplido y Anexo A cerrado en r2): **1-2 días** en VS Code (más rápido que Spec 42 porque hereda mucho y NO tiene subindicadores).
- Cierre de Anexo A en sesión dedicada de Product Design: 1 sesión (más larga que Spec 43 por la sub-decisión acoplada de orientación).

---

## Anexo A · Brief para sesión de Product Design

> **Cerrado en r2 (2026-05-21)** en sesión de Product Design (Mapa Inestable Design System · spec44/index.html). Decisión #18 acoplada resuelta como **P.1 · onda + punta direccional** (sobre 4 candidatos alternativos P.2 flecha + estela, P.3 veleta vertical, P.4 chevron desacoplado, P.5 molinete rotacional) y **V3 · asimetría intrínseca + neutro distinto** (sobre 4 mecánicas alternativas V1 variantes separadas, V2 rotación 180° pura, V4 glyph + indicador desacoplado, V5 glyph compuesto continuo). 2 SVGs entregados al vault como SSOT: `viento.svg` + `viento-neutro.svg`. Detalle completo en §Decisiones tomadas · "Cerradas en r2". El brief de abajo se conserva como registro del input que abrió la sesión.

Este anexo es **autocontenido**. Se puede extraer y llevar a una sesión separada de Product Design sin necesidad de leer el resto de Spec 44.

### A.1 Contexto del producto

**Mapa Inestable** es una plataforma de análisis político-cultural de Sudamérica. Su pieza central es un **mapa Torres García invertido** (sur arriba, referencia a "América Invertida" de 1943) con hot-zones por país que abren análisis editoriales. Sitio actual: https://mapa-inestable-v1.vercel.app/mapa.

El epic en curso (EPIC 03) agrega cuatro **capas analíticas** estilo Windy sobre el mapa: viento, temperatura, presión, precipitación. La capa precipitación (Spec 42) y la capa temperatura (Spec 43) ya están diseñadas y listas para handoff. Spec 44 implementa la **tercera capa real — viento = orientación pro-mercado / pro-estado**.

### A.2 Dirección estética anclas

- **Nombre del estilo:** Grabado.
- **Tipografía display:** Alfa Slab One.
- **Color dominante:** terracota (`#b85a32` aproximado).
- **Color neutro:** papel crema (`#f4ead8`), tinta oscura (`#1f1813`).
- **Sin border-radius.** Todo cuadrado.
- **Sombras duras**, no difusas.
- Las fronteras del mapa están difuminadas con Gaussian blur (Spec 39).
- **Glyphs SVG custom**, no emojis. Cada capa tiene su propio glyph dibujado a mano alzada en el espíritu del proyecto.
- Sistema de glyphs cerrado en Spec 42 r2 (C.4) y Spec 43 r2 (#17): "elemento principal + elementos secundarios" en trazo manuscrito Grabado, `viewBox="0 0 48 48"`, `stroke="currentColor"`, `stroke-width` 1.5-2.5.

Referencias en el vault:
- `70-Producto/design-system/design-system.md` — tokens completos.
- `70-Producto/design-system/cover-style-guide.md` — guía de portadas (estilo aplicable).
- `70-Producto/design-system/mapa/glyphs/README.md` — patrón del sistema de glyphs + inventario.
- `70-Producto/design-system/mapa/glyphs/precipitacion.svg` — ancla horizontal del sistema (nube + 3 gotas).
- `70-Producto/design-system/mapa/glyphs/temperatura.svg` — ancla vertical del sistema (termómetro + 3 marcas).

### A.3 Lo que Spec 44 deja cerrado (no reabrir)

- **Indicador principal** = rank entero -3..+3 del coding manual editorial (Spec 41).
- **Escala secuencial intensidad** (un solo tono, 4 buckets de magnitud `|rank|` ∈ {0, 1, 2, 3}).
- **Etiqueta del bucket 0** = "Neutro".
- **Sin subindicadores** en r1 (divergencia local consciente).
- **Paleta de magnitud**: 4 pasos de terracota con sesgo ocre profundo (hex tentativos en §3.3 — Product Design puede ajustar dentro del DS Grabado).
- **Cobertura editorial piloto r1** = Argentina solo.
- **A.4** (UI subindicadores) = heredado de Spec 42 r2 pero sin sparklines en este caso (no hay subindicadores).
- **B.4 diverge** en favor del **glyph orientado sobre el mapa**. El color del polígono codifica solo magnitud; el glyph porta la dirección. **Esta divergencia ya está cerrada** — Anexo A no reabre la decisión "qué codifica la dirección", solo "cómo se ve el glyph y su mecánica".

### A.4 Decisión única acoplada · Glyph viento + mecánica visual de orientación

**El problema.** Spec 44 cerró que la dirección pro-mercado ↔ pro-estado vive en un glyph orientado encima de cada polígono del mapa (no en el color). Product Design tiene que cerrar **dos sub-decisiones acopladas** que no se pueden separar:

- **18.a — Diseño del glyph base** (el motivo gráfico).
- **18.b — Mecánica visual de orientación** (cómo se diferencia pro-mercado de pro-estado de neutro sobre el mapa).

**Restricciones heredadas del sistema:**

- `viewBox="0 0 48 48"`, `stroke="currentColor"`, `fill="none"`, `stroke-width` entre 1.5 y 2.5.
- Patrón "elemento principal + secundarios" cerrado en Spec 42 r2 (C.4).
- El glyph debe leer a **24px** (LayerController) y a **24-32px** (overlay sobre cada polígono del mapa).
- Coherencia con `precipitacion.svg` (forma horizontal: nube + 3 gotas) y `temperatura.svg` (forma vertical: termómetro + 3 marcas). El sistema de glyphs prefiere ejes compositivos claros (vertical u horizontal) sobre diseños rotacionalmente simétricos.
- **Vocabulario reservado para viento (caveat heredado de Spec 43 r2):** ondas/sinusoides quedaron libres para esta capa. T.4 fue descartado para temperatura precisamente para preservarlo acá.
- El glyph **no se renderiza sobre países con `noData`** (no hay variante "sin dato" del glyph; el render condicional lo maneja el componente del mapa).

**Restricciones específicas a esta capa:**

- El glyph debe leer **encima del fill terracota** del polígono (4 niveles de saturación: claro a oscuro). El stroke del glyph necesita contraste sobre el bucket más oscuro (`--mi-viento-3` ≈ `#74511f` tentativo). Tentativa actual: stroke `--mi-ink` (tinta oscura). Product Design puede proponer un token alternativo o variante por bucket.
- El polígono ya tiene Gaussian blur de Spec 39 — el glyph se rendea encima del fill difuminado. Verificar que la combinación se vea bien.
- Debe haber **tres lecturas distintas**: pro-mercado (rank > 0), neutro (rank = 0), pro-estado (rank < 0).

**Opciones a explorar (no exhaustivas — Product Design puede proponer otras).**

#### Sub-decisión 18.a — Diseño del glyph base

Candidatos tentativos:

1. **Ondas/sinusoides + indicador de eje** (vocabulario reservado). Ej: una onda con un acento direccional (mástil o flecha) al final.
2. **Flecha + líneas de viento** (literal y reconocible).
3. **Veleta + cardinales** (eje vertical con asta + indicador horizontal de dirección + marcas chicas como secundarios).
4. **Molinete con aspas** (rotacional, pero las aspas asimétricas pueden codificar dirección).
5. **Banderín + asta** (asta como elemento principal, banderín como secundario que apunta).
6. **Otra** que Product Design proponga.

#### Sub-decisión 18.b — Mecánica visual de orientación

Cómo se diferencia visualmente "pro-mercado" de "pro-estado" sobre el mapa:

- **V1 — Variantes izq/der.** Dos SVGs separados: `viento.svg` (apunta a la derecha = pro-mercado) y `viento-pro-estado.svg` (apunta a la izquierda = pro-estado, espejado). Variante neutra: ¿un tercer SVG `viento-neutro.svg`? ¿O glyph ausente cuando `rank=0`?
- **V2 — Rotación 180°.** Un único SVG, el componente del mapa aplica `transform: scaleX(-1)` para pro-estado. Más simple técnicamente pero limita el diseño a uno simétrico-rotable.
- **V3 — Glyph con eje compositivo asimétrico** + variante neutra distinta. Ej: un glyph que ya apunta a la derecha como "pro-mercado", se voltea horizontalmente para "pro-estado", y la variante "neutro" es un glyph distinto (asta sin banderín, onda sin acento direccional, etc.).
- **V4 — Glyph + indicador chico de dirección.** El glyph principal es siempre el mismo; al lado lleva un chevron/dot/punta-de-flecha que apunta izquierda o derecha. Para neutro, el indicador no se renderiza o muestra un dot centrado.
- **V5 — Glyph compuesto.** Un solo SVG que codifica dirección dentro del propio diseño (ej. cara de un molinete cuyas aspas apuntan más a un lado). Cambia con `rank` de forma continua — más complejo de implementar pero más expresivo.
- **V6 — Otra** que Product Design proponga.

**Cuestiones acopladas a resolver juntas:**

- Si la mecánica es V1 (variantes), el glyph 18.a debe estar diseñado para tener una contraparte espejada que se lea bien.
- Si la mecánica es V2 (rotación), el glyph 18.a no puede ser asimétrico de un modo que se pierda al voltearlo.
- Si la mecánica es V4 (glyph + indicador), el glyph 18.a puede ser más libre porque la dirección la carga el indicador chico.
- La variante para `rank=0` (neutro) es decisión paralela: glyph ausente / glyph genérico / glyph quieto / dot centrado.

**Outputs esperados de la sesión de Product Design.**

- 3-5 propuestas combinadas (cada propuesta = una elección de 18.a + 18.b + tratamiento de neutro). Formatos: HTML, Figma, sketches, paralelos a los comparadores que armaron Spec 42 y Spec 43.
- Para cada propuesta:
  - SVG del glyph en sus variantes (pro-mercado, pro-estado, neutro).
  - Cómo se ve a 24px (LayerController) y a 24-32px (overlay sobre el polígono).
  - Render simulado sobre el mapa con AR (rank +1, pro-mercado) — el único país con dato real en r1.
  - Test visual sobre los 4 buckets de fill (verificar que el glyph se lee sobre `--mi-viento-3` que es el más oscuro).
- Recomendación con razón breve. Idealmente la razón conecta con los patrones formales del sistema (forma compositiva, paralelismo con precipitación y temperatura).

**Outputs del cierre.**

- SVG(s) final(es) entregado(s) a `70-Producto/design-system/mapa/glyphs/viento*.svg` (uno o varios según mecánica elegida).
- Actualización del README del directorio marcando `viento.svg` como activo + agregando el patrón "glyph orientado" al sistema (qué capas pueden usarlo y qué mecánicas son válidas).
- Decisión registrada en Spec 44 §Decisiones tomadas como cerrada en r2 (decisión #18 con sub-decisiones 18.a y 18.b).

### A.5 Modo de operación

- Esta sesión puede correr en cualquier herramienta (Cowork con un skill diferente, Figma, sesión de diseño visual standalone).
- El resultado se ingresa de vuelta a Spec 44 como decisión #18 (con 18.a y 18.b cerradas) → la spec bumpea a borrador-r2.
- Una vez cerrada r2 + cumplido el pre-requisito operativo (coding mínimo de los 10 países), la spec va a VS Code para implementación final.

---

## Histórico

| Fecha | Cambio | Razón |
|---|---|---|
| 2026-05-21 | Creación de la spec en sesión de Cowork. r1 cierra 17 decisiones (la mayoría heredadas/adaptadas de Spec 42/43, 5 divergencias locales conscientes). Queda 1 decisión abierta (#18 glyph + mecánica de orientación, sub-decisiones 18.a y 18.b acopladas) que se resuelve en sesión de Product Design — Anexo A la documenta autocontenidamente. Pre-requisito operativo registrado en frontmatter (cobertura mínima de coding antes del handoff a VS Code). **Cierra la decisión condicional #3 de Spec 42 r2 y Spec 43 r2** sobre el caveat heredable de B.4 para viento — Spec 44 diverge de B.4 en favor del glyph orientado sobre el mapa | Tercera capa real del EPIC 03. Hereda contrato técnico y patrones A.4/C.4 de Spec 42 r2 con ajustes. Las divergencias locales (5) son consistentes con las que Spec 43 introdujo (3) — el método de divergencias documentadas escala. El brief para Product Design es chico-mediano (un glyph + una mecánica acoplada) — más grande que Spec 43 (solo un glyph) pero más chico que Spec 42 (3 decisiones independientes) |
| 2026-05-21 (r2) | Cierra decisión #18 acoplada (18.a + 18.b) en sesión de Product Design (Mapa Inestable Design System · spec44/index.html). Elegidos **P.1** (onda + punta direccional) sobre 4 candidatos alternativos (P.2 flecha + estela, P.3 veleta vertical, P.4 chevron desacoplado, P.5 molinete rotacional) y **V3** (asimetría intrínseca + neutro distinto, vía `scaleX(-1)` por el componente del mapa) sobre 4 mecánicas alternativas (V1 variantes separadas, V2 rotación 180° pura, V4 glyph + indicador desacoplado, V5 glyph compuesto continuo). 2 SVGs entregados al vault como SSOT: `viento.svg` (onda 3-humps + extensión con punta + 2 mini-ondas secundarias) + `viento-neutro.svg` (variante propia para `rank=0`: mini-ondas reemplazadas por 4 dashes estáticos + onda principal sin punta). Pro-estado se renderea con `transform: scaleX(-1)` aplicado por el componente del mapa a `viento.svg`. README de glyphs actualizado: `viento.svg` y `viento-neutro.svg` activos en vault; vocabulario de ondas/sinusoides asignado a viento (no reusar en otros glyphs del sistema); sistema queda con 3 ejes compositivos distintos (h-cerrado precipitación, v-cerrado temperatura, h-abierto viento). AC15 cerrado del lado del SSOT; AC16 con mecánica V3 definida — verificación visual se cierra en sesión VS Code. El caveat heredable Spec 42→44 sobre vocabulario reservado queda cerrado con el consumo efectivo. Para Spec 45 (presión) hereda restricción: no reusar ondas — los vocabularios disponibles documentados en README de glyphs. La spec queda lista para handoff a VS Code una vez cumplido el pre-requisito operativo (cobertura mínima de coding publicado) | El brief #18 era acoplado (motivo + mecánica) y se cerró en una sesión. P.1 fue la única propuesta que (a) materializó el vocabulario reservado de ondas, (b) aportó un eje compositivo nuevo al sistema (stroke abierto horizontal), (c) cargó la dirección sin texto a 24px gracias a la asimetría intrínseca de la punta. V3 fue la mecánica que mejor preservó la unidad visual del glyph (vs V4 que rompe la unidad con un indicador desacoplado) y la honestidad del neutro (no es "versión apagada" del activo sino glyph con cuerpo propio), evitando duplicar trabajo de mantenimiento (vs V1 con 3 SVGs separados) y preservando la asimetría intrínseca (vs V2 rotación pura que la habría descartado) |
| 2026-05-21 (r3) | **Hereda el cambio de cadencia de Spec 41 r3 (semanal → trimestral).** 4 decisiones nuevas cerradas (#19-#22): cadencia trimestral con módulo `lib/layers/viento.ts` reescrito (`buildPeriods` usa `getAvailableQuarters()`, `getValueForCountry` parsea key `YYYY-Q#`, `getLastVientoBeforeQuarter` reemplaza a `getLastVientoBeforeWeek`, `quarterEndDate` reemplaza a `isoWeekEndDate`); pre-requisito operativo reescrito en trimestres (todos los países ≥1 trimestre publicado); AC8/AC9/AC10/AC20 adaptados a la cadencia trimestral; label del período `"Q# YYYY"` coherente con Spec 43. La divergencia (e) "cadencia semanal nativa" del set de 5 divergencias de r1/r2 se cae como divergencia — Spec 44 queda con 4 divergencias y se acerca más al patrón Spec 42/43. JSON consumido bumpea a `viento-v2.0.0` con `series_trimestral`. Estado pasa de `borrador-r2` a `borrador-r3` | Tomás eligió bajar la cadencia editorial al revisar Spec 44 r2 ("semanal es mucho"). Cambio absorbente: Spec 44 hereda automáticamente sin abrir decisiones nuevas. La capa queda alineada con Spec 42/43 en cadencia, sistema más coherente, divergencias bien razonadas pasan de 5 a 4 (la cadencia ya no es divergencia local) |

---

## Glosario

- **Capa principal:** la dimensión que manda el color del país en el mapa. Para viento, la magnitud absoluta del rank semanal.
- **Coding:** acto editorial de asignar un rank en la escala -3..+3 a un país en una semana específica (Spec 41 §glosario).
- **Codificador:** persona que hace el coding (Tomás en r1 de Spec 41).
- **Rank:** entero `{-3, -2, -1, 0, 1, 2, 3}` que representa dirección y magnitud del cambio político-económico en la semana.
- **Magnitud absoluta del rank:** `|rank|` ∈ {0, 1, 2, 3}. Define el bucket del color del polígono.
- **Direction:** `"pro-estado"` (rank < 0), `"neutro"` (rank = 0), `"pro-mercado"` (rank > 0). Define la orientación del glyph sobre el polígono.
- **Bucket de magnitud:** uno de los 4 niveles de la escala (0..3). Divergencia local vs Spec 42/43 (5 buckets).
- **Intensidad:** opcional 0-1 del coding. Modula la saturación/opacidad del fill dentro del bucket.
- **Glyph orientado:** SVG renderizado encima del polígono que codifica la dirección. Mecánica visual cerrada en Anexo A r2.
- **Cobertura piloto:** Argentina solo en r1 (divergencia vs Spec 42/43 que pilotean AR/BR/CL). BR y CL entran en r2; los demás en r3.
- **Cobertura técnica:** los 10 países renderizan con dato real una vez cumplido el pre-requisito operativo (cobertura mínima de coding).
- **Reading guide:** el `.md` del vault que el drawer renderiza como full markdown.
- **Pre-requisito operativo:** ítem en frontmatter que el equipo de implementación debe cumplir antes de la corrida en VS Code. Para Spec 44: cobertura mínima de coding + Anexo A cerrado.
- **Modulación por intensidad:** mecánica visual que modula la opacidad del fill cuando el coding declara intensidad ∈ [0,1].
- **Última semana publicada (`getLastVientoBeforeWeek`):** helper de `lib/viento.ts` que devuelve el `VientoWeekEntry` más reciente con `year ≤ year` y `week ≤ week`. Usado por el modelo de tiempo por capa para llenar países entre semanas.
- **Anexo A:** brief autocontenido para Product Design. Cierra decisión #18 (glyph SVG + mecánica visual de orientación), con sub-decisiones 18.a (glyph base) y 18.b (mecánica de orientación) acopladas.
