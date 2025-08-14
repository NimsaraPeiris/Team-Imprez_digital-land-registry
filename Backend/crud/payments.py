from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.lro_backend_models import Payments, Application, PaymentStatusEnum
from datetime import datetime

async def create_payment_for_application(db: AsyncSession, payload, user_id: int):
    # verify application belongs to user
    q = select(Application).where(Application.application_id == payload.application_id, Application.user_id == user_id)
    r = await db.execute(q)
    app = r.scalars().first()
    if not app:
        raise ValueError("Application not found or not owned by user")

    p = Payments(
        application_id=payload.application_id,
        amount=payload.amount,
        payment_method=payload.payment_method,
        transaction_reference=payload.transaction_reference,
        payment_status=PaymentStatusEnum.COMPLETED.value,
    )
    db.add(p)
    await db.commit()
    await db.refresh(p)
    return p

async def list_payments_for_application(db: AsyncSession, application_id: int, user_id: int):
    q = select(Payments).where(Payments.application_id == application_id)
    r = await db.execute(q)
    payments = r.scalars().all()
    if payments:
        if payments[0].application.user_id != user_id:
            raise ValueError("Forbidden")
    return payments
