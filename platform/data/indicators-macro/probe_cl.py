"""
Probe alternative data sources for Chile real wages:
1. ILO ILOSTAT catalog — look for monthly wage indicators that cover Chile
2. BCCH (Banco Central de Chile) REST API — IRR series
"""
import json
import requests

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

# ---- 1. Check OIT ILOSTAT catalog for wage indicators covering Chile ----
print("=== ILO ILOSTAT catalog check ===")
catalog_url = "https://rplumber.ilo.org/metadata/toc/indicator?lang=en&format=.csv"
try:
    r = requests.get(catalog_url, timeout=60, headers=headers)
    print(f"Catalog status: {r.status_code}")
    lines = r.text.splitlines()
    print(f"Total indicators: {len(lines)}")
    # Find wage/earnings related indicators
    wage_lines = [l for l in lines if any(kw in l.lower() for kw in ["earn", "wage", "remuner", "salary"])]
    print(f"Wage-related: {len(wage_lines)}")
    for l in wage_lines[:30]:
        print(" ", l[:120])
except Exception as e:
    print(f"Catalog error: {e}")

# ---- 2. Try BCCH API ----
print("\n=== BCCH (Banco Central de Chile) ===")
# BCCH has a public JSON API for time series
bcch_urls = [
    "https://si3.bcentral.cl/Bdemovil/BDE/Series/GetSeries?timeseries=F032.IRI.IRM.910.T.M&function=GetSeries",
    "https://si3.bcentral.cl/Bdemovil/BDE/Series/GetSeries?timeseries=F032.IRI.IRM.10.T.M&function=GetSeries",
    "https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx?timeseries=F032.IRI.IRM.910.T.M&function=GetSeries&startDate=2021-01&endDate=2024-12&language=es-CL&type=json",
]
for url in bcch_urls:
    try:
        r = requests.get(url, timeout=20, headers=headers)
        print(f"  [{r.status_code}] {url[:80]}")
        if r.status_code == 200:
            text = r.text[:300]
            print("   ", text)
    except Exception as e:
        print(f"  ERROR {url[:60]}: {e}")
