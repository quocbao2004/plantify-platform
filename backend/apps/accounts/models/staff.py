from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from .user import User


class Staff(UUIDTimeStampedModel):
    """
    Staff model representing internal operational staff (caregivers, shippers, technicians).
    Linked 1-to-1 with User model.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="staff_profile",
        verbose_name="Tài khoản người dùng",
    )
    staff_code = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        verbose_name="Mã nhân viên",
    )
    department = models.CharField(
        max_length=100,
        blank=True,
        default="Vận hành",
        verbose_name="Phòng ban",
    )
    position = models.CharField(
        max_length=100,
        blank=True,
        default="Nhân viên chăm sóc",
        verbose_name="Vị trí / Chức vụ",
    )
    is_available = models.BooleanField(
        default=True,
        verbose_name="Sẵn sàng nhận việc",
    )
    notes = models.TextField(
        blank=True,
        verbose_name="Ghi chú",
    )

    class Meta:
        db_table = "staff"
        verbose_name = "Nhân viên"
        verbose_name_plural = "Nhân viên"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.staff_code} - {self.user.full_name} ({self.position})"
