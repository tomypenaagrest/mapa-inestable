from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.source import Source
from app.schemas import SourceCreate, SourceOut

router = APIRouter(prefix="/sources", tags=["sources"])


@router.get("/", response_model=list[SourceOut])
async def list_sources(country: str | None = None, db: AsyncSession = Depends(get_db)):
    stmt = select(Source).where(Source.active == True)
    if country:
        stmt = stmt.where(Source.country == country)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.post("/", response_model=SourceOut, status_code=201)
async def create_source(payload: SourceCreate, db: AsyncSession = Depends(get_db)):
    source = Source(**payload.model_dump())
    db.add(source)
    await db.flush()
    await db.refresh(source)
    return source


@router.delete("/{source_id}", status_code=204)
async def delete_source(source_id: int, db: AsyncSession = Depends(get_db)):
    source = await db.get(Source, source_id)
    if not source:
        raise HTTPException(404, "Fuente no encontrada")
    source.active = False
