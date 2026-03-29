import uuid

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class FoodItemBase(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True)

    name: str
    brand: str | None = None
    calories_per_100g: float
    protein_per_100g: float
    carbs_per_100g: float
    fat_per_100g: float


class FoodItemCreate(FoodItemBase):
    pass


class FoodItemUpdate(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True)

    name: str | None = None
    brand: str | None = None
    calories_per_100g: float | None = None
    protein_per_100g: float | None = None
    carbs_per_100g: float | None = None
    fat_per_100g: float | None = None


class FoodItemOut(FoodItemBase):
    id: uuid.UUID


class RecipeIngredientBase(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True)

    food_item_id: uuid.UUID
    amount_g: float


class RecipeBase(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True)

    name: str
    ingredients: list[RecipeIngredientBase] = []
    total_calories: int
    total_protein_g: float
    total_carbs_g: float
    total_fat_g: float
    total_weight_g: float


class RecipeCreate(RecipeBase):
    pass


class RecipeUpdate(RecipeBase):
    pass


class RecipeIngredientOut(RecipeIngredientBase):
    id: uuid.UUID


class RecipeOut(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, serialize_by_alias=True)

    id: uuid.UUID
    name: str
    ingredients: list[RecipeIngredientOut] = []
    total_calories: int
    total_protein_g: float
    total_carbs_g: float
    total_fat_g: float
    total_weight_g: float
