from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone
from app.database import get_db
from app.models.dispatch import Dispatch, DispatchAnalysis
from app.models.analysis import Analysis
from app.schemas import DispatchCreate, DispatchOut, DispatchUpdate

router = APIRouter(prefix="/dispatches", tags=["dispatches"])


@router.get("/", response_model=list[DispatchOut])
async def list_dispatches(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Dispatch).order_by(Dispatch.year.desc(), Dispatch.week.desc()))
    return result.scalars().all()


@router.post("/", response_model=DispatchOut, status_code=201)
async def create_dispatch(payload: DispatchCreate, db: AsyncSession = Depends(get_db)):
    analysis_ids = payload.analysis_ids
    data = payload.model_dump(exclude={"analysis_ids"})
    dispatch = Dispatch(**data)
    db.add(dispatch)
    await db.flush()

    for i, aid in enumerate(analysis_ids):
        analysis = await db.get(Analysis, aid)
        if not analysis:
            raise HTTPException(404, f"Análisis {aid} no encontrado")
        db.add(DispatchAnalysis(dispatch_id=dispatch.id, analysis_id=aid, order=i))

    await db.flush()
    await db.refresh(dispatch)
    return dispatch


@router.get("/{dispatch_id}", response_model=DispatchOut)
async def get_dispatch(dispatch_id: int, db: AsyncSession = Depends(get_db)):
    dispatch = await db.get(Dispatch, dispatch_id)
    if not dispatch:
        raise HTTPException(404, "Despacho no encontrado")
    return dispatch


@router.patch("/{dispatch_id}", response_model=DispatchOut)
async def update_dispatch(
    dispatch_id: int, payload: DispatchUpdate, db: AsyncSession = Depends(get_db)
):
    dispatch = await db.get(Dispatch, dispatch_id)
    if not dispatch:
        raise HTTPException(404, "Despacho no encontrado")

    data = payload.model_dump(exclude_none=True, exclude={"analysis_ids"})
    for field, value in data.items():
        setattr(dispatch, field, value)

    if payload.published and not dispatch.published_at:
        dispatch.published_at = datetime.now(timezone.utc)

    if payload.analysis_ids is not None:
        result = await db.execute(
            select(DispatchAnalysis).where(DispatchAnalysis.dispatch_id == dispatch_id)
        )
        for link in result.scalars().all():
            await db.delete(link)
        await db.flush()
        for i, aid in enumerate(payload.analysis_ids):
            db.add(DispatchAnalysis(dispatch_id=dispatch_id, analysis_id=aid, order=i))

    await db.flush()
    await db.refresh(dispatch)
    return dispatch
