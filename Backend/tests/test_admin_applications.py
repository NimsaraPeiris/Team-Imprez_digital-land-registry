import pytest
from httpx import AsyncClient, ASGITransport
from main import app
import uuid
from db.lro_backend_models import LROOfficer, User, AsyncSessionLocal
from sqlalchemy.ext.asyncio import AsyncSession


async def auth_header_and_make_officer(ac: AsyncClient):
    email = f"adminuser_{uuid.uuid4().hex}@example.com"
    password = "strongpassword"
    await ac.post("/api/user/auth/register", json={
        "full_name": "Admin User",
        "nic_number": "123456789V",
        "email": email,
        "password": password
    })
    login_res = await ac.post("/api/user/auth/login", json={"email": email, "password": password})
    token = login_res.json().get("access_token")
    # create officer profile directly in DB so admin-only endpoints accept this user
    async with AsyncSessionLocal() as session:
        q = await session.execute(User.__table__.select().where(User.email == email))
        user_row = q.first()
        if user_row:
            user_id = user_row[0]
        else:
            # fallback: try find user by email via query
            res = await session.execute(User.__table__.select())
            user_id = res.first()[0]
        officer = LROOfficer(user_id=user_id, employee_id=f"EMP-{uuid.uuid4().hex[:6]}")
        session.add(officer)
        await session.commit()
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.asyncio
async def test_list_all_applications():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        headers = await auth_header_and_make_officer(ac)
        response = await ac.get("/api/admin/applications/", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)
