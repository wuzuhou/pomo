"""empty message

Revision ID: 33709ddf90b5
Revises: 
Create Date: 2019-05-28 11:27:55.280625

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '33709ddf90b5'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('activestrings', sa.String(length=128), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user', 'activestrings')
    # ### end Alembic commands ###