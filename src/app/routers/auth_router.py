from fastapi import APIRouter, Request
from starlette.responses import HTMLResponse, RedirectResponse
from src.app.service.auth.auth_process import process_register, process_login

auth_router = APIRouter()

@auth_router.get("/register", response_class=HTMLResponse)
@auth_router.post("/register", response_class=HTMLResponse)
async def register(request: Request):
    return await process_register(request)

@auth_router.get("/login", response_class=HTMLResponse)
@auth_router.post("/login", response_class=HTMLResponse)
async def login(request: Request):
    return await process_login(request)

@auth_router.get("/logout")
async def logout(request: Request):
    request.session.pop("user_id", None)
    return RedirectResponse(url="/", status_code=302)
