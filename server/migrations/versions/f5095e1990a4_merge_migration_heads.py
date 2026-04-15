"""merge migration heads

Revision ID: f5095e1990a4
Revises: c6b1c20b613a, ce313a600610
Create Date: 2026-04-15 16:52:20.136173

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f5095e1990a4'
down_revision = ('c6b1c20b613a', 'ce313a600610')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
