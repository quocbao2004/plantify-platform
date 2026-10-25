"""Create a repeatable catalog demo without replacing existing business data."""

from collections import Counter
from pathlib import Path

from django.conf import settings
from django.core.files import File
from django.core.files.storage import default_storage
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.catalog.constants.choices import BillingUnit, CareLevel, LightRequirement, PlantSize
from apps.catalog.models import Category, Product, ProductImage, ProductVariant, RentalRate
from apps.cms.models import Banner
from apps.inventory.constants.choices import StockMovementType
from apps.inventory.models import PlantAsset, StockBalance, StockMovement
from apps.loyalty.constants.choices import LoyaltyTierCode
from apps.loyalty.models import LoyaltyTier


CATEGORIES = (
    ("cay-trong-nha", "Cây trong nhà", "Cho góc sống thêm xanh"),
    ("cay-de-ban", "Cây để bàn", "Nhỏ xinh, nhiều cảm hứng"),
    ("cay-ban-cong", "Cây ban công", "Đón nắng, đón an yên"),
    ("chau-phu-kien", "Chậu & phụ kiện", "Một chiếc chậu, một nét riêng"),
)

PRODUCTS = (
    {
        "slug": "trau-ba-la-xe", "name": "Trầu bà lá xẻ", "category": "cay-trong-nha",
        "description": "Tán lá xanh với những đường xẻ tự nhiên, tạo điểm nhấn cho phòng khách và góc làm việc.",
        "care_instructions": "Đặt nơi có ánh sáng gián tiếp. Tưới khi lớp đất mặt khô, tránh để chậu đọng nước.",
        "light_requirement": LightRequirement.MEDIUM_LIGHT, "care_level": CareLevel.EASY,
        "sku": "KB-MONSTERA-M", "size": PlantSize.MEDIUM, "height_cm": 65,
        "price": 389000, "rental_price": 89000, "stock": 20,
        "image": "product-monstera.webp",
    },
    {
        "slug": "bang-singapore", "name": "Bàng Singapore", "category": "cay-trong-nha",
        "description": "Dáng cây thanh lịch cùng những chiếc lá lớn, phù hợp với không gian nhiều ánh sáng.",
        "care_instructions": "Đặt gần cửa sổ có ánh sáng gián tiếp. Tưới khi đất mặt khô và lau lá định kỳ.",
        "light_requirement": LightRequirement.MEDIUM_LIGHT, "care_level": CareLevel.MODERATE,
        "sku": "KB-FIDDLE-LEAF-L", "size": PlantSize.LARGE, "height_cm": 100,
        "price": 549000, "rental_price": 129000, "stock": 12,
        "image": "product-fiddle-leaf.webp",
    },
    {
        "slug": "luoi-ho-vien-vang", "name": "Lưỡi hổ viền vàng", "category": "cay-trong-nha",
        "description": "Lá vươn thẳng với viền vàng nổi bật, dễ bố trí trong nhiều góc nhỏ của ngôi nhà.",
        "care_instructions": "Cây chịu được ánh sáng yếu. Để đất khô giữa các lần tưới và dùng chậu thoát nước tốt.",
        "light_requirement": LightRequirement.LOW_LIGHT, "care_level": CareLevel.EASY,
        "sku": "KB-SNAKE-M", "size": PlantSize.MEDIUM, "height_cm": 60,
        "price": 248000, "rental_price": 59000, "stock": 25,
        "image": "product-snake.webp",
    },
    {
        "slug": "kim-tien", "name": "Kim tiền", "category": "cay-de-ban",
        "description": "Những nhánh lá xanh bóng mang lại một góc xanh gọn gàng trên bàn hoặc kệ trang trí.",
        "care_instructions": "Đặt ở nơi có ánh sáng gián tiếp hoặc bán râm. Chỉ tưới khi đất đã khô, tránh tưới quá nhiều.",
        "light_requirement": LightRequirement.LOW_LIGHT, "care_level": CareLevel.EASY,
        "sku": "KB-ZZ-M", "size": PlantSize.MEDIUM, "height_cm": 45,
        "price": 299000, "rental_price": 69000, "stock": 18,
        "image": "product-zz.webp",
    },
)

