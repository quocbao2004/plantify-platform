"""
Seed initial development data for Plantify Platform.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.local")

import django
django.setup()

from apps.accounts.models import User


def seed():
    print("Seeding development data...")
    # Seed admin user if not exists
    admin_email = "admin@plantify.vn"
    if not User.objects.filter(email=admin_email).exists():
        User.objects.create_superuser(
            email=admin_email,
            password="AdminPassword123!",
            full_name="Plantify Administrator",
        )
        print(f"Created default admin: {admin_email} / AdminPassword123!")
    else:
        print("Admin user already exists.")

    print("Seed completed.")


if __name__ == "__main__":
    seed()
