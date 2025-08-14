from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from models.lro_backend_models import Application, Services, UploadedDocuments, ApplicationLog
from datetime import datetime

async def list_user_applications(db: AsyncSession, user_id: int) -> List[Application]:
    stmt = select(Application).where(Application.user_id == user_id).order_by(Application.application_date.desc())
    r = await db.execute(stmt)
    return r.scalars().all()

async def create_application(db: AsyncSession, user_id: int, service_id: int, reference_number: str | None) -> Application:
    # validate service exists
    svc_stmt = select(Services).where(Services.service_id == service_id)
    svc_r = await db.execute(svc_stmt)
    svc = svc_r.scalars().first()
    if not svc:
        raise ValueError("Service not found")

    app = Application(
        user_id=user_id,
        service_id=service_id,
        application_date=datetime.utcnow(),
        status_id=1,
        reference_number=reference_number or f"REF-{int(datetime.utcnow().timestamp())}",
        last_updated_at=datetime.utcnow(),
    )
    db.add(app)
    await db.commit()
    await db.refresh(app)

    # create initial log
    log = ApplicationLog(application_id=app.application_id, officer_id=None, action_taken="Created by user", remarks=None)
    db.add(log)
    await db.commit()
    return app

async def get_application(db: AsyncSession, application_id: int, user_id: int | None = None) -> Application | None:
    stmt = select(Application).where(Application.application_id == application_id)
    if user_id is not None:
        stmt = stmt.where(Application.user_id == user_id)
    r = await db.execute(stmt)
    return r.scalars().first()

async def add_document(db: AsyncSession, application_id: int, document_type: str, file_name: str, file_path: str) -> UploadedDocuments:
    doc = UploadedDocuments(
        application_id=application_id,
        document_type=document_type,
        file_name=file_name,
        file_path=file_path,
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    return doc

async def list_application_documents(db: AsyncSession, application_id: int) -> List[UploadedDocuments]:
    stmt = select(UploadedDocuments).where(UploadedDocuments.application_id == application_id)
    r = await db.execute(stmt)
    return r.scalars().all()
