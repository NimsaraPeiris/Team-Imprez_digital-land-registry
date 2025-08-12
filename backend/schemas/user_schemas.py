from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, constr, Field
from enum import Enum

# --- ENUMS ---
class VerificationStatusEnum(str, Enum):
    pending = "Pending"
    verified = "Verified"
    rejected = "Rejected"

class PaymentStatusEnum(str, Enum):
    pending = "Pending"
    completed = "Completed"
    failed = "Failed"

# --- AUTH ---
class UserLoginRequest(BaseModel):
    email: EmailStr
    password: constr(min_length=8)

class UserRegisterRequest(BaseModel):
    full_name: constr(strip_whitespace=True, min_length=2)
    nic_number: constr(min_length=10, max_length=12)
    email: EmailStr
    phone_number: constr(min_length=10, max_length=15)
    password: constr(min_length=8)
    address: Optional[str]

class UserResponse(BaseModel):
    user_id: int
    full_name: str
    email: EmailStr
    nic_number: str
    phone_number: str
    address: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True

# --- SERVICES ---
class ServiceResponse(BaseModel):
    service_id: int
    service_name: str
    service_code: str
    base_fee: float

    class Config:
        orm_mode = True

# --- APPLICATIONS ---
class ApplicationCreateRequest(BaseModel):
    service_id: int
    reference_number: Optional[str]

class ApplicationResponse(BaseModel):
    application_id: int
    service_id: int
    status_id: int
    application_date: datetime
    reference_number: Optional[str]
    last_updated_at: datetime

    class Config:
        orm_mode = True

# --- DOCUMENTS ---
class DocumentUploadRequest(BaseModel):
    document_type: str
    file_name: str
    file_path: str

class DocumentResponse(BaseModel):
    document_id: int
    document_type: str
    file_name: str
    file_path: str
    verification_status: VerificationStatusEnum
    uploaded_at: datetime

    class Config:
        orm_mode = True

# --- PAYMENTS ---
class PaymentCreateRequest(BaseModel):
    amount: float
    payment_method: str
    transaction_reference: Optional[str]

class PaymentResponse(BaseModel):
    payment_id: int
    amount: float
    payment_date: datetime
    payment_method: str
    transaction_reference: Optional[str]
    payment_status: PaymentStatusEnum

    class Config:
        orm_mode = True
