from fastapi import APIRouter, Request
from starlette.responses import HTMLResponse

from src.settings.settings import templates

index_router = APIRouter()

@index_router.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})