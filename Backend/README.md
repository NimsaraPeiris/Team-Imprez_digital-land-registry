# Backend README

This README documents the Backend service only. It is separate from the repository root README and focuses on running, developing, and testing the FastAPI backend.

Quick start
1. Copy `.env.example` to `.env` and fill values.
2. Run the app:
   - uvicorn main:app --reload

Local file uploads
- For development, uploaded documents are saved under `uploaded_documents/<object_name>`.
- `tools/minio_storage.py` writes files locally by default for development.
- `uploaded_documents/` is gitignored.

Tests
- Run `pytest -q` in the Backend directory. Tests run using the default SQLite configuration unless you explicitly configure a different database.

Migrations
- This project does not yet use Alembic. See `database.md` for manual schema instructions. Adding Alembic is recommended for production.

Contact
- Backend maintainer: see repository owner.

### Prerequisites

To set up and run this project, you will need the following installed on your machine:

  * Python (3.8+)
  * Node.js (18+)
  * pnpm (or npm/yarn if you prefer, but `pnpm` is used in the lockfile)

For local development, the backend uses SQLite by default.

#### 1. Backend Setup

1.  Navigate to the `backend` directory.
    ```sh
    cd backend
    ```
2.  Install the required Python packages.
    ```sh
    python -m pip install -r requirements.txt
    ```
3.  Database configuration: the backend defaults to `sqlite+aiosqlite:///./db.sqlite3` for local development.
    ```sh
    # No action required — SQLite is used by default for local development
    ```
