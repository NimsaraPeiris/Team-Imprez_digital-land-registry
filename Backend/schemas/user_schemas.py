# backend/schemas/user_schemas.py
from pydantic import BaseModel, EmailStr, Field, validator, ConfigDict
from typing import Optional
from datetime import datetime
from .common import VerificationStatusEnum, PaymentStatusEnum

# ---- Auth ----
class UserRegisterRequest(BaseModel):
    model_config = ConfigDict(validate_by_name=True, json_schema_extra={
        "example": {
            "fullName": "Saman Perera",
            "email": "saman@example.com",
            "phone": "0712345678",
            "id": "123456789V",
            "requesterType": "individual",
            "registrationOffice": "colombo"
        }
    })

    # accept both snake_case (server) and camelCase (frontend) via aliases
    full_name: str = Field(..., alias="fullName", min_length=2)
    nic_number: str = Field(..., alias="id", min_length=6)
    email: EmailStr
    phone_number: Optional[str] = Field(None, alias="phone", min_length=7)
    # password is optional because frontend verifies via OTP; backend will generate or accept a password
    password: Optional[str] = None
    # keep both address and registration_office to be compatible with old tests and new frontend
    address: Optional[str] = None
    requester_type: Optional[str] = Field(None, alias="requesterType")
    registration_office: Optional[str] = Field(None, alias="registrationOffice")

class UserLoginRequest(BaseModel):
    model_config = ConfigDict(validate_by_name=True)

    # Support both legacy email/password and new id+phone+otp flows
    email: Optional[EmailStr] = None
    password: Optional[str] = None

    # OTP flow fields (frontend uses 'id' and 'phone' and 'otp')
    id: Optional[str] = Field(None, alias="id", min_length=6)
    phone: Optional[str] = Field(None, min_length=7)
    otp: Optional[str] = Field(None, min_length=6, max_length=6)

    @validator("otp")
    def otp_must_be_digits(cls, v):
        if v is None:
            return v
        if not v.isdigit() or len(v) != 6:
            raise ValueError("OTP must be a 6-digit numeric code")
        return v

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: int
    full_name: str
    nic_number: str
    email: EmailStr
    phone_number: Optional[str]
    address: Optional[str]
    created_at: datetime

# ---- Services ----
class ServiceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    service_id: int
    service_name: str
    service_code: str
    base_fee: float

# ---- Applications ----
class ApplicationCreateRequest(BaseModel):
    service_id: int
    reference_number: Optional[str] = None
    # application-specific detail objects are created separately (e.g., land transfer)

class ApplicationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    application_id: int
    user_id: int
    service_id: int
    application_date: datetime
    status_id: int
    assigned_officer_id: Optional[int]
    reference_number: Optional[str]
    last_updated_at: datetime

# ---- Documents ----
class DocumentCreateRequest(BaseModel):
    application_id: int
    document_type: str
    file_name: str
    file_path: str  # secure path / signed URL / storage key

class DocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    document_id: int
    application_id: int
    document_type: str
    file_name: str
    file_path: str
    verification_status: VerificationStatusEnum
    uploaded_at: datetime
    download_url: Optional[str] = None

# ---- Payments ----
class PaymentCreateRequest(BaseModel):
    application_id: int
    amount: float
    payment_method: str
    transaction_reference: Optional[str] = None

class PaymentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    payment_id: int
    application_id: int
    amount: float
    payment_date: datetime
    payment_method: str
    transaction_reference: Optional[str]
    payment_status: PaymentStatusEnum

# ---- Applications: service-specific payloads for frontend forms ----
class LandTransferApplicant(BaseModel):
    model_config = ConfigDict(validate_by_name=True)

    # accept frontend camelCase keys (fullName) by adding aliases
    full_name: str = Field(..., alias="fullName")
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, alias="phone")
    id: Optional[str] = Field(None, alias="id")

class LandTransferRequest(BaseModel):
    service_id: int
    seller: LandTransferApplicant
    buyer: LandTransferApplicant
    # file/document ids for already-uploaded documents (frontend may upload separately)
    documents: Optional[list[int]] = None
    # free-form additional info
    notes: Optional[str] = None

class CopyOfLandRegistersApplicant(BaseModel):
    fullName: str
    address: Optional[str] = None
    nicNumber: Optional[str] = None
    date: Optional[str] = None
    # frontend sends signature as a file (should be uploaded and referenced by document_id)
    signature_document_id: Optional[int] = None

class CopyOfLandRegistersRequest(BaseModel):
    service_id: int
    applicant: CopyOfLandRegistersApplicant
    land_details: dict
    extract_details: Optional[list[dict]] = None

class SearchLandRegistersApplicant(BaseModel):
    fullName: str
    address: Optional[str] = None
    nicNo: Optional[str] = None
    date: Optional[str] = None
    signature_document_id: Optional[int] = None

class SearchLandRegistersRequest(BaseModel):
    service_id: int
    applicant: SearchLandRegistersApplicant
    property_details: dict
    registered_to_search: Optional[list[dict]] = None

class SearchDuplicateDeedsApplicant(BaseModel):
    fullName: str
    address: Optional[str] = None
    nicNumber: Optional[str] = None
    id: Optional[str] = None
    dateOfApplication: Optional[str] = None
    signature_document_id: Optional[int] = None

class SearchDuplicateDeedsRequest(BaseModel):
    service_id: int
    applicant: SearchDuplicateDeedsApplicant
    notary_public_name: Optional[str] = None
    district_of_station: Optional[str] = None
    number_of_deeds: Optional[int] = None
    date_of_deed: Optional[str] = None
    guarantor_name: Optional[str] = None
    guarantee_transferee_name: Optional[str] = None
    village: Optional[str] = None
    property_name: Optional[str] = None
    extent: Optional[str] = None
    korale: Optional[str] = None
    pattu: Optional[str] = None
    gn_division: Optional[str] = None
    ds_division: Optional[str] = None
    reason_for_search: Optional[str] = None
    court_case_no: Optional[str] = None

class CopyDocumentApplicant(BaseModel):
    fullName: str
    address: Optional[str] = None
    nicNumber: Optional[str] = None
    date: Optional[str] = None
    signature_document_id: Optional[int] = None

class CopyDocumentRequest(BaseModel):
    service_id: int
    applicant: CopyDocumentApplicant
    deed_number: Optional[str] = None
    date_of_deed_attestation: Optional[str] = None
    notary_public_name: Optional[str] = None
    notary_address: Optional[str] = None
    reason_for_request: Optional[str] = None
