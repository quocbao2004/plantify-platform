from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum
from django.utils import timezone
from apps.accounts.permissions.admin import IsAdminOnly
from apps.orders.models import PurchaseOrder
from apps.rentals.models import RentalOrder
from apps.catalog.models import Plants
from apps.accounts.models import User


class AdminDashboardSummaryView(APIView):
    """
    API tổng hợp số liệu thực tế cho Admin Dashboard.
    """
    permission_classes = [IsAdminOnly]

    def get(self, request):
        now = timezone.now()
        first_day_this_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        # 1. Doanh thu đơn mua & đơn thuê
        purchase_rev = PurchaseOrder.objects.exclude(status="CANCELLED").aggregate(
            total=Sum("total_amount")
        )["total"] or 0
        rental_rev = RentalOrder.objects.exclude(status="CANCELLED").aggregate(
            total=Sum("total_rental_amount")
        )["total"] or 0
        total_revenue = purchase_rev + rental_rev

        # 2. Đơn hàng
        total_purchase_orders = PurchaseOrder.objects.count()
        total_rental_orders = RentalOrder.objects.count()

        # 3. Sản phẩm / Cây
        total_plants = Plants.objects.filter(is_active=True).count()
        total_users = User.objects.count()

        return Response({
            "total_revenue": float(total_revenue),
            "purchase_revenue": float(purchase_rev),
            "rental_revenue": float(rental_rev),
            "total_purchase_orders": total_purchase_orders,
            "total_rental_orders": total_rental_orders,
            "total_plants": total_plants,
            "total_users": total_users,
        })
