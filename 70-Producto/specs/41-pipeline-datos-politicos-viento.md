---
spec: 41
titulo: Pipeline de datos políticos para capa viento — MVP coding editorial manual
estado: borrador-r2
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-18
revision: 2026-05-19 (r2) — cerradas las 6 decisiones tácticas abiertas en r1
epic: 03
afecta:
  - 70-Producto/datos-viento/ (NUEVO directorio del vault — fuente editorial de la capa viento)
  - 70-Producto/datos-viento/_compilado/viento.json (NUEVO — JSON agregado que consume el frontend)
  - platform/data/coding-viento/ (NUEVO directorio — scripts del pipeline)
  - platform/data/coding-viento/build_viento.mjs (NUEVO — script que compila el JSON desde los .md del vault)
  - platform/frontend/src/data/coding-viento/viento.json (sync del compilado para consumo del frontend)
  - platform/frontend/src/lib/viento.ts (NUEVO — tipos + helpers para leer el JSON)
  - platform/frontend/src/lib/layers/viento.ts (consumirá del nuevo lib en Spec 44)
  - mapa-inestable.plugin/skills/coding-viento/ (NUEVO skill que asiste el coding semanal)
  - 70-Producto/specs/29-calendario-agentes-automaticos.md (agregar entrada de coding-viento)
depende_de: [39]
depende_blanda_de: [29, 27]
relaciona_con:
  - EPIC-03 (decisiones 1 y 7: capa viento como pro-mercado/pro-estado con codificación híbrida)
  - Spec 39 (arquitectura de capas — define el contrato Layer que viento implementa en Spec 44)
  - Spec 27 (agendas por país — patrón similar de .md con frontmatter por país)
  - Spec 28 (scheduled task semanal de agendas — referencia operativa)
  - Spec 29 (calendario de agentes — donde se registra el schedule)
  - Spec 40 (pipeline macro — análogo conceptual pero estructuralmente distinto: macro consume APIs externas, viento consume coding editorial humano)
  - Spec 41B (algoritmo híbrido — spec hija que diseña el algoritmo que pre-popula el coding cuando haya suficiente material acumulado)
desbloquea:
  - Spec 44 (capa viento) — consume el JSON viento generado por este pipeline
prioridad: alta
---

# 41 · Pipeline de datos políticos para capa viento

## Resumen ejecutivo

La capa **viento** del EPIC 03 codifica la **orientación político-económica** de cada país en la escala "pro-mercado ↔ pro-estado". Decisión 7 del epic: codificación **híbrida** — algoritmo provee la base, autor hace override editorial. Decisión 1 del epic: la escala evita "izquierda/derecha" porque esas categorías están deformadas por los procesos que el proyecto analiza (deculturación, desrepresentación) y porque empíricamente no predicen comportamiento (Milei es de derecha pero hace ortodoxia FMI; Lula es de izquierda pero sostiene macro ortodoxa).

**Estructuralmente, esta spec es distinta a Spec 40.** Spec 40 consume APIs externas (Banco Mundial) y formaliza un pipeline pre-existente. Spec 41 construye desde cero un sistema donde el **input primario es el coding editorial humano** sobre cambios normativos, regulatorios, fiscales y de discurso de gobierno. No hay API que liste "pro-mercado: sí/no" — esa lectura la hace el editor.

**MVP: 100% manual editorial. Algoritmo a futuro (Spec 41B).**

Diseñar el algoritmo ahora sería inventar reglas arbitrarias. La aproximación correcta es:

1. **r1 (esta spec)**: sistema de coding editorial puro. Editor codifica 10 países × 1 vez por semana, archivo `.md` por país-semana en el vault, pipeline construye un JSON consumible por la capa.
2. **Spec 41B (futuro)**: cuando haya 8-12 semanas de coding manual acumulado, se diseña el algoritmo que pre-popula el coding semanal con candidatos de score, y el editor solo confirma/ajusta. **El override editorial sigue siendo el último decisor.**

Esto cumple la decisión 7 del epic (codificación híbrida) en dos pasos: el override existe desde r1 (porque es lo único que hay); el algoritmo se suma cuando hay material para diseñarlo bien.

**Lo que entra en r1:**

- Esquema del archivo de coding semanal por país: `70-Producto/datos-viento/<slug>/YYYY-W##.md`.
- Escala diverging discreta -3 a +3 con 7 buckets y labels editoriales claras.
- Skill `coding-viento` que asiste el coding semanal (recordatorio + pre-rellenado con coding de la semana anterior + revisión).
- Scheduled task viernes 16:00 ART (antes del task de agendas a 17:00 y del pipeline macro a 18:00).
- Pipeline `build_viento.mjs` que recorre el vault y compila el JSON.
- JSON consumible por la capa viento de Spec 44, formato compatible con el contrato `Layer` de Spec 39.
- Operación borrador → promote: el `.md` se escribe como `estado: borrador`, Tomás revisa, promueve a `estado: publicada`. Solo lo publicado entra al JSON.
- Trazabilidad: cada coding lleva fecha, codificador, eventos clave que lo justifican (con fuentes), rank previo.

