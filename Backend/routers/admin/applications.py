# backend/routers/admin/applications.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from db.lro_backend_models import Application, User, Services, ApplicationStatus, ApplicationLog, LROOfficer, get_db
from schemas.admin_schemas import ApplicationReviewResponse, ApplicationStatusUpdateRequest, ApplicationLogResponse
from routers.user.auth import bearer_scheme  # reuse bearer; admin token must refer to an officer/admin

import jwt, os

JWT_SECRET = os.getenv("JWT_SECRET", "CHANGE_ME")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

router = APIRouter(prefix="/admin/applications", tags=["admin-applications"])

async def get_current_officer(credentials=Depends(bearer_scheme), db: AsyncSession = Depends(get_db)) -> LROOfficer:
    token = credentials.credentials
    try:
        data = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user_id = data.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    # find officer by user_id
    stmt = select(LROOfficer).where(LROOfficer.user_id == int(user_id))
    r = await db.execute(stmt)
    officer = r.scalars().first()
    if not officer:
        raise HTTPException(status_code=403, detail="Officer access required")
    return officer

@router.get("/", response_model=List[ApplicationReviewResponse])
async def list_all_applications(db: AsyncSession = Depends(get_db), current_officer: LROOfficer = Depends(get_current_officer)):
    stmt = (
        select(
            Application.application_id,
            Application.user_id,
            User.full_name,
            Application.service_id,
            Services.service_name,
            Application.status_id,
            ApplicationStatus.status_name,
            Application.application_date,
            Application.reference_number
        )
        .join(User, Application.user_id == User.user_id)
        .join(Services, Application.service_id == Services.service_id)
        .join(ApplicationStatus, Application.status_id == ApplicationStatus.status_id)
        .order_by(Application.application_date.desc())
    )
    r = await db.execute(stmt)
    rows = r.all()
    # map to schema list
    result = []
    for row in rows:
        result.append({
            "application_id": row[0],
            "user_id": row[1],
            "user_full_name": row[2],
            "service_id": row[3],
            "service_name": row[4],
            "status_id": row[5],
            "status_name": row[6],
            "application_date": row[7],
            "reference_number": row[8],
        })
    return result

@router.get("/{application_id}", response_model=ApplicationReviewResponse)
async def get_application(application_id: int, db: AsyncSession = Depends(get_db), current_officer: LROOfficer = Depends(get_current_officer)):
    stmt = (
        select(
            Application.application_id,
            Application.user_id,
            User.full_name,
            Application.service_id,
            Services.service_name,
            Application.status_id,
            ApplicationStatus.status_name,
            Application.application_date,
            Application.reference_number
        )
        .join(User, Application.user_id == User.user_id)
        .join(Services, Application.service_id == Services.service_id)
        .join(ApplicationStatus, Application.status_id == ApplicationStatus.status_id)
        .where(Application.application_id == application_id)
    )
    r = await db.execute(stmt)
    row = r.first()
    if not row:
        raise HTTPException(status_code=404, detail="Application not found")
    return {
        "application_id": row[0],
        "user_id": row[1],
        "user_full_name": row[2],
        "service_id": row[3],
        "service_name": row[4],
        "status_id": row[5],
        "status_name": row[6],
        "application_date": row[7],
        "reference_number": row[8],
    }

@router.post("/{application_id}/status", status_code=status.HTTP_204_NO_CONTENT)
async def update_application_status(application_id: int, payload: ApplicationStatusUpdateRequest, db: AsyncSession = Depends(get_db), officer: LROOfficer = Depends(get_current_officer)):
    # verify application exists
    stmt = select(Application).where(Application.application_id == application_id)
    r = await db.execute(stmt)
    app = r.scalars().first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    # verify status exists
    sstmt = select(ApplicationStatus).where(ApplicationStatus.status_id == payload.status_id)
    sr = await db.execute(sstmt)
    status_obj = sr.scalars().first()
    if not status_obj:
        raise HTTPException(status_code=400, detail="Invalid status id")

    app.status_id = payload.status_id
    app.last_updated_at = __import__("datetime").datetime.utcnow()
    app.assigned_officer_id = officer.officer_id
    db.add(app)
    await db.commit()

    # log
    log = ApplicationLog(application_id=app.application_id, officer_id=officer.officer_id, action_taken=f"Status set to {status_obj.status_name}", remarks=payload.remarks)
    db.add(log)
    await db.commit()
    return

@router.get("/{application_id}/logs", response_model=List[ApplicationLogResponse])
async def get_application_logs(application_id: int, db: AsyncSession = Depends(get_db), officer: LROOfficer = Depends(get_current_officer)):
    stmt = select(ApplicationLog).where(ApplicationLog.application_id == application_id).order_by(ApplicationLog.timestamp.desc())
    r = await db.execute(stmt)
    logs = r.scalars().all()
    return logs
