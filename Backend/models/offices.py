from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship

from .base import Base

class Offices(Base):
    __tablename__ = "offices"
    office_id = Column("office_id", Integer, primary_key=True)
    office_name = Column("office_name", String(255), nullable=False)
    district = Column("district", String(255), nullable=True)
    address = Column("address", Text, nullable=True)

    officers = relationship("LROOfficer", back_populates="office", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Office {self.office_id} {self.office_name}>"
