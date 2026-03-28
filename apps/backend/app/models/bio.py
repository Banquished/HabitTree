from sqlalchemy import Float, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class BioProfile(Base):
    __tablename__ = "bio_profiles"

    age: Mapped[int] = mapped_column(Integer)
    sex: Mapped[str] = mapped_column(String)
    weight_kg: Mapped[float] = mapped_column(Float)
    height_cm: Mapped[float] = mapped_column(Float)
    activity_level: Mapped[str] = mapped_column(String)
    goal_type: Mapped[str] = mapped_column(String)
    goal_weight_kg: Mapped[float] = mapped_column(Float)
    duration_weeks: Mapped[int] = mapped_column(Integer)
    mission_start_date: Mapped[str] = mapped_column(String)
    custom_tdee: Mapped[float | None] = mapped_column(Float, nullable=True)
    calorie_adjustment: Mapped[float] = mapped_column(Float, default=0)
    custom_macros: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
