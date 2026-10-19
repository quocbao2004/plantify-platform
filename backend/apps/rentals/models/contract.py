from django.conf import settings
from django.db import models
from apps.common.models.base import UUIDTimeStampedModel
from apps.orders.models.order import Order
from apps.orders.models.order_item import OrderItem
from apps.inventory.models.plant_asset import PlantAsset
from apps.rentals.constants.choices import RentalContractStatus, RentalItemStatus


class RentalContract(UUIDTimeStampedModel):
    order = models.OneToOneField(
        Order,
        on_delete=models.PROTECT,
        related_name="rental_contract",
        verbose_name="Đơn hàng phát sinh",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="rental_contracts",
        verbose_name="Khách hàng thuê",
    )
    contract_code = models.CharField(max_length=64, unique=True, db_index=True, verbose_name="Mã hợp đồng thuê")
    status = models.CharField(
        max_length=30,
        choices=RentalContractStatus.choices,
        default=RentalContractStatus.PENDING_DELIVERY,
        db_index=True,
    )
    deposit_total_vnd = models.PositiveBigIntegerField(default=0, verbose_name="Tổng tiền đặt cọc (VNĐ)")
    signed_at = models.DateTimeField(null=True, blank=True, verbose_name="Thời điểm ký hợp đồng")
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name="Thời điểm tất toán cọc")

    class Meta:
        db_table = "rental_contracts"
        verbose_name = "Hợp đồng thuê cây"
        verbose_name_plural = "Hợp đồng thuê cây"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Contract #{self.contract_code} ({self.get_status_display()})"


class RentalContractItem(UUIDTimeStampedModel):
    contract = models.ForeignKey(
        RentalContract,
        on_delete=models.CASCADE,
        related_name="items",
    )
    order_item = models.ForeignKey(
        OrderItem,
        on_delete=models.PROTECT,
        related_name="rental_contract_items",
    )
    plant_asset = models.ForeignKey(
        PlantAsset,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="rental_contract_items",
        verbose_name="Cây vật lý cụ thể",
    )
    start_at = models.DateTimeField(db_index=True, verbose_name="Thời điểm bắt đầu thuê")
    end_at = models.DateTimeField(db_index=True, verbose_name="Thời điểm kết thúc thuê")
    returned_at = models.DateTimeField(null=True, blank=True, verbose_name="Thời điểm thu hồi về vườn")

    rental_fee_vnd = models.PositiveBigIntegerField(default=0, verbose_name="Phí thuê (VNĐ)")
    deposit_vnd = models.PositiveBigIntegerField(default=0, verbose_name="Tiền cọc (VNĐ)")
    status = models.CharField(
        max_length=30,
        choices=RentalItemStatus.choices,
        default=RentalItemStatus.PENDING_ALLOCATION,
        db_index=True,
    )

    class Meta:
        db_table = "rental_contract_items"
        verbose_name = "Cây thuê theo hợp đồng"
        verbose_name_plural = "Cây thuê theo hợp đồng"

    def __str__(self):
        asset_str = self.plant_asset.asset_code if self.plant_asset else "Chưa gán"
        return f"RentalItem [{asset_str}] - Contract #{self.contract.contract_code}"
