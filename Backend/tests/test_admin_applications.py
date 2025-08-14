
import pytest
from httpx import AsyncClient, ASGITransport
from main import app


@pytest.mark.asyncio
async def test_list_all_applications():
    token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwiZXhwIjoxNzU1MjgwMzEyfQ.ip73TWMLrmlPq3X-0LGOxpwacie85UMsWujB8a5I2xA"
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test", headers={"Authorization": token}) as ac:
        response = await ac.get("/api/admin/applications/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
