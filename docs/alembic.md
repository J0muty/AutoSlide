1) alembic init alembic

2) alembic/env.py

import os
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from dotenv import load_dotenv
load_dotenv()

from src.base.postgres_models import Base  # <- ваш declarative_base
target_metadata = Base.metadata

3) не обязательно:

config = context.config
section = config.get_section(config.config_ini_section)
section['sqlalchemy.url'] = (
    f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASS')}"
    f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
)
engine = engine_from_config(
    section,
    prefix='sqlalchemy.',
    poolclass=pool.NullPool,
)

4) sqlalchemy.url = postgresql://postgres:951753aA.@localhost:5432/autoslide
5) alembic revision --autogenerate -m "initial schema"
6) alembic upgrade head
7) alembic current