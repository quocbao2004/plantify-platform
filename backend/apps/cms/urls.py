from django.urls import path
from apps.cms.views.posts import PostListView, PostDetailView
from apps.cms.views.banners import BannerListView

app_name = "cms"

urlpatterns = [
    path("posts/", PostListView.as_view(), name="post-list"),
    path("posts/<slug:slug>/", PostDetailView.as_view(), name="post-detail"),
    path("banners/", BannerListView.as_view(), name="banner-list"),
]
