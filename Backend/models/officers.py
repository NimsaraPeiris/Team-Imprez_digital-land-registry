from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from .base import Base

class LROOfficer(Base):
    __tablename__ = "lro_officers"
    __table_args__ = (
        # UniqueConstraint("employee_id", name="uq_lro_officers_employee_id"),
    )

    officer_id = Column("officer_id", Integer, primary_key=True)
    user_id = Column("user_id", Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    employee_id = Column("employee_id", String(64), nullable=False)
    assigned_office_id = Column("assigned_office_id", Integer, ForeignKey("offices.office_id", ondelete="SET NULL"), nullable=True)
    role = Column("role", String(128), nullable=True)

    user = relationship("User", back_populates="officer_profile")
    office = relationship("Offices", back_populates="officers")
    applications_assigned = relationship("Application", back_populates="assigned_officer")
    logs = relationship("ApplicationLog", back_populates="officer")

    def __repr__(self) -> str:
        return f"<LROOfficer {self.officer_id} {self.employee_id}>"
