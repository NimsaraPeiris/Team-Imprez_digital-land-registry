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
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, AsyncEngine

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

async def create_all_tables(engine=None):
    """Create enum types and tables. If `engine` (AsyncEngine) is provided it will be used;
    otherwise the application's session provider will be initialized and its engine used.
    This function now ensures the engine is disposed on failure to avoid leaving
    connections in an aborted transaction state.
    """
    # initialize/get engine on the currently running event loop if not provided
    if engine is None:
        from database.session import init_engine, get_engine
        init_engine()
        engine = get_engine()
    if engine is None:
        raise RuntimeError("Database engine not available")

    try:
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

    except Exception:
        # On any error during schema creation, dispose the engine to ensure no
        # connections remain in a failed/aborted transaction state. Swallow the
        # error so startup can continue; callers/tests will surface errors when
        # they actually try to use the DB if it's not configured correctly.
        try:
            await engine.dispose()
        except Exception:
            pass
        return

async def create_all_tables_via_url(database_url: str):
    """Create enums and tables using a temporary engine created from the provided database_url.
    This runs schema DDL in a fresh engine and disposes it afterwards to avoid leaving
    connections in an aborted transaction state in the application's main engine.

    This variant is tolerant to existing enum types and avoids attempting to DROP types
    (which can fail if the connected DB role is not the owner). It will create the
    enum types only if they do not already exist, then create missing tables.
    """
    if not database_url:
        return
    temp_engine: AsyncEngine | None = None
    try:
        temp_engine = create_async_engine(database_url, future=True)
        async with temp_engine.begin() as conn:
            # Ensure enum types exist (create only if missing) using a safe DO block.
            await conn.execute(sa_text("""
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type_enum') THEN
        CREATE TYPE user_type_enum AS ENUM ('citizen', 'officer', 'admin');
    END IF;
END$$;
"""))
            await conn.execute(sa_text("""
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'verification_status_enum') THEN
        CREATE TYPE verification_status_enum AS ENUM ('Pending', 'Verified', 'Rejected');
    END IF;
END$$;
"""))
            await conn.execute(sa_text("""
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status_enum') THEN
        CREATE TYPE payment_status_enum AS ENUM ('Pending', 'Completed', 'Failed', 'Refunded');
    END IF;
END$$;
"""))

            # Create any missing tables without attempting to drop existing objects.
            await conn.run_sync(Base.metadata.create_all)
    finally:
        if temp_engine is not None:
            await temp_engine.dispose()
