# models package

# Shared Base
from .base import Base

# Import domain modules so their models are registered on Base
from . import users  # registers User
from . import payments  # registers Payments
from . import documents  # registers UploadedDocuments

# Re-export commonly used domain classes for convenience
from .users import User
from .payments import Payments
from .documents import UploadedDocuments

# Re-export enums and security helpers
from .enums import UserTypeEnum, VerificationStatusEnum, PaymentStatusEnum
from .security import hash_password, verify_password, pwd_context
