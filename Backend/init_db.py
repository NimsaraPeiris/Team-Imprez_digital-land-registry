import asyncio
from db.lro_backend_models import create_all_tables

if __name__ == "__main__":
    asyncio.run(create_all_tables())