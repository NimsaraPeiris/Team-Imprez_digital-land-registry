from fastapi.testclient import TestClient
from main import app
import io
import importlib
import datetime


def test_upload_endpoint_monkeypatched(monkeypatch, tmp_path):
    client = TestClient(app)

    # Monkeypatch dependencies and helpers
    fake_user = type('U', (), {'user_id': 123})()
    from api.v1.endpoints.user_auth import get_current_user

    # override dependency to return our fake user
    app.dependency_overrides[get_current_user] = lambda: fake_user

    # Patch get_application to accept the application and user
    async def fake_get_application(db, application_id, user_id):
        if application_id == 1 and user_id == 123:
            return type('A', (), {'application_id': 1, 'user_id': 123})()
        return None

    monkeypatch.setattr('crud.applications.get_application', fake_get_application)

    # Patch storage to write into temp dir by chdir
    monkeypatch.chdir(tmp_path)

    # Patch add_document to return a simple namespace
    async def fake_add_document(db, application_id, document_type, file_name, file_path):
        return type('D', (), {
            'document_id': 1,
            'application_id': application_id,
            'document_type': document_type,
            'file_name': file_name,
            'file_path': file_path,
            'verification_status': 'Pending',
            'uploaded_at': datetime.datetime.utcnow(),
            'user_id': 123,
            'minio_object_key': file_path,
            'name': file_name,
        })()

    # Import the actual module object and patch its add_document attribute to avoid colliding with the package-level router attribute
    user_docs_mod = importlib.import_module('api.v1.endpoints.user_documents')
    monkeypatch.setattr(user_docs_mod, 'add_document', fake_add_document)

    # Prepare multipart form
    data = {
        'application_id': '1',
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
