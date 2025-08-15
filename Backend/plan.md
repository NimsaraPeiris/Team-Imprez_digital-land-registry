# Project refactor plan — Digital Land Registry Hub Backend

Goal
Refactor and align the backend with the frontend routes and expectations, implement secure file uploads (development: local filesystem; production: external object storage) and ensure the backend is importable and testable without changing any frontend files.

Scope
- Only backend code will be changed (Backend/). The Frontend/ folder must remain untouched.
- Provide API endpoints that match the frontend routes and payload contracts documented in the frontend app.
- Implement file upload endpoints that store documents in a safe, testable way. For development and test runs we will use a local filesystem shim; for production you should configure an external object store (MinIO, S3) with server-side encryption.
- Add/complete compatibility shims so existing code and tests work while refactoring is incremental.
- Keep the folder structure described below.

Folder structure (target)

Backend/
├── api/
│   └── v1/
│       └── endpoints/    # FastAPI route modules (each exposes APIRouter named `router`)
├── crud/                 # DB operations (CRUD functions)
├── database/             # DB engine, session, and init helpers
├── models/               # SQLAlchemy models (split into modules)
├── schemas/              # Pydantic schemas
├── tests/                # Unit & integration tests
├── tools/                # helpers (storage shim, utilities)
├── main.py               # FastAPI entrypoint
└── plan.md               # This document

Design principles
- Do not change any files under `Frontend/`.
- Prefer non-breaking, backward-compatible changes (maintain old endpoints as shims if necessary) until frontend teams confirm an upgrade.
- Use environment variables for all secrets or environment-specific configuration.
- For local development and CI we should avoid requiring networked object storage. Implement a filesystem-backed storage shim that satisfies the same interface as the planned object-store implementation. Keep the implementation behind a single module (e.g. `Backend/tools/minio_storage.py`) so switching to MinIO/S3 in production is a minimal change.

Allowed upload document types (enforced by the API)
- Sales Agreement
- Current Title Deed
- Photo ID (Buyer & Seller)

Phase 0 — Safety and tests
- Run tests that assert basic importability and route registration. Fix syntax and small runtime errors that prevent importing the app.
- Ensure `models` package re-exports expected model classes (User, Payments, UploadedDocuments) so import-based tests pass.
- Ensure `tests/conftest.py` uses environment variables to disable DB-backed tests if DB is missing.

Phase 1 — Stabilize endpoints (short-term)
- Make all endpoint modules syntactically valid and implement minimal safe logic so imports succeed and tests can run.
- Fill incomplete CRUD functions with final commits/returns where missing.
- Decode and validate JWT tokens in auth endpoints using secrets from environment variables.
- Provide stable dependency functions for:
  - get_db (AsyncSession)
  - get_current_user (verify token and return User model or raise 401)
  - get_current_officer (verify officer token and return officer model or raise 403)

Phase 2 — Align API with frontend (concrete endpoint mapping)
- Audit the frontend to match the following API surface (examples):
  - User (prefix: /api/user)
    - POST /api/user/auth/register -> backend: register user
    - POST /api/user/auth/login -> backend: login -> returns JWT
    - GET /api/user/applications/ -> list user's applications
    - POST /api/user/applications/ -> create application
    - GET /api/user/applications/{application_id} -> get application details
    - POST /api/user/applications/documents -> attach document metadata (compatibility)
    - POST /api/user/documents/upload (multipart/form-data) -> upload document binary + metadata -> returns DocumentResponse with short-lived download URL
    - GET /api/user/documents/ -> list all documents uploaded by user
    - GET /api/user/documents/{document_id}/download -> returns a presigned URL (or redirects)
  - Admin (prefix: /api/admin)
    - GET /api/admin/applications/ -> list all applications
    - GET /api/admin/applications/{application_id} -> get application details
    - POST /api/admin/applications/{application_id}/status -> update status
    - GET /api/admin/applications/{application_id}/logs -> get logs
    - GET /api/admin/documents/ -> list all documents
    - POST /api/admin/documents/{document_id}/verify -> set verification status

- Update route decorators' response_model types to match frontend-expected shapes (Pydantic schemas in `schemas/`).
- Provide compatibility shims: if frontend calls `/api/user/applications/documents` with a JSON body (DocumentCreateRequest), continue to accept that as an alternative to multipart uploads.

