# backend/routers/user/payments.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from models.lro_backend_models import Payments, Application, PaymentStatusEnum
from database.session import get_db
from schemas.user_schemas import PaymentCreateRequest, PaymentResponse
from crud.payments import create_payment_for_application, list_payments_for_application
from api.v1.endpoints.user_auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/user/payments", tags=["user-payments"])

@router.post("/", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
async def create_payment(payload: PaymentCreateRequest, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    p = await create_payment_for_application(db, payload, current_user.user_id)
    return p

@router.get("/application/{application_id}", response_model=List[PaymentResponse])
async def list_payments_for_application_endpoint(application_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    payments = await list_payments_for_application(db, application_id, current_user.user_id)
    return payments

# Compatibility shim — re-export the new endpoint router
from api.v1.endpoints.user_payments import router as router

__all__ = ["router"]
