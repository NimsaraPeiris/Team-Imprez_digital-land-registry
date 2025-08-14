# backend/init_db.py
import asyncio
from db.lro_backend_models import create_all_tables, engine

async def main():
    """
    Initialize the database:
    - Creates all tables (for dev/test)
    - Use Alembic for production migrations
    """
    print("Creating all tables in the database...")
    try:
        await create_all_tables()
        print("All tables created successfully!")
    except Exception as e:
        print(f"Error creating tables: {e}")
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(main())
