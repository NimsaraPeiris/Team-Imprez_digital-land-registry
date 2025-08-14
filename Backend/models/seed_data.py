from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.lro_backend_models import ApplicationStatus, Services

async def seed_initial_data(session: AsyncSession):
    # Check if data already exists before inserting
    existing_statuses = await session.execute(select(ApplicationStatus))
    if not existing_statuses.scalars().first():
        session.add_all([
            ApplicationStatus(status_id=1, status_name="Pending"),
            ApplicationStatus(status_id=2, status_name="Under Review"),
            ApplicationStatus(status_id=3, status_name="Approved"),
            ApplicationStatus(status_id=4, status_name="Rejected"),
        ])

    existing_services = await session.execute(select(Services))
    if not existing_services.scalars().first():
        session.add_all([
            Services(service_id=1, service_name="Land Transfer", service_code="LT", base_fee=1000.00),
        ])

    await session.commit()
