# backend/routers/user/applications.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from db.lro_backend_models import Application, Services, UploadedDocuments, ApplicationStatus, ApplicationLog, get_db
from schemas.user_schemas import ApplicationCreateRequest, ApplicationResponse, DocumentCreateRequest, DocumentResponse
from routers.user.auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/user/applications", tags=["user-applications"])

@router.get("/", response_model=List[ApplicationResponse])
async def list_user_applications(db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    stmt = select(Application).where(Application.user_id == current_user.user_id).order_by(Application.application_date.desc())
    res = await db.execute(stmt)
    apps = res.scalars().all()
    return apps

@router.post("/", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
async def create_application(payload: ApplicationCreateRequest, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    # Validate service exists
    svc_q = select(Services).where(Services.service_id == payload.service_id)
    svc_r = await db.execute(svc_q)
    svc = svc_r.scalars().first()
    if not svc:
        raise HTTPException(status_code=400, detail="Service not found")

    app = Application(
        user_id=current_user.user_id,
        service_id=payload.service_id,
        application_date=datetime.utcnow(),
        status_id=1,  # assume 1 == Pending
        reference_number=payload.reference_number or f"REF-{int(datetime.utcnow().timestamp())}",
        last_updated_at=datetime.utcnow()
    )
    db.add(app)
    await db.commit()
    await db.refresh(app)

    # log creation
    log = ApplicationLog(application_id=app.application_id, officer_id=None, action_taken="Created by user", remarks=None)
    db.add(log)
    await db.commit()

    return app

@router.get("/{application_id}", response_model=ApplicationResponse)
async def get_application(application_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    q = select(Application).where(Application.application_id == application_id, Application.user_id == current_user.user_id)
    r = await db.execute(q)
    app = r.scalars().first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app

# Document metadata attach (file upload handled externally)
@router.post("/documents", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def add_document(payload: DocumentCreateRequest, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    # check app ownership
    q = select(Application).where(Application.application_id == payload.application_id, Application.user_id == current_user.user_id)
    r = await db.execute(q)
    app = r.scalars().first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found or not owned by user")

    doc = UploadedDocuments(
        application_id=payload.application_id,
        document_type=payload.document_type,
        file_name=payload.file_name,
        file_path=payload.file_path
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    return doc

@router.get("/{application_id}/documents", response_model=List[DocumentResponse])
async def list_app_documents(application_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    stmt = select(UploadedDocuments).where(UploadedDocuments.application_id == application_id)
    res = await db.execute(stmt)
    docs = res.scalars().all()
    # verify ownership
    if docs:
        # ensure the application belongs to current user
        if docs[0].application.user_id != current_user.user_id:
            raise HTTPException(status_code=403, detail="Forbidden")
    return docs
