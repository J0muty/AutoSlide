from fastapi import APIRouter, Request, Depends
from starlette.responses import HTMLResponse
from src.settings.settings import templates
from src.app.utils.login_or_not import require_user

tariff_router = APIRouter()

@tariff_router.get("/tariff", response_class=HTMLResponse)
async def tariff(request: Request, user_id: int = Depends(require_user)):
    return templates.TemplateResponse("tariff.html", {"request": request, "user_id": user_id})