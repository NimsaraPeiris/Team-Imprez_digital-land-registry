import pytest
from models import User, Payments, UploadedDocuments


def test_models_importable():
    assert User is not None
    assert Payments is not None
    assert UploadedDocuments is not None
