"""Verify the configured Django database with read-only queries, without migrations."""

import os
import sys
from pathlib import Path
from urllib.parse import quote

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django

django.setup()

from django.db import connection
from django.db.utils import DatabaseError


def main():
    config = connection.settings_dict
    if connection.vendor != "postgresql":
        print("The configured database is not PostgreSQL. Check backend/.env.")
        return 1

    print(f"Connecting to {config['HOST']}:{config['PORT']}/{config['NAME']} ...")
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT current_database(), current_user")
            database, user = cursor.fetchone()
        # With a pooler, pg_stat_ssl describes the pooler-to-database hop.
        # Check libpq instead to verify this application's actual TLS connection.
        ssl_active = connection.connection.pgconn.ssl_in_use
        print(f"Connected successfully. Database: {database}; user: {user}.")
        print(f"Client SSL active: {ssl_active}.")
        if not ssl_active:
            print("SSL is required for the remote database connection.")
            return 1
        return 0
    except DatabaseError as exc:
        message = str(exc)
        password = config.get("PASSWORD")
        if password:
            message = message.replace(password, "[REDACTED]")
            message = message.replace(quote(password, safe=""), "[REDACTED]")
        print(f"Database connection failed: {message}")
        return 1
    finally:
        connection.close()


if __name__ == "__main__":
    sys.exit(main())
