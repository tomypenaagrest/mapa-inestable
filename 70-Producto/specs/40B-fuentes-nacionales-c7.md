---
spec: 40B
titulo: Fuentes nacionales para c7-salario-real-mensual — ampliación del pipeline macro
estado: borrador-r1
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-21
revision: 2026-05-21 (r1) — primera versión. Sub-spec de Spec 40 enfocada exclusivamente en agregar adaptadores nacionales para `c7-salario-real-mensual` cuando la cobertura OIT ILOSTAT resulte insuficiente para los países piloto de Spec 43
epic: 03
afecta:
  - platform/data/indicators-macro/sources.py (EXTENDER — agregar funciones `fetch_<pais>_salario_real()` por país nacional cubierto)
  - platform/data/indicators-macro/build_indicators_macro.py (EXTENDER — extender el dispatcher `_fetch_mensual` con un handler `national_wages_merge` que combine OIT con fuentes nacionales según política de merge)
  - platform/data/indicators-macro/raw/salario-real/ (NUEVO directorio — caché de datos crudos de fuentes nacionales por país, formato `<iso2>-<source>-YYYY-MM-DD.json` análogo a `raw/ilostat/` y `raw/imf/`)
  - platform/data/indicators-macro/indicators-macro.json (REGENERAR — `c7-salario-real-mensual` con cobertura ampliada de OIT + nacionales; nuevo campo opcional `methodology_by_country` para documentar la fuente usada por país; bump a `macro-v1.2.0`)
  - platform/data/indicators-macro/CHANGELOG.md (EXTENDER — entrada `macro-v1.2.0` con la decisión de merge y el set de fuentes nacionales agregadas)
  - platform/data/indicators-macro/README.md (ACTUALIZAR — documentar la política de merge OIT + nacional en el contrato público; documentar el campo nuevo `methodology_by_country`)
  - platform/frontend/src/lib/macro-indicators.ts (EXTENDER mínimamente — agregar campo opcional `methodology_by_country?: Record<string, string>` al `MacroIndicator`; no rompe consumidores)
depende_de: [40]
depende_blanda_de: [14B]
relaciona_con:
  - Spec 40 (pipeline macro — Spec 40B es su ampliación específica para c7; hereda contrato, scheduled task, política de auto-promote, gestión de quality flags)
  - Spec 43 (capa temperatura — consumidor único de c7-salario-real-mensual; Spec 40B existe porque Spec 43 piloteó AR/BR/CL como cobertura editorial y OIT puede no cubrir bien esos tres países específicamente)
  - EPIC-03 (Spec 40B desbloquea Spec 43 cuando la corrida con red OIT confirme cobertura insuficiente para los pilotos)
desbloquea:
  - Spec 43 implementable en VS Code con datos reales para los 3 países piloto AR/BR/CL (cuando Spec 40B esté implementada)
pre_requisitos_operativos:
  - "Antes de implementar Spec 40B en VS Code, correr `python platform/data/indicators-macro/build_indicators_macro.py` con red contra OIT ILOSTAT y constatar cobertura final de `c7-salario-real-mensual`. Si la corrida devuelve cobertura suficiente para los 3 países piloto AR/BR/CL (datos mensuales 2021+ continuos para los tres), Spec 40B queda **postergada** — no hace falta implementar. Si AR, BR o CL quedan sin datos OIT o con cobertura parcial (<24 meses), Spec 40B se prioriza."
prioridad: condicional — alta si la corrida OIT confirma cobertura insuficiente para AR/BR/CL; media en caso contrario
---

# 40B · Fuentes nacionales para c7-salario-real-mensual

## Resumen ejecutivo

Esta spec es una **ampliación condicional** de Spec 40 enfocada en un solo indicador: `c7-salario-real-mensual`. El handler OIT ILOSTAT (`fetch_salario_real_mensual` en `sources.py`) ya está implementado por Spec 40; lo que Spec 40B agrega son **adaptadores nacionales** para los países donde OIT puede no devolver datos suficientes — particularmente Argentina y Brasil, donde las propias notas del pipeline reconocen la limitación:

> "AR": "Fuente recomendada: INDEC RIPTE. OIT puede tener cobertura parcial o diferente."
> "BR": "Fuente recomendada: IBGE PNAD Contínua Mensal. OIT puede diferir en metodología."

Spec 43 (capa temperatura) eligió AR/BR/CL como países piloto editoriales. Si la corrida con red contra OIT confirma que esos tres no tienen cobertura suficiente, **Spec 43 no puede implementarse en producción con datos reales para los pilotos**. Spec 40B existe para resolver ese hueco específico sin reabrir Spec 40.

**Lo que entra en r1:**

