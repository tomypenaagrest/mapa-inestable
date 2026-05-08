from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models.event import Event, EventAxis, Axis
from app.models.analysis import Analysis
from app.schemas import CountrySummary, AxisActivity

router = APIRouter(prefix="/map", tags=["map"])

COUNTRIES = ["AR", "BR", "CL", "CO", "BO", "PE", "UY", "PY", "EC", "VE"]


@router.get("/week/{year}/{week}", response_model=list[CountrySummary])
async def get_week_summary(year: int, week: int, db: AsyncSession = Depends(get_db)):
    summaries = []

    for country in COUNTRIES:
        event_count_result = await db.execute(
            select(func.count(Event.id)).where(
                Event.country == country,
                Event.week == week,
                Event.year == year,
            )
        )
        event_count = event_count_result.scalar() or 0

        analysis_count_result = await db.execute(
            select(func.count(Analysis.id)).where(
                Analysis.country == country,
                Analysis.week == week,
                Analysis.year == year,
            )
        )
        analysis_count = analysis_count_result.scalar() or 0

        axes_result = await db.execute(
            select(EventAxis.axis, func.count(EventAxis.id))
            .join(Event, EventAxis.event_id == Event.id)
            .where(
                Event.country == country,
                Event.week == week,
                Event.year == year,
            )
            .group_by(EventAxis.axis)
            .order_by(func.count(EventAxis.id).desc())
        )
        active_axes = [
            AxisActivity(axis=row[0], count=row[1]) for row in axes_result.all()
        ]

        summaries.append(
            CountrySummary(
                country=country,
                week=week,
                year=year,
                event_count=event_count,
                analysis_count=analysis_count,
                active_axes=active_axes,
            )
        )

    return summaries
