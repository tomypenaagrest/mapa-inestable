"""Find ILO monthly earnings indicators that cover Chile."""
import requests, json

headers = {"User-Agent": "Mozilla/5.0"}

# Get ILO catalog and filter for monthly earnings
catalog_url = "https://rplumber.ilo.org/metadata/toc/indicator?lang=en&format=.csv"
r = requests.get(catalog_url, timeout=60, headers=headers)
lines = r.text.splitlines()

# Find monthly earnings indicators (EAR_*_M)
ear_monthly = [l for l in lines if l.startswith('"EAR_') and '_M"' in l]
print(f"Monthly EAR indicators: {len(ear_monthly)}")
for l in ear_monthly:
    print(" ", l[:120])

# Now test each EAR monthly indicator to see if Chile has data
print("\n=== Testing EAR monthly indicators for Chile (CHL) ===")
for line in ear_monthly[:10]:
    ind_id = line.split(",")[0].strip('"')
    url = f"https://rplumber.ilo.org/data/indicator/?id={ind_id}&lang=en&format=.json"
    try:
        r = requests.get(url, timeout=30, headers=headers)
        if r.status_code == 200:
            try:
                data = r.json()
                if isinstance(data, list):
                    chl_data = [obs for obs in data if obs.get("ref_area") == "CHL"]
                    print(f"  {ind_id}: {len(data)} total obs, {len(chl_data)} for CHL")
                else:
                    print(f"  {ind_id}: unexpected response type: {type(data)}")
            except Exception as e:
                print(f"  {ind_id}: parse error: {e}")
        else:
            print(f"  {ind_id}: status {r.status_code}")
    except Exception as e:
        print(f"  {ind_id}: request error: {e}")
