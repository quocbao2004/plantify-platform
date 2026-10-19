"""
Local development settings for Plantify Platform.
"""

from .base import *

DEBUG = True

# Database: Uses PostgreSQL if configured via ENV, falls back to SQLite for easy local dev
DB_ENGINE = os.getenv("DATABASE_ENGINE", "")
if "postgres" in DB_ENGINE or os.getenv("POSTGRES_DB"):
    DATABASES = {
        "default": {
            "ENGINE": os.getenv("DATABASE_ENGINE", "django.db.backends.postgresql"),
            "NAME": os.getenv("POSTGRES_DB", "plantify"),
            "USER": os.getenv("POSTGRES_USER", "postgres"),
            "PASSWORD": os.getenv("POSTGRES_PASSWORD", "postgres"),
            "HOST": os.getenv("POSTGRES_HOST", "localhost"),
            "PORT": os.getenv("POSTGRES_PORT", "5432"),
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / os.getenv("DATABASE_NAME", "db.sqlite3"),
        }
    }

ALLOWED_HOSTS = ["*"]
CORS_ALLOW_ALL_ORIGINS = True
