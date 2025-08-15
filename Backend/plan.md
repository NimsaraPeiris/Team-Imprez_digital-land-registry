Project refactor plan — Digital Land Registry Hub Backend

Goal
Refactor the backend to the following structure and migrate code incrementally:

Backend/
├── api/
│   └── v1/
│       └── endpoints/    # FastAPI route modules (imports expose routers)
├── crud/                 # DB operations (CRUD functions)
├── database/             # DB engine, session, and init helpers
├── models/               # SQLAlchemy models (split into modules)
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

Phase 2.5 — Models package refactor (NEW)
Goal: split model concerns into small modules while keeping `lro_backend_models.py` as the central SQLAlchemy schema registry. Ensure all imports remain stable and tests pass.

Steps:
1. Create `models/enums.py` for Enum classes (user/payment/verification enums).
2. Create `models/security.py` for password utilities (passlib context, hash/verify helpers).
3. Add `models/__init__.py` that re-exports model classes, `Base`, and helpers — keep the module-level API compatible with existing imports (so `from models.lro_backend_models import X` continues to work and `from models import X` is also possible).
4. Keep `models/lro_backend_models.py` as the canonical place where all SQLAlchemy Table/Column definitions live and as the place to run `create_all_tables()` for dev/test (it will import enums/security from the modules above).
5. Update any imports across the codebase to prefer `models` package top-level exports when convenient.
6. Run smoke tests and the full test suite, fix issues, and add small unit tests for enum binding if needed.

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
- Add a small test to assert enum values created in DB match model enum values (optional but recommended).

Phase 7 — Cleanup
- Remove old `routers/` and `db/` directories or convert them into compatibility shims after full migration.
- Update README and developer docs with new structure and run instructions.

Phase 8 — Remove legacy `routers/` folder (safe cleanup)
- Replace any non-trivial legacy router modules with minimal compatibility shims that re-export the corresponding `api.v1.endpoints` router.
- Run the full test suite and fix any remaining references to `routers.*`.
- If tests pass, delete the `routers/` directory (or move it to an `archive/` folder) in a single commit.

Notes and safety
- Perform refactor incrementally and run tests between phases.
- Keep backward-compatible re-exports while migrating to reduce changes.
- Use environment variables for DB connection (already in .env).
- Keep Alembic for migrations; do not use create_all in production except for tests/dev.

Next immediate actions (I'll perform now)
1. Add `models/__init__.py` that re-exports the model API and helpers.
2. Run smoke tests and full test suite, fix any import regressions.
3. Start migrating any large models into per-resource modules if desired (e.g., `models/users.py`, `models/applications.py`) once top-level exports are stable.

If you want me to proceed now I will:
- Create `models/__init__.py` and run the smoke test(s).
- If tests pass, run the full test suite and report back.
