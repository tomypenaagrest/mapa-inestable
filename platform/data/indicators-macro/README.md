# Pipeline de indicadores macro (Spec 14B / Spec 40)

Genera `indicators-macro.json` con indicadores estructurales en 4 familias para los 10
países sudamericanos de Mapa Inestable.

**Versión actual:** `macro-v1.1.0` (Spec 40, 2026-05-19)
**Spec de versionado:** `CHANGELOG.md` en este directorio.

---

## Correr el pipeline

```bash
# Instalar dependencias (primera vez)
pip install requests

# Generar JSON (desde esta carpeta)
python build_indicators_macro.py

# Copiar al frontend
cp indicators-macro.json ../../frontend/src/data/indicators-macro/indicators-macro.json
```

Requiere acceso a Internet para las APIs externas (WB, IMF, ILO). Si la red no está
disponible, el script usará caché de `raw/` para los datos ya descargados y dejará
los indicadores nuevos como stubs.

---

## Contrato público del JSON (Spec 40)

El `indicators-macro.json` es el **input estable del pipeline macro al sistema de capas
(EPIC 03)**. A partir de Spec 40, tiene responsabilidades adicionales:

- **Schema estable**: cambios requieren bump de `version` (semver).
- **Cobertura documentada**: `stubs` lista indicadores sin datos; `priority_stubs` los
  que alimentan capas analíticas y requieren completarse pronto.
- **Calidad explícita**: cada datapoint tiene `quality: "oficial" | "estimado" | "congelado"`.
- **Frescura visible**: `source.pulled_at` por indicador; `computed_at` del build completo.
- **Sub-annual opcional**: `series_trimestral` y `series_mensual` en `by_country[ISO2]`
  cuando la fuente publica a esa cadencia (backward compatible — consumidores que solo
  leen `series` siguen funcionando).

Cambios al schema bumbean la versión:
- **Patch** `macro-v1.0.X`: refresh de datos, mismo schema.
- **Minor** `macro-v1.X.0`: campo opcional nuevo o indicador nuevo.
- **Major** `macro-v2.0.0`: breaking change (campo obligatorio removido, unidad cambiada).

---

## Schema del JSON

### Metadata top-level

```json
{
  "version": "macro-v1.1.0",
  "computed_at": "2026-05-19",
  "year_start": 2010,
  "year_end": 2024,
  "quarter_start": 2021,
  "quarter_end": 2024,
  "month_start": 2021,
  "month_end": 2024,
  "n_indicators": 27,
  "n_countries": 10,
  "stubs": ["b1-exp-primarias", "..."],
  "priority_stubs": ["d1-pobreza", "d2-indigencia"],
  "indicators": [...]
}
```

