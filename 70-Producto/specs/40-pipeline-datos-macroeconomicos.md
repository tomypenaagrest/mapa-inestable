---
spec: 40
titulo: Pipeline de datos macroeconómicos — formalización y extensión para alimentar capas
estado: implementada
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-18
revision: 2026-05-18 (r2) — cerradas 5 de las 6 decisiones tácticas abiertas en r1; queda abierta solo la #2 (historial de revisiones) por decisión explícita de Tomás
epic: 03
afecta:
  - platform/data/indicators-macro/build_indicators_macro.py (extender: cadencias sub-anuales, prioridad de stubs)
  - platform/data/indicators-macro/sources.py (extender: adaptadores trimestrales/mensuales para fuentes que ya soportan)
  - platform/data/indicators-macro/indicators-macro.json (schema extendido + nuevos indicadores)
  - platform/data/indicators-macro/README.md (actualizar con contrato público + frecuencia de refresh)
  - platform/frontend/src/lib/macro-indicators.ts (extender tipos para series_trimestral / series_mensual opcionales)
  - platform/frontend/src/lib/layers/precipitacion.ts (consume PBI trimestral del JSON)
  - platform/frontend/src/lib/layers/temperatura.ts (consume salario real mensual del JSON)
  - 70-Producto/specs/29-calendario-agentes-automaticos.md (agregar entrada de pipeline-macro-refresh)
  - mapa-inestable.plugin/skills/pipeline-macro-refresh/ (NUEVO skill supervisor)
depende_de: [14, 14A, 39]
depende_blanda_de: [29]
relaciona_con:
  - Spec 14 (indicadores estructurales) — define el conjunto curado de 24+ indicadores
  - Spec 14A (curaduría) — la decisión editorial sobre qué indicadores entran
  - Spec 14B (pipeline) — referenciado en el script existente como spec origen del laburo
  - Spec 39 (arquitectura de capas) — define el contrato `Layer` que consume del JSON
  - Spec 29 (calendario de agentes) — donde se registra el schedule del refresh
  - EPIC-03 (decisión 5: precipitación = crecimiento económico; decisión 4: temperatura = salario real)
desbloquea:
  - Spec 42 (capa precipitación) — consume PBI trimestral
  - Spec 43 (capa temperatura) — consume salario real mensual
prioridad: alta
---

# 40 · Pipeline de datos macroeconómicos — formalización y extensión

## Resumen ejecutivo

EPIC 03 introduce dos capas analíticas que se alimentan de datos macroeconómicos: **precipitación** (crecimiento económico) y **temperatura** (salario real + desigualdad). Spec 39 definió el contrato `interface Layer` que cada capa implementa; queda definir el contrato del **pipeline de datos** que esas capas consumen.

**Buena noticia: el pipeline ya existe.** Spec 14B montó `platform/data/indicators-macro/build_indicators_macro.py` + `sources.py` + el JSON con 15 indicadores poblados (de 26 definidos en Spec 14A) cubriendo 9-10 de los 10 países. El script tiene adaptadores funcionales para Banco Mundial; los 11 stubs están identificados explícitamente. Esta spec no rediseña nada — **formaliza el pipeline existente como contrato estable + lo extiende donde las capas lo pidan**.

**Tres extensiones concretas que esta spec habilita:**

1. **Schema extendido con cadencias sub-anuales.** El JSON actual sirve `series` anual (2010-2024). Las capas precipitación (trimestral) y temperatura (mensual) requieren mayor granularidad. Esta spec agrega `series_trimestral` y `series_mensual` como campos opcionales del schema, sin romper consumidores existentes del JSON.

2. **Indicadores nuevos prioritarios para capas.** `a2-crecimiento-pbi` en versión trimestral (fuente: BM API series QQ del WEO IMF como alternativa). Salario real mensual + ratio mediano/promedio (fuente: INDEC EPH / IBGE PNAD / INE EPF según país).

3. **Operación automatizada vía skill de Cowork + scheduled task semanal.** Coherente con el patrón de Spec 29. El skill `pipeline-macro-refresh` supervisa la frescura del JSON, dispara la ejecución del script Python cuando lleva > N días sin actualizarse, y registra en el vault qué cambió.

**Lo que entra en r1:**

- Contrato público del JSON como input estable para las capas (interfaz documentada, no más asumida).
- Schema extendido con `series_trimestral` y `series_mensual` opcionales, sin breaking changes.
- Especificación de los 2 indicadores nuevos (PBI trimestral, salario real mensual) que las capas precipitación y temperatura necesitan.
- Priorización de los 11 stubs según uso en capas (cuál se completa para r1, cuál queda como stub).
- Operación: skill de Cowork supervisor + scheduled task semanal (registrado en Spec 29).
- Política de versionado del JSON (cuándo subir minor vs mayor, qué cuenta como breaking).
- Política de manejo de revisiones retroactivas (qué pasa cuando una fuente revisa un dato histórico).

**Lo que NO entra en r1:**

