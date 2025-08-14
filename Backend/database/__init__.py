# database package exports - avoid importing a module-level engine at import time
from .session import (
    init_engine,
    get_engine,
    get_sessionmaker,
    get_db,
    dispose_engine,
)

# Backwards-compatible names (no engine/async_session exported)
__all__ = [
    "init_engine",
    "get_engine",
    "get_sessionmaker",
    "get_db",
    "dispose_engine",
]
