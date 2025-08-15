import asyncio
from types import SimpleNamespace
import importlib

import pytest

from api.v1.endpoints.user_documents import upload_document


class DummyUploadFile:
    def __init__(self, filename: str, content: bytes, content_type: str = "application/pdf"):
        self.filename = filename
        self.content_type = content_type
        self._content = content

    async def read(self):
        return self._content


def test_upload_document_monkeypatched(monkeypatch):
    # Prepare dummy file and user
    dummy_file = DummyUploadFile("file.pdf", b"hello world", "application/pdf")
    fake_user = SimpleNamespace(user_id=123)

    # Patch get_application in the crud module (it is imported inside the endpoint at call-time)
    async def fake_get_application(db, application_id, user_id):
        if application_id == 1 and user_id == 123:
            return SimpleNamespace(application_id=1, user_id=123)
        return None

    monkeypatch.setattr("crud.applications.get_application", fake_get_application)

    # Import endpoint module and patch functions that were imported into it so the endpoint uses our fakes
    mod = importlib.import_module('api.v1.endpoints.user_documents')

    called = {}

    def fake_upload(object_name, data, content_type):
        # data may be bytes
        called['object_name'] = object_name
        called['data_len'] = len(data) if data is not None else None
        called['content_type'] = content_type
        return object_name

    monkeypatch.setattr(mod, 'upload_file_to_minio', fake_upload)
    # Keep presign behavior consistent with local shim
    monkeypatch.setattr(mod, 'generate_presigned_url', lambda k: f"/internal/static/{k}")

    # Patch add_document imported into the endpoint module (it was imported at module level)
    async def fake_add_document(db, application_id, document_type, file_name, file_path):
        return SimpleNamespace(document_id=1, application_id=application_id, user_id=123, name=file_name, document_type=document_type, minio_object_key=file_path)

    monkeypatch.setattr(mod, 'add_document', fake_add_document)

    # Run the async endpoint function
    result = asyncio.run(upload_document(1, "Sales Agreement", dummy_file, db=None, current_user=fake_user))

    assert hasattr(result, 'minio_object_key')
    assert result.minio_object_key == called['object_name']
    assert result.name == "file.pdf"
    assert getattr(result, 'download_url', None) == f"/internal/static/{called['object_name']}"
