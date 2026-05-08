from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from app.database import get_db
from app.models.event import Event, EventAxis, Axis
from app.schemas import EventCreate, EventOut, EventAxisCreate

router = APIRouter(prefix="/events", tags=["events"])


@router.get("/", response_model=list[EventOut])
async def list_events(
    country: str | None = None,
    week: int | None = None,
    year: int | None = None,
    relevant: bool | None = None,
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Event)
    filters = []
    if country:
        filters.append(Event.country == country)
    if week:
        filters.append(Event.week == week)
    if year:
        filters.append(Event.year == year)
    if relevant is not None:
        filters.append(Event.relevant == relevant)
    if filters:
        stmt = stmt.where(and_(*filters))
    stmt = stmt.order_by(Event.published_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()


@router.post("/", response_model=EventOut, status_code=201)
async def create_event(payload: EventCreate, db: AsyncSession = Depends(get_db)):
    event = Event(**payload.model_dump())
    db.add(event)
    await db.flush()
    await db.refresh(event)
    return event


@router.get("/{event_id}", response_model=EventOut)
async def get_event(event_id: int, db: AsyncSession = Depends(get_db)):
    event = await db.get(Event, event_id)
    if not event:
        raise HTTPException(404, "Evento no encontrado")
    return event


@router.patch("/{event_id}/relevant", response_model=EventOut)
async def mark_relevant(event_id: int, relevant: bool, db: AsyncSession = Depends(get_db)):
    event = await db.get(Event, event_id)
    if not event:
        raise HTTPException(404, "Evento no encontrado")
    event.relevant = relevant
    return event


@router.post("/{event_id}/axes", response_model=EventOut)
async def set_axes(event_id: int, axes: list[EventAxisCreate], db: AsyncSession = Depends(get_db)):
    event = await db.get(Event, event_id)
    if not event:
        raise HTTPException(404, "Evento no encontrado")
    # remove existing
    for ax in event.axes:
        await db.delete(ax)
    await db.flush()
    for ax in axes:
        db.add(EventAxis(event_id=event_id, axis=ax.axis, is_primary=ax.is_primary))
    await db.flush()
    await db.refresh(event)
    return event