- Rediseño de `build_indicators_macro.py` o `sources.py`. Estos siguen siendo la implementación, esta spec define su contrato.
- Cobertura completa de los 11 stubs. Solo se completan los que sirven a alguna capa de EPIC 03.
- Pipeline de datos políticos para la capa viento → Spec 41 (separada por dependencias distintas).
- Pipeline de Latinobarómetro para la capa presión → ya existe en `lib/latinobarometro.ts`, no necesita refactor en esta spec.
- Cambio de fuentes (ej. dejar de usar BM y pasar a IMF). Decisiones de qué fuente para qué indicador siguen en Spec 14A.

---

## Estado actual

### Lo que existe en `platform/data/indicators-macro/`

```
platform/data/indicators-macro/
├── README.md
├── build_indicators_macro.py   ← script generador del JSON
├── sources.py                   ← adaptadores por fuente (BM + descargas manuales)
├── indicators-macro.json        ← output curado, consumido por el frontend
└── raw/                          ← cache de datos crudos descargados
```

**`build_indicators_macro.py`** (verificado):

- Header: "Pipeline de indicadores estructurales (Spec 14B)".
- Define 26 indicadores en 4 familias (riqueza, comercio, empleo, sociales) para 10 países sudamericanos.
- Período: 2010-2024 (constantes `YEAR_START`, `YEAR_END`).
- Output: `indicators-macro.json` con metadata (`version`, `computed_at`, `year_start`, `year_end`, `stubs`) + array de `indicators`.

**`sources.py`** (verificado):

- Define `COUNTRIES_SA` con mapeo ISO2 → ISO3 (necesario para llamadas al BM).
- Cache local en `raw/` con archivos JSON descargados.
- Función `wb_series(country_iso2, code)` que llama a la API del Banco Mundial.
- Fuentes que requieren descarga manual (CEPALSTAT, OIT, etc.) emiten warning y devuelven dict vacío — quedan como stubs.

**`indicators-macro.json`** (estado al 2026-05-18):

- 26 indicadores definidos, **15 con datos reales** para 9-10 de los 10 países.
- **11 stubs**: `b1-exp-primarias`, `b2-cuota-principal-socio`, `b3-cuota-china`, `b4-cuota-eeuu`, `b5-ied-pbi`, `c3-registrado`, `c6-subocupacion`, `d1-pobreza`, `d2-indigencia`, `d6-homicidios`, `d7-presion-tributaria`.
- Schema actual de cada `MacroIndicator`:
  ```ts
  interface MacroIndicator {
    id: string;
    label: string;
    family: "riqueza" | "comercio" | "empleo" | "sociales";
    family_label: string;
    axis_primary: string | null;
    axis_secondary: string[];
    unit: string;
    source: { name, code, url, pulled_at };
    methodology: string;
    n_countries_covered: number;

    /** NUEVO en Spec 40 r2 (decisión #13).
     *  Opcional. Presente cuando la fuente entera dejó de actualizar
     *  (no es lo mismo que un datapoint individual estimado).
     *  Ej: "2024-Q3" significa que el indicador no recibe actualizaciones
     *  oficiales desde Q3 2024 y los valores recientes son congelados. */
    frozen_since?: string;

    by_country: Record<ISO2, {
      name: string;
      series: { year: number; value: number; quality: Quality }[];
      series_trimestral?: { year: number; quarter: number; value: number; quality: Quality }[];  // r2
      series_mensual?:    { year: number; month: number;   value: number; quality: Quality }[];  // r2
      latest?: MacroDataPoint;
      notes?: string;
    }>;
  }
  ```

**Lo que ya funciona (no se toca):**

- Los 4 dashboards de país consumen este JSON vía `lib/macro-indicators.ts`.
- Quality flags (`oficial | estimado | congelado`) ya implementados en cada datapoint.
- Función `delta(series, yearsBack)` para variaciones, ya existente.
- Función `getCountryMacro(slug)` para obtener todos los indicadores de un país.

### Lo que falta para alimentar las capas

EPIC 03 define:

| Capa | Indicador necesario | Cadencia que el epic implica | Estado en el pipeline |
|---|---|---|---|
| Precipitación | Crecimiento real del PBI | Trimestral | Existe **anual** (`a2-crecimiento-pbi`) |
| Temperatura | Salario real | Mensual | **NO existe** |
| Temperatura (opcional) | Ratio salario mediano / promedio | Anual o menor | **NO existe** |
| Viento | — | — | NO depende del pipeline macro (Spec 41) |
| Presión | — | — | NO depende del pipeline macro (`lib/latinobarometro.ts`) |

Dos huecos a llenar en esta spec:

1. Extender `a2-crecimiento-pbi` con cadencia trimestral.
2. Agregar un indicador nuevo `c7-salario-real-mensual` (o equivalente).

---

## Propuesta

### 1. Contrato público del JSON como input para las capas

El `indicators-macro.json` deja de ser "ese JSON que el dashboard de país consume" para pasar a ser **el input estable del pipeline macro al sistema de capas**. Eso impone responsabilidades:

- **Schema estable**. Cambios al schema requieren bump de `version` con regla semver (ver §5).
- **Cobertura documentada**. La metadata top-level dice qué indicadores tienen datos, qué stubs, qué países cubre cada indicador.
- **Calidad explícita por dato**. Cada datapoint tiene `quality: "oficial" | "estimado" | "congelado"` (ya existe). Spec 40 documenta cuándo aplicar cada uno.
- **Frescura visible**. Cada indicador expone `source.pulled_at` (ya existe). El consumidor (capa) puede decidir si un dato es viejo.

