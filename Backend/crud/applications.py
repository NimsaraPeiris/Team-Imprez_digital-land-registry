from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from models.lro_backend_models import Application, Services, UploadedDocuments, ApplicationLog
from models.lro_backend_models import AppLandTransfer, AppCopyOfLandRegisters, AppSearchLandRegisters, AppSearchDuplicateDeeds, AppCopyOfDocument
from datetime import datetime

async def list_user_applications(db: AsyncSession, user_id: int) -> List[Application]:
    stmt = select(Application).where(Application.user_id == user_id).order_by(Application.application_date.desc())
    r = await db.execute(stmt)
    return r.scalars().all()

async def create_application(db: AsyncSession, user_id: int, service_id: int, reference_number: str | None) -> Application:
    # validate service exists
    svc_stmt = select(Services).where(Services.service_id == service_id)
    svc_r = await db.execute(svc_stmt)
    svc = svc_r.scalars().first()
    if not svc:
        raise ValueError("Service not found")

    app = Application(
        user_id=user_id,
        service_id=service_id,
        application_date=datetime.utcnow(),
        status_id=1,
        reference_number=reference_number or f"REF-{int(datetime.utcnow().timestamp())}",
        last_updated_at=datetime.utcnow(),
    )
    db.add(app)
    await db.commit()
    await db.refresh(app)

    # create initial log
    log = ApplicationLog(application_id=app.application_id, officer_id=None, action_taken="Created by user", remarks=None)
    db.add(log)
    await db.commit()
    return app

async def get_application(db: AsyncSession, application_id: int, user_id: int | None = None) -> Application | None:
    stmt = select(Application).where(Application.application_id == application_id)
    if user_id is not None:
        stmt = stmt.where(Application.user_id == user_id)
    r = await db.execute(stmt)
    return r.scalars().first()

