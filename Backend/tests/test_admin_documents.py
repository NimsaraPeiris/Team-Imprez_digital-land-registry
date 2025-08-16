import asyncio
from types import SimpleNamespace
import pytest
import importlib

from sqlalchemy.ext.asyncio import AsyncSession
from models.lro_backend_models import UploadedDocuments, LROOfficer, Application, ApplicationLog

# import module to access endpoint callables directly
admin_documents = importlib.import_module('api.v1.endpoints.admin_documents')


class DummyOfficer:
    def __init__(self, officer_id: int, user_id: int):
        self.officer_id = officer_id
        self.user_id = user_id


@pytest.mark.asyncio
async def test_list_documents_db(db: AsyncSession):
    # Create officer and two documents tied to applications
    officer = LROOfficer(officer_id=10, user_id=99, employee_id='E10')
    db.add(officer)
    await db.commit()

    # Provide reference_number to satisfy NOT NULL constraint
    app1 = Application(application_id=1, user_id=1, service_id=1, status_id=1, reference_number='REF-1')
    app2 = Application(application_id=2, user_id=2, service_id=1, status_id=1, reference_number='REF-2')
    db.add_all([app1, app2])
    await db.commit()

    doc1 = UploadedDocuments(document_id=1, application_id=1, document_type="Sales Agreement", file_name="file.pdf", file_path="applications/1/file.pdf", verification_status='Pending')
    doc2 = UploadedDocuments(document_id=2, application_id=2, document_type="Title Deed", file_name="deed.pdf", file_path="applications/2/deed.pdf", verification_status='Verified')
    db.add_all([doc1, doc2])
    await db.commit()

    # Call the endpoint function directly
    result = await admin_documents.list_documents(db=db, officer=officer)
    assert isinstance(result, list)
    assert len(result) >= 2


@pytest.mark.asyncio
async def test_verify_document_db(db: AsyncSession):
    officer = LROOfficer(officer_id=11, user_id=100, employee_id='E11')
    db.add(officer)
    await db.commit()

    # Provide reference_number to satisfy NOT NULL constraint
    app = Application(application_id=3, user_id=3, service_id=1, status_id=1, reference_number='REF-3')
    db.add(app)
    await db.commit()

    doc = UploadedDocuments(document_id=3, application_id=3, document_type="Title Deed", file_name="d.pdf", file_path="applications/3/d.pdf", verification_status='Pending')
    db.add(doc)
    await db.commit()

    payload = SimpleNamespace(verification_status=SimpleNamespace(value='Verified'), remarks='ok')

    # should not raise
    await admin_documents.verify_document(3, payload, db=db, officer=officer)

    # reload doc
    refreshed = await db.get(UploadedDocuments, 3)
    assert refreshed.verification_status == 'Verified'
    # verify a log entry created
    logs = await db.execute(ApplicationLog.__table__.select().where(ApplicationLog.application_id==3))
    rows = logs.fetchall()
    assert len(rows) >= 1

    # not found case
    with pytest.raises(Exception):
        await admin_documents.verify_document(999, payload, db=db, officer=officer)
