import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

# --- OperationTemplate ---


class OperationTemplateBase(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True, from_attributes=True,
    )

    name: str
    description: str | None = None
    icon: str = "task_alt"
    category: str | None = None
    frequency: str
    specific_days: list[int] | None = None
    priority: str = "medium"
    target_count: int = 1
    sort_order: int = 0
    is_active: bool = True


class OperationTemplateCreate(OperationTemplateBase):
    pass


class OperationTemplateUpdate(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True)

    name: str | None = None
    description: str | None = None
    icon: str | None = None
    category: str | None = None
    frequency: str | None = None
    specific_days: list[int] | None = None
    priority: str | None = None
    target_count: int | None = None
    sort_order: int | None = None
    is_active: bool | None = None


class OperationTemplateOut(OperationTemplateBase):
    id: uuid.UUID
    created_at: datetime


# --- OperationLog ---


class OperationLogBase(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True, from_attributes=True,
    )

    template_id: uuid.UUID
    date: str


class OperationLogCreate(OperationLogBase):
    completed_at: datetime | None = None


class OperationLogUpdate(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True)

    completed_at: datetime | None = None
    note: str | None = None


class OperationLogOut(OperationLogBase):
    id: uuid.UUID
    completed_at: datetime | None = None
    note: str | None = None


# --- Aggregation ---


class HeatmapDayOut(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True)

    date: str
    total: int
    completed: int
    rate: float


class DailySummaryItemOut(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True, from_attributes=True,
    )

    template: OperationTemplateOut
    log: OperationLogOut | None


class DailySummaryOut(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True)

    date: str
    completed_count: int
    total_count: int
    items: list[DailySummaryItemOut]
