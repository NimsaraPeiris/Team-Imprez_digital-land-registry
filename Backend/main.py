# backend/main.py
import dotenv
dotenv.load_dotenv()
import os
import uvicorn
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import endpoint modules (each exposes `router` object)
from api.v1.endpoints import user_auth, user_applications, user_payments, user_documents, admin_applications, admin_documents, chat

# Make sure PYTHONPATH includes backend; or run from project root so imports resolve.
app = FastAPI(
    title="Digital Land Registry Hub", 
    version="0.1.0", 
    description="Backend API for Digital Land Registry Hub")

# CORS configuration (adjust for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Restrict to trusted origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers (each name here is an APIRouter exported by api.v1.endpoints)
app.include_router(user_auth, prefix="/api")
app.include_router(user_applications, prefix="/api")
app.include_router(user_payments, prefix="/api")
app.include_router(user_documents, prefix="/api")

app.include_router(admin_applications, prefix="/api")
app.include_router(admin_documents, prefix="/api")
app.include_router(chat, prefix="/api")

# mount internal static serving router
from api.v1.endpoints.internal_static import router as internal_static_router
app.include_router(internal_static_router, prefix="/api")

# Optional startup event
@app.on_event("startup")
async def startup():
    # For tests/dev: create tables and enums first using a temporary engine so we don't
    # pollute or create the application's main engine before DDL completes.
    from database.session import DATABASE_URL
    AUTO_CREATE = os.getenv('AUTO_CREATE_DB', '0') in ('1', 'true', 'yes')

    if DATABASE_URL and AUTO_CREATE:
        from models.lro_backend_models import create_all_tables_via_url
        last_exc = None
        # Retry up to 3 times as requested by user to handle transient DB states
        for attempt in range(3):
            try:
                await create_all_tables_via_url(DATABASE_URL)
                last_exc = None
                break
            except Exception as e:
                # If the error indicates lack of privileges, skip automatic DDL and
                # surface a clear message so the developer can run migrations manually.
                err_text = str(e).lower()
                if 'permission denied' in err_text or 'must be owner' in err_text or 'insufficient privilege' in err_text or 'insufficientprivilege' in err_text:
                    import logging
                    logging.warning("Skipping automatic DB DDL due to insufficient privileges. Run manual migrations: see Backend/database.md for instructions.")
                    # mark app state so tests / callers can detect that migrations were skipped
                    try:
                        app.state.db_migration_skipped = True
                    except Exception:
                        pass
                    last_exc = None
                    break
                last_exc = e
                # small backoff before retrying
                await asyncio.sleep(0.5)
        if last_exc is not None:
            # Fail fast so test runner shows the real DDL error for non-permission issues
            raise last_exc

    # Initialize DB engine/sessionmaker on the running event loop to avoid cross-loop asyncpg errors
    from database.session import init_engine, dispose_engine, get_engine
    import logging
    try:
        # Dispose any existing engine first to ensure we don't reuse connections that may be in a bad state
        try:
            await dispose_engine()
        except Exception:
            pass
        init_engine()

        # Health-check the new engine; if a connection is in an aborted state, dispose and retry once
        engine = get_engine()
        if engine is not None:
            try:
                from sqlalchemy import text as sa_text
                async with engine.connect() as conn:
                    await conn.execute(sa_text("SELECT 1"))
            except Exception as exc:
                logging.warning("DB health check failed after engine init (%s). Disposing and retrying init.", exc)
                try:
                    await dispose_engine()
                except Exception:
                    pass
                # retry init once
                init_engine()
    except Exception:
        pass


@app.on_event("shutdown")
async def shutdown():
    # Dispose engine cleanly
    from database.session import dispose_engine
    try:
        await dispose_engine()
    except Exception:
        pass

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )