---
spec: 41
titulo: Pipeline de datos políticos para capa viento — MVP coding editorial manual
estado: implementada-parcial-r3
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-18
revision: 2026-05-21 (r3) — **cambio de cadencia editorial: semanal → trimestral.** Decisión de Tomás 2026-05-21 al revisar Spec 44 ("semanal es mucho"). La operación editorial completa baja a un coding por país por trimestre (4/país/año × 10 países = 40 codings/año, en lugar de 52 semanales). El régimen normal: el archivo del trimestre se edita en `estado: borrador` durante el trimestre (agregando eventos a medida que ocurren) y se publica al cierre (primer viernes del trimestre siguiente). Schema del .md cambia: `year + quarter` (1-4) en lugar de `year + week` (1-52). Nombre de archivo: `2026-Q2.md`. JSON bumpea a `viento-v2.0.0` (breaking: `series_semanal` → `series_trimestral`). Helpers `getLastVientoBeforeQuarter` y `getAvailableQuarters` reemplazan a sus equivalentes semanales. Spec 29 actualizada: schedules viernes 16:00 / 19:00 ART pasan a primer viernes del trimestre siguiente (cron `0 16 1-7 1,4,7,10 5` y `0 19 1-7 1,4,7,10 5`). Spec 44 hereda automáticamente la cadencia. Caso especial: migración de AR W18+W19 → AR Q2-2026 promediado en este mismo sprint (régimen normal arranca con Q2-2026 ya migrado, Q3-2026 se codifica al cierre el viernes 2 de octubre 2026). 2026-05-19 (r2) — cerradas las 6 decisiones tácticas abiertas en r1
epic: 03
afecta:
  - 70-Producto/datos-viento/ (NUEVO directorio del vault — fuente editorial de la capa viento)
  - 70-Producto/datos-viento/_compilado/viento.json (NUEVO — JSON agregado que consume el frontend)
  - platform/data/coding-viento/ (NUEVO directorio — scripts del pipeline)
  - platform/data/coding-viento/build_viento.mjs (NUEVO — script que compila el JSON desde los .md del vault)
  - platform/frontend/src/data/coding-viento/viento.json (sync del compilado para consumo del frontend)
  - platform/frontend/src/lib/viento.ts (NUEVO — tipos + helpers para leer el JSON)
  - platform/frontend/src/lib/layers/viento.ts (consumirá del nuevo lib en Spec 44)
  - 70-Producto/skills/coding-viento/ (NUEVO skill que asiste el coding semanal)
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

**Lo que entra en r1 (régimen original, ahora deprecado por r3):**

- Esquema del archivo de coding semanal por país: `70-Producto/datos-viento/<slug>/YYYY-W##.md`.
- Escala diverging discreta -3 a +3 con 7 buckets y labels editoriales claras.
- Skill `coding-viento` que asiste el coding semanal (recordatorio + pre-rellenado con coding de la semana anterior + revisión).
- Scheduled task viernes 16:00 ART (antes del task de agendas a 17:00 y del pipeline macro a 18:00).
- Pipeline `build_viento.mjs` que recorre el vault y compila el JSON.
- JSON consumible por la capa viento de Spec 44, formato compatible con el contrato `Layer` de Spec 39.
- Operación borrador → promote: el `.md` se escribe como `estado: borrador`, Tomás revisa, promueve a `estado: publicada`. Solo lo publicado entra al JSON.
- Trazabilidad: cada coding lleva fecha, codificador, eventos clave que lo justifican (con fuentes), rank previo.

**Lo que entra en r3 (cambio de cadencia 2026-05-21):**

