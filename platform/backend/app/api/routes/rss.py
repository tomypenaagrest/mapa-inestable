from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.source import Source
from app.services.rss import ingest_all_sources, fetch_feed

router = APIRouter(prefix="/rss", tags=["rss"])


@router.post("/ingest", status_code=202)
async def trigger_ingest(background_tasks: BackgroundTasks):
    """Dispara la ingesta de todos los feeds RSS en segundo plano."""
    background_tasks.add_task(ingest_all_sources)
    return {"status": "ingesta iniciada"}


@router.post("/ingest/{source_id}", status_code=202)
async def trigger_ingest_source(
    source_id: int,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    source = await db.get(Source, source_id)
    if not source:
        from fastapi import HTTPException
        raise HTTPException(404, "Fuente no encontrada")
    background_tasks.add_task(fetch_feed, source)
    return {"status": f"ingesta de {source.name} iniciada"}
