from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from database.session import get_db
from schemas.user_schemas import ApplicationCreateRequest, ApplicationResponse, DocumentCreateRequest, DocumentResponse
from api.v1.endpoints.user_auth import get_current_user
from crud.applications import list_user_applications, create_application, get_application, add_document, list_application_documents

router = APIRouter(prefix="/user/applications", tags=["user-applications"])

@router.get("/", response_model=List[ApplicationResponse])
async def list_user_applications_endpoint(db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    apps = await list_user_applications(db, current_user.user_id)
    return apps

@router.post("/", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
async def create_application_endpoint(payload: ApplicationCreateRequest, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    app = await create_application(db, current_user.user_id, payload.service_id, payload.reference_number)
    return app

@router.get("/{application_id}", response_model=ApplicationResponse)
async def get_application_endpoint(application_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    app = await get_application(db, application_id, current_user.user_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app

@router.post("/documents", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def add_document_endpoint(payload: DocumentCreateRequest, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    a = await get_application(db, payload.application_id, current_user.user_id)
    if not a:
        raise HTTPException(status_code=404, detail="Application not found or not owned by user")
    doc = await add_document(db, payload.application_id, payload.document_type, payload.file_name, payload.file_path)
    return doc

@router.get("/{application_id}/documents", response_model=List[DocumentResponse])
async def list_app_documents_endpoint(application_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    docs = await list_application_documents(db, application_id)
    if docs:
        if docs[0].application.user_id != current_user.user_id:
            raise HTTPException(status_code=403, detail="Forbidden")
    return docs
