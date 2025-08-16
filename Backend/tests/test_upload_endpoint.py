from fastapi.testclient import TestClient
from main import app
import io
import importlib
import datetime
import asyncio
import uuid

from database.session import get_sessionmaker


def _create_user_and_app():
    """Helper to create a service, user and application in the test DB synchronously via asyncio.run
    Generates unique NIC/email values to avoid unique constraint collisions across tests.
    """
    async def _inner():
        Session = get_sessionmaker()
        async with Session() as session:
            # ensure a service exists (create only if missing)
            from models.services import Services
            svc = await session.get(Services, 1)
            if svc is None:
                svc = Services(service_name='Test Service', service_code='TEST', base_fee=0)
                session.add(svc)
                await session.commit()
                await session.refresh(svc)

            # create user and application using CRUD helpers with unique identifiers
            from crud.users import create_user
            from crud.applications import create_application
            suffix = uuid.uuid4().hex[:8]
            nic = f"123456{suffix}V"
            email = f"testuser+{suffix}@example.com"
            user = await create_user(session, 'Test User', nic, email, 'password', '0712345678', 'Test Address')
            app_obj = await create_application(session, user.user_id, svc.service_id, None)
            return user, app_obj

    return asyncio.run(_inner())


def test_upload_endpoint_db(monkeypatch, tmp_path):
    client = TestClient(app)

    # create DB-backed user and application
    user, app_obj = _create_user_and_app()

    # override dependency to return our DB user
    from api.v1.endpoints.user_auth import get_current_user
    app.dependency_overrides[get_current_user] = lambda: user

    # Patch storage to write into temp dir by chdir
    monkeypatch.chdir(tmp_path)

    # Prepare multipart form
    data = {
        'application_id': str(app_obj.application_id),
        'document_type': 'Sales Agreement',
    }
    file_bytes = io.BytesIO(b'hello world')
    files = {'file': ('file.pdf', file_bytes, 'application/pdf')}

    resp = client.post('/api/user/documents/upload', data=data, files=files)
    assert resp.status_code == 200
    body = resp.json()
    # DocumentResponse uses 'file_name' for the uploaded filename
    assert body.get('file_name') == 'file.pdf'
    assert body.get('document_type') == 'Sales Agreement'
    assert 'download_url' in body

    # cleanup override
    app.dependency_overrides.pop(get_current_user, None)
