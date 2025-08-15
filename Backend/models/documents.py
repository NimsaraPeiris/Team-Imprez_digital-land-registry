from sqlalchemy import Column, Integer, DateTime, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey
from sqlalchemy import Enum as SAEnum
from sqlalchemy import func

from .base import Base
from .enums import VerificationStatusEnum

class UploadedDocuments(Base):
    __tablename__ = "uploaded_documents"
    document_id = Column("document_id", Integer, primary_key=True)
    application_id = Column("application_id", Integer, ForeignKey("applications.application_id", ondelete="CASCADE"), nullable=False)
    document_type = Column("document_type", String(128), nullable=False)
    file_name = Column("file_name", String(512), nullable=False)
    file_path = Column("file_path", String(1024), nullable=False)
    verification_status = Column("verification_status", SAEnum(VerificationStatusEnum, name="verification_status_enum", native_enum=True, values_callable=lambda enum: [e.value for e in enum]), nullable=False, server_default=VerificationStatusEnum.PENDING.value)
    uploaded_at = Column("uploaded_at", DateTime(timezone=True), server_default=func.now(), nullable=False)

    application = relationship("Application", back_populates="uploaded_documents")

    def __repr__(self) -> str:
        return f"<UploadedDocument {self.document_id} {self.file_name}>"