**Lo que NO entra en r1:**

- **Algoritmo automático de coding.** → Spec 41B (placeholder).
- **Pipeline alternativo basado en RSS de boletines oficiales / scraping de fuentes legales.** Queda como insumo posible del algoritmo de Spec 41B, no como sistema independiente.
- **Multi-codificador con conflictos.** Si Tomás y otro miembro del equipo codifican el mismo país y discrepan, no hay sistema de merge — uno gana, el otro queda como histórico. Si crece el equipo, ver en r2.
- **Visualización del coding dentro del sitio.** Eso lo hace Spec 44 (capa viento) y Spec 47 (tooltip multi-capa). Esta spec produce solo el JSON.
- **Histórico de revisiones del coding.** Si un coding pasado se corrige, se sobrescribe el `.md`. El git del repo del vault sirve de log de cambios.
- **Coding subnacional** (provincias de Brasil/Argentina). Spec posterior si hay caso.

---

## Estado actual

No existe nada relacionado con la capa viento en el repo. Ni datos, ni pipeline, ni archivos editoriales. **Esta spec inaugura el sistema completo.**

Lo que sí existe que sirve como referencia conceptual:

- **Spec 27 (agendas por país)**: patrón muy similar al que esta spec adopta — archivo `.md` con frontmatter por país, escrito editorialmente, consumido por el frontend vía lib server-side. La diferencia es que las agendas viven por país (no por país-semana) y se actualizan; el coding de viento es histórico-acumulativo (un archivo por cada semana, no se modifica el de semanas pasadas salvo correcciones).
- **Spec 28 (scheduled task semanal de agendas)**: patrón operativo de "viernes 17:00 ART corre una tarea por país que actualiza vault". El coding de viento sigue un patrón similar pero **lo dispara la mano humana, no un agente automático** — el skill solo asiste, no genera.
- **Spec 40 (pipeline macro)**: el JSON que produce esta spec sigue el mismo contrato de versionado y operación (skill supervisor + scheduled task semanal).

---

## Propuesta

### 1. Sistema de coding editorial

#### 1.1 Estructura del vault

Un archivo `.md` por país por semana:

```
70-Producto/datos-viento/
├── _compilado/
│   └── viento.json              ← output del pipeline (no editado a mano)
├── ar/
│   ├── 2026-W18.md
│   ├── 2026-W19.md
│   └── 2026-W20.md
├── bo/
│   ├── 2026-W19.md
│   └── 2026-W20.md
├── br/
│   └── ...
└── (8 países más)
```

**Por qué carpeta por país y archivo por semana**:

- Aislación: el coding de un país no contamina al de otro.
- Trazabilidad: cada coding tiene una fecha y un autor identificable.
- Append-only conceptual: nunca se borra una semana pasada, solo se agrega la nueva o se corrige in-situ.
- Escalable: si crece el equipo y un codificador se hace cargo de 3 países, su trabajo está organizado.
- Permite ver historia rápido: `ls 70-Producto/datos-viento/ar/` lista todas las semanas codificadas de Argentina.

#### 1.2 Esquema del archivo de coding semanal

```yaml
---
country_slug: ar
country_name: Argentina
year: 2026
week: 20
fecha_coding: 2026-05-15        # cuándo se codificó (puede ser != viernes si se atrasó)
codificador: tomas               # quién lo hizo
rank: 2                          # entero -3..+3 (ver §1.3)
direccion: pro-mercado           # derivado de rank, explícito para legibilidad humana
intensidad: 0.7                  # opcional 0-1: qué tan fuerte fue el cambio respecto a la semana anterior
estado: borrador                 # borrador | publicada (solo publicadas entran al JSON)

# Campos reservados para Spec 41B (algoritmo):
# algorithmic_baseline: null      # el algoritmo populará: { rank, generated_at, source_signals }
# override_reason: null            # cuando el editor cambia respecto al algorithmic_baseline
---

# Justificativo

[1-3 frases que explican por qué el rank de esta semana es el que es.
Si no hubo cambios respecto a la semana anterior, decirlo explícitamente.]

# Eventos clave de la semana

- Anuncio de [política/decreto/ley] [fuente]
- Discurso de [funcionario] [fuente]
- (etc.)

Cada evento clave puede tener su propia tendencia (↑ pro-mercado, ↓ pro-estado, → neutro).

# Coding previo (contexto)

- Semana 19: rank +1 — moderación tras anuncio fiscal
- Semana 18: rank +1 — sin cambios materiales
- Semana 17: rank 0 — fase de espera por elecciones provinciales
```

**Notas:**

