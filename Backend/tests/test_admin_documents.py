import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_verify_document():
    token = "Bearer <admin_access_token_here>"
    payload = {"verification_status": "Verified", "remarks": "Valid document"}
    async with AsyncClient(app=app, base_url="http://test", headers={"Authorization": token}) as ac:
        response = await ac.post("/api/admin/documents/1/verify", json=payload)
    assert response.status_code == 204
