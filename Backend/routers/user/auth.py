# Compatibility shim — re-export the new endpoint router
# This file kept so legacy imports (`routers.user.auth`) continue to work during migration.
from api.v1.endpoints.user_auth import router as router

__all__ = ["router"]
