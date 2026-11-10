from django.contrib import admin
from apps.rentals.models import (
    RentalOrder,
    RentalOrderDetail,
    RentalContract,
    MaintenanceTask,
    ShipPlants,
)


class RentalOrderDetailInline(admin.TabularInline):
    model = RentalOrderDetail
    extra = 0


@admin.register(RentalOrder)
class RentalOrderAdmin(admin.ModelAdmin):
    list_display = ("order_code", "user", "status", "start_date", "end_date", "total_rental_amount", "deposit_amount")
    list_filter = ("status", "start_date", "end_date")
    search_fields = ("order_code", "user__email", "recipient_name", "recipient_phone")
    inlines = [RentalOrderDetailInline]


@admin.register(RentalOrderDetail)
class RentalOrderDetailAdmin(admin.ModelAdmin):
    list_display = ("rental_order", "plant_detail", "quantity", "rental_price", "rental_duration_days", "total_price")
    search_fields = ("rental_order__order_code", "plant_detail__sku")


class MaintenanceTaskInline(admin.TabularInline):
    model = MaintenanceTask
    extra = 0


class ShipPlantsInline(admin.TabularInline):
    model = ShipPlants
    extra = 0


@admin.register(RentalContract)
class RentalContractAdmin(admin.ModelAdmin):
    list_display = ("contract_code", "rental_order", "status", "start_date", "end_date", "total_value", "deposit_amount")
    list_filter = ("status", "start_date", "end_date")
    search_fields = ("contract_code", "rental_order__order_code")
    inlines = [MaintenanceTaskInline, ShipPlantsInline]


@admin.register(MaintenanceTask)
class MaintenanceTaskAdmin(admin.ModelAdmin):
    list_display = ("task_code", "rental_contract", "staff", "title", "scheduled_date", "status", "health_status")
    list_filter = ("status", "health_status", "scheduled_date")
    search_fields = ("task_code", "title", "rental_contract__contract_code")


@admin.register(ShipPlants)
class ShipPlantsAdmin(admin.ModelAdmin):
    list_display = ("ship_code", "rental_contract", "staff", "ship_type", "status", "scheduled_date")
    list_filter = ("ship_type", "status", "scheduled_date")
    search_fields = ("ship_code", "rental_contract__contract_code", "recipient_name")
