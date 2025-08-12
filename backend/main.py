# backend/main.py
import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.user import auth as user_auth
from routers.user import applications as user_apps
from routers.user import payments as user_payments
from routers.user import documents as user_documents
from routers.admin import applications as admin_apps
from routers.admin import documents as admin_documents

# Make sure PYTHONPATH includes backend; or run from project root so imports resolve.
app = FastAPI(
    title="Digital Land Registry Hub", 
    version="0.1.0", 
    description="Backend API for Digital Land Registry Hub")

# CORS configuration (adjust for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Restrict to trusted origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers
app.include_router(user_auth.router, prefix="/api")
app.include_router(user_apps.router, prefix="/api")
app.include_router(user_payments.router, prefix="/api")
app.include_router(user_documents.router, prefix="/api")

app.include_router(admin_apps.router, prefix="/api")
app.include_router(admin_documents.router, prefix="/api")

# Optional startup event
# @app.on_event("startup")
# async def startup():
#     from db.lro_backend_models import engine
#     # Optionally test DB connection here

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )