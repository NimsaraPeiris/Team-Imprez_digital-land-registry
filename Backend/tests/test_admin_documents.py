import asyncio
from types import SimpleNamespace
import pytest
import importlib

# import module to access endpoint callables directly
admin_documents = importlib.import_module('api.v1.endpoints.admin_documents')


class DummyOfficer:
    def __init__(self, officer_id: int, user_id: int):
        self.officer_id = officer_id
        self.user_id = user_id


def test_list_documents_monkeypatched(monkeypatch):
    # Prepare fake documents list
    fake_docs = [
        SimpleNamespace(document_id=1, application_id=1, document_type="Sales Agreement", file_name="file.pdf", file_path="applications/1/file.pdf", verification_status=SimpleNamespace(value='Pending'), uploaded_at=None),
        SimpleNamespace(document_id=2, application_id=2, document_type="Title Deed", file_name="deed.pdf", file_path="applications/2/deed.pdf", verification_status=SimpleNamespace(value='Verified'), uploaded_at=None),
    ]

    async def fake_list_all_documents(db):
        return fake_docs

    # Patch the function as imported into the admin_documents module
    monkeypatch.setattr(admin_documents, 'list_all_documents', fake_list_all_documents)

    officer = DummyOfficer(officer_id=10, user_id=99)

    result = asyncio.run(admin_documents.list_documents(db=None, officer=officer))
    assert isinstance(result, list)
    assert len(result) == 2
    assert result[0].document_id == 1


def test_verify_document_monkeypatched(monkeypatch):
    # success case
    async def fake_set_document_verification(db, document_id, verification_status, officer_id, remarks):
        return SimpleNamespace(document_id=document_id)

    # Patch the function as imported into the admin_documents module
    monkeypatch.setattr(admin_documents, 'set_document_verification', fake_set_document_verification)

    payload = SimpleNamespace(verification_status=SimpleNamespace(value='Verified'), remarks='ok')
    officer = DummyOfficer(officer_id=11, user_id=100)

    # should not raise
    asyncio.run(admin_documents.verify_document(1, payload, db=None, officer=officer))

    # not found case
    async def fake_set_document_verification_none(db, document_id, verification_status, officer_id, remarks):
        return None

    monkeypatch.setattr(admin_documents, 'set_document_verification', fake_set_document_verification_none)

    with pytest.raises(Exception):
        # calling should raise HTTPException
        asyncio.run(admin_documents.verify_document(999, payload, db=None, officer=officer))
