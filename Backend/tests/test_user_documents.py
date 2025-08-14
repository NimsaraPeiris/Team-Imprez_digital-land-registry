import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_add_document():
    token = "Bearer <access_token_here>"
    payload = {
        "application_id": 1,
        "document_type": "Deed",
        "file_name": "deed.pdf",
        "file_path": "/files/deed.pdf"
    }
    async with AsyncClient(app=app, base_url="http://test", headers={"Authorization": token}) as ac:
        response = await ac.post("/api/user/applications/documents", json=payload)
    assert response.status_code == 201
    assert response.json()["document_type"] == "Deed"
