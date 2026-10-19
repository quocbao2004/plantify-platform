from django.contrib import admin
from apps.rentals.models.contract import RentalContract, RentalContractItem
from apps.rentals.models.booking import RentalAssetBooking
from apps.rentals.models.extension import RentalExtensionRequest
from apps.rentals.models.inspection import RentalInspection


class RentalContractItemInline(admin.TabularInline):
    model = RentalContractItem
    extra = 0


@admin.register(RentalContract)
class RentalContractAdmin(admin.ModelAdmin):
    list_display = ("contract_code", "user", "status", "deposit_total_vnd", "signed_at", "completed_at")
    list_filter = ("status", "created_at")
    search_fields = ("contract_code", "user__email")
    inlines = [RentalContractItemInline]


@admin.register(RentalAssetBooking)
class RentalAssetBookingAdmin(admin.ModelAdmin):
    list_display = ("asset", "start_at", "end_at", "status")
    list_filter = ("status",)
    search_fields = ("asset__asset_code",)


@admin.register(RentalExtensionRequest)
class RentalExtensionRequestAdmin(admin.ModelAdmin):
    list_display = ("contract_item", "requested_end_at", "additional_fee_vnd", "status")
    list_filter = ("status",)


@admin.register(RentalInspection)
class RentalInspectionAdmin(admin.ModelAdmin):
    list_display = ("contract_item", "inspected_by", "condition", "damage_fee_vnd", "inspected_at")
    list_filter = ("condition",)
