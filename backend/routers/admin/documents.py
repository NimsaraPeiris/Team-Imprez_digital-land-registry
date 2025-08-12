# backend/routers/admin/documents.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from db.lro_backend_models import UploadedDocuments, ApplicationLog, LROOfficer, get_db
from schemas.admin_schemas import DocumentReviewRequest, DocumentAdminResponse
from routers.admin.applications import get_current_officer  # re-use same dependency

router = APIRouter(prefix="/admin/documents", tags=["admin-documents"])

@router.get("/", response_model=list[DocumentAdminResponse])
async def list_documents(db: AsyncSession = Depends(get_db), officer: LROOfficer = Depends(get_current_officer)):
    stmt = select(UploadedDocuments).order_by(UploadedDocuments.uploaded_at.desc())
    r = await db.execute(stmt)
    docs = r.scalars().all()
    return docs

@router.post("/{document_id}/verify", status_code=status.HTTP_204_NO_CONTENT)
async def verify_document(document_id: int, payload: DocumentReviewRequest, db: AsyncSession = Depends(get_db), officer: LROOfficer = Depends(get_current_officer)):
    stmt = select(UploadedDocuments).where(UploadedDocuments.document_id == document_id)
    r = await db.execute(stmt)
    doc = r.scalars().first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    doc.verification_status = payload.verification_status.value
    db.add(doc)
    await db.commit()

    # Add application log entry
    log = ApplicationLog(application_id=doc.application_id, officer_id=officer.officer_id, action_taken=f"Document {document_id} set to {payload.verification_status.value}", remarks=payload.remarks)
    db.add(log)
    await db.commit()
    return
