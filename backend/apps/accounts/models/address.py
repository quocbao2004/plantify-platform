from django.conf import settings
from django.db import models
from apps.common.models.base import UUIDTimeStampedModel


class UserAddress(UUIDTimeStampedModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="addresses",
    )
    recipient_name = models.CharField(max_length=255, verbose_name="Tên người nhận")
    phone = models.CharField(max_length=20, verbose_name="Số điện thoại")
    address_line = models.CharField(max_length=255, verbose_name="Địa chỉ cụ thể")
    ward = models.CharField(max_length=100, verbose_name="Phường/Xã")
    district = models.CharField(max_length=100, blank=True, verbose_name="Quận/Huyện")
    province = models.CharField(max_length=100, verbose_name="Tỉnh/Thành phố")
    postal_code = models.CharField(max_length=20, blank=True, verbose_name="Mã bưu chính")
    is_default = models.BooleanField(default=False, verbose_name="Địa chỉ mặc định")

    class Meta:
        db_table = "accounts_addresses"
        verbose_name = "Sổ địa chỉ người dùng"
        verbose_name_plural = "Sổ địa chỉ người dùng"
        ordering = ["-is_default", "-created_at"]

    def __str__(self):
        return f"{self.recipient_name} - {self.address_line}, {self.ward}, {self.province}"
