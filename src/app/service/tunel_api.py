import base64
from openai import OpenAI

client = OpenAI(
    api_key="sk-aitunnel-kmTM0q96rq9Limf9b7cNTJUXLxgvtaej",
    base_url="https://api.aitunnel.ru/v1/",
)

def generate_image(
    prompt: str,
    quality: str = "medium",
    size: str = "1024x1024",
    filename: str = None
) -> str:
    """
    Генерирует изображение по заданному prompt, quality и size,
    сохраняет в файл и возвращает имя файла.

    :param prompt: текстовый запрос для модели
    :param quality: один из "low", "medium", "high"
    :param size: размер в формате "widthxheight" (1024x1024, 1024x1536, 1536x1024)
    :param filename: имя файла для сохранения (если None — будет сгенерировано автоматически)
    :return: имя сохранённого файла
    """

    result = client.images.generate(
        model="gpt-image-1",
        prompt=prompt,
        output_format="png",
        quality=quality,
        size=size,
    )

    img_b64 = result.data[0].b64_json
    img_bytes = base64.b64decode(img_b64)

    if filename is None:
        filename = f"gen_{quality}_{size.replace('x','_')}.png"

    with open(filename, "wb") as f:
        f.write(img_bytes)

    print(f"Изображение сохранено как {filename}")
    return filename


if __name__ == "__main__":
    q, s = "low", "1024x1024"

    generate_image("дудос атака", quality=q, size=s)
