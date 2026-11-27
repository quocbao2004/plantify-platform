import re
import unicodedata
from django.utils import timezone


def remove_vietnamese_accents(text: str) -> str:
    """
    Chuyển đổi chuỗi tiếng Việt có dấu thành không dấu (ASCII).
    Xử lý đặc biệt cho các ký tự Đ/đ.
    """
    if not text:
        return ""
    text = text.replace("Đ", "D").replace("đ", "d")
    normalized = unicodedata.normalize("NFKD", text)
    result = "".join(c for c in normalized if not unicodedata.combining(c))
    return result


def generate_plant_code_prefix(plant_name: str) -> str:
    """
    Sinh tiền tố mã định danh cây từ tên cây.
    Ví dụ:
      - 'Lan Đột Tử' -> 'LDT'
      - 'Cây Lan Đột Tử' -> 'LDT'
      - 'Kim Tiền' -> 'KT'
      - 'Cây Kim Tiền' -> 'KT'
      - 'Trầu Bà Đế Vương' -> 'TBDV'
      - 'Monstera' -> 'MON'
    """
    clean_name = remove_vietnamese_accents(plant_name).strip()
    words = [w for w in re.split(r"\s+", clean_name) if w]

    if not words:
        return "PLA"

    # Nếu bắt đầu bằng từ loại "cay" hoặc "hoa" và có từ 2 từ chính trở lên đằng sau
    if len(words) >= 3 and words[0].lower() in ("cay", "hoa"):
        words = words[1:]

    if len(words) == 1:
        # 1 từ duy nhất: lấy 3-4 ký tự đầu
        prefix = re.sub(r"[^A-Za-z0-9]", "", words[0])[:4].upper()
        return prefix if len(prefix) >= 2 else "PLA"

    # Nhiều từ: lấy chữ cái đầu của mỗi từ
    initials = "".join(w[0] for w in words if w and w[0].isalnum()).upper()
    if len(initials) >= 2:
        return initials

    fallback = re.sub(r"[^A-Za-z0-9]", "", clean_name)[:4].upper()
    return fallback or "PLA"


def generate_plant_assets_for_detail(
    plant_detail,
    quantity: int = 1,
    prefix: str | None = None,
    location: str = "Kho trung tâm",
):
    """
    Tự động sinh các bản ghi mã định danh cây cảnh (PlantAsset) cho một biến thể cây.
    Ví dụ: Với cây 'Lan Đột Tử', số lượng 1 -> sinh mã 'LDT-0001'.
    Nếu kho đã có LDT-0001 đến LDT-0003, thêm 2 cây sẽ tự động sinh LDT-0004, LDT-0005.
    """
    from apps.catalog.models.plant_asset import PlantAsset

    if quantity <= 0:
        return []

    if not prefix:
        plant_name = plant_detail.plant.name if plant_detail.plant else ""
        prefix = generate_plant_code_prefix(plant_name)

    prefix = prefix.upper().rstrip("-")
    full_prefix = f"{prefix}-"

    # Tìm số thứ tự lớn nhất hiện có với prefix này
    existing_codes = PlantAsset.objects.filter(
        asset_code__startswith=full_prefix
    ).values_list("asset_code", flat=True)

    max_seq = 0
    for code in existing_codes:
        suffix = code[len(full_prefix) :]
        if suffix.isdigit():
            max_seq = max(max_seq, int(suffix))

    today_str = timezone.now().strftime("%d/%m/%Y")
    new_assets = []
    for i in range(1, quantity + 1):
        seq_num = max_seq + i
        asset_code = f"{full_prefix}{seq_num:04d}"
        new_assets.append(
            PlantAsset(
                plant_detail=plant_detail,
                asset_code=asset_code,
                status=PlantAsset.AssetStatus.AVAILABLE,
                health_condition=PlantAsset.HealthCondition.EXCELLENT,
                current_location=location or "Kho trung tâm",
                notes=f"Tạo tự động khi nhập cây ngày {today_str}",
            )
        )

    return PlantAsset.objects.bulk_create(new_assets)
