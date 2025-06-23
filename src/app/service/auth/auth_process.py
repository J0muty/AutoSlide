from typing import Union

from fastapi import Request, status
from fastapi.responses import HTMLResponse, RedirectResponse

from src.settings.settings import templates
from src.base import postgres


async def process_register(request: Request) -> Union[RedirectResponse, HTMLResponse]:
    if request.method == "GET":
        return templates.TemplateResponse("register.html", {"request": request})

    form = await request.form()
    username = form.get("username")
    email = form.get("email")
    password = form.get("password")
    confirm_password = form.get("confirm_password")

    if password != confirm_password:
        return templates.TemplateResponse(
            "register.html",
            {"request": request, "error": "Пароли не совпадают", "username": username, "email": email},
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    try:
        new_user = await postgres.create_user(username=username, email=email, password=password)
        request.session['user_id'] = new_user.id
    except Exception as exc:
        return templates.TemplateResponse(
            "register.html",
            {"request": request, "error": str(exc), "username": username, "email": email},
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    return RedirectResponse(url="/app", status_code=status.HTTP_303_SEE_OTHER)


async def process_login(request: Request) -> Union[RedirectResponse, HTMLResponse]:
    if request.method == "GET":
        return templates.TemplateResponse("login.html", {"request": request})

    form = await request.form()
    username = form.get("username")
    password = form.get("password")

    user = await postgres.get_user_by_username(username=username)
    if not user or user.password != password:
        return templates.TemplateResponse("login.html", {"request": request}, status_code=status.HTTP_400_BAD_REQUEST)

    request.session['user_id'] = user.id
    return RedirectResponse(url="/app", status_code=status.HTTP_303_SEE_OTHER)