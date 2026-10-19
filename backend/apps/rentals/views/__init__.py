from .contracts import RentalContractListView, RentalContractDetailView, AllocateAssetView
from .extensions import RentalExtensionRequestView
from .inspections import RentalInspectionCreateView

__all__ = [
    "RentalContractListView",
    "RentalContractDetailView",
    "AllocateAssetView",
    "RentalExtensionRequestView",
    "RentalInspectionCreateView",
]
