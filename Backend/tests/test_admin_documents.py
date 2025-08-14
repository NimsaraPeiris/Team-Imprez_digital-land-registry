import pytest
from httpx import AsyncClient
from main import app
from httpx import ASGITransport

@pytest.mark.asyncio
async def test_verify_document():
    token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwiZXhwIjoxNzU1MjgwMzEyfQ.ip73TWMLrmlPq3X-0LGOxpwacie85UMsWujB8a5I2xA"
    payload = {"verification_status": "Verified", "remarks": "Valid document"}
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test", headers={"Authorization": token}) as ac:
        response = await ac.post("/api/admin/documents/1/verify", json=payload)
    assert response.status_code == 204
