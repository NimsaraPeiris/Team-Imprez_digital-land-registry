from schemas.service_schemas import (
    LandTransferRequest,
    CopyOfLandRequest,
    SearchLandRequest,
    DuplicateDeedsRequest,
    CopyDocumentRequest,
)


def test_land_transfer_request_accepts_frontend_shape():
    payload = {
        "service_id": 1,
        "seller": {"fullName": "Seller One", "email": "seller@example.com", "phone": "0712345678", "id": "123456789V"},
        "buyer": {"fullName": "Buyer Two", "email": "buyer@example.com", "phone": "0771234567", "id": "987654321V"},
        "documents": [1, 2, 3],
        "notes": "Test transfer"
    }
    req = LandTransferRequest.model_validate(payload)
    assert req.service_id == 1
    assert hasattr(req.seller, 'fullName') and req.seller.fullName == "Seller One"


def test_copy_of_land_registers_request_accepts_frontend_shape():
    payload = {
        "service_id": 2,
        "applicant": {"fullName": "Applicant", "address": "Addr", "nicNumber": "123V", "date": "2025-01-01", "signature_document_id": 10},
        "land_district": "Colombo",
        "extracts": [{"division": "Div", "volume": "1", "folio": "10"}]
    }
    req = CopyOfLandRequest.model_validate(payload)
    assert req.service_id == 2
    assert req.land_district == "Colombo"


def test_search_land_registers_request_accepts_frontend_shape():
    payload = {
        "service_id": 3,
        "applicant": {"fullName": "Applicant", "address": "Addr", "nicNo": "123V", "date": "2025-01-01", "signature_document_id": 11},
        "nameOfTheLand": "Lot B",
        "registered_entries": [{"division": "Div", "volNo": "2", "folioNo": "20"}]
    }
    req = SearchLandRequest.model_validate(payload)
    assert req.service_id == 3
    assert req.nameOfTheLand == "Lot B"


def test_search_duplicate_deeds_request_accepts_frontend_shape():
    payload = {
        "service_id": 4,
        "applicant": {"fullName": "Applicant", "address": "Addr", "nicNumber": "123V", "id": "123V", "dateOfApplication": "2025-01-01", "signature_document_id": 12},
        "notaryPublicName": "Notary", "districtOfStation": "Colombo", "numberOfDeeds": 2,
        "dateOfDeed": "2020-01-01", "nameOfGarantee_transferor": "G", "nameOfGarantee_transferee": "T", "village": "V", "propertyName": "Prop", "extent": "1 acre"
    }
    req = DuplicateDeedsRequest.model_validate(payload)
    assert req.service_id == 4
    assert req.notaryPublicName == "Notary"


def test_copy_document_request_accepts_frontend_shape():
    payload = {
        "service_id": 5,
        "applicant": {"fullName": "Applicant", "address": "Addr", "nicNumber": "123V", "date": "2025-01-01", "signature_document_id": 13},
        "deedNumber": "D-123", "dateOfDeedAttestation": "2020-01-01", "notaryPublicName": "Notary", "notaryAddress": "Addr", "reasonForRequest": "Copy"
    }
    req = CopyDocumentRequest.model_validate(payload)
    assert req.service_id == 5
    assert req.deedNumber == "D-123"


def test_land_transfer_schema_minimal():
    payload = {
        "seller": {"fullName": "Alice"},
        "buyer": {"fullName": "Bob"}
    }
    obj = LandTransferRequest.model_validate(payload)
    assert obj.seller.fullName == "Alice"
    assert obj.buyer.fullName == "Bob"


def test_copy_of_land_schema_with_extracts():
    payload = {
        "applicant": {"fullName": "Alice", "nicNumber": "123"},
        "land_district": "District 1",
        "extracts": [{"division": "A", "volume": "1", "folio": "2"}]
    }
    obj = CopyOfLandRequest.model_validate(payload)
    assert len(obj.extracts) == 1


def test_search_land_schema():
    payload = {"applicant": {"fullName": "Alice"}, "registered_entries": [{"division": "X", "volNo": "1", "folioNo": "1"}]}
    obj = SearchLandRequest.model_validate(payload)
    assert obj.registered_entries[0].division == "X"


def test_duplicate_deeds_schema():
    payload = {"applicant": {"fullName": "Alice"}, "numberOfDeeds": 2}
    obj = DuplicateDeedsRequest.model_validate(payload)
    assert obj.numberOfDeeds == 2


def test_copy_document_schema():
    payload = {"applicant": {"fullName": "Alice"}, "deedNumber": "D-123"}
    obj = CopyDocumentRequest.model_validate(payload)
    assert obj.deedNumber == "D-123"
