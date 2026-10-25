from django.urls import path
from apps.recommendations.views.recommendations import RecommendForMeView, SimilarProductsView
from apps.recommendations.views.events import TrackEventView

app_name = "recommendations"

urlpatterns = [
    path("for-me/", RecommendForMeView.as_view(), name="recommend-for-me"),
    path("products/<uuid:id>/similar/", SimilarProductsView.as_view(), name="product-similar"),
    path("events/", TrackEventView.as_view(), name="track-event"),
]
