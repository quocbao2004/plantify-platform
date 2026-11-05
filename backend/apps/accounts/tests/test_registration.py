from unittest.mock import patch

from django.db import IntegrityError
from django.test import override_settings
from rest_framework.test import APITestCase

from apps.accounts.models import User
from apps.accounts.services.register_user import register_user
from apps.common.exceptions import ConflictError


class RegistrationTests(APITestCase):
    url = "/api/v1/accounts/register/"

    def payload(self, **changes):
        return {
            "email": "green.home@example.com",
            "full_name": "Nguyễn An",
            "password": "Garden!Sunset2026",
            "phone": "0912345678",
            **changes,
        }

    @override_settings(PASSWORD_HASHERS=["django.contrib.auth.hashers.PBKDF2PasswordHasher"])
    def test_register_stores_profile_hashes_password_and_issues_usable_tokens(self):
        payload = self.payload(email="  Green.Home@Example.COM  ", full_name="  Nguyễn An  ")
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, 201, response.data)
        user = User.objects.get(email="green.home@example.com")
        self.assertEqual(user.full_name, "Nguyễn An")
        self.assertEqual(user.phone, payload["phone"])
        self.assertEqual(user.role, "CUSTOMER")
        self.assertTrue(user.check_password(payload["password"]))
        self.assertTrue(user.password.startswith("pbkdf2_sha256$"))
        self.assertNotIn("password", response.data["user"])

        tokens = response.data["tokens"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {tokens['access']}")
        profile = self.client.get("/api/v1/accounts/me/")
        self.assertEqual(profile.status_code, 200, profile.data)
        self.assertEqual(profile.data["data"]["phone"], payload["phone"])
        refreshed = self.client.post("/api/v1/accounts/refresh/", {"refresh": tokens["refresh"]})
        self.assertEqual(refreshed.status_code, 200, refreshed.data)

    def test_registration_without_phone(self):
        payload = self.payload()
        payload.pop("phone")
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(User.objects.get().phone, "")

    def test_duplicate_email_is_a_field_error_even_when_case_differs(self):
        User.objects.create_user(email="Green.Home@Example.com", password="existing", full_name="Existing")
        response = self.client.post(self.url, self.payload(), format="json")
        self.assertEqual(response.status_code, 409, response.data)
        self.assertIn("email", response.data["error"]["details"])
        self.assertEqual(User.objects.count(), 1)

    def test_required_fields(self):
        response = self.client.post(self.url, {}, format="json")
        self.assertEqual(response.status_code, 400)
        for field in ("email", "password", "full_name"):
            self.assertIn(field, response.data["error"]["details"])
        self.assertFalse(User.objects.exists())

    def test_invalid_fields_do_not_create_accounts(self):
        for changes, field in [
            ({"full_name": "   "}, "full_name"),
            ({"full_name": "A"}, "full_name"),
            ({"email": "not-an-email"}, "email"),
            ({"phone": "abc0912345678"}, "phone"),
            ({"phone": "091234567899"}, "phone"),
            ({"password": "short"}, "password"),
            ({"password": "12345678"}, "password"),
            ({"password": "password"}, "password"),
        ]:
            with self.subTest(changes=changes):
                response = self.client.post(self.url, self.payload(**changes), format="json")
                self.assertEqual(response.status_code, 400, response.data)
                self.assertIn(field, response.data["error"]["details"])
                self.assertFalse(User.objects.exists())

    def test_international_phone_number(self):
        response = self.client.post(self.url, self.payload(phone="+84912345678"), format="json")
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(User.objects.get().phone, "+84912345678")

    def test_cannot_register_privileged_account(self):
        response = self.client.post(
            self.url, self.payload(role="ADMIN", is_staff=True, is_superuser=True), format="json",
        )
        self.assertEqual(response.status_code, 201, response.data)
        user = User.objects.get()
        self.assertEqual(user.role, "CUSTOMER")
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_new_user_can_login_with_case_insensitive_email_and_exact_password(self):
        password = "  Garden!Sunset2026  "
        response = self.client.post(self.url, self.payload(password=password), format="json")
        self.assertEqual(response.status_code, 201, response.data)
        response = self.client.post(
            "/api/v1/accounts/login/",
            {"email": "GREEN.HOME@EXAMPLE.COM", "password": password}, format="json",
        )
        self.assertEqual(response.status_code, 200, response.data)
        self.assertIn("access", response.data["tokens"])

    def test_concurrent_duplicate_returns_conflict_instead_of_server_error(self):
        User.objects.create_user(email=self.payload()["email"], password="existing", full_name="Existing")
        with patch("apps.accounts.services.register_user.User.objects.filter") as filtered:
            filtered.return_value.exists.side_effect = [False, True]
            with patch("apps.accounts.services.register_user.User.objects.create_user", side_effect=IntegrityError):
                with self.assertRaises(ConflictError):
                    register_user(email=self.payload()["email"], password="safe", full_name="Duplicate")
