from fastapi import APIRouter, Request, Depends
from starlette.responses import HTMLResponse
from src.settings.settings import templates
from src.app.utils.login_or_not import require_user

support_router = APIRouter()

@support_router.get("/support", response_class=HTMLResponse)
async def support(request: Request, user_id: int = Depends(require_user)):
    return templates.TemplateResponse("support.html", {"request": request, "user_id": user_id})