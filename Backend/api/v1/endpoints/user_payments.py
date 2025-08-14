from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from database.session import get_db
from schemas.user_schemas import PaymentCreateRequest, PaymentResponse
from api.v1.endpoints.user_auth import get_current_user
from crud.payments import create_payment_for_application, list_payments_for_application

router = APIRouter(prefix="/user/payments", tags=["user-payments"])

@router.post("/", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
async def create_payment(payload: PaymentCreateRequest, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    try:
        p = await create_payment_for_application(db, payload, current_user.user_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return p

@router.get("/application/{application_id}", response_model=List[PaymentResponse])
async def list_payments_for_application_endpoint(application_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    try:
        payments = await list_payments_for_application(db, application_id, current_user.user_id)
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))
    return payments
