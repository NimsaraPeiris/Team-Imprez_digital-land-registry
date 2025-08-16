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

### Prerequisites

To set up and run this project, you will need the following installed on your machine:

  * Python (3.8+)
  * Node.js (18+)
  * pnpm (or npm/yarn if you prefer, but `pnpm` is used in the lockfile)

For local development on this branch, the backend uses SQLite by default — you do NOT need a Postgres instance.

#### 1. Backend Setup

1.  Navigate to the `backend` directory.
    ```sh
    cd backend
    ```
2.  Install the required Python packages.
    ```sh
    python -m pip install -r requirements.txt
    ```
3.  Database configuration: the backend defaults to `sqlite+aiosqlite:///./db.sqlite3` for local development. To use Postgres in production, see `database.md` for instructions.
