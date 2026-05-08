from sqlalchemy import String, Integer, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.database import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id: Mapped[int] = mapped_column(primary_key=True)
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id"), unique=True)
    country: Mapped[str] = mapped_column(String(2))
    week: Mapped[int] = mapped_column(Integer)
    year: Mapped[int] = mapped_column(Integer)

    # Los 4 pasos del método
    disparador: Mapped[str] = mapped_column(Text)
    desplazamiento: Mapped[str] = mapped_column(Text)
    conceptualizacion: Mapped[str] = mapped_column(Text)
    apertura: Mapped[str] = mapped_column(Text)

    published: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    event: Mapped["Event"] = relationship(back_populates="analysis")
    dispatch_links: Mapped[list["DispatchAnalysis"]] = relationship(back_populates="analysis")