- El skill `coding-viento` (§2) pre-rellena el bloque "Coding previo" leyendo las 3-5 semanas anteriores de ese país.
- "Justificativo" y "Eventos clave" son obligatorios (con texto, aunque sean breves) — sin ellos el coding pierde trazabilidad. El pipeline valida.
- "Fuentes" en los eventos son recomendadas pero no bloqueantes en r1 (el coding refleja la lectura editorial, no requiere citas).

#### 1.3 Escala numérica -3 a +3

7 buckets discretos, diverging con centro neutro:

| Rank | Label editorial | Bucket de la leyenda | Descripción |
|---|---|---|---|
| **-3** | muy pro-estado | ▓▓▓ azul intenso | Cambios estructurales fuertes pro-estado en la semana: estatizaciones, controles de precio, expansión fiscal, aumento de regulación significativo |
| **-2** | pro-estado | ▓▓ azul medio | Cambios moderados pro-estado: nuevos programas sociales, nuevas regulaciones sectoriales, aumento de gasto |
| **-1** | leve pro-estado | ▓ azul suave | Señales suaves pro-estado: anuncios menores, declaraciones, sin acciones materiales |
| **0** | neutro / sin cambio | ░ gris neutro | No hubo cambios materiales en la semana, o los cambios se compensan |
| **+1** | leve pro-mercado | ▒ terracota suave | Señales suaves pro-mercado: anuncios menores, declaraciones, sin acciones materiales |
| **+2** | pro-mercado | ▒▒ terracota medio | Cambios moderados pro-mercado: desregulación sectorial, recortes de gasto, ajustes fiscales |
| **+3** | muy pro-mercado | ▒▒▒ terracota intenso | Cambios estructurales fuertes pro-mercado en la semana: privatizaciones, desregulación masiva, ajuste fiscal severo, ortodoxia FMI |

**Importante:** la escala mide **dirección del cambio en la semana**, no posicionamiento absoluto del gobierno. Un gobierno fuertemente pro-mercado que pasa una semana sin novedades materiales tiene rank 0 (no +3 "porque siempre es pro-mercado"). Esto resuelve el problema señalado en el epic: la capa muestra **movimiento**, no etiqueta política estática.

La intensidad (opcional, 0-1) modula visualmente: un rank +2 con intensidad 0.9 se renderiza ligeramente más saturado que un rank +2 con intensidad 0.5. Esto permite distinguir "una semana decisiva" de "una semana de coding habitual" sin agregar buckets.

### 2. Skill `coding-viento` (asiste el coding semanal)

Vive en `mapa-inestable.plugin/skills/coding-viento/SKILL.md`. Cumple un rol equivalente al de los otros skills editoriales del plugin (analisis-semanal, despacho-semanal).

**Activación:**

- Manual: "codifiquemos viento", "vamos a hacer el coding semanal de [país]", "el coding de viento de esta semana".
- Scheduled task: viernes 16:00 ART crea un recordatorio en el vault (no codifica solo, solo recuerda).

**Qué hace el skill:**

1. Detecta la semana actual (ISO).
2. Para cada país (o el país que se pida), revisa si ya existe `70-Producto/datos-viento/<slug>/YYYY-W##.md`.
3. Si no existe: crea un borrador con el frontmatter pre-rellenado, el bloque "Coding previo" poblado con las 3-5 semanas anteriores del país, y rank tentativo = rank de la semana anterior (continuidad por default — el editor lo cambia si hubo movimiento).
4. Pre-rellena "Eventos clave de la semana" leyendo `15-Países/agendas/<slug>.md` (Spec 27) y los borradores de la semana de ese país en `60-Borradores/diario/` (Spec 23). Estos eventos son insumo del coding, no la decisión.
5. Pide al editor (Tomás u otro) confirmar/ajustar rank, llenar justificativo, marcar eventos relevantes.
6. Cuando el editor dice "publicalo": cambia `estado: borrador` a `estado: publicada`.
7. Opcional: al terminar la semana de los 10 países, ofrece correr `build_viento.mjs` para regenerar el JSON compilado.

**Aislación:**

- Un skill, un país, una semana. Si el editor pide "codificá los 10 países", el skill lo hace en serie, archivo por archivo, con confirmación entre cada uno. No mega-batches.
- Si el editor pide solo un país, el skill no toca los demás.

**No genera el rank.** El skill **pre-rellena** con el rank de la semana anterior como continuidad por default. El editor lo confirma o cambia. **El skill nunca decide solo.** Esta restricción es deliberada en r1 — el algoritmo de Spec 41B podrá generar candidatos, pero esta versión es 100% editorial.

### 3. Pipeline `build_viento.mjs`

Script Node.js (JavaScript) que vive en `platform/data/coding-viento/build_viento.mjs`. Análogo conceptual a `build_indicators_macro.py` de Spec 40, pero más simple porque no consume APIs externas — solo lee el vault y compila.

**Qué hace:**

