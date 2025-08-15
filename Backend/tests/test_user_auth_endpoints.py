from fastapi.testclient import TestClient
from types import SimpleNamespace
import importlib
import datetime

from main import app


def test_register_endpoint_monkeypatched(monkeypatch):
    client = TestClient(app)
    mod = importlib.import_module('api.v1.endpoints.user_auth')

    # Patch get_user_by_email to return None (no existing user)
    async def fake_get_user_by_email(db, email):
        return None
    monkeypatch.setattr(mod, 'get_user_by_email', fake_get_user_by_email)

    # Patch create_user to return a SimpleNamespace matching UserResponse
    async def fake_create_user(db, full_name, nic_number, email, password, phone_number, address):
        return SimpleNamespace(
            user_id=42,
            full_name=full_name,
            nic_number=nic_number,
            email=email,
            phone_number=phone_number,
            address=address,
            created_at=datetime.datetime.utcnow(),
            is_active=True,
        )
    monkeypatch.setattr(mod, 'create_user', fake_create_user)

    payload = {
        "fullName": "Test User",
        "id": "123456789V",
        "email": "testuser@example.com",
        "phone": "0712345678",
        "registrationOffice": "Test Address",
        "password": "password123"
    }

    resp = client.post('/api/user/auth/register', json=payload)
    assert resp.status_code == 201
    body = resp.json()
    assert body['user_id'] == 42
    assert body['email'] == payload['email']


def test_login_endpoint_otp_flow(monkeypatch):
    client = TestClient(app)
    mod = importlib.import_module('api.v1.endpoints.user_auth')

    # Patch get_user_by_nic_and_phone to return a user-like object
    async def fake_get_user_by_nic_and_phone(db, nic, phone):
        return SimpleNamespace(user_id=7, is_active=True)
    monkeypatch.setattr(mod, 'get_user_by_nic_and_phone', fake_get_user_by_nic_and_phone)

    # Patch create_access_token to return a predictable token
    async def fake_create_access_token(subject, expires_delta=None):
        return 'fake-token'
    monkeypatch.setattr(mod, 'create_access_token', fake_create_access_token)

    payload = {"id": "123456789V", "phone": "0712345678", "otp": "123456"}
    resp = client.post('/api/user/auth/login', json=payload)
    assert resp.status_code == 200
    body = resp.json()
    assert body.get('access_token') == 'fake-token'
    assert body.get('token_type') == 'bearer'
