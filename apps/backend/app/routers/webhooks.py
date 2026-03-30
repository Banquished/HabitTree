import uuid

from fastapi import APIRouter, HTTPException, Request
from sqlalchemy import select
from svix.webhooks import Webhook, WebhookVerificationError

from app.config import settings
from app.database import async_session
from app.models.user import User

router = APIRouter(prefix="/webhooks", tags=["webhooks"])


@router.post("/clerk")
async def clerk_webhook(request: Request):
    body = await request.body()
    headers = {
        "svix-id": request.headers.get("svix-id", ""),
        "svix-timestamp": request.headers.get("svix-timestamp", ""),
        "svix-signature": request.headers.get("svix-signature", ""),
    }

    try:
        wh = Webhook(settings.clerk_webhook_secret)
        event = wh.verify(body, headers)
    except WebhookVerificationError:
        raise HTTPException(400, "Invalid webhook signature")

    event_type = event.get("type")
    data = event.get("data", {})

    async with async_session() as db:
        if event_type in ("user.created", "user.updated"):
            clerk_id = data.get("id")
            email = next(
                (
                    e["email_address"]
                    for e in data.get("email_addresses", [])
                    if e.get("id") == data.get("primary_email_address_id")
                ),
                None,
            )
            result = await db.execute(select(User).where(User.clerk_id == clerk_id))
            user = result.scalars().first()
            if not user:
                user = User(id=uuid.uuid4(), clerk_id=clerk_id, email=email)
                db.add(user)
            else:
                user.email = email
            await db.commit()

        elif event_type == "user.deleted":
            clerk_id = data.get("id")
            result = await db.execute(select(User).where(User.clerk_id == clerk_id))
            user = result.scalars().first()
            if user:
                await db.delete(user)
                await db.commit()

    return {"status": "ok"}
