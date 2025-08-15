from fastapi.testclient import TestClient
from main import app
import importlib
import datetime


def test_create_and_get_application(monkeypatch):
    client = TestClient(app)
    # fake current user
    fake_user = type('U', (), {'user_id': 10})()
    from api.v1.endpoints.user_auth import get_current_user
    app.dependency_overrides[get_current_user] = lambda: fake_user

    # patch create_application to return a simple namespace
    async def fake_create_application(db, user_id, service_id, reference_number=None):
        return type('A', (), {
            'application_id': 1,
            'user_id': user_id,
            'service_id': service_id,
            'application_date': datetime.datetime.utcnow(),
            'status_id': 1,
            'assigned_officer_id': None,
            'reference_number': reference_number,
            'last_updated_at': datetime.datetime.utcnow(),
        })()

    # Patch the symbol imported into the endpoint module so the endpoint uses our fake
    mod = importlib.import_module('api.v1.endpoints.user_applications')
    monkeypatch.setattr(mod, 'create_application', fake_create_application)

    payload = {'service_id': 5, 'reference_number': 'REF123'}
    resp = client.post('/api/user/applications/', json=payload)
    assert resp.status_code == 201
    body = resp.json()
    assert body['application_id'] == 1
    assert body['user_id'] == 10

    # patch get_application to return the same object
    async def fake_get_application(db, application_id, user_id=None):
        return type('A', (), {
            'application_id': application_id,
            'user_id': 10,
            'service_id': 5,
            'application_date': datetime.datetime.utcnow(),
            'status_id': 1,
            'assigned_officer_id': None,
            'reference_number': 'REF123',
            'last_updated_at': datetime.datetime.utcnow(),
        })()

    monkeypatch.setattr(mod, 'get_application', fake_get_application)

    resp2 = client.get('/api/user/applications/1')
    assert resp2.status_code == 200
    app_body = resp2.json()
    assert app_body['application_id'] == 1

    app.dependency_overrides.pop(get_current_user, None)