1. Recorre `70-Producto/datos-viento/<slug>/*.md` para los 10 países.
2. Filtra solo los archivos con `estado: publicada`.
3. Parsea frontmatter de cada uno con `gray-matter` (ya usado en `lib/agendas.ts` y similares).
4. Valida: `rank` ∈ {-3, -2, -1, 0, 1, 2, 3}; `intensidad` ∈ [0, 1] si presente; campos obligatorios presentes; `country_slug` coincide con la carpeta padre.
5. Construye un objeto `VientoData`:

```ts
interface VientoData {
  version: string;                  // "viento-v1.0.0"
  computed_at: string;              // ISO timestamp
  range: { start_week: { year, week }, end_week: { year, week } };
  by_country: Record<string, {
    name: string;
    series_semanal: {
      year: number;
      week: number;
      rank: number;                 // -3..+3
      direccion: "pro-estado" | "neutro" | "pro-mercado";
      intensidad?: number;
      justificativo: string;        // texto del .md
      eventos: string[];            // bullets del .md
      codificador: string;
      fecha_coding: string;
    }[];
    latest?: /* última semana publicada */;
  }>;
}
```

6. Lo serializa a `70-Producto/datos-viento/_compilado/viento.json` (vault, fuente canónica).
7. Lo copia también a `platform/frontend/src/data/coding-viento/viento.json` para que el frontend lo importe sin reach al vault en build.
8. Loguea resumen: "compiladas N semanas de M países; X warnings".

**Frecuencia:**

- Cada vez que se publica un `.md` (manual o vía skill).
- Scheduled task viernes 19:00 ART (después del coding humano de viernes 16:00) corre el build automático para asegurar que el JSON está fresco al cerrar la semana.

### 4. Conexión con `interface Layer` de Spec 39

La capa viento (Spec 44) consume este JSON y re-empaqueta en formato `Layer`:

```ts
// platform/frontend/src/lib/layers/viento.ts
import { VIENTO_DATA } from "@/lib/viento";

export const vientoLayer: Layer = {
  id: "viento",
  label: "Viento · orientación pro-mercado / pro-estado",
  shortLabel: "Viento",
  glyphSrc: "/mapa/glyphs/viento.svg",
  category: "editorial",
  description: "Dirección del cambio político-económico cada semana, codificada en escala -3 a +3.",
  unit: "rank -3 a +3",
  cadence: "semanal",
  periods: buildPeriodsFromWeekly(VIENTO_DATA.by_country),
  defaultPeriod: /* última semana publicada */,
  legend: {
    type: "diverging",
    buckets: [
      { bucketIndex: -3, label: "muy pro-estado",  color: "var(--mi-viento-estado-3)" },
      { bucketIndex: -2, label: "pro-estado",      color: "var(--mi-viento-estado-2)" },
      { bucketIndex: -1, label: "leve pro-estado", color: "var(--mi-viento-estado-1)" },
      { bucketIndex:  0, label: "neutro",          color: "var(--mi-viento-neutro)" },
      { bucketIndex: +1, label: "leve pro-mercado",color: "var(--mi-viento-mercado-1)" },
      { bucketIndex: +2, label: "pro-mercado",     color: "var(--mi-viento-mercado-2)" },
      { bucketIndex: +3, label: "muy pro-mercado", color: "var(--mi-viento-mercado-3)" },
    ],
    noDataColor: "var(--mi-ink-mute)",
  },
  source: {
    name: "Coding editorial Mapa Inestable",
    url: "/mapa/capas/viento",     // página dedicada de Spec 39B cuando exista
    publishedDate: VIENTO_DATA.computed_at,
    lastFetched: VIENTO_DATA.computed_at,
  },
  getValueForCountry(slug, period) {
    const country = VIENTO_DATA.by_country[slug];
    if (!country) return null;
    const dp = country.series_semanal.find(d => d.year === period.year && d.week === period.week);
    if (!dp) return null;
    return {
      raw: dp.rank,
      formatted: `${dp.rank > 0 ? "+" : ""}${dp.rank} · ${dp.direccion}`,
      bucketIndex: dp.rank,
      quality: "oficial",          // siempre oficial en r1: es coding editorial firmado
    };
  },
  getLastPeriodBefore(date) { /* ... */ },
  readingGuideSlug: "viento",
};
```

Spec 44 (capa viento) hereda este código y lo refina. Esta spec (41) solo asegura que el JSON está bien formado.

### 5. Override editorial — concepto en MVP vs futuro

La decisión 7 del epic dice "codificación híbrida: algoritmo + override editorial". En este MVP no hay algoritmo, así que **todo el coding ES override** — no hay nada que overridear porque no hay baseline algorítmica.

Sin embargo, el schema del frontmatter **reserva campos** para cuando Spec 41B introduzca el algoritmo:

```yaml
# Reservados para Spec 41B (no usados en r1):
# algorithmic_baseline:
#   rank: <int>
#   generated_at: <ISO>
#   source_signals: [<lista de inputs del algoritmo>]
# override_reason: <texto explicando por qué el editor desvió>
```

