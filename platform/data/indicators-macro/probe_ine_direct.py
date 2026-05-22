"""Try direct download URLs for INE Chile IRR XLSX file."""
import requests

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/octet-stream, */*",
    "Referer": "https://www.ine.gob.cl/",
}

# INE Chile uses Sitefinity CMS — files stored in docs folder with predictable patterns
base = "https://www.ine.gob.cl/docs/default-source/remuneraciones-y-costo-de-la-mano-de-obra/bbdd"

candidates = [
    f"{base}/irr.xlsx",
    f"{base}/irr-base-2016-100.xlsx",
    f"{base}/irr-base-2016-100-serie.xlsx",
    f"{base}/irr-mensual.xlsx",
    f"{base}/irr-base2016.xlsx",
    f"{base}/irr-general.xlsx",
    f"{base}/indice-real-de-remuneraciones.xlsx",
    f"{base}/irr-base-2016-100-serie-mensual.xlsx",
    # Try CSV variants
    f"{base}/irr.csv",
    f"{base}/irr-base-2016-100.csv",
    # Try different subpaths
    "https://www.ine.gob.cl/docs/default-source/remuneraciones-y-costo-de-la-mano-de-obra/irr.xlsx",
    "https://www.ine.gob.cl/docs/default-source/remuneraciones-y-costo-de-la-mano-de-obra/irr-base-2016-100.xlsx",
    # Different folder name
    "https://www.ine.gob.cl/docs/default-source/indices-de-remuneracion/bbdd/irr.xlsx",
    "https://www.ine.gob.cl/docs/default-source/mercado-laboral/remuneraciones/bbdd/irr.xlsx",
]

print("Testing direct download URLs:")
for url in candidates:
    try:
        r = requests.head(url, timeout=10, headers=headers, allow_redirects=True)
        ct = r.headers.get("content-type", "")
        cl = r.headers.get("content-length", "?")
        print(f"  [{r.status_code}] {url.split('/')[-1]:40s} | {ct[:50]} | {cl} bytes")
        if r.status_code == 200 and ("excel" in ct or "spreadsheet" in ct or "octet" in ct or "zip" in ct):
            print(f"    *** MATCH FOUND: {url}")
    except Exception as e:
        print(f"  [ERR] {url.split('/')[-1]:40s}: {e}")
