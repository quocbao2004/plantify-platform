"""
Django command helper to wait for database readiness (useful for Docker & CI).
"""
import time
import os
import sys

# Ensure backend path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.local")

import django
django.setup()

from django.db import connections
from django.db.utils import OperationalError


def wait_for_db():
    print("Connecting to database...")
    db_conn = None
    attempts = 0
    while not db_conn and attempts < 30:
        try:
            db_conn = connections["default"]
            db_conn.cursor()
            print("Database is ready and accepting connections!")
            return True
        except OperationalError:
            attempts += 1
            print(f"Database unavailable, waiting 1 second... (attempt {attempts}/30)")
            time.sleep(1)
    print("Database connection timed out.")
    sys.exit(1)


if __name__ == "__main__":
    wait_for_db()