### 2. Schema extendido con cadencias sub-anuales

El schema actual sirve anual:

```ts
by_country: {
  AR: {
    name: "Argentina",
    series: [{ year: 2024, value: 1.2, quality: "oficial" }, ...]
  }
}
```

Se extiende con dos campos opcionales:

```ts
by_country: {
  AR: {
    name: "Argentina",
    series: [{ year: 2024, value: 1.2, quality: "oficial" }, ...],

    /** NUEVO en Spec 40 r1. Opcional — solo presente si la fuente publica trimestral. */
    series_trimestral?: {
      year: number;       // 2024
      quarter: number;    // 1, 2, 3, 4
      value: number;
      quality: Quality;
    }[];

    /** NUEVO en Spec 40 r1. Opcional — solo presente si la fuente publica mensual. */
    series_mensual?: {
      year: number;       // 2024
      month: number;      // 1..12
      value: number;
      quality: Quality;
    }[];

    latest?: MacroDataPoint;
    notes?: string;
  }
}
```

**Reglas:**

- `series` (anual) sigue siendo **obligatorio** para todo indicador con datos. Es la base.
- `series_trimestral` y `series_mensual` son **opcionales**. Solo presentes en indicadores que las capas (u otros consumidores) requieren.
- Consistencia anual ↔ sub-anual: si un indicador tiene ambas, el `series` anual debe coincidir con el agregado de la sub-anual (promedio, suma, fin de período según corresponda — documentado en `methodology` del indicador). El pipeline lo valida en el build.
- `quality` de cada datapoint sub-anual se calcula independientemente. Es común que un trimestre quede "estimado" hasta la revisión anual.

### 3. Indicadores nuevos a agregar en r1

Dos indicadores nuevos para alimentar las capas precipitación y temperatura. Especificados en formato compatible con `INDICATOR_SPECS` de `build_indicators_macro.py`:

#### 3.1 PBI trimestral (extensión de `a2-crecimiento-pbi`)

No es un indicador nuevo — es la extensión del existente con `series_trimestral`.

- **Fuente principal:** Banco Mundial (`NY.GDP.MKTP.KD.ZG` para anual; para trimestral usar World Bank Quarterly National Accounts o pasar a IMF IFS).
- **Fuente alternativa por país:** banco central / instituto de estadística cuando la oficial atrasa. INDEC EMAE para Argentina, IBGE PIB Trimestral para Brasil, INE Cuentas Nacionales para Chile, etc.
- **Cadencia oficial:** trimestral con rezago típico 2-3 meses.
- **Quality**: `oficial` cuando es publicación firme; `estimado` cuando es preliminar del último trimestre.
- **Cobertura objetivo:** los 10 países.
- **Período inicial:** 2021-Q1 a último trimestre disponible (coherente con la decisión 9 del epic: profundidad histórica 5 años).

#### 3.2 Salario real mensual (`c7-salario-real-mensual`)

Indicador nuevo, familia `empleo`, axis `desorientacion` o `mediaciones` según país.

- **Fuente por país** (curaduría editorial, decidir en implementación):
  - AR: INDEC RIPTE o IPI con deflactor IPC.
  - BR: IBGE PNAD Contínua Mensal (rendimento real médio).
  - CL: INE IR (Índice de Remuneraciones Reales).
  - CO: DANE GEIH (ingreso laboral medio real).
  - BO/PY/UY/PE/EC/VE: validar disponibilidad mensual; si no hay, usar mejor cadencia disponible.
- **Cadencia:** mensual donde la fuente publica, sino trimestral o anual como fallback.
- **Unit:** índice base 2021=100 (para comparar tendencia entre países sin convertir monedas).
- **Quality:** `oficial` para datos publicados, `estimado` para preliminares.
- **Cobertura objetivo r1:** 6-8 países (los que tienen fuente confiable). Tomás puede ampliar a 10 en r2 si encuentra fuentes.

#### 3.3 (Opcional) Ratio salario mediano / promedio

Indicador secundario para la capa temperatura — agrega lectura de desigualdad casi gratis. **Decisión: se evalúa en Spec 43 (capa temperatura), no en esta spec.** Si Spec 43 lo pide, se agrega como indicador nuevo (`c8-salario-mediano-promedio` o similar).

### 4. Priorización de los 11 stubs

Solo se completan en r1 los stubs que alimentan alguna capa de EPIC 03 o aportan claramente a la dashboard de país:

| Stub | ¿Alimenta capa? | Acción r1 |
|---|---|---|
| `b1-exp-primarias` | No directamente | Mantener stub |
| `b2-cuota-principal-socio` | No directamente | Mantener stub |
| `b3-cuota-china`, `b4-cuota-eeuu` | No directamente | Mantener stub |
| `b5-ied-pbi` | No directamente | Mantener stub |
| `c3-registrado` | No (informalidad ya cubierta en `c2-informalidad`) | Mantener stub |
| `c6-subocupacion` | No directamente | Mantener stub |
| **`d1-pobreza`** | Posible capa temperatura secundaria | **Marcar prioritario; completar si fuente fácil (CEPALSTAT o BM SI.POV.NAHC)** |
| **`d2-indigencia`** | Posible capa temperatura secundaria | **Marcar prioritario; completar si fuente fácil** |
| `d6-homicidios` | No directamente | Mantener stub (puede ser señal de eje deculturación más adelante) |
| `d7-presion-tributaria` | No directamente | Mantener stub |

