import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class WeightEntryBase(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True)

    timestamp: datetime
    weight_kg: float
    note: str | None = None


class WeightEntryCreate(WeightEntryBase):
    pass


class WeightEntryUpdate(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True)

    timestamp: datetime | None = None
    weight_kg: float | None = None
    note: str | None = None


class WeightEntryOut(WeightEntryBase):
    id: uuid.UUID
