"""Test helper factories for creating common DB objects in tests.

Provide small async wrappers so tests can create users and services consistently
without duplicating the same UUID suffix logic across files.
"""
import uuid
from typing import Optional

from crud.users import create_user as crud_create_user
from crud.applications import create_application as crud_create_application
from database.session import get_sessionmaker
from sqlalchemy.future import select


async def create_user(db, full_name: str = "Test User", nic: Optional[str] = None, email: Optional[str] = None, password: str = "password", phone: str = "0712345678", address: str = "Test Address"):
    """Create and return a User via the CRUD helper. Accepts an AsyncSession as `db`.

    If nic/email not provided, generates unique values using uuid4 suffix.
    """
    suffix = uuid.uuid4().hex[:8]
    if nic is None:
        nic = f"123456{suffix}V"
    if email is None:
        email = f"user+{suffix}@example.com"
    return await crud_create_user(db, full_name, nic, email, password, phone, address)


async def ensure_service(db, service_name: str = "Test Service", service_code: Optional[str] = None, base_fee: float = 0.0):
    """Ensure a Services row exists; if not, create it and return it. Uses provided AsyncSession `db`.

    Generates a unique service_code if none provided.
    """
    from models.services import Services

    if service_code is None:
        service_code = f"SVC{uuid.uuid4().hex[:8]}"

    q = select(Services).where(Services.service_code == service_code)
    r = await db.execute(q)
    svc = r.scalars().first()
    if svc:
        return svc

    svc = Services(service_name=service_name, service_code=service_code, base_fee=base_fee)
    db.add(svc)
    await db.commit()
    await db.refresh(svc)
    return svc


async def create_application(db, user_id: int, service_id: int, reference_number: Optional[str] = None, **kwargs):
    """Create an application using the CRUD helper. Generates a unique reference if none provided."""
    if reference_number is None:
        reference_number = f"REF-{uuid.uuid4().hex[:12]}"
    return await crud_create_application(db, user_id, service_id, reference_number=reference_number, **kwargs)