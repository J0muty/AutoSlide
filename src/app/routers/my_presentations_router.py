from fastapi import APIRouter, Request, Depends
from starlette.responses import HTMLResponse
from src.settings.settings import templates
from src.app.utils.login_or_not import require_user

my_presentations_router = APIRouter()

@my_presentations_router.get("/presentations", response_class=HTMLResponse)
async def presentations(request: Request, user_id: int = Depends(require_user)):
    return templates.TemplateResponse("presentations.html", {"request": request, "user_id": user_id})
