from django.db.models import Q
from django.utils import timezone
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.accounts.models import User, Staff
from apps.accounts.constants.choices import UserRole
from apps.orders.models import PurchaseOrder
from apps.rentals.models.ship_plants import ShipPlants
from apps.rentals.serializers.rentals import ShipPlantsSerializer


class ShipmentListCreateView(generics.ListCreateAPIView):
    """
    Unified shipping dispatch view:
    Queries ShipPlants for both direct purchases and rental contract shipments.
    """
    serializer_class = ShipPlantsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.role == UserRole.ADMIN:
            from apps.orders.services.shipment import sync_delivering_purchase_orders

            sync_delivering_purchase_orders()

        queryset = (
            ShipPlants.objects.all()
            .select_related("purchase_order", "rental_contract", "staff__user")
            .prefetch_related(
                "purchase_order__details__plant_detail__plant",
                "rental_contract__rental_order__details__plant_detail__plant",
            )
        )

        # If normal shipper/staff is logged in, show only their assigned shipments
        if not (user.is_staff or user.role == UserRole.ADMIN):
            queryset = queryset.filter(staff__user=user)

        # Search filter
        search = self.request.query_params.get("search", "").strip()
        if search:
            queryset = queryset.filter(
                Q(ship_code__icontains=search)
                | Q(purchase_order__order_code__icontains=search)
                | Q(rental_contract__contract_code__icontains=search)
                | Q(recipient_name__icontains=search)
                | Q(recipient_phone__icontains=search)
                | Q(delivery_address__icontains=search)
                | Q(staff__user__full_name__icontains=search)
                | Q(staff__user__phone__icontains=search)
            )

        # Status filter (support both ShipPlants.ShipStatus and frontend tab/filter aliases)
        status_param = self.request.query_params.get("status", "").strip().upper()
        if status_param and status_param != "ALL":
            status_alias_map = {
                "UNASSIGNED": [ShipPlants.ShipStatus.PENDING],
                "PENDING": [ShipPlants.ShipStatus.PENDING],
                "ASSIGNED": [ShipPlants.ShipStatus.ASSIGNED],
                "DELIVERING": [ShipPlants.ShipStatus.ASSIGNED, ShipPlants.ShipStatus.SHIPPING],
                "SHIPPING": [ShipPlants.ShipStatus.SHIPPING],
                "DELIVERED_PENDING_CONFIRM": [ShipPlants.ShipStatus.DELIVERED_PENDING_CONFIRM],
                "COMPLETED": [ShipPlants.ShipStatus.DELIVERED],
                "DELIVERED": [ShipPlants.ShipStatus.DELIVERED],
                "FAILED": [ShipPlants.ShipStatus.CANCELLED],
                "CANCELLED": [ShipPlants.ShipStatus.CANCELLED],
            }
            mapped_statuses = status_alias_map.get(status_param, [status_param])
            queryset = queryset.filter(status__in=mapped_statuses)

        # Staff/Shipper filter
        staff_id = self.request.query_params.get("shipper", "").strip()
        if staff_id and staff_id != "ALL":
            queryset = queryset.filter(Q(staff_id=staff_id) | Q(staff__user_id=staff_id))

        # Ordering
        ordering = self.request.query_params.get("ordering", "-created_at")
        if ordering:
            queryset = queryset.order_by(ordering)

        return queryset

    def perform_create(self, serializer):
        shipment = serializer.save()
        if shipment.purchase_order and shipment.status in [ShipPlants.ShipStatus.ASSIGNED, ShipPlants.ShipStatus.SHIPPING]:
            if shipment.purchase_order.status != PurchaseOrder.OrderStatus.DELIVERING:
                shipment.purchase_order.status = PurchaseOrder.OrderStatus.DELIVERING
                shipment.purchase_order.save(update_fields=["status", "updated_at"])


class ShipmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve and update ShipPlants:
    Admin assigns staff, reviews proof of delivery, and confirms completion.
    """
    serializer_class = ShipPlantsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = (
            ShipPlants.objects.all()
            .select_related("purchase_order", "rental_contract", "staff__user")
            .prefetch_related(
                "purchase_order__details__plant_detail__plant",
                "rental_contract__rental_order__details__plant_detail__plant",
            )
        )
        if not (user.is_staff or user.role == UserRole.ADMIN):
            return queryset.filter(staff__user=user)
        return queryset

    def perform_update(self, serializer):
        instance = serializer.instance
        old_status = instance.status
        old_staff = instance.staff

        validated_data = serializer.validated_data
        new_status = validated_data.get("status", old_status)
        new_staff = validated_data.get("staff", old_staff)

        # Auto timestamps
        if new_staff and not old_staff and not instance.scheduled_date:
            serializer.validated_data["scheduled_date"] = timezone.now()

        if new_status == ShipPlants.ShipStatus.DELIVERED_PENDING_CONFIRM and not instance.delivered_date:
            serializer.validated_data["delivered_date"] = timezone.now()

        if new_status == ShipPlants.ShipStatus.DELIVERED and not instance.confirmed_date:
            serializer.validated_data["confirmed_date"] = timezone.now()

        shipment = serializer.save()

        # Sync purchase order status if linked
        if shipment.purchase_order:
            order = shipment.purchase_order
            if shipment.status in [ShipPlants.ShipStatus.ASSIGNED, ShipPlants.ShipStatus.SHIPPING]:
                if order.status != PurchaseOrder.OrderStatus.DELIVERING:
                    order.status = PurchaseOrder.OrderStatus.DELIVERING
                    order.save(update_fields=["status", "updated_at"])
            elif shipment.status == ShipPlants.ShipStatus.DELIVERED:
                from apps.payments.models import Transaction

                if order.status != PurchaseOrder.OrderStatus.COMPLETED:
                    order.status = PurchaseOrder.OrderStatus.COMPLETED
                    order.save(update_fields=["status", "updated_at"])
                order.transactions.filter(
                    transaction_type=Transaction.TransactionType.PURCHASE,
                    payment_method=Transaction.PaymentMethod.CASH,
                ).exclude(status=Transaction.TransactionStatus.SUCCESS).update(
                    status=Transaction.TransactionStatus.SUCCESS
                )


class ShipperListView(APIView):
    """
    List staff personnel (shippers/delivery crew) available for assignment.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        staff_qs = (
            Staff.objects.filter(is_available=True)
            .select_related("user")
            .order_by("user__full_name")
        )
        data = [
            {
                "id": s.id,
                "user_id": s.user.id,
                "full_name": s.user.full_name,
                "email": s.user.email,
                "phone": s.user.phone or "",
                "role": s.position or s.user.role,
                "staff_code": s.staff_code,
            }
            for s in staff_qs
        ]

        # If no staff records yet, auto-create Staff profiles for active delivery/staff/admin users
        if not data:
            users = User.objects.filter(
                is_active=True,
                role__in=[UserRole.DELIVERY, UserRole.STAFF, UserRole.ADMIN],
            ).order_by("full_name")
            for u in users:
                staff_obj, _ = Staff.objects.get_or_create(
                    user=u,
                    defaults={
                        "staff_code": f"NV-{str(u.id)[:8].upper()}",
                        "position": u.role,
                        "is_available": True,
                    },
                )
                if staff_obj.is_available:
                    data.append(
                        {
                            "id": staff_obj.id,
                            "user_id": u.id,
                            "full_name": u.full_name,
                            "email": u.email,
                            "phone": u.phone or "",
                            "role": staff_obj.position or u.role,
                            "staff_code": staff_obj.staff_code,
                        }
                    )

        return Response({"success": True, "data": data})
