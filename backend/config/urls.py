"""
Root URL Configuration for Plantify Platform.
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

api_v1_patterns = [
    path("accounts/", include("apps.accounts.urls", namespace="accounts")),
    path("catalog/", include("apps.catalog.urls", namespace="catalog")),
    path("orders/", include("apps.orders.urls", namespace="orders")),
    path("rentals/", include("apps.rentals.urls", namespace="rentals")),
    path("payments/", include("apps.payments.urls", namespace="payments")),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    # API v1
    path("api/v1/", include((api_v1_patterns, "api_v1"))),
    # OpenAPI 3 Schema & Swagger UI
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),

    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
