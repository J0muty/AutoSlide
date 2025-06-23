from fastapi import APIRouter, Request, Depends
from starlette.responses import HTMLResponse
from src.settings.settings import templates
from src.app.utils.login_or_not import require_user

home_router = APIRouter()

@home_router.get("/", response_class=HTMLResponse)
async def home(request: Request, user_id: int = Depends(require_user)):
    return templates.TemplateResponse("home.html", {"request": request, "user_id": user_id})