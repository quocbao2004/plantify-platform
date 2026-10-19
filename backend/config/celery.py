"""
Celery configuration scaffold for Plantify Platform.
Optional in early phase; ready for background workers (reminders, notifications).
"""
import os

try:
    from celery import Celery

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.local")

    app = Celery("plantify")
    app.config_from_object("django.conf:settings", namespace="CELERY")
    app.autodiscover_tasks()
except ImportError:
    # Celery is optional at Phase A scaffold
    app = None
