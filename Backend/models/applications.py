from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Index, UniqueConstraint, func
from sqlalchemy.orm import relationship

from .base import Base

class ApplicationStatus(Base):
    __tablename__ = "application_status"
    status_id = Column("status_id", Integer, primary_key=True)
    status_name = Column("status_name", String(128), nullable=False, unique=True)

    applications = relationship("Application", back_populates="status")

    def __repr__(self) -> str:
        return f"<ApplicationStatus {self.status_name}>"


class Application(Base):
    __tablename__ = "applications"
    __table_args__ = (
        UniqueConstraint("reference_number", name="uq_applications_reference_number"),
        Index("ix_applications_user_id", "user_id"),
    )

    application_id = Column("application_id", Integer, primary_key=True)
    user_id = Column("user_id", Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    service_id = Column("service_id", Integer, ForeignKey("services.service_id", ondelete="RESTRICT"), nullable=False)
    application_date = Column("application_date", DateTime(timezone=True), server_default=func.now(), nullable=False)
    status_id = Column("status_id", Integer, ForeignKey("application_status.status_id", ondelete="RESTRICT"), nullable=False)
    assigned_officer_id = Column("assigned_officer_id", Integer, ForeignKey("lro_officers.officer_id", ondelete="SET NULL"), nullable=True)
    reference_number = Column("reference_number", String(128), nullable=False)
    last_updated_at = Column("last_updated_at", DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("User", back_populates="applications")
    service = relationship("Services", back_populates="applications")
    status = relationship("ApplicationStatus", back_populates="applications")
    assigned_officer = relationship("LROOfficer", back_populates="applications_assigned")

    payments = relationship("Payments", back_populates="application", cascade="all, delete-orphan")
    uploaded_documents = relationship("UploadedDocuments", back_populates="application", cascade="all, delete-orphan")
    logs = relationship("ApplicationLog", back_populates="application", cascade="all, delete-orphan")

    land_transfer = relationship("AppLandTransfer", back_populates="application", uselist=False, cascade="all, delete-orphan")
    search_duplicate = relationship("AppSearchDuplicateDeeds", back_populates="application", uselist=False, cascade="all, delete-orphan")
    copy_register = relationship("AppCopyOfLandRegisters", back_populates="application", uselist=False, cascade="all, delete-orphan")
    search_register = relationship("AppSearchLandRegisters", back_populates="application", uselist=False, cascade="all, delete-orphan")
    copy_document = relationship("AppCopyOfDocument", back_populates="application", uselist=False, cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Application {self.application_id} ref={self.reference_number}>"


class ApplicationLog(Base):
    __tablename__ = "application_log"
    log_id = Column("log_id", Integer, primary_key=True)
    application_id = Column("application_id", Integer, ForeignKey("applications.application_id", ondelete="CASCADE"), nullable=False)
    officer_id = Column("officer_id", Integer, ForeignKey("lro_officers.officer_id", ondelete="SET NULL"), nullable=True)
    action_taken = Column("action_taken", String(128), nullable=False)
    remarks = Column("remarks", Text, nullable=True)
    timestamp = Column("timestamp", DateTime(timezone=True), server_default=func.now(), nullable=False)

    application = relationship("Application", back_populates="logs")
    officer = relationship("LROOfficer", back_populates="logs")

    def __repr__(self) -> str:
        return f"<ApplicationLog {self.log_id} action={self.action_taken}>"


# Application detail tables
class AppLandTransfer(Base):
    __tablename__ = "app_land_transfer"
    land_transfer_id = Column("land_transfer_id", Integer, primary_key=True)
    application_id = Column("application_id", Integer, ForeignKey("applications.application_id", ondelete="CASCADE"), nullable=False, unique=True)
    seller_full_name = Column("seller_full_name", String(255), nullable=False)
    seller_nic = Column("seller_nic", String(64), nullable=True)
    buyer_full_name = Column("buyer_full_name", String(255), nullable=False)
    buyer_nic = Column("buyer_nic", String(64), nullable=True)
    # Add additional contact/info fields from frontend
    seller_email = Column("seller_email", String(320), nullable=True)
    seller_phone = Column("seller_phone", String(32), nullable=True)
    buyer_email = Column("buyer_email", String(320), nullable=True)
    buyer_phone = Column("buyer_phone", String(32), nullable=True)
    guarantor1_nic = Column("guarantor1_nic", String(64), nullable=True)
    guarantor2_nic = Column("guarantor2_nic", String(64), nullable=True)

    application = relationship("Application", back_populates="land_transfer")


class AppSearchDuplicateDeeds(Base):
    __tablename__ = "app_search_duplicate_deeds"
    search_duplicate_id = Column("search_duplicate_id", Integer, primary_key=True)
    application_id = Column("application_id", Integer, ForeignKey("applications.application_id", ondelete="CASCADE"), nullable=False, unique=True)
    notary_public_name = Column("notary_public_name", String(255), nullable=True)
    deed_number = Column("deed_number", String(255), nullable=True)
    # Additional deed/search fields
    district_of_station = Column("district_of_station", String(255), nullable=True)
    number_of_deeds = Column("number_of_deeds", Integer, nullable=True)
    date_of_deed = Column("date_of_deed", String(64), nullable=True)
    guarantor_name = Column("guarantor_name", String(255), nullable=True)
    guarantee_transferee_name = Column("guarantee_transferee_name", String(255), nullable=True)
    village = Column("village", String(255), nullable=True)
    property_name = Column("property_name", String(255), nullable=True)
    extent = Column("extent", String(128), nullable=True)
    korale = Column("korale", String(128), nullable=True)
    pattu = Column("pattu", String(128), nullable=True)
    gn_division = Column("gn_division", String(128), nullable=True)
    ds_division = Column("ds_division", String(128), nullable=True)
    reason_for_search = Column("reason_for_search", Text, nullable=True)
    court_case_no = Column("court_case_no", String(128), nullable=True)
    applicant_signature_document_id = Column("applicant_signature_document_id", Integer, nullable=True)

    application = relationship("Application", back_populates="search_duplicate")


class AppCopyOfLandRegisters(Base):
    __tablename__ = "app_copy_of_land_registers"
    copy_register_id = Column("copy_register_id", Integer, primary_key=True)
    application_id = Column("application_id", Integer, ForeignKey("applications.application_id", ondelete="CASCADE"), nullable=False, unique=True)
    land_district = Column("land_district", String(255), nullable=True)
    extract_folio = Column("extract_folio", String(255), nullable=True)
    # Additional fields per frontend form
    property_village = Column("property_village", String(255), nullable=True)
    property_names = Column("property_names", Text, nullable=True)
    extent = Column("extent", String(128), nullable=True)
    reason_for_request = Column("reason_for_request", Text, nullable=True)
    applicant_signature_document_id = Column("applicant_signature_document_id", Integer, nullable=True)

    application = relationship("Application", back_populates="copy_register")


class AppSearchLandRegisters(Base):
    __tablename__ = "app_search_land_registers"
    search_register_id = Column("search_register_id", Integer, primary_key=True)
    application_id = Column("application_id", Integer, ForeignKey("applications.application_id", ondelete="CASCADE"), nullable=False, unique=True)
    property_village = Column("property_village", String(255), nullable=True)
    property_name = Column("property_name", String(255), nullable=True)

    folios = relationship("SearchRegisterFolios", back_populates="search_register", cascade="all, delete-orphan")
    application = relationship("Application", back_populates="search_register")

    # Additional geographic fields
    extent = Column("extent", String(128), nullable=True)
    korale = Column("korale", String(128), nullable=True)
    pattu = Column("pattu", String(128), nullable=True)
    gn_division = Column("gn_division", String(128), nullable=True)
    ds_division = Column("ds_division", String(128), nullable=True)
    applicant_signature_document_id = Column("applicant_signature_document_id", Integer, nullable=True)


class SearchRegisterFolios(Base):
    __tablename__ = "search_register_folios"
    folio_request_id = Column("folio_request_id", Integer, primary_key=True)
    search_register_id = Column("search_register_id", Integer, ForeignKey("app_search_land_registers.search_register_id", ondelete="CASCADE"), nullable=False)
    register_name = Column("register_name", String(255), nullable=True)
    volume_number = Column("volume_number", String(64), nullable=True)
    folio_number = Column("folio_number", String(64), nullable=True)

    search_register = relationship("AppSearchLandRegisters", back_populates="folios")


class AppCopyOfDocument(Base):
    __tablename__ = "app_copy_of_document"
    copy_doc_id = Column("copy_doc_id", Integer, primary_key=True)
    application_id = Column("application_id", Integer, ForeignKey("applications.application_id", ondelete="CASCADE"), nullable=False, unique=True)
    document_deed_number = Column("document_deed_number", String(255), nullable=True)
    reason_for_request = Column("reason_for_request", Text, nullable=True)
    # New fields
    date_of_deed_attestation = Column("date_of_deed_attestation", String(64), nullable=True)
    notary_public_name = Column("notary_public_name", String(255), nullable=True)
    notary_address = Column("notary_address", String(512), nullable=True)
    applicant_signature_document_id = Column("applicant_signature_document_id", Integer, nullable=True)

    application = relationship("Application", back_populates="copy_document")
