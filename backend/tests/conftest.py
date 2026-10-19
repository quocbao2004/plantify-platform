"""
Pytest global fixtures for Plantify Platform.
"""
import pytest
from rest_framework.test import APIClient
from apps.accounts.models import User


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def test_user(db):
    return User.objects.create_user(
        email="customer@plantify.vn",
        password="TestPassword123!",
        full_name="Nguyễn Văn Khách",
    )


@pytest.fixture
def auth_client(api_client, test_user):
    api_client.force_authenticate(user=test_user)
    return api_client
