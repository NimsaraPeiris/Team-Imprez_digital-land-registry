# Database Setup (SQLite)

This project uses SQLite for local development and CI on the sqlite-only branch.

## Default (SQLite)

The backend uses an on-disk SQLite DB file located at `./db.sqlite3`.

To reset the local DB in the Backend folder, run (careful — this deletes the DB file):

```pwsh
# From Backend/
Remove-Item -Path .\db.sqlite3 -Force -ErrorAction SilentlyContinue
```

To create tables and seed initial data, run the application or call the helper:

```python
from models.lro_backend_models import create_all_tables
import asyncio
asyncio.run(create_all_tables())
```

Uploaded documents are stored under `uploaded_documents/` (gitignored). Filenames and per-user paths are saved in the `uploaded_documents.file_path` column in the DB. The API serves files from `/internal/static/{path}` for development, with a simple X-User-Id header check for basic permission enforcement.

## CI

CI should use the default sqlite DB (no extra setup). Ensure the CI job runs `pytest` from the Backend/ folder.

## Notes and caveats

- SQLite is used for convenience in dev and CI. It is not a drop-in replacement for production databases in all cases; differences exist in concurrency, types and SQL dialect.
- Enums are persisted as text columns when using SQLite.
- This branch and its tests assume SQLite by default.