async def add_document(db: AsyncSession, application_id: int, document_type: str, file_name: str, file_path: str) -> UploadedDocuments:
    doc = UploadedDocuments(
        application_id=application_id,
        document_type=document_type,
        file_name=file_name,
        file_path=file_path,
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    # add application log
    log = ApplicationLog(application_id=application_id, officer_id=None, action_taken=f"Uploaded document {doc.document_id}", remarks=None)
    db.add(log)
    await db.commit()
    return doc

async def list_application_documents(db: AsyncSession, application_id: int) -> List[UploadedDocuments]:
    stmt = select(UploadedDocuments).where(UploadedDocuments.application_id == application_id)
    r = await db.execute(stmt)
    return r.scalars().all()

async def create_land_transfer_details(db: AsyncSession, application_id: int, payload: dict) -> "AppLandTransfer":
    # payload expected to contain seller/buyer keys
    seller = payload.get('seller', {})
    buyer = payload.get('buyer', {})
    at = AppLandTransfer(
        application_id=application_id,
        seller_full_name=seller.get('full_name') or seller.get('fullName'),
        seller_nic=seller.get('id') or seller.get('nic'),
        seller_email=seller.get('email'),
        seller_phone=seller.get('phone'),
        buyer_full_name=buyer.get('full_name') or buyer.get('fullName'),
        buyer_nic=buyer.get('id') or buyer.get('nic'),
        buyer_email=buyer.get('email'),
        buyer_phone=buyer.get('phone'),
        guarantor1_nic=payload.get('guarantor1_nic'),
        guarantor2_nic=payload.get('guarantor2_nic'),
    )
    db.add(at)
    await db.commit()
    await db.refresh(at)
    return at

async def create_copy_of_land_registers_details(db: AsyncSession, application_id: int, payload: dict) -> "AppCopyOfLandRegisters":
    cr = AppCopyOfLandRegisters(
        application_id=application_id,
        land_district=payload.get('land_details', {}).get('district'),
        property_village=payload.get('land_details', {}).get('village'),
        property_names=payload.get('land_details', {}).get('namesOfTheLand'),
        extent=payload.get('land_details', {}).get('extent'),
        reason_for_request=payload.get('land_details', {}).get('reasonForRequest'),
        applicant_signature_document_id=payload.get('applicant', {}).get('signature_document_id'),
    )
    db.add(cr)
    await db.commit()
    await db.refresh(cr)
    # create folios if provided
    folios = payload.get('extract_details') or []
    if folios:
        from models.lro_backend_models import SearchRegisterFolios
        for f in folios:
            fol = SearchRegisterFolios(search_register_id=cr.copy_register_id, register_name=f.get('division'), volume_number=f.get('volume'), folio_number=f.get('folio'))
            db.add(fol)
        await db.commit()
    return cr

async def create_search_land_registers_details(db: AsyncSession, application_id: int, payload: dict) -> "AppSearchLandRegisters":
    sr = AppSearchLandRegisters(
        application_id=application_id,
        property_village=payload.get('property_details', {}).get('village'),
        property_name=payload.get('property_details', {}).get('nameOfTheLand'),
        extent=payload.get('property_details', {}).get('extent'),
        korale=payload.get('property_details', {}).get('korale'),
        pattu=payload.get('property_details', {}).get('pattu'),
        gn_division=payload.get('property_details', {}).get('GNdivision'),
        ds_division=payload.get('property_details', {}).get('DSdivision'),
        applicant_signature_document_id=payload.get('applicant', {}).get('signature_document_id'),
    )
    db.add(sr)
    await db.commit()
    await db.refresh(sr)
    # create folios
    folios = payload.get('registered_to_search') or []
    if folios:
        from models.lro_backend_models import SearchRegisterFolios
        for f in folios:
            fol = SearchRegisterFolios(search_register_id=sr.search_register_id, register_name=f.get('division'), volume_number=f.get('volNo'), folio_number=f.get('folioNo'))
            db.add(fol)
        await db.commit()
    return sr

async def create_search_duplicate_deeds_details(db: AsyncSession, application_id: int, payload: dict) -> "AppSearchDuplicateDeeds":
    sd = AppSearchDuplicateDeeds(
        application_id=application_id,
        notary_public_name=payload.get('notary_public_name'),
        district_of_station=payload.get('district_of_station'),
        number_of_deeds=payload.get('number_of_deeds'),
        date_of_deed=payload.get('date_of_deed'),
        guarantor_name=payload.get('guarantor_name'),
        guarantee_transferee_name=payload.get('guarantee_transferee_name'),
        village=payload.get('village'),
        property_name=payload.get('property_name'),
        extent=payload.get('extent'),
        korale=payload.get('korale'),
        pattu=payload.get('pattu'),
        gn_division=payload.get('gn_division'),
        ds_division=payload.get('ds_division'),
        reason_for_search=payload.get('reason_for_search'),
        court_case_no=payload.get('court_case_no'),
        applicant_signature_document_id=payload.get('applicant_signature_document_id') or payload.get('applicant', {}).get('signature_document_id')
    )
    db.add(sd)
    await db.commit()
    await db.refresh(sd)
    return sd

async def create_copy_document_details(db: AsyncSession, application_id: int, payload: dict) -> "AppCopyOfDocument":
    cd = AppCopyOfDocument(
        application_id=application_id,
        document_deed_number=payload.get('deed_number'),
        date_of_deed_attestation=payload.get('date_of_deed_attestation'),
        notary_public_name=payload.get('notary_public_name'),
        notary_address=payload.get('notary_address'),
        reason_for_request=payload.get('reason_for_request'),
        applicant_signature_document_id=payload.get('applicant', {}).get('signature_document_id')
    )
    db.add(cd)
    await db.commit()
    await db.refresh(cd)
    return cd

async def associate_documents_with_application(db: AsyncSession, application_id: int, document_ids: list[int]) -> int:
    """Associate existing uploaded document rows with the created application.
    Returns number of rows updated.
    """
    if not document_ids:
        return 0
    # fetch documents that match provided ids
    stmt = select(UploadedDocuments).where(UploadedDocuments.document_id.in_(document_ids))
    r = await db.execute(stmt)
    docs = r.scalars().all()
    updated = 0
    for d in docs:
        try:
            d.application_id = application_id
            db.add(d)
            updated += 1
        except Exception:
            continue
    if updated:
        await db.commit()
    return updated
