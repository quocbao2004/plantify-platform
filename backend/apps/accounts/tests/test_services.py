import pytest
from apps.accounts.services.register_user import register_user
from apps.common.exceptions import ConflictError


@pytest.mark.django_db
def test_register_user_service():
    user = register_user(email="newcustomer@plantify.vn", password="Password123!", full_name="New Customer")
    assert user.email == "newcustomer@plantify.vn"

    with pytest.raises(ConflictError):
        register_user(email="newcustomer@plantify.vn", password="Password123!", full_name="Duplicate")
