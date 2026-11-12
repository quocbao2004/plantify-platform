import uuid
from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from apps.accounts.models import User
from .purchase_order import PurchaseOrder
from .purchase_order_detail import PurchaseOrderDetail


class ReturnRequest(UUIDTimeStampedModel):
    """
    ReturnRequest model for plant return/exchange/refund claims.
    """
    class ReturnType(models.TextChoices):
        EXCHANGE = "EXCHANGE", "Đổi cây mới"
        REFUND = "REFUND", "Hoàn tiền"
        CARE_SUPPORT = "CARE_SUPPORT", "Hỗ trợ chăm sóc & phục hồi"

    class ReturnReason(models.TextChoices):
        DAMAGED_TRANSIT = "DAMAGED_TRANSIT", "Gãy cành / Hư hỏng do vận chuyển"
        WRONG_ITEM = "WRONG_ITEM", "Giao sai cây hoặc sai kích thước"
        DISEASE_14D = "DISEASE_14D", "Cây chết / ủ bệnh trong 14 ngày bảo hành"
        NOT_AS_DESCRIBED = "NOT_AS_DESCRIBED", "Cây khác xa so với mô tả / hình ảnh"
        OTHER = "OTHER", "Lý do khác"

    class ReturnStatus(models.TextChoices):
        PENDING = "PENDING", "Chờ xét duyệt"
        APPROVED = "APPROVED", "Đã duyệt - Đang xử lý"
        REJECTED = "REJECTED", "Từ chối yêu cầu"
        COMPLETED = "COMPLETED", "Đã hoàn tất"
        CANCELLED = "CANCELLED", "Khách đã hủy"

    return_code = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        verbose_name="Mã yêu cầu đổi trả",
    )
    order = models.ForeignKey(
        PurchaseOrder,
        on_delete=models.CASCADE,
        related_name="return_requests",
        verbose_name="Đơn hàng gốc",
    )
    order_detail = models.ForeignKey(
        PurchaseOrderDetail,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="return_requests",
        verbose_name="Cây khiếu nại cụ thể",
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="return_requests",
        verbose_name="Khách hàng",
    )
    request_type = models.CharField(
        max_length=30,
        choices=ReturnType.choices,
        default=ReturnType.EXCHANGE,
        verbose_name="Hình thức mong muốn",
    )
    reason = models.CharField(
        max_length=50,
        choices=ReturnReason.choices,
        default=ReturnReason.DAMAGED_TRANSIT,
        verbose_name="Lý do đổi trả",
    )
    status = models.CharField(
        max_length=30,
        choices=ReturnStatus.choices,
        default=ReturnStatus.PENDING,
        db_index=True,
        verbose_name="Trạng thái",
    )
    quantity = models.PositiveIntegerField(
        default=1,
        verbose_name="Số lượng cây khiếu nại",
    )
    refund_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        default=0,
        verbose_name="Số tiền hoàn dự kiến",
    )
    customer_notes = models.TextField(
        blank=True,
        verbose_name="Mô tả chi tiết từ khách",
    )
    proof_images = models.JSONField(
        default=list,
        blank=True,
        verbose_name="Ảnh / Video bằng chứng cây hư hại",
    )
    admin_notes = models.TextField(
        blank=True,
        verbose_name="Ghi chú thẩm định từ Admin",
    )
    resolution_action = models.CharField(
        max_length=50,
        blank=True,
        verbose_name="Phương án giải quyết của Admin",
    )

    class Meta:
        db_table = "return_requests"
        verbose_name = "Yêu cầu đổi trả cây"
        verbose_name_plural = "Yêu cầu đổi trả cây"
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.return_code:
            self.return_code = f"RET-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.return_code} - {self.order.order_code} ({self.get_status_display()})"
