
import pytest
import asyncio
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from db.session import engine, AsyncSessionLocal
from db.lro_backend_models import Base

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    """
    Setup a fresh test database before running tests, including enums.
    """
    from sqlalchemy import text
    async def run():
        async with engine.begin() as conn:
            # Drop tables and enums if they exist
            await conn.run_sync(Base.metadata.drop_all)
            await conn.execute(text("DROP TYPE IF EXISTS user_type_enum CASCADE;"))
            await conn.execute(text("DROP TYPE IF EXISTS verification_status_enum CASCADE;"))
            await conn.execute(text("DROP TYPE IF EXISTS payment_status_enum CASCADE;"))
            # Create enums
            await conn.execute(text("CREATE TYPE user_type_enum AS ENUM ('citizen', 'officer', 'admin');"))
            await conn.execute(text("CREATE TYPE verification_status_enum AS ENUM ('Pending', 'Verified', 'Rejected');"))
            await conn.execute(text("CREATE TYPE payment_status_enum AS ENUM ('Pending', 'Completed', 'Failed', 'Refunded');"))
            # Now create tables
            await conn.run_sync(Base.metadata.create_all)
    asyncio.run(run())