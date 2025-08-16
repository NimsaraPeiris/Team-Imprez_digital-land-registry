from fastapi import APIRouter, Header, HTTPException
from fastapi.responses import FileResponse
import os

router = APIRouter()

@router.get("/internal/static/{file_path:path}")
def serve_internal_file(file_path: str, x_user_id: str | None = Header(None)):
    """Serve files under uploaded_documents safely for internal use.

    Permission model (simple, for development/testing):
    - If caller provides X-User-Id header, require that the user id appears in the file_path segments.
    - Otherwise serve the file if it exists.

    Note: In production this endpoint should verify JWT/session and ensure strict ACLs.
    """
    uploads_root = os.path.join(os.getcwd(), 'uploaded_documents')
    # Normalize and prevent path traversal
    candidate = os.path.normpath(os.path.join(uploads_root, file_path))
    uploads_root_abs = os.path.abspath(uploads_root)
    candidate_abs = os.path.abspath(candidate)
    if not candidate_abs.startswith(uploads_root_abs):
        raise HTTPException(status_code=400, detail="Invalid file path")
    if not os.path.exists(candidate_abs):
        raise HTTPException(status_code=404, detail="File not found")
    # Basic permission check for dev: if X-User-Id provided, the file path must contain it
    if x_user_id:
        # split on OS separator and forward slashes to be safe
        parts = file_path.replace("/", os.sep).split(os.sep)
        if x_user_id not in parts:
            raise HTTPException(status_code=403, detail="Forbidden")
    return FileResponse(candidate_abs, filename=os.path.basename(candidate_abs))
