import feedparser
import httpx
from datetime import datetime, timezone
from zoneinfo import ZoneInfo
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlalchemy import select
from app.database import AsyncSessionLocal
from app.models.source import Source
from app.models.event import Event

scheduler = AsyncIOScheduler()


def _parse_date(entry) -> datetime | None:
    if hasattr(entry, "published_parsed") and entry.published_parsed:
        return datetime(*entry.published_parsed[:6], tzinfo=timezone.utc)
    return None


def _get_week_year(dt: datetime | None):
    if dt is None:
        dt = datetime.now(timezone.utc)
    iso = dt.isocalendar()
    return iso.week, iso.year


async def fetch_feed(source: Source) -> list[dict]:
    if not source.rss_url:
        return []
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.get(source.rss_url, follow_redirects=True)
            response.raise_for_status()
        feed = feedparser.parse(response.text)
        entries = []
        for entry in feed.entries[:20]:
            published_at = _parse_date(entry)
            week, year = _get_week_year(published_at)
            entries.append({
                "country": source.country,
                "title": entry.get("title", "")[:500],
                "url": entry.get("link", "")[:1000],
                "medium": source.name,
                "author": entry.get("author", None),
                "published_at": published_at,
                "week": week,
                "year": year,
                "summary": entry.get("summary", "")[:2000] if entry.get("summary") else None,
                "source_id": source.id,
            })
        return entries
    except Exception as e:
        print(f"[RSS] Error fetching {source.rss_url}: {e}")
        return []


async def ingest_all_sources():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Source).where(Source.active == True))
        sources = result.scalars().all()
        new_count = 0
        for source in sources:
            entries = await fetch_feed(source)
            for entry_data in entries:
                existing = await db.execute(
                    select(Event).where(Event.url == entry_data["url"])
                )
                if existing.scalar_one_or_none():
                    continue
                event = Event(**entry_data)
                db.add(event)
                new_count += 1
        await db.commit()
        print(f"[RSS] Ingested {new_count} new events from {len(sources)} sources")


def start_scheduler():
    scheduler.add_job(
        ingest_all_sources,
        CronTrigger(day_of_week="mon", hour=6, minute=0),
        id="weekly_rss_ingest",
        replace_existing=True,
    )
    scheduler.start()
    print("[Scheduler] Weekly RSS job registered (Monday 06:00 UTC)")


def stop_scheduler():
    if scheduler.running:
        scheduler.shutdown()
