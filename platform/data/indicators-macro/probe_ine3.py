"""Find the xlsx/csv context in the INE Chile page."""
import re
import requests

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
r = requests.get(
    "https://www.ine.gob.cl/estadisticas/economia/indices-de-remuneracion-y-costo-de-la-mano-de-obra",
    timeout=30,
    headers=headers,
)
text = r.text

# Find exact position of xlsx and csv mentions
for kw in ["xlsx", "csv", "irr", "remuneraci"]:
    idx = text.lower().find(kw.lower())
    if idx >= 0:
        start = max(0, idx - 200)
        end = min(len(text), idx + 300)
        print(f"\n=== '{kw}' at {idx} ===")
        print(text[start:end])
