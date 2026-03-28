import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class FuelEntryBase(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True)

    timestamp: datetime
    name: str
    calories: int
    protein_g: float
    carbs_g: float
    fat_g: float
    note: str | None = None
    source_type: str | None = None
    source_id: str | None = None
    source_amount_g: float | None = None


class FuelEntryCreate(FuelEntryBase):
    pass


class FuelEntryOut(FuelEntryBase):
    id: uuid.UUID


class MealProtocolBase(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True)

    name: str
    version: str
    ingredients_desc: str
    calories: int
    protein_g: float
    carbs_g: float
    fat_g: float


class MealProtocolCreate(MealProtocolBase):
    pass


class MealProtocolOut(MealProtocolBase):
    id: uuid.UUID
