from django.urls import path
from apps.rentals.views.contracts import RentalContractListView, RentalContractDetailView, AllocateAssetView
from apps.rentals.views.extensions import RentalExtensionRequestView
from apps.rentals.views.inspections import RentalInspectionCreateView

app_name = "rentals"

urlpatterns = [
    path("contracts/", RentalContractListView.as_view(), name="contract-list"),
    path("contracts/<uuid:id>/", RentalContractDetailView.as_view(), name="contract-detail"),
    path("items/<uuid:item_id>/extension-requests/", RentalExtensionRequestView.as_view(), name="extension-request"),
    path("items/<uuid:item_id>/allocate-asset/", AllocateAssetView.as_view(), name="allocate-asset"),
    path("items/<uuid:item_id>/inspections/", RentalInspectionCreateView.as_view(), name="inspection-create"),
]
