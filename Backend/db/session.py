# backend/db/session.py
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

DATABASE_URL_ASYNC = os.getenv("DATABASE_URL_ASYNC", "postgresql+asyncpg://user:password@localhost:5432/lro_db")

# -----------------------------
# Async Engine
# -----------------------------
engine = create_async_engine(
    DATABASE_URL_ASYNC,
    echo=False,  # Set True for debugging
    future=True,
)

# -----------------------------
# Async Session Factory
# -----------------------------
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    future=True,
)

# -----------------------------
# FastAPI Dependency
# -----------------------------
async def get_db() -> AsyncSession:
    """
    Provide a transactional scope around a series of operations.
    Usage in FastAPI endpoint:
    async def endpoint(db: AsyncSession = Depends(get_db)):
        ...
    """
    async with AsyncSessionLocal() as session:
        yield session