TIERS = (
    (LoyaltyTierCode.NEW, "Thành viên Mới", 0),
    (LoyaltyTierCode.SILVER, "Hạng Bạc", 2000000),
    (LoyaltyTierCode.GOLD, "Hạng Vàng", 5000000),
    (LoyaltyTierCode.PLATINUM, "Hạng Bạch Kim", 10000000),
)


class Command(BaseCommand):
    help = "Seed demo categories, plants, inventory, rental rates, membership tiers and homepage banner."

    def add_arguments(self, parser):
        parser.add_argument(
            "--assets-dir", type=Path,
            default=settings.BASE_DIR.parent / "frontend" / "public" / "images" / "home",
            help="Directory containing the existing homepage WebP assets.",
        )

    def handle(self, *args, **options):
        assets_dir = options["assets_dir"]
        filenames = {product["image"] for product in PRODUCTS} | {"hero-living-room.webp"}
        missing = sorted(name for name in filenames if not (assets_dir / name).is_file())
        if missing:
            raise CommandError(f"Missing seed images in {assets_dir}: {', '.join(missing)}")

        # File storage is separate from the DB transaction. Deterministic paths let
        # a retry reuse files if a database transaction is rolled back.
        images = {}
        for filename in sorted(filenames):
            name = f"demo/home/{filename}"
            if not default_storage.exists(name):
                with (assets_dir / filename).open("rb") as source:
                    name = default_storage.save(name, File(source))
            images[filename] = name

        created = Counter()

        def ensure(model, defaults=None, **lookup):
            obj, is_new = model.objects.get_or_create(defaults=defaults or {}, **lookup)
            if is_new:
                created[model.__name__] += 1
            return obj, is_new

        with transaction.atomic():
            categories = {}
            for position, (slug, name, description) in enumerate(CATEGORIES):
                categories[slug], _ = ensure(
                    Category, slug=slug,
                    defaults={"name": name, "description": description, "sort_order": position},
                )

            for item in PRODUCTS:
                product, _ = ensure(Product, slug=item["slug"], defaults={
                    "name": item["name"], "category": categories[item["category"]],
                    "description": item["description"], "care_instructions": item["care_instructions"],
                    "light_requirement": item["light_requirement"], "care_level": item["care_level"],
                })
                variant, _ = ensure(ProductVariant, sku=item["sku"], defaults={
                    "product": product, "size": item["size"], "height_cm": item["height_cm"],
                    "sale_price_vnd": item["price"], "deposit_vnd": item["price"],
                })
                if variant.product_id != product.pk:
                    raise CommandError(f"Seed SKU {item['sku']} already belongs to another product.")
                ensure(ProductImage, product=product, image=images[item["image"]], defaults={
                    "alt_text": item["name"], "is_primary": not product.images.filter(is_primary=True).exists(),
                })
                ensure(RentalRate, variant=variant, billing_unit=BillingUnit.MONTH,
                       defaults={"price_vnd": item["rental_price"]})
                _, new_balance = ensure(StockBalance, variant=variant,
                                        defaults={"quantity_on_hand": item["stock"]})
                if new_balance:
                    ensure(StockMovement, variant=variant, reference_type="DemoSeed",
                           reference_id=variant.pk, defaults={
                               "movement_type": StockMovementType.IMPORT,
                               "quantity_delta": item["stock"], "note": "Tồn kho mẫu khởi tạo",
                           })
                for index in range(1, 3):
                    ensure(PlantAsset, asset_code=f"DEMO-{item['sku']}-{index:02d}",
                           defaults={"variant": variant})

            for code, name, minimum in TIERS:
                ensure(LoyaltyTier, code=code,
                       defaults={"name": name, "min_qualifying_spend_vnd": minimum})
            ensure(Banner, position="HOME_HERO", image=images["hero-living-room.webp"], defaults={
                "title": "Một góc xanh, ngàn điều an yên.",
            })

        total = sum(created.values())
        self.stdout.write(self.style.SUCCESS(f"Demo seed complete: {total} new records."))
        for model, count in sorted(created.items()):
            self.stdout.write(f"  {model}: {count}")
        if not total:
            self.stdout.write("Existing demo data preserved; no records added.")
