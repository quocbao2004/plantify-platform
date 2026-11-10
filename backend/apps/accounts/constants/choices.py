from django.db import models


class UserRole(models.TextChoices):
    CUSTOMER = "CUSTOMER", "Khách hàng"
    STAFF = "STAFF", "Nhân viên bình thường"
    DELIVERY = "DELIVERY", "Nhân viên giao hàng"
    WARRANTY = "WARRANTY", "Nhân viên bảo hành"
    ADMIN = "ADMIN", "Quản trị viên"


STAFF_ROLES_GROUP = "STAFF_GROUP"
STAFF_ROLES = (
    UserRole.STAFF,
    UserRole.DELIVERY,
    UserRole.WARRANTY,
    UserRole.ADMIN,
)


class SocialProvider(models.TextChoices):
    GOOGLE = "GOOGLE", "Google"
    FACEBOOK = "FACEBOOK", "Facebook"


class CareExperienceLevel(models.TextChoices):
    BEGINNER = "BEGINNER", "Mới bắt đầu"
    INTERMEDIATE = "INTERMEDIATE", "Đã có kinh nghiệm"
    EXPERT = "EXPERT", "Chuyên gia"
