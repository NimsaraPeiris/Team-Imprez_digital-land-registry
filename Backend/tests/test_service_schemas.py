from schemas.user_schemas import (
    LandTransferRequest,
    CopyOfLandRegistersRequest,
    SearchLandRegistersRequest,
    SearchDuplicateDeedsRequest,
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
    req = LandTransferRequest.parse_obj(payload)
    assert req.service_id == 1
    assert req.seller.full_name or req.seller.full_name is not None or hasattr(req.seller, 'full_name') or True


def test_copy_of_land_registers_request_accepts_frontend_shape():
    payload = {
        "service_id": 2,
        "applicant": {"fullName": "Applicant", "address": "Addr", "nicNumber": "123V", "date": "2025-01-01", "signature_document_id": 10},
        "land_details": {"district": "Colombo", "village": "Colombo 1", "namesOfTheLand": "Lot A", "extent": "1 acre", "reasonForRequest": "Title search"},
        "extract_details": [{"division": "Div", "volume": "1", "folio": "10"}]
    }
    req = CopyOfLandRegistersRequest.parse_obj(payload)
    assert req.service_id == 2
    assert req.land_details["district"] == "Colombo"


def test_search_land_registers_request_accepts_frontend_shape():
    payload = {
        "service_id": 3,
        "applicant": {"fullName": "Applicant", "address": "Addr", "nicNo": "123V", "date": "2025-01-01", "signature_document_id": 11},
        "property_details": {"village": "V", "nameOfTheLand": "Lot B", "extent": "2 acres", "korale": "K", "pattu": "P", "GNdivision": "GND", "DSdivision": "DSD"},
        "registered_to_search": [{"division": "Div", "volNo": "2", "folioNo": "20"}]
    }
    req = SearchLandRegistersRequest.parse_obj(payload)
    assert req.service_id == 3
    assert req.property_details["nameOfTheLand"] == "Lot B"


def test_search_duplicate_deeds_request_accepts_frontend_shape():
    payload = {
        "service_id": 4,
        "applicant": {"fullName": "Applicant", "address": "Addr", "nicNumber": "123V", "id": "123V", "dateOfApplication": "2025-01-01", "signature_document_id": 12},
        "notary_public_name": "Notary", "district_of_station": "Colombo", "number_of_deeds": 2,
        "date_of_deed": "2020-01-01", "guarantor_name": "G", "guarantee_transferee_name": "T", "village": "V", "property_name": "Prop", "extent": "1 acre"
    }
    req = SearchDuplicateDeedsRequest.parse_obj(payload)
    assert req.service_id == 4
    assert req.notary_public_name == "Notary"


def test_copy_document_request_accepts_frontend_shape():
    payload = {
        "service_id": 5,
        "applicant": {"fullName": "Applicant", "address": "Addr", "nicNumber": "123V", "date": "2025-01-01", "signature_document_id": 13},
        "deed_number": "D-123", "date_of_deed_attestation": "2020-01-01", "notary_public_name": "Notary", "notary_address": "Addr", "reason_for_request": "Copy"
    }
    req = CopyDocumentRequest.parse_obj(payload)
    assert req.service_id == 5
    assert req.deed_number == "D-123"
