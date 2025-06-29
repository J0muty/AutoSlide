import os
import base64
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
api_key = os.getenv("OPENAI_API")
if not api_key:
    raise ValueError("Не найден ключ OPENAI_API")

client = OpenAI(api_key=api_key)

def refine_prompt(topic, style):
    system_msg = "Вы — эксперт по созданию промтов. На основе темы и стиля сформируйте краткий, но подробный промпт для генерации слайда размером 1024×1024 и высоким качеством."
    user_msg = f"Тема: «{topic}». Стиль: «{style}». Предложите лучший промпт."
    resp = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user",   "content": user_msg},
        ]
    )
    return resp.choices[0].message.content.strip()

def generate_slide_image(prompt):
    img_resp = client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        size="1024x1024",
        quality="hd",
        response_format="b64_json"
    )
    b64 = img_resp.data[0].b64_json
    return base64.b64decode(b64)

def main():
    topic = input("Введите тему слайда: ")
    style = input("Введите желаемый стиль: ")
    prompt = refine_prompt(topic, style)
    print("Промпт:\n", prompt)
    img_bytes = generate_slide_image(prompt)
    with open("slide_output.png", "wb") as f:
        f.write(img_bytes)
    print("Изображение сохранено как slide_output.png")

if __name__ == "__main__":
    main()
