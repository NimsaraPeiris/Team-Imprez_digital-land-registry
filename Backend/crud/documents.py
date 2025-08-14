from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from models.lro_backend_models import UploadedDocuments, ApplicationLog

async def list_user_documents(db: AsyncSession, user_id: int) -> List[UploadedDocuments]:
    stmt = select(UploadedDocuments).join(UploadedDocuments.application).where(UploadedDocuments.application.has(user_id=user_id))
    r = await db.execute(stmt)
    return r.scalars().all()

async def list_documents_for_application(db: AsyncSession, application_id: int) -> List[UploadedDocuments]:
    stmt = select(UploadedDocuments).where(UploadedDocuments.application_id == application_id)
    r = await db.execute(stmt)
    return r.scalars().all()

async def get_document_by_id(db: AsyncSession, document_id: int) -> UploadedDocuments | None:
    stmt = select(UploadedDocuments).where(UploadedDocuments.document_id == document_id)
    r = await db.execute(stmt)
    return r.scalars().first()

async def set_document_verification(db: AsyncSession, document_id: int, verification_status: str, officer_id: int, remarks: str | None = None):
    doc = await get_document_by_id(db, document_id)
    if not doc:
        return None
    doc.verification_status = verification_status
    db.add(doc)
    await db.commit()
    # add log
    log = ApplicationLog(application_id=doc.application_id, officer_id=officer_id, action_taken=f"Document {document_id} set to {verification_status}", remarks=remarks)
    db.add(log)
    await db.commit()
    return doc

async def list_all_documents(db: AsyncSession) -> List[UploadedDocuments]:
    """Return all uploaded documents ordered by upload time (newest first)."""
    stmt = select(UploadedDocuments).order_by(UploadedDocuments.uploaded_at.desc())
    r = await db.execute(stmt)
    return r.scalars().all()

async def list_application_documents(db: AsyncSession, application_id: int) -> List[UploadedDocuments]:
    """Compatibility wrapper for previous function name used by endpoints."""
    return await list_documents_for_application(db, application_id)
