import logging
from contextlib import asynccontextmanager
import uvicorn
from fastapi import FastAPI
from src.app.routers import home_router, index_router, auth_router, create_presentation_router, my_presentations_router
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

app.include_router(index_router) # Главная страничка
app.include_router(home_router, prefix="/app") # Главная страничка для презентаций
app.include_router(auth_router) # Регистрация и вход
app.include_router(create_presentation_router, prefix="/app") # Роут создания презентаций
app.include_router(my_presentations_router, prefix="/app") # Роут для презентаций пользователя

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=1489)