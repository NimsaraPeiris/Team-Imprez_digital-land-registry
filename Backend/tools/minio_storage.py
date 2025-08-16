import os
from typing import IO

"""Local filesystem storage shim.

This module exposes a small API used by the rest of the codebase. It intentionally
has no dependency on MinIO or other external SDKs.

Functions:
- upload_file_to_minio(object_name, data, content_type) -> object_key
- generate_presigned_url(object_name, expires) -> str

Note: function names retain the historical "minio" name for compatibility with
existing imports; the implementation is local filesystem-based.
"""


def upload_file_to_minio(object_name: str, data: bytes | IO, content_type: str) -> str:
    """Save the provided bytes or file-like to uploaded_documents/<object_name>.

    Returns the object_name which should be persisted in the DB as the object's key.
    """
    uploads_root = os.path.join(os.getcwd(), 'uploaded_documents')
    os.makedirs(uploads_root, exist_ok=True)
    dest_path = os.path.join(uploads_root, object_name)
    dest_dir = os.path.dirname(dest_path)
    os.makedirs(dest_dir, exist_ok=True)

    # Accept either bytes or file-like
    if hasattr(data, 'read'):
        # file-like
        try:
            data.seek(0)
        except Exception:
            pass
        content = data.read()
        if isinstance(content, (bytes, bytearray)):
            with open(dest_path, 'wb') as f:
                f.write(content)
        else:
            # assume iterable of bytes
            with open(dest_path, 'wb') as f:
                for chunk in content:
                    f.write(chunk)
    else:
        with open(dest_path, 'wb') as f:
            f.write(data)

    return object_name


def generate_presigned_url(object_name: str, expires: int = 60 * 5) -> str:
    """Return an internal download path for a stored file if it exists, otherwise empty string."""
    uploads_root = os.path.join(os.getcwd(), 'uploaded_documents')
    candidate = os.path.join(uploads_root, object_name)
    if os.path.exists(candidate):
        return f"/internal/static/{object_name}"
    return ""
