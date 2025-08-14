from __future__ import annotations

"""
Production-ready starting point for Land Registry Office backend models + async DB setup.
- SQLAlchemy 2.0-style ORM with asyncio
- PostgreSQL-native enums
- Relationships, constraints, indexes
- FastAPI dependency for AsyncSession
- Minimal security utilities (password hashing)

"""
import os
import dotenv
dotenv.load_dotenv()

from datetime import datetime
from enum import Enum
from typing import Optional, List

from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Numeric,
    Text,
    Enum as SAEnum,
    Boolean,
    func,
    Index,
    UniqueConstraint,
)
from sqlalchemy.orm import (
    declarative_base,
    relationship,
)
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker


# Security
from passlib.context import CryptContext

# -----------------------------
# Configuration (edit per env)
# -----------------------------
DATABASE_URL_ASYNC = os.getenv("DATABASE_URL_ASYNC", "postgresql+asyncpg://user:password@localhost:5432/lro_db")

# -----------------------------
# SQLAlchemy / Async Session
# -----------------------------
engine: AsyncEngine = create_async_engine(
    DATABASE_URL_ASYNC,
    future=True,
    echo=False,  # set True for debugging
)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    future=True,
)

Base = declarative_base()

# -----------------------------
# Utility: FastAPI dependency
# -----------------------------
async def get_db() -> AsyncSession:
    """Dependency to provide an AsyncSession to FastAPI routes."""
    async with AsyncSessionLocal() as session:
        yield session

# -----------------------------
# Security utilities (password hashing)
# -----------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

# -----------------------------
# Enums (Postgres native)
# -----------------------------
class UserTypeEnum(str, Enum):
    CITIZEN = "citizen"
    LRO_OFFICER = "officer"
    ADMIN = "admin"

class VerificationStatusEnum(str, Enum):
    PENDING = "Pending"
    VERIFIED = "Verified"
    REJECTED = "Rejected"

class PaymentStatusEnum(str, Enum):
    PENDING = "Pending"
    COMPLETED = "Completed"
    FAILED = "Failed"
    REFUNDED = "Refunded"

