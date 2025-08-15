import sys
from pathlib import Path
# ensure repo root is on sys.path so top-level 'main' module can be imported
repo_root = Path(__file__).resolve().parents[1]
if str(repo_root) not in sys.path:
    sys.path.insert(0, str(repo_root))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)
payload = {
    "full_name": "Test User",
    "nic_number": "123456789V",
    "email": "testuser@example.com",
    "phone_number": "0712345678",
    "address": "Test Address",
    "password": "password123"
}
r = client.post('/api/user/auth/register', json=payload)
print('status', r.status_code)
try:
    import json
    print(json.dumps(r.json(), indent=2))
except Exception:
    print('response text:')
    print(r.text)