Los stubs que se mantienen siguen apareciendo en `indicators-macro.json` con su estructura y `by_country` vacío. Visibles en metadata pero sin datos. El frontend ya los maneja.

### 5. Versionado del JSON

El JSON expone `version` en metadata top-level. Política de versionado tipo semver:

- **Patch** (`macro-v1.0.X`): refresh de datos sin cambios al schema ni indicadores. Cada corrida del pipeline que actualiza datos sube patch.
- **Minor** (`macro-v1.X.0`): nuevo indicador agregado, o nuevo campo opcional en el schema. Stub completado a indicador real cuenta como minor.
- **Major** (`macro-v2.0.0`): breaking change — campo obligatorio removido o renombrado, cambio de unidad, cambio de cadencia base de un indicador, eliminación de un indicador previamente con datos.

El bump a minor o major va acompañado de una entrada en `CHANGELOG.md` (nuevo, en `platform/data/indicators-macro/CHANGELOG.md`) describiendo qué cambió y por qué.

### 6. Manejo de revisiones retroactivas

Las fuentes revisan datos históricos (típico ejemplo: INDEC revisa el PBI 2022 dos años después). Política:

- **Sobreescribir el valor** en el JSON. Es lo que dice la fuente hoy, debe ser lo que muestra el sitio.
- **Marcar el datapoint como `quality: "oficial"`** si la revisión es publicación oficial; mantener `estimado` si la fuente lo califica así.
- **Loguear el cambio** en `CHANGELOG.md` cuando la revisión es significativa (cambio > X%, donde X se define en la entrada del CHANGELOG, no acá).
- **No mantener histórico de revisiones en el JSON.** Si se necesita, lleva su propio archivo `historial-revisiones.json` con `{indicator_id, country, year, old_value, new_value, revised_at, source_note}`. Decisión abierta para r2: si vale armarlo.

### 7. Operación: skill `pipeline-macro-refresh` + scheduled task semanal

Coherente con Spec 29 (calendario de agentes), se crea un skill nuevo del plugin Mapa Inestable.

**Skill `pipeline-macro-refresh`:**

