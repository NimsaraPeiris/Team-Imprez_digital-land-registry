r"""Run this script before tests to (re)create Postgres enum types and tables used by the application.
Usage:
    py -3 scripts/setup_test_db.py
It will read DATABASE_URL_ASYNC from environment and run models.lro_backend_models.create_all_tables().
"""
import os
import asyncio
import sys
import pathlib

# Ensure project root is on sys.path so `import models` works when running this script directly
ROOT = pathlib.Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

DB_URL = os.getenv("DATABASE_URL_ASYNC")
if not DB_URL:
    print("DATABASE_URL_ASYNC is not set. Set it in your environment or .env before running this script.")
    sys.exit(2)

# Ensure we can import the app models and their create_all_tables helper
try:
    from models.lro_backend_models import create_all_tables
except Exception as exc:
    print("Failed to import create_all_tables from models.lro_backend_models:", exc)
    sys.exit(2)

print("Running create_all_tables() to recreate enums and tables...")
try:
    asyncio.run(create_all_tables())
except Exception as exc:
    print("create_all_tables() failed:", exc)
    sys.exit(3)

print("Done.")
