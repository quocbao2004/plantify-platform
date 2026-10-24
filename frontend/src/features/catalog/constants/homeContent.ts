import type { Product } from "../types";

const imageRoot = "/images/home/";

export const homeCollections = [
  { title: "Cây trong nhà", description: "Cho góc sống thêm xanh", image: "category-indoor.webp", imagePosition: "center", query: "light_requirement=MEDIUM" },
  { title: "Cây để bàn", description: "Nhỏ xinh, nhiều cảm hứng", image: "category-desktop.webp", imagePosition: "center", query: "search=c%C3%A2y%20%C4%91%E1%BB%83%20b%C3%A0n" },
  { title: "Cây ban công", description: "Đón nắng, đón bình yên", image: "category-balcony.webp", imagePosition: "center", query: "light_requirement=DIRECT" },
  { title: "Chậu & phụ kiện", description: "Một chiếc chậu, một nét riêng", image: "category-accessories.webp", imagePosition: "center", query: "search=ch%E1%BA%ADu" },
].map((collection) => ({ ...collection, image: imageRoot + collection.image }));

// Curated display content keeps the homepage useful before the catalog is populated.
export const homeProducts: Product[] = [
  { id: "showcase-monstera", slug: "trau-ba-la-xe", name: "Trầu bà lá xẻ", category_name: "Cây trong nhà", primary_image: imageRoot + "product-monstera.webp", min_sale_price_vnd: 389000, care_level: "EASY", light_requirement: "BRIGHT_INDIRECT", description: "Những chiếc lá xẻ tự nhiên mang cả khu vườn nhiệt đới vào góc sống của bạn.", care_instructions: "Đặt cây nơi có ánh sáng gián tiếp. Tưới khi lớp đất mặt đã khô khoảng 2–3 cm, tránh để nước đọng dưới đáy chậu." },
  { id: "showcase-fiddle-leaf", slug: "bang-singapore", name: "Bàng Singapore", category_name: "Cây trong nhà", primary_image: imageRoot + "product-fiddle-leaf.webp", min_sale_price_vnd: 549000, care_level: "MODERATE", light_requirement: "BRIGHT_INDIRECT", description: "Một dáng cây thanh lịch, những tán lá rộng và xanh mướt — điểm nhấn dịu dàng cho phòng khách.", care_instructions: "Chọn vị trí sáng bên cửa sổ, tránh nắng gắt. Đợi đất mặt khô mới tưới và lau lá bằng khăn ẩm khi cần." },
  { id: "showcase-snake", slug: "luoi-ho-vien-vang", name: "Lưỡi hổ viền vàng", category_name: "Cây để bàn", primary_image: imageRoot + "product-snake.webp", min_sale_price_vnd: 248000, care_level: "EASY", light_requirement: "LOW", description: "Dáng lá vươn thẳng với đường viền vàng ấm áp. Người bạn xanh bền bỉ cho cả những ngày bận rộn.", care_instructions: "Cây thích đất thoát nước tốt. Để đất khô hoàn toàn giữa các lần tưới, giảm tưới khi không gian ít sáng." },
  { id: "showcase-zz", slug: "kim-tien", name: "Kim tiền", category_name: "Cây để bàn", primary_image: imageRoot + "product-zz.webp", min_sale_price_vnd: 299000, care_level: "EASY", light_requirement: "LOW", description: "Tán lá xanh bóng, dáng cây tròn đầy. Một chút may mắn và tươi mới cho bàn làm việc hay góc nhà.", care_instructions: "Đặt nơi có ánh sáng nhẹ hoặc gián tiếp. Chỉ tưới khi đất đã khô, tránh tưới quá nhiều vì thân và rễ có khả năng trữ nước." },
].map((product) => ({ ...product, category: "", is_active: true, created_at: "", updated_at: "" })) as Product[];

export const homeFilters = [
  { value: "all", label: "Tất cả" },
  { value: "easy", label: "Dễ chăm sóc" },
  { value: "indoor", label: "Cây trong nhà" },
  { value: "desktop", label: "Cây để bàn" },
] as const;

export type HomeFilter = typeof homeFilters[number]["value"];

