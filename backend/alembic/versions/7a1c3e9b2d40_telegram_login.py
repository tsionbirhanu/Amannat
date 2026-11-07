"""telegram login: telegramlink table and otp attempt counter

Revision ID: 7a1c3e9b2d40
Revises: c2382d128458
Create Date: 2026-11-07 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '7a1c3e9b2d40'
down_revision: Union[str, Sequence[str], None] = 'c2382d128458'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'telegramlink',
        sa.Column('phone', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column('chat_id', sa.BigInteger(), nullable=False),
        sa.Column('telegram_user_id', sa.BigInteger(), nullable=False),
        sa.Column('linked_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('phone'),
    )
    op.create_index(op.f('ix_telegramlink_chat_id'), 'telegramlink', ['chat_id'], unique=False)
    op.add_column('otpcode', sa.Column('attempts', sa.Integer(), nullable=False, server_default='0'))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('otpcode', 'attempts')
    op.drop_index(op.f('ix_telegramlink_chat_id'), table_name='telegramlink')
    op.drop_table('telegramlink')
