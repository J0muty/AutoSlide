import logging
from contextlib import asynccontextmanager
import uvicorn
from fastapi import FastAPI
from src.app.routers import home_router
from src.base import postgres
from src.base import redis
from starlette.middleware.sessions import SessionMiddleware
from src.settings.settings import static_files

@asynccontextmanager
async def lifespan(_app: FastAPI):
    logging.info("Начало настройки приложения")

    logging.info("Подключение к базе данных...")
    await postgres.init_db()
    logging.info("База данных подключена\n")

    logging.info("Подключение к Redis...")
    await redis.check_redis_connection()
    logging.info("Redis подключён\n")

    yield

    logging.info("Остановка приложения")

app = FastAPI(lifespan=lifespan)

app.add_middleware(SessionMiddleware, secret_key="absolutesecretkey")
app.mount("/static", static_files, name="static")

app.include_router(home_router) # Главная страничка

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=1488)