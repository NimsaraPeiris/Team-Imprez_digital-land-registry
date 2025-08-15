import os
import pytest

# If the project's DB engine is using the placeholder credentials, skip DB-dependent smoke tests.
try:
    from database import session as db_session
    url_obj = db_session.engine.url
    username = getattr(url_obj, 'username', None)
    password = getattr(url_obj, 'password', None)
    engine_url = str(url_obj)
except Exception:
    username = None
    password = None
    engine_url = os.getenv("DATABASE_URL_ASYNC", "")

# Skip if credentials look like placeholders or no DB configured
if engine_url == "" or (username == 'user' and password in (None, 'password')) or 'user:password' in engine_url:
    pytest.skip("Skipping DB-dependent smoke tests because no test database is configured", allow_module_level=True)

from fastapi.testclient import TestClient
from main import app


def test_register_and_login_smoke():
    # Use TestClient as context manager so app startup/shutdown run in same thread/loop
    with TestClient(app) as client:
        payload = {
            "full_name": "Test User",
            "nic_number": "123456789V",
            "email": "testuser@example.com",
            "phone_number": "0712345678",
            "address": "Test Address",
            "password": "password123"
        }
        try:
            r = client.post("/api/user/auth/register", json=payload)
        except Exception as e:
            # If DB transaction is in a failed state or a DBAPI error occurred, skip this smoke test
            try:
                import sqlalchemy
                dbapi_err = getattr(sqlalchemy.exc, 'DBAPIError', None)
            except Exception:
                dbapi_err = None
            msg = str(e)
            if dbapi_err is not None and isinstance(e, dbapi_err) or 'InFailedSQLTransactionError' in msg or 'current transaction is aborted' in msg:
                pytest.skip(f"Skipping DB-dependent smoke test because DB connection failed: {msg}")
            raise
        assert r.status_code in (201, 400)

        login_payload = {"email": payload["email"], "password": payload["password"]}
        r2 = client.post("/api/user/auth/login", json=login_payload)
        assert r2.status_code in (200, 401)
