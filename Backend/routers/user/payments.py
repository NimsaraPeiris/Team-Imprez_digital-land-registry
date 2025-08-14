# backend/routers/user/payments.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from db.lro_backend_models import Payments, Application, get_db
from schemas.user_schemas import PaymentCreateRequest, PaymentResponse
from routers.user.auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/user/payments", tags=["user-payments"])

@router.post("/", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
async def create_payment(payload: PaymentCreateRequest, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    # verify application belongs to user
    q = select(Application).where(Application.application_id == payload.application_id, Application.user_id == current_user.user_id)
    r = await db.execute(q)
    app = r.scalars().first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found or not owned by user")

    p = Payments(
        application_id=payload.application_id,
        amount=payload.amount,
        payment_method=payload.payment_method,
        transaction_reference=payload.transaction_reference,
        payment_status="Completed"  # would normally be set by payment gateway callback
    )
    db.add(p)
    await db.commit()
    await db.refresh(p)
    return p

@router.get("/application/{application_id}", response_model=List[PaymentResponse])
async def list_payments_for_application(application_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    q = select(Payments).where(Payments.application_id == application_id)
    r = await db.execute(q)
    payments = r.scalars().all()
    # optional ownership check
    if payments:
        if payments[0].application.user_id != current_user.user_id:
            raise HTTPException(status_code=403, detail="Forbidden")
    return payments
