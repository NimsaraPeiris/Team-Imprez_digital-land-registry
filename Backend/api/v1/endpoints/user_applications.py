from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Any

from database.session import get_db
from schemas.user_schemas import ApplicationCreateRequest, ApplicationResponse, DocumentCreateRequest, DocumentResponse
from api.v1.endpoints.user_auth import get_current_user
from crud.applications import list_user_applications, create_application, get_application, add_document, list_application_documents
# import service-specific detail creators
from crud.applications import (
    create_land_transfer_details,
    create_copy_of_land_registers_details,
    create_search_land_registers_details,
    create_search_duplicate_deeds_details,
    create_copy_document_details,
)

router = APIRouter(prefix="/user/applications", tags=["user-applications"])

@router.get("/", response_model=List[ApplicationResponse])
async def list_user_applications_endpoint(db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    apps = await list_user_applications(db, current_user.user_id)
    return apps

@router.post("/", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
async def create_application_endpoint(payload: Any = Body(...), db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    """
    Create an application. Accepts either the original ApplicationCreateRequest shape or a service-specific payload
    that must include `service_id` and any service-specific fields. After creating the application record, the
    endpoint will create service-detail rows based on payload contents (heuristic detection).
    """
    # support old shape keys and frontend camelCase
    service_id = None
    reference_number = None
    if isinstance(payload, dict):
        service_id = payload.get('service_id') or payload.get('serviceId')
        reference_number = payload.get('reference_number') or payload.get('referenceNumber')
    # fallback: try Pydantic model if payload already matches
    if service_id is None:
        try:
            req = ApplicationCreateRequest.parse_obj(payload)
            service_id = req.service_id
            reference_number = req.reference_number
        except Exception:
            raise HTTPException(status_code=400, detail="Missing service_id in payload")

    # create base application
    try:
        app_obj = await create_application(db, current_user.user_id, int(service_id), reference_number)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

    # Heuristic: call service-detail creation based on payload keys
    try:
        if isinstance(payload, dict) and ('seller' in payload or 'buyer' in payload):
            await create_land_transfer_details(db, app_obj.application_id, payload)
            # attach any provided document ids
            docs = payload.get('documents') or payload.get('document_ids') or []
            if docs:
                from crud.applications import associate_documents_with_application
                await associate_documents_with_application(db, app_obj.application_id, docs)
        elif isinstance(payload, dict) and ('land_details' in payload or 'extract_details' in payload):
            await create_copy_of_land_registers_details(db, app_obj.application_id, payload)
            docs = payload.get('applicant', {}).get('signature_document_id')
            if docs:
                from crud.applications import associate_documents_with_application
                # single id -> list
                await associate_documents_with_application(db, app_obj.application_id, [docs] if isinstance(docs, int) else docs)
        elif isinstance(payload, dict) and ('property_details' in payload or 'registered_to_search' in payload):
            await create_search_land_registers_details(db, app_obj.application_id, payload)
            docs = payload.get('applicant', {}).get('signature_document_id')
            if docs:
                from crud.applications import associate_documents_with_application
                await associate_documents_with_application(db, app_obj.application_id, [docs] if isinstance(docs, int) else docs)
        elif isinstance(payload, dict) and ('notary_public_name' in payload or 'number_of_deeds' in payload):
            await create_search_duplicate_deeds_details(db, app_obj.application_id, payload)
            docs = payload.get('applicant', {}).get('signature_document_id') or payload.get('applicant_signature_document_id')
            if docs:
                from crud.applications import associate_documents_with_application
                await associate_documents_with_application(db, app_obj.application_id, [docs] if isinstance(docs, int) else docs)
        elif isinstance(payload, dict) and ('deed_number' in payload or 'date_of_deed_attestation' in payload):
            await create_copy_document_details(db, app_obj.application_id, payload)
            docs = payload.get('applicant', {}).get('signature_document_id')
            if docs:
                from crud.applications import associate_documents_with_application
                await associate_documents_with_application(db, app_obj.application_id, [docs] if isinstance(docs, int) else docs)
    except Exception:
        # Do not fail application creation if adding details fails; log and continue
        # In production we'd emit a proper log entry or background job retry
        pass

    return app_obj

@router.get("/{application_id}", response_model=ApplicationResponse)
async def get_application_endpoint(application_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    app = await get_application(db, application_id, current_user.user_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app

@router.post("/documents", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def add_document_endpoint(payload: DocumentCreateRequest, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    a = await get_application(db, payload.application_id, current_user.user_id)
    if not a:
        raise HTTPException(status_code=404, detail="Application not found or not owned by user")
    doc = await add_document(db, payload.application_id, payload.document_type, payload.file_name, payload.file_path)
    return doc

@router.get("/{application_id}/documents", response_model=List[DocumentResponse])
async def list_app_documents_endpoint(application_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    docs = await list_application_documents(db, application_id)
    if docs:
        if docs[0].application.user_id != current_user.user_id:
            raise HTTPException(status_code=403, detail="Forbidden")
    return docs
