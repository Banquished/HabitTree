"""add_users_and_auth

Revision ID: c8f7a2b1d3e5
Revises: 644c3899fa3e
Create Date: 2026-03-29 12:00:00.000000

"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "c8f7a2b1d3e5"
down_revision: str | None = "644c3899fa3e"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

_data_tables = [
    "bio_profiles",
    "weight_entries",
    "fuel_entries",
    "meal_protocols",
    "food_items",
    "recipes",
    "missions",
    "operation_templates",
    "operation_logs",
]


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("clerk_id", sa.String(), nullable=False),
        sa.Column("email", sa.String(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_users_clerk_id", "users", ["clerk_id"], unique=True)

    for table in _data_tables:
        op.add_column(table, sa.Column("user_id", sa.Uuid(), nullable=True))
        op.create_index(f"ix_{table}_user_id", table, ["user_id"])
        op.create_foreign_key(
            f"fk_{table}_user_id", table, "users", ["user_id"], ["id"]
        )


def downgrade() -> None:
    for table in reversed(_data_tables):
        op.drop_constraint(f"fk_{table}_user_id", table, type_="foreignkey")
        op.drop_index(f"ix_{table}_user_id", table)
        op.drop_column(table, "user_id")

    op.drop_index("ix_users_clerk_id", "users")
    op.drop_table("users")
