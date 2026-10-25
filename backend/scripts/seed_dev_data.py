"""Compatibility entry point for the repeatable Django demo seed command."""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django
django.setup()

from django.core.management import call_command


def seed():
    call_command("seed_demo_data")


if __name__ == "__main__":
    seed()
