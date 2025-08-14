import pytest
from httpx import AsyncClient
from main import app
from httpx import ASGITransport

@pytest.mark.asyncio
async def test_add_document():
    token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiZXhwIjoxNzU1Mjc5NjY1fQ.OjSBW5W2s0oFfP7mlROewBP_q6Lj3BZuQhhoTJJ6T_c"
    payload = {
        "application_id": 1,
        "document_type": "Deed",
        "file_name": "deed.pdf",
        "file_path": "/files/deed.pdf"
    }
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test", headers={"Authorization": token}) as ac:
        response = await ac.post("/api/user/applications/documents", json=payload)
    assert response.status_code == 201
    assert response.json()["document_type"] == "Deed"
