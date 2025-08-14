from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
import os, jwt

from database.session import get_db
from schemas.admin_schemas import ApplicationReviewResponse, ApplicationStatusUpdateRequest, ApplicationLogResponse
from models.lro_backend_models import LROOfficer
from crud.admin_applications import list_all_applications, get_application_detail, update_application_status, get_application_logs

JWT_SECRET = os.getenv("JWT_SECRET", "CHANGE_ME")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

router = APIRouter(prefix="/admin/applications", tags=["admin-applications"])

# Reuse bearer from user auth
from api.v1.endpoints.user_auth import bearer_scheme

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
    from models.lro_backend_models import LROOfficer as _Officer
    stmt = select(_Officer).where(_Officer.user_id == int(user_id))
    r = await db.execute(stmt)
    officer = r.scalars().first()
    if not officer:
        raise HTTPException(status_code=403, detail="Officer access required")
    return officer

@router.get("/", response_model=List[ApplicationReviewResponse])
async def list_all_applications_endpoint(db: AsyncSession = Depends(get_db), current_officer: LROOfficer = Depends(get_current_officer)):
    rows = await list_all_applications(db)
    return rows

@router.get("/{application_id}", response_model=ApplicationReviewResponse)
async def get_application_endpoint(application_id: int, db: AsyncSession = Depends(get_db), current_officer: LROOfficer = Depends(get_current_officer)):
    row = await get_application_detail(db, application_id)
    if not row:
        raise HTTPException(status_code=404, detail="Application not found")
    return row

@router.post("/{application_id}/status", status_code=status.HTTP_204_NO_CONTENT)
async def update_application_status_endpoint(application_id: int, payload: ApplicationStatusUpdateRequest, db: AsyncSession = Depends(get_db), officer: LROOfficer = Depends(get_current_officer)):
    try:
        await update_application_status(db, application_id, payload.status_id, officer.officer_id, payload.remarks)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return

@router.get("/{application_id}/logs", response_model=List[ApplicationLogResponse])
async def get_application_logs_endpoint(application_id: int, db: AsyncSession = Depends(get_db), officer: LROOfficer = Depends(get_current_officer)):
    logs = await get_application_logs(db, application_id)
    return logs