- Contrato técnico para sumar adaptadores nacionales al pipeline existente.
- Política de **merge** entre fuentes OIT y nacionales (decisión cerrada en §3).
- Adaptadores nacionales para los 5 países objetivo: **Argentina (INDEC), Brasil (IBGE), Chile (INE), Uruguay (INE), Perú (INEI)**.
- Normalización homogénea: cada adaptador entrega `{iso2: [{year, month, value, quality}]}` con `value` ya indexado a base 2021=100 (promedio anual). Igual contrato que `_compute_salario_real_mensual` existente.
- Documentación de metodología **per-país** vía nuevo campo opcional `methodology_by_country?: Record<string, string>` en el `MacroIndicator`. La metodología general queda en `methodology` (campo existente); las divergencias específicas por fuente nacional viven en `methodology_by_country`.
- Versionado: bump a `macro-v1.2.0` (minor — campo opcional agregado, sin breaking changes).
- Caché de datos crudos en `raw/salario-real/<iso2>-<source>-YYYY-MM-DD.json` análogo al patrón existente de `raw/ilostat/` y `raw/imf/`.

**Lo que NO entra en r1:**

- **Ampliación a indicadores que no sean c7.** Spec 40B es específica de salario real. Si más adelante otro indicador requiere fuentes nacionales (ej. `c1-desempleo` con metodologías país-específicas para Spec 43 piloto extendido), se hace en una spec separada o se promueve el patrón a 40C.
- **Fuentes nacionales para los 5 países restantes** (Bolivia, Colombia, Ecuador, Paraguay, Venezuela). Cobertura OIT puede ser suficiente para ellos; si en r2/r3 aparece la necesidad, se extiende.
- **Scraping en tiempo real / streaming.** Los adaptadores leen series mensuales publicadas; cadencia mensual con desfase típico de 1-2 meses respecto al mes actual es aceptable.
- **Reconciliación de series históricas largas (pre-2021).** Spec 40B se limita al rango del pipeline mensual (`month_start: 2021`).
- **Subnacional** (provincias/estados). Granularidad país por decisión 10 del epic.

---

## Estado actual

### Lo que ya existe (Spec 40 implementada)

