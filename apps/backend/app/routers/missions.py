import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.mission import Mission
from app.models.user import User
from app.schemas.mission import MacroSplit, MissionCreate, MissionOut, MissionUpdate

router = APIRouter(prefix="/missions", tags=["missions"])


def _to_out(m: Mission) -> MissionOut:
    return MissionOut(
        id=m.id,
        status=m.status,
        created_at=m.created_at,
        start_weight_kg=m.start_weight_kg,
        goal_weight_kg=m.goal_weight_kg,
        goal_type=m.goal_type,
        duration_weeks=m.duration_weeks,
        target_calories=m.target_calories,
        macros=MacroSplit(protein_pct=m.protein_pct, carbs_pct=m.carbs_pct, fat_pct=m.fat_pct),
        start_date=m.start_date,
        end_date=m.end_date,
        milestones=m.milestones,
    )


@router.get("", response_model=list[MissionOut])
async def list_missions(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(
        select(Mission).where(Mission.user_id == user.id).order_by(Mission.created_at.desc())
    )
    return [_to_out(m) for m in result.scalars().all()]


@router.get("/active", response_model=MissionOut | None)
async def get_active_mission(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(
        select(Mission)
        .where(Mission.user_id == user.id, Mission.status == "active")
        .order_by(Mission.created_at.desc())
    )
    m = result.scalars().first()
    return _to_out(m) if m else None


@router.post("", response_model=MissionOut, status_code=201)
async def create_mission(data: MissionCreate, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    # Check for date overlap with non-abandoned missions for this user
    overlap_check = await db.execute(
        select(Mission).where(
            Mission.user_id == user.id,
            Mission.status != "abandoned",
            Mission.start_date <= data.end_date,
            Mission.end_date >= data.start_date,
        )
    )
    overlapping = overlap_check.scalars().all()
    if overlapping:
        m = overlapping[0]
        raise HTTPException(
            409,
            f"Mission overlaps with existing mission: {m.start_date} — {m.end_date}",
        )

    d = data.model_dump(by_alias=False)
    macros = d.pop("macros")
    mission = Mission(id=uuid.uuid4(), user_id=user.id, **d, **macros)
    db.add(mission)
    await db.commit()
    await db.refresh(mission)
    return _to_out(mission)


@router.put("/{mission_id}", response_model=MissionOut)
async def update_mission(
    mission_id: uuid.UUID, data: MissionUpdate, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)
):
    result = await db.execute(select(Mission).where(Mission.id == mission_id, Mission.user_id == user.id))
    mission = result.scalars().first()
    if not mission:
        raise HTTPException(404, "Mission not found")
    for key, val in data.model_dump(exclude_unset=True, by_alias=False).items():
        setattr(mission, key, val)
    await db.commit()
    await db.refresh(mission)
    return _to_out(mission)
