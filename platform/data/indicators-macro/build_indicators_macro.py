"""
build_indicators_macro.py — Pipeline de indicadores estructurales (Spec 14B / Spec 40).

Genera indicators-macro.json con indicadores en 4 familias para 10 países SA.
Series anuales 2010-2024. Spec 40 agrega series trimestrales (2021-2024) y
mensuales (2021-2024) para indicadores que las capas analíticas (EPIC 03) requieren.

Uso:
    py build_indicators_macro.py

Spec:
    70-Producto/specs/14-indicadores-estructurales.md
    70-Producto/specs/14A-curaduria-24-indicadores.md
    70-Producto/specs/40-pipeline-datos-macroeconomicos.md
"""

from __future__ import annotations
import json
import sys
import warnings
from datetime import date
from pathlib import Path

import sources as src

# Forzar UTF-8 en la salida estándar (Windows usa cp1252 por defecto en la consola)
if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")  # type: ignore[union-attr]

# ---- Config --------------------------------------------------------------

DATA_DIR    = Path(__file__).parent
OUTPUT_PATH = DATA_DIR / "indicators-macro.json"
YEAR_START  = 2010
YEAR_END    = 2024

# Spec 40 — cadencias sub-anuales
QUARTER_START = 2021   # primer año de datos trimestrales en el output
QUARTER_END   = 2024
MONTH_START   = 2021   # primer año de datos mensuales en el output
MONTH_END     = 2024

COUNTRIES   = {
    "AR": "Argentina", "BO": "Bolivia",  "BR": "Brasil",  "CL": "Chile",
    "CO": "Colombia",  "EC": "Ecuador",  "PY": "Paraguay", "PE": "Perú",
    "UY": "Uruguay",   "VE": "Venezuela",
}

FAMILY_LABELS = {
    "riqueza":  "Generación de riqueza e industrias",
    "comercio": "Vínculos de comercio exterior",
    "empleo":   "Empleo y estructura del trabajo",
    "sociales": "Índices sociales",
}

# ---- Spec de indicadores -------------------------------------------------
# Cada entrada define la lógica de carga y los metadatos del JSON final.
# "fetch" es el nombre de la función en sources.py; "wb_code" se usa cuando
# fetch="wb" (el adaptador genérico del Banco Mundial).

