from datetime import datetime

from sqlalchemy import DateTime, Float, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class WeightEntry(Base):
    __tablename__ = "weight_entries"

    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    weight_kg: Mapped[float] = mapped_column(Float)
    note: Mapped[str | None] = mapped_column(String, nullable=True)
