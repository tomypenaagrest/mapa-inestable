"""
sources.py — Adaptadores por fuente para el pipeline de indicadores macro.

Cada función devuelve:
    dict[country_iso2, dict[year_int, float | None]]

Las fuentes que requieren descarga manual emiten un warning y devuelven {}.
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
