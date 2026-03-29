from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import bio, food, fuel, missions, operations, protocols, weight

app = FastAPI(title="HabitTree API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

v1 = APIRouter(prefix="/v1")
v1.include_router(weight.router)
v1.include_router(fuel.router)
v1.include_router(protocols.router)
v1.include_router(missions.router)
v1.include_router(bio.router)
v1.include_router(food.food_router)
v1.include_router(food.recipe_router)
v1.include_router(operations.router)
app.include_router(v1)


@app.get("/")
async def health():
    return {"status": "ok", "version": "1.0.0"}
