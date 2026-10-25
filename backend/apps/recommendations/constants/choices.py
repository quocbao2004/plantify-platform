from django.db import models


class ActivityEventType(models.TextChoices):
    VIEW = "VIEW", "Xem chi tiết cây cảnh"
    SEARCH = "SEARCH", "Tìm kiếm từ khóa"
    WISHLIST = "WISHLIST", "Thêm vào danh sách yêu thích"
    ADD_TO_CART = "ADD_TO_CART", "Thêm vào giỏ hàng"
    PURCHASE = "PURCHASE", "Đặt mua sản phẩm"
    RENT = "RENT", "Thuê cây cảnh"


class RecommendationStrategy(models.TextChoices):
    RULE_BASED = "RULE_BASED", "Dựa theo quy tắc / Sở thích người dùng"
    CONTENT_SIMILARITY = "CONTENT_SIMILARITY", "Dựa theo đặc tính cây tương tự"
    POPULARITY = "POPULARITY", "Cây cảnh bán chạy / Phổ biến nhất"
