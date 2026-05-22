"""
Probe Banco Central de Chile (BCCH) API for IRR (Índice Real de Remuneraciones).
BCCH REST WS: https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx
"""
import json
import requests

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
BASE = "https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx"

# Try GetSeriesHeader to list series by keyword
search_url = f"{BASE}?function=GetSeriesHeader&query=remuneracion&language=es-CL&type=json"
print("=== BCCH GetSeriesHeader search ===")
try:
    r = requests.get(search_url, timeout=20, headers=headers)
    print(f"Status: {r.status_code}")
    print(r.text[:800])
except Exception as e:
    print(f"Error: {e}")

# Try SearchSeries
print("\n=== BCCH SearchSeries ===")
search2 = f"{BASE}?function=SearchSeries&language=es-CL&searchby=seriesName&query=IRR&type=json"
try:
    r = requests.get(search2, timeout=20, headers=headers)
    print(f"Status: {r.status_code}")
    print(r.text[:800])
except Exception as e:
    print(f"Error: {e}")

# Try GetSeries with known series codes for IRR
print("\n=== BCCH GetSeries for IRR series codes ===")
# Try different possible codes
test_codes = [
    "F032.IRI.IRM.910.T.M",   # Standard pattern
    "F032.IRM.910.T.M",
    "F032.IRI.910.T.M",
    "F032.IRR.910.T.M",
]
for code in test_codes:
    url = f"{BASE}?timeseries={code}&function=GetSeries&startDate=2021-01&endDate=2021-03&language=es-CL&type=json"
    try:
        r = requests.get(url, timeout=15, headers=headers)
        print(f"  {code}: {r.status_code} | {r.text[:100].replace(chr(10),' ')}")
    except Exception as e:
        print(f"  {code}: error {e}")
