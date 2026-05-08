from sqlalchemy import String, Integer, ForeignKey, DateTime, Boolean, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.database import Base
import enum


class Axis(str, enum.Enum):
    deculturacion = "deculturacion"
    erosion_mediaciones = "erosion_mediaciones"
    desrepresentacion = "desrepresentacion"
    estetizacion = "estetizacion"
    desorientacion_epistemologica = "desorientacion_epistemologica"
    atencion = "atencion"


class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(primary_key=True)
    country: Mapped[str] = mapped_column(String(2))
    title: Mapped[str] = mapped_column(String(500))
    url: Mapped[str] = mapped_column(String(1000))
    medium: Mapped[str] = mapped_column(String(200))
    author: Mapped[str | None] = mapped_column(String(200))
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    week: Mapped[int] = mapped_column(Integer)
    year: Mapped[int] = mapped_column(Integer)
    summary: Mapped[str | None] = mapped_column(String(2000))
    relevant: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    source_id: Mapped[int | None] = mapped_column(ForeignKey("sources.id"))
    source: Mapped["Source"] = relationship(back_populates="events")
    axes: Mapped[list["EventAxis"]] = relationship(back_populates="event", cascade="all, delete-orphan")
    analysis: Mapped["Analysis | None"] = relationship(back_populates="event")


class EventAxis(Base):
    __tablename__ = "event_axes"

    id: Mapped[int] = mapped_column(primary_key=True)
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id"))
    axis: Mapped[Axis] = mapped_column(SAEnum(Axis))
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False)

    event: Mapped["Event"] = relationship(back_populates="axes")
