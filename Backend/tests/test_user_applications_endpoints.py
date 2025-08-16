from fastapi.testclient import TestClient
from main import app
import datetime
import asyncio
import uuid

from database.session import get_sessionmaker


def _create_user_and_service():
    async def _inner():
        Session = get_sessionmaker()
        async with Session() as session:
            # create a service if missing
            from models.services import Services
            svc = Services(service_name='Test Service', service_code=f'TEST-{uuid.uuid4().hex[:6]}', base_fee=0)
            session.add(svc)
            await session.commit()
            await session.refresh(svc)

            # create a unique user
            from crud.users import create_user
            suffix = uuid.uuid4().hex[:8]
            nic = f"123456{suffix}V"
            email = f"appuser+{suffix}@example.com"
            user = await create_user(session, 'Test User', nic, email, 'password', '0712345678', 'Test Address')
            return user, svc
    return asyncio.run(_inner())


def test_create_and_get_application():
    client = TestClient(app)

    # create DB-backed service and user
    user, svc = _create_user_and_service()

    # override dependency to return our DB user
    from api.v1.endpoints.user_auth import get_current_user
    app.dependency_overrides[get_current_user] = lambda: user

    # Create application via endpoint
    payload = {'service_id': svc.service_id, 'reference_number': 'REF123'}
    resp = client.post('/api/user/applications/', json=payload)
    assert resp.status_code == 201
    body = resp.json()
    assert body['user_id'] == user.user_id
    assert body['service_id'] == svc.service_id
    app_id = body['application_id']

    # Retrieve it via GET endpoint
    resp2 = client.get(f'/api/user/applications/{app_id}')
    assert resp2.status_code == 200
    app_body = resp2.json()
    assert app_body['application_id'] == app_id

    # cleanup override
    app.dependency_overrides.pop(get_current_user, None)
