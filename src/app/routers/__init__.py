from src.app.routers.home_router import home_router
from src.app.routers.index_router import index_router
from src.app.routers.auth_router import auth_router
from src.app.routers.create_presentation_route import create_presentation_router
from src.app.routers.my_presentations_router import my_presentations_router


__all__ = [
    "home_router",
    "index_router",
    "auth_router",
    "create_presentation_router",
    "my_presentations_router"
]