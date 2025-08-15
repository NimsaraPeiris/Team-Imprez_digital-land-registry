from fastapi.testclient import TestClient
from main import app
import os

def test_chat_endpoint():
    client = TestClient(app)
    resp = client.post('/api/chat', json={'user': 'hello'})
    assert resp.status_code == 200
    body = resp.json()
    assert body.get('reply') == 'Echo: hello'


def test_internal_static_serving(tmp_path):
    # create sample file under uploaded_documents/123/file.txt
    uploads = tmp_path / 'uploaded_documents' / '123'
    uploads.mkdir(parents=True)
    sample = uploads / 'file.txt'
    sample.write_text('content')

    # temporarily change cwd so the app's storage root matches tmp_path
    cwd = os.getcwd()
    try:
        os.chdir(tmp_path)
        client = TestClient(app)
        # authorized header (matches user id in path)
        resp = client.get('/api/internal/static/123/file.txt', headers={'X-User-Id': '123'})
        assert resp.status_code == 200
        assert resp.text == 'content'

        # forbidden when header doesn't match
        resp2 = client.get('/api/internal/static/123/file.txt', headers={'X-User-Id': '999'})
        assert resp2.status_code == 403
    finally:
        os.chdir(cwd)
