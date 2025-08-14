import pytest
import sys
import os
import asyncio
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from db.session import engine
from db.lro_backend_models import Base
from sqlalchemy import text

# Provide a session-scoped event loop so async fixtures can run at session scope
@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session", autouse=True)
async def setup_test_db():
    """
    Async test DB setup that runs once per test session.
    Creates necessary Postgres enum types first, then creates all tables and seeds initial data.
    """
    # Drop tables and enums if they exist, then recreate enums and tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.execute(text("DROP TYPE IF EXISTS user_type_enum CASCADE;"))
        await conn.execute(text("DROP TYPE IF EXISTS verification_status_enum CASCADE;"))
        await conn.execute(text("DROP TYPE IF EXISTS payment_status_enum CASCADE;"))

        # Create enums used by models
        await conn.execute(text("CREATE TYPE user_type_enum AS ENUM ('citizen', 'officer', 'admin');"))
        await conn.execute(text("CREATE TYPE verification_status_enum AS ENUM ('Pending', 'Verified', 'Rejected');"))
        await conn.execute(text("CREATE TYPE payment_status_enum AS ENUM ('Pending', 'Completed', 'Failed', 'Refunded');"))

        # Now create tables
        await conn.run_sync(Base.metadata.create_all)

    # Seed initial data (application statuses, services)
    try:
        from db.seed_data import seed_initial_data
        from sqlalchemy.ext.asyncio import AsyncSession
        async with AsyncSession(engine) as session:
            await seed_initial_data(session)
    except Exception:
        # If seeding fails, tests may still run; let tests fail explicitly
        pass