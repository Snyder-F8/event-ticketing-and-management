"""Add new columns to events, ticket_types, tickets, payments

Revision ID: b2c9d1e3f4a5
Revises: 483040072ac2
Create Date: 2026-04-04 12:00:00
"""
from alembic import op
import sqlalchemy as sa

revision = 'b2c9d1e3f4a5'
down_revision = '483040072ac2'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('events',
        sa.Column('status', sa.String(20), nullable=True, server_default='pending'))
    op.add_column('ticket_types',
        sa.Column('tickets_sold', sa.Integer(), nullable=True, server_default='0'))
    op.add_column('tickets',
        sa.Column('quantity', sa.Integer(), nullable=True, server_default='1'))
    op.add_column('tickets',
        sa.Column('total_amount', sa.Numeric(10, 2), nullable=True, server_default='0'))
    op.add_column('tickets',
        sa.Column('ticket_code', sa.String(20), nullable=True))
    op.add_column('payments',
        sa.Column('phone_number', sa.String(20), nullable=True))
    op.add_column('payments',
        sa.Column('mpesa_checkout_request_id', sa.String(200), nullable=True))
    op.add_column('payments',
        sa.Column('mpesa_merchant_request_id', sa.String(200), nullable=True))


def downgrade():
    op.drop_column('payments', 'mpesa_merchant_request_id')
    op.drop_column('payments', 'mpesa_checkout_request_id')
    op.drop_column('payments', 'phone_number')
    op.drop_column('tickets', 'ticket_code')
    op.drop_column('tickets', 'total_amount')
    op.drop_column('tickets', 'quantity')
    op.drop_column('ticket_types', 'tickets_sold')
    op.drop_column('events', 'status')