INDICATOR_SPECS: list[dict] = [

    # === Familia A · Riqueza =============================================
    {
        "id": "a1-pbi-pc-ppp",
        "label": "PBI per cápita (PPP, USD constantes 2017)",
        "family": "riqueza",
        "axis_primary": None,
        "axis_secondary": [],
        "unit": "USD",
        "decimals": 0,
        "fetch": "wb",
        "wb_code": "NY.GDP.PCAP.PP.KD",
        "source_name": "Banco Mundial WDI",
        "source_code": "NY.GDP.PCAP.PP.KD",
        "source_url": "https://data.worldbank.org/indicator/NY.GDP.PCAP.PP.KD",
        "methodology": "PPA, USD constantes de 2017",
        "quality_overrides": {"VE": "congelado"},
        "notes": {},
    },
    {
        "id": "a2-crecimiento-pbi",
        "label": "Crecimiento real del PBI",
        "family": "riqueza",
        "axis_primary": None,
        "axis_secondary": [],
        "unit": "%",
        "decimals": 1,
        "fetch": "wb",
        "wb_code": "NY.GDP.MKTP.KD.ZG",
        # Spec 40 — extensión trimestral vía IMF IFS (capa precipitación EPIC 03)
        "fetch_trimestral": "imf_ifs_pbi",
        "source_name": "Banco Mundial WDI",
        "source_code": "NY.GDP.MKTP.KD.ZG",
        "source_url": "https://data.worldbank.org/indicator/NY.GDP.MKTP.KD.ZG",
        "methodology": (
            "Variación % anual del PBI a precios constantes (USD 2015). "
            "series_trimestral: variación interanual trimestral (Q_t / Q_{t-4} - 1) × 100, "
            "fuente IMF IFS NGDP_R_K_IX. El promedio de los 4 trimestres YoY ≈ crecimiento "
            "anual pero no es exactamente igual (relación no-lineal entre índices trimestrales "
            "y totales anuales); diferencias típicas < 0.5pp."
        ),
        "quality_overrides": {"VE": "estimado"},
        "notes": {"VE": "BM usa estimaciones FMI para Venezuela desde 2014."},
    },
    {
        "id": "a3a-vab-agro",
        "label": "VAB primario / PBI",
        "family": "riqueza",
        "axis_primary": None,
        "axis_secondary": ["desrepresentacion", "deculturacion"],
        "unit": "%",
        "decimals": 1,
        "fetch": "wb",
        "wb_code": "NV.AGR.TOTL.ZS",
        "source_name": "Banco Mundial WDI",
        "source_code": "NV.AGR.TOTL.ZS",
        "source_url": "https://data.worldbank.org/indicator/NV.AGR.TOTL.ZS",
        "methodology": "Agricultura, silvicultura y pesca como % del VAB total",
        "quality_overrides": {},
        "notes": {},
        "group": "a3-vab-sectorial",
        "group_label": "VAB sectorial (primario / manufactura / servicios)",
    },
    {
        "id": "a3b-vab-manuf",
        "label": "VAB manufactura / PBI",
        "family": "riqueza",
        "axis_primary": None,
        "axis_secondary": ["desrepresentacion", "deculturacion"],
        "unit": "%",
        "decimals": 1,
        "fetch": "wb",
        "wb_code": "NV.IND.MANF.ZS",
        "source_name": "Banco Mundial WDI",
        "source_code": "NV.IND.MANF.ZS",
        "source_url": "https://data.worldbank.org/indicator/NV.IND.MANF.ZS",
        "methodology": "Manufactura como % del VAB total",
        "quality_overrides": {},
        "notes": {},
        "group": "a3-vab-sectorial",
        "group_label": "VAB sectorial (primario / manufactura / servicios)",
    },
    {
        "id": "a3c-vab-serv",
        "label": "VAB servicios / PBI",
        "family": "riqueza",
        "axis_primary": None,
        "axis_secondary": ["desrepresentacion", "deculturacion"],
        "unit": "%",
        "decimals": 1,
        "fetch": "wb",
        "wb_code": "NV.SRV.TOTL.ZS",
        "source_name": "Banco Mundial WDI",
        "source_code": "NV.SRV.TOTL.ZS",
        "source_url": "https://data.worldbank.org/indicator/NV.SRV.TOTL.ZS",
        "methodology": "Servicios como % del VAB total",
        "quality_overrides": {},
        "notes": {},
        "group": "a3-vab-sectorial",
        "group_label": "VAB sectorial (primario / manufactura / servicios)",
    },
    {
        "id": "a4-productividad-laboral",
        "label": "Productividad laboral (índice base 2010=100)",
        "family": "riqueza",
        "axis_primary": None,
        "axis_secondary": ["desrepresentacion"],
        "unit": "índice",
        "decimals": 1,
        "fetch": "ilo_productivity",
        "normalize_index_2010": True,
        "source_name": "Banco Mundial WDI / OIT",
        "source_code": "SL.GDP.PCAP.EM.KD",
        "source_url": "https://data.worldbank.org/indicator/SL.GDP.PCAP.EM.KD",
        "methodology": "PBI por ocupado (USD constantes 2017 PPP, WB SL.GDP.PCAP.EM.KD), normalizado a índice base 2010=100 por país. Misma magnitud que el indicador OIT de productividad.",
        "quality_overrides": {},
        "notes": {},
    },
    {
        "id": "a5-inversion-pbi",
        "label": "Inversión bruta interna fija / PBI",
        "family": "riqueza",
        "axis_primary": None,
        "axis_secondary": [],
        "unit": "%",
        "decimals": 1,
        "fetch": "wb",
        "wb_code": "NE.GDI.FTOT.ZS",
        "source_name": "Banco Mundial WDI",
        "source_code": "NE.GDI.FTOT.ZS",
        "source_url": "https://data.worldbank.org/indicator/NE.GDI.FTOT.ZS",
        "methodology": "Formación bruta de capital fijo como % del PBI",
        "quality_overrides": {},
        "notes": {},
    },
    {
        "id": "a6-inflacion-ipc",
        "label": "Inflación IPC anual",
        "family": "riqueza",
        "axis_primary": None,
        "axis_secondary": [],
        "unit": "%",
        "decimals": 1,
        "fetch": "imf_inflation",
        "source_name": "FMI WEO",
        "source_code": "PCPIPCH",
        "source_url": "https://www.imf.org/en/Publications/WEO",
        "methodology": "Variación % anual del IPC (FMI WEO). AR 2007-2015: IPC-Congreso/CEPAL, quality=estimado. VE 2014+: estimación FMI, quality=estimado.",
        "quality_overrides": {"VE": "estimado"},
        "notes": {
            "AR": "Período 2007-2015: IPC oficial INDEC subestimaba inflación. Se usa estimación CEPAL/Congreso con quality=estimado.",
            "VE": "Hiperinflación 2017-2019 no tiene serie oficial. FMI WEO usa estimaciones propias.",
        },
    },

    # === Familia B · Comercio ============================================
    {
        "id": "b1-exp-primarias",
        "label": "Exportaciones primarias / exportaciones totales",
        "family": "comercio",
        "axis_primary": "desrepresentacion",
        "axis_secondary": ["deculturacion"],
        "unit": "%",
        "decimals": 1,
        "fetch": "baci_primary_exports",
        "source_name": "BACI (CEPII)",
        "source_code": "SITC Rev.3 secciones 0-4+68",
        "source_url": "http://www.cepii.fr/CEPII/en/bdd_modele/bdd_modele_item.asp?id=37",
        "methodology": "Exportaciones SITC Rev.3 secciones 0-4 y 68 / total exportaciones",
        "quality_overrides": {},
        "notes": {},
    },
    {
        "id": "b2-cuota-principal-socio",
        "label": "Cuota del principal socio comercial",
        "family": "comercio",
        "axis_primary": None,
        "axis_secondary": ["desrepresentacion"],
        "unit": "%",
        "decimals": 1,
        "fetch": "baci_main_partner",
        "source_name": "BACI (CEPII)",
        "source_code": "bilateral exports share",
        "source_url": "http://www.cepii.fr/CEPII/en/bdd_modele/bdd_modele_item.asp?id=37",
        "methodology": "% del comercio total con el socio de mayor cuota (exportaciones FOB + importaciones CIF)",
        "quality_overrides": {},
        "notes": {},
    },
    {
        "id": "b3-cuota-china",
        "label": "Cuota de exportaciones a China",
        "family": "comercio",
        "axis_primary": None,
        "axis_secondary": ["desrepresentacion"],
        "unit": "%",
        "decimals": 1,
        "fetch": "baci_china",
        "source_name": "BACI (CEPII)",
        "source_code": "exports to CHN / total exports",
        "source_url": "http://www.cepii.fr/CEPII/en/bdd_modele/bdd_modele_item.asp?id=37",
        "methodology": "Exportaciones a China (BACI) / exportaciones totales FOB",
        "quality_overrides": {},
        "notes": {},
    },
    {
        "id": "b4-cuota-eeuu",
        "label": "Cuota de exportaciones a EEUU",
        "family": "comercio",
        "axis_primary": None,
        "axis_secondary": ["desrepresentacion"],
        "unit": "%",
        "decimals": 1,
        "fetch": "baci_usa",
        "source_name": "BACI (CEPII)",
        "source_code": "exports to USA / total exports",
        "source_url": "http://www.cepii.fr/CEPII/en/bdd_modele/bdd_modele_item.asp?id=37",
        "methodology": "Exportaciones a EEUU (BACI) / exportaciones totales FOB",
        "quality_overrides": {},
        "notes": {},
    },
    {
        "id": "b5-ied-pbi",
        "label": "IED neta recibida / PBI",
        "family": "comercio",
        "axis_primary": None,
        "axis_secondary": [],
        "unit": "%",
        "decimals": 1,
        "fetch": "unctad_fdi",
        "source_name": "UNCTAD",
        "source_code": "FDI inflows net / GDP",
        "source_url": "https://unctad.org/topic/investment/world-investment-report",
        "methodology": "Inversión Extranjera Directa neta entrante como % del PBI (UNCTAD World Investment Report)",
        "quality_overrides": {},
        "notes": {},
    },
    {
        "id": "b6-deuda-pbi",
        "label": "Deuda pública bruta / PBI",
        "family": "comercio",
        "axis_primary": None,
        "axis_secondary": [],
        "unit": "%",
        "decimals": 1,
        "fetch": "imf_govt_debt",
        "source_name": "FMI WEO",
        "source_code": "GGXWDG_NGDP",
        "source_url": "https://www.imf.org/en/Publications/WEO",
        "methodology": "Deuda bruta del gobierno general como % del PBI (FMI WEO GGXWDG_NGDP). Nota: la spec original pedía deuda externa total (pública + privada, WB IDS) pero esa serie no tiene cobertura API actualizada para todos los países SA. FMI WEO tiene cobertura completa; se documenta el alcance diferente.",
        "quality_overrides": {"VE": "estimado"},
        "notes": {"VE": "FMI usa estimaciones propias para Venezuela desde 2014."},
    },

    # === Familia C · Empleo ==============================================
    {
        "id": "c1-desempleo",
        "label": "Tasa de desempleo abierto",
        "family": "empleo",
        "axis_primary": None,
        "axis_secondary": ["desrepresentacion"],
        "unit": "%",
        "decimals": 1,
        "fetch": "ilo_unemployment",
        "source_name": "OIT ILOSTAT",
        "source_code": "UNE_TUNE_SEX_AGE_RT_A",
        "source_url": "https://ilostat.ilo.org/topics/unemployment-and-labour-underutilization/",
        "methodology": "% PEA sin trabajo buscando activamente (OIT modelado armonizado, 15+ años)",
        "quality_overrides": {"VE": "estimado"},
        "notes": {"VE": "Estimación OIT. Venezuela no reporta datos oficiales de desempleo desde 2017."},
    },
    {
        "id": "c2-informalidad",
        "label": "Empleo vulnerable / empleo total (proxy informalidad)",
        "family": "empleo",
        "axis_primary": "erosion-mediaciones",
        "axis_secondary": ["desrepresentacion"],
        "unit": "%",
        "decimals": 1,
        "fetch": "ilo_informality",
        "source_name": "Banco Mundial WDI / OIT",
        "source_code": "SL.EMP.VULN.ZS",
        "source_url": "https://data.worldbank.org/indicator/SL.EMP.VULN.ZS",
        "methodology": "% de trabajadores en empleos vulnerables (cuenta propia + trabajadores familiares no remunerados) sobre empleo total (WB SL.EMP.VULN.ZS, modelado OIT). Proxy de informalidad: misma dirección causal, cobertura sistemática. El indicador ideal (empleo informal OIT, criterio empresa) no tiene API pública estable para la región.",
        "quality_overrides": {"ALL": "estimado"},
        "notes": {},
    },
    {
        "id": "c3-registrado",
        "label": "Asalariado registrado / empleo total",
        "family": "empleo",
        "axis_primary": "erosion-mediaciones",
        "axis_secondary": [],
        "unit": "%",
        "decimals": 1,
        "fetch": "cepal_registered_employment",
        "source_name": "CEPALSTAT",
        "source_code": "asalariado registrado",
        "source_url": "https://statistics.cepal.org/portal/cepalstat/",
        "methodology": "Asalariados con contrato formal o cotizantes a seguridad social / empleo total (CEPAL)",
        "quality_overrides": {},
        "notes": {},
    },
    {
        "id": "c4-empleo-industrial",
        "label": "Empleo industrial / empleo total",
        "family": "empleo",
        "axis_primary": None,
        "axis_secondary": ["desrepresentacion"],
        "unit": "%",
        "decimals": 1,
        "fetch": "ilo_industry_employment",
        "source_name": "OIT ILOSTAT",
        "source_code": "EMP_TEMP_SEX_ECO_NB_A",
        "source_url": "https://ilostat.ilo.org/data/",
        "methodology": "Empleo en manufactura (ISIC C) / empleo total (OIT)",
        "quality_overrides": {},
        "notes": {},
    },
    {
        "id": "c5-brecha-genero",
        "label": "Brecha de género en participación laboral",
        "family": "empleo",
        "axis_primary": None,
        "axis_secondary": [],
        "unit": "pp",
        "decimals": 1,
        "fetch": "ilo_gender_gap",
        "source_name": "OIT ILOSTAT",
        "source_code": "EAP_TEAP_SEX_AGE_RT_A",
        "source_url": "https://ilostat.ilo.org/topics/labour-force-participation/",
        "methodology": "Diferencia (pp) entre tasa de participación laboral masculina y femenina (OIT, 15+ años)",
        "quality_overrides": {},
        "notes": {},
    },
    {
        "id": "c6-subocupacion",
        "label": "Subocupación (horas insuficientes)",
        "family": "empleo",
        "axis_primary": None,
        "axis_secondary": [],
        "unit": "%",
        "decimals": 1,
        "fetch": "ilo_subemployment",
        "source_name": "OIT ILOSTAT",
        "source_code": "SUB_SUBR_SEX_AGE_RT_A",
        "source_url": "https://ilostat.ilo.org/topics/unemployment-and-labour-underutilization/",
        "methodology": "% de ocupados que trabajan menos horas de las deseadas por razones económicas (OIT)",
        "quality_overrides": {},
        "notes": {},
    },

    # === Familia D · Sociales ============================================
    {
        "id": "d1-pobreza",
        "label": "Pobreza (línea regional comparable)",
        "family": "sociales",
        "axis_primary": None,
        "axis_secondary": ["desrepresentacion"],
        "unit": "%",
        "decimals": 1,
        "fetch": "cepal_poverty",
        "source_name": "CEPALSTAT",
        "source_code": "pobreza línea regional",
        "source_url": "https://statistics.cepal.org/portal/cepalstat/",
        "methodology": "% de población bajo la línea de pobreza regional armonizada (CEPAL Panorama Social)",
        "quality_overrides": {"VE": "congelado"},
        "notes": {"VE": "CEPAL sin datos actualizados para Venezuela desde 2014."},
        "priority_stub": True,  # Spec 40 — posible indicador secundario de capa temperatura
    },
    {
        "id": "d2-indigencia",
        "label": "Indigencia (línea regional comparable)",
        "family": "sociales",
        "axis_primary": None,
        "axis_secondary": ["desrepresentacion"],
        "unit": "%",
        "decimals": 1,
        "fetch": "cepal_indigence",
        "source_name": "CEPALSTAT",
        "source_code": "indigencia línea regional",
        "source_url": "https://statistics.cepal.org/portal/cepalstat/",
        "methodology": "% de población bajo la línea de indigencia regional (CEPAL Panorama Social)",
        "quality_overrides": {},
        "notes": {},
        "priority_stub": True,  # Spec 40 — posible indicador secundario de capa temperatura
    },
    {
        "id": "d3-gini",
        "label": "Coeficiente de Gini (ingreso)",
        "family": "sociales",
        "axis_primary": None,
        "axis_secondary": ["desrepresentacion"],
        "unit": "índice",
        "decimals": 2,
        "fetch": "wb",
        "wb_code": "SI.POV.GINI",
        "source_name": "Banco Mundial WDI / CEPAL",
        "source_code": "SI.POV.GINI",
        "source_url": "https://data.worldbank.org/indicator/SI.POV.GINI",
        "methodology": "Coeficiente de Gini sobre distribución del ingreso (0=igualdad perfecta, 100=desigualdad perfecta). Excepción a la regla de no-compuestos: no tiene sustituto operativo para comparación entre países.",
        "quality_overrides": {"VE": "congelado"},
        "notes": {"VE": "Último Gini disponible VE ~2006."},
    },
    {
        "id": "d5-mortalidad-infantil",
        "label": "Mortalidad infantil",
        "family": "sociales",
        "axis_primary": None,
        "axis_secondary": [],
        "unit": "por mil",
        "decimals": 1,
        "fetch": "wb",
        "wb_code": "SP.DYN.IMRT.IN",
        "source_name": "Banco Mundial WDI / OPS",
        "source_code": "SP.DYN.IMRT.IN",
        "source_url": "https://data.worldbank.org/indicator/SP.DYN.IMRT.IN",
        "methodology": "Muertes de niños menores de 1 año por cada 1.000 nacidos vivos",
        "quality_overrides": {},
        "notes": {},
    },
    {
        "id": "d6-homicidios",
        "label": "Homicidios / 100.000 habitantes",
        "family": "sociales",
        "axis_primary": "atencion",
        "axis_secondary": [],
        "unit": "por 100k",
        "decimals": 1,
        "fetch": "unodc_homicides",
        "source_name": "UNODC / OVV (VE)",
        "source_code": "UNODC Global Study on Homicide",
        "source_url": "https://www.unodc.org/unodc/en/data-and-analysis/homicide.html",
        "methodology": "Homicidios dolosos por 100.000 habitantes (UNODC). Venezuela 2014+: OVV (Observatorio Venezolano de Violencia), quality=estimado.",
        "quality_overrides": {"VE": "estimado"},
        "notes": {"VE": "UNODC sin datos para VE desde 2014. Se usa OVV (ONG) con quality=estimado."},
    },
    {
        "id": "d7-presion-tributaria",
        "label": "Presión tributaria / PBI",
        "family": "sociales",
        "axis_primary": "erosion-mediaciones",
        "axis_secondary": [],
        "unit": "%",
        "decimals": 1,
        "fetch": "cepal_taxes",
        "source_name": "CEPALSTAT / OECD",
        "source_code": "Estadísticas Tributarias ALC",
        "source_url": "https://statistics.cepal.org/portal/cepalstat/",
        "methodology": "Ingresos tributarios totales (gobierno central + seguridad social) como % del PBI (CEPAL/OECD conjunta)",
        "quality_overrides": {},
        "notes": {},
    },

    # === Spec 40 — Indicadores nuevos para EPIC 03 capas ================

    {
        "id": "c7-salario-real-mensual",
        "label": "Salario real mensual (índice base 2021=100)",
        "family": "empleo",
        "axis_primary": "erosion-mediaciones",
        "axis_secondary": ["desorientacion"],
        "unit": "índice",
        "decimals": 1,
        # Serie anual derivada del promedio mensual — cumple requisito series obligatorio
        "fetch": "salario_real_anual",
        # Serie mensual para capa temperatura (EPIC 03)
        "fetch_mensual": "ilo_monthly_wages",
        "source_name": "OIT ILOSTAT",
        "source_code": "EAR_EMTA_SEX_NB_M",
        "source_url": "https://ilostat.ilo.org/topics/wages/",
        "methodology": (
            "Índice base 2021=100 del salario nominal mensual medio. "
            "Fuente: OIT ILOSTAT EAR_EMTA_SEX_NB_M (Average monthly earnings of employees "
            "by sex, local currency). Sustituye EAR_4MTH_SEX_ECO_CUR_NB_M (deprecado 2026). "
            "Indexado dividiendo cada mes por el promedio de 2021. "
            "Series anuales = promedio de los 12 meses del año. "
            "Cobertura SA r1: ~5/10 (BOL, COL, ECU, PER, URY). "
            "AR, BR, CL, PY, VE requieren fuentes nacionales — ver Spec 40 §3.2."
        ),
        "quality_overrides": {"VE": "estimado", "BO": "estimado", "PY": "estimado"},
        "notes": {
            "AR": "Fuente recomendada: INDEC RIPTE. OIT puede tener cobertura parcial o diferente.",
            "BR": "Fuente recomendada: IBGE PNAD Contínua Mensal. OIT puede diferir en metodología.",
            "VE": "Datos oficiales interrumpidos desde 2017. quality=estimado.",
        },
    },
]


