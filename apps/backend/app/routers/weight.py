import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.weight import WeightEntry
from app.schemas.weight import WeightEntryCreate, WeightEntryOut, WeightEntryUpdate

router = APIRouter(prefix="/weight-entries", tags=["weight"])


@router.get("", response_model=list[WeightEntryOut])
async def list_entries(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(WeightEntry).order_by(WeightEntry.timestamp.desc()))
    return result.scalars().all()


@router.post("", response_model=WeightEntryOut, status_code=201)
async def create_entry(data: WeightEntryCreate, db: AsyncSession = Depends(get_db)):
    entry = WeightEntry(id=uuid.uuid4(), **data.model_dump(by_alias=False))
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry


@router.put("/{entry_id}", response_model=WeightEntryOut)
async def update_entry(entry_id: uuid.UUID, data: WeightEntryUpdate, db: AsyncSession = Depends(get_db)):
    entry = await db.get(WeightEntry, entry_id)
    if not entry:
        raise HTTPException(404, "Entry not found")
    for key, val in data.model_dump(exclude_unset=True, by_alias=False).items():
        setattr(entry, key, val)
    await db.commit()
    await db.refresh(entry)
    return entry


@router.delete("/{entry_id}", status_code=204)
async def delete_entry(entry_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    entry = await db.get(WeightEntry, entry_id)
    if not entry:
        raise HTTPException(404, "Entry not found")
    await db.delete(entry)
    await db.commit()
