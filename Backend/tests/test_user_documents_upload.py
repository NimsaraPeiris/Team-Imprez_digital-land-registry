import asyncio
from types import SimpleNamespace
import importlib

import pytest
import uuid

from api.v1.endpoints.user_documents import upload_document
from database.session import get_sessionmaker


class DummyUploadFile:
    def __init__(self, filename: str, content: bytes, content_type: str = "application/pdf"):
        self.filename = filename
        self.content_type = content_type
        self._content = content

    async def read(self):
        return self._content


def _create_user_and_app():
    async def _inner():
        Session = get_sessionmaker()
        async with Session() as session:
            from models.services import Services
            svc = await session.get(Services, 1)
            if svc is None:
                svc = Services(service_name='Test Service', service_code='TEST', base_fee=0)
                session.add(svc)
                await session.commit()
                await session.refresh(svc)

            from crud.users import create_user
            from crud.applications import create_application
            suffix = uuid.uuid4().hex[:8]
            nic = f"123456{suffix}V"
            email = f"testuser+{suffix}@example.com"
            user = await create_user(session, 'Test User', nic, email, 'password', '0712345678', 'Test Address')
            app_obj = await create_application(session, user.user_id, svc.service_id, None)
            return user, app_obj
    return asyncio.run(_inner())


def test_upload_document_db(monkeypatch, tmp_path):
    # Prepare dummy file and user
    dummy_file = DummyUploadFile("file.pdf", b"hello world", "application/pdf")
    user, app_obj = _create_user_and_app()

    # Use DB-backed add_document implementation; ensure storage writes to tmp_path
    monkeypatch.chdir(tmp_path)

    # Use a real AsyncSession and call the async endpoint with it
    Session = get_sessionmaker()

    async def _call():
        async with Session() as session:
            result = await upload_document(app_obj.application_id, "Sales Agreement", dummy_file, db=session, current_user=user)
            return result

    result = asyncio.run(_call())

    assert hasattr(result, 'minio_object_key') or hasattr(result, 'file_path')
    # UploadedDocuments uses 'file_name' column; assert that instead of legacy 'name'
    assert result.file_name == "file.pdf"
    assert getattr(result, 'download_url', None) is not None
