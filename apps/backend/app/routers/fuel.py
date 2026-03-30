import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.fuel import FuelEntry
from app.models.user import User
from app.schemas.fuel import FuelEntryCreate, FuelEntryOut

router = APIRouter(prefix="/fuel-entries", tags=["fuel"])


@router.get("", response_model=list[FuelEntryOut])
async def list_entries(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(
        select(FuelEntry).where(FuelEntry.user_id == user.id).order_by(FuelEntry.timestamp.desc())
    )
    return result.scalars().all()


@router.post("", response_model=FuelEntryOut, status_code=201)
async def create_entry(data: FuelEntryCreate, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    entry = FuelEntry(id=uuid.uuid4(), user_id=user.id, **data.model_dump(by_alias=False))
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry


@router.delete("/{entry_id}", status_code=204)
async def delete_entry(entry_id: uuid.UUID, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(FuelEntry).where(FuelEntry.id == entry_id, FuelEntry.user_id == user.id))
    entry = result.scalars().first()
    if not entry:
        raise HTTPException(404, "Entry not found")
    await db.delete(entry)
    await db.commit()
