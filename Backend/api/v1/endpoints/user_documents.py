from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from database.session import get_db
from schemas.user_schemas import DocumentResponse
from api.v1.endpoints.user_auth import get_current_user
from crud.documents import list_user_documents, list_application_documents, get_document_by_id

router = APIRouter(prefix="/user/documents", tags=["user-documents"])

@router.get("/", response_model=List[DocumentResponse])
async def list_my_documents(db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    docs = await list_user_documents(db, current_user.user_id)
    return docs

# Note: actual file download should be handled via signed URLs from secure storage
