import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.food import FoodItem, Recipe, RecipeIngredient
from app.schemas.food import (
    FoodItemCreate,
    FoodItemOut,
    FoodItemUpdate,
    RecipeCreate,
    RecipeOut,
    RecipeUpdate,
)

food_router = APIRouter(prefix="/food-items", tags=["food"])
recipe_router = APIRouter(prefix="/recipes", tags=["recipes"])


# --- Food Items ---


@food_router.get("", response_model=list[FoodItemOut])
async def list_food_items(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(FoodItem).order_by(FoodItem.name))
    return result.scalars().all()


@food_router.post("", response_model=FoodItemOut, status_code=201)
async def create_food_item(data: FoodItemCreate, db: AsyncSession = Depends(get_db)):
    item = FoodItem(id=uuid.uuid4(), **data.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


@food_router.put("/{item_id}", response_model=FoodItemOut)
async def update_food_item(item_id: uuid.UUID, data: FoodItemUpdate, db: AsyncSession = Depends(get_db)):
    item = await db.get(FoodItem, item_id)
    if not item:
        raise HTTPException(404, "Food item not found")
    for key, val in data.model_dump(exclude_unset=True).items():
        setattr(item, key, val)
    await db.commit()
    await db.refresh(item)
    return item


@food_router.delete("/{item_id}", status_code=204)
async def delete_food_item(item_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    item = await db.get(FoodItem, item_id)
    if not item:
        raise HTTPException(404, "Food item not found")
    await db.delete(item)
    await db.commit()


# --- Recipes ---


@recipe_router.get("", response_model=list[RecipeOut])
async def list_recipes(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Recipe).order_by(Recipe.name))
    return result.scalars().all()


@recipe_router.post("", response_model=RecipeOut, status_code=201)
async def create_recipe(data: RecipeCreate, db: AsyncSession = Depends(get_db)):
    recipe = Recipe(
        id=uuid.uuid4(),
        name=data.name,
        total_calories=data.total_calories,
        total_protein_g=data.total_protein_g,
        total_carbs_g=data.total_carbs_g,
        total_fat_g=data.total_fat_g,
        total_weight_g=data.total_weight_g,
    )
    for ing in data.ingredients:
        recipe.ingredients.append(
            RecipeIngredient(id=uuid.uuid4(), food_item_id=ing.food_item_id, amount_g=ing.amount_g)
        )
    db.add(recipe)
    await db.commit()
    await db.refresh(recipe)
    return recipe


@recipe_router.put("/{recipe_id}", response_model=RecipeOut)
async def update_recipe(recipe_id: uuid.UUID, data: RecipeUpdate, db: AsyncSession = Depends(get_db)):
    recipe = await db.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(404, "Recipe not found")
    recipe.name = data.name
    recipe.total_calories = data.total_calories
    recipe.total_protein_g = data.total_protein_g
    recipe.total_carbs_g = data.total_carbs_g
    recipe.total_fat_g = data.total_fat_g
    recipe.total_weight_g = data.total_weight_g
    # Replace ingredients
    for ing in list(recipe.ingredients):
        await db.delete(ing)
    await db.flush()
    for ing in data.ingredients:
        recipe.ingredients.append(
            RecipeIngredient(id=uuid.uuid4(), food_item_id=ing.food_item_id, amount_g=ing.amount_g)
        )
    await db.commit()
    await db.refresh(recipe)
    return recipe


@recipe_router.delete("/{recipe_id}", status_code=204)
async def delete_recipe(recipe_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    recipe = await db.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(404, "Recipe not found")
    await db.delete(recipe)
    await db.commit()
