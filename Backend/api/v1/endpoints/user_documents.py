from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import os

from database.session import get_db
from schemas.user_schemas import DocumentResponse
from api.v1.endpoints.user_auth import get_current_user
from crud.documents import list_user_documents, list_application_documents, get_document_by_id
from crud.applications import add_document
from tools.minio_storage import upload_file_to_minio, generate_presigned_url

router = APIRouter(prefix="/user/documents", tags=["user-documents"])

@router.get("/", response_model=List[DocumentResponse])
async def list_my_documents(db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    docs = await list_user_documents(db, current_user.user_id)
    return docs

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(application_id: int = Form(...), document_type: str = Form(...), file: UploadFile = File(...), db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    # Validate application ownership
    from crud.applications import get_application
    app = await get_application(db, application_id, current_user.user_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found or not owned by user")

    # Validate document type
    allowed = [
        "Sales Agreement",
        "Current Title Deed",
        "Photo ID (Buyer & Seller)",
    ]
    if document_type not in allowed:
        raise HTTPException(status_code=400, detail="Invalid document type")

    # Upload to MinIO
    try:
        content = await file.read()
        object_key = f"applications/{application_id}/{int(__import__('time').time())}_{file.filename}"
        upload_file_to_minio(object_key, content, file.content_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to upload file")

    file_path = object_key
    doc = await add_document(db, application_id, document_type, file.filename, file_path)
    # Attach a presigned URL for client-side download in response metadata (short-lived)
    url = generate_presigned_url(object_key)
    # Prefer to return the original doc object (set attribute) so direct calls receive the object
    try:
        setattr(doc, 'download_url', url)
    except Exception:
        # If it's a dict-like, add the key
        if hasattr(doc, '__dict__'):
            doc.__dict__['download_url'] = url
        elif isinstance(doc, dict):
            doc['download_url'] = url
    return doc

@router.get("/{document_id}/download")
async def download_document(document_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    """Return a short-lived download URL for the requested document if the user owns it."""
    # import here to avoid circular import at module load time
    from crud.documents import get_document_by_id

    doc = await get_document_by_id(db, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    # basic ownership check: require the requesting user to be the document owner
    # the Retrieved doc object may expose user_id or application.user_id depending on ORM
    owner_id = getattr(doc, 'user_id', None)
    if owner_id is None:
        # try application owner lookup if available
        try:
            owner_id = doc.application.user_id
        except Exception:
            owner_id = None
    if owner_id is not None and owner_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    # resolve stored object key
    object_key = getattr(doc, 'minio_object_key', None) or getattr(doc, 'file_path', None)
    if not object_key:
        raise HTTPException(status_code=500, detail="Document storage key missing")

    url = generate_presigned_url(object_key)
    if not url:
        raise HTTPException(status_code=500, detail="Failed to generate download URL")
    return {"download_url": url}

# Note: actual file download should be handled via presigned URL returned above or admin endpoints
