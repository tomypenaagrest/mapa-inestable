"""
build_indicators.py — Computa los 12 indicadores curados de Latinobarómetro 2024
para los 17 países, ponderados por el peso muestral oficial (WT).

Producto:
    indicators.json — consumido por el frontend de Mapa Inestable.

Uso:
    python build_indicators.py

Fuente:
    Latinobarometro_2024_Csv_esp_v20250817.csv (microdatos, ~19,200 entrevistas)
    Latinobarometro_2024_Cuestionario_esp.pdf  (mapeo de variables)

Spec:
    platform/specs/E001-B-carga-datos.md
    platform/specs/E001-A-ranking-indicadores.md
"""

from __future__ import annotations
import json
from datetime import date
from pathlib import Path

import pandas as pd
import numpy as np


# ===== CONFIG =====================================================

DATA_DIR = Path(__file__).parent
CSV_PATH = DATA_DIR / "raw" / "Latinobarometro_2024_Csv_esp_v20250817.csv"
OUTPUT_PATH = DATA_DIR / "indicators.json"

# IDENPA usa códigos ISO 3166-1 numeric. Mapeo a slug ISO 3166-1 alpha-2.
COUNTRY_MAP = {
    32: ("AR", "Argentina"),
    68: ("BO", "Bolivia"),
    76: ("BR", "Brasil"),
    152: ("CL", "Chile"),
    170: ("CO", "Colombia"),
    188: ("CR", "Costa Rica"),
    214: ("DO", "República Dominicana"),
    218: ("EC", "Ecuador"),
    222: ("SV", "El Salvador"),
    320: ("GT", "Guatemala"),
    340: ("HN", "Honduras"),
    484: ("MX", "México"),
    591: ("PA", "Panamá"),
    600: ("PY", "Paraguay"),
    604: ("PE", "Perú"),
    858: ("UY", "Uruguay"),
    862: ("VE", "Venezuela"),
}

# Códigos típicos de NS/NR — tratados como missing en todos los indicadores.
MISSING_DEFAULT = {0, 8, 98, 99}


# ===== ESPECIFICACIÓN DE LOS 12 INDICADORES =======================

