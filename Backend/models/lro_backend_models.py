# Moved and adapted from db/lro_backend_models.py
from __future__ import annotations

import os
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
    CheckConstraint,
    text as sa_text,
)
from sqlalchemy.orm import (
    declarative_base,
    relationship,
)
from sqlalchemy.ext.asyncio import AsyncSession

from models.enums import UserTypeEnum, VerificationStatusEnum, PaymentStatusEnum
from models.security import hash_password, verify_password, pwd_context
from models.base import Base

# Do not import the DB engine at module import time — initialize it at runtime to avoid
# cross-event-loop import-time engine creation. create_all_tables() will obtain/init
# the engine when needed.

# Import domain modules so their models are registered on Base
from . import users  # registers User
from . import payments  # registers Payments
from . import documents  # registers UploadedDocuments

# Compatibility aliases for code that still imports from models.lro_backend_models
User = users.User
Payments = payments.Payments
UploadedDocuments = documents.UploadedDocuments

# Compatibility aliases for classes moved to models.applications
ApplicationStatus = None
Application = None
ApplicationLog = None
AppLandTransfer = None
AppSearchDuplicateDeeds = None
AppCopyOfLandRegisters = None
AppSearchLandRegisters = None
SearchRegisterFolios = None
AppCopyOfDocument = None

try:
    from .applications import (
        ApplicationStatus as _ApplicationStatus,
        Application as _Application,
        ApplicationLog as _ApplicationLog,
        AppLandTransfer as _AppLandTransfer,
        AppSearchDuplicateDeeds as _AppSearchDuplicateDeeds,
        AppCopyOfLandRegisters as _AppCopyOfLandRegisters,
        AppSearchLandRegisters as _AppSearchLandRegisters,
        SearchRegisterFolios as _SearchRegisterFolios,
        AppCopyOfDocument as _AppCopyOfDocument,
    )
    ApplicationStatus = _ApplicationStatus
    Application = _Application
    ApplicationLog = _ApplicationLog
    AppLandTransfer = _AppLandTransfer
    AppSearchDuplicateDeeds = _AppSearchDuplicateDeeds
    AppCopyOfLandRegisters = _AppCopyOfLandRegisters
    AppSearchLandRegisters = _AppSearchLandRegisters
    SearchRegisterFolios = _SearchRegisterFolios
    AppCopyOfDocument = _AppCopyOfDocument
except Exception:
    # Leave as None if import fails during partial refactor
    pass

# Compatibility alias for Services
Services = None
try:
    from .services import Services as _Services
    Services = _Services
except Exception:
    pass

# Compatibility alias for Offices and LROOfficer
Offices = None
LROOfficer = None
try:
    from .offices import Offices as _Offices
    Offices = _Offices
except Exception:
    pass

try:
    from .officers import LROOfficer as _LROOfficer
    LROOfficer = _LROOfficer
except Exception:
    pass

# Helper: Create all tables (for small dev/test use only)
from sqlalchemy import text

async def create_all_tables():
    # initialize/get engine on the currently running event loop
    from database.session import init_engine, get_engine
    init_engine()
    engine = get_engine()
    if engine is None:
        raise RuntimeError("Database engine not available")

    async with engine.begin() as conn:
        # Drop all tables first so we can recreate with the correct enum-backed columns
        await conn.run_sync(Base.metadata.drop_all)

        # Drop enums if they already exist (safe for tests/dev only)
        await conn.execute(sa_text("DROP TYPE IF EXISTS user_type_enum CASCADE;"))
        await conn.execute(sa_text("DROP TYPE IF EXISTS verification_status_enum CASCADE;"))
        await conn.execute(sa_text("DROP TYPE IF EXISTS payment_status_enum CASCADE;"))

        # Create enums with exact names and values used by models
        await conn.execute(text("CREATE TYPE user_type_enum AS ENUM ('citizen', 'officer', 'admin');"))
        await conn.execute(text("CREATE TYPE verification_status_enum AS ENUM ('Pending', 'Verified', 'Rejected');"))
        await conn.execute(text("CREATE TYPE payment_status_enum AS ENUM ('Pending', 'Completed', 'Failed', 'Refunded');"))

        # Now create tables
        await conn.run_sync(Base.metadata.create_all)

    try:
        # Prefer new seed_data location under models
        from .seed_data import seed_initial_data
    except Exception:
        seed_initial_data = None

    from sqlalchemy.ext.asyncio import AsyncSession
    if seed_initial_data:
        # use the runtime engine
        engine = get_engine()
        async with AsyncSession(engine) as session:
            await seed_initial_data(session)