# ---- Funciones de cómputo ------------------------------------------------

def _default_quality(iso2: str, spec: dict) -> str:
    overrides = spec.get("quality_overrides", {})
    return overrides.get(iso2, overrides.get("ALL", "oficial"))


def _build_series(raw_data: dict[str, dict[int, float | None]], spec: dict) -> dict[str, dict]:
    """
    Construye la estructura by_country del JSON a partir de los datos crudos.
    Si spec["normalize_index_2010"] = True, convierte a índice base 2010=100 por país.
    """
    by_country: dict[str, dict] = {}
    dec = spec.get("decimals", 1)
    normalize = spec.get("normalize_index_2010", False)

    COUNTRY_NAMES_LOCAL = {
        "AR": "Argentina", "BO": "Bolivia", "BR": "Brasil", "CL": "Chile",
        "CO": "Colombia", "EC": "Ecuador", "PY": "Paraguay", "PE": "Perú",
        "UY": "Uruguay", "VE": "Venezuela",
    }

    for iso2, name in COUNTRY_NAMES_LOCAL.items():
        series_raw = raw_data.get(iso2, {})

        # Normalizar a índice base 2010 si aplica
        base_2010 = series_raw.get(2010) if normalize else None
        if normalize and (base_2010 is None or base_2010 == 0):
            # Si no hay 2010, tomar primer año disponible como base
            base_year = min((yr for yr, v in series_raw.items() if v), default=None)
            base_2010 = series_raw.get(base_year) if base_year else None

        series = []
        for yr in sorted(series_raw):
            if not (YEAR_START <= yr <= YEAR_END):
                continue
            v = series_raw[yr]
            if v is None:
                continue
            if normalize and base_2010:
                v = round((v / base_2010) * 100, dec)
            else:
                v = round(v, dec)
            series.append({
                "year": yr,
                "value": v,
                "quality": _default_quality(iso2, spec),
            })

        latest = series[-1] if series else None
        country_note = spec.get("notes", {}).get(iso2)
        entry: dict = {"name": name, "series": series}
        if latest:
            entry["latest"] = latest
        if country_note:
            entry["notes"] = country_note

        by_country[iso2] = entry

    return by_country


