# backend/schemas/common.py
from enum import Enum
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# -----------------------------
# Enums (Postgres native)
# -----------------------------
class UserTypeEnum(str, Enum):
    citizen = "citizen"
    officer = "officer"
    admin = "admin"

class VerificationStatusEnum(str, Enum):
    Pending = "Pending"
    Verified = "Verified"
    Rejected = "Rejected"

class PaymentStatusEnum(str, Enum):
    Pending = "Pending"
    Completed = "Completed"
    Failed = "Failed"
    Refunded = "Refunded"