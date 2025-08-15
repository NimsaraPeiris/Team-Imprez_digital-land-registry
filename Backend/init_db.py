from __future__ import annotations

import os
import asyncio
from dotenv import load_dotenv
from sqlalchemy import text
from sqlalchemy.engine import url as sa_url
from models.lro_backend_models import create_all_tables
from database.session import init_engine, get_engine, dispose_engine

load_dotenv()

AUTO_CREATE_DB = os.getenv("AUTO_CREATE_DB", "0") == "1"

# Note: sqlalchemy.engine.url alias not used below; keep imports minimal
try:
    from sqlalchemy.engine import url as sa_url  # keep for possible future use
except Exception:
    sa_url = None

async def tables_exist() -> bool:
    """
    Check if any tables already exist in the database.
    """
    # Ensure the engine is initialized on the current event loop
    init_engine()
    engine = get_engine()
    if engine is None:
        raise RuntimeError("Database engine not available")

    try:
        async with engine.connect() as conn:
            result = await conn.execute(
                text("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
            )
            count = result.scalar()
            return count > 0
    except Exception as exc:
        # Detect missing database (asyncpg InvalidCatalogNameError) in the exception chain
        msg = str(exc)
        if "InvalidCatalogNameError" in msg or "does not exist" in msg:
            # Try to auto-create the database if allowed
            if AUTO_CREATE_DB:
                await _create_database_from_url()
                # Re-initialize engine and retry
                await dispose_engine()
                init_engine()
                engine = get_engine()
                async with engine.connect() as conn:
                    result = await conn.execute(
                        text("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
                    )
                    count = result.scalar()
                    return count > 0
            else:
                print("ERROR: target database does not exist. Set AUTO_CREATE_DB=1 to create it automatically, or create the database manually and re-run.")
                raise
        raise

async def _create_database_from_url() -> None:
    """Create the database from DATABASE_URL_ASYNC by connecting to the server's maintenance DB.
    This only runs if AUTO_CREATE_DB=1 and the target database is missing.
    """
    try:
        from sqlalchemy.engine import make_url
        import asyncpg
    except Exception:
        raise

    # Prefer explicit sync DATABASE_URL if present (useful for admin operations)
    db_url = os.getenv("DATABASE_URL") or os.getenv("DATABASE_URL_ASYNC")
    if not db_url:
        raise RuntimeError("DATABASE_URL_ASYNC not set in environment")

    parsed = make_url(db_url)
    print(f"DEBUG: resolved DB URL for admin operations: {db_url}")
    print(f"DEBUG: parsed username={parsed.username} host={parsed.host} port={parsed.port} database={parsed.database}")
    target_db = parsed.database
    if not target_db:
        raise RuntimeError("No database name found in DATABASE_URL_ASYNC")

    # Build admin URL (connect to default 'postgres' DB) using plain 'postgresql' scheme
    try:
        admin_url = parsed.set(drivername="postgresql", database=("postgres"))
    except TypeError:
        # Fallback: construct DSN string manually replacing +asyncpg
        admin_dsn = str(parsed).replace("+asyncpg", "")
        # ensure database is 'postgres'
        if parsed.database:
            admin_dsn = admin_dsn.rsplit('/', 1)[0] + '/postgres'
    else:
        admin_dsn = str(admin_url)
    # Ensure admin_dsn doesn't include the +asyncpg suffix
    admin_dsn = admin_dsn.replace('+asyncpg', '')
    print(f"DEBUG: admin_dsn={admin_dsn}")

    print(f"Database '{target_db}' not found; attempting to create it using connection to admin DB...")
    conn = await asyncpg.connect(dsn=admin_dsn)
    try:
        await conn.execute(f'CREATE DATABASE "{target_db}"')
        print(f"Created database '{target_db}'")
    except asyncpg.DuplicateDatabaseError:
        print(f"Database '{target_db}' already exists (race)")
    finally:
        await conn.close()

async def main():
    """
    Initialize the database with a safety check and user confirmation.
    """
    print("🔍 Checking if tables already exist...")
    try:
        if await tables_exist():
            print("⚠️  Tables already exist in the database.")

            choice = input("Do you want to proceed with table creation? This may overwrite data. (y/N): ").strip().lower()
            if choice != "y":
                print("❌ Aborted. No changes made.")
                return

        print("✅ Proceeding with table creation...")
        await create_all_tables()
        print("🎉 All tables created successfully!")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
    finally:
        # Dispose engine created by init_engine()
        try:
            await dispose_engine()
        except Exception:
            pass

if __name__ == "__main__":
    asyncio.run(main())
