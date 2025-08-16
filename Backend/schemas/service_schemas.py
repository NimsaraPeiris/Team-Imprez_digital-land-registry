from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date

class ConfigurableModel(BaseModel):
    model_config = {
        "extra": "allow",
        "from_attributes": True,
    }

# Common applicant details
class ApplicantBase(ConfigurableModel):
    fullName: str
    address: Optional[str] = None
    nicNumber: Optional[str] = None
    phone: Optional[str] = None

# 1) Land Transfer
class LandTransferParty(ConfigurableModel):
    fullName: str
    email: Optional[str] = None
    phone: Optional[str] = None
    id: Optional[str] = None  # NIC

class LandTransferRequest(ConfigurableModel):
    service_id: Optional[int] = None
    seller: LandTransferParty
    buyer: LandTransferParty
    guarantor1_nic: Optional[str] = None
    guarantor2_nic: Optional[str] = None
    sales_agreement_document_id: Optional[int] = None
    current_title_deed_document_id: Optional[int] = None
    purchaser_nic_document_id: Optional[int] = None
    purchaser_photo_document_id: Optional[int] = None
    vendor_photo_document_id: Optional[int] = None
    additional_metadata: Optional[dict] = None

# 2) Copy of Land Registers
class ExtractObject(ConfigurableModel):
    division: Optional[str] = None
    volume: Optional[str] = None
    folio: Optional[str] = None

class CopyOfLandRequest(ConfigurableModel):
    service_id: Optional[int] = None
    applicant: ApplicantBase
    land_district: Optional[str] = None
    property_name: Optional[str] = None
    extent: Optional[str] = None
    reasonForRequest: Optional[str] = None
    extracts: Optional[List[ExtractObject]] = None
    signature_document_id: Optional[int] = None

# 3) Search of Land Registers
class SearchRegisterEntry(ConfigurableModel):
    division: Optional[str] = None
    volNo: Optional[str] = None
    folioNo: Optional[str] = None

class SearchLandRequest(ConfigurableModel):
    service_id: Optional[int] = None
    applicant: ApplicantBase
    village: Optional[str] = None
    nameOfTheLand: Optional[str] = None
    extent: Optional[str] = None
    korale: Optional[str] = None
    pattu: Optional[str] = None
    GNdivision: Optional[str] = None
    DSdivision: Optional[str] = None
    registered_entries: Optional[List[SearchRegisterEntry]] = None
    signature_document_id: Optional[int] = None

# 4) Search Duplicate of Deeds
class DuplicateDeedsRequest(ConfigurableModel):
    service_id: Optional[int] = None
    applicant: ApplicantBase
    notaryPublicName: Optional[str] = None
    districtOfStation: Optional[str] = None
    numberOfDeeds: Optional[int] = None
    dateOfDeed: Optional[date] = None
    nameOfGarantee_transferor: Optional[str] = None
    nameOfGarantee_transferee: Optional[str] = None
    village: Optional[str] = None
    propertyName: Optional[str] = None
    extent: Optional[str] = None
    korale: Optional[str] = None
    pattu: Optional[str] = None
    GNdivision: Optional[str] = None
    DSdivision: Optional[str] = None
    reasonForSearch: Optional[str] = None
    courtCaseNo: Optional[str] = None
    signature_document_id: Optional[int] = None

# 5) Copy of Document
class CopyDocumentRequest(ConfigurableModel):
    service_id: Optional[int] = None
    applicant: ApplicantBase
    deedNumber: Optional[str] = None
    dateOfDeedAttestation: Optional[date] = None
    notaryPublicName: Optional[str] = None
    notaryAddress: Optional[str] = None
    reasonForRequest: Optional[str] = None
    signature_document_id: Optional[int] = None
