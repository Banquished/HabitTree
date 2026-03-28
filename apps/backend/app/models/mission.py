from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class Mission(Base):
    __tablename__ = "missions"

    status: Mapped[str] = mapped_column(String, default="active")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    start_weight_kg: Mapped[float] = mapped_column(Float)
    goal_weight_kg: Mapped[float] = mapped_column(Float)
    goal_type: Mapped[str] = mapped_column(String)
    duration_weeks: Mapped[int] = mapped_column(Integer)
    target_calories: Mapped[int] = mapped_column(Integer)
    protein_pct: Mapped[float] = mapped_column(Float)
    carbs_pct: Mapped[float] = mapped_column(Float)
    fat_pct: Mapped[float] = mapped_column(Float)
    start_date: Mapped[str] = mapped_column(String)
    end_date: Mapped[str] = mapped_column(String)
    milestones: Mapped[list] = mapped_column(JSONB, default=list)
