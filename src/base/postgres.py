import logging
from src.settings.config import db_user, db_password, db_host, db_port, db_name
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.engine import URL
from sqlalchemy.pool import NullPool
from sqlalchemy import text
from src.base.postgres_models import Base


async_session: None | async_sessionmaker[AsyncSession] = None

async def init_db():
    logging.info("Инициализация базы данных...")
    global async_session
    DATABASE_URL = URL.create(
        drivername="postgresql+asyncpg",
        username=db_user,
        password=db_password,
        host=db_host,
        port=db_port,
        database=db_name
    )
    engine = create_async_engine(
        DATABASE_URL,
        connect_args={
            "server_settings": {
                "timezone": "Europe/Moscow"
            }
        },
        future=True,
        echo=False,
        poolclass=NullPool,
    )
    async_session = async_sessionmaker(engine, expire_on_commit=False)
    async with engine.begin() as conn:
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS citext;"))
        await conn.run_sync(Base.metadata.create_all)
    logging.info("✅ База данных инициализирована")


def connect(method):
    async def wrapper(*args, **kwargs):
        async with async_session() as session:
            try:
                result = await method(*args, **kwargs, session=session)
                return result
            except Exception as e:
                await session.rollback()
                logging.error(f"❌ Ошибка в методе {method.__name__}: {repr(e)}")
                raise Exception(
                    f'Ошибка при работе с базой данных: {repr(e)} \nargs:\n{args}'
                )
    return wrapper