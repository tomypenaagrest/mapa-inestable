from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import engine, Base
from app.config import settings
from app.api.routes import events, analyses, dispatches, sources, map as map_router, rss
from app.services.rss import start_scheduler, stop_scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    start_scheduler()
    yield
    stop_scheduler()
    await engine.dispose()


app = FastAPI(
    title="Mapa Inestable API",
    description="Plataforma de análisis político-cultural — Sudamérica",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sources.router, prefix="/api")
app.include_router(events.router, prefix="/api")
app.include_router(analyses.router, prefix="/api")
app.include_router(dispatches.router, prefix="/api")
app.include_router(map_router.router, prefix="/api")
app.include_router(rss.router, prefix="/api")


@app.get("/")
async def root():
    return {"status": "ok", "project": "Mapa Inestable"}
