import pytest
from rest_framework import status


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
