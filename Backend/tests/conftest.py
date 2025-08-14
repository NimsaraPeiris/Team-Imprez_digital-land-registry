import pytest
import asyncio
from db.session import async_engine, Base

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    """
    Setup a fresh test database before running tests.
    """
    async def run():
        async with async_engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
            await conn.run_sync(Base.metadata.create_all)
    asyncio.run(run())
