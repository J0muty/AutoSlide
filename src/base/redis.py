import redis.asyncio as redis
import logging
from src.settings.config import redis_host, redis_port, redis_password, redis_user, redis_db

redis_client = redis.Redis(
    host=redis_host,
    port=redis_port,
    db=redis_db,
    username=redis_user,
    password=redis_password,
    decode_responses=True
)

async def check_redis_connection():
    logging.info("Проверка подключения к редису...")
    try:
        pong = await redis_client.ping()
        if pong:
            logging.info("✅ Успешное подключение к Redis!")
        else:
           logging.warning("❌ Пинг не прошёл. Redis недоступен.")

    except Exception as e:
        logging.error(f"❌ Ошибка подключения к Redis: {e}")