- Cadencia editorial baja de semanal a trimestral (4 codings/país/año × 10 países = 40 codings/año, en lugar de los 520 originales).
- Esquema del archivo de coding trimestral por país: `70-Producto/datos-viento/<slug>/YYYY-Q#.md` (ej. `2026-Q2.md`).
- Escala -3 a +3 intacta. Lo que cambia es la unidad temporal del coding: el rank captura **movimiento estructural del trimestre**, no de la semana.
- Régimen del archivo en curso: el archivo del trimestre vivo se edita en `estado: borrador` durante todo el trimestre (agregando eventos a medida que ocurren). Al cierre del trimestre el editor revisa, sintetiza y publica.
- Schedules de Spec 29 cambian: `coding-viento-recordatorio` y `build-viento` pasan de viernes semanal a **primer viernes del trimestre siguiente** (cron `0 16 1-7 1,4,7,10 5` y `0 19 1-7 1,4,7,10 5`).
- Helpers de `lib/viento.ts`: `getLastVientoBeforeQuarter(slug, year, quarter)` y `getAvailableQuarters()` reemplazan a sus equivalentes semanales.
- JSON compilado bumpea a `viento-v2.0.0` (breaking change: `series_semanal` → `series_trimestral`).
- Caso especial — migración: los archivos `2026-W18.md` y `2026-W19.md` de AR (ya publicados en r1/r2) se promedian en un único `2026-Q2.md` con rank +2 (round del promedio +2.0), justificativo sintético cubriendo ambas semanas, marca explícita `regimen: migracion-semanal` en frontmatter. Los .md originales se mueven a `70-Producto/datos-viento/ar/_historico-semanal/`. Los 10 borradores W21 generados por el recordatorio del 2026-05-20 se eliminan (régimen deprecado).

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

#### 1.1 Estructura del vault (r3 — trimestral)

Un archivo `.md` por país por trimestre:

```
70-Producto/datos-viento/
├── _compilado/
│   └── viento.json              ← output del pipeline v2.0.0 (no editado a mano)
├── ar/
│   ├── _historico-semanal/      ← archivos del régimen r1/r2 (W18, W19) preservados
│   │   ├── 2026-W18.md
│   │   └── 2026-W19.md
│   ├── 2026-Q2.md               ← entrada migrada (W18+W19 promediadas, marca regimen: migracion-semanal)
│   ├── 2026-Q3.md               ← se codifica al cierre de Q3, viernes 2 oct 2026
│   └── 2026-Q4.md               ← se codifica al cierre de Q4, viernes 2 ene 2027
├── bo/
│   ├── 2026-Q2.md
│   └── ...
├── br/
│   └── ...
└── (8 países más)
```

**Por qué carpeta por país y archivo por trimestre**:

- Aislación: el coding de un país no contamina al de otro.
- Trazabilidad: cada coding tiene una fecha y un autor identificable.
- Append-only conceptual: nunca se borra un trimestre pasado, solo se agrega el nuevo o se corrige in-situ.
- Cadencia coherente con el slider de Spec 39 (trimestral en Spec 42/43/44) — sin agregación en runtime.
- Escalable: si crece el equipo y un codificador se hace cargo de 3 países, su trabajo está organizado.
- Permite ver historia rápido: `ls 70-Producto/datos-viento/ar/` lista todos los trimestres codificados de Argentina.

**Subcarpeta `_historico-semanal/`** (r3): preserva los archivos del régimen semanal anterior por trazabilidad. El pipeline `build_viento.mjs` los ignora porque están fuera del scan (regex `^\d{4}-Q\d\.md$`).

#### 1.2 Esquema del archivo de coding trimestral (r3)

```yaml
---
country_slug: ar
country_name: Argentina
year: 2026
quarter: 2                       # entero 1..4 (Q1=ene-mar, Q2=abr-jun, Q3=jul-sep, Q4=oct-dic)
fecha_coding: 2026-07-03         # cuándo se codificó (primer viernes del trimestre siguiente en el régimen normal; fecha de migración para entradas del histórico)
codificador: tomas
rank: 2                          # entero -3..+3 (ver §1.3) — captura movimiento estructural del trimestre
direccion: pro-mercado           # derivado de rank, explícito para legibilidad humana
intensidad: 0.7                  # opcional 0-1: qué tan fuerte fue el movimiento del trimestre
estado: borrador                 # borrador | publicada (solo publicadas entran al JSON)
regimen: trimestral              # trimestral | migracion-semanal (entradas migradas del régimen r1/r2)

# Campos reservados para Spec 41B (algoritmo):
# algorithmic_baseline: null      # el algoritmo populará: { rank, generated_at, source_signals }
# override_reason: null            # cuando el editor cambia respecto al algorithmic_baseline
---

# Justificativo

[1-3 frases que explican por qué el rank del trimestre es el que es.
Si no hubo cambios materiales respecto al trimestre anterior, decirlo explícitamente.
Capturar la lectura agregada del trimestre, no de una semana específica.]

# Eventos clave del trimestre

- Anuncio de [política/decreto/ley] [fuente] [fecha aprox.]
- Discurso de [funcionario] [fuente]
- (etc.)

Cada evento clave puede tener su propia tendencia (↑ pro-mercado, ↓ pro-estado, → neutro).
A lo largo del trimestre el archivo se va llenando con eventos a medida que ocurren — al cierre se sintetizan.

# Coding previo (contexto)

- 2026-Q1: rank +2 — fase de ajuste inicial del régimen
- 2025-Q4: rank +1 — transición pos-electoral
- 2025-Q3: rank 0 — fase de campaña electoral
```

**Notas:**

- El skill `coding-viento` (§2) pre-rellena el bloque "Coding previo" leyendo los 3-5 trimestres anteriores de ese país.
- "Justificativo" y "Eventos clave del trimestre" son obligatorios (con texto, aunque sean breves) — sin ellos el coding pierde trazabilidad. El pipeline valida.
- "Fuentes" en los eventos son recomendadas pero no bloqueantes (el coding refleja la lectura editorial, no requiere citas).
- Régimen del archivo en curso: durante el trimestre el archivo vive en `estado: borrador` y se va editando (agregando eventos a medida que aparecen). Al cierre del trimestre el editor revisa, sintetiza la lectura agregada y publica.
- Campo `regimen` distingue entradas naturales (`trimestral`) de entradas migradas del régimen semanal (`migracion-semanal`). El pipeline no las trata distinto; el lector y futuros codificadores tienen la marca.

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

**Importante (r3):** la escala mide **dirección del cambio en el trimestre**, no posicionamiento absoluto del gobierno. Un gobierno fuertemente pro-mercado que pasa un trimestre sin novedades materiales tiene rank 0 (no +3 "porque siempre es pro-mercado"). Esto resuelve el problema señalado en el epic: la capa muestra **movimiento estructural del trimestre**, no etiqueta política estática.

**Cambio r3 — qué captura el rank ahora.** En r1/r2 el rank captaba el cambio semanal. En r3 capta la lectura agregada del trimestre: el editor mira los eventos clave del trimestre como un todo, sintetiza la dirección dominante, y asigna un rank único. Un trimestre con 3 anuncios pro-mercado fuertes y 1 medida pro-estado moderada da probablemente rank +2 o +3, no la suma neta de ranks semanales — el coding trimestral es **una lectura sintética**, no una agregación aritmética.

La intensidad (opcional, 0-1) modula visualmente: un rank +2 con intensidad 0.9 se renderiza ligeramente más saturado que un rank +2 con intensidad 0.5. Permite distinguir "un trimestre decisivo" de "un trimestre de cambios incrementales" sin agregar buckets.

### 2. Skill `coding-viento` (asiste el coding trimestral)

Vive en `70-Producto/skills/coding-viento/SKILL.md`. Cumple un rol equivalente al de los otros skills editoriales del plugin (analisis-semanal, despacho-semanal).

