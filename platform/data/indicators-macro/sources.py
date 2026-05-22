"""
sources.py — Adaptadores por fuente para el pipeline de indicadores macro.

Cada función devuelve:
    dict[country_iso2, dict[year_int, float | None]]          (series anuales)
    dict[country_iso2, list[dict]]                             (series sub-anuales)

Las fuentes que requieren descarga manual emiten un warning y devuelven {}.

Spec 40 agrega adaptadores para series trimestrales (IMF IFS) y mensuales (ILO).
"""

from __future__ import annotations
import json
import time
import warnings
from pathlib import Path
from datetime import date
from typing import Optional

import requests

# ---- Constantes ----------------------------------------------------------

COUNTRIES_SA = {
    "AR": "ARG", "BO": "BOL", "BR": "BRA", "CL": "CHL",
    "CO": "COL", "EC": "ECU", "PY": "PRY", "PE": "PER",
    "UY": "URY", "VE": "VEN",
}

YEAR_START = 2010
YEAR_END   = 2024
RAW_DIR    = Path(__file__).parent / "raw"

# ---- Constantes sub-anuales (Spec 40) ------------------------------------

# Se descarga desde 2020 para poder computar YoY de 2021
_QUARTER_FETCH_START = 2020
_QUARTER_DATA_START  = 2021
_QUARTER_DATA_END    = 2024
_MONTH_DATA_START    = 2021
_MONTH_DATA_END      = 2024

# Cache para salario real mensual — evitar doble llamada a ILO en el mismo build
_SALARIO_REAL_MONTHLY_CACHE: dict | None = None


# ---- Utilidades ----------------------------------------------------------