- `sources.py` tiene `_compute_salario_real_mensual()` y `fetch_salario_real_mensual()` que llaman a OIT ILOSTAT (`EAR_4MTH_SEX_ECO_CUR_NB_M`) y normalizan a índice base 2021=100. Hoy ese es el único origen de c7.
- `build_indicators_macro.py` tiene la spec del indicador `c7-salario-real-mensual` (líneas 518-545) con `fetch_mensual: "ilo_monthly_wages"`. El dispatcher `_fetch_mensual` despacha por clave.
- Las notas per-país del indicador (`notes` en `MacroCountryData`) ya documentan que AR y BR necesitan fuente nacional — la spec original de Spec 40 lo dejó como deuda explícita.
- Auto-promote con umbral 5% (Spec 40 decisión #12) sirve también para Spec 40B sin cambios.
- `frozen_since?` y `quality` (oficial/estimado/congelado) heredados sin cambios.

### Lo que NO existe todavía

- Adaptadores nacionales en `sources.py` (`fetch_indec_ripte`, `fetch_ibge_pnad_continua_mensual`, `fetch_ine_chile_irr`, `fetch_ine_uruguay_ims_real`, `fetch_inei_peru_remuneraciones`).
- Handler de merge en `build_indicators_macro.py` que combine OIT + nacionales según política.
- Directorio `raw/salario-real/`.
- Campo `methodology_by_country?` en el contrato del JSON y en `lib/macro-indicators.ts`.
- Confirmación empírica de cobertura OIT real (depende de correr el pipeline con red — pre-requisito operativo).

---

## Propuesta

### 1. Política de merge OIT + nacional

Tres opciones consideradas; **decisión cerrada: opción B**.

| Opción | Descripción | Ventajas | Contras |
|---|---|---|---|
| A | OIT como base + nacional como override (nacional gana cuando ambos existen) | Mantiene OIT como referencia homogénea cross-país | Implica decidir override mes a mes (más lógica de merge) |
| **B (elegida)** | Nacional siempre si existe + OIT solo como fallback para países sin adaptador nacional | Datos más precisos y reconocibles por el lector latam (RIPTE, PNAD, IRR son referencia institucional en cada país); reduce lógica de merge a "qué fuente uso por país" | Pierde homogeneidad metodológica entre países (mitigado por `methodology_by_country`) |
| C | Mantener dos indicadores separados (`c7-oit` y `c7-nacional`) | Trazabilidad máxima de origen | Duplica el contrato; Spec 43 tendría que elegir cuál mostrar; rompe el patrón "un slug = un indicador" |

**Razón de B.** Tomás ya señaló (Spec 43 r1 §1) que en Latam los indicadores son estructurales y la lectura editorial los reconoce con el nombre nacional (un argentino lee "RIPTE", no "OIT ILOSTAT serie EAR_4MTH"). La trazabilidad metodológica se preserva en el campo `methodology_by_country` por país y en `notes` per-país. La homogeneidad cross-país se sacrifica conscientemente: la capa temperatura no compara magnitudes absolutas entre países, compara **variación interanual** (Spec 43 §3.1), que es robusta a diferencias de base entre fuentes nacionales y OIT siempre que cada fuente esté indexada consistentemente.

### 2. Set inicial de fuentes nacionales

5 países en r1, elegidos por: (a) cubrir los 3 pilotos editoriales de Spec 43 (AR, BR, CL); (b) sumar 2 países más con fuentes nacionales bien establecidas y APIs/portales razonablemente accesibles (UY, PE).

| País | Fuente nacional | Serie concreta | URL / acceso | Notas |
|---|---|---|---|---|
| **Argentina** | INDEC | Índice de salarios — Total. Disponible nivel global + desagregado por sector (registrado público, registrado privado, no registrado) | https://www.indec.gob.ar/indec/web/Nivel4-Tema-4-31-58. CSV/XLSX descargable | r1 usa el índice total. Base actual INDEC: 2016=100; reindexar a 2021=100. Alternativa: RIPTE (https://www.argentina.gob.ar/trabajo/seguridadsocial/ripte) si Índice de Salarios devuelve gaps |
| **Brasil** | IBGE | PNAD Contínua Mensal — Rendimento médio real habitual (R$) | https://sidra.ibge.gov.br/tabela/6390 (API SIDRA). Alternativa: portal web con descarga CSV/XLSX | API SIDRA tiene REST público; trae serie mensual desde 2012. Deflactar y reindexar a base 2021=100 |
| **Chile** | INE Chile | Índice Real de Remuneraciones (IRR) | https://www.ine.gob.cl/estadisticas/economia/indices-de-remuneracion-y-costo-de-la-mano-de-obra. CSV/XLSX | Base actual INE: 2016=100; reindexar a 2021=100. Serie mensual continua. INE publica tanto IRR (general) como IRR por actividad económica — r1 usa el general |
| **Uruguay** | INE Uruguay | Índice Medio de Salarios Real (IMSR) | https://www.ine.gub.uy/web/guest/salarios. XLSX descargable | Base actual: 2008=100; reindexar a 2021=100. Serie mensual continua |
| **Perú** | INEI | Índice de remuneraciones reales del sector privado / sector público | https://www.inei.gob.pe/estadisticas/indice-tematico/economy/. CSV/XLSX | r1 usa el índice del sector privado formal (más continuo). Sector público se reserva para r2 si Spec 43 lo pide |

**Para los otros 5 países** (BO, CO, EC, PY, VE), Spec 40B deja la cobertura en OIT (cuando devuelva datos) o como stub. Cada uno se evalúa si Spec 43 los promueve a piloto editorial en r3 — solo entonces se justifica el costo del adaptador.

### 3. Contrato técnico del adaptador nacional

Cada función nacional sigue el mismo contrato que `_compute_salario_real_mensual` actual:

```python
def fetch_<source>_<pais>_salario_real(
    data_start: int = _MONTH_DATA_START,  # 2021
    data_end:   int = _MONTH_DATA_END,    # año actual
) -> dict[str, list[dict]]:
    """
    C7 nacional · <fuente> — <métrica>.
    Devuelve solo el país que cubre: {"<ISO2>": [{year, month, value, quality}]}
    `value` ya indexado a base 2021=100 (promedio anual).
    Países no cubiertos por esta función: dict vacío (no se incluyen).
    """
```

Devuelve **solo el país que cubre** (un solo iso2 en el dict), no los 10. El merge ocurre en una capa superior.

**Cachéo:** cada función guarda el raw bajado en `raw/salario-real/<iso2>-<source>-YYYY-MM-DD.json` con la fecha de la corrida (igual patrón que `raw/ilostat/` y `raw/imf/` existentes). Si el archivo del día ya existe, se reutiliza (evita doble llamada en la misma corrida).

**Reindexación a base 2021=100:**

```python
# Promedio simple de los 12 valores de 2021 (o, si faltan meses, promedio de los disponibles).
base_value = mean(v for (y, m, v) in series if y == 2021)
if not base_value:
    base_value = mean(v for (y, m, v) in series if y == min_year_disponible)
indexed_value = round((v / base_value) * 100, 1)
```

Idéntico al cómputo de `_compute_salario_real_mensual`. Esto garantiza comparabilidad metodológica del **eje vertical** entre OIT y nacional para el mismo país, aunque los valores absolutos difieran.

### 4. Handler de merge en `build_indicators_macro.py`

Reemplazar el `fetch_mensual: "ilo_monthly_wages"` actual del spec de c7 por uno nuevo `fetch_mensual: "national_wages_merge"`. Agregar el dispatcher:

```python
def _fetch_mensual(spec: dict) -> dict[str, list[dict]]:
    """Despacha al adaptador mensual según spec['fetch_mensual']."""
    key = spec.get("fetch_mensual")
    if key is None:
        return {}
    if key == "ilo_monthly_wages":
        return src.fetch_salario_real_mensual()
    if key == "national_wages_merge":
        return _merge_national_and_oit_wages()
    warnings.warn(f"fetch_mensual desconocido: {key!r}")
    return {}


def _merge_national_and_oit_wages() -> dict[str, list[dict]]:
    """
    Política de merge B (Spec 40B): nacional siempre si existe, OIT como fallback
    para países sin adaptador nacional.
    """
    result: dict[str, list[dict]] = {}

    # 1. Fuentes nacionales (cada una cubre un país)
    national_fetchers = {
        "AR": src.fetch_indec_argentina_salario_real,
        "BR": src.fetch_ibge_brasil_pnad_continua_mensual,
        "CL": src.fetch_ine_chile_irr,
        "UY": src.fetch_ine_uruguay_ims_real,
        "PE": src.fetch_inei_peru_remuneraciones,
    }
    for iso2, fetcher in national_fetchers.items():
        national = fetcher()
        if national.get(iso2):
            result[iso2] = national[iso2]

    # 2. Fallback OIT para los iso2 no cubiertos por adaptador nacional
    oit = src.fetch_salario_real_mensual()
    for iso2, series in oit.items():
        if iso2 not in result and series:
            result[iso2] = series

    return result
```

El `MacroCountryData.notes` se popula automáticamente por país con el origen efectivamente usado (nacional vs OIT), para que un consumidor del JSON pueda saber sin abrir el código de dónde vino cada serie.

### 5. Campo nuevo `methodology_by_country?: Record<string, string>`

Extensión al schema `MacroIndicator`:

```ts
export interface MacroIndicator {
  // ... campos existentes ...
  methodology: string;
  /** Spec 40B — overrides per-país de la metodología cuando la fuente varía por país. */
  methodology_by_country?: Record<string, string>;
}
```

Para `c7-salario-real-mensual` queda así:

```json
{
  "methodology": "Índice base 2021=100 del salario real mensual. Fuente principal por país (ver methodology_by_country) reindexada a base 2021=100 por promedio simple de los 12 meses del año base.",
  "methodology_by_country": {
    "AR": "INDEC · Índice de Salarios Total (base original 2016=100, reindexado a 2021=100). Cobertura mensual continua desde 2016.",
    "BR": "IBGE · PNAD Contínua Mensal — Rendimento médio real habitual (R$ deflactados, reindexado a 2021=100). Cobertura mensual continua desde 2012.",
    "CL": "INE · Índice Real de Remuneraciones (IRR) general (base original 2016=100, reindexado a 2021=100). Cobertura mensual continua desde 2016.",
    "UY": "INE · Índice Medio de Salarios Real (IMSR) (base original 2008=100, reindexado a 2021=100). Cobertura mensual continua desde 2008.",
    "PE": "INEI · Índice de remuneraciones reales del sector privado formal (base 2009=100, reindexado a 2021=100). Cobertura mensual con algunos gaps históricos.",
    "BO": "OIT ILOSTAT (EAR_4MTH_SEX_ECO_CUR_NB_M). Cobertura sujeta a disponibilidad OIT — puede ser parcial.",
    "CO": "OIT ILOSTAT (EAR_4MTH_SEX_ECO_CUR_NB_M).",
    "EC": "OIT ILOSTAT (EAR_4MTH_SEX_ECO_CUR_NB_M).",
    "PY": "OIT ILOSTAT (EAR_4MTH_SEX_ECO_CUR_NB_M).",
    "VE": "OIT ILOSTAT (EAR_4MTH_SEX_ECO_CUR_NB_M)."
  }
}
```

Spec 43 (capa temperatura) puede usar este campo para mostrar la fuente concreta en el drawer (debajo de cada subindicador o del valor principal) — pero esa es decisión del consumidor, no impuesta por 40B.

### 6. Cadencia de actualización y scheduled task

Heredado de Spec 40 sin cambios: el scheduled task `pipeline-macro-refresh` viernes 18:00 ART dispara la corrida completa que incluye `_merge_national_and_oit_wages`. Cada adaptador nacional reusa su caché si ya corrió ese día (típico para reruns manuales en la misma semana).

**Política de revisión retroactiva:** los institutos nacionales suelen revisar series 1-3 meses después de la publicación inicial. Spec 40B hereda la decisión #2 abierta de Spec 40 (decidir tras 4-6 semanas de operación si se necesita historial de revisiones retroactivas).

### 7. Quality flag por origen

| Origen | Quality default | Razón |
|---|---|---|
| Fuente nacional (INDEC, IBGE, INE, INEI) | `oficial` | Fuente primaria del país. |
| OIT ILOSTAT (fallback) | `oficial` | OIT publica con metodología armonizada; trata sus datos como oficiales. |
| Mes publicado con revisión pendiente (cuando la fuente lo señala explícitamente) | `estimado` | Heredado de Spec 40. La detección depende de cada adaptador — algunas fuentes marcan datos provisionales en metadata. |

Si una fuente nacional deja de actualizar (caso típico: cambio de gobierno o crisis institucional como Venezuela 2017+ en algunos indicadores), aplicar `frozen_since` a nivel indicador per-país — pero ese caso no se anticipa en r1 para los 5 países cubiertos.

---

## Archivos a tocar

| Archivo | Acción |
|---|---|
| `platform/data/indicators-macro/sources.py` | EXTENDER — agregar 5 funciones nacionales: `fetch_indec_argentina_salario_real`, `fetch_ibge_brasil_pnad_continua_mensual`, `fetch_ine_chile_irr`, `fetch_ine_uruguay_ims_real`, `fetch_inei_peru_remuneraciones`. Cada una con cachéo y reindexación a base 2021=100 |
| `platform/data/indicators-macro/build_indicators_macro.py` | EXTENDER — agregar `_merge_national_and_oit_wages()` + extender dispatcher `_fetch_mensual` con clave `national_wages_merge`; cambiar `fetch_mensual` del spec de c7 a la nueva clave; poblar `methodology_by_country` en el spec de c7 |
| `platform/data/indicators-macro/raw/salario-real/` | NUEVO directorio — caché por país y fuente |
| `platform/data/indicators-macro/indicators-macro.json` | REGENERAR — c7 con datos nacionales merged + campo `methodology_by_country`; bump `version: "macro-v1.2.0"` |
| `platform/data/indicators-macro/CHANGELOG.md` | EXTENDER — entrada `macro-v1.2.0` con decisión de merge y set de fuentes |
| `platform/data/indicators-macro/README.md` | ACTUALIZAR — documentar política de merge y campo nuevo `methodology_by_country` |
| `platform/frontend/src/lib/macro-indicators.ts` | EXTENDER — agregar `methodology_by_country?: Record<string, string>` al `MacroIndicator`. Type-check pasa sin cambios en consumidores |

---

## Criterios de aceptación

| # | Criterio | Verificación |
|---|---|---|
| AC1 | El JSON regenerado tiene `version: "macro-v1.2.0"` y `c7-salario-real-mensual.methodology_by_country` poblado con 10 entradas (5 nacionales + 5 OIT) | Inspect JSON |
| AC2 | `c7-salario-real-mensual.by_country["AR"].series_mensual` tiene al menos 36 datapoints (≥3 años continuos desde 2021) provenientes de INDEC | Inspect + cross-check con publicación INDEC |
| AC3 | `c7-salario-real-mensual.by_country["BR"].series_mensual` tiene al menos 36 datapoints provenientes de IBGE PNAD | Inspect + cross-check |
| AC4 | `c7-salario-real-mensual.by_country["CL"].series_mensual` tiene al menos 36 datapoints provenientes de INE Chile | Inspect + cross-check |
| AC5 | `c7-salario-real-mensual.by_country["UY"].series_mensual` y `["PE"].series_mensual` con cobertura ≥36 meses | Inspect |
| AC6 | Los 5 países sin adaptador nacional (BO, CO, EC, PY, VE) usan OIT como fallback: si OIT devuelve datos, aparecen en `series_mensual`; si no, lista vacía + `notes` señalando STUB | Inspect + log de la corrida |
| AC7 | Para los 5 países con adaptador nacional, `notes` documenta la fuente nacional usada (ej. `"Serie: INDEC Índice de Salarios Total · base 2021=100"`) | Inspect JSON |
| AC8 | `_merge_national_and_oit_wages()` aplica política B: si AR tiene dato nacional Y dato OIT, queda el nacional. Test unitario con fixtures que simulan ambos orígenes | Test unitario |
| AC9 | Cada función nacional implementa el cachéo en `raw/salario-real/<iso2>-<source>-YYYY-MM-DD.json` y reutiliza el caché del día si existe | Inspect filesystem + log |
| AC10 | La reindexación a base 2021=100 es correcta: para AR, el promedio de los 12 valores de 2021 en `series_mensual` debe ser ~100 (±0.5) | Test unitario con fixture de serie nominal |
| AC11 | `lib/macro-indicators.ts` actualizado con `methodology_by_country?`; type-check pasa | `pnpm typecheck` |
| AC12 | Auto-promote con umbral 5% sigue funcionando: una corrida con datos casi iguales auto-promueve sin pedir review | Heredado de Spec 40 AC14, verificar que no se rompió |
| AC13 | El CHANGELOG documenta `macro-v1.2.0` con la política B explicitada y el set de 5 países nacionales | Inspect CHANGELOG |
| AC14 | El README documenta el nuevo campo `methodology_by_country` y la política de merge en la sección "contrato público" | Inspect README |
| AC15 | El scheduled task `pipeline-macro-refresh` corre sin errores con el nuevo handler — verificar que el log incluye un resumen tipo "AR: INDEC (40 meses), BR: IBGE (45 meses), ... · BO: OIT (12 meses, parcial)" | Inspect log de corrida programada |
| AC16 | Si una fuente nacional falla (API caída, archivo no disponible), el adaptador emite warning y devuelve dict vacío; el merge cae a OIT para ese país. La corrida completa NO falla | Test: simular API INDEC caída, verificar que la corrida termina con BR/CL/UY/PE en nacional + AR en OIT (o STUB si OIT vacío) |

---

## Edge cases

- **Adaptador nacional devuelve serie con gaps internos** (ej. INEI Perú tiene meses faltantes en algunos años) → el adaptador entrega los meses que tiene, el frontend trata los gaps como `noData` (Spec 43 §edge cases).
- **Reindexación cuando 2021 está incompleto** → fallback a primer año disponible (igual lógica que `_compute_salario_real_mensual`).
- **Cambio de base de la fuente nacional** (ej. INDEC pasa de base 2016=100 a base 2025=100 mid-año) → el adaptador detecta el cambio en metadata, reindexa toda la serie a 2021=100 antes de exportar. Quality flag del mes del cambio puede quedar `estimado` si la reindexación introduce ruido.
- **API SIDRA del IBGE rate-limited** → el cachéo evita el problema en re-corridas del mismo día. Para primera corrida, el adaptador respeta `time.sleep(0.5)` entre llamadas (patrón existente de `_ilo_fetch_monthly`).
- **INDEC publica simultáneamente Índice de Salarios y RIPTE con valores ligeramente distintos** → la spec elige Índice de Salarios Total (más amplio). Si en producción aparece evidencia de que RIPTE es preferible (más estable, menos revisiones), se cambia en r2 sin afectar el contrato.
- **Venezuela** → la fuente nacional INE Venezuela está discontinuada para salarios desde 2018. OIT puede tener datos parciales. Si ambos vacíos, queda STUB. Posible candidato para `frozen_since` a nivel per-país en r2.
- **Argentina con cambio de base reciente del Índice de Salarios** → INDEC publicó cambio metodológico en 2024 (Encuesta Permanente de Hogares revisada). La serie pre/post puede tener salto. Documentar en `methodology_by_country["AR"]` y en `notes["AR"]`.
- **Doble cuenta si OIT y nacional traen el mismo mes** → la política B garantiza que solo gana el nacional. El merge NO promedia ni reconcilia diferencias entre fuentes; elige una y descarta la otra. Esto es deliberado: promediar entre fuentes con metodologías distintas sería inventar un dato.

---

## Decisiones tomadas

### Cerradas en r1 (sesión 2026-05-21)

| # | Tema | Decisión | Razón |
|---|---|---|---|
| 1 | Alcance | Sub-spec específica de c7-salario-real-mensual, no ampliación general del pipeline | El problema operativo es de un solo indicador con un piloto editorial concreto (Spec 43 AR/BR/CL). Una sub-spec es más rápida de ejecutar que reabrir Spec 40 entera y mantiene el doc maestro limpio |
| 2 | Política de merge | **Opción B** — nacional siempre si existe, OIT como fallback | Las fuentes nacionales son las que el lector latam reconoce institucionalmente (RIPTE, PNAD, IRR). La trazabilidad metodológica se preserva en `methodology_by_country`. La homogeneidad cross-país no se necesita porque Spec 43 compara variaciones interanuales, no niveles absolutos |
| 3 | Set inicial de países | 5 países: AR, BR, CL, UY, PE | Los 3 primeros son los pilotos editoriales de Spec 43. UY y PE se suman por: (a) cobertura institucional sólida con APIs/portales accesibles, (b) suben la cobertura nacional total al 50% de los 10 países, suficiente para no depender solo de OIT en producción |
| 4 | Países restantes | Cobertura OIT (cuando disponible) sin adaptador nacional en r1: BO, CO, EC, PY, VE | Bajo retorno de implementar adaptadores nacionales para países que no son pilotos editoriales. Cada adaptador es ~1-2 días de trabajo más debugging por API/portal específico — costo no justificado para r1 |
| 5 | Campo nuevo `methodology_by_country` | Agregar al schema `MacroIndicator` como campo opcional. Hex de fuentes en `c7` documentado por país | Cuando la fuente varía por país, `methodology` general no captura la diferencia. El campo opcional no rompe consumidores existentes ni el resto de indicadores |
| 6 | Reindexación | Reindexar TODAS las series a base 2021=100 (promedio simple de los 12 meses de 2021) | Garantiza el eje vertical comparable entre fuentes para el mismo país y entre países. Idéntico al método de `_compute_salario_real_mensual` existente — mantiene coherencia con OIT |
| 7 | Cachéo | Por país y fuente en `raw/salario-real/<iso2>-<source>-YYYY-MM-DD.json` | Patrón heredado de `raw/ilostat/` y `raw/imf/` ya en uso. Permite re-correr el pipeline sin re-bajar datos. Evita rate-limit en APIs como SIDRA del IBGE |
| 8 | Quality flag default | `oficial` para nacional y OIT | Heredado de Spec 40. Las fuentes son institucionales/oficiales en ambos casos. Revisión retroactiva puede degradar a `estimado` cuando la fuente lo señale explícitamente |
| 9 | Comportamiento ante falla de fuente nacional | Warning + fallback a OIT para ese país. La corrida total NO falla | Aislar la falla de un país del resto. Si IBGE está caído, AR/CL/UY/PE siguen con nacional y BR cae a OIT (o STUB si OIT vacío para BR) |
| 10 | Versionado | Bump a `macro-v1.2.0` (minor) | Campo opcional agregado al schema, sin breaking. Coherente con la política semver del CHANGELOG existente |
| 11 | Cadencia de actualización | Reusa el scheduled task `pipeline-macro-refresh` (viernes 18:00 ART) sin cambios | Spec 40 ya tiene el scheduled task; Spec 40B no requiere uno nuevo |
| 12 | No reconciliación entre fuentes | Cuando OIT y nacional traen el mismo mes para un país, gana el nacional (política B). NO se promedia ni se reconcilia | Promediar entre metodologías distintas sería inventar un dato; conviene elegir una y declararlo explícitamente |

---

## Decisiones abiertas — condicionales para r2

No quedan decisiones bloqueantes. Lo que sigue son re-evaluaciones con evidencia operativa:

1. **¿Vale agregar RIPTE como fuente alternativa para AR?** Si después de implementar el Índice de Salarios INDEC aparecen gaps o revisiones grandes, evaluar RIPTE como reemplazo o como fuente promediada.
2. **¿Vale ampliar a los 5 países OIT-only?** Si Spec 43 promueve a algún país no-piloto a piloto editorial en r3 (ej. Colombia o Bolivia), se justifica el adaptador nacional para ese país.
3. **¿Vale exponer las series de fuente nacional al frontend con un toggle "OIT armonizado vs nacional"?** Decisión futura para el modo risk management (Spec 48). En r1 el consumidor solo recibe la serie elegida según política B.
4. **Historial de revisiones retroactivas** — heredado de Spec 40 decisión #2 abierta. Se decide tras 4-6 semanas de operación si las fuentes nacionales revisan tan seguido como para necesitar versionado.
5. **Indicadores adicionales con fuentes nacionales necesarias** (potencial Spec 40C). Si Spec 43 r3 o futuras specs identifican que `c1-desempleo` u otro indicador requiere fuentes nacionales por discrepancias metodológicas, replicar el patrón de Spec 40B en una nueva sub-spec.

---

## No incluido en esta spec

- Adaptadores nacionales para indicadores que no sean c7.
- Adaptadores nacionales para Bolivia, Colombia, Ecuador, Paraguay, Venezuela (cobertura OIT en r1).
- Reescritura del pipeline general — Spec 40B se limita a extender, no reestructura nada de lo que Spec 40 dejó implementado.
- UI / consumidor del campo nuevo `methodology_by_country` — Spec 43 decide cómo lo usa (o no).
- Versionado per-publicación de revisiones retroactivas — heredado abierto de Spec 40.

---

## Implementación sugerida

Orden recomendado en sesión de VS Code:

1. **Extender `lib/macro-indicators.ts`** con `methodology_by_country?: Record<string, string>`. Type-check pasa. Frontend sigue funcionando con JSON sin el campo.
2. **Crear `raw/salario-real/`** (directorio vacío + `.gitignore` para mantener tracking del directorio sin trackear el contenido).
3. **Escribir un adaptador nacional como piloto** (recomendado: CL · INE IRR, que suele ser la API más simple). Implementar `fetch_ine_chile_irr` con cachéo + reindexación. Test unitario con fixture nominal → verificar AC10.
4. **Replicar el patrón** para AR, BR, UY, PE — uno por uno. Cada uno con cachéo + reindexación + test unitario. Tiempo estimado: 0.5-1 día por país según complejidad de la API/portal.
5. **Agregar `_merge_national_and_oit_wages()`** en `build_indicators_macro.py` + extender dispatcher `_fetch_mensual`. Cambiar el `fetch_mensual` del spec de c7 a `national_wages_merge`. Test unitario del merge con fixtures que simulan ambos orígenes.
6. **Poblar `methodology_by_country`** en el spec de c7 dentro de `build_indicators_macro.py`. Bumpear `version` a `macro-v1.2.0` en el JSON output.
7. **Correr el pipeline completo** desde laptop con red. Validar AC1-AC10 mirando el JSON resultante.
8. **Promote al frontend** (auto-promote si los cambios son triviales; manual si el primer build agrega 5 países de datos nuevos — probablemente requiere review).
9. **Actualizar `CHANGELOG.md`** con la entrada `macro-v1.2.0` (decisión de merge + set de fuentes + campo nuevo).
10. **Actualizar `README.md`** documentando la política de merge y el campo nuevo en la sección contrato público.
11. **Smoke test integrado**: regenerar JSON, verificar que c7 tiene cobertura ≥36 meses para AR/BR/CL/UY/PE + lo que OIT devuelva para los otros 5. Verificar que `methodology_by_country` está poblado completo (10 entradas).
12. **Notificar a Spec 43**: con c7 hidratado para los 3 pilotos editoriales, Spec 43 puede implementarse en VS Code sin AC condicionales bloqueantes.

Tiempo estimado:
- Pasos 1-2: 0.5 día (refactor liviano + setup).
- Paso 3 (piloto CL): 0.5-1 día.
- Paso 4 (AR, BR, UY, PE): 2-4 días según complejidad de cada API.
- Pasos 5-11: 1 día.
- **Total estimado: 4-7 días** de trabajo bien hecho.

Bloqueantes potenciales: APIs nacionales con autenticación o con formatos inesperados. Mitigación: si una API se complica, dejar el adaptador como stub (devuelve dict vacío con warning explícito) y caer a OIT para ese país en r1; el adaptador se completa en r2 sin bloquear el resto.

---

## Histórico

| Fecha | Cambio | Razón |
|---|---|---|
| 2026-05-21 | Creación de la spec en sesión de Cowork. r1 cierra 12 decisiones técnicas. Sub-spec de Spec 40 enfocada exclusivamente en agregar fuentes nacionales para `c7-salario-real-mensual` (Argentina INDEC, Brasil IBGE, Chile INE, Uruguay INE, Perú INEI). Política de merge cerrada: nacional siempre, OIT como fallback. Schema extendido con `methodology_by_country?` opcional (no breaking). Pre-requisito operativo declarado: correr primero la corrida OIT y solo implementar 40B si la cobertura para AR/BR/CL resulta insuficiente | Spec 43 (capa temperatura) eligió AR/BR/CL como piloto editorial, pero el handler OIT del pipeline puede no tener cobertura suficiente para AR y BR según las propias notas del indicador. Spec 40B resuelve ese hueco específico sin reabrir Spec 40 entera. Si la corrida OIT confirma cobertura suficiente, la spec queda en archivo como referencia para ampliar más adelante |

---

## Glosario

- **Fuente nacional:** instituto de estadística del país que publica la serie original de salario real (INDEC, IBGE, INE, INEI). Preferida por reconocimiento institucional local.
- **OIT (fallback):** OIT ILOSTAT serie `EAR_4MTH_SEX_ECO_CUR_NB_M`. Cobertura armonizada cross-país pero parcial para algunos países latinoamericanos.
- **Política de merge B:** nacional siempre si existe, OIT como fallback para países sin adaptador nacional. Cerrada como decisión #2.
- **Reindexación a base 2021=100:** dividir cada valor de la serie por el promedio simple de los 12 valores de 2021 y multiplicar por 100. Estandariza el eje vertical entre fuentes para un mismo país.
- **`methodology_by_country`:** campo nuevo opcional del `MacroIndicator` que documenta la metodología/fuente per-país cuando varía. No reemplaza `methodology` general, lo complementa.
- **Adaptador nacional:** función Python en `sources.py` que baja datos de una fuente nacional, los normaliza y los expone con contrato `{iso2: [{year, month, value, quality}]}` (devuelve un solo país).
- **Caché por país y fuente:** `raw/salario-real/<iso2>-<source>-YYYY-MM-DD.json`. Evita re-bajar datos en re-corridas del mismo día.
- **Pre-requisito operativo:** correr la corrida OIT primero. Spec 40B solo se implementa si OIT no cubre AR/BR/CL.
- **Auto-promote con umbral 5%:** heredado de Spec 40 decisión #12. Sirve sin cambios para 40B.
