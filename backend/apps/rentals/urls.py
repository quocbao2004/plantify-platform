from django.urls import path
from apps.rentals.views import (
    RentalOrderListCreateView,
    RentalOrderDetailView,
    RentalContractListCreateView,
    RentalContractDetailView,
    MaintenanceTaskListCreateView,
    MaintenanceTaskDetailView,
    ShipPlantsListCreateView,
    ShipPlantsDetailView,
)

app_name = "rentals"

urlpatterns = [
    path("orders/", RentalOrderListCreateView.as_view(), name="rental-order-list"),
    path("orders/<uuid:pk>/", RentalOrderDetailView.as_view(), name="rental-order-detail"),
    path("contracts/", RentalContractListCreateView.as_view(), name="rental-contract-list"),
    path("contracts/<uuid:pk>/", RentalContractDetailView.as_view(), name="rental-contract-detail"),
    path("maintenance-tasks/", MaintenanceTaskListCreateView.as_view(), name="maintenance-task-list"),
    path("maintenance-tasks/<uuid:pk>/", MaintenanceTaskDetailView.as_view(), name="maintenance-task-detail"),
    path("ship-plants/", ShipPlantsListCreateView.as_view(), name="ship-plants-list"),
    path("ship-plants/<uuid:pk>/", ShipPlantsDetailView.as_view(), name="ship-plants-detail"),
]
