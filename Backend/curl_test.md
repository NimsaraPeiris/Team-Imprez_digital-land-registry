# curl_test.md

Quick curl (PowerShell / pwsh) examples to exercise the backend API. Replace placeholders (BASE, TOKEN, IDs, file paths) before running.

# Set base URL
```bash
$BASE = 'http://127.0.0.1:8000'
```


## 1) Register (create user)
```bash
curl.exe -X POST "$BASE/api/user/auth/register" -H "Content-Type: application/json" -d '{"full_name":"Alice Example","nic_number":"NIC123456","email":"alice@example.com","password":"secret","phone_number":"0712345678","registration_office":"Central Office"}'
```

## 2) Login (email/password) -> returns JSON with access_token
```bash
curl.exe -X POST "$BASE/api/user/auth/login" -H "Content-Type: application/json" -d '{"email":"alice@example.com","password":"secret"}'
```

Note: save the returned access_token for authenticated calls, e.g. in pwsh:

```
$resp = curl.exe -s -X POST "$BASE/api/user/auth/login" -H "Content-Type: application/json" -d '{"email":"alice@example.com","password":"secret"}' | ConvertFrom-Json
```
```
$TOKEN = $resp.access_token
```

## 3) Login (id + phone + otp) — OTP flow
```bash
curl.exe -X POST "$BASE/api/user/auth/login" -H "Content-Type: application/json" -d '{"id":"NIC123456","phone":"0712345678","otp":"123456"}'
```


## 4) Chat endpoint (no auth)
```bash
curl.exe -X POST "$BASE/api/chat" -H "Content-Type: application/json" -d '{"user":"Hello backend"}'
```

## 5) List current user's applications
```bash
curl.exe -X GET "$BASE/api/user/applications/" -H "Authorization: Bearer <TOKEN>"
```
Authenticated user endpoints: set header Authorization: Bearer <TOKEN>

## 6) Create application (simple payload)
```bash
curl.exe -X POST "$BASE/api/user/applications/" -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"service_id":1,"reference_number":"REF-001"}'
```

## 7) Get application by id
```bash
curl.exe -X GET "$BASE/api/user/applications/123" -H "Authorization: Bearer <TOKEN>"
```

## 8) Add document record to an application (JSON)
```bash
curl.exe -X POST "$BASE/api/user/applications/documents" -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"application_id":123,"document_type":"Current Title Deed","file_name":"deed.pdf","file_path":"applications/123/deed.pdf"}'
```


User document upload (multipart/form-data):

## 9) Upload a file to an application (multipart)
```bash
curl.exe -X POST "$BASE/api/user/documents/upload" -H "Authorization: Bearer <TOKEN>" -F "application_id=123" -F "document_type=Current Title Deed" -F "file=@C:\path\to\file.pdf"
```
## 10) List my documents
```bash
curl.exe -X GET "$BASE/api/user/documents/" -H "Authorization: Bearer <TOKEN>"
```

## 11) Request download URL for a document
```bash
curl.exe -X GET "$BASE/api/user/documents/456/download" -H "Authorization: Bearer <TOKEN>"
```


User payments

## 12) Create a payment for an application
```bash
curl.exe -X POST "$BASE/api/user/payments/" -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"application_id":123,"amount":5000,"method":"card","reference":"PAY-001"}'
```

## 13) List payments for application
```bash
curl.exe -X GET "$BASE/api/user/payments/application/123" -H "Authorization: Bearer <TOKEN>"
```


Admin endpoints (require officer account / token)
```bash
## 14) List all documents (admin)
curl.exe -X GET "$BASE/api/admin/documents/" -H "Authorization: Bearer <TOKEN>"
```

## 15) Verify a document (admin)
```bash
curl.exe -X POST "$BASE/api/admin/documents/456/verify" -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"verification_status":"verified","remarks":"OK"}' -v
```
## 16) List all applications (admin)
```bash
curl.exe -X GET "$BASE/api/admin/applications/" -H "Authorization: Bearer <TOKEN>"
```

## 17) Get application detail (admin)
```bash
curl.exe -X GET "$BASE/api/admin/applications/123" -H "Authorization: Bearer <TOKEN>"
```

## 18) Update application status (admin)
```bash
curl.exe -X POST "$BASE/api/admin/applications/123/status" -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"status_id":2,"remarks":"Approved"}'
```

## 19) Get application logs (admin)
```bash
curl.exe -X GET "$BASE/api/admin/applications/123/logs" -H "Authorization: Bearer <TOKEN>"
```


Internal static serving (files under uploaded_documents/)

## 20) Retrieve an uploaded file
# If file path contains user id and you want to assert that header requirement, include X-User-Id
```bash
curl.exe -X GET "$BASE/api/internal/static/uploads/USER_ID/filename.pdf" -H "X-User-Id: <USER_ID>"
```

# Or without header:
```bash
curl.exe -X GET "$BASE/api/internal/static/uploads/USER_ID/filename.pdf"
```

Notes:
- Ensure the backend is running (uvicorn main:app --reload or via your preferred method) and that the DB and uploaded_documents/ are available/writable.
- Replace <TOKEN>, <USER_ID>, <APPLICATION_ID>, <DOCUMENT_ID>, and file paths with real values from your environment.
- The login endpoint returns JSON: {"access_token":"<TOKEN>","token_type":"bearer"} — use the access_token value in Authorization header.

