import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    UniqueConstraint,
    Uuid,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class OperationTemplate(Base):
    __tablename__ = "operation_templates"

    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str | None] = mapped_column(String, nullable=True)
    icon: Mapped[str] = mapped_column(String, default="task_alt")
    category: Mapped[str | None] = mapped_column(String, nullable=True)
    frequency: Mapped[str] = mapped_column(String, nullable=False)
    specific_days: Mapped[list[int] | None] = mapped_column(JSONB, nullable=True)
    priority: Mapped[str] = mapped_column(String, default="medium")
    target_count: Mapped[int] = mapped_column(Integer, default=1)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class OperationLog(Base):
    __tablename__ = "operation_logs"
    __table_args__ = (
        UniqueConstraint("template_id", "date", name="uq_operation_log_template_date"),
        Index("ix_operation_logs_date", "date"),
    )

    template_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("operation_templates.id"), nullable=False)
    date: Mapped[str] = mapped_column(String, nullable=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    note: Mapped[str | None] = mapped_column(String, nullable=True)