def _wb_fetch(indicator_code: str, start: int = YEAR_START, end: int = YEAR_END) -> dict[str, dict[int, float | None]]:
    """
    Descarga una serie anual del Banco Mundial WDI para los 10 países SA.
    Retorna {iso2: {year: value}}.
    """
    iso3s = ";".join(COUNTRIES_SA.values())
    url = (
        f"https://api.worldbank.org/v2/country/{iso3s}/indicator/{indicator_code}"
        f"?date={start}:{end}&format=json&per_page=500"
    )
    iso3_to_iso2 = {v: k for k, v in COUNTRIES_SA.items()}
    result: dict[str, dict[int, float | None]] = {iso2: {} for iso2 in COUNTRIES_SA}

    try:
        resp = requests.get(url, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        if len(data) < 2 or not isinstance(data[1], list):
            warnings.warn(f"WB {indicator_code}: respuesta inesperada")
            return result

        cache_path = RAW_DIR / "worldbank" / f"{indicator_code}_{date.today()}.json"
        cache_path.parent.mkdir(parents=True, exist_ok=True)
        cache_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

        for obs in data[1]:
            iso3  = obs.get("countryiso3code", "")
            year  = obs.get("date", "")
            value = obs.get("value")
            iso2  = iso3_to_iso2.get(iso3)
            if iso2 and year.isdigit():
                result[iso2][int(year)] = float(value) if value is not None else None

        time.sleep(0.3)  # cortés con la API
    except Exception as exc:
        warnings.warn(f"WB {indicator_code}: {exc}")

    return result


def _imf_weo_fetch(concept: str = "PCPIPCH") -> dict[str, dict[int, float | None]]:
    """
    Descarga del FMI WEO vía la API SDMX/JSON.
    Concepto: PCPIPCH = inflación IPC (% cambio anual).
    Retorna {iso2: {year: value}}.
    """
    # WEO areas: AR=ARG,BO=BOL,BR=BRA,CL=CHL,CO=COL,EC=ECU,PY=PRY,PE=PER,UY=URY,VE=VEN
    # IMF usa ISO 3-letter en la URL
    result: dict[str, dict[int, float | None]] = {iso2: {} for iso2 in COUNTRIES_SA}

    iso3s_lower = ",".join(v.lower() for v in COUNTRIES_SA.values())
    url = (
        f"https://www.imf.org/external/datamapper/api/v1/{concept}"
        f"?periods={YEAR_START},{YEAR_END}"
    )
    try:
        resp = requests.get(url, timeout=30)
        resp.raise_for_status()
        payload = resp.json()
        # shape: {"values": {"PCPIPCH": {"ARG": {"2010": 10.9, ...}, ...}}}
        values_by_country = payload.get("values", {}).get(concept, {})

        iso3_to_iso2 = {v: k for k, v in COUNTRIES_SA.items()}
        for iso3, series in values_by_country.items():
            iso2 = iso3_to_iso2.get(iso3.upper())
            if not iso2:
                continue
            for year_str, val in series.items():
                if year_str.isdigit():
                    result[iso2][int(year_str)] = float(val) if val is not None else None

        cache_path = RAW_DIR / "imf" / f"{concept}_{date.today()}.json"
        cache_path.parent.mkdir(parents=True, exist_ok=True)
        cache_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        time.sleep(0.3)
    except Exception as exc:
        warnings.warn(f"IMF WEO {concept}: {exc}")

    return result


def _ilo_fetch(indicator_id: str, filter_sex: str = "SEX_T", filter_age: str = "") -> dict[str, dict[int, float | None]]:
    """
    Descarga datos de OIT ILOSTAT vía su API REST.
    indicator_id: p.ej. 'UNE_TUNE_SEX_AGE_RT_A' (unemployment rate).
    Retorna {iso2: {year: value}}.
    """
    result: dict[str, dict[int, float | None]] = {iso2: {} for iso2 in COUNTRIES_SA}

    iso3s = "+".join(COUNTRIES_SA.values())
    url = f"https://rplumber.ilo.org/data/indicator/?id={indicator_id}&lang=en&format=.json"
    # Filtramos por país luego de la descarga (API no siempre acepta filtros en query string)
    try:
        resp = requests.get(url, timeout=60)
        resp.raise_for_status()
        payload = resp.json()

        # Formato típico ILO: lista de observaciones con campos ref_area, time, obs_value, sex, classif1
        iso3_to_iso2 = {v: k for k, v in COUNTRIES_SA.items()}
        for obs in payload:
            ref_area = obs.get("ref_area", "")
            sex_val  = obs.get("sex", "")
            time_val = obs.get("time", "")
            value    = obs.get("obs_value")

            iso2 = iso3_to_iso2.get(ref_area.upper())
            if not iso2:
                continue
            # Para tasas totales queremos SEX_T
            if filter_sex and sex_val != filter_sex:
                continue
            if filter_age and obs.get("classif1", "") != filter_age:
                continue
            if time_val.isdigit():
                result[iso2][int(time_val)] = float(value) if value is not None else None

        cache_path = RAW_DIR / "ilostat" / f"{indicator_id}_{date.today()}.json"
        cache_path.parent.mkdir(parents=True, exist_ok=True)
        cache_path.write_text(json.dumps(payload[:200], ensure_ascii=False, indent=2), encoding="utf-8")
        time.sleep(0.5)
    except Exception as exc:
        warnings.warn(f"ILO {indicator_id}: {exc}")

    return result


def _stub_source(source_name: str, indicator_label: str) -> dict[str, dict[int, float | None]]:
    """
    Stub para fuentes que requieren descarga manual (BACI, UNCTAD, UNODC, CEPAL).
    Emite warning y devuelve dict vacío.
    """
    warnings.warn(
        f"[STUB] {source_name} / {indicator_label}: "
        "descarga manual requerida — colocar datos en raw/{source}/ y re-correr.",
        stacklevel=2,
    )
    return {}


# ---- Funciones públicas por indicador ------------------------------------

def fetch_wb(indicator_code: str) -> dict[str, dict[int, float | None]]:
    return _wb_fetch(indicator_code)


def fetch_imf_inflation() -> dict[str, dict[int, float | None]]:
    return _imf_weo_fetch("PCPIPCH")


def fetch_ilo_unemployment() -> dict[str, dict[int, float | None]]:
    """C1 · Tasa de desempleo abierto. WB SL.UEM.TOTL.ZS (modelado ILO)."""
    return _wb_fetch("SL.UEM.TOTL.ZS")


def fetch_ilo_informality() -> dict[str, dict[int, float | None]]:
    """C2 · Proxy: empleo vulnerable / empleo total (WB SL.EMP.VULN.ZS).

    El indicador ideal es empleo informal OIT (ILO KILM 8) que no tiene API
    pública estable. Se usa empleo vulnerable (cuenta propia + familiar no
    remunerado) como proxy disponible. Misma dirección causal, cobertura >10%.
    quality=estimado en todos los países.
    """
    return _wb_fetch("SL.EMP.VULN.ZS")


def fetch_ilo_productivity() -> dict[str, dict[int, float | None]]:
    """A4 · PBI por ocupado (WB SL.GDP.PCAP.EM.KD, USD constantes 2017 PPP).

    Se normaliza a índice base 2010=100 en el pipeline principal.
    """
    return _wb_fetch("SL.GDP.PCAP.EM.KD")


def fetch_ilo_industry_employment() -> dict[str, dict[int, float | None]]:
    """C4 · Empleo en industria / empleo total (WB SL.IND.EMPL.ZS).

    Incluye manufactura, minería, construcción y utilities — más amplio que
    solo manufactura, pero es la mejor serie comparable disponible vía API.
    """
    return _wb_fetch("SL.IND.EMPL.ZS")


def fetch_ilo_gender_gap() -> dict[str, dict[int, float | None]]:
    """C5 · Brecha de género en participación laboral (pp: masculina - femenina).

    Usa WB SL.TLF.CACT.MA.ZS y SL.TLF.CACT.FE.ZS (ILO modelado).
    """
    male   = _wb_fetch("SL.TLF.CACT.MA.ZS")
    time.sleep(1)
    female = _wb_fetch("SL.TLF.CACT.FE.ZS")
    result: dict[str, dict[int, float | None]] = {}
    for iso2 in COUNTRIES_SA:
        result[iso2] = {}
        for year in range(YEAR_START, YEAR_END + 1):
            m = male.get(iso2, {}).get(year)
            f = female.get(iso2, {}).get(year)
            if m is not None and f is not None:
                result[iso2][year] = round(m - f, 1)
    return result


def fetch_ilo_subemployment() -> dict[str, dict[int, float | None]]:
    """C6 · Subocupación. No tiene equivalente API estable — STUB."""
    return _stub_source("OIT ILOSTAT", "C6 Subocupación")


def fetch_imf_govt_debt() -> dict[str, dict[int, float | None]]:
    """B6 · Deuda pública bruta / PBI (FMI WEO GGXWDG_NGDP).

    Proxy de deuda externa: usa deuda del gobierno general como % PBI.
    La deuda externa total (pública + privada) del WB IDS no tiene cobertura
    API actualizada para todos los países SA. FMI WEO tiene cobertura completa
    y series largas. Se documenta la diferencia en methodology.
    """
    return _imf_weo_fetch("GGXWDG_NGDP")


def fetch_cepal_poverty() -> dict[str, dict[int, float | None]]:
    """D1 · Pobreza (línea regional CEPAL). STUB — requiere CEPALSTAT."""
    return _stub_source("CEPALSTAT", "D1 Pobreza")


def fetch_cepal_indigence() -> dict[str, dict[int, float | None]]:
    """D2 · Indigencia (línea regional CEPAL). STUB."""
    return _stub_source("CEPALSTAT", "D2 Indigencia")


def fetch_cepal_registered_employment() -> dict[str, dict[int, float | None]]:
    """C3 · Asalariado registrado / empleo total (CEPAL). STUB."""
    return _stub_source("CEPALSTAT", "C3 Registrado CEPAL")


def fetch_cepal_taxes() -> dict[str, dict[int, float | None]]:
    """D7 · Presión tributaria / PBI (CEPAL/OECD). STUB."""
    return _stub_source("CEPALSTAT/OECD", "D7 Presión tributaria")


def fetch_baci_primary_exports() -> dict[str, dict[int, float | None]]:
    """B1 · Exportaciones primarias / total (BACI). STUB."""
    return _stub_source("BACI (CEPII)", "B1 Exp primarias / total")


def fetch_baci_main_partner() -> dict[str, dict[int, float | None]]:
    """B2 · Cuota del principal socio comercial (BACI). STUB."""
    return _stub_source("BACI (CEPII)", "B2 Cuota principal socio")


def fetch_baci_china() -> dict[str, dict[int, float | None]]:
    """B3 · Cuota exportaciones a China (BACI). STUB."""
    return _stub_source("BACI (CEPII)", "B3 Cuota a China")


def fetch_baci_usa() -> dict[str, dict[int, float | None]]:
    """B4 · Cuota exportaciones a EEUU (BACI). STUB."""
    return _stub_source("BACI (CEPII)", "B4 Cuota a EEUU")


def fetch_unctad_fdi() -> dict[str, dict[int, float | None]]:
    """B5 · IED neta recibida / PBI (UNCTAD). STUB."""
    return _stub_source("UNCTAD", "B5 IED / PBI")


def fetch_unodc_homicides() -> dict[str, dict[int, float | None]]:
    """D6 · Homicidios / 100.000 hab (UNODC + OVV para VE). STUB."""
    return _stub_source("UNODC", "D6 Homicidios")


# =========================================================================
# Spec 40 — Adaptadores sub-anuales (trimestrales y mensuales)
# =========================================================================


def _imf_ifs_quarterly_fetch(
    series_code: str,
    start_year: int = _QUARTER_FETCH_START,
    end_year: int = _QUARTER_DATA_END,
) -> dict[str, list[dict]]:
    """
    Descarga serie trimestral del IMF IFS vía SDMX-JSON.
    IMF IFS usa ISO-2 para área (AR, BR, CL, ...).
    Retorna {iso2: [{year, quarter, value}]}.
    value puede ser None para observaciones sin dato.
    """
    countries = "+".join(COUNTRIES_SA.keys())
    start_period = f"{start_year}Q1"
    end_period   = f"{end_year}Q4"
    url = (
        f"https://dataservices.imf.org/REST/SDMX_JSON.svc/CompactData/IFS/"
        f"Q.{countries}.{series_code}"
        f"?startPeriod={start_period}&endPeriod={end_period}"
    )

    result: dict[str, list[dict]] = {iso2: [] for iso2 in COUNTRIES_SA}

    try:
        resp = requests.get(url, timeout=60)
        resp.raise_for_status()
        data = resp.json()

        dataset = data.get("CompactData", {}).get("DataSet", {})
        if not dataset:
            warnings.warn(f"IMF IFS {series_code}: DataSet vacío o faltante.")
            return result

        series_list = dataset.get("Series", [])
        if isinstance(series_list, dict):
            series_list = [series_list]

        for series in series_list:
            iso2 = series.get("@REF_AREA", "")
            if iso2 not in COUNTRIES_SA:
                continue
            obs_list = series.get("Obs", [])
            if isinstance(obs_list, dict):
                obs_list = [obs_list]
            for obs in obs_list:
                period    = obs.get("@TIME_PERIOD", "")   # e.g. "2021Q1"
                value_str = obs.get("@OBS_VALUE")
                if "Q" not in period:
                    continue
                parts = period.split("Q")
                if len(parts) != 2:
                    continue
                try:
                    year, quarter = int(parts[0]), int(parts[1])
                except ValueError:
                    continue
                result[iso2].append({
                    "year":    year,
                    "quarter": quarter,
                    "value":   float(value_str) if value_str not in (None, "") else None,
                })

        cache_path = RAW_DIR / "imf_ifs" / f"{series_code}_{date.today()}.json"
        cache_path.parent.mkdir(parents=True, exist_ok=True)
        cache_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        time.sleep(0.5)

    except Exception as exc:
        warnings.warn(f"IMF IFS {series_code}: {exc}")

    return result


def fetch_pbi_trimestral(
    data_start: int = _QUARTER_DATA_START,
    data_end: int = _QUARTER_DATA_END,
) -> dict[str, list[dict]]:
    """
    A2 · Crecimiento real del PBI, cadencia trimestral (variación interanual).
    Fuente: IMF IFS NGDP_R_K_IX (índice del PBI real, base fija).
    Calcula YoY: growth(Q_t) = (idx(Q_t) / idx(Q_{t-4}) - 1) × 100.
    Retorna {iso2: [{year, quarter, value}]} solo para data_start en adelante.
    Venezuela y países con datos limitados pueden devolver lista parcial.
    """
    raw = _imf_ifs_quarterly_fetch("NGDP_R_K_IX", data_start - 1, data_end)
    result: dict[str, list[dict]] = {iso2: [] for iso2 in COUNTRIES_SA}

    for iso2, obs_list in raw.items():
        lookup: dict[tuple, float | None] = {
            (obs["year"], obs["quarter"]): obs["value"]
            for obs in obs_list
        }

        for year in range(data_start, data_end + 1):
            for quarter in range(1, 5):
                idx_t    = lookup.get((year, quarter))
                idx_prev = lookup.get((year - 1, quarter))
                if idx_t is None or idx_prev is None or idx_prev == 0:
                    continue
                growth = round((idx_t / idx_prev - 1) * 100, 1)
                result[iso2].append({"year": year, "quarter": quarter, "value": growth})

    return result


def _ilo_fetch_monthly(indicator_id: str) -> dict[str, list[dict]]:
    """
    Descarga datos mensuales de OIT ILOSTAT.
    Retorna {iso2: [{year, month, value}]} en unidades originales (sin indexar).
    Parsea períodos "2021M01" y "2021-01".
    """
    result: dict[str, list[dict]] = {iso2: [] for iso2 in COUNTRIES_SA}
    url = f"https://rplumber.ilo.org/data/indicator/?id={indicator_id}&lang=en&format=.json"

    try:
        resp = requests.get(url, timeout=90)
        resp.raise_for_status()
        payload = resp.json()

        iso3_to_iso2 = {v: k for k, v in COUNTRIES_SA.items()}
        for obs in payload:
            ref_area = obs.get("ref_area", "")
            sex_val  = obs.get("sex", "SEX_T")
            time_val = obs.get("time", "")
            value    = obs.get("obs_value")

            iso2 = iso3_to_iso2.get(ref_area.upper())
            if not iso2:
                continue
            # Solo total (sin desagregación por sexo)
            if sex_val not in ("SEX_T", "T", "TOTAL", ""):
                continue

            # Parsear período mensual: "2021M01" o "2021-01"
            year, month = None, None
            if "M" in time_val:
                parts = time_val.split("M")
                if len(parts) == 2 and parts[0].isdigit() and parts[1].isdigit():
                    year, month = int(parts[0]), int(parts[1])
            elif "-" in time_val:
                parts = time_val.split("-")
                if (
                    len(parts) == 2
                    and len(parts[0]) == 4
                    and parts[0].isdigit()
                    and parts[1].isdigit()
                    and 1 <= int(parts[1]) <= 12
                ):
                    year, month = int(parts[0]), int(parts[1])

            if year is None or month is None:
                continue

            result[iso2].append({
                "year":  year,
                "month": month,
                "value": float(value) if value is not None else None,
            })

        cache_path = RAW_DIR / "ilostat" / f"{indicator_id}_monthly_{date.today()}.json"
        cache_path.parent.mkdir(parents=True, exist_ok=True)
        # Guarda muestra (primeros 1000 registros para no inflar el cache)
        cache_path.write_text(
            json.dumps(payload[:1000], ensure_ascii=False, indent=2), encoding="utf-8"
        )
        time.sleep(0.5)

    except Exception as exc:
        warnings.warn(f"ILO monthly {indicator_id}: {exc}")

    return result


def _compute_salario_real_mensual(
    data_start: int = _MONTH_DATA_START,
    data_end: int = _MONTH_DATA_END,
) -> dict[str, list[dict]]:
    """
    Computa series mensuales de salario real indexadas a base 2021=100.
    Fuente: OIT ILOSTAT EAR_EMTA_SEX_NB_M (salario mensual promedio, moneda local).
    Sustituye EAR_4MTH_SEX_ECO_CUR_NB_M (deprecado 2026). Cobertura SA: ~5/10.
    Países sin datos en ILO emiten [STUB] y devuelven lista vacía.
    """
    raw = _ilo_fetch_monthly("EAR_EMTA_SEX_NB_M")
    result: dict[str, list[dict]] = {iso2: [] for iso2 in COUNTRIES_SA}

    for iso2 in COUNTRIES_SA:
        obs_list = [
            obs for obs in raw.get(iso2, [])
            if obs.get("value") is not None
            and data_start <= obs["year"] <= data_end
        ]

        if not obs_list:
            warnings.warn(
                f"[STUB] ILO EAR_4MTH / {iso2}: sin datos de salario mensual disponibles. "
                "Agregar fuente nacional en raw/salario-real/ y actualizar sources.py.",
                stacklevel=3,
            )
            continue

        # Base: promedio de los valores de 2021 (o primer año disponible)
        base_vals = [obs["value"] for obs in obs_list if obs["year"] == data_start]
        if not base_vals:
            base_year = min(obs["year"] for obs in obs_list)
            base_vals = [obs["value"] for obs in obs_list if obs["year"] == base_year]

        if not base_vals:
            continue
        base_value = sum(base_vals) / len(base_vals)
        if base_value == 0:
            continue

        for obs in sorted(obs_list, key=lambda x: (x["year"], x["month"])):
            idx = round((obs["value"] / base_value) * 100, 1)
            result[iso2].append({"year": obs["year"], "month": obs["month"], "value": idx})

    return result


def fetch_salario_real_mensual(
    data_start: int = _MONTH_DATA_START,
    data_end: int = _MONTH_DATA_END,
) -> dict[str, list[dict]]:
    """
    C7 · Salario real mensual, índice base 2021=100.
    {iso2: [{year, month, value}]}
    Usa caché de módulo para evitar doble llamada a ILO en el mismo build.
    """
    global _SALARIO_REAL_MONTHLY_CACHE
    if _SALARIO_REAL_MONTHLY_CACHE is None:
        _SALARIO_REAL_MONTHLY_CACHE = _compute_salario_real_mensual(data_start, data_end)
    return _SALARIO_REAL_MONTHLY_CACHE


def fetch_salario_real_anual() -> dict[str, dict[int, float | None]]:
    """
    C7 · Salario real anual (promedio anual del índice mensual base 2021=100).
    Serie anual derivada de la mensual — cumple el requisito de series obligatorio.
    {iso2: {year: value}}
    """
    monthly = fetch_salario_real_mensual()
    result: dict[str, dict[int, float | None]] = {iso2: {} for iso2 in COUNTRIES_SA}

    for iso2, obs_list in monthly.items():
        year_groups: dict[int, list[float]] = {}
        for obs in obs_list:
            if obs["value"] is not None:
                year_groups.setdefault(obs["year"], []).append(obs["value"])
        for year, vals in year_groups.items():
            result[iso2][year] = round(sum(vals) / len(vals), 1)

    return result
