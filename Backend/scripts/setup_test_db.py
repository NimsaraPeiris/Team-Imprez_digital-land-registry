r"""Run this script before tests to (re)create Postgres enum types and tables used by the application.
Usage:
    py -3 scripts/setup_test_db.py

This version uses the refactored database.session init_engine/get_engine so the
engine is created on the current event loop and passed into create_all_tables().
If the configured DB user lacks privilege to create Postgres enum types this
script can optionally use a superuser URL provided in DATABASE_SUPERUSER_URL to
create the types and then proceed.
"""
import os
import asyncio
import sys
import pathlib

# Ensure project root is on sys.path so `import models` and `database` work
ROOT = pathlib.Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

# Load environment variables from the project's .env so values set there (e.g. DATABASE_URL_ASYNC,
# DATABASE_SUPERUSER_URL) are available when this script runs.
from dotenv import load_dotenv, find_dotenv
# Prefer explicit project .env in repo root; fall back to find_dotenv()
env_path = ROOT / '.env'
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv(find_dotenv())

# Helper to check multiple possible env var names (accept common alternatives)
def _get_first_env(*names):
    for n in names:
        v = os.getenv(n)
        if v:
            return v
    return None

# Prefer explicit DATABASE_URL_ASYNC; accept fallbacks if user used alternate names
DB_URL = _get_first_env(
    "DATABASE_URL_ASYNC",
    "DATABASE_URL",
    "SQLALCHEMY_DATABASE_URL",
    "DATABASE_URL_ASYNC_URL",
)

# Accept several possible names for a superuser URL that you might have put in .env
SUPERUSER_URL = _get_first_env(
    "DATABASE_SUPERUSER_URL",
    "DATABASE_SUPERUSER_ASYNC_URL",
    "SUPERUSER_DATABASE_URL",
    "POSTGRES_SUPERUSER_URL",
    "SUPERUSER_URL",
)

# Normalize URL to ensure asyncpg driver is present (create_async_engine requires async dialect)
from urllib.parse import urlparse, urlunparse

def _normalize_async_url(url: str) -> str:
    if not url:
        return url
    # Common case: user provided postgres:// or postgresql:// without +asyncpg
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+asyncpg://", 1)
    if url.startswith("postgresql://") and "+asyncpg" not in url:
        return url.replace("postgresql://", "postgresql+asyncpg://", 1)
    return url

# Mask URL for safe display: show scheme and host only
def _mask_url(url: str) -> str:
    if not url:
        return "(none)"
    try:
        p = urlparse(url)
        host = p.hostname or ""
        port = f":{p.port}" if p.port else ""
        return f"{p.scheme}://{host}{port}"
    except Exception:
        # fallback to truncation
        return (url[:40] + "...") if len(url) > 40 else url

# Apply normalization
DB_URL = _normalize_async_url(DB_URL)
SUPERUSER_URL = _normalize_async_url(SUPERUSER_URL)

# Helpful diagnostics without printing secrets
if DB_URL:
    print("Found application database URL in environment (masked):", _mask_url(DB_URL))
else:
    print("Warning: no DATABASE_URL_ASYNC (or fallback) found in environment; database.session will use its default if available.")

if SUPERUSER_URL:
    print("Found superuser database URL in environment (masked):", _mask_url(SUPERUSER_URL))
    print("It will be used if creating types requires superuser privileges.")

# Import DB session helpers from the refactored package
try:
    from database.session import init_engine
except Exception as exc:
    print("Failed to import database.session.init_engine:", exc)
    sys.exit(2)

# Import models helper
try:
    from models.lro_backend_models import create_all_tables
except Exception as exc:
    print("Failed to import create_all_tables from models.lro_backend_models:", exc)
    sys.exit(2)

