import pytest
from httpx import AsyncClient
from main import app

@pytest.mark.asyncio
async def test_list_all_applications():
    token = "Bearer <admin_access_token_here>"
    async with AsyncClient(app=app, base_url="http://test", headers={"Authorization": token}) as ac:
        response = await ac.get("/api/admin/applications/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
