import uuid

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import verify_clerk_token
from app.database import get_db
from app.models.user import User


async def get_current_user(
    clerk_user_id: str = Depends(verify_clerk_token),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Get or create user from Clerk JWT claims."""
    result = await db.execute(select(User).where(User.clerk_id == clerk_user_id))
    user = result.scalars().first()
    if not user:
        user = User(id=uuid.uuid4(), clerk_id=clerk_user_id)
        db.add(user)
        await db.flush()
    return user
