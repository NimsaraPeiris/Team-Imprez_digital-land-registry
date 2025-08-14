# backend/schemas/user_schemas.py
from pydantic import BaseModel, EmailStr, constr
from typing import Optional, List
from datetime import datetime
from .common import VerificationStatusEnum, PaymentStatusEnum

# ---- Auth ----
class UserRegisterRequest(BaseModel):
    full_name: constr(min_length=2)
    nic_number: constr(min_length=6)
    email: EmailStr
    phone_number: Optional[constr(min_length=7)] = None
    password: constr(min_length=8)
    address: Optional[str] = None

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: constr(min_length=8)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    user_id: int
    full_name: str
    nic_number: str
    email: EmailStr
    phone_number: Optional[str]
    address: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True

# ---- Services ----
class ServiceResponse(BaseModel):
    service_id: int
    service_name: str
    service_code: str
    base_fee: float

    class Config:
        orm_mode = True

# ---- Applications ----
class ApplicationCreateRequest(BaseModel):
    service_id: int
    reference_number: Optional[str] = None
    # application-specific detail objects are created separately (e.g., land transfer)

class ApplicationResponse(BaseModel):
    application_id: int
    user_id: int
    service_id: int
    application_date: datetime
    status_id: int
    assigned_officer_id: Optional[int]
    reference_number: Optional[str]
    last_updated_at: datetime

    class Config:
        orm_mode = True

# ---- Documents ----
class DocumentCreateRequest(BaseModel):
    application_id: int
    document_type: str
    file_name: str
    file_path: str  # secure path / signed URL / storage key

class DocumentResponse(BaseModel):
    document_id: int
    application_id: int
    document_type: str
    file_name: str
    file_path: str
    verification_status: VerificationStatusEnum
    uploaded_at: datetime

    class Config:
        orm_mode = True

# ---- Payments ----
class PaymentCreateRequest(BaseModel):
    application_id: int
    amount: float
    payment_method: str
    transaction_reference: Optional[str] = None

class PaymentResponse(BaseModel):
    payment_id: int
    application_id: int
    amount: float
    payment_date: datetime
    payment_method: str
    transaction_reference: Optional[str]
    payment_status: PaymentStatusEnum

    class Config:
        orm_mode = True
