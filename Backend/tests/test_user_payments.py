import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_create_payment():
    token = "Bearer <access_token_here>"
    payload = {"application_id": 1, "amount": 1000, "payment_method": "Card"}
    async with AsyncClient(app=app, base_url="http://test", headers={"Authorization": token}) as ac:
        response = await ac.post("/api/user/payments/", json=payload)
    assert response.status_code == 201
    assert response.json()["amount"] == 1000
