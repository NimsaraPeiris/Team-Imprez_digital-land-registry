from fastapi import FastAPI
from main import app


def test_app_importable():
    assert isinstance(app, FastAPI)


def test_expected_routes_present():
    paths = {r.path for r in app.routes}
    expected_prefixes = [
        "/api/user/auth",
        "/api/user/applications",
        "/api/user/payments",
        "/api/user/documents",
        "/api/admin/applications",
        "/api/admin/documents",
    ]
    for p in expected_prefixes:
        assert any(path.startswith(p) for path in paths), f"Expected route starting with {p} not found"
