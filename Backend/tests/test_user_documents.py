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
async def test_add_document():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        headers = await auth_header(ac)
        payload = {
            "application_id": 1,
            "document_type": "Deed",
            "file_name": "deed.pdf",
            "file_path": "/files/deed.pdf"
        }
        response = await ac.post("/api/user/applications/documents", json=payload, headers=headers)
    assert response.status_code == 201
    assert response.json()["document_type"] == "Deed"
