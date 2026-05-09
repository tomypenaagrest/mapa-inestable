# Pipeline de indicadores macro (Spec 14B)

Genera `indicators-macro.json` con 26 indicadores estructurales en 4 familias
para los 10 países sudamericanos cubiertos por Mapa Inestable.
Series 2010–2024 (última observación disponible por fuente).

---

## Correr el pipeline

```bash
# Instalar dependencias (primera vez)
pip install requests pandas numpy

# Generar JSON
python build_indicators_macro.py

# Copiar al frontend
cp indicators-macro.json ../../frontend/src/data/indicators-macro/indicators-macro.json
```

---

## Cobertura actual

| Indicador | Estado | Fuente |
|-----------|--------|--------|
| A1 PBI per cápita PPP | ✓ 9/10 países | Banco Mundial WDI |
| A2 Crecimiento real PBI | ✓ 10/10 | Banco Mundial WDI |
| A3a VAB primario | ✓ 10/10 | Banco Mundial WDI |
| A3b VAB manufactura | ✓ 10/10 | Banco Mundial WDI |
| A3c VAB servicios | ✓ 10/10 | Banco Mundial WDI |
| A4 Productividad laboral | ✓ 9/10 | Banco Mundial WDI (índice 2010=100) |
| A5 Inversión / PBI | ✓ 10/10 | Banco Mundial WDI |
| A6 Inflación IPC | ✓ 10/10 | FMI WEO |
| B1 Exp primarias / total | **stub** | BACI (CEPII) — descarga manual |
| B2 Cuota principal socio | **stub** | BACI — descarga manual |
| B3 Cuota a China | **stub** | BACI — descarga manual |
| B4 Cuota a EEUU | **stub** | BACI — descarga manual |
| B5 IED / PBI | **stub** | UNCTAD — descarga manual |
| B6 Deuda pública / PBI | ✓ 10/10 | FMI WEO |
| C1 Desempleo | ✓ 10/10 | Banco Mundial WDI (modelado OIT) |
| C2 Informalidad (proxy) | ✓ 10/10 | Banco Mundial WDI (empleo vulnerable) |
| C3 Registrado CEPAL | **stub** | CEPALSTAT — descarga manual |
| C4 Empleo industrial | ✓ 10/10 | Banco Mundial WDI |
| C5 Brecha género | ✓ 10/10 | Banco Mundial WDI |
| C6 Subocupación | **stub** | OIT ILOSTAT — API no disponible |
| D1 Pobreza | **stub** | CEPALSTAT — descarga manual |
| D2 Indigencia | **stub** | CEPALSTAT — descarga manual |
| D3 Gini | ✓ 9/10 | Banco Mundial WDI |
| D5 Mortalidad infantil | ✓ 10/10 | Banco Mundial WDI |
| D6 Homicidios | **stub** | UNODC — descarga manual |
| D7 Presión tributaria | **stub** | CEPALSTAT — descarga manual |

---

## Completar los stubs

Los stubs requieren descargar datasets manualmente y depositar en `raw/`:

### BACI (B1–B4)
- Descargar BACI dataset de https://www.cepii.fr/CEPII/en/bdd_modele/bdd_modele_item.asp?id=37
- Depositar en `raw/baci/`
- Agregar adaptador en `sources.py::fetch_baci_*`

### UNCTAD (B5)
- Descargar World Investment Report data de https://unctad.org/topic/investment
- Depositar en `raw/unctad/`

### CEPALSTAT (C3, D1, D2, D7)
- Descargar desde https://statistics.cepal.org/portal/cepalstat/
  - Panorama Social (pobreza, indigencia)
  - Estadísticas Tributarias ALC (presión tributaria)
  - Encuesta de hogares (asalariado registrado)
- Depositar en `raw/cepalstat/`

### UNODC (D6)
- Descargar Global Study on Homicide de https://dataunodc.un.org/dp-intentional-homicide-victims
- Para Venezuela post-2014: OVV (observatoryviolenciavenezuela.org)
- Depositar en `raw/unodc/`

---

## Políticas de fuentes

- **Regional > nacional**: cuando hay divergencia entre fuente regional (WB, IMF, OIT) y oficial nacional, gana la regional.
- **Venezuela**: incluida con `quality: congelado` o `quality: estimado` según el indicador.
- **Argentina 2007-2015**: A6 inflación con reemplazo declarado (CEPAL/Congreso).
- **Quiebres metodológicos**: si al re-correr el pipeline detecta un cambio en la metodología de la fuente, no machaca el JSON — pide intervención humana.

---

## Schema del JSON

Ver Spec 14 §6.2 para la especificación completa. Cada indicador incluye:
- `by_country[ISO2].series` — serie histórica [{year, value, quality}]
- `by_country[ISO2].latest` — último datapoint disponible
- `source.pulled_at` — fecha del pull (no de la observación)
- `quality` por datapoint: `oficial | estimado | congelado`

---

**Spec:** `70-Producto/specs/14-indicadores-estructurales.md` + `14A-curaduria-24-indicadores.md`
