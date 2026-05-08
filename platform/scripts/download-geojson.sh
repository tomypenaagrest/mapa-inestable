#!/bin/bash
# Descarga el GeoJSON de Sudamérica (Natural Earth 1:50m, dominio público)
# y lo coloca en frontend/public/geo/south-america.json

set -e

DEST="$(dirname "$0")/../frontend/public/geo/south-america.json"

echo "Descargando GeoJSON de Sudamérica..."

curl -sL "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson" \
  | python3 -c "
import json, sys
world = json.load(sys.stdin)
sa_countries = {'Argentina','Brazil','Chile','Colombia','Bolivia','Peru','Uruguay','Paraguay','Ecuador','Venezuela','Guyana','Suriname','French Guiana','Trinidad and Tobago'}
features = [f for f in world['features'] if f['properties'].get('name') in sa_countries]
print(json.dumps({'type':'FeatureCollection','features':features}))
" > "$DEST"

echo "Guardado en $DEST"
