import pytest
import uuid
from anyio import to_thread

from fastapi.testclient import TestClient
import importlib


async def _create_user_in_db(db, nic: str, email: str):
    from crud.users import create_user
    user = await create_user(db, 'Test User', nic, email, 'password', '0712345678', 'Test Address')
    # ensure persisted
    try:
        await db.commit()
    except Exception:
        await db.rollback()
    return user


@pytest.mark.asyncio
async def test_register_endpoint_db():
    # generate unique nic/email to avoid UNIQUE constraint collisions
    suffix = uuid.uuid4().hex[:8]
    payload = {
        "fullName": "Test User",
        "id": f"123456{suffix}V",
        "email": f"testuser+{suffix}@example.com",
        "phone": "0712345678",
        "registrationOffice": "Test Address",
        "password": "password123"
    }

    def sync_request():
        # import and reload main here so it picks up test env set by conftest.ensure_test_schema
        import main
        importlib.reload(main)
        with TestClient(main.app) as client:
            return client.post('/api/user/auth/register', json=payload)

    resp = await to_thread.run_sync(sync_request)

    assert resp.status_code == 201
    body = resp.json()
    assert body['email'] == payload['email']
    assert 'user_id' in body


@pytest.mark.asyncio
async def test_login_endpoint_otp_flow_db(db):
    # create a user in DB with known nic and phone
    suffix = uuid.uuid4().hex[:8]
    nic = f"123456{suffix}V"
    email = f"loginuser+{suffix}@example.com"
    await _create_user_in_db(db, nic, email)

    payload = {"id": nic, "phone": "0712345678", "otp": "123456"}

    def sync_request():
        import main
        importlib.reload(main)
        with TestClient(main.app) as client:
            return client.post('/api/user/auth/login', json=payload)

    resp = await to_thread.run_sync(sync_request)

    assert resp.status_code == 200
    body = resp.json()
    assert 'access_token' in body
    assert body.get('token_type') == 'bearer'
