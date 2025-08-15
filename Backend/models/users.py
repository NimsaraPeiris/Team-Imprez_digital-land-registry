from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, Index, UniqueConstraint, func
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey
from sqlalchemy import Enum as SAEnum

from .base import Base
from .enums import UserTypeEnum
from .security import hash_password, verify_password

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
    user_type = Column(
        "user_type",
        SAEnum(UserTypeEnum, name="user_type_enum", native_enum=True, values_callable=lambda enum: [e.value for e in enum]),
        nullable=False,
        server_default=UserTypeEnum.CITIZEN.value,
    )
    created_at = Column("created_at", DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_login = Column("last_login", DateTime(timezone=True), nullable=True)
    is_active = Column("is_active", Boolean, nullable=False, server_default="true")
    failed_login_attempts = Column("failed_login_attempts", Integer, nullable=False, server_default="0")

    applications = relationship("Application", back_populates="user", cascade="all, delete-orphan")
    officer_profile = relationship("LROOfficer", back_populates="user", uselist=False)

    def verify_password(self, plain: str) -> bool:
        return verify_password(plain, self.password_hash)

    def set_password(self, plain: str) -> None:
        self.password_hash = hash_password(plain)

    def __repr__(self) -> str:
        return f"<User {self.user_id} {self.email}>"