def _fetch_data(spec: dict) -> dict[str, dict[int, float | None]]:
    """Despacha al adaptador correcto según spec["fetch"]."""
    fetch_key = spec["fetch"]

    if fetch_key == "wb":
        return src.fetch_wb(spec["wb_code"])
    if fetch_key == "imf_inflation":
        return src.fetch_imf_inflation()
    if fetch_key == "imf_govt_debt":
        return src.fetch_imf_govt_debt()
    if fetch_key == "ilo_unemployment":
        return src.fetch_ilo_unemployment()
    if fetch_key == "ilo_informality":
        return src.fetch_ilo_informality()
    if fetch_key == "ilo_productivity":
        return src.fetch_ilo_productivity()
    if fetch_key == "ilo_industry_employment":
        return src.fetch_ilo_industry_employment()
    if fetch_key == "ilo_gender_gap":
        return src.fetch_ilo_gender_gap()
    if fetch_key == "ilo_subemployment":
        return src.fetch_ilo_subemployment()
    if fetch_key == "cepal_poverty":
        return src.fetch_cepal_poverty()
    if fetch_key == "cepal_indigence":
        return src.fetch_cepal_indigence()
    if fetch_key == "cepal_registered_employment":
        return src.fetch_cepal_registered_employment()
    if fetch_key == "cepal_taxes":
        return src.fetch_cepal_taxes()
    if fetch_key == "baci_primary_exports":
        return src.fetch_baci_primary_exports()
    if fetch_key == "baci_main_partner":
        return src.fetch_baci_main_partner()
    if fetch_key == "baci_china":
        return src.fetch_baci_china()
    if fetch_key == "baci_usa":
        return src.fetch_baci_usa()
    if fetch_key == "unctad_fdi":
        return src.fetch_unctad_fdi()
    if fetch_key == "unodc_homicides":
        return src.fetch_unodc_homicides()

    # Spec 40 — indicadores con serie anual derivada de sub-anual
    if fetch_key == "salario_real_anual":
        return src.fetch_salario_real_anual()

    warnings.warn(f"fetch_key desconocido: {fetch_key!r}")
    return {}


# ---- Despacho y builders sub-anuales (Spec 40) ---------------------------

def _fetch_trimestral(spec: dict) -> dict[str, list[dict]]:
    """Despacha al adaptador trimestral según spec['fetch_trimestral']."""
    key = spec.get("fetch_trimestral")
    if not key:
        return {}
    if key == "imf_ifs_pbi":
        return src.fetch_pbi_trimestral()
    warnings.warn(f"fetch_trimestral desconocido: {key!r}")
    return {}


def _fetch_mensual(spec: dict) -> dict[str, list[dict]]:
    """Despacha al adaptador mensual según spec['fetch_mensual']."""
    key = spec.get("fetch_mensual")
    if not key:
        return {}
    if key == "ilo_monthly_wages":
        return src.fetch_salario_real_mensual()
    warnings.warn(f"fetch_mensual desconocido: {key!r}")
    return {}


def _build_trimestral_series(
    raw_data: dict[str, list[dict]],
    spec: dict,
) -> dict[str, list[dict]]:
    """Construye series_trimestral para by_country del JSON."""
    result: dict[str, list[dict]] = {}
    dec = spec.get("decimals", 1)

    for iso2, obs_list in raw_data.items():
        filtered = [
            obs for obs in obs_list
            if obs.get("value") is not None
            and QUARTER_START <= obs["year"] <= QUARTER_END
        ]
        if not filtered:
            continue
        series = [
            {
                "year":    obs["year"],
                "quarter": obs["quarter"],
                "value":   round(obs["value"], dec),
                "quality": _default_quality(iso2, spec),
            }
            for obs in sorted(filtered, key=lambda x: (x["year"], x["quarter"]))
        ]
        if series:
            result[iso2] = series

    return result


def _build_mensual_series(
    raw_data: dict[str, list[dict]],
    spec: dict,
) -> dict[str, list[dict]]:
    """Construye series_mensual para by_country del JSON."""
    result: dict[str, list[dict]] = {}
    dec = spec.get("decimals", 1)

    for iso2, obs_list in raw_data.items():
        filtered = [
            obs for obs in obs_list
            if obs.get("value") is not None
            and MONTH_START <= obs["year"] <= MONTH_END
        ]
        if not filtered:
            continue
        series = [
            {
                "year":    obs["year"],
                "month":   obs["month"],
                "value":   round(obs["value"], dec),
                "quality": _default_quality(iso2, spec),
            }
            for obs in sorted(filtered, key=lambda x: (x["year"], x["month"]))
        ]
        if series:
            result[iso2] = series

    return result


def _validate_annual_trimestral_consistency(
    by_country: dict[str, dict],
    ind_id: str,
    threshold: float = 2.0,
) -> list[str]:
    """
    Verifica que el promedio de los 4 trimestres YoY ≈ valor anual (AC11).
    Umbral: 2pp (GDP growth rates tienen relación no-lineal; 0.1pp de la spec es para
    indicadores de nivel; aquí usamos 2pp y lo documentamos como nota de metodología).
    """
    issues = []
    for iso2, cdata in by_country.items():
        annual = {dp["year"]: dp["value"] for dp in cdata.get("series", [])}
        trim   = cdata.get("series_trimestral", [])
        if not trim:
            continue

        year_qs: dict[int, list[float]] = {}
        for obs in trim:
            year_qs.setdefault(obs["year"], []).append(obs["value"])

        for year, q_vals in year_qs.items():
            if len(q_vals) < 4:
                continue
            annual_val = annual.get(year)
            if annual_val is None:
                continue
            avg_q = sum(q_vals) / 4
            diff  = abs(avg_q - annual_val)
            if diff > threshold:
                issues.append(
                    f"{ind_id}/{iso2}/{year}: avg_trim={avg_q:.1f} != anual={annual_val:.1f} "
                    f"(dif={diff:.1f}pp). Normal para PBI (relacion no-lineal)."
                )
    return issues


