# backend/schemas/admin_schemas.py
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .common import VerificationStatusEnum

class ApplicationReviewResponse(BaseModel):
    application_id: int
    user_id: int
    user_full_name: str
    service_id: int
    service_name: str
    status_id: int
    status_name: str
    application_date: datetime
    reference_number: Optional[str]

    class Config:
        orm_mode = True

class ApplicationStatusUpdateRequest(BaseModel):
    status_id: int
    remarks: Optional[str] = None

class DocumentReviewRequest(BaseModel):
    verification_status: VerificationStatusEnum
    remarks: Optional[str] = None

class DocumentAdminResponse(BaseModel):
    document_id: int
    application_id: int
    document_type: str
    file_name: str
    file_path: str
    verification_status: VerificationStatusEnum
    uploaded_at: datetime

    class Config:
        orm_mode = True

class ApplicationLogResponse(BaseModel):
    log_id: int
    application_id: int
    officer_id: Optional[int]
    action_taken: str
    remarks: Optional[str]
    timestamp: datetime

    class Config:
        orm_mode = True
