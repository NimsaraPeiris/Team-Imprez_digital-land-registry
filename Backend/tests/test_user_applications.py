
import pytest
from httpx import AsyncClient, ASGITransport
from main import app


@pytest.mark.asyncio
async def test_list_user_applications():
    token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiZXhwIjoxNzU1Mjc5NjY1fQ.OjSBW5W2s0oFfP7mlROewBP_q6Lj3BZuQhhoTJJ6T_c"
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test", headers={"Authorization": token}) as ac:
        response = await ac.get("/api/user/applications/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_create_application():
    token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiZXhwIjoxNzU1Mjc5NjY1fQ.OjSBW5W2s0oFfP7mlROewBP_q6Lj3BZuQhhoTJJ6T_c"
    payload = {"service_id": 1, "reference_number": "REF001"}
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test", headers={"Authorization": token}) as ac:
        response = await ac.post("/api/user/applications/", json=payload)
    assert response.status_code == 201
    assert response.json()["service_id"] == 1
