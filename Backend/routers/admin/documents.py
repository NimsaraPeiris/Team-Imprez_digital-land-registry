# Compatibility shim — re-export the new endpoint router
from api.v1.endpoints.admin_documents import router as router

__all__ = ["router"]
