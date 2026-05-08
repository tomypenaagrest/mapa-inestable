# Mapa Inestable — Guía de arranque

## Requisitos

- Python 3.12+
- Node.js 20+
- PostgreSQL 16 (o Docker)

---

## Opción A: Docker (recomendado)

```bash
cd platform

# 1. Descargar GeoJSON del mapa
bash scripts/download-geojson.sh

# 2. Levantar todo
docker-compose up --build

# 3. Seed de fuentes RSS (primera vez)
docker-compose exec backend python -m app.services.seed
```

Acceder en: http://localhost:3000

---

## Opción B: Manual

### Backend

```bash
cd platform/backend

# Crear entorno virtual
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar base de datos
cp .env.example .env
# Editar .env con tu DATABASE_URL

# Crear tablas + seed
python -m app.services.seed

# Levantar API
uvicorn app.main:app --reload
# API disponible en http://localhost:8000
# Docs en http://localhost:8000/docs
```

### Frontend

```bash
cd platform/frontend

# Instalar dependencias
npm install

# Descargar GeoJSON
bash ../scripts/download-geojson.sh

# Levantar
npm run dev
# Disponible en http://localhost:3000
```

---

## Flujo semanal

```
1. INGESTA      →  /ingesta  —  ingerir RSS o agregar evento manual
2. CLASIFICAR   →  /ingesta  —  marcar relevante + asignar ejes
3. ANALIZAR     →  /analisis —  escribir los 4 pasos por evento
4. DESPACHO     →  /despachos — armar la publicación semanal
5. PUBLICAR     →  marcar como publicado → copiar a Substack
```

---

## API

Documentación interactiva: http://localhost:8000/docs

Endpoints principales:
- `GET /api/map/week/{year}/{week}` — resumen del mapa
- `GET/POST /api/events` — eventos de la semana
- `POST /api/events/{id}/axes` — clasificar por eje
- `GET/POST /api/analyses` — análisis
- `GET/POST /api/dispatches` — despachos
- `POST /api/rss/ingest` — disparar ingesta RSS manual

---

## GeoJSON

El mapa requiere `frontend/public/geo/south-america.json`.
Ejecutar `bash scripts/download-geojson.sh` para descargarlo.
Fuente: Natural Earth (dominio público).
