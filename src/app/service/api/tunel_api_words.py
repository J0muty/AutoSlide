import os, asyncio
from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()
AITUNNEL_API = os.getenv("AITUNNEL_API")
if not AITUNNEL_API:
    raise EnvironmentError("Set the AITUNNEL_API environment variable.")

BASE_URL = "https://api.aitunnel.ru/v1/"
client = AsyncOpenAI(api_key=AITUNNEL_API, base_url=BASE_URL)


async def chat_completion(model: str, messages: list, max_tokens: int = 1024):
    resp = await client.chat.completions.create(
        model=model,
        messages=messages,
        max_tokens=max_tokens,
    )
    return resp.choices[0].message.content.strip()


async def compose_structure(topic: str) -> str:
    messages = [
        {
            "role": "system",
            "content": (
                "Ты эксперт по презентациям. Сделай план из 8-10 слайдов: "
                "номер, заголовок, ключевые тезисы, идея визуала."
            ),
        },
        {"role": "user", "content": f"Тема презентации: {topic}"},
    ]
    return await chat_completion("gpt-4.1-nano", messages)


async def search_info(query: str) -> str:
    messages = [
        {
            "role": "system",
            "content": (
                "Ты ассистент-поисковик. Дай 5-8 свежих фактов или цифр со ссылками. "
                "Ответ оформляй списком, в конце URL источников."
            ),
        },
        {"role": "user", "content": query},
    ]
    return await chat_completion("gpt-4o-mini-search-preview", messages)


async def main():
    topic = input("Введите тему презентации: ")

    structure = await compose_structure(topic)
    print("\nСтруктура презентации:\n" + "─" * 70)
    print(structure)

    while True:
        q = input("\nВведите запрос для поиска (Enter чтобы выйти): ").strip()
        if not q:
            break
        facts = await search_info(q)
        print("\nПоиск в интернете:\n" + "─" * 70)
        print(facts)


if __name__ == "__main__":
    asyncio.run(main())