- Vive en `mapa-inestable.plugin/skills/pipeline-macro-refresh/SKILL.md`.
- Activación: scheduled task (ver abajo) o manual ("refrescá el pipeline macro").
- **Dónde corre (decisión #10 r2):** el script Python `build_indicators_macro.py` se ejecuta en el **sandbox bash de Cowork**, disparado por el skill. El skill orquesta + el sandbox ejecuta. Requiere que el sandbox tenga network access para llamar a la API del Banco Mundial. Validar en implementación.
  - Fallback si el sandbox no puede ejecutar Python con network access: el skill solo supervisa (chequea frescura del JSON actual, detecta atraso), Tomás corre el script manualmente en su laptop y commitea. Decisión cae en implementación si el camino primario falla.
- Qué hace:
  1. Lee `indicators-macro.json` actual y extrae `version`, `computed_at`, y `pulled_at` de cada fuente.
  2. Si `computed_at` es de hace > 7 días, dispara refresh.
  3. Dispara la ejecución de `build_indicators_macro.py` en el sandbox de Cowork.
  4. Compara JSON antes/después: cuenta indicadores actualizados, datapoints cambiados, stubs completados.
  5. **Auto-promote con umbral del 5% (decisión #12 r2):** si los cambios son triviales (ningún datapoint varió más del 5%, no hubo indicadores nuevos, ningún stub completado), promote automático del JSON a `platform/frontend/src/data/indicators-macro/indicators-macro.json` con log "auto-promoted". Si algún datapoint superó el umbral o hay cambios estructurales: deja el JSON en `60-Borradores/pipeline-macro/` con `estado: borrador`, espera review manual de Tomás.
  6. Si hay cambios materiales: deja un archivo `_resumen-YYYY-W##.md` en `60-Borradores/pipeline-macro/` (nuevo directorio) con el log de cambios. Sigue el patrón de Spec 28 (resumen semanal de agendas).
  7. Si hubo bump de minor o major: agrega entrada al CHANGELOG.

**Scheduled task semanal:**

- Cadencia: **viernes 18:00 ART** (después del task de agendas que corre 17:00 ART, ver Spec 28). Tomás puede ajustar.
- Una sola tarea (no una por indicador) — el script Python ya maneja todos los indicadores en una corrida.
- Registrado en Spec 29.

**Principios del sistema de agentes (Spec 29) que aplican:**

1. Borrador → promote: el JSON nuevo se guarda como propuesta en `60-Borradores/pipeline-macro/`, Tomás valida visualmente, ejecuta promote manual al frontend. Excepción opcional para r2: auto-promote si no hay cambios materiales (solo refresh de datapoints existentes sin cambios > X%).
2. El skill deja log de resumen, no escribe directo al frontend.
3. Aislación: una tarea, un script.

### 8. Conexión con `interface Layer` de Spec 39

Cada capa que consume del pipeline macro implementa `Layer` (definido en Spec 39) re-empaquetando datos del JSON.

Ejemplo: `lib/layers/precipitacion.ts` consume `a2-crecimiento-pbi`:

```ts
import { MACRO_INDICATORS } from "@/lib/macro-indicators";
import type { Layer, LayerPeriod, LayerValue } from "@/lib/layers";

const pbi = MACRO_INDICATORS.find(i => i.id === "a2-crecimiento-pbi")!;

export const precipitacionLayer: Layer = {
  id: "precipitacion",
  label: "Precipitación · crecimiento económico",
  shortLabel: "Precipitación",
  glyphSrc: "/mapa/glyphs/precipitacion.svg",
  category: "macro",
  description: "Crecimiento real del PBI, lectura trimestral.",
  unit: pbi.unit,
  cadence: "trimestral",
  periods: buildPeriodsFromTrimestral(pbi.by_country),
  defaultPeriod: /* último período disponible */,
  legend: { /* buckets divergentes -2% a +4% */ },
  source: {
    name: pbi.source.name,
    url: pbi.source.url,
    publishedDate: pbi.source.pulled_at,
    lastFetched: pbi.source.pulled_at,
  },
  getValueForCountry(slug, period) {
    const iso2 = slug.toUpperCase();
    const country = pbi.by_country[iso2];
    if (!country?.series_trimestral) return null;
    const dp = country.series_trimestral.find(
      d => d.year === period.year && d.quarter === period.quarter
    );
    if (!dp) return null;
    return {
      raw: dp.value,
      formatted: `${dp.value.toFixed(1)}%`,
      bucketIndex: bucketize(dp.value),
      quality: dp.quality,
    };
  },
  getLastPeriodBefore(date) { /* ... */ },
  readingGuideSlug: "precipitacion",
};
```

Esta spec no impone el código de cada capa — eso lo hace cada Spec 42-43. Pero documenta el patrón esperado: la capa **re-empaqueta** datos del JSON, no los almacena de nuevo.

---

## Archivos a tocar

| Archivo | Acción |
|---|---|
| `platform/data/indicators-macro/build_indicators_macro.py` | EXTENDER — agregar lógica para construir `series_trimestral` y `series_mensual` para indicadores que la fuente permita; agregar specs de los dos indicadores nuevos (PBI trimestral, salario real mensual); marcar stubs prioritarios |
| `platform/data/indicators-macro/sources.py` | EXTENDER — agregar adaptadores para series trimestrales/mensuales (BM `wb_series_quarterly`, scrapers o downloads para INDEC EMAE, IBGE PIB Trimestral, INE IR, DANE GEIH) |
| `platform/data/indicators-macro/indicators-macro.json` | REGENERAR — nuevo schema con `series_trimestral` / `series_mensual` opcionales; 2 indicadores nuevos; stubs prioritarios completados si fuente fácil |
| `platform/data/indicators-macro/README.md` | ACTUALIZAR — documentar contrato público, cadencia de refresh, política de versionado, dónde leer el CHANGELOG |
| `platform/data/indicators-macro/CHANGELOG.md` | NUEVO — versionado semver del JSON, entrada inicial documenta el bump de Spec 40 |
| `platform/frontend/src/lib/macro-indicators.ts` | EXTENDER — agregar tipos `series_trimestral?` y `series_mensual?` al `MacroCountryData` |
| `mapa-inestable.plugin/skills/pipeline-macro-refresh/SKILL.md` | NUEVO — skill supervisor (ver §7) |
| `60-Borradores/pipeline-macro/` | NUEVO directorio del vault — donde el skill deja los `_resumen-YYYY-W##.md` |
| `70-Producto/specs/29-calendario-agentes-automaticos.md` | ACTUALIZAR — agregar entrada de `pipeline-macro-refresh` viernes 18:00 ART |

---

## Criterios de aceptación

| # | Criterio | Verificación |
|---|---|---|
| AC1 | El JSON regenerado conserva los 15 indicadores anuales existentes sin cambios en `series` | Diff antes/después: bloque `series` de los 15 indicadores idéntico |
| AC2 | `a2-crecimiento-pbi` tiene `series_trimestral` poblado para al menos 8 países desde 2021-Q1 | Inspect JSON: campo presente con ≥ 8 países × ≥ 17 trimestres |
| AC3 | Nuevo indicador `c7-salario-real-mensual` con `series_mensual` para al menos 6 países desde 2021-01 | Inspect JSON: indicador presente, ≥ 6 países, ≥ 60 datapoints/país |
| AC4 | Stubs `d1-pobreza` y `d2-indigencia` completados o marcados como `priority` en metadata si fuente no estaba lista | Inspect JSON: `by_country` con datos o flag `priority_stub: true` |
| AC5 | `version` bumpeado de `macro-v1` a `macro-v1.1.0` (minor por nuevos indicadores) o `macro-v2.0.0` (major si schema rompe consumidores) | Inspect JSON.version |
| AC6 | CHANGELOG entrada con fecha 2026-05-18 documentando los cambios de Spec 40 | Read `CHANGELOG.md` |
| AC7 | `lib/macro-indicators.ts` actualizado con tipos opcionales; type-check pasa | `pnpm typecheck` |
| AC8 | Skill `pipeline-macro-refresh` ejecuta correctamente y deja un `_resumen-YYYY-W##.md` en el vault | Correr manualmente, verificar archivo |
| AC9 | Scheduled task viernes 18:00 ART registrado en Spec 29 + creado en Cowork | Inspect Spec 29 + lista de scheduled tasks |
| AC10 | Stub `precipitacionLayer` de Spec 39 puede reemplazarse por implementación real que lee `a2-crecimiento-pbi.series_trimestral` y renderiza sobre el mapa | Smoke test: activar capa precipitación con datos reales, verificar render |
| AC11 | Validación interna del pipeline: si un indicador tiene `series` (anual) y `series_trimestral`, el agregado de los 4 trimestres coincide ±0.1% con el anual | Script de validación al final del build |
| AC12 | El JSON regenerado se sirve correctamente al frontend sin romper dashboards de país (Spec 16) | Smoke test: abrir `/pais/argentina`, verificar que indicadores anuales siguen mostrándose |
| AC13 | El skill `pipeline-macro-refresh` ejecuta `build_indicators_macro.py` en el sandbox bash de Cowork con acceso a Internet | Activar skill manualmente, verificar que llega a la API del BM y descarga datos. Si falla por sandbox sin network, documentar y caer al fallback manual |
| AC14 | Auto-promote con umbral del 5%: cuando ningún datapoint varió > 5% y no hay indicadores nuevos / stubs completados, el JSON se copia automáticamente a `platform/frontend/src/data/indicators-macro/` con log "auto-promoted" | Forzar dos corridas seguidas con datos casi iguales, verificar que la segunda auto-promueve sin pedir review |
| AC15 | Auto-promote NO ocurre cuando el umbral se supera: el JSON queda en `60-Borradores/pipeline-macro/` esperando review manual | Simular cambio de 10% en un datapoint, verificar que NO se promueve y queda como borrador |
| AC16 | Campo `frozen_since?: string` aplicado a indicadores cuya fuente entera dejó de actualizar (caso Venezuela en algunos indicadores típicos) | Inspect JSON: si `b6-deuda-pbi` o similar tiene fuente discontinuada para algún país, el indicador tiene `frozen_since` |

---

## Edge cases

- **Una fuente trimestral solo publica algunos países** (típico: BM solo tiene quarterly para algunos): el indicador puede tener `series_trimestral` poblado para 8 de los 10 países y vacío en 2. La capa que lo consume devuelve `null` para los países sin datos y `noDataColor` los renderiza en gris.
- **Salario real con metodologías incomparables entre países** (INDEC mide nominal con IPC, IBGE mide rendimento real directo): cada serie expone su `methodology` en el indicador; el frontend puede mostrar disclaimer cuando se comparan países con metodologías distintas.
- **Datos preliminares vs revisados**: el script Python descarga lo que la API publica hoy. Si un trimestre está "preliminar" según la fuente, marca `quality: "estimado"`. El re-build de la semana siguiente sobreescribe si pasa a oficial.
- **Refresh corre y la API falla**: el skill detecta error, mantiene el JSON anterior intacto, deja log en `_resumen-YYYY-W##.md` con "FALLA · revisar". No se commitea nada roto.
- **Refresh corre y no hay cambios**: el skill detecta diff vacío, deja log "sin cambios", no bumpea version, no toca el JSON.
- **Stub completado** (un stub pasa a tener datos por primera vez): se trata como minor bump, entrada en CHANGELOG, opcionalmente un mensaje al equipo.
- **Indicador removido**: prohibido. Si un indicador deja de actualizarse (fuente discontinuada), se mantiene en el JSON con la última serie disponible y `quality: "congelado"` para todos los datapoints recientes. Notas en el indicador explican el caso.
- **Build local vs remoto**: el script Python necesita network access a APIs externas. Si corre en el sandbox de Cowork, validar que el sandbox tenga acceso. Si no, el skill solo supervisa y la ejecución real es manual en la laptop de Tomás (ver decisión abierta #1).

---

## Decisiones tomadas

### Cerradas en r1 (sesión 2026-05-18, primera pasada — diseño)

| # | Tema | Decisión | Razón |
|---|---|---|---|
| 1 | Alcance respecto al pipeline existente | **Formalizar + extender** lo que hay, no rediseñar | Spec 14B ya hizo el trabajo pesado. Reinventar sería destruir valor. La spec define contrato público + agrega lo que las capas piden |
| 2 | Cadencia | **Anual como base + extensión a trimestral/mensual** para indicadores clave (PBI trimestral, salario real mensual) | Equilibrio entre fidelidad temporal de las capas y costo de pipeline. Anual sirve a dashboards existentes; sub-anual sirve a capas. Schema opcional no rompe consumidores |
| 3 | Manejo de los 11 stubs | **Solo completar los que alimentan capas en r1** (priorizar `d1-pobreza`, `d2-indigencia` si fuente fácil); el resto queda como stub | Maximiza valor por unidad de tiempo. Stubs no urgentes siguen marcados, completables en spec posterior |
| 4 | Operación | **Skill supervisor `pipeline-macro-refresh` + scheduled task semanal viernes 18:00 ART** | Coherente con el patrón de Spec 29 (calendario de agentes). Tomás puede correr manual on-demand. Vault como medio (log en `60-Borradores/pipeline-macro/`) |
| 5 | Versionado | Semver: patch = refresh, minor = nuevo indicador/campo, major = breaking | Estándar conocido, predecible para consumidores |
| 6 | Revisiones retroactivas | Sobreescribir + log en CHANGELOG cuando es significativo | Honestidad: lo que dice la fuente hoy es lo que el sitio muestra. Historial de revisiones queda como opcional para r2 |
| 7 | Schema extendido | `series_trimestral?` y `series_mensual?` como campos opcionales, no rompen consumidores actuales | Backward compatible. Dashboards existentes ignoran los campos nuevos |
| 8 | Validación interna | El pipeline valida consistencia anual ↔ sub-anual (suma/promedio según corresponda) en cada build | Detecta inconsistencias temprano, antes de que un dato roto llegue al sitio |
| 9 | Conexión con `Layer` (Spec 39) | Cada capa re-empaqueta del JSON, no almacena de nuevo | Single source of truth. Si el dato cambia, todas las capas que lo usan ven el cambio |

### Cerradas en r2 (sesión 2026-05-18, segunda pasada — cierre de tácticas abiertas)

| # | Tema | Decisión | Razón |
|---|---|---|---|
| 10 | Dónde corre el script Python | **Sandbox de Cowork desde el skill `pipeline-macro-refresh`** | Tomás: tiene más sentido. Coherente con el flujo de Cowork — el skill orquesta + el sandbox ejecuta el Python. Requiere que el sandbox tenga acceso a Internet para llamadas al BM (verificar en implementación que tiene network access; si no, fallback a la opción "manual desde laptop") |
| 11 | Cobertura del salario real | **6-8 países en r1**, los faltantes (probablemente Bolivia, Paraguay, Venezuela) se agregan en una pasada posterior cuando se encuentren fuentes mensuales viables | Tomás: ok, buscar forma de mejorar la cobertura más adelante. La capa temperatura puede arrancar con cobertura parcial y mostrar `noDataColor` para países sin dato |
| 12 | Auto-promote del JSON nuevo | **Auto-promote con umbral del 5%**: si ningún datapoint varió más del 5% y no hubo indicadores nuevos / stubs completados, promote automático con log. Si superó el umbral en al menos un dato, queda como borrador esperando review manual de Tomás | Equilibrio entre evitar fricción semanal innecesaria y mantener control sobre cambios materiales. El umbral del 5% se tunea con la primera evidencia operativa (probablemente 3-6 semanas de refresh) |
| 13 | Bandera de calidad `congelado` global | **Agregar campo opcional `frozen_since?: string` al indicador** (no solo al datapoint) cuando una fuente entera deja de actualizar. Permite distinguir "datapoint estimado individual" de "indicador entero atrasado por fuente discontinuada" | Tomás: ok. Más limpio que marcar cada datapoint cuando todos están en la misma situación |
| 14 | Ratio salario mediano/promedio | **Sí agregar como indicador `c8-salario-mediano-promedio`** si Spec 43 (capa temperatura) lo necesita. Decisión final cae en Spec 43, esta spec deja la opción confirmada | Tomás: está bien. La capa temperatura gana una lectura de desigualdad casi gratis si la fuente la soporta |

---

## Decisiones abiertas

Solo queda **una decisión genuinamente abierta** post-r2 (las otras 5 que estaban en r1 quedaron cerradas — ver tabla de Decisiones tomadas r2):

1. **Historial de revisiones retroactivas**: ¿se mantiene `historial-revisiones.json` con cada revisión que hace una fuente, o el CHANGELOG alcanza? Tomás decidió posponer: **se decide después** de ver cuántas revisiones aparecen en las primeras 4-6 semanas de operación del pipeline ya implementado. La decisión no bloquea implementación de r2 — el CHANGELOG cubre el caso básico y el `historial-revisiones.json` se puede agregar en una pasada posterior sin breaking change.

---

## No incluido en esta spec

- **Pipeline de datos políticos para capa viento.** Spec 41.
- **Pipeline de Latinobarómetro.** Ya existe en `lib/latinobarometro.ts`; no hace falta refactor.
- **Implementación interna de las capas** que consumen del pipeline. Specs 42 (precipitación) y 43 (temperatura).
- **Cambios al frontend del dashboard de país** (Spec 16) — solo se asegura que sigue funcionando (AC12).
- **Cobertura subnacional** (Brasil, Argentina). Spec posterior si hay caso.
- **Cambios al schema del Latinobarómetro JSON.** Fuera de scope.

---

## Implementación sugerida

Esta spec se diseña en Cowork. La implementación se ejecuta en una sesión de **Claude Code en VS Code** sobre `platform/data/` y `platform/frontend/`. Orden recomendado:

1. **Agregar tipos opcionales en `lib/macro-indicators.ts`** (`series_trimestral?`, `series_mensual?`). Type-check pasa, frontend sigue funcionando con JSON sin esos campos.
2. **Crear `CHANGELOG.md`** en `platform/data/indicators-macro/` con la entrada inicial Spec 40.
3. **Extender `sources.py`** con adaptadores para BM quarterly + scrapers/downloads para INDEC EMAE, IBGE PIB Trimestral.
4. **Extender `build_indicators_macro.py`** con la spec del indicador `a2-crecimiento-pbi.series_trimestral` y la del nuevo `c7-salario-real-mensual`.
5. **Marcar stubs prioritarios** (`d1-pobreza`, `d2-indigencia`) y completarlos si la fuente es fácil (BM, CEPALSTAT).
6. **Correr el pipeline localmente**, verificar JSON output, validar AC1-AC5, AC11.
7. **Bumpeo de `version`** según política. Entrada en CHANGELOG.
8. **Crear el skill `pipeline-macro-refresh`** en el plugin Mapa Inestable. Smoke test: ejecutarlo manualmente.
9. **Crear scheduled task** viernes 18:00 ART en Cowork.
10. **Actualizar Spec 29** con la nueva entrada.
11. **Smoke test cruzado**: abrir `/pais/argentina` (verifica dashboard sigue OK), activar stub de precipitación reemplazado por implementación que lee el nuevo JSON (verifica capa).

Tiempo estimado: **3-5 días** de trabajo bien hecho. Bloqueante crítico: ninguno. La parte más costosa es escribir los scrapers/adaptadores para las fuentes nacionales del salario real — eso puede crecer si las APIs son complejas.

---

## Histórico

| Fecha | Cambio | Razón |
|---|---|---|
| 2026-05-18 | Creación de la spec en sesión de Cowork. Alcance: formalizar el pipeline existente (Spec 14B) + extender con cadencias sub-anuales para alimentar las capas precipitación y temperatura de EPIC 03 | Tomás decidió arrancar Spec 40 inmediatamente después de cerrar Spec 39 r2. La existencia del pipeline ya armado (15 de 26 indicadores con datos, script Python funcional, adaptadores BM) reduce mucho el trabajo de esta spec — no es construir, es formalizar y extender |
| 2026-05-18 (r2) | Cerradas 5 de las 6 decisiones tácticas abiertas en r1: (#10) el script Python corre en el sandbox bash de Cowork disparado por el skill; (#11) cobertura del salario real 6-8 países en r1, ampliar después; (#12) auto-promote con umbral del 5% para evitar fricción en cambios triviales; (#13) campo opcional `frozen_since?: string` agregado al `MacroIndicator` para fuentes discontinuadas; (#14) ratio salario mediano/promedio se agregará si Spec 43 lo pide. Queda abierta solo la #2 (historial de revisiones retroactivas) por decisión explícita: se decide después de 4-6 semanas de operación. Agregados 4 criterios de aceptación (AC13-AC16) | Tomás cerró las tácticas tras leer r1 y aclarar la decisión #4 (auto-promote). La spec queda lista para handoff a VS Code sin decisiones bloqueantes |
| 2026-05-19 | Implementada en sesión de Claude Code (VS Code). Pipeline extendido con cadencias sub-anuales (`series_trimestral`, `series_mensual`), indicador `c7-salario-real-mensual`, priority stubs `d1-pobreza` y `d2-indigencia`, `CHANGELOG.md`, `README.md` con contrato público, staging del skill supervisor en `70-Producto/skills/pipeline-macro-refresh/SKILL.md`, directorio `60-Borradores/pipeline-macro/`, Spec 29 actualizada. JSON bumpeado a `macro-v1.1.0` y copiado a frontend. TypeScript type-check pasa (AC7 ✓). AC2 y AC3 requieren red para poblar datos (IMF IFS y ILO con network restringida en este entorno); arquitectura lista para poblarse cuando haya acceso. Cierra Spec 40. | Implementación directa desde r2 sin ambigüedades bloqueantes |

---

## Glosario

- **Pipeline macro**: el conjunto `build_indicators_macro.py` + `sources.py` + `indicators-macro.json` que genera datos macroeconómicos curados para el sitio.
- **Cadencia base**: la frecuencia mínima a la que un indicador se publica oficialmente. Para PBI es trimestral; para inflación es mensual; para Gini es anual.
- **Stub**: indicador definido en `INDICATOR_SPECS` cuya fuente requiere descarga manual y aún no fue completada. Aparece en el JSON con `by_country` vacío.
- **Quality flag** (`oficial | estimado | congelado`): bandera por datapoint. `oficial` = publicación firme, `estimado` = preliminar de la fuente, `congelado` = la fuente dejó de actualizar.
- **Promote**: el patrón borrador → live de Spec 28. En este contexto, el JSON nuevo se valida en `60-Borradores/pipeline-macro/` antes de reemplazar al de producción.
- **Schema extendido**: el JSON pasa de tener solo `series` (anual) a tener opcionalmente `series_trimestral` y `series_mensual`. Backward compatible.