En r1 estos campos quedan **comentados en el template** generado por el skill — el editor los ignora. Cuando Spec 41B entre, el algoritmo los populará automáticamente, el editor verá el baseline algorítmico y decidirá si lo confirma o lo overridea (con razón en `override_reason`).

Esto preserva forward-compatibility: el formato del .md no rompe cuando llegue el algoritmo.

### 6. Operación: scheduled task

Registrado en Spec 29 (calendario de agentes). Una sola tarea automatizada en r1:

| Cadencia | Hora | Tarea | Qué hace |
|---|---|---|---|
| Viernes | 16:00 ART | `coding-viento-recordatorio` | Crea/abre los 10 archivos `2026-W##.md` de la semana en `70-Producto/datos-viento/<slug>/` con frontmatter pre-rellenado en `estado: borrador`. Deja un archivo resumen `_recordatorio-2026-W##.md` con checklist de los 10 países. NO genera rank — solo prepara el terreno para que el editor codifique. |
| Viernes | 19:00 ART | `build-viento` | Corre `build_viento.mjs`. Si hubo cambios desde la corrida anterior, regenera el JSON compilado y deja log en `_compilado/_log-2026-W##.md`. |

**Cadencia humana** (no automatizada, depende del editor): viernes ~16:30-17:30 ART, el editor entra a Cowork, activa el skill `coding-viento`, va país por país completando los 10 borradores y marcándolos como `estado: publicada`. A las 19:00 el build automático recoge lo publicado.

Si el editor no codifica una semana, los borradores quedan en `estado: borrador`, el build los ignora, el JSON queda sin update de esa semana. La capa viento mostrará el último período publicado disponible (modelo de tiempo por capa de Spec 39).

---

## Archivos a tocar

| Archivo | Acción |
|---|---|
| `70-Producto/datos-viento/` | NUEVO directorio del vault |
| `70-Producto/datos-viento/<slug>/` (×10) | NUEVO — un directorio por país |
| `70-Producto/datos-viento/_compilado/viento.json` | NUEVO — output del pipeline (no editado a mano) |
| `70-Producto/datos-viento/README.md` | NUEVO — documenta el sistema, escala, schema del .md, cómo correr el pipeline |
| `platform/data/coding-viento/build_viento.mjs` | NUEVO — script Node.js que compila el JSON |
| `platform/data/coding-viento/README.md` | NUEVO |
| `platform/frontend/src/data/coding-viento/viento.json` | NUEVO — copia sincronizada del compilado para consumo del frontend |
| `platform/frontend/src/lib/viento.ts` | NUEVO — tipos + helpers para leer el JSON |
| `mapa-inestable.plugin/skills/coding-viento/SKILL.md` | NUEVO skill (ver §2) |
| `70-Producto/specs/29-calendario-agentes-automaticos.md` | ACTUALIZAR — agregar entradas viernes 16:00 (recordatorio) + viernes 19:00 (build) |

---

## Criterios de aceptación

