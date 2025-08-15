from enum import Enum

class UserTypeEnum(str, Enum):
    CITIZEN = "citizen"
    LRO_OFFICER = "officer"
    ADMIN = "admin"

class VerificationStatusEnum(str, Enum):
    PENDING = "Pending"
    VERIFIED = "Verified"
    REJECTED = "Rejected"

class PaymentStatusEnum(str, Enum):
    PENDING = "Pending"
    COMPLETED = "Completed"
    FAILED = "Failed"
    REFUNDED = "Refunded"
