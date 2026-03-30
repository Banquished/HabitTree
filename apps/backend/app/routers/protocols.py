import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.fuel import MealProtocol
from app.models.user import User
from app.schemas.fuel import MealProtocolCreate, MealProtocolOut

router = APIRouter(prefix="/meal-protocols", tags=["protocols"])


@router.get("", response_model=list[MealProtocolOut])
async def list_protocols(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(MealProtocol).where(MealProtocol.user_id == user.id))
    return result.scalars().all()


@router.post("", response_model=MealProtocolOut, status_code=201)
async def create_protocol(data: MealProtocolCreate, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    protocol = MealProtocol(id=uuid.uuid4(), user_id=user.id, **data.model_dump(by_alias=False))
    db.add(protocol)
    await db.commit()
    await db.refresh(protocol)
    return protocol


@router.delete("/{protocol_id}", status_code=204)
async def delete_protocol(protocol_id: uuid.UUID, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(select(MealProtocol).where(MealProtocol.id == protocol_id, MealProtocol.user_id == user.id))
    protocol = result.scalars().first()
    if not protocol:
        raise HTTPException(404, "Protocol not found")
    await db.delete(protocol)
    await db.commit()
