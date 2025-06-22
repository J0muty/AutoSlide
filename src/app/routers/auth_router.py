from fastapi import APIRouter, Request
from starlette.responses import HTMLResponse

from src.settings.settings import templates

auth_router = APIRouter()

@auth_router.get("/register", response_class=HTMLResponse)
async def register_get(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})


@auth_router.post("/register")
async def register_post(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})


@auth_router.get("/login", response_class=HTMLResponse)
async def register_get(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})


@auth_router.post("/login")
async def register_post(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})
