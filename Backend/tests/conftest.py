import os
import asyncio
import pytest
import sys

# Use the selector event loop on Windows to avoid asyncpg/proactor transport issues in tests
if sys.platform == "win32":
    try:
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    except Exception:
        pass

from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine
from models.lro_backend_models import Base

@pytest.fixture(scope="session", autouse=True)
def ensure_test_schema():
    """Skip schema creation inside pytest. Use scripts/setup_test_db.py to prepare DB before running tests.

    To run schema creation inside pytest for debugging set environment variable RUN_SCHEMA_SETUP_IN_PYTEST=1
    """
    db_url = os.getenv("DATABASE_URL_ASYNC", "")
    if db_url == "" or "user:password" in db_url:
        pytest.skip("No test database configured for DB-dependent tests")

    # If user explicitly requests creating schema during pytest (not recommended), allow via env var
    if os.getenv("RUN_SCHEMA_SETUP_IN_PYTEST") == "1":
        import asyncio
        from sqlalchemy import text
        from sqlalchemy.ext.asyncio import create_async_engine

        async def _create():
            engine = create_async_engine(db_url, future=True, echo=False)
            try:
                async with engine.begin() as conn:
                    # Drop all tables first to ensure recreated tables reflect current models (adds missing columns)
                    await conn.run_sync(Base.metadata.drop_all)

                    await conn.execute(text("DROP TYPE IF EXISTS user_type_enum CASCADE;"))
                    await conn.execute(text("DROP TYPE IF EXISTS verification_status_enum CASCADE;"))
                    await conn.execute(text("DROP TYPE IF EXISTS payment_status_enum CASCADE;"))

                    await conn.execute(text("CREATE TYPE user_type_enum AS ENUM ('citizen', 'officer', 'admin');"))
                    await conn.execute(text("CREATE TYPE verification_status_enum AS ENUM ('Pending', 'Verified', 'Rejected');"))
                    await conn.execute(text("CREATE TYPE payment_status_enum AS ENUM ('Pending', 'Completed', 'Failed', 'Refunded');"))

                    # create tables using metadata via sync callable
                    await conn.run_sync(Base.metadata.create_all)
            finally:
                await engine.dispose()

        try:
            asyncio.run(_create())
        except Exception as exc:
            pytest.exit(f"Failed to create test schema: {exc}")

    # otherwise do nothing and assume the DB was prepared by external script
    yield
    # keep DB state for debugging
