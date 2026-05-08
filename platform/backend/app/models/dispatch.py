from sqlalchemy import String, Integer, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.database import Base


class Dispatch(Base):
    __tablename__ = "dispatches"

    id: Mapped[int] = mapped_column(primary_key=True)
    week: Mapped[int] = mapped_column(Integer)
    year: Mapped[int] = mapped_column(Integer)
    title: Mapped[str] = mapped_column(String(500))

    # Estructura de la publicación
    entrada: Mapped[str | None] = mapped_column(Text)
    hilo: Mapped[str | None] = mapped_column(Text)
    cierre: Mapped[str | None] = mapped_column(Text)

    published: Mapped[bool] = mapped_column(Boolean, default=False)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    analyses: Mapped[list["DispatchAnalysis"]] = relationship(back_populates="dispatch", cascade="all, delete-orphan")


class DispatchAnalysis(Base):
    __tablename__ = "dispatch_analyses"

    id: Mapped[int] = mapped_column(primary_key=True)
    dispatch_id: Mapped[int] = mapped_column(ForeignKey("dispatches.id"))
    analysis_id: Mapped[int] = mapped_column(ForeignKey("analyses.id"))
    order: Mapped[int] = mapped_column(Integer, default=0)

    dispatch: Mapped["Dispatch"] = relationship(back_populates="analyses")
    analysis: Mapped["Analysis"] = relationship(back_populates="dispatch_links")
