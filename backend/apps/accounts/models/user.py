from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from apps.common.models.base import UUIDTimeStampedModel
from apps.accounts.constants.choices import UserRole
from apps.accounts.utils.normalize_email import normalize_email_address


class UserManager(BaseUserManager):
    """Custom manager enforcing email-based identity and normalized emails."""

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email là trường bắt buộc.")
        email = normalize_email_address(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", UserRole.ADMIN)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser phải có is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser phải có is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin, UUIDTimeStampedModel):
    """
    Custom User Model for Plantify Platform.
    Auth identifier is normalized email. Primary key is UUID.
    """
    email = models.EmailField(unique=True, db_index=True, verbose_name="Email")
    full_name = models.CharField(max_length=255, verbose_name="Họ và tên")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Số điện thoại")
    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.CUSTOMER,
        db_index=True,
        verbose_name="Vai trò",
    )
    is_active = models.BooleanField(default=True, verbose_name="Đang hoạt động")
    is_staff = models.BooleanField(default=False, verbose_name="Nhân viên")
    date_joined = models.DateTimeField(default=timezone.now, verbose_name="Ngày tham gia")

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]

    class Meta:
        db_table = "accounts_users"
        verbose_name = "Người dùng"
        verbose_name_plural = "Người dùng"

    def __str__(self):
        return f"{self.email} ({self.get_role_display()})"
