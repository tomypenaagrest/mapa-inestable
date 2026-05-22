"""Probe INE Chile IRR page to find actual download URL."""
import re
import requests

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

url = "https://www.ine.gob.cl/estadisticas/economia/indices-de-remuneracion-y-costo-de-la-mano-de-obra/indice-real-de-remuneraciones"
r = requests.get(url, timeout=30, headers=headers)
text = r.text
print(f"Status: {r.status_code}, length: {len(text)}")

# Search for xlsx / csv links
pattern = re.compile(r'["\']([^"\']*\.(xlsx|xls|csv|zip))["\']', re.IGNORECASE)
matches = pattern.findall(text)
print("\nFile links:")
for m in matches[:30]:
    print(" ", m[0])

# Search for ine bbdd / docs links
pattern2 = re.compile(r'(https?://[^\s"\'<>]*(bbdd|docs|default-source)[^\s"\'<>]*)', re.IGNORECASE)
matches2 = pattern2.findall(text)
print("\nDocs/bbdd links:")
for m in matches2[:20]:
    print(" ", m[0])

print("\nFirst 500 chars of page:")
print(text[:500])
