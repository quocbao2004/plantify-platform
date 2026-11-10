from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from .rental_contract import RentalContract
from apps.accounts.models import Staff


class MaintenanceTask(UUIDTimeStampedModel):
    """
    MaintenanceTask model for plant care visits under a rental contract.
    """
    class TaskStatus(models.TextChoices):
        SCHEDULED = "SCHEDULED", "Đã lên lịch"
        IN_PROGRESS = "IN_PROGRESS", "Đang thực hiện"
        COMPLETED = "COMPLETED", "Đã hoàn thành"
        CANCELLED = "CANCELLED", "Đã hủy"

    class HealthStatus(models.TextChoices):
        GOOD = "GOOD", "Cây khỏe mạnh"
        NEEDS_CARE = "NEEDS_CARE", "Cần chăm sóc bổ sung"
        DAMAGED = "DAMAGED", "Hư hại / Cần thay thế"

    rental_contract = models.ForeignKey(
        RentalContract,
        on_delete=models.CASCADE,
        related_name="maintenance_tasks",
        verbose_name="Hợp đồng thuê",
    )
    staff = models.ForeignKey(
        Staff,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="maintenance_tasks",
        verbose_name="Nhân viên phụ trách",
    )
    task_code = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        verbose_name="Mã công việc",
    )
    title = models.CharField(max_length=255, verbose_name="Tiêu đề công việc")
    scheduled_date = models.DateTimeField(verbose_name="Ngày giờ dự kiến chăm sóc")
    completed_date = models.DateTimeField(null=True, blank=True, verbose_name="Thời gian hoàn thành")
    status = models.CharField(
        max_length=20,
        choices=TaskStatus.choices,
        default=TaskStatus.SCHEDULED,
        db_index=True,
        verbose_name="Trạng thái công việc",
    )
    health_status = models.CharField(
        max_length=20,
        choices=HealthStatus.choices,
        default=HealthStatus.GOOD,
        verbose_name="Tình trạng sức khỏe cây",
    )
    notes = models.TextField(blank=True, verbose_name="Ghi chú báo cáo chăm sóc")

    class Meta:
        db_table = "maintenance_tasks"
        verbose_name = "Nhiệm vụ bảo dưỡng cây"
        verbose_name_plural = "Nhiệm vụ bảo dưỡng cây"
        ordering = ["scheduled_date"]

    def __str__(self):
        return f"{self.task_code} - {self.title} ({self.get_status_display()})"
