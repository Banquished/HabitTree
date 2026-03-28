import uuid
from typing import Any

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class BioProfileBase(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True)

    age: int
    sex: str
    weight_kg: float
    height_cm: float
    activity_level: str
    goal_type: str
    goal_weight_kg: float
    duration_weeks: int
    mission_start_date: str
    custom_tdee: float | None = None
    calorie_adjustment: float = 0
    custom_macros: dict[str, Any] | None = None


class BioProfileCreate(BioProfileBase):
    pass


class BioProfileUpdate(BioProfileBase):
    pass


class BioProfileOut(BioProfileBase):
    id: uuid.UUID
