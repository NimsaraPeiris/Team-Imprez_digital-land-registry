from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from db.lro_backend_models import Applications, Users, Services, ApplicationStatus
from db.session import get_db
from schemas.admin_schemas import ApplicationReviewResponse

router = APIRouter(prefix="/admin/applications", tags=["Admin Applications"])

@router.get("/", response_model=list[ApplicationReviewResponse])
async def list_applications(db: AsyncSession = Depends(get_db)):
    stmt = (
        select(
            Applications.application_id,
            Users.full_name,
            Services.service_name,
            ApplicationStatus.status_name,
            Applications.application_date,
            Applications.reference_number
        )
        .join(Users, Applications.user_id == Users.user_id)
        .join(Services, Applications.service_id == Services.service_id)
        .join(ApplicationStatus, Applications.status_id == ApplicationStatus.status_id)
    )
    results = await db.execute(stmt)
    return results.all()
