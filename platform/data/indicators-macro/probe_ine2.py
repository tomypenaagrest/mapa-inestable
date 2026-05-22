"""Probe INE Chile IRR page for endpoints and structure."""
import re
import requests

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
r = requests.get(
    "https://www.ine.gob.cl/estadisticas/economia/indices-de-remuneracion-y-costo-de-la-mano-de-obra",
    timeout=30,
    headers=headers,
)
text = r.text
print(f"Status: {r.status_code}, Len: {len(text)}")

# Find all file paths
file_pat = re.compile(r'["\'](/[^"\']+\.(?:xlsx|xls|csv|zip|js|json))["\']')
files = file_pat.findall(text)
print(f"\nFile paths ({len(files)}):")
for f in files[:30]:
    print(" ", f)

# Find any API or data endpoints
api_pat = re.compile(r'["\'](/[^"\']*(?:api|bbdd|data|series|estadistica)[^"\']*)["\']', re.IGNORECASE)
apis = api_pat.findall(text)
print(f"\nAPI-like paths ({len(apis)}):")
for a in apis[:15]:
    print(" ", a)

# Count relevant keywords
for kw in ["IRR", "remuneraci", "indice-real", "bbdd", "csv", "xlsx", "download"]:
    cnt = text.lower().count(kw.lower())
    if cnt:
        print(f"  {kw!r}: {cnt} occurrences")
