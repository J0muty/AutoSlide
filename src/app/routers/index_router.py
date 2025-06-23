from fastapi import APIRouter, Request
from starlette.responses import HTMLResponse

from src.settings.settings import templates

index_router = APIRouter()

@index_router.get("/", response_class=HTMLResponse)
async def home(request: Request):
    user_id = request.session.get("user_id")
    return templates.TemplateResponse("index.html", {"request": request, "user_id": user_id})