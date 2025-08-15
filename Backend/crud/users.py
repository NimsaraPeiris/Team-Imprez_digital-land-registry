from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import ProgrammingError
from models.lro_backend_models import User, UserTypeEnum
from typing import Optional

async def _ensure_tables(db: AsyncSession):
    try:
        # Attempt to create all tables using models helper if available
        from models.lro_backend_models import create_all_tables
        from database.session import get_engine
        engine = get_engine()
        if engine is not None:
            await create_all_tables(engine)
    except Exception:
        # ignore failures; caller will surface original error if still failing
        pass

async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    q = select(User).where(User.email == email)
    try:
        r = await db.execute(q)
    except ProgrammingError:
        # likely missing tables; try creating them and retry once
        await _ensure_tables(db)
        r = await db.execute(q)
    return r.scalars().first()

async def get_user_by_id(db: AsyncSession, user_id: int) -> Optional[User]:
    q = select(User).where(User.user_id == user_id)
    try:
        r = await db.execute(q)
    except ProgrammingError:
        await _ensure_tables(db)
        r = await db.execute(q)
    return r.scalars().first()

async def create_user(db: AsyncSession, full_name: str, nic_number: str, email: str, password: str, phone_number: str | None = None, address: str | None = None, user_type: str = "citizen") -> User:
    # Normalize to Enum member so SAEnum(values_callable=...) can bind properly
    try:
        user_type_enum = UserTypeEnum(user_type) if not isinstance(user_type, UserTypeEnum) else user_type
    except Exception:
        user_type_enum = UserTypeEnum.CITIZEN

    user = User(
        full_name=full_name,
        nic_number=nic_number,
        email=email,
        phone_number=phone_number,
        address=address,
        user_type=user_type_enum,
    )
    user.set_password(password)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
