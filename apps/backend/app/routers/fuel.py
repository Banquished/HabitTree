import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.fuel import FuelEntry
from app.schemas.fuel import FuelEntryCreate, FuelEntryOut

router = APIRouter(prefix="/fuel-entries", tags=["fuel"])


@router.get("", response_model=list[FuelEntryOut])
async def list_entries(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(FuelEntry).order_by(FuelEntry.timestamp.desc()))
    return result.scalars().all()


@router.post("", response_model=FuelEntryOut, status_code=201)
async def create_entry(data: FuelEntryCreate, db: AsyncSession = Depends(get_db)):
    entry = FuelEntry(id=uuid.uuid4(), **data.model_dump())
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry


@router.delete("/{entry_id}", status_code=204)
async def delete_entry(entry_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    entry = await db.get(FuelEntry, entry_id)
    if not entry:
        raise HTTPException(404, "Entry not found")
    await db.delete(entry)
    await db.commit()