# Helper to create enum types using a superuser connection
async def _create_types_with_superuser(super_url: str):
    from sqlalchemy.ext.asyncio import create_async_engine
    from sqlalchemy import text

    engine = create_async_engine(super_url, future=True)
    try:
        async with engine.begin() as conn:
            # Use DO blocks with single-quoted EXECUTE strings (escape inner single quotes)
            # to avoid nested dollar-quoting issues on some Postgres versions.
            await conn.execute(text("""
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t JOIN pg_namespace n ON t.typnamespace = n.oid
    WHERE t.typname = 'user_type_enum' AND n.nspname = 'public'
  ) THEN
    EXECUTE 'CREATE TYPE public.user_type_enum AS ENUM (''citizen'',''officer'',''admin'')';
  END IF;
END$$;
"""))
            await conn.execute(text("""
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t JOIN pg_namespace n ON t.typnamespace = n.oid
    WHERE t.typname = 'verification_status_enum' AND n.nspname = 'public'
  ) THEN
    EXECUTE 'CREATE TYPE public.verification_status_enum AS ENUM (''Pending'',''Verified'',''Rejected'')';
  END IF;
END$$;
"""))
            await conn.execute(text("""
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t JOIN pg_namespace n ON t.typnamespace = n.oid
    WHERE t.typname = 'payment_status_enum' AND n.nspname = 'public'
  ) THEN
    EXECUTE 'CREATE TYPE public.payment_status_enum AS ENUM (''Pending'',''Completed'',''Failed'',''Refunded'')';
  END IF;
END$$;
"""))
    finally:
        await engine.dispose()

# Initialize engine on the current event loop
try:
    if DB_URL:
        engine = init_engine(database_url=DB_URL)
    else:
        engine = init_engine()
except Exception as exc:
    print("Failed to initialize DB engine:", exc)
    sys.exit(3)

print("Running create_all_tables() to recreate enums and tables...")
try:
    # Pass the engine so create_all_tables uses the same AsyncEngine instance
    asyncio.run(create_all_tables(engine=engine))
except Exception as exc:
    msg = str(exc)
    print("create_all_tables() failed:", exc)

    # Detect permission/privilege errors when trying to CREATE TYPE in the DB
    if "permission denied" in msg.lower() or "insufficientprivilegeerror" in msg.lower():
        if not SUPERUSER_URL:
            print("")
            print("The database user does not have permission to CREATE TYPE in schema 'public'.")
            print("Attempting to create a user-owned schema and run the setup there so a non-superuser can proceed.")

            # Try to create a per-user schema and run create_all_tables using that schema
            try:
                from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
                from sqlalchemy import text
                from getpass import getuser
                import re
                import database.session as dbsession

                raw_user = getuser() or 'user'
                schema = f"dlr_{raw_user}".lower()
                # sanitize to postgres identifier rules (simple)
                schema = re.sub(r"[^a-z0-9_]+", "_", schema)

                async def _create_schema_and_run(engine_url: str, schema_name: str):
                    # engine to run DDL as normal user (create schema)
                    tmp_engine = create_async_engine(engine_url, future=True)
                    try:
                        async with tmp_engine.begin() as conn:
                            await conn.execute(text(f"CREATE SCHEMA IF NOT EXISTS \"{schema_name}\" AUTHORIZATION current_user;"))
                    finally:
                        await tmp_engine.dispose()

                    # engine with search_path set to the new schema so CREATE TYPE will create types there
                    engine_with_sp = create_async_engine(
                        engine_url, future=True,
                        connect_args={"server_settings": {"search_path": f"{schema_name}, public"}}
                    )

                    # Ensure database.session uses this engine for seeding later
                    try:
                        dbsession._engine = engine_with_sp
                        dbsession._async_session = async_sessionmaker(bind=engine_with_sp, expire_on_commit=False)
                    except Exception:
                        # best-effort; continue even if we can't set these
                        pass

                    try:
                        await create_all_tables(engine=engine_with_sp)
                    finally:
                        await engine_with_sp.dispose()

                target_db = DB_URL or os.getenv("DATABASE_URL_ASYNC")
                if not target_db:
                    raise RuntimeError("No DATABASE_URL_ASYNC available to create user schema")

                asyncio.run(_create_schema_and_run(target_db, schema))
                print(f"create_all_tables() succeeded using schema '{schema}' on {target_db}")
                sys.exit(0)
            except Exception as exc2:
                print("Failed to create user schema and run create_all_tables:", exc2)
                print("")
                print("If this fails you will need to either grant the application's DB user the right to create types in schema 'public' or provide a superuser URL in DATABASE_SUPERUSER_URL.")
                sys.exit(6)

        print("Attempting to create enum types using DATABASE_SUPERUSER_URL...")
        try:
            asyncio.run(_create_types_with_superuser(SUPERUSER_URL))
        except Exception as exc2:
            print("Failed to create enum types with superuser URL:", exc2)
            sys.exit(6)

        # Retry the normal create_all_tables now that enums exist
        try:
            asyncio.run(create_all_tables(engine=engine))
        except Exception as exc3:
            print("Retry after creating enum types failed:", exc3)
            sys.exit(7)

    else:
        # Unknown error — re-raise/exit with failure
        sys.exit(4)

print("Done.")