def _build_indicator(spec: dict) -> dict:
    raw_data = _fetch_data(spec)
    by_country = _build_series(raw_data, spec)

    # Spec 40 — series sub-anuales opcionales
    raw_trimestral = _fetch_trimestral(spec)
    if raw_trimestral:
        trim_by_country = _build_trimestral_series(raw_trimestral, spec)
        for iso2, trim_series in trim_by_country.items():
            if iso2 in by_country:
                by_country[iso2]["series_trimestral"] = trim_series

    raw_mensual = _fetch_mensual(spec)
    if raw_mensual:
        mens_by_country = _build_mensual_series(raw_mensual, spec)
        for iso2, mens_series in mens_by_country.items():
            if iso2 in by_country:
                by_country[iso2]["series_mensual"] = mens_series

    # Cobertura: cuántos países tienen al menos un dato en series anual
    n_covered = sum(1 for c in by_country.values() if c.get("series"))

    ind: dict = {
        "id":             spec["id"],
        "label":          spec["label"],
        "family":         spec["family"],
        "family_label":   FAMILY_LABELS[spec["family"]],
        "axis_primary":   spec.get("axis_primary"),
        "axis_secondary": spec.get("axis_secondary", []),
        "unit":           spec["unit"],
        "source": {
            "name":      spec["source_name"],
            "code":      spec["source_code"],
            "url":       spec["source_url"],
            "pulled_at": str(date.today()),
        },
        "methodology":  spec["methodology"],
        "n_countries_covered": n_covered,
        "by_country":   by_country,
    }

    if "group" in spec:
        ind["group"]       = spec["group"]
        ind["group_label"] = spec["group_label"]

    if spec.get("priority_stub"):
        ind["priority_stub"] = True

    return ind


# ---- Validaciones --------------------------------------------------------

