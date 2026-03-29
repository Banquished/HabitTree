import uuid

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.bio import BioProfile
from app.schemas.bio import BioProfileOut, BioProfileUpdate

router = APIRouter(prefix="/bio-profile", tags=["bio"])


@router.get("", response_model=BioProfileOut | None)
async def get_profile(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BioProfile))
    return result.scalars().first()


@router.put("", response_model=BioProfileOut)
async def upsert_profile(data: BioProfileUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BioProfile))
    profile = result.scalars().first()
    if profile:
        for key, val in data.model_dump(by_alias=False).items():
            setattr(profile, key, val)
    else:
        profile = BioProfile(id=uuid.uuid4(), **data.model_dump(by_alias=False))
        db.add(profile)
    await db.commit()
    await db.refresh(profile)
    return profile
