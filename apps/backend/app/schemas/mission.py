import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class MacroSplit(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True)

    protein_pct: float
    carbs_pct: float
    fat_pct: float


class MissionCreate(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True)

    status: str = "active"
    created_at: datetime
    start_weight_kg: float
    goal_weight_kg: float
    goal_type: str
    duration_weeks: int
    target_calories: int
    macros: MacroSplit
    start_date: str
    end_date: str
    milestones: list[Any] = []


class MissionUpdate(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True)

    status: str | None = None


class MissionOut(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True)

    id: uuid.UUID
    status: str
    created_at: datetime
    start_weight_kg: float
    goal_weight_kg: float
    goal_type: str
    duration_weeks: int
    target_calories: int
    macros: MacroSplit
    start_date: str
    end_date: str
    milestones: list[Any] = []
