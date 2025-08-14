Project refactor plan — Digital Land Registry Hub Backend

Goal
Refactor the backend to the following structure and migrate code incrementally:

Backend/
├── api/
│   └── v1/
│       └── endpoints/    # FastAPI route modules (imports expose routers)
├── crud/                 # DB operations (CRUD functions)
├── database/             # DB engine, session, and init helpers
├── models/               # SQLAlchemy models
├── schemas/              # Pydantic schemas
├── tests/                # Unit & integration tests
├── main.py               # FastAPI entrypoint (imports routes from api.v1.endpoints)
├── init_db.py            # DB table creation helper
└── requirements.txt

Phase 1 — Create new package structure and compatibility shims (safe, non-destructive)
- Create packages: api.v1.endpoints, crud, database, models, schemas, tests
- Add __init__.py files and lightweight re-exports that point to existing code under `routers/`, `db/`, and `schemas/` to keep the app working while we migrate.
- Update `main.py` to import routers from `api.v1.endpoints` instead of `routers.*`.

Phase 2 — Move models and DB config
- Move `db/lro_backend_models.py` into `models/` as `models/lro_backend_models.py` (or split into multiple model modules).
- Create `database/session.py` to expose AsyncEngine and AsyncSession maker.
- Update code to import engine/session from `database` and models from `models`.
- Keep compatibility shims to avoid breaking import cycles.

Phase 3 — Create `crud/` layer
- Implement CRUD functions for each aggregate (users, applications, payments, documents).
- Replace direct ORM usage in routers with calls to `crud` functions.

Phase 4 — Move and consolidate routers into `api/v1/endpoints`
- Create endpoint modules in `api/v1/endpoints/` grouped by resource (auth.py, applications.py, payments.py, documents.py, admin_*.py).
- Each endpoint should depend on `schemas` and `crud`, not directly on models or sessions.

Phase 5 — Move/Refactor `schemas`
- Move existing `schemas/*.py` into `schemas/` package (re-export or rename as needed).
- Ensure Pydantic models are used in endpoints and CRUD function signatures.

Phase 6 — Tests
- Add unit tests under `tests/` for CRUD functions and endpoints (use TestClient and test database fixtures).

Phase 7 — Cleanup
- Remove old `routers/` and `db/` directories or convert them into compatibility shims after full migration.
- Update README and developer docs with new structure and run instructions.

Notes and safety
- Perform refactor incrementally and run tests between phases.
- Keep backward-compatible re-exports while migrating to reduce changes.
- Use environment variables for DB connection (already in .env).
- Keep Alembic for migrations; do not use create_all in production except for tests/dev.

Next steps (I'll perform now)
1. Create directories and __init__.py files for all new packages.
2. Add compatibility re-exports so the existing app keeps running.
3. Update `main.py` to import from new `api.v1.endpoints` package.

## Progress update — Phase 1 complete

I created the new package layout and compatibility shims so the existing app can keep running while we migrate files.

Files/directories added:
- api/v1/endpoints/ (shims exposing existing routers)
- crud/ (empty)
- database/session.py (new DB session factory)
- models/lro_backend_models.py (placeholder and create_all_tables helper)
- schemas/__init__.py (re-export)
- tests/ (empty)

Next actions (Phase 2):
1. Move full contents of `db/lro_backend_models.py` into `models/lro_backend_models.py` and adjust imports (done partially; now will move the rest).
2. Update all router modules to import get_db from `database.session` instead of `db.lro_backend_models`.
3. Start creating CRUD functions under `crud/` and replace raw ORM usage in routers progressively.

I'll now proceed with Phase 2 step 1 and 2: update router imports and move the full model file.

## Progress update — Phase 2 complete

I moved the full model definitions from `db/lro_backend_models.py` into `models/lro_backend_models.py` and created `database/session.py` as the canonical async session provider. The `create_all_tables` and seeding helpers were adapted to use `models.seed_data`. Compatibility shims remain in place so the app can keep running during migration.

Phase 3 — CRUD layer (progress)
- Implemented CRUD modules for users, applications, payments, documents and admin application flows under `crud/`.
- Updated user-facing endpoints under `api/v1/endpoints/` to call the CRUD functions and use `database.session.get_db` and the new schemas.
- Migrated admin applications endpoints to use the admin CRUD functions.
- Implemented admin documents endpoints to delegate to `crud.documents` (verification/listing) and added `list_all_documents` and `set_document_verification` helpers.

Phase 4 — Endpoints (status)
- User endpoints (auth, applications, payments, documents) migrated and wired to CRUD.
- Admin endpoints mostly migrated (applications and documents). Some legacy routers remain as compatibility copies under `routers/` but they now point to the new session and models so runtime is preserved.

Next immediate actions
1. Run a quick static search for remaining legacy imports and references to `db/` and `routers/` and prepare a safe cleanup plan.
2. Add basic unit/integration tests under `tests/` (smoke tests for main endpoints and CRUD functions).
3. After tests pass locally, remove or archive the legacy `db/` and `routers/` directories.

If you want me to proceed now I will:
- Run the static search and remove or convert any remaining legacy references.
- Create minimal tests (TestClient-based) for auth register/login, creating an application, adding a document, and admin document verification.
- When tests are in place and passing, remove the legacy `db/` and `routers/` folders.

## New task: Reconfigure .env and wire configuration across the codebase

Goal
- Create a single canonical `.env` with all runtime configuration keys the project needs.
- Update code to read configuration values from environment variables (using python-dotenv) consistently.
- Keep secure defaults out of source control; use placeholder values in `.env` that developers replace locally or CI secrets.

Scope
- Update `.env` with: SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES, JWT_SECRET, JWT_ALGORITHM, DATABASE_URL_ASYNC, DATABASE_ECHO, ENVIRONMENT, LOG_LEVEL, SENTRY_DSN (optional), and MAIL/SMTP placeholders.
- Update `database/session.py` to read `DATABASE_URL_ASYNC` and `DATABASE_ECHO` from environment.
- Update `api/v1/endpoints/user_auth.py` to read token expiration from environment and avoid hard-coded defaults.
- Verify `admin_*` endpoints already read `JWT_SECRET`/`JWT_ALGORITHM` from env; keep them.
- Update tests to respect env-driven behavior (they already detect engine.url).

Plan (steps)
1. Update `plan.md` (this section) and ask for confirmation (done).
2. Write a complete `.env` with placeholders and sensible dev defaults (non-secret values only).
3. Update `database/session.py` to use `DATABASE_URL_ASYNC` and `DATABASE_ECHO`.
4. Update `api/v1/endpoints/user_auth.py` to use environment-driven token expiry and ensure variable names match `.env`.
5. Run test suite; fix any issues caused by config changes.
6. Commit the changes and report back.

Safety notes
- Keep secrets in environment or secret manager for production; do not commit real secrets.
- Defaults in `.env` are for local development only (use a separate `.env.example` if you prefer to commit an example file instead of real `.env`).

I'll now implement the `.env` update and code changes (steps 2-4), run the test suite, and fix issues if any.
