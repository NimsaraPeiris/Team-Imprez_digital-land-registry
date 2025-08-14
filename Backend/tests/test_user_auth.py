import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_register_user():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        payload = {
            "full_name": "Test User",
            "nic_number": "123456789V",
            "email": "testuser@example.com",
            "password": "strongpassword"
        }
        response = await ac.post("/api/user/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "user_id" in data

@pytest.mark.asyncio
async def test_login_user():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        payload = {
            "email": "testuser@example.com",
            "password": "strongpassword"
        }
        response = await ac.post("/api/user/auth/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
