from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncEngine, AsyncSession
import os
from dotenv import load_dotenv
from typing import AsyncGenerator, Optional
load_dotenv()

# Read environment variable; use placeholder only if explicitly provided. If it's the placeholder
# used in development examples, clear it so test helpers can detect "no DB configured" and skip DB tests.
_env_database_url = os.getenv('DATABASE_URL_ASYNC', None)

# Default to sqlite for local dev/CI if no DATABASE_URL_ASYNC provided
if not _env_database_url:
    DATABASE_URL = 'sqlite+aiosqlite:///./db.sqlite3'
else:
    DATABASE_URL = _env_database_url

DATABASE_ECHO = os.getenv('DATABASE_ECHO', 'false').lower() in ('1', 'true', 'yes')

# Lazy-initialized engine and sessionmaker to avoid creating engines on import (prevents cross-event-loop issues)
_engine: Optional[AsyncEngine] = None
_async_session: Optional[async_sessionmaker] = None


def init_engine(database_url: Optional[str] = None, echo: Optional[bool] = None) -> AsyncEngine:
    """Initialize the async engine and sessionmaker. Safe to call multiple times.
    Should be called on the application's event loop (startup) so asyncpg uses the correct loop.
    """
    global _engine, _async_session
    if database_url is None:
        database_url = DATABASE_URL
    if echo is None:
        echo = DATABASE_ECHO
    if not database_url:
        return None
    if _engine is None:
        _engine = create_async_engine(database_url, future=True, echo=echo)
        _async_session = async_sessionmaker(bind=_engine, expire_on_commit=False)
    return _engine


def get_engine() -> Optional[AsyncEngine]:
    """Return the initialized engine or None if not yet initialized.
    If not initialized, will initialize it from environment variables.
    """
    global _engine
    if _engine is None:
        # initialize lazily using env settings
        try:
            init_engine()
        except Exception:
            return None
    return _engine


def get_sessionmaker() -> async_sessionmaker:
    global _async_session
    if _async_session is None:
        init_engine()
    return _async_session


async def dispose_engine() -> None:
    global _engine, _async_session
    if _engine is not None:
        await _engine.dispose()
        _engine = None
        _async_session = None


# FastAPI dependency
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    Session = get_sessionmaker()
    if Session is None:
        # No DB configured: yield nothing which will cause endpoints depending on DB to error if used.
        raise RuntimeError("Database not configured")
    async with Session() as session:
        yield session