INDICATORS = [
    {
        "id": "apoyo-democracia",
        "label": "Apoyo a la democracia",
        "axis": "desrepresentacion",
        "section_pdf": "4.1",
        "page_pdf": 30,
        "var": "P11STGBS",
        "kind": "pct",
        "target": [1],
        "missing": {0, 8},
        "question": "La democracia es preferible a cualquier otra forma de gobierno",
        "compute": "% valor = 1 (preferible), ponderado por WT",
        "unit": "%",
    },
    {
        "id": "no-representado-parlamento",
        "label": "No se siente representado en el parlamento",
        "axis": "desrepresentacion",
        "section_pdf": "4.11.8",
        "page_pdf": 78,
        "var": "P25ST",
        "kind": "pct",
        "target": [2],
        "missing": {0, 8},
        "question": "¿Usted se siente políticamente representado en el parlamento/congreso?",
        "compute": "% valor = 2 (No), ponderado por WT",
        "unit": "%",
    },
    {
        "id": "sociedad-cambio-radical",
        "label": "La sociedad debe cambiarse radicalmente",
        "axis": "desrepresentacion",
        "section_pdf": "III",
        "page_pdf": 28,
        "var": "P4ST",
        "kind": "pct",
        "target": [4],
        "missing": {0, 8},
        "question": "¿Con cuál de las siguientes frases sobre la sociedad está más de acuerdo?",
        "compute": "% valor = 4 (debe cambiarse radicalmente), ponderado por WT",
        "unit": "%",
    },
    {
        "id": "confianza-partidos",
        "label": "Confianza en los partidos políticos",
        "axis": "erosion-mediaciones",
        "section_pdf": "4.9.2.6",
        "page_pdf": 63,
        "var": "P14ST.G",
        "kind": "pct",
        "target": [1, 2],
        "missing": {0, 8},
        "question": "¿Cuánta confianza tiene Ud. en los partidos políticos?",
        "compute": "% valor ∈ {1, 2} (mucha + algo), ponderado por WT",
        "unit": "%",
    },
    {
        "id": "confianza-congreso",
        "label": "Confianza en el congreso/parlamento",
        "axis": "erosion-mediaciones",
        "section_pdf": "4.9.2.5",
        "page_pdf": 62,
        "var": "P14ST.D",
        "kind": "pct",
        "target": [1, 2],
        "missing": {0, 8},
        "question": "¿Cuánta confianza tiene Ud. en el Congreso/Parlamento?",
        "compute": "% valor ∈ {1, 2} (mucha + algo), ponderado por WT",
        "unit": "%",
    },
    {
        "id": "confianza-judicial",
        "label": "Confianza en el poder judicial",
        "axis": "erosion-mediaciones",
        "section_pdf": "4.9.2.4",
        "page_pdf": 61,
        "var": "P14ST.F",
        "kind": "pct",
        "target": [1, 2],
        "missing": {0, 8},
        "question": "¿Cuánta confianza tiene Ud. en el Poder Judicial?",
        "compute": "% valor ∈ {1, 2} (mucha + algo), ponderado por WT",
        "unit": "%",
    },
    {
        "id": "info-falsa-redes",
        "label": "Información falsa en redes sociales",
        "axis": "desorientacion-epistemologica",
        "section_pdf": "4.12.3",
        "page_pdf": 83,
        "var": "P47ST.D",
        "kind": "pct",
        "target": [1, 2],
        "missing": {0, 8},
        "question": "¿Cuánta información falsa hay en las redes sociales?",
        "compute": "% valor ∈ {1, 2} (mucha + alguna), ponderado por WT",
        "unit": "%",
    },
    {
        "id": "elecciones-fraudulentas",
        "label": "Las elecciones son fraudulentas",
        "axis": "desorientacion-epistemologica",
        "section_pdf": "4.11.7",
        "page_pdf": 76,
        "var": "P27ST",
        "kind": "pct",
        "target": [2],
        "missing": {0, 8},
        "question": "¿Las elecciones en su país son limpias o son fraudulentas?",
        "compute": "% valor = 2 (fraudulentas), ponderado por WT",
        "unit": "%",
    },
    {
        "id": "sin-religion",
        "label": "Sin religión",
        "axis": "deculturacion",
        "section_pdf": "7.1",
        "page_pdf": 114,
        "var": "S1",
        "kind": "pct",
        "target": [97],
        "missing": {0, 98},
        "question": "¿Cuál es su religión?",
        "compute": "% valor = 97 (Ninguna), ponderado por WT",
        "unit": "%",
    },
    {
        "id": "izquierda-derecha",
        "label": "Autoposicionamiento izquierda-derecha",
        "axis": "deculturacion",
        "section_pdf": "4.11.1",
        "page_pdf": 70,
        "var": "P16ST",
        "kind": "mean",
        "valid_range": (0, 10),
        "missing": {97, 98, 99},
        "question": "En una escala donde 00 es la izquierda y 10 la derecha, ¿dónde se ubicaría Ud.?",
        "compute": "promedio ponderado escala 0-10, excluyendo NS/NR",
        "unit": "escala 0-10",
    },
    {
        "id": "confianza-redes",
        "label": "Confianza en las redes sociales",
        "axis": "atencion",
        "section_pdf": "4.9.4.3",
        "page_pdf": 67,
        "var": "P14ST.L",
        "kind": "pct",
        "target": [1, 2],
        "missing": {0, 8},
        "question": "¿Cuánta confianza tiene Ud. en las redes sociales?",
        "compute": "% valor ∈ {1, 2} (mucha + algo), ponderado por WT",
        "unit": "%",
    },
    {
        "id": "aprobacion-gobierno",
        "label": "Aprobación de gobierno",
        "axis": "contexto",
        "section_pdf": "4.10",
        "page_pdf": 69,
        "var": "P15STGBS",
        "kind": "pct",
        "target": [1],
        "missing": {0},
        "question": "¿Ud. aprueba o no aprueba la gestión del gobierno?",
        "compute": "% valor = 1 (aprueba), ponderado por WT",
        "unit": "%",
    },
]


# ===== FUNCIONES DE CÓMPUTO =======================================

