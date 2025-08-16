# Frontend → Backend mapping (draft)

This mapping was generated automatically from a scan of the Frontend source. It lists the primary API call sites, the backend endpoint they map to, whether auth is required, the request shape, expected response, and recommended minimal changes (backend adapters or frontend edits).

Format: Frontend file -> HTTP method PATH (auth?)

1) components/chatbot/Chatbot.tsx
   - Method: POST
   - Path: /api/chat
   - Auth: no
   - Request: { system?: string, history?: string, user: string }
   - Response: { reply: string }
   - Recommendation: OK. Use central API_BASE. (Chat router mounted at /api/chat and /chat for compatibility.)

2) contexts/auth-context.tsx
   - Method: POST
   - Path: /api/user/auth/login
   - Auth: no
   - Request: email-only: { email } OR OTP flow: { id, phone, otp }
   - Response: { access_token }
   - Recommendation: Keep backend login as-is. Add GET /api/user/auth/me endpoint (backend) so frontend can fetch user profile after obtaining token. Use api helper to attach Authorization header.

3) app/register/page.tsx
   - Method: POST
   - Path: /api/user/auth/register
   - Auth: no
   - Request: { fullName, id, email, phone, requesterType, registrationOffice }
   - Response: UserResponse (created user)
   - Recommendation: OK. After register, frontend calls login (email-only) to obtain token. Ensure authenticate() stores token and fetches profile (see #2).

4) lib/api.ts
   - Purpose: Central API helper, attaches Bearer token and exposes API_BASE
   - Recommendation: Use this helper across all frontend call sites (chat, auth, uploads). Add normalizeDownloadUrl() to convert backend '/internal/static/...' into client-usable '/api/internal/static/...' (already implemented).

5) User document endpoints (backend): /api/user/documents/upload (POST multipart/form-data)
   - Frontend locations: application pages and upload components (many file inputs across app/* pages)
   - Auth: required (Bearer token)
   - Request: FormData { application_id, document_type, file }
   - Response: DocumentResponse (includes download_url)
   - Recommendation: Frontend should call apiPostForm('/user/documents/upload', formData). Ensure Authorization header set by apiFetch helper. Normalize returned download_url with normalizeDownloadUrl() before use.

6) Document download (backend): /api/user/documents/{document_id}/download (GET)
   - Returns: { download_url }
   - Recommendation: Frontend should GET this and then navigate to normalized URL or open in new tab.

7) Internal static serving (backend): /api/internal/static/{file_path}
   - Usage: Backend serves uploaded_documents/ via internal_static router (mounted under /api)
   - generate_presigned_url currently returns '/internal/static/{object_key}' (tests expect this). Frontend helper normalizeDownloadUrl() prefixes API_BASE. Keep behavior backward-compatible.

8) File upload UI components
   - Files: components/file-upload.tsx, app/*/application/page.tsx (multiple)
   - Recommendation: Replace any ad-hoc fetch upload calls with apiPostForm; ensure FormData field names match backend (application_id, document_type, file). Add small UI integration to show returned download_url.

9) Applications endpoints (backend): /api/user/applications (create/list)
   - Frontend: app/*/application form submission pages
   - Auth: required
   - Recommendation: Use apiPostJson('/user/applications', body) and apiFetch('/user/applications') for lists. Ensure response shapes match ApplicationResponse (backend schemas use snake_case with aliases to accept camelCase).

10) Payments
   - Frontend: app/*/payment pages (use apiPostJson('/user/payments', body))
   - Auth: required
   - Recommendation: Ensure frontend uses apiPostJson and handles PaymentResponse.

Gaps and suggested backend adapters
- Add GET /api/user/auth/me -> returns current user profile (uses existing get_current_user dependency). This avoids frontend having to store user profile separately.
- Keep generate_presigned_url() returning '/internal/static/...' to satisfy tests; frontend normalizes to include API base.
- Ensure internal_static router is mounted under /api (already done) so normalized URLs work.

Action plan (next steps)
1. Add GET /api/user/auth/me to backend (small change).
2. Update frontend auth-context.authenticate() to store token, then fetch /user/auth/me and persist user profile in localStorage.
3. Replace remaining direct fetch calls in frontend for auth, chat and uploads to use shared lib/api helper (apiFetch, apiPostJson, apiPostForm) and normalize download URLs.
4. Implement file upload flow in one representative application page and test end-to-end (upload -> backend save -> returned download_url -> download via internal_static).
5. Iterate remaining pages and finish mapping updates.

I will now implement step 1 (backend endpoint) and step 2 (frontend authenticate change), then run a focused scan to update Chatbot to use API_BASE (already done) and ensure lib/api exports helpers (already done). If you want me to continue implementing file upload integration across the application pages, say "continue" and I'll proceed to modify representative upload handlers next.
