from rest_framework import generics, permissions
from apps.rentals.models import (
    RentalOrder,
    RentalOrderDetail,
    RentalContract,
    MaintenanceTask,
    ShipPlants,
)
from apps.rentals.serializers import (
    RentalOrderSerializer,
    RentalOrderDetailSerializer,
    RentalContractSerializer,
    MaintenanceTaskSerializer,
    ShipPlantsSerializer,
)


class RentalOrderListCreateView(generics.ListCreateAPIView):
    serializer_class = RentalOrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return RentalOrder.objects.all().select_related("user").prefetch_related("details__plant_detail", "contract")
        return RentalOrder.objects.filter(user=user).select_related("user").prefetch_related("details__plant_detail", "contract")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RentalOrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RentalOrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return RentalOrder.objects.all().select_related("user").prefetch_related("details__plant_detail", "contract")
        return RentalOrder.objects.filter(user=user).select_related("user").prefetch_related("details__plant_detail", "contract")


class RentalContractListCreateView(generics.ListCreateAPIView):
    serializer_class = RentalContractSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = RentalContract.objects.all().select_related("rental_order").prefetch_related("maintenance_tasks", "ship_tasks")


class RentalContractDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RentalContractSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = RentalContract.objects.all().select_related("rental_order").prefetch_related("maintenance_tasks", "ship_tasks")


class MaintenanceTaskListCreateView(generics.ListCreateAPIView):
    serializer_class = MaintenanceTaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = MaintenanceTask.objects.all().select_related("rental_contract", "staff__user")


class MaintenanceTaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MaintenanceTaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = MaintenanceTask.objects.all().select_related("rental_contract", "staff__user")


class ShipPlantsListCreateView(generics.ListCreateAPIView):
    serializer_class = ShipPlantsSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = ShipPlants.objects.all().select_related("rental_contract", "staff__user")


class ShipPlantsDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ShipPlantsSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = ShipPlants.objects.all().select_related("rental_contract", "staff__user")
