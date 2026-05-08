from pydantic import BaseModel, HttpUrl
from datetime import datetime
from typing import Optional
from app.models.event import Axis
from app.models.source import SourceType


# --- Sources ---

class SourceCreate(BaseModel):
    country: str
    name: str
    rss_url: Optional[str] = None
    website_url: Optional[str] = None
    type: SourceType = SourceType.hegemonic


class SourceOut(SourceCreate):
    id: int
    active: bool
    model_config = {"from_attributes": True}


# --- Events ---

class EventAxisOut(BaseModel):
    axis: Axis
    is_primary: bool
    model_config = {"from_attributes": True}


class EventCreate(BaseModel):
    country: str
    title: str
    url: str
    medium: str
    author: Optional[str] = None
    published_at: Optional[datetime] = None
    week: int
    year: int
    summary: Optional[str] = None
    source_id: Optional[int] = None


class EventOut(EventCreate):
    id: int
    relevant: bool
    created_at: datetime
    axes: list[EventAxisOut] = []
    model_config = {"from_attributes": True}


class EventAxisCreate(BaseModel):
    axis: Axis
    is_primary: bool = False


# --- Analyses ---

class AnalysisCreate(BaseModel):
    event_id: int
    country: str
    week: int
    year: int
    disparador: str
    desplazamiento: str
    conceptualizacion: str
    apertura: str


class AnalysisUpdate(BaseModel):
    disparador: Optional[str] = None
    desplazamiento: Optional[str] = None
    conceptualizacion: Optional[str] = None
    apertura: Optional[str] = None
    published: Optional[bool] = None


class AnalysisOut(AnalysisCreate):
    id: int
    published: bool
    created_at: datetime
    updated_at: datetime
    event: Optional[EventOut] = None
    model_config = {"from_attributes": True}


# --- Dispatches ---

class DispatchCreate(BaseModel):
    week: int
    year: int
    title: str
    entrada: Optional[str] = None
    hilo: Optional[str] = None
    cierre: Optional[str] = None
    analysis_ids: list[int] = []


class DispatchUpdate(BaseModel):
    title: Optional[str] = None
    entrada: Optional[str] = None
    hilo: Optional[str] = None
    cierre: Optional[str] = None
    published: Optional[bool] = None
    analysis_ids: Optional[list[int]] = None


class DispatchOut(BaseModel):
    id: int
    week: int
    year: int
    title: str
    entrada: Optional[str] = None
    hilo: Optional[str] = None
    cierre: Optional[str] = None
    published: bool
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}


# --- Country summary ---

class AxisActivity(BaseModel):
    axis: Axis
    count: int


class CountrySummary(BaseModel):
    country: str
    week: int
    year: int
    event_count: int
    analysis_count: int
    active_axes: list[AxisActivity]
