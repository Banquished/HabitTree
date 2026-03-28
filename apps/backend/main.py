from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import bio, food, fuel, missions, operations, protocols, weight

app = FastAPI(title="HabitTree", docs_url=None, redoc_url=None)

v1 = FastAPI(title="HabitTree API", version="1.0.0")

v1.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

v1.include_router(weight.router)
v1.include_router(fuel.router)
v1.include_router(protocols.router)
v1.include_router(missions.router)
v1.include_router(bio.router)
v1.include_router(food.food_router)
v1.include_router(food.recipe_router)
v1.include_router(operations.router)

app.mount("/v1", v1)


@app.get("/")
async def health():
    return {"status": "ok", "version": "1.0.0"}
