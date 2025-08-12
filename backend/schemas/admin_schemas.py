from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel
from enum import Enum
from .user_schemas import VerificationStatusEnum, PaymentStatusEnum

# --- APPLICATION MANAGEMENT ---
class ApplicationReviewResponse(BaseModel):
    application_id: int
    user_full_name: str
    service_name: str
    status_name: str
    application_date: datetime
    reference_number: Optional[str]

class ApplicationStatusUpdateRequest(BaseModel):
    status_id: int
    remarks: Optional[str]

# --- DOCUMENT REVIEW ---
class DocumentReviewResponse(BaseModel):
    document_id: int
    document_type: str
    file_name: str
    file_path: str
    verification_status: VerificationStatusEnum
    uploaded_at: datetime

class DocumentVerificationRequest(BaseModel):
    verification_status: VerificationStatusEnum
    remarks: Optional[str]

# --- LOG ---
class ApplicationLogEntry(BaseModel):
    log_id: int
    action_taken: str
    remarks: Optional[str]
    timestamp: datetime
    officer_id: int

    class Config:
        orm_mode = True
