from sqlalchemy import Column, Integer, String, Text, Numeric
from sqlalchemy.orm import relationship

from .base import Base

class Services(Base):
    __tablename__ = "services"
    service_id = Column("service_id", Integer, primary_key=True)
    service_name = Column("service_name", String(255), nullable=False)
    service_code = Column("service_code", String(64), nullable=False, unique=True)
    base_fee = Column("base_fee", Numeric(12, 2), nullable=False, server_default="0.00")

    applications = relationship("Application", back_populates="service")

    def __repr__(self) -> str:
        return f"<Service {self.service_code}>"