### Indicador

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
  priority_stub?: true;   // Spec 40 — solo en stubs prioritarios para capas
  by_country: Record<ISO2, {
    name: string;
    series: { year, value, quality }[];           // OBLIGATORIO (2010-2024)
    series_trimestral?: { year, quarter, value, quality }[];  // Spec 40, opcional
    series_mensual?: { year, month, value, quality }[];       // Spec 40, opcional
    latest?: { year, value, quality };
    notes?: string;
  }>;
}
```

**Quality flags:**
- `oficial`: publicación firme de la fuente.
- `estimado`: dato preliminar o estimación (FMI/ILO para países con datos limitados).
- `congelado`: la fuente dejó de actualizar; se muestra el último valor disponible.

---

## Cobertura actual (macro-v1.1.0)

| Indicador | Estado | Cadencias | Fuente |
|-----------|--------|-----------|--------|
| A1 PBI per cápita PPP | ✓ 9/10 | anual | Banco Mundial WDI |
| A2 Crecimiento real PBI | ✓ 10/10 | anual + **trimestral*** | WDI + IMF IFS |
| A3a VAB primario | ✓ 10/10 | anual | Banco Mundial WDI |
| A3b VAB manufactura | ✓ 10/10 | anual | Banco Mundial WDI |
| A3c VAB servicios | ✓ 10/10 | anual | Banco Mundial WDI |
| A4 Productividad laboral | ✓ 9/10 | anual | Banco Mundial WDI |
| A5 Inversión / PBI | ✓ 10/10 | anual | Banco Mundial WDI |
| A6 Inflación IPC | ✓ 10/10 | anual | FMI WEO |
| B1 Exp primarias / total | **stub** | — | BACI (CEPII) |
| B2 Cuota principal socio | **stub** | — | BACI |
| B3 Cuota a China | **stub** | — | BACI |
| B4 Cuota a EEUU | **stub** | — | BACI |
| B5 IED / PBI | **stub** | — | UNCTAD |
| B6 Deuda pública / PBI | ✓ 10/10 | anual | FMI WEO |
| C1 Desempleo | ✓ 10/10 | anual | Banco Mundial WDI |
| C2 Informalidad (proxy) | ✓ 10/10 | anual | Banco Mundial WDI |
| C3 Registrado CEPAL | **stub** | — | CEPALSTAT |
| C4 Empleo industrial | ✓ 10/10 | anual | Banco Mundial WDI |
| C5 Brecha género | ✓ 10/10 | anual | Banco Mundial WDI |
| C6 Subocupación | **stub** | — | OIT ILOSTAT |
| **C7 Salario real mensual** | **stub*** | **mensual*** | OIT ILOSTAT |
| D1 Pobreza | **stub** ⚠️ prioritario | — | CEPALSTAT |
| D2 Indigencia | **stub** ⚠️ prioritario | — | CEPALSTAT |
| D3 Gini | ✓ 9/10 | anual | Banco Mundial WDI |
| D5 Mortalidad infantil | ✓ 10/10 | anual | Banco Mundial WDI |
| D6 Homicidios | **stub** | — | UNODC |
| D7 Presión tributaria | **stub** | — | CEPALSTAT / OECD |

`*` = código implementado, requiere red para poblar datos (IMF IFS / ILO).
`⚠️` = stub prioritario para capa temperatura (EPIC 03); completar antes de Spec 43.

---

## Completar los stubs

### A2 trimestral (capa precipitación EPIC 03)
Requiere acceso a `dataservices.imf.org` (IMF IFS SDMX-JSON API).
El código está en `sources.py::fetch_pbi_trimestral()`. Correr el pipeline con acceso a internet.

### C7 salario real mensual (capa temperatura EPIC 03)
Requiere acceso a ILO ILOSTAT vía `rplumber.ilo.org` con serie válida.
El código base está en `sources.py::fetch_salario_real_mensual()`.
Si ILO no tiene cobertura para un país: agregar fuente nacional en `raw/salario-real/`
y extender `sources.py::fetch_salario_real_mensual()` con la lógica nacional.
Fuentes por país: AR=INDEC RIPTE, BR=IBGE PNAD Mensal, CL=INE IR, CO=DANE GEIH.

### BACI (B1-B4)
Descargar de https://www.cepii.fr/CEPII/en/bdd_modele/bdd_modele_item.asp?id=37
y depositar en `raw/baci/`.

### D1, D2 (priority stubs)
CEPALSTAT no tiene API pública estable. Opciones:
- Descargar manualmente de https://statistics.cepal.org/portal/cepalstat/
- Alternativa programática: BM `SI.POV.UMIC` ($6.85/día) y `SI.POV.DDAY` ($2.15/día) —
  no equivalentes exactos de la línea CEPAL, pero útiles como proxies.

---

## Políticas de fuentes

- **Regional > nacional**: cuando hay divergencia entre fuente regional (WB, IMF, OIT) y
  oficial nacional, gana la regional.
- **Venezuela**: incluida con `quality: congelado` o `quality: estimado`.
- **Argentina 2007-2015**: A6 inflación con reemplazo declarado (CEPAL/Congreso).
- **Revisiones retroactivas**: sobreescribir el valor + loguear en `CHANGELOG.md` cuando
  la revisión es > umbral significativo. No mantener historial en el JSON (ver Spec 40 §6).

---

**Specs:**
- `70-Producto/specs/14-indicadores-estructurales.md`
- `70-Producto/specs/14A-curaduria-24-indicadores.md`
- `70-Producto/specs/40-pipeline-datos-macroeconomicos.md`
- `70-Producto/epics/EPIC-03-capas-analiticas.md`
