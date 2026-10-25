import pytest
from apps.accounts.models import User, UserAddress


@pytest.mark.django_db
def test_create_user_normalizes_email():
    user = User.objects.create_user(email="Test.User@Plantify.VN", password="Password123!", full_name="Test User")
    assert user.email == "Test.User@plantify.vn"
    assert user.check_password("Password123!")
    assert not user.is_staff


@pytest.mark.django_db
def test_create_superuser():
    admin = User.objects.create_superuser(email="admin@plantify.vn", password="AdminPassword123!", full_name="Admin")
    assert admin.is_staff
    assert admin.is_superuser
