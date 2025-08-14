# backend/routers/user/applications.py
# Compatibility shim — re-export the new endpoint router
from api.v1.endpoints.user_applications import router as router

__all__ = ["router"]
