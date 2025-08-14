# backend/main.py
import dotenv
dotenv.load_dotenv()
import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import endpoint modules (each exposes `router` object)
from api.v1.endpoints import user_auth, user_applications, user_payments, user_documents, admin_applications, admin_documents

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

# include routers (each name here is an APIRouter exported by api.v1.endpoints)
app.include_router(user_auth, prefix="/api")
app.include_router(user_applications, prefix="/api")
app.include_router(user_payments, prefix="/api")
app.include_router(user_documents, prefix="/api")

app.include_router(admin_applications, prefix="/api")
app.include_router(admin_documents, prefix="/api")

# Optional startup event
@app.on_event("startup")
async def startup():
    # Initialize DB engine/sessionmaker on the running event loop to avoid cross-loop asyncpg errors
    from database.session import init_engine
    try:
        init_engine()
    except Exception:
        pass

@app.on_event("shutdown")
async def shutdown():
    # Dispose engine cleanly
    from database.session import dispose_engine
    try:
        await dispose_engine()
    except Exception:
        pass

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )