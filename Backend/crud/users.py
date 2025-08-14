from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.lro_backend_models import User
from typing import Optional

async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    q = select(User).where(User.email == email)
    r = await db.execute(q)
    return r.scalars().first()

async def get_user_by_id(db: AsyncSession, user_id: int) -> Optional[User]:
    q = select(User).where(User.user_id == user_id)
    r = await db.execute(q)
    return r.scalars().first()

async def create_user(db: AsyncSession, full_name: str, nic_number: str, email: str, password: str, phone_number: str | None = None, address: str | None = None, user_type: str = "citizen") -> User:
    user = User(
        full_name=full_name,
        nic_number=nic_number,
        email=email,
        phone_number=phone_number,
        address=address,
        user_type=user_type,
    )
    user.set_password(password)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
