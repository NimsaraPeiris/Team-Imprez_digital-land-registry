from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from db.lro_backend_models import Applications, Services, UploadedDocuments
from db.session import get_db
from schemas.user_schemas import ApplicationCreateRequest, ApplicationResponse
from datetime import datetime

router = APIRouter(prefix="/applications", tags=["User Applications"])

@router.post("/", response_model=ApplicationResponse)
async def create_application(
    payload: ApplicationCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user_id: int = Depends(...)  # TODO: implement auth dependency
):
    new_app = Applications(
        user_id=current_user_id,
        service_id=payload.service_id,
        application_date=datetime.utcnow(),
        status_id=1,  # Pending
        reference_number=payload.reference_number,
        last_updated_at=datetime.utcnow()
    )
    db.add(new_app)
    await db.commit()
    await db.refresh(new_app)
    return new_app
