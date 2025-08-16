# Database Setup and Manual Migration Instructions

This file explains how to prepare a PostgreSQL database for the **Digital Land Registry Hub** backend when automatic DDL cannot be run from the app due to permission restrictions.

It includes SQL statements to create the database, schema, enum types, and tables required by the application.
Run these commands as a **PostgreSQL superuser** or as a **database role** that has sufficient privileges to create schemas, types, and tables.

> **Note:** This file is intended for local development or CI where you control the database server.
> In production, use a proper migration system (**Alembic**) and run migrations from CI or a migration management process.

## Default (SQLite) — recommended for local development and CI

The backend uses an on-disk SQLite DB file located at `./db.sqlite3`.

To reset the local DB in the Backend folder, run (careful — this deletes the DB file):

```pwsh
# From Backend/
Remove-Item -Path .\db.sqlite3 -Force -ErrorAction SilentlyContinue
```

To create tables and seed initial data, run the application or call the helper:

```python
from models.lro_backend_models import create_all_tables
import asyncio
asyncio.run(create_all_tables())
```

Uploaded documents are stored under `uploaded_documents/` (gitignored). Filenames and per-user paths are saved in the `uploaded_documents.file_path` column in the DB. The API serves files from `/internal/static/{path}` for development, with a simple X-User-Id header check for basic permission enforcement.

## Optional: enable Postgres (not recommended for local dev)

If you need to run against Postgres (production), install the optional Postgres requirements and set `DATABASE_URL_ASYNC` to a Postgres URL:

```pwsh
python -m pip install -r requirements-postgres.txt
# then set DATABASE_URL_ASYNC in .env to a postgresql+asyncpg:// URL
```

When using Postgres you should use a migration tool (Alembic) to manage schema changes.

## 3) Create Enum Types Used by the Application

Run as superuser (or owner) in the target database:

```sql
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type_enum') THEN
        CREATE TYPE user_type_enum AS ENUM ('citizen', 'officer', 'admin');
    END IF;
END$$;
```

```sql
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'verification_status_enum') THEN
        CREATE TYPE verification_status_enum AS ENUM ('Pending', 'Verified', 'Rejected');
    END IF;
END$$;
```

```sql
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status_enum') THEN
        CREATE TYPE payment_status_enum AS ENUM ('Pending', 'Completed', 'Failed', 'Refunded');
    END IF;
END$$;
```

## 4) Create Tables (DDL)

The following DDL matches the SQLAlchemy models in `models/` used by the application.
Run these statements as the role that will own the objects (`postgres`).

**Users table:**

```sql
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    nic_number VARCHAR(32) NOT NULL,
    email VARCHAR(320) NOT NULL,
    phone_number VARCHAR(32),
    password_hash VARCHAR(255) NOT NULL,
    address TEXT,
    user_type user_type_enum DEFAULT 'citizen' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    failed_login_attempts INTEGER DEFAULT 0 NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_users_email ON users (email);
CREATE UNIQUE INDEX IF NOT EXISTS uq_users_nic ON users (nic_number);
```

**Uploaded Documents table:**

```sql
CREATE TABLE IF NOT EXISTS uploaded_documents (
    document_id SERIAL PRIMARY KEY,
    application_id INTEGER,
    user_id INTEGER,
    name VARCHAR(255),
    document_type VARCHAR(255),
    minio_object_key VARCHAR(1024),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
```

> Application tables, payments, logs, etc. — add additional DDL here matching your models.

## 5) Seeding Initial Data (Optional)

If your models expect seeded records (roles, offices, etc.), insert them now.
There may be a `seed_data` module in `models/seed_data.py` if you prefer to run seeding through SQLAlchemy in a script.

## 6) Using the Provided `.env`

Update `.env` or `.env.local` in the Backend folder to point to your DB and user.
Example values are in `.env.example`:

```env
DATABASE_URL_ASYNC=postgresql+asyncpg://postgres:postgres@localhost:5432/testdb
AUTO_CREATE_DB=0  # disable app auto-creation if you created objects manually
```

## 7) Running the App and Tests

* After creating the schema and tables, ensure `AUTO_CREATE_DB` is set to `0` (or remove it) so the app won't attempt to create DDL on startup.
* Run tests:

  ```bash
  pytest -q
  ```

  Or run specific tests:

  ```bash
  pytest tests/test_crud_smoke.py
  ```

## 8) Recommended: Use Alembic for Migrations

* For a robust workflow, add **Alembic** and generate migrations from your SQLAlchemy models.
* Commit migration scripts to VCS and apply them from CI or during deployment.
