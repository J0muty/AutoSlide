import base64
from openai import OpenAI

client = OpenAI(
    api_key="sk-aitunnel-kmTM0q96rq9Limf9b7cNTJUXLxgvtaej",
    base_url="https://api.aitunnel.ru/v1/",
)

result = client.images.generate(
    model="gpt-image-1",
    prompt="дудос атака",
    output_format="png",
)

image_base64 = result.data[0].b64_json
image_bytes = base64.b64decode(image_base64)
with open("gen_image.png", "wb") as f:
    f.write(image_bytes)

print("Изображение сохранено как gen_image.png")
