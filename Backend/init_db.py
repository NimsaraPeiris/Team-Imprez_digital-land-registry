from __future__ import annotations

import asyncio
from sqlalchemy import text
from db.lro_backend_models import create_all_tables, engine

async def tables_exist() -> bool:
    """
    Check if any tables already exist in the database.
    """
    async with engine.connect() as conn:
        result = await conn.execute(
            text("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
        )
        count = result.scalar()
        return count > 0

async def main():
    """
    Initialize the database with a safety check and user confirmation.
    """
    print("🔍 Checking if tables already exist...")
    if await tables_exist():
        print("⚠️  Tables already exist in the database.")

        choice = input("Do you want to proceed with table creation? This may overwrite data. (y/N): ").strip().lower()
        if choice != "y":
            print("❌ Aborted. No changes made.")
            return

    print("✅ Proceeding with table creation...")
    try:
        await create_all_tables()
        print("🎉 All tables created successfully!")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(main())