# -----------------------------
# Models
# -----------------------------
class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        UniqueConstraint("email", name="uq_users_email"),
        UniqueConstraint("nic_number", name="uq_users_nic"),
        Index("ix_users_fullname", "full_name"),
    )

    user_id = Column("user_id", Integer, primary_key=True)
    full_name = Column("full_name", String(255), nullable=False)
    nic_number = Column("nic_number", String(32), nullable=False)
    email = Column("email", String(320), nullable=False)
    phone_number = Column("phone_number", String(32), nullable=True)
    password_hash = Column("password_hash", String(255), nullable=False)
    address = Column("address", Text, nullable=True)
    user_type = Column("user_type", SAEnum(UserTypeEnum, name="user_type_enum", native_enum=True), nullable=False, server_default=UserTypeEnum.CITIZEN.value)
    created_at = Column("created_at", DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_login = Column("last_login", DateTime(timezone=True), nullable=True)
    is_active = Column("is_active", Boolean, nullable=False, server_default="true")
    failed_login_attempts = Column("failed_login_attempts", Integer, nullable=False, server_default="0")

    # relationships
    applications = relationship("Application", back_populates="user", cascade="all, delete-orphan")
    officer_profile = relationship("LROOfficer", back_populates="user", uselist=False)

    def verify_password(self, plain: str) -> bool:
        return verify_password(plain, self.password_hash)

    def set_password(self, plain: str) -> None:
        self.password_hash = hash_password(plain)

    def __repr__(self) -> str:
        return f"<User {self.user_id} {self.email}>"


class Offices(Base):
    __tablename__ = "offices"
    office_id = Column("office_id", Integer, primary_key=True)
    office_name = Column("office_name", String(255), nullable=False)
    district = Column("district", String(255), nullable=True)
    address = Column("address", Text, nullable=True)

    officers = relationship("LROOfficer", back_populates="office", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Office {self.office_id} {self.office_name}>"


class LROOfficer(Base):
    __tablename__ = "lro_officers"
    __table_args__ = (
        UniqueConstraint("employee_id", name="uq_lro_officers_employee_id"),
    )

    officer_id = Column("officer_id", Integer, primary_key=True)
    user_id = Column("user_id", Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    employee_id = Column("employee_id", String(64), nullable=False)
    assigned_office_id = Column("assigned_office_id", Integer, ForeignKey("offices.office_id", ondelete="SET NULL"), nullable=True)
    role = Column("role", String(128), nullable=True)

    # relationships
    user = relationship("User", back_populates="officer_profile")
    office = relationship("Offices", back_populates="officers")
    applications_assigned = relationship("Application", back_populates="assigned_officer")
    logs = relationship("ApplicationLog", back_populates="officer")

    def __repr__(self) -> str:
        return f"<LROOfficer {self.officer_id} {self.employee_id}>"


class Services(Base):
    __tablename__ = "services"
    service_id = Column("service_id", Integer, primary_key=True)
    service_name = Column("service_name", String(255), nullable=False)
    service_code = Column("service_code", String(64), nullable=False, unique=True)
    base_fee = Column("base_fee", Numeric(12, 2), nullable=False, server_default="0.00")

    applications = relationship("Application", back_populates="service")

    def __repr__(self) -> str:
        return f"<Service {self.service_code}>"


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

    # relationships
    user = relationship("User", back_populates="applications")
    service = relationship("Services", back_populates="applications")
    status = relationship("ApplicationStatus", back_populates="applications")
    assigned_officer = relationship("LROOfficer", back_populates="applications_assigned")

    payments = relationship("Payments", back_populates="application", cascade="all, delete-orphan")
    uploaded_documents = relationship("UploadedDocuments", back_populates="application", cascade="all, delete-orphan")
    logs = relationship("ApplicationLog", back_populates="application", cascade="all, delete-orphan")

    # polymorphic one-to-one details
    land_transfer = relationship("AppLandTransfer", back_populates="application", uselist=False, cascade="all, delete-orphan")
    search_duplicate = relationship("AppSearchDuplicateDeeds", back_populates="application", uselist=False, cascade="all, delete-orphan")
    copy_register = relationship("AppCopyOfLandRegisters", back_populates="application", uselist=False, cascade="all, delete-orphan")
    search_register = relationship("AppSearchLandRegisters", back_populates="application", uselist=False, cascade="all, delete-orphan")
    copy_document = relationship("AppCopyOfDocument", back_populates="application", uselist=False, cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Application {self.application_id} ref={self.reference_number}>"


class Payments(Base):
    __tablename__ = "payments"
    payment_id = Column("payment_id", Integer, primary_key=True)
    application_id = Column("application_id", Integer, ForeignKey("applications.application_id", ondelete="CASCADE"), nullable=False)
    amount = Column("amount", Numeric(12, 2), nullable=False)
    payment_date = Column("payment_date", DateTime(timezone=True), server_default=func.now(), nullable=False)
    payment_method = Column("payment_method", String(64), nullable=True)
    transaction_reference = Column("transaction_reference", String(255), nullable=True)
    payment_status = Column("payment_status", SAEnum(PaymentStatusEnum, name="payment_status_enum", native_enum=True), nullable=False, server_default=PaymentStatusEnum.PENDING.value)

    application = relationship("Application", back_populates="payments")

    def __repr__(self) -> str:
        return f"<Payment {self.payment_id} {self.amount}>"


class UploadedDocuments(Base):
    __tablename__ = "uploaded_documents"
    document_id = Column("document_id", Integer, primary_key=True)
    application_id = Column("application_id", Integer, ForeignKey("applications.application_id", ondelete="CASCADE"), nullable=False)
    document_type = Column("document_type", String(128), nullable=False)
    file_name = Column("file_name", String(512), nullable=False)
    file_path = Column("file_path", String(1024), nullable=False)
    verification_status = Column("verification_status", SAEnum(VerificationStatusEnum, name="verification_status_enum", native_enum=True), nullable=False, server_default=VerificationStatusEnum.PENDING.value)
    uploaded_at = Column("uploaded_at", DateTime(timezone=True), server_default=func.now(), nullable=False)

    application = relationship("Application", back_populates="uploaded_documents")

    def __repr__(self) -> str:
        return f"<UploadedDocument {self.document_id} {self.file_name}>"


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

    application = relationship("Application", back_populates="land_transfer")


class AppSearchDuplicateDeeds(Base):
    __tablename__ = "app_search_duplicate_deeds"
    search_duplicate_id = Column("search_duplicate_id", Integer, primary_key=True)
    application_id = Column("application_id", Integer, ForeignKey("applications.application_id", ondelete="CASCADE"), nullable=False, unique=True)
    notary_public_name = Column("notary_public_name", String(255), nullable=True)
    deed_number = Column("deed_number", String(255), nullable=True)

    application = relationship("Application", back_populates="search_duplicate")


class AppCopyOfLandRegisters(Base):
    __tablename__ = "app_copy_of_land_registers"
    copy_register_id = Column("copy_register_id", Integer, primary_key=True)
    application_id = Column("application_id", Integer, ForeignKey("applications.application_id", ondelete="CASCADE"), nullable=False, unique=True)
    land_district = Column("land_district", String(255), nullable=True)
    extract_folio = Column("extract_folio", String(255), nullable=True)

    application = relationship("Application", back_populates="copy_register")


class AppSearchLandRegisters(Base):
    __tablename__ = "app_search_land_registers"
    search_register_id = Column("search_register_id", Integer, primary_key=True)
    application_id = Column("application_id", Integer, ForeignKey("applications.application_id", ondelete="CASCADE"), nullable=False, unique=True)
    property_village = Column("property_village", String(255), nullable=True)
    property_name = Column("property_name", String(255), nullable=True)

    folios = relationship("SearchRegisterFolios", back_populates="search_register", cascade="all, delete-orphan")
    application = relationship("Application", back_populates="search_register")


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

    application = relationship("Application", back_populates="copy_document")


# -----------------------------
# Helper: Create all tables (for small dev/test use only)
# In production use Alembic for migrations
# -----------------------------     
# async def create_all_tables():
#     async with engine.begin() as conn:
#         # Explicitly create enums before tables
#         await conn.run_sync(Base.metadata.create_all, {'checkfirst': True, 'tables': [UserTypeEnum.__table__]})
#         await conn.run_sync(Base.metadata.create_all)
#     from .seed_data import seed_initial_data
#     from sqlalchemy.ext.asyncio import AsyncSession
#     async with AsyncSession(engine) as session:
#         await seed_initial_data(session)

from sqlalchemy import text

async def create_all_tables():
    async with engine.begin() as conn:
        # Create enums with correct names
        await conn.execute(text("CREATE TYPE user_type_enum AS ENUM ('citizen', 'officer', 'admin');"))
        await conn.execute(text("CREATE TYPE verification_status_enum AS ENUM ('Pending', 'Verified', 'Rejected');"))
        await conn.execute(text("CREATE TYPE payment_status_enum AS ENUM ('Pending', 'Completed', 'Failed', 'Refunded');"))
        # Now create tables
        await conn.run_sync(Base.metadata.create_all)
    from .seed_data import seed_initial_data
    from sqlalchemy.ext.asyncio import AsyncSession
    async with AsyncSession(engine) as session:
        await seed_initial_data(session)


# -----------------------------
# Notes for integration
# -----------------------------
# - Use Alembic with SQLAlchemy 2.0 async support. Configure env.py to use async engine for migrations.
# - Store DATABASE_URL in environment variables; do not commit credentials.
# - File storage: do not store documents on database. Save to secure object store and keep only safe path/metadata here.
# - Encrypt highly sensitive fields (NIC) at application level if required by policy.
# - Consider Row Level Security (RLS) for cross-office access control.

