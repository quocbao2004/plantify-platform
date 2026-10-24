# Bộ sơ đồ Activity Plantify

Mỗi chức năng có một file draw.io offline riêng, gồm đúng một sơ đồ.

Mở từng file bằng ứng dụng draw.io / diagrams.net desktop qua **File → Open**. Các swimlane, hành động, quyết định, nhãn điều kiện và đường nối đều là đối tượng chỉnh sửa được.

| Mã | Chức năng | File draw.io riêng | PNG để chèn Word | SVG vector |
|---|---|---|---|---|
| AD-01 | Đặt mua cây | [draw.io](AD-01-dat-mua-cay.drawio) | [PNG](png/AD-01-dat-mua-cay.png) | [SVG](svg/AD-01-dat-mua-cay.svg) |
| AD-02 | Đặt thuê và bàn giao cây | [draw.io](AD-02-dat-thue-cay.drawio) | [PNG](png/AD-02-dat-thue-cay.png) | [SVG](svg/AD-02-dat-thue-cay.svg) |
| AD-03 | Thanh toán đơn hàng | [draw.io](AD-03-thanh-toan.drawio) | [PNG](png/AD-03-thanh-toan.png) | [SVG](svg/AD-03-thanh-toan.svg) |
| AD-04 | Gia hạn thuê cây | [draw.io](AD-04-gia-han-thue.drawio) | [PNG](png/AD-04-gia-han-thue.png) | [SVG](svg/AD-04-gia-han-thue.svg) |
| AD-05 | Thu hồi cây và quyết toán cọc | [draw.io](AD-05-thu-hoi-hoan-coc.drawio) | [PNG](png/AD-05-thu-hoi-hoan-coc.png) | [SVG](svg/AD-05-thu-hoi-hoan-coc.svg) |

Các sơ đồ dùng nền trắng, nét đen và nhãn tiếng Việt. Các khối có biểu tượng hoạt động con và dòng “Tham chiếu AD-03” gọi quy trình thanh toán: mở file `AD-03-thanh-toan.drawio` để xem chi tiết. File riêng sử dụng tooltip tham chiếu thay cho liên kết sang tab không còn tồn tại. Khối hoàn cọc ở AD-05 là một hoạt động con khái quát, có kiểm tra kết quả ngay sau đó.

Bản tổng hợp nhiều trang trước đây vẫn được giữ tại [plantify-activity.drawio](plantify-activity.drawio).

Đặc tả, quy ước nghiệp vụ và đối chiếu mã nguồn nằm trong [specifications.md](specifications.md). Bộ hình mô tả thiết kế nghiệp vụ theo phạm vi đã thống nhất; các nhánh chờ xử lý kết thúc lần xử lý hiện tại, không khẳng định đơn hàng hoặc hợp đồng đã hoàn tất.

Caption đề xuất trong luận văn:

- Sơ đồ hoạt động đặt mua cây.
- Sơ đồ hoạt động đặt thuê và bàn giao cây.
- Sơ đồ hoạt động thanh toán đơn hàng.
- Sơ đồ hoạt động gia hạn thuê cây.
- Sơ đồ hoạt động thu hồi cây và quyết toán tiền cọc.