**Cambio r3.** El skill se reescribe para operar sobre trimestres. La estructura del SKILL.md se mantiene (siete responsabilidades, principio de aislación, principio "no genera rank") pero las referencias a "semana" pasan a "trimestre", el formato del archivo cambia (YYYY-Q#.md), y el flujo de promoción se afina (durante el trimestre se edita en borrador; al cierre se publica).

**Activación:**

- Manual: "codifiquemos viento", "vamos a hacer el coding trimestral de [país]", "el coding de viento de este trimestre", "abrí el archivo del trimestre vivo de [país]".
- Scheduled task: primer viernes del trimestre 16:00 ART crea un recordatorio en el vault — recuerda al editor que el trimestre anterior cerró y hay que publicar el archivo correspondiente (no codifica solo).

**Qué hace el skill:**

1. Detecta el trimestre actual (Q1=ene-mar, Q2=abr-jun, Q3=jul-sep, Q4=oct-dic).
2. Para cada país (o el país que se pida), revisa si ya existe `70-Producto/datos-viento/<slug>/YYYY-Q#.md`.
3. Si no existe: crea un borrador con el frontmatter pre-rellenado, el bloque "Coding previo" poblado con los 3-5 trimestres anteriores del país, y rank tentativo = rank del trimestre anterior (continuidad por default — el editor lo cambia si hubo movimiento).
4. Pre-rellena "Eventos clave del trimestre" leyendo `15-Países/agendas/<slug>.md` (Spec 27) y los borradores del trimestre de ese país en `60-Borradores/diario/` (Spec 23). Estos eventos son insumo del coding, no la decisión.
5. Pide al editor (Tomás u otro) confirmar/ajustar rank, llenar justificativo agregado, sintetizar eventos relevantes.
6. **Dos momentos de uso distintos:**
   - **Durante el trimestre en curso:** el editor agrega eventos al archivo en `estado: borrador` a medida que ocurren. El skill puede activarse varias veces por trimestre. El JSON no incluye este archivo hasta que se publique.
   - **Al cierre del trimestre** (primer viernes del trimestre siguiente, disparado por el scheduled task `coding-viento-recordatorio`): el editor revisa el archivo del trimestre cerrado, sintetiza la lectura agregada, ajusta el rank si hace falta, y cambia `estado: borrador` → `estado: publicada`. Ese cambio dispara `build_viento.mjs` (trigger on-publish heredado de decisión #14 r2).
7. Opcional: al terminar el coding de los 10 países del trimestre cerrado, ofrece correr `build_viento.mjs` manualmente como red de seguridad.

**Aislación:**

- Un skill, un país, un trimestre. Si el editor pide "codificá los 10 países", el skill lo hace en serie, archivo por archivo, con confirmación entre cada uno. No mega-batches.
- Si el editor pide solo un país, el skill no toca los demás.

**No genera el rank.** El skill **pre-rellena** con el rank del trimestre anterior como continuidad por default. El editor lo confirma o cambia. **El skill nunca decide solo.** Esta restricción es deliberada — el algoritmo de Spec 41B podrá generar candidatos cuando haya 8-12 trimestres acumulados (2-3 años de coding manual a cadencia trimestral, vs los 8-12 semanas originales con cadencia semanal), pero esta versión es 100% editorial.

### 3. Pipeline `build_viento.mjs` (r3 — trimestral)

Script Node.js (JavaScript) que vive en `platform/data/coding-viento/build_viento.mjs`. Análogo conceptual a `build_indicators_macro.py` de Spec 40, pero más simple porque no consume APIs externas — solo lee el vault y compila.

**Cambios r3 vs r2:**

- Regex de nombre de archivo: `^(\d{4})-Q(\d)\.md$` (en lugar de `^(\d{4})-W(\d{2})\.md$`).
- Validación: `quarter` ∈ {1, 2, 3, 4} (en lugar de `week` ∈ 1..52).
- Contrato del JSON bumpea a `viento-v2.0.0` (breaking).
- Ignora archivos en subcarpetas `_historico-semanal/` automáticamente (la regex solo matchea Q#).

**Qué hace:**

1. Recorre `70-Producto/datos-viento/<slug>/*.md` para los 10 países (subcarpetas como `_historico-semanal/` se ignoran por la regex).
2. Filtra solo los archivos con `estado: publicada`.
3. Parsea frontmatter de cada uno con `gray-matter`.
4. Valida: `rank` ∈ {-3, -2, -1, 0, 1, 2, 3}; `intensidad` ∈ [0, 1] si presente; `quarter` ∈ {1, 2, 3, 4}; campos obligatorios presentes; `country_slug` coincide con la carpeta padre.
5. Construye un objeto `VientoData`:

```ts
interface VientoData {
  version: string;                  // "viento-v2.0.0"
  computed_at: string;              // ISO timestamp
  range: { start_quarter: { year, quarter }, end_quarter: { year, quarter } };
  by_country: Record<string, {
    name: string;
    series_trimestral: {
      year: number;
      quarter: number;              // 1..4
      rank: number;                 // -3..+3
      direccion: "pro-estado" | "neutro" | "pro-mercado";
      intensidad?: number;
      justificativo: string;        // texto del .md
      eventos: string[];            // bullets del .md
      codificador: string;
      fecha_coding: string;
      regimen?: "trimestral" | "migracion-semanal";  // r3 — distingue entradas naturales de migradas
    }[];
    latest?: /* último trimestre publicado */;
  }>;
}
```

6. Lo serializa a `70-Producto/datos-viento/_compilado/viento.json` (vault, fuente canónica).
7. Lo copia también a `platform/frontend/src/data/coding-viento/viento.json` para que el frontend lo importe sin reach al vault en build.
8. Loguea resumen: "compilados N trimestres de M países; X warnings".

**Frecuencia:**

- Cada vez que se publica un `.md` (manual o vía skill — trigger on-publish heredado de decisión #14 r2).
- Scheduled task **primer viernes del trimestre siguiente** 19:00 ART (después del coding humano de 16:00) corre el build automático como red de seguridad.

### 4. Conexión con `interface Layer` de Spec 39 (r3 — trimestral)

La capa viento (Spec 44) consume este JSON y re-empaqueta en formato `Layer`. **Nota r3:** el bucket model real de Spec 44 r2+ es escala secuencial intensidad (4 buckets de magnitud absoluta + glyph orientado para dirección). El bloque de código aquí abajo es ilustrativo de cómo Spec 41 entrega el dato — el detalle de buckets/paleta cae en Spec 44.

```ts
// platform/frontend/src/lib/layers/viento.ts (esquema simplificado)
import { VIENTO_DATA, getLastVientoBeforeQuarter } from "@/lib/viento";

export const vientoLayer: Layer = {
  id: "viento",
  label: "Viento · orientación pro-mercado / pro-estado",
  shortLabel: "Viento",
  glyphSrc: "/mapa/glyphs/viento.svg",
  category: "editorial",
  description: "Dirección y velocidad del cambio político-económico en el trimestre, codificada en escala -3 a +3.",
  unit: "rank -3 a +3",
  cadence: "trimestral",          // r3: era "semanal"
  periods: buildPeriodsFromQuarters(VIENTO_DATA.by_country),
  defaultPeriod: /* último trimestre publicado */,
  legend: { /* ver Spec 44 §3 — escala secuencial intensidad 4 buckets */ },
  source: {
    name: "Coding editorial Mapa Inestable (viento-v2.0.0)",
    url: "/mapa/capas/viento",
    publishedDate: VIENTO_DATA.computed_at,
    lastFetched: VIENTO_DATA.computed_at,
  },
  getValueForCountry(slug, period) {
    // period.key tiene formato "YYYY-Q#" (ej. "2026-Q2")
    const match = period.key.match(/^(\d{4})-Q(\d)$/);
    if (!match) return null;
    const year = Number(match[1]);
    const quarter = Number(match[2]);
    // Helper de lib/viento.ts: devuelve el último entry publicado ≤ (year, quarter)
    const entry = getLastVientoBeforeQuarter(slug, year, quarter);
    if (!entry) return null;
    return {
      raw: entry.rank,
      formatted: formatViento(entry.rank),  // "+2 pro-mercado" etc. — ver Spec 44 §3.5
      bucketIndex: Math.abs(entry.rank),     // 0..3 (escala secuencial intensidad de Spec 44)
      quality: "oficial",
    };
  },
  getLastPeriodBefore(date) { /* recorre periods[], devuelve último ≤ date */ },
  readingGuideSlug: "viento",
};
```

Spec 44 (capa viento) hereda este código y lo refina (paleta, glyph orientado, modulación por intensidad, etc.). Esta spec (41) solo asegura que el JSON está bien formado.

**Helpers expuestos por `lib/viento.ts` (r3):**

- `getCountryViento(slug): VientoCountryData | null`.
- `getLatestByCountry(): Record<string, VientoQuarterEntry>`.
- `getVientoForQuarter(slug, year, quarter): VientoQuarterEntry | null`.
- `getLastVientoBeforeQuarter(slug, year, quarter): VientoQuarterEntry | null` (modelo de tiempo por capa).
- `getAvailableQuarters(): { year, quarter }[]` (períodos del slider).

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

### 6. Operación: scheduled task (r3 — trimestral)

Registrado en Spec 29 (calendario de agentes). Dos tareas automatizadas con cadencia trimestral:

| Cadencia | Hora | Tarea | Qué hace |
|---|---|---|---|
| Primer viernes del trimestre (enero, abril, julio, octubre) | 16:00 ART | `coding-viento-recordatorio` | Crea/abre los 10 archivos `YYYY-Q#.md` del trimestre **cerrado** (el anterior) en `70-Producto/datos-viento/<slug>/` con frontmatter pre-rellenado en `estado: borrador`. Si el archivo ya existe (porque el editor lo fue editando durante el trimestre), no lo sobrescribe — solo lo abre y recuerda al editor que el trimestre cerró y hay que sintetizar + publicar. Deja un archivo resumen `_recordatorio-YYYY-Q#.md` con checklist de los 10 países. NO genera rank. |
| Primer viernes del trimestre | 19:00 ART | `build-viento` | Corre `build_viento.mjs`. Red de seguridad — el trigger primario sigue siendo on-publish vía skill. Si hubo cambios desde la corrida anterior, regenera el JSON compilado y deja log en `_compilado/_log-YYYY-Q#.md`. |

**Cron expressions (Spec 29):**

- `coding-viento-recordatorio`: `0 16 1-7 1,4,7,10 5` (minuto 0 de hora 16, primeros 7 días del mes en enero/abril/julio/octubre, si es viernes — efectivamente el primer viernes de cada trimestre).
- `build-viento`: `0 19 1-7 1,4,7,10 5`.

**Cadencia humana** (no automatizada, depende del editor):

- **Durante el trimestre en curso**: el editor puede entrar en cualquier momento a `70-Producto/datos-viento/<slug>/YYYY-Q#.md` (creado a mano o por el skill al pedirlo) y agregar eventos a medida que ocurren. El archivo vive en `estado: borrador` durante todo el trimestre. El JSON no lo incluye.
- **Primer viernes del trimestre siguiente, ~16:30 ART**: el recordatorio dispara. El editor entra a Cowork, activa el skill `coding-viento`, va país por país revisando el archivo del trimestre cerrado, sintetiza la lectura agregada, ajusta el rank, y publica (cambia `estado: borrador` → `estado: publicada`). El trigger on-publish dispara `build_viento.mjs` automáticamente para cada publish.
- **19:00 ART**: el build automático corre como red de seguridad por si algún `.md` se publicó por edición manual sin pasar por el skill.

Si el editor no codifica un trimestre, los borradores quedan en `estado: borrador`, el build los ignora, el JSON queda sin update de ese trimestre. La capa viento mostrará el último trimestre publicado disponible (modelo de tiempo por capa de Spec 39, vía `getLastVientoBeforeQuarter`).

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
| `70-Producto/skills/coding-viento/SKILL.md` | NUEVO skill (ver §2) |
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

### Cerradas en r3 (sesión 2026-05-21 — cambio de cadencia editorial)

Cambio de fondo: la operación editorial baja de semanal a trimestral. Decisión de Tomás 2026-05-21 al revisar Spec 44 ("semanal es mucho"). El cambio cascadea a Spec 29 (schedules) y Spec 44 (cadencia de la capa visual).

| # | Tema | Decisión | Razón |
|---|---|---|---|
| 17 | Cadencia editorial | **Trimestral** (4 codings/país/año × 10 países = 40 codings/año). El rank captura movimiento estructural del trimestre, no de la semana | Operacionalmente más sostenible (52 codings/año/país → 4/año/país). El movimiento estructural se lee mejor en agregados trimestrales; semanal agrega ruido. La cadencia coincide 1:1 con Spec 42/43, lo que elimina la divergencia (e) de Spec 44 r1/r2 (cadencia semanal con `getLastVientoBeforeWeek` como fallback) — Spec 44 baja de 5 divergencias a 4 |
| 18 | Schema del .md | `year + quarter` (1-4) en lugar de `year + week` (1-52). Nombre de archivo `YYYY-Q#.md`. Campo nuevo `regimen: trimestral \| migracion-semanal` distingue entradas naturales de entradas migradas del régimen r1/r2 | Trazabilidad de la transición y futura compatibilidad con Spec 41B (algoritmo híbrido) que podrá filtrar por régimen si hace falta |
| 19 | Régimen del archivo en curso | El archivo del trimestre vivo se edita en `estado: borrador` durante todo el trimestre (agregando eventos a medida que ocurren). Se publica al cierre del trimestre (primer viernes del trimestre siguiente, disparado por scheduled task) | Combina "lectura sintética" (el editor revisa al cierre con todo el material visible) con "registro incremental" (los eventos no se olvidan porque se anotan a medida que ocurren). El JSON no incluye trimestres en curso — solo cerrados |
| 20 | Schedules de Spec 29 | `coding-viento-recordatorio` y `build-viento` pasan de viernes semanal a primer viernes del trimestre. Crons: `0 16 1-7 1,4,7,10 5` y `0 19 1-7 1,4,7,10 5` | Coherente con la cadencia editorial. Spec 29 se actualiza en este mismo sprint |
| 21 | Versionado del JSON | `viento-v2.0.0` (breaking: `series_semanal` → `series_trimestral`; `start_week`/`end_week` → `start_quarter`/`end_quarter`) | Cambio de contrato del campo principal — debe ser breaking. El frontend `lib/viento.ts` se reescribe en consecuencia (los tipos de TypeScript no son compatibles con la versión anterior) |
| 22 | Migración de archivos r1/r2 | AR W18 (rank +3) + AR W19 (rank +1) → AR Q2-2026 con rank +2 (`Math.round(Math.abs((3+1)/2)) = 2`, dirección pro-mercado), justificativo sintético cubriendo ambas semanas, `regimen: migracion-semanal`, `intensidad: 0.6` (promedio de 0.85 y 0.4 redondeado). Los archivos W18 y W19 originales se mueven a `70-Producto/datos-viento/ar/_historico-semanal/`. Los 10 borradores W21 generados por el recordatorio del 2026-05-20 se eliminan (régimen deprecado) | Conservar trazabilidad histórica sin contaminar el régimen trimestral. La marca `migracion-semanal` permite al lector entender que el rank Q2-2026 viene de promediar 2 semanas, no de sintetizar el trimestre entero |
| 23 | Spec 44 hereda la cadencia | Spec 44 r3 absorbe el cambio: `cadence: "trimestral"` declarado, `buildPeriods` usa `getAvailableQuarters()` en lugar de `getAvailableWeeks()`, `getValueForCountry` usa `getLastVientoBeforeQuarter` en lugar de `getLastVientoBeforeWeek`. La divergencia (e) "cadencia semanal" se cae como divergencia local — Spec 44 queda con 4 divergencias en lugar de 5 | Coherencia entre las 4 capas del epic. La capa viento se alinea con Spec 42/43 en cadencia |

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
6. **Crear el skill `coding-viento`** en `70-Producto/skills/coding-viento/SKILL.md`. Implementar las 7 responsabilidades de §2. Smoke test: pedirle al skill que cree el coding de Argentina para la semana actual.
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
| 2026-05-21 (r3) | **Cambio de cadencia editorial: semanal → trimestral.** 7 decisiones nuevas cerradas (#17-#23): cadencia trimestral, schema del .md con `year + quarter`, régimen del archivo en curso (editar borrador durante el trimestre, publicar al cierre), schedules de Spec 29 reagendados a primer viernes del trimestre siguiente, versionado del JSON a `viento-v2.0.0` (breaking), migración de los archivos r1/r2 ya publicados (AR W18+W19 → AR Q2-2026 promediado con marca `regimen: migracion-semanal`), y Spec 44 hereda automáticamente la cadencia. Estado de la spec pasa de `implementada` a `implementada-parcial-r3` porque el código actual del pipeline (regex de nombre de archivo, contrato del JSON, helpers) está implementado contra r2 — la implementación r3 requiere sesión nueva de VS Code | Tomás revisó Spec 44 r2 y dijo: "semanal es mucho". La operación semanal exige 52 codings/año/país × 10 países = 520 codings/año, lo que en producción real es insostenible para un codificador único. Trimestral (40/año) es comparable a la producción de despachos semanales del proyecto. Plus: alinea la cadencia con Spec 42/43, eliminando la única divergencia técnica fuerte que Spec 44 tenía (cadencia semanal) y dejando 4 divergencias en vez de 5 |

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
