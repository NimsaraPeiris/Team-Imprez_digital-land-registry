Connect frontend ↔ backend integration plan

Goals
- Connect the Frontend and Backend so the UI is fully functional end-to-end.
- Make minimal, focused changes to Frontend only where necessary to call API endpoints or consume responses; prefer backend adapters when possible.
- Keep visual/layout/styles untouched. Any Frontend code changes must be restricted to API call locations, request/response handling, and feature toggles.
- Preserve tests and CI; update tests where behavior intentionally changes.

Scope change (important)
- Previous constraint (backend-only) lifted for this phase. You may change both Frontend and Backend code to implement a reliable integration, but avoid UI/UX redesign.
- All sensitive changes (auth, CORS, storage paths) must be clearly documented in this plan and in pull requests.

High-level phases
1) Audit (mapping)
   - Enumerate all Frontend API call sites (components, hooks, utils) and map to Backend endpoints (path, method, auth, payload, response fields).
   - Create a table of mismatches and required changes on either side.

2) Minimal adapters (backend-first)
   - Implement compatibility layers in the Backend to accept frontend shapes and return expected fields where feasible.
   - This reduces required Frontend edits and keeps rollout safe.

3) Focused Frontend changes
   - Update only the API call code in the Frontend (hooks, lib/utils) to align with the Backend’s final contract if backend adapters are insufficient or undesirable.
   - Add feature flags or environment toggles to enable/disable new behavior during QA.

4) File upload & static serving
   - Standardize the upload path and the returned download URL. Backend should return a stable URL pattern (e.g., /api/internal/static/{object_key}) and Frontend must use that URL to download files.
   - Ensure frontend uses multipart/form-data for uploads and the expected field names.

5) Auth & session
   - Decide on an auth flow: email-only login (current backend supports) or password+OTP. Align Frontend login form and calls.
   - Ensure JWT token storage on client is secure (localStorage or cookie depending on app decisions). Add short notes in repo on recommended approach.

6) Tests and verification
   - Update unit/integration tests in Backend and Frontend (where API call behavior changed).
   - Add end-to-end smoke script (curl_test.md exists) and a small local E2E checklist for QA.

7) Deployment and rollback
   - Document necessary env vars and migration steps. Provide a rollback plan if integration causes issues (feature flag off, revert API adapter).

Concrete tasks and order (recommended)
A. Audit & mapping (1-2 days)
   - Scan Frontend `app/` and `components/` for fetch/http calls and client hooks in `lib/`.
   - Produce a spreadsheet-style mapping file in the repo (connect_mapping.md) listing: frontend file, component/hook, HTTP method, URL, auth, request body, expected response fields.

B. Backend adapters: small compatibility fixes (0.5-1 day)
   - Ensure all endpoints accept camelCase aliases (Pydantic aliases already used in many places). Add any missing aliases or default behaviour.
   - Normalize presigned URL returned by `tools.minio_storage.generate_presigned_url()` to use `/api/internal/static/{object_key}` and ensure `internal_static` router handles that path (adjust router path if needed).
   - Ensure `main.startup` reliably initializes sqlite and runs DDL (already updated), and document `DATABASE_URL_ASYNC` and `AUTO_CREATE_DB` usage.

C. Frontend minimal edits (0.5-1 day)
   - Update API call util(s) to use the backend base URL (respect env var NEXT_PUBLIC_API_BASE_URL) and to send Authorization header `Bearer <token>` when available.
   - Adjust login call to POST `{ email }` (email-only) or to use the chosen flow. Do not change UI labels.
   - If file download URL returned by backend is not an absolute URL, prepend the API base URL in the frontend download helper.

D. Upload & download testing (0.5 day)
   - Upload a file from the frontend, confirm stored under `uploaded_documents/` and download via returned URL.
   - Confirm X-User-Id header behaviour for internal static endpoint if enforced; adjust backend to allow token-based checks instead if needed.

E. Payments & admin (1 day)
   - Verify admin endpoints require officer token and the frontend admin pages use that flow (update calls if necessary).

F. Tests & CI (1-2 days)
   - Run full Backend pytest suite and update tests to match contract changes.
   - Add or update Frontend unit tests for API utils (if present). Optionally add a small Cypress or Playwright smoke test to exercise core flows.

G. Documentation and rollout (0.5 day)
   - Update README and Backend/connect_plan.md with final env var list and run instructions.
   - Provide a short PR checklist and manual QA checklist.

Safety & compatibility notes
- Prefer adding backward-compatible adapters in the Backend where possible — safer and easier to roll back.
- Use feature flags in Frontend to toggle new API behavior.
- Avoid changing React components' markup/CSS. Only change API call logic, hooks, and small helpers.

Deliverables
- `Backend/connect_plan.md` (this file updated)
- `Backend/connect_mapping.md` (generated during Audit)
- Backend compatibility patches and tests
- Frontend API util edits and small test updates
- `Backend/curl_test.md` and an E2E smoke checklist

Next action (I will perform now)
1) Run an automated scan of the Frontend codebase to locate all network calls (fetch, axios, useSWR, custom hooks) and produce a draft mapping of components -> endpoints.
2) Output the mapping and proposed minimal backend or frontend changes for each mismatch.

Confirm and I will start the automated scan now.

