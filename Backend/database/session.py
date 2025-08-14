from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncEngine, AsyncSession
import os
from dotenv import load_dotenv
from typing import AsyncGenerator
load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql+asyncpg://user:password@localhost:5432/dlr')

engine: AsyncEngine = create_async_engine(DATABASE_URL, future=True, echo=False)
async_session = async_sessionmaker(bind=engine, expire_on_commit=False)

# FastAPI dependency
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session
