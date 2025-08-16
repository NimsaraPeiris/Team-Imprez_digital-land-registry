# This package re-exports the endpoint routers for inclusion in main.py.
# Endpoints are implemented under api.v1.endpoints.<resource> and use the new crud/ and database/ modules.

# Re-export routers from legacy `routers` package for now
from .user_auth import router as user_auth
from .user_applications import router as user_applications
from .user_payments import router as user_payments
from .user_documents import router as user_documents
from .admin_applications import router as admin_applications
from .admin_documents import router as admin_documents
from .chat import router as chat

# Expose router names expected by main.py
__all__ = [
    'user_auth', 'user_applications', 'user_payments', 'user_documents', 'admin_applications', 'admin_documents', 'chat'
]
