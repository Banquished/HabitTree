import uuid

from sqlalchemy import Float, ForeignKey, Integer, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class FoodItem(Base):
    __tablename__ = "food_items"

    user_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True, index=True)
    name: Mapped[str] = mapped_column(String)
    brand: Mapped[str | None] = mapped_column(String, nullable=True)
    calories_per_100g: Mapped[float] = mapped_column(Float)
    protein_per_100g: Mapped[float] = mapped_column(Float)
    carbs_per_100g: Mapped[float] = mapped_column(Float)
    fat_per_100g: Mapped[float] = mapped_column(Float)


class Recipe(Base):
    __tablename__ = "recipes"

    user_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True, index=True)
    name: Mapped[str] = mapped_column(String)
    total_calories: Mapped[int] = mapped_column(Integer)
    total_protein_g: Mapped[float] = mapped_column(Float)
    total_carbs_g: Mapped[float] = mapped_column(Float)
    total_fat_g: Mapped[float] = mapped_column(Float)
    total_weight_g: Mapped[float] = mapped_column(Float)

    ingredients: Mapped[list["RecipeIngredient"]] = relationship(
        back_populates="recipe", cascade="all, delete-orphan", lazy="selectin"
    )


class RecipeIngredient(Base):
    __tablename__ = "recipe_ingredients"

    recipe_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("recipes.id", ondelete="CASCADE"))
    food_item_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("food_items.id"))
    amount_g: Mapped[float] = mapped_column(Float)

    recipe: Mapped["Recipe"] = relationship(back_populates="ingredients")
