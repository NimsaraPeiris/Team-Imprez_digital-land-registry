import pytest
from httpx import AsyncClient
from main import app
from httpx import ASGITransport

@pytest.mark.asyncio
async def test_verify_document():
    # register/login an officer user and create officer profile
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # register and login user
        email = f"officer_{__import__('uuid').uuid4().hex}@example.com"
        pwd = "strongpassword"
        await ac.post("/api/user/auth/register", json={"full_name": "Officer", "nic_number": "999999999V", "email": email, "password": pwd})
        login_res = await ac.post("/api/user/auth/login", json={"email": email, "password": pwd})
        token = login_res.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        # insert officer profile in DB
        from db.lro_backend_models import LROOfficer, User, AsyncSessionLocal
        async with AsyncSessionLocal() as session:
            q = await session.execute(User.__table__.select().where(User.email == email))
            user_row = q.first()
            user_id = user_row[0]
            officer = LROOfficer(user_id=user_id, employee_id=f"EMP-{__import__('uuid').uuid4().hex[:6]}")
            session.add(officer)
            await session.commit()
        # create application and document to verify
        app_res = await ac.post("/api/user/applications/", json={"service_id": 1, "reference_number": "REF-VERIFY-1"}, headers=headers)
        application_id = app_res.json().get("application_id")
        doc_res = await ac.post("/api/user/applications/documents", json={"application_id": application_id, "document_type": "ID", "file_name": "id.pdf", "file_path": "/files/id.pdf"}, headers=headers)
        doc_id = doc_res.json().get("document_id")
        payload = {"verification_status": "Verified", "remarks": "Valid document"}
        response = await ac.post(f"/api/admin/documents/{doc_id}/verify", json=payload, headers=headers)
    assert response.status_code == 204
