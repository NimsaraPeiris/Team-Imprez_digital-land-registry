import pytest
from httpx import AsyncClient
from main import app

@pytest.mark.asyncio
async def test_list_user_applications():
    token = "Bearer <access_token_here>"
    async with AsyncClient(app=app, base_url="http://test", headers={"Authorization": token}) as ac:
        response = await ac.get("/api/user/applications/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_create_application():
    token = "Bearer <access_token_here>"
    payload = {"service_id": 1, "reference_number": "REF001"}
    async with AsyncClient(app=app, base_url="http://test", headers={"Authorization": token}) as ac:
        response = await ac.post("/api/user/applications/", json=payload)
    assert response.status_code == 201
    assert response.json()["service_id"] == 1
