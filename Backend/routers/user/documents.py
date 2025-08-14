# backend/routers/user/documents.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from db.lro_backend_models import UploadedDocuments, get_db
from schemas.user_schemas import DocumentResponse
from routers.user.auth import get_current_user

router = APIRouter(prefix="/user/documents", tags=["user-documents"])

@router.get("/", response_model=List[DocumentResponse])
async def list_my_documents(db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    stmt = select(UploadedDocuments).join(UploadedDocuments.application).where(UploadedDocuments.application.has(user_id=current_user.user_id))
    r = await db.execute(stmt)
    docs = r.scalars().all()
    return docs

# Note: actual file download should be handled via signed URLs from secure storage