Phase 3 — Local filesystem storage shim (development & CI)
- Rationale: MinIO/S3 is the target for production, but local development and CI should not require external services. Implement a filesystem-backed storage shim that exposes the same functions expected by the service code:
  - upload_file_to_minio(object_name: str, data: bytes | IO, content_type: str) -> object_key
  - generate_presigned_url(object_name: str, expires: int = 300) -> str
  - (optional) delete_object(object_name)
- Storage layout (development):
  - Base folder: `uploaded_documents/` (gitignored)
  - Per-user subfolders: `uploaded_documents/{user_id}/`
  - Per-application folders optionally: `uploaded_documents/{user_id}/applications/{application_id}/`
  - Filenames: `{timestamp_iso}_{sanitized_original_filename}` or a UUID-based filename to avoid collisions
- Implementation notes:
  - Implement the shim in `Backend/tools/minio_storage.py` so production implementation can later replace it with a MinIO client using identical function names.
  - The shim must be import-safe: no hard dependency on the `minio` package; only import optional external libraries when configured to use them.
  - Add `uploaded_documents/` to `.gitignore`.

Security and production guidance
- Production must use a real object store with encryption at rest and proper access controls. Options:
  - MinIO with server-side encryption (SSE-S3 or SSE-C)
  - Amazon S3 with SSE (SSE-S3, SSE-KMS) and bucket policies
- When using local filesystem storage in development:
  - Limit the accessible path for downloads (generate short-lived download endpoints that verify user permissions before streaming files).
  - Never commit uploaded files to source control; add `uploaded_documents/` to `.gitignore`.
  - Avoid storing sensitive PII in logs. If document content must be handled, ensure access is audited in ApplicationLog entries.

Phase 4 — CRUD and DB changes
- Ensure `UploadedDocuments` model includes: document_id, application_id, document_type, file_name, file_path, verification_status, uploaded_at
- CRUD routines to implement/verify:
  - add_document(db, application_id, document_type, file_name, file_path) -> returns UploadedDocuments
  - list_user_documents(db, user_id)
  - list_documents_for_application(db, application_id)
  - get_document_by_id(db, document_id)
  - set_document_verification(db, document_id, verification_status, officer_id, remarks=None)
- When documents are uploaded, create an ApplicationLog entry describing the upload

Phase 5 — Tests and CI
- Add unit tests for:
  - Storage utility (use the filesystem shim in CI or mock the storage functions)
  - Upload endpoint (TestClient, temporary file, use a mocked storage function or the local shim)
  - Admin verify endpoint
- Keep existing tests working. Where tests rely on DB, provide fixtures to skip or use an isolated test database. Prefer configuring tests to run without requiring external object storage.

Phase 6 — Optional improvements
- Introduce Alembic migrations to manage DB changes
- Implement role-based dependencies and decorators for `requires_officer` and `requires_user`
- Add pagination to list endpoints
- Replace the filesystem shim with a production-grade storage adapter (MinIO or S3) and add configuration flags to select the provider at runtime

## New: Service form alignment (Frontend -> Backend)

The frontend exposes five distinct service application forms. The backend will be extended to accept the exact payloads from the frontend (field names and shapes) and to persist application-level details in dedicated application-detail tables. File binaries remain uploaded via the existing document upload flow (multipart upload to `/api/user/documents/upload`) and will be associated with applications.

Services (frontend fields and backend mapping):

1) Land Transfer
- Frontend fields (grouped):
  - Seller details: fullName, email, phone, id (NIC)
  - Buyer details: fullName, email, phone, id (NIC)
  - Required documents (frontend will upload files via file upload component): original deed of transfer, purchaser NIC, purchaser photograph, vendor photograph, guarantor1_nic, guarantor2_nic, sales agreement, current title deed, photo IDs
  - Additional application-level fields: service-specific reference metadata (optional)
- Backend mapping:
  - App table: `app_land_transfer` (existing) will be extended to store seller/buyer full names, NICs, phones, and optional paths for stored signature/photo metadata. Documents uploaded remain in `uploaded_documents` and linked to the application.

2) Application for Copy of Land Registers
- Frontend fields:
  - Applicant details: fullName, address, nicNumber, date, signature(image)
  - Land details: district, village, namesOfTheLand, extent, reasonForRequest
  - Extract details: list of objects { division, volume, folio }
