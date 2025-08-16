import os
# Ensure any early imports that read DATABASE_URL_ASYNC pick a sqlite default during test collection
os.environ.setdefault('DATABASE_URL', 'sqlite+aiosqlite:///./db.sqlite3')

import asyncio
import pytest
import sys
from pathlib import Path
import pytest_asyncio

# On Windows prefer the selector event loop for broader compatibility with async drivers.
if sys.platform == "win32":
    try:
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    except Exception:
        pass

from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine
from models.lro_backend_models import Base, create_all_tables_via_url

from database.session import init_engine, get_sessionmaker, dispose_engine

@pytest.fixture(scope="session", autouse=True)
def ensure_test_schema(tmp_path_factory):
    """Create a temporary SQLite database for the pytest session and initialize schema.

    This fixture creates a temporary on-disk sqlite file (safer for async engines than in-memory)
    and runs the SQLAlchemy metadata `create_all` against it. It then initializes the application's
    async engine to point at the temporary DB. The DB file is removed after the test session.
    """
    tmp_dir = tmp_path_factory.mktemp("pytest_db")
    db_file = tmp_dir / "test_db.sqlite3"
    database_url = f"sqlite+aiosqlite:///{db_file}"

    # ensure the environment is set so any module reading env uses the test DB
    os.environ['DATABASE_URL'] = database_url

    # dispose any existing engine (e.g., created from app import) so we can re-init to the test DB
    try:
        asyncio.run(dispose_engine())
    except Exception:
        pass

    # create tables using helper that builds a temporary engine
    try:
        asyncio.run(create_all_tables_via_url(database_url))
    except Exception as exc:
        pytest.exit(f"Failed to create test schema: {exc}")

    # initialize the application's engine/sessionmaker to point to the test DB
    try:
        init_engine(database_url)
    except Exception:
        # if init_engine fails here, tests will error; allow test run to continue so failures surface
        pass

    yield

    # teardown: dispose engine and remove file
    try:
        asyncio.run(dispose_engine())
    except Exception:
        pass
    try:
        if db_file.exists():
            db_file.unlink()
    except Exception:
        pass


@pytest_asyncio.fixture
async def db():
    """Yield an AsyncSession bound to the test DB."""
    Session = get_sessionmaker()
    if Session is None:
        raise RuntimeError("Test DB sessionmaker not initialized")
    async with Session() as session:
        yield session
