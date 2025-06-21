from fastapi import APIRouter, Request
from starlette.responses import HTMLResponse

from src.settings.settings import templates

home_router = APIRouter()

@home_router.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("home.html", {"request": request})