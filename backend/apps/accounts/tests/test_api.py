import pytest
from rest_framework import status
from apps.accounts.models import User


@pytest.mark.django_db
def test_register_api(api_client):
    response = api_client.post(
        "/api/v1/accounts/auth/register/",
        {
            "email": "api_user@plantify.vn",
            "password": "StrongPassword123!",
            "full_name": "API User",
        },
        format="json",
    )
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data["success"] is True
    assert "tokens" in response.data["data"]
    assert "access" in response.data["tokens"]
    assert "refresh" in response.data["tokens"]


@pytest.mark.django_db
def test_login_api_success(api_client):
    user = User.objects.create_user(
        email="login_user@plantify.vn",
        password="MySecretPassword123!",
        full_name="Login User",
    )
    assert user.password != "MySecretPassword123!"  # Verifies password_hash was created
    assert user.check_password("MySecretPassword123!") is True

    # Test login endpoint
    response = api_client.post(
        "/api/v1/accounts/login/",
        {
            "email": "login_user@plantify.vn",
            "password": "MySecretPassword123!",
        },
        format="json",
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.data["success"] is True
    assert "tokens" in response.data
    assert "access" in response.data["tokens"]
    assert "refresh" in response.data["tokens"]
    assert response.data["user"]["email"] == "login_user@plantify.vn"


@pytest.mark.django_db
def test_login_api_wrong_password(api_client):
    User.objects.create_user(
        email="wrong_pass@plantify.vn",
        password="CorrectPassword123!",
        full_name="User Wrong Pass",
    )

    response = api_client.post(
        "/api/v1/accounts/login/",
        {
            "email": "wrong_pass@plantify.vn",
            "password": "WrongPassword999!",
        },
        format="json",
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_token_refresh_api(api_client):
    User.objects.create_user(
        email="refresh_user@plantify.vn",
        password="Password123!",
        full_name="Refresh User",
    )
    login_resp = api_client.post(
        "/api/v1/accounts/login/",
        {
            "email": "refresh_user@plantify.vn",
            "password": "Password123!",
        },
        format="json",
    )
    refresh_token = login_resp.data["tokens"]["refresh"]

    # Test refresh endpoint
    refresh_resp = api_client.post(
        "/api/v1/accounts/refresh/",
        {"refresh": refresh_token},
        format="json",
    )
    assert refresh_resp.status_code == status.HTTP_200_OK
    assert "access" in refresh_resp.data

