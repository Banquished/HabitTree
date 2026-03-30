import uuid
from datetime import date as date_type
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.operation import OperationLog, OperationTemplate
from app.models.user import User
from app.schemas.operation import (
    DailySummaryItemOut,
    DailySummaryOut,
    HeatmapDayOut,
    OperationLogCreate,
    OperationLogOut,
    OperationLogUpdate,
    OperationTemplateCreate,
    OperationTemplateOut,
    OperationTemplateUpdate,
)

router = APIRouter(prefix="/operations", tags=["operations"])


# --- Templates ---


@router.get("/templates", response_model=list[OperationTemplateOut])
async def list_templates(
    frequency: str | None = None,
    is_active: bool | None = None,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    stmt = select(OperationTemplate).where(OperationTemplate.user_id == user.id)
    if frequency is not None:
        stmt = stmt.where(OperationTemplate.frequency == frequency)
    if is_active is not None:
        stmt = stmt.where(OperationTemplate.is_active == is_active)
    stmt = stmt.order_by(OperationTemplate.sort_order, OperationTemplate.created_at)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.post("/templates", response_model=OperationTemplateOut, status_code=201)
async def create_template(
    data: OperationTemplateCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    template = OperationTemplate(id=uuid.uuid4(), user_id=user.id, **data.model_dump(by_alias=False))
    db.add(template)
    await db.commit()
    await db.refresh(template)
    return template


@router.put("/templates/{template_id}", response_model=OperationTemplateOut)
async def update_template(
    template_id: uuid.UUID,
    data: OperationTemplateUpdate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(OperationTemplate).where(OperationTemplate.id == template_id, OperationTemplate.user_id == user.id)
    )
    template = result.scalars().first()
    if not template:
        raise HTTPException(404, "Template not found")
    for key, val in data.model_dump(exclude_unset=True, by_alias=False).items():
        setattr(template, key, val)
    await db.commit()
    await db.refresh(template)
    return template


@router.delete("/templates/{template_id}", status_code=204)
async def delete_template(
    template_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(OperationTemplate).where(OperationTemplate.id == template_id, OperationTemplate.user_id == user.id)
    )
    template = result.scalars().first()
    if not template:
        raise HTTPException(404, "Template not found")
    template.is_active = False
    await db.commit()


# --- Logs ---


@router.get("/logs", response_model=list[OperationLogOut])
async def list_logs(
    date: str = Query(..., description="Date in YYYY-MM-DD format"),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(select(OperationLog).where(OperationLog.date == date, OperationLog.user_id == user.id))
    return result.scalars().all()


@router.post("/logs", response_model=OperationLogOut, status_code=201)
async def create_log(
    data: OperationLogCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    log = OperationLog(id=uuid.uuid4(), user_id=user.id, **data.model_dump(by_alias=False))
    db.add(log)
    await db.commit()
    await db.refresh(log)
    return log


@router.put("/logs/{log_id}", response_model=OperationLogOut)
async def update_log(
    log_id: uuid.UUID,
    data: OperationLogUpdate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    result = await db.execute(select(OperationLog).where(OperationLog.id == log_id, OperationLog.user_id == user.id))
    log = result.scalars().first()
    if not log:
        raise HTTPException(404, "Log not found")
    for key, val in data.model_dump(exclude_unset=True, by_alias=False).items():
        setattr(log, key, val)
    await db.commit()
    await db.refresh(log)
    return log


@router.delete("/logs/{log_id}", status_code=204)
async def delete_log(log_id: uuid.UUID, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(OperationLog).where(OperationLog.id == log_id, OperationLog.user_id == user.id))
    log = result.scalars().first()
    if not log:
        raise HTTPException(404, "Log not found")
    await db.delete(log)
    await db.commit()


# --- Aggregation ---


def _is_applicable(template: OperationTemplate, d: date_type) -> bool:
    if template.frequency in ("daily", "weekly"):
        return True
    if template.frequency == "specific_days" and template.specific_days:
        return d.isoweekday() in template.specific_days
    return False


@router.get("/heatmap", response_model=list[HeatmapDayOut])
async def get_heatmap(
    start: str = Query(..., description="Start date YYYY-MM-DD"),
    end: str = Query(..., description="End date YYYY-MM-DD"),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    start_date = date_type.fromisoformat(start)
    end_date = date_type.fromisoformat(end)

    # Get all active templates for this user
    result = await db.execute(
        select(OperationTemplate).where(OperationTemplate.is_active.is_(True), OperationTemplate.user_id == user.id)
    )
    templates = result.scalars().all()

    # Get all logs in the date range for this user
    result = await db.execute(
        select(OperationLog).where(
            and_(OperationLog.date >= start, OperationLog.date <= end, OperationLog.user_id == user.id)
        )
    )
    logs = result.scalars().all()

    # Index logs by date
    logs_by_date: dict[str, list[OperationLog]] = {}
    for log in logs:
        logs_by_date.setdefault(log.date, []).append(log)

    # Build heatmap
    days: list[HeatmapDayOut] = []
    current = start_date
    while current <= end_date:
        date_str = current.isoformat()
        applicable = [t for t in templates if _is_applicable(t, current)]
        total = len(applicable)
        applicable_ids = {t.id for t in applicable}
        completed = sum(
            1
            for log in logs_by_date.get(date_str, [])
            if log.completed_at is not None and log.template_id in applicable_ids
        )
        rate = completed / total if total > 0 else 0.0
        days.append(HeatmapDayOut(date=date_str, total=total, completed=completed, rate=rate))
        current += timedelta(days=1)
    return days


@router.get("/daily-summary", response_model=DailySummaryOut)
async def get_daily_summary(
    date: str = Query(..., description="Date in YYYY-MM-DD format"),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    d = date_type.fromisoformat(date)

    # Get all active templates for this user
    result = await db.execute(
        select(OperationTemplate)
        .where(OperationTemplate.is_active.is_(True), OperationTemplate.user_id == user.id)
        .order_by(OperationTemplate.sort_order, OperationTemplate.created_at)
    )
    templates = result.scalars().all()

    # Filter to applicable templates
    applicable = [t for t in templates if _is_applicable(t, d)]

    # Get logs for this date for this user
    result = await db.execute(select(OperationLog).where(OperationLog.date == date, OperationLog.user_id == user.id))
    logs_by_template: dict[uuid.UUID, OperationLog] = {log.template_id: log for log in result.scalars().all()}

    items: list[DailySummaryItemOut] = []
    completed_count = 0
    for template in applicable:
        log = logs_by_template.get(template.id)
        if log and log.completed_at is not None:
            completed_count += 1
        template_out = OperationTemplateOut.model_validate(template, from_attributes=True)
        log_out = OperationLogOut.model_validate(log, from_attributes=True) if log else None
        items.append(DailySummaryItemOut(template=template_out, log=log_out))

    return DailySummaryOut(
        date=date,
        completed_count=completed_count,
        total_count=len(applicable),
        items=items,
    )
