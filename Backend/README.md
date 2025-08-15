# Backend README

This README documents the Backend service only. It is separate from the repository root README and focuses on running, developing, and testing the FastAPI backend.

Quick start
1. Copy `.env.example` to `.env` and fill values.
2. Ensure PostgreSQL is running and the connection string in `.env` points to a reachable DB. If `AUTO_CREATE_DB` is enabled the app will try to create enums/tables (not recommended for production).
3. Run the app:
   - uvicorn main:app --reload

Local file uploads
- For development, uploaded documents are saved under `uploaded_documents/<object_name>`.
- `tools/minio_storage.py` now writes files locally by default; support for MinIO can be reintroduced later.
- `uploaded_documents/` is gitignored.

Tests
- Run `pytest -q` in the Backend directory. Some tests require a configured PostgreSQL database and will be skipped if not configured.

Migrations
- This project does not yet use Alembic. See `database.md` for SQL to create the required schema manually. Adding Alembic is recommended.

Contact
- Backend maintainer: see repository owner.