def pct_weighted(series: pd.Series, weights: pd.Series, target: list[int], missing: set[int]) -> tuple[float, int]:
    """
    Devuelve (% donde valor in target, ponderado por WT, sobre el universo no-missing,
            cantidad de respuestas válidas)
    """
    valid = ~series.isin(missing) & series.notna()
    s = series[valid]
    w = weights[valid]
    if w.sum() == 0:
        return (np.nan, 0)
    in_target = s.isin(target)
    pct = (w[in_target].sum() / w.sum()) * 100
    return (round(float(pct), 1), int(valid.sum()))


def mean_weighted(series: pd.Series, weights: pd.Series, valid_range: tuple[int, int], missing: set[int]) -> tuple[float, int]:
    """
    Promedio ponderado dentro del rango válido, excluyendo missing.
    """
    valid = ~series.isin(missing) & series.notna() & series.between(valid_range[0], valid_range[1])
    s = series[valid]
    w = weights[valid]
    if w.sum() == 0:
        return (np.nan, 0)
    mean = (s * w).sum() / w.sum()
    return (round(float(mean), 2), int(valid.sum()))


def compute_indicator(df: pd.DataFrame, spec: dict) -> dict:
    """
    Aplica el cómputo del indicador a cada país y al total regional.
    """
    var = spec["var"]
    kind = spec["kind"]
    weights_col = "WT"

    if var not in df.columns:
        raise KeyError(f"Variable {var!r} no encontrada en el CSV")

    # Cómputo por país
    by_country: dict[str, dict] = {}
    for code, (slug, name) in COUNTRY_MAP.items():
        sub = df[df["IDENPA"] == code]
        if kind == "pct":
            value, n = pct_weighted(sub[var], sub[weights_col], spec["target"], spec["missing"])
        elif kind == "mean":
            value, n = mean_weighted(sub[var], sub[weights_col], spec["valid_range"], spec["missing"])
        else:
            raise ValueError(f"kind {kind!r} no soportado")
        by_country[slug] = {"name": name, "value": value, "n": n}

    # Ranking (descendente por valor; en mean también descendente — más a la derecha más alto)
    sorted_countries = sorted(
        by_country.items(),
        key=lambda kv: (kv[1]["value"] if kv[1]["value"] == kv[1]["value"] else -1),
        reverse=True,
    )
    for rank, (slug, _) in enumerate(sorted_countries, start=1):
        by_country[slug]["rank"] = rank

    # Cómputo regional (todo el dataset, ponderado)
    if kind == "pct":
        regional, n_total = pct_weighted(df[var], df[weights_col], spec["target"], spec["missing"])
    else:
        regional, n_total = mean_weighted(df[var], df[weights_col], spec["valid_range"], spec["missing"])

    return {
        "id": spec["id"],
        "label": spec["label"],
        "axis": spec["axis"],
        "section_pdf": spec["section_pdf"],
        "page_pdf": spec["page_pdf"],
        "questionnaire_var": spec["var"],
        "question_text": spec["question"],
        "compute": spec["compute"],
        "unit": spec["unit"],
        "regional_value": regional,
        "regional_n": n_total,
        "by_country": by_country,
    }


# ===== MAIN ========================================================

def main() -> None:
    print(f"Loading {CSV_PATH.name}...")
    df = pd.read_csv(CSV_PATH, sep=";", encoding="utf-8-sig", low_memory=False)
    print(f"  {len(df):,} rows · {len(df.columns)} cols")
    print(f"  Países (IDENPA): {sorted(df['IDENPA'].unique().astype(int).tolist())}")
    print(f"  Total WT: {df['WT'].sum():.1f}\n")

    # Sanity check: las 12 variables deben existir
    missing_vars = [s["var"] for s in INDICATORS if s["var"] not in df.columns]
    if missing_vars:
        raise KeyError(f"Variables faltantes en CSV: {missing_vars}")

    # Cómputo
    results = []
    print("Computing indicators:")
    for spec in INDICATORS:
        ind = compute_indicator(df, spec)
        results.append(ind)
        print(f"  {spec['id']:<32} reg={ind['regional_value']:>6} ({ind['unit']})  n={ind['regional_n']:,}")

    output = {
        "version": "lb2024-v20250817",
        "computed_at": str(date.today()),
        "n_total": int(len(df)),
        "n_countries": len(COUNTRY_MAP),
        "indicators": results,
    }

    OUTPUT_PATH.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nWrote {OUTPUT_PATH.name} · {OUTPUT_PATH.stat().st_size / 1024:.1f} KB")


if __name__ == "__main__":
    main()
