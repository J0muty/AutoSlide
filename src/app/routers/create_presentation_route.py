from fastapi import APIRouter, Request, Depends, HTTPException, status
from starlette.responses import HTMLResponse, RedirectResponse, JSONResponse
from src.settings.settings import templates
from src.app.utils.login_or_not import require_user
from src.app.service.api.tunel_api_words import compose_structure

create_presentation_router = APIRouter()


@create_presentation_router.get("/type_presentation", response_class=HTMLResponse)
async def type_presentation(request: Request, user_id: int = Depends(require_user)):
    request.session["can_access_questionnaire"] = False
    request.session.pop("presentation_type", None)
    return templates.TemplateResponse(
        "type_presentation.html",
        {"request": request, "user_id": user_id}
    )


@create_presentation_router.post("/set_presentation_type", response_class=JSONResponse)
async def set_presentation_type(request: Request, user_id: int = Depends(require_user)):
    data = await request.json()
    pres_type = data.get("type")
    if not pres_type:
        raise HTTPException(status_code=400, detail="Type not provided")

    request.session["presentation_type"] = pres_type
    request.session["can_access_questionnaire"] = True
    return {"status": "ok", "user_id": user_id}


@create_presentation_router.get("/questionnaire", response_class=HTMLResponse)
async def questionnaire(request: Request, user_id: int = Depends(require_user)):
    if not request.session.pop("can_access_questionnaire", False):
        return RedirectResponse("/app/type_presentation", status_code=status.HTTP_303_SEE_OTHER)

    return templates.TemplateResponse(
        "questionnaire.html",
        {"request": request, "user_id": user_id}
    )


@create_presentation_router.post("/generate_structure", response_class=JSONResponse)
async def generate_structure(request: Request, user_id: int = Depends(require_user)):
    data = await request.json()
    topic = data.get("topic", "").strip()
    slides = int(data.get("slides", 0))
    lang = data.get("lang", "ru")

    if not topic or slides < 1:
        raise HTTPException(status_code=400, detail="Invalid payload")

    try:
        structure = await compose_structure(topic=topic, slides=slides, lang=lang)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"structure": structure, "user_id": user_id}
