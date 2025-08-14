from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Dict, Any
from models.lro_backend_models import Application, User, Services, ApplicationStatus, ApplicationLog

async def list_all_applications(db: AsyncSession) -> List[Dict[str, Any]]:
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
            Application.reference_number,
        )
        .join(User, Application.user_id == User.user_id)
        .join(Services, Application.service_id == Services.service_id)
        .join(ApplicationStatus, Application.status_id == ApplicationStatus.status_id)
        .order_by(Application.application_date.desc())
    )
    r = await db.execute(stmt)
    rows = r.all()
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

async def get_application_detail(db: AsyncSession, application_id: int) -> Dict[str, Any] | None:
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
            Application.reference_number,
        )
        .join(User, Application.user_id == User.user_id)
        .join(Services, Application.service_id == Services.service_id)
        .join(ApplicationStatus, Application.status_id == ApplicationStatus.status_id)
        .where(Application.application_id == application_id)
    )
    r = await db.execute(stmt)
    row = r.first()
    if not row:
        return None
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

async def update_application_status(db: AsyncSession, application_id: int, status_id: int, officer_id: int, remarks: str | None = None) -> None:
    stmt = select(Application).where(Application.application_id == application_id)
    r = await db.execute(stmt)
    app = r.scalars().first()
    if not app:
        raise ValueError("Application not found")

    sstmt = select(ApplicationStatus).where(ApplicationStatus.status_id == status_id)
    sr = await db.execute(sstmt)
    status_obj = sr.scalars().first()
    if not status_obj:
        raise ValueError("Invalid status id")

    app.status_id = status_id
    import datetime as _dt
    app.last_updated_at = _dt.datetime.utcnow()
    app.assigned_officer_id = officer_id
    db.add(app)
    await db.commit()

    # log
    log = ApplicationLog(application_id=app.application_id, officer_id=officer_id, action_taken=f"Status set to {status_obj.status_name}", remarks=remarks)
    db.add(log)
    await db.commit()

async def get_application_logs(db: AsyncSession, application_id: int) -> List[ApplicationLog]:
    stmt = select(ApplicationLog).where(ApplicationLog.application_id == application_id).order_by(ApplicationLog.timestamp.desc())
    r = await db.execute(stmt)
    return r.scalars().all()
