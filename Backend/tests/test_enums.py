from models.enums import UserTypeEnum, VerificationStatusEnum, PaymentStatusEnum


def test_user_type_enum_values():
    assert [e.value for e in UserTypeEnum] == ["citizen", "officer", "admin"]


def test_verification_status_enum_values():
    assert [e.value for e in VerificationStatusEnum] == ["Pending", "Verified", "Rejected"]


def test_payment_status_enum_values():
    assert [e.value for e in PaymentStatusEnum] == ["Pending", "Completed", "Failed", "Refunded"]
