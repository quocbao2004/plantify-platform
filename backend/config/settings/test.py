"""
Test settings for Plantify Platform.
Fast in-memory database and disabled password hashing overhead.
"""

from .base import *

DEBUG = False
TESTING = True

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}

PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.MD5PasswordHasher",
]
