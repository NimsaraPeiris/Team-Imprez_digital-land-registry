from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from database.session import get_db
from schemas.admin_schemas import DocumentReviewRequest, DocumentAdminResponse
from api.v1.endpoints.user_auth import get_current_user, bearer_scheme
from crud.documents import list_documents_for_application, get_document_by_id, set_document_verification, list_all_documents
from models.lro_backend_models import LROOfficer

router = APIRouter(prefix="/admin/documents", tags=["admin-documents"])

async def get_current_officer(credentials=Depends(bearer_scheme), db: AsyncSession = Depends(get_db)) -> LROOfficer:
    token = credentials.credentials
    # decode token and map to LROOfficer by user id
    import os, jwt
    JWT_SECRET = os.getenv("JWT_SECRET", "CHANGE_ME")
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
    try:
        data = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user_id = data.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    from models.lro_backend_models import LROOfficer as _Officer
    stmt = select(_Officer).where(_Officer.user_id == int(user_id))
    r = await db.execute(stmt)
    officer = r.scalars().first()
    if not officer:
        raise HTTPException(status_code=403, detail="Officer access required")
    return officer

@router.get("/", response_model=list[DocumentAdminResponse])
async def list_documents(db: AsyncSession = Depends(get_db), officer: LROOfficer = Depends(get_current_officer)):
    docs = await list_all_documents(db)
    return docs

@router.post("/{document_id}/verify", status_code=status.HTTP_204_NO_CONTENT)
async def verify_document(document_id: int, payload: DocumentReviewRequest, db: AsyncSession = Depends(get_db), officer: LROOfficer = Depends(get_current_officer)):
    # delegate to CRUD function
    doc = await set_document_verification(db, document_id, payload.verification_status.value, officer.officer_id, payload.remarks)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return
