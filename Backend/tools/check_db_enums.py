import os
import json
import asyncio
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL_ASYNC")
if not DATABASE_URL:
    print(json.dumps({"error": "DATABASE_URL_ASYNC not set"}))
    raise SystemExit(1)

# Don't attempt if placeholder
if "user:password" in DATABASE_URL or "example" in DATABASE_URL:
    print(json.dumps({"error": "DATABASE_URL_ASYNC looks like a placeholder"}))
    raise SystemExit(1)

async def get_enums():
    engine = create_async_engine(DATABASE_URL)
    typenames = ["user_type_enum", "verification_status_enum", "payment_status_enum", "payment_status_enum"]
    q = text("SELECT t.typname, e.enumlabel FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = ANY(:names) ORDER BY t.typname, e.enumsortorder;")
    async with engine.begin() as conn:
        res = await conn.execute(q, {"names": typenames})
        rows = res.fetchall()
    mapping = {}
    for typname, label in rows:
        mapping.setdefault(typname, []).append(label)
    print(json.dumps({"enums": mapping}))

if __name__ == '__main__':
    asyncio.run(get_enums())
