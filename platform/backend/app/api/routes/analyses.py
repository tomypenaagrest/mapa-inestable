from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from app.database import get_db
from app.models.analysis import Analysis
from app.schemas import AnalysisCreate, AnalysisOut, AnalysisUpdate

router = APIRouter(prefix="/analyses", tags=["analyses"])


@router.get("/", response_model=list[AnalysisOut])
async def list_analyses(
    country: str | None = None,
    week: int | None = None,
    year: int | None = None,
    published: bool | None = None,
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Analysis)
    filters = []
    if country:
        filters.append(Analysis.country == country)
    if week:
        filters.append(Analysis.week == week)
    if year:
        filters.append(Analysis.year == year)
    if published is not None:
        filters.append(Analysis.published == published)
    if filters:
        stmt = stmt.where(and_(*filters))
    stmt = stmt.order_by(Analysis.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()


@router.post("/", response_model=AnalysisOut, status_code=201)
async def create_analysis(payload: AnalysisCreate, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(
        select(Analysis).where(Analysis.event_id == payload.event_id)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(409, "Ya existe un análisis para este evento")
    analysis = Analysis(**payload.model_dump())
    db.add(analysis)
    await db.flush()
    await db.refresh(analysis)
    return analysis


@router.get("/{analysis_id}", response_model=AnalysisOut)
async def get_analysis(analysis_id: int, db: AsyncSession = Depends(get_db)):
    analysis = await db.get(Analysis, analysis_id)
    if not analysis:
        raise HTTPException(404, "Análisis no encontrado")
    return analysis


@router.patch("/{analysis_id}", response_model=AnalysisOut)
async def update_analysis(
    analysis_id: int, payload: AnalysisUpdate, db: AsyncSession = Depends(get_db)
):
    analysis = await db.get(Analysis, analysis_id)
    if not analysis:
        raise HTTPException(404, "Análisis no encontrado")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(analysis, field, value)
    return analysis


@router.delete("/{analysis_id}", status_code=204)
async def delete_analysis(analysis_id: int, db: AsyncSession = Depends(get_db)):
    analysis = await db.get(Analysis, analysis_id)
    if not analysis:
        raise HTTPException(404, "Análisis no encontrado")
    await db.delete(analysis)
