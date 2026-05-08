from sqlalchemy import String, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
import enum


class SourceType(str, enum.Enum):
    hegemonic = "hegemonic"
    alternative = "alternative"
    analysis = "analysis"


class Source(Base):
    __tablename__ = "sources"

    id: Mapped[int] = mapped_column(primary_key=True)
    country: Mapped[str] = mapped_column(String(2))
    name: Mapped[str] = mapped_column(String(100))
    rss_url: Mapped[str | None] = mapped_column(String(500))
    website_url: Mapped[str | None] = mapped_column(String(500))
    type: Mapped[SourceType] = mapped_column(SAEnum(SourceType), default=SourceType.hegemonic)
    active: Mapped[bool] = mapped_column(default=True)

    events: Mapped[list] = relationship(back_populates="source")
