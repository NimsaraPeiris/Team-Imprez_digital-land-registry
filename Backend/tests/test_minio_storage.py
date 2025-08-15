import pytest
from types import SimpleNamespace

from tools import minio_storage


def test_upload_and_presign(monkeypatch, tmp_path):
    # Use the real local filesystem implementation but point uploads root to a temp folder
    monkeypatch.chdir(tmp_path)

    key = minio_storage.upload_file_to_minio("applications/1/file.pdf", b"hello", "application/pdf")
    assert key == "applications/1/file.pdf"

    # Ensure file exists in the uploads folder
    stored = tmp_path / 'uploaded_documents' / 'applications' / '1' / 'file.pdf'
    assert stored.exists()

    url = minio_storage.generate_presigned_url("applications/1/file.pdf")
    assert url == "/internal/static/applications/1/file.pdf"