- Backend mapping:
  - New detail table `app_copy_of_land_registers` (or extend existing) will hold land_district, property_name(s), extent, reason, and a child table for extract folios.
  - Applicant metadata stored on `applications` or a linked detail table; signature image is a document uploaded to storage and attached to the application via `uploaded_documents`.

3) Application for Search of Land Registers
- Frontend fields:
  - Applicant details: fullName, address, nicNo, date, signature(photo)
  - Property details: village, nameOfTheLand, extent, korale, pattu, GNdivision, DSdivision
  - Registered to search: array of { division, volNo, folioNo } (multiple entries allowed)
- Backend mapping:
  - Use `app_search_land_registers` table (existing) and its child `search_register_folios`. Add columns for korale/pattu/GN/DS divisions and extent. Applicant metadata attached to `applications` and signature stored as an uploaded document.

4) Application for Search Duplicate of Deeds
- Frontend fields:
  - Applicant details: fullName, address, nicNumber, id, dateOfApplication, signature(image)
  - Notary details: notaryPublicName, districtOfStation
  - Deed details: numberOfDeeds, dateOfDeed, nameOfGarantee/transferor, nameOfGarantee/transferee, village, propertyName, extent, korale/pattu/GN/DS divisions, reasonForSearch, courtCaseNo (optional)
- Backend mapping:
  - `app_search_duplicate_deeds` table (existing) will be expanded with the above notary/deed fields and optional court case number. Deed-related uploaded files are stored in `uploaded_documents`.

5) Application for Copy (copy of a document / deed)
- Frontend fields:
  - Applicant details: fullName, address, nicNumber, date, signature(image)
  - Document details: deedNumber, dateOfDeedAttestation, notaryPublicName, notaryAddress, reasonForRequest
- Backend mapping:
  - `app_copy_of_document` (existing) will be extended to store deed metadata, attestation date and notary info. Applicant signature is an uploaded document.

Implementation approach

- Phase A (plan update and small schema changes):
  - Update `plan.md` (this change) to describe the services and mapping.
  - Add detailed Pydantic request models to `Backend/schemas/` describing the frontend payloads for each of the five services.
  - Do not change frontend code.

- Phase B (DB & models):
  - Extend the SQLAlchemy models under `Backend/models/applications.py` to include missing columns described above (korale, pattu, GN division, DS division, extents, notary fields, applicant metadata where needed). Keep existing table names and add new columns rather than renaming when possible to remain backward-compatible.
  - Add child tables for repeatable structures (extract folios already exist in `search_register_folios`). Ensure proper relationships and cascade semantics.

- Phase C (CRUD and endpoints):
  - Add/extend CRUD functions in `Backend/crud/applications.py` to create and fetch application detail rows. Keep function signatures simple and testable.
  - Update `Backend/api/v1/endpoints/user_applications.py` to accept the new request payloads and call the new CRUD functions. For multipart uploads of signatures/photos, recommended pattern:
    1) Frontend uploads signature/photo as a file (multipart) to `/api/user/documents/upload` and receives a document metadata response (with `document_id` and `file_path`).
    2) Frontend includes returned `document_id` in the application request JSON when submitting the application details (or the backend can accept the file during application creation and attach it automatically).
  - Keep backwards-compatible endpoints where possible (e.g., continue to accept the existing `ApplicationCreateRequest` shape as an alias).

- Phase D (tests and validation):
  - Add unit tests for each service request model to validate Pydantic acceptance of frontend payloads.
  - Add unit tests for CRUD creation and fetch using monkeypatched DB sessions (so non-DB tests remain green).

Security and notes

- Files (signatures and photographs) are handled via the document upload mechanism and stored in `uploaded_documents/` during development; production must use object storage and encryption.
- Avoid migrating existing data automatically; prefer additive changes (new nullable columns) so database migration is safe.

Next immediate actions (I'll start now)
1. Add Pydantic request models for the five services to `Backend/schemas/user_schemas.py` (or a new dedicated `service_schemas.py` under `schemas/`).
2. Add unit tests validating the new request models accept frontend payload shapes.
3. After tests pass locally, extend `models/applications.py` to add the missing columns and child tables required.
4. Implement CRUD functions and wire `user_applications` endpoints to accept the new payloads (keeping compatibility with existing endpoints).
