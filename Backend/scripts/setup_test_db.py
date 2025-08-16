r"""Postgres setup script (deprecated on sqlite-only branch)

This repository branch is configured to use SQLite for local development and CI.
This script previously created Postgres enum types/tables and is not required here.
If you need Postgres-specific setup, refer to `requirements-postgres.txt` and the
production database documentation. This script now exits with status 0 to avoid
accidental execution.
"""

import sys
print("setup_test_db.py is deprecated on the sqlite-only branch. No action taken.")
sys.exit(0)
