from sqlalchemy import Column, Integer, Numeric, DateTime, String
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey
from sqlalchemy import Enum as SAEnum
from sqlalchemy import func

from .base import Base
from .enums import PaymentStatusEnum

class Payments(Base):
    __tablename__ = "payments"
    payment_id = Column("payment_id", Integer, primary_key=True)
    application_id = Column("application_id", Integer, ForeignKey("applications.application_id", ondelete="CASCADE"), nullable=False)
    amount = Column("amount", Numeric(12, 2), nullable=False)
    payment_date = Column("payment_date", DateTime(timezone=True), server_default=func.now(), nullable=False)
    payment_method = Column("payment_method", String(64), nullable=True)
    transaction_reference = Column("transaction_reference", String(255), nullable=True)
    payment_status = Column("payment_status", SAEnum(PaymentStatusEnum, name="payment_status_enum", native_enum=True, values_callable=lambda enum: [e.value for e in enum]), nullable=False, server_default=PaymentStatusEnum.PENDING.value)

    application = relationship("Application", back_populates="payments")

    def __repr__(self) -> str:
        return f"<Payment {self.payment_id} {self.amount}>"