| # | Criterio | Verificación |
|---|---|---|
| AC1 | El directorio `70-Producto/datos-viento/` existe con 10 subcarpetas (una por país) | `ls 70-Producto/datos-viento/` |
| AC2 | El skill `coding-viento` puede crear el archivo de la semana actual para un país, pre-rellenando frontmatter y "Coding previo" | Activar skill: "codificá Argentina esta semana" → archivo creado correctamente |
| AC3 | El skill respeta el principio "no genera rank" — siempre pide al editor confirmar/ajustar | Inspección del skill: el `rank` del .md generado coincide con la semana anterior (continuidad), no con un valor inventado por el LLM |
| AC4 | El pipeline `build_viento.mjs` valida el frontmatter: rank ∈ {-3..+3}, intensidad ∈ [0,1] si presente, campos obligatorios presentes | Crear .md con `rank: 5` → pipeline aborta con error explicativo |
| AC5 | El pipeline solo incluye en el JSON los `.md` con `estado: publicada`; ignora `borrador` | Crear 5 .md con `borrador` + 5 con `publicada` → JSON solo tiene los 5 publicados |
| AC6 | El JSON generado tiene schema correcto: `version`, `computed_at`, `range`, `by_country` con `series_semanal` ordenadas | Inspect JSON.by_country.ar.series_semanal[0] |
| AC7 | El JSON se copia a `platform/frontend/src/data/coding-viento/viento.json` y es importable desde TS | `import VIENTO_DATA from "@/data/coding-viento/viento.json"` |
| AC8 | `lib/viento.ts` expone tipos `VientoData`, `VientoCountrySeries`, helpers `getCountryViento(slug)`, `getLatestByCountry()` | Type-check + smoke test desde un componente dummy |
| AC9 | Scheduled task viernes 16:00 ART crea recordatorio en el vault | Esperar al viernes próximo, verificar archivo `_recordatorio-2026-W##.md` |
| AC10 | Scheduled task viernes 19:00 ART corre `build_viento.mjs` automáticamente | Esperar, verificar log en `_compilado/_log-*.md` |
| AC11 | El JSON producido es compatible con el contrato `Layer` de Spec 39 — Spec 44 (capa viento) puede consumirlo sin ajustes al pipeline | Mock de implementación de `vientoLayer` con `getValueForCountry` lee el JSON correctamente |
| AC12 | README del directorio documenta escala, schema, cómo codificar, cómo correr el pipeline | Read `70-Producto/datos-viento/README.md` |
| AC13 | Trigger on-publish del build (decisión #14 r2): cuando el skill `coding-viento` cambia un `.md` de `estado: borrador` a `estado: publicada`, dispara `build_viento.mjs` automáticamente. El JSON se actualiza sin esperar al schedule del viernes | Publicar un coding vía skill, verificar que el JSON se regeneró dentro de los pocos segundos siguientes |
| AC14 | Cobertura parcial válida (decisión #15 r2): un build con solo N países codificados de los 10 (N ≥ 1) corre exitosamente y produce un JSON válido. Los países sin coding de esa semana mantienen su última semana disponible | Codificar solo Argentina y Brasil de una semana, correr build, verificar JSON tiene la semana nueva para AR/BR y semanas anteriores para los otros 8 |

---

## Edge cases

- **El editor no codifica una semana** → los borradores quedan en `borrador` o ni se crean. El build siguiente ignora la semana. La capa viento mostrará la última semana publicada disponible (modelo de tiempo por capa de Spec 39 — `getLastPeriodBefore` devuelve el rank de la semana anterior publicada).
- **El editor corrige el coding de una semana pasada** → sobrescribe el `.md`, el siguiente build incorpora el cambio. El git del vault sirve como histórico de revisión. Notas opcionales: agregar campo `revisado_at: ISO` al frontmatter para visibilidad.
- **El skill se ejecuta con un país que no existe** → error explícito, no crea archivo.
- **Conflicto entre coding manual y agente diario** que detectó un evento la misma semana: el coding gana siempre. El agente diario informa, el coding decide.
- **Datos incompletos del .md** (falta justificativo o eventos vacíos) → pipeline emite warning pero incluye el coding. Si falta `rank` o `country_slug` o `week`, sí aborta.
- **Pipeline corre y no hay nada nuevo** → JSON regenerado idéntico, `version` no bumpea, log dice "sin cambios".
- **Editor publica con `rank: 0`** todas las semanas → la capa muestra todos los países en gris neutro. No es un bug, es una lectura editorial válida ("no hubo movimiento esta semana en ninguno"). Aunque si pasa muchas semanas seguidas conviene revisar si el editor está aplicando la escala correctamente.
- **Archivos con nombres mal formados** (`W3.md` en vez de `2026-W03.md`): pipeline ignora con warning. README documenta el formato esperado.

---

## Decisiones tomadas

### Cerradas en r1 (sesión 2026-05-18, primera pasada — diseño)

| # | Tema | Decisión | Razón |
|---|---|---|---|
| 1 | Alcance de r1 | MVP 100% manual editorial. Algoritmo en Spec 41B postergada hasta tener 8-12 semanas de coding manual | Diseñar el algoritmo ahora sería inventar reglas arbitrarias. El material editorial es input necesario para diseñar bien el algoritmo |
| 2 | Escala numérica | Diverging discreta -3 a +3, 7 buckets con labels editoriales | Equilibrio entre expresividad (7 niveles capturan intensidades sin abrumar al editor) y simplicidad (entero codificable sin sufrir) |
| 3 | Qué mide la escala | **Dirección del cambio en la semana**, no posicionamiento absoluto del gobierno | Resuelve el problema señalado en el epic: "Milei es de derecha pero hace ortodoxia FMI" — la capa muestra movimiento, no etiqueta política estática. Un gobierno fuerte pro-mercado con una semana sin novedades tiene rank 0 |
| 4 | Cadencia | Semanal | Coherente con la cadencia "viento" del epic. Una sesión de coding cada viernes, ~30 minutos para los 10 países |
| 5 | Estructura del vault | Carpeta por país, archivo por semana (`<slug>/YYYY-W##.md`) | Aislación + trazabilidad + escalabilidad. Patrón análogo a Spec 28 pero con archivos persistentes |
| 6 | Estado del coding | `borrador` o `publicada` (patrón borrador → promote de Spec 29) | El pipeline solo procesa publicadas. El editor controla cuándo el coding sale al sitio |
| 7 | Rol del skill `coding-viento` | Asiste, no genera. Pre-rellena con coding de la semana anterior (continuidad por default), agrega contexto de agendas + borradores diarios | El editor es el decisor en r1. El algoritmo de Spec 41B podrá generar, pero esta versión preserva el control humano |
| 8 | Override editorial en MVP | Todo el coding ES override (no hay algoritmo que overridear). Campos `algorithmic_baseline` y `override_reason` reservados en el schema para Spec 41B | Forward compatibility: cuando Spec 41B llegue, no rompe el formato del .md |
| 9 | Operación | Scheduled task viernes 16:00 ART (recordatorio) + viernes 19:00 ART (build). Coding humano entre medio | Coherente con calendario de agentes de Spec 29. No interfiere con task de agendas (17:00) ni con pipeline macro (18:00) |
| 10 | Pipeline tecnología | Script Node.js (`build_viento.mjs`), no Python | Más simple — solo lee `.md` del vault y produce `.json`. No requiere las dependencias del pipeline macro (requests, scrapers). Reusa `gray-matter` ya en el frontend |

### Cerradas en r2 (sesión 2026-05-19, segunda pasada — cierre de tácticas abiertas)

| # | Tema | Decisión | Razón |
|---|---|---|---|
| 11 | Multi-codificador | **Tomás como único codificador en r1 y r2**. El campo `codificador` queda en el frontmatter como forward-compatibility pero no se usa multi-valor. Si en el futuro Eche u otro se suma, se diseñará el proceso de calibración entre codificadores como spec aparte | Tomás: "por ahora no hay más codificadores". Evita inventar proceso operativo sin demanda real |
| 12 | Sub-eventos con rank propio | **Mantener cada evento como bullet de texto libre en r1 y r2**. No agregar rank parcial por evento. Re-evaluar si el coding acumulado muestra que la granularidad agregaría valor analítico que justifique la fricción adicional al codificar | Tomás: ok. Lectura conservadora: el coding semanal entero ya lleva un rank; agregar uno por evento complica el flujo de codificación sin demanda clara todavía |
| 13 | Tokens CSS para la escala viento | **Definición concreta de paleta cae en Spec 44** (capa viento) cuando se integre visualmente. Esta spec deja el patrón de naming `--mi-viento-{estado/neutro/mercado}-{1/2/3}` como acuerdo técnico, pero los hex específicos los decide el diseño de capa | Tomás: me parece ok. La paleta es una decisión visual que conviene tomar mirando el render real, no en abstracto |
| 14 | Trigger del build | **Opción A: el skill `coding-viento` que cambia `estado: borrador` → `estado: publicada` también dispara `build_viento.mjs`**. El scheduled task viernes 19:00 sigue corriendo como red de seguridad por si algún coding se publicó por edición manual sin pasar por el skill | Tomás: opción A. JSON siempre fresco cuando se publica coding nuevo; sin esperar al schedule del viernes |
| 15 | Cobertura mínima por semana | **Cualquier número ≥ 1 país codificado es válido para el build**. Los países sin coding de esa semana mantienen la última semana disponible (modelo de tiempo por capa de Spec 39) | Tomás: sí, cualquier número mayor de 1 es válido. Tolera semanas con coding parcial, evita bloquear el JSON cuando no se completaron los 10 |
| 16 | Histórico de revisiones | **Posponer**: no agregar `revisiones[]` al schema en r2. El git del vault sirve como log durante las primeras 4-6 semanas de operación. Si aparecen 2+ revisiones notables en ese período, agregar el array en r3. Si no aparece ninguna, queda definitivamente como decisión "no agregar" | Tomás: "lo que recomiendes". Mismo criterio que Spec 40 #2 — no agregar complejidad sin evidencia operativa que la justifique |

---

## Decisiones abiertas

Las 6 decisiones tácticas que estaban abiertas en r1 quedaron cerradas en r2 (ver decisiones #11-#16 arriba). **No quedan decisiones bloqueantes para implementación.**

Lo que sí queda como condicional para r3 (decisiones reabribles según evidencia operativa):

1. **Revisitar #11 (multi-codificador)** si aparece un segundo codificador en el equipo. Diseñar proceso de calibración entre codificadores cuando se materialice la demanda.
2. **Revisitar #12 (sub-eventos con rank)** después de 8-12 semanas de coding acumulado. Si la lectura de los `.md` muestra que la granularidad por evento aportaría valor analítico claro y el codificador no se quema con el flujo adicional, agregar.
3. **Revisitar #16 (histórico de revisiones)** después de 4-6 semanas de operación. Si aparecen 2+ revisiones notables a codings publicados, agregar array `revisiones[]` al schema. Si no aparece ninguna, queda definitivamente como "no agregar".

---

## No incluido en esta spec

- **Algoritmo automático de coding (Spec 41B).** Placeholder creado, se diseña cuando haya 8-12 semanas de material acumulado.
- **Visualización de la capa viento en el mapa.** Spec 44 (consumirá el JSON producido por esta spec).
- **Sub-eventos con rank propio.** Decisión abierta #2.
- **Multi-codificador con merge de conflictos.** Spec posterior si el equipo crece.
- **Coding subnacional** (provincias / estados). Spec posterior si hay caso.
- **Métricas de quality del coding** (auto-coherencia, drift entre codificadores). Posible en r2.
- **Página de documentación pública del método de coding.** Eso lo cubre Spec 39B (página dedicada por capa) cuando se diseñe.

---

## Implementación sugerida

Esta spec se diseña en Cowork. La implementación se ejecuta en una sesión de **Claude Code en VS Code** sobre `platform/data/coding-viento/`, el plugin del vault, y el directorio editorial `70-Producto/datos-viento/`. Orden recomendado:

1. **Crear el directorio del vault** `70-Producto/datos-viento/` con README + 10 subcarpetas vacías + carpeta `_compilado/` con `.gitkeep`.
2. **Escribir 1-2 archivos de coding manualmente** como referencia visual (ej. AR-W18, AR-W19) — sirve como caso piloto para el resto.
3. **Crear `build_viento.mjs`** en `platform/data/coding-viento/`. Implementar parseo de .md, validación, generación del JSON, copia a `src/data/`.
4. **Smoke test del build** con los 1-2 archivos del paso 2: JSON generado correctamente, sin warnings.
5. **Crear `lib/viento.ts`** con tipos + helpers básicos. Type-check pasa.
6. **Crear el skill `coding-viento`** en `mapa-inestable.plugin/skills/coding-viento/SKILL.md`. Implementar las 7 responsabilidades de §2. Smoke test: pedirle al skill que cree el coding de Argentina para la semana actual.
7. **Crear los 2 scheduled tasks** en Cowork (viernes 16:00 recordatorio + viernes 19:00 build).
8. **Actualizar Spec 29** con las dos entradas.
9. **Spec 41B (placeholder)** creada como spec hija — el contenido real se diseña en una sesión futura cuando haya material acumulado.
10. **Coding piloto de 2-3 semanas** (Tomás codifica 10 países × 2-3 semanas) antes de declarar la spec implementada — permite validar que el flujo operativo funciona.

Tiempo estimado: **3-4 días** de implementación + el coding piloto (que es trabajo editorial, no técnico).

---

## Histórico

| Fecha | Cambio | Razón |
|---|---|---|
| 2026-05-18 | Creación de la spec en sesión de Cowork. Alcance MVP manual editorial — algoritmo postergado a Spec 41B. Sistema completo: archivos `.md` por país-semana en el vault, escala -3 a +3, skill `coding-viento` que asiste, pipeline Node.js que compila JSON, scheduled tasks integrados al calendario de Spec 29 | Diseñar el algoritmo sin material editorial sería inventar reglas. El coding manual es el input necesario para entender qué patrones existen antes de automatizar. La cadencia semanal + la escala diverging discreta resuelven la decisión 1 del epic (pro-mercado/pro-estado en lugar de izquierda/derecha) sin perder operatividad |
| 2026-05-19 (r2) | Cerradas las 6 decisiones tácticas abiertas en r1: (#11) Tomás único codificador, multi-codificador se evalúa cuando aparezca segundo; (#12) eventos clave siguen como bullets de texto libre, no rank por evento; (#13) paleta CSS concreta cae en Spec 44; (#14) trigger on-publish vía skill + viernes 19:00 como red de seguridad; (#15) cobertura ≥1 país válida; (#16) histórico de revisiones pospuesto, se decide tras 4-6 semanas operativas. Agregados 2 criterios de aceptación (AC13-AC14). La spec queda lista para handoff a VS Code sin decisiones bloqueantes | Tomás revisó r1 y cerró las tácticas. No queda nada pendiente de diseño |

---

## Glosario

- **Coding**: el acto editorial de asignar un rank en la escala -3 a +3 a un país en una semana específica, junto con un justificativo y eventos clave.
- **Codificador**: persona que hace el coding. En r1, asume Tomás como único; el campo `codificador` del frontmatter está preparado para multi-codificador.
- **Rank**: entero en {-3, -2, -1, 0, 1, 2, 3} que representa la dirección y magnitud del cambio político-económico de un país en una semana.
- **Direction**: derivada del rank — "pro-estado" para rank < 0, "neutro" para 0, "pro-mercado" para > 0. Explícita en el frontmatter para legibilidad humana.
- **Intensidad**: opcional 0-1, modula visualmente la saturación del color del bucket. Permite distinguir "una semana decisiva" de "una semana de coding habitual" sin agregar buckets.
- **Estado** (`borrador` | `publicada`): patrón borrador → promote de Spec 29 aplicado al coding. Solo lo publicado entra al JSON.
- **Algorithmic baseline**: campo reservado del frontmatter (no usado en r1, usado por Spec 41B). El rank que el algoritmo propone antes del override editorial.
- **Override editorial**: en MVP, todo el coding lo es. En Spec 41B, el override aparece cuando el editor cambia respecto al `algorithmic_baseline`.
- **Pipeline `build_viento.mjs`**: script Node.js que recorre los `.md` publicados del vault y genera el JSON consumible por la capa viento.
