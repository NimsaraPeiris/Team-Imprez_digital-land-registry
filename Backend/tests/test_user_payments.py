import pytest
from httpx import AsyncClient
from main import app
from httpx import ASGITransport
import uuid


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
async def test_create_payment():
    payload = {"application_id": 1, "amount": 1000, "payment_method": "Card"}
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        headers = await auth_header(ac)
        response = await ac.post("/api/user/payments/", json=payload, headers=headers)
    assert response.status_code == 201
    assert response.json()["amount"] == 1000