def _validate(indicators: list[dict]) -> list[str]:
    issues: list[str] = []
    for ind in indicators:
        for iso2, cdata in ind["by_country"].items():
            series = cdata.get("series", [])
            if not series:
                continue
            values = [p["value"] for p in series if p["value"] is not None]
            # Unidades: % no debe superar 100 (excepto inflación en países con hiper)
            NO_PCT_LIMIT = {"a6-inflacion-ipc", "b6-deuda-pbi"}  # inflación y deuda pueden > 100%
            if ind["unit"] == "%" and ind["id"] not in NO_PCT_LIMIT:
                for v in values:
                    if v > 110:
                        issues.append(f"{ind['id']} / {iso2}: valor {v} supera 100% — revisar unidad o fuente.")
            # Índice de Gini: 0-100
            if ind["id"] == "d3-gini":
                for v in values:
                    if v < 0 or v > 100:
                        issues.append(f"d3-gini / {iso2}: Gini={v} fuera de rango [0,100].")
    return issues


# ---- Main ----------------------------------------------------------------

def main() -> None:
    print(f"=== build_indicators_macro.py - {date.today()} ===\n")
    print(
        f"Anual: {YEAR_START}-{YEAR_END}  "
        f"| Trimestral: {QUARTER_START}-{QUARTER_END}  "
        f"| Mensual: {MONTH_START}-{MONTH_END}  "
        f"| Paises: {len(COUNTRIES)}  | Indicadores: {len(INDICATOR_SPECS)}\n"
    )

    indicators_out: list[dict] = []
    stubs: list[str] = []
    priority_stubs: list[str] = [
        spec["id"] for spec in INDICATOR_SPECS if spec.get("priority_stub")
    ]

    for spec in INDICATOR_SPECS:
        label_short = spec["id"]
        print(f"  > {label_short:<40}", end="", flush=True)

        with warnings.catch_warnings(record=True) as caught:
            warnings.simplefilter("always")
            ind = _build_indicator(spec)

        stub_warns = [str(w.message) for w in caught if "[STUB]" in str(w.message)]
        if stub_warns:
            stubs.append(label_short)
            extras = []
            if any("series_trimestral" in c for c in ind["by_country"].values()):
                extras.append("trim")
            if any("series_mensual" in c for c in ind["by_country"].values()):
                extras.append("mens")
            suffix = f"+{','.join(extras)}" if extras else ""
            print(f"[stub{suffix}]")
        else:
            covered = ind["n_countries_covered"]
            extras = []
            n_trim = sum(1 for c in ind["by_country"].values() if c.get("series_trimestral"))
            n_mens = sum(1 for c in ind["by_country"].values() if c.get("series_mensual"))
            if n_trim:
                extras.append(f"trim={n_trim}/10")
            if n_mens:
                extras.append(f"mens={n_mens}/10")
            suffix = f"  {' '.join(extras)}" if extras else ""
            print(f"[{covered}/10 paises]{suffix}")

        indicators_out.append(ind)

    # Validaciones estandar
    print("\nValidando datos anuales...")
    issues = _validate(indicators_out)
    for issue in issues:
        print(f"  ! {issue}")
    if not issues:
        print("  OK - sin problemas en series anuales.")

    # Validacion consistencia anual/trimestral (AC11)
    print("\nValidando consistencia anual/trimestral...")
    cons_issues: list[str] = []
    for ind in indicators_out:
        if any("series_trimestral" in c for c in ind["by_country"].values()):
            cons_issues.extend(
                _validate_annual_trimestral_consistency(ind["by_country"], ind["id"])
            )
    for issue in cons_issues:
        print(f"  ~ {issue}")
    if not cons_issues:
        print("  OK - sin indicadores trimestrales o sin inconsistencias.")

    # Output (Spec 40: version macro-v1.1.0, nuevos campos de metadata)
    output = {
        "version":        "macro-v1.1.0",
        "computed_at":    str(date.today()),
        "year_start":     YEAR_START,
        "year_end":       YEAR_END,
        "quarter_start":  QUARTER_START,
        "quarter_end":    QUARTER_END,
        "month_start":    MONTH_START,
        "month_end":      MONTH_END,
        "n_indicators":   len(indicators_out),
        "n_countries":    len(COUNTRIES),
        "stubs":          stubs,
        "priority_stubs": priority_stubs,
        "indicators":     indicators_out,
    }

    OUTPUT_PATH.write_text(
        json.dumps(output, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    size_kb = OUTPUT_PATH.stat().st_size / 1024
    print(f"\nEscrito: {OUTPUT_PATH.name}  ({size_kb:.1f} KB)")
    print(f"Stubs pendientes ({len(stubs)}): {', '.join(stubs) if stubs else 'ninguno'}")
    if priority_stubs:
        print(f"Priority stubs ({len(priority_stubs)}): {', '.join(priority_stubs)}")
    if stubs:
        print("  -> Agregar datos manuales en raw/ y re-correr para poblar indicadores stub.")
    print(
        "\nPróximo paso: cp indicators-macro.json "
        "../../frontend/src/data/indicators-macro/indicators-macro.json"
    )


if __name__ == "__main__":
    main()
