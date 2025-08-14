import pytest
from httpx import AsyncClient, ASGITransport
from main import app
import uuid


# helper to register and login a fresh user and return Authorization header
async def auth_header(ac: AsyncClient):
    email = f"testuser_{uuid.uuid4().hex}@example.com"
    password = "strongpassword"
    await ac.post("/api/user/auth/register", json={
        "full_name": "Test User",
        "nic_number": "123456789V",
        "email": email,
        "password": password
    })
    login_res = await ac.post("/api/user/auth/login", json={"email": email, "password": password})
    token = login_res.json().get("access_token")
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.asyncio
async def test_list_user_applications():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        headers = await auth_header(ac)
        response = await ac.get("/api/user/applications/", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_create_application():
    payload = {"service_id": 1, "reference_number": "REF001"}
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        headers = await auth_header(ac)
        response = await ac.post("/api/user/applications/", json=payload, headers=headers)
    assert response.status_code == 201
    assert response.json()["service_id"] == 1
