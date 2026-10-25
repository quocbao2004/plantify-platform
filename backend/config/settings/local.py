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
            "CONN_MAX_AGE": int(os.getenv("POSTGRES_CONN_MAX_AGE", "60")),
            "CONN_HEALTH_CHECKS": True,
            "OPTIONS": {
                "sslmode": os.getenv("POSTGRES_SSLMODE", "require"),
                "connect_timeout": int(os.getenv("POSTGRES_CONNECT_TIMEOUT", "10")),
            },
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
