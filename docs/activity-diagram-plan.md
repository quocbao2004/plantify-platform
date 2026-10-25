# Kế hoạch Activity Diagram cho các chức năng chính của Plantify

## Phạm vi thống nhất

Chỉ vẽ 5 chức năng chính phục vụ luận văn tốt nghiệp, tập trung vào nghiệp vụ bán và cho thuê cây. Đã tạo bộ sơ đồ theo phạm vi này và tách mỗi chức năng thành một file draw.io riêng: [5 file draw.io, hình SVG/PNG và hướng dẫn](activity-diagrams/README.md), [đặc tả và đối chiếu mã nguồn](activity-diagrams/specifications.md).

Đăng nhập được xem là tiền điều kiện ở những thao tác cần tài khoản. Các chức năng đăng ký, tìm kiếm, CRUD quản trị, chatbot, CMS, đánh giá, báo cáo và loyalty không có sơ đồ Activity riêng trong bộ này. Tìm/chọn sản phẩm được thể hiện ngắn gọn khi cần dẫn vào quy trình đặt hàng.

## Danh sách 5 sơ đồ

| Mã | Chức năng | Swimlane | Luồng chính | Nhánh quan trọng |
|---|---|---|---|---|
| AD-01 | Đặt mua cây | Khách hàng, Hệ thống | Chọn cây/biến thể → nhập số lượng → kiểm tra giỏ và tồn kho → nhập địa chỉ → tính tổng tiền → xác nhận → tạo đơn và giữ kho → chuyển sang quy trình thanh toán khi áp dụng. | Không đủ hàng, thông tin không hợp lệ, thay đổi số lượng/địa chỉ hoặc hủy thao tác. |
| AD-02 | Đặt thuê và bàn giao cây | Khách hàng, Hệ thống, Nhân viên | Chọn cây và thời gian thuê → kiểm tra khả năng cung ứng → tính phí thuê/cọc → xác nhận đơn thuê → gọi thanh toán → kiểm tra điều kiện bàn giao → lập hợp đồng, chọn cây vật lý, kiểm tra lịch và gán cây → giao cây. | Kỳ thuê sai, không đủ cây phù hợp/trùng lịch, thanh toán chưa đạt điều kiện và khách không tiếp tục. |
| AD-03 | Thanh toán đơn hàng | Khách hàng, Hệ thống, Đơn vị thanh toán/Nhân viên xác nhận khi cần | Chọn phương thức → tạo yêu cầu giao dịch → thực hiện thanh toán hoặc chờ thu COD/xác nhận chuyển khoản → xác minh kết quả → ghi nhận tiền và cập nhật đơn/hợp đồng. | Thành công, thất bại, hủy, hết hạn, đang chờ xác nhận và kết quả lặp. COD chỉ ghi đã trả tiền khi có xác nhận thu tiền. |
| AD-04 | Gia hạn thuê cây | Khách hàng, Hệ thống, Nhân viên | Chọn cây đang thuê → nhập ngày mới → kiểm tra ngày/lịch → gửi yêu cầu → duyệt hoặc từ chối → xác định phí, gọi thanh toán nếu có → cập nhật kỳ thuê và booking → thông báo. | Trùng lịch, ngày không hợp lệ, từ chối gia hạn, chưa thanh toán hoặc thanh toán thất bại. |
| AD-05 | Thu hồi cây và quyết toán cọc | Khách hàng, Nhân viên, Hệ thống; Đơn vị thanh toán nếu cần | Thu hồi → kiểm định từng cây → ghi nhận tình trạng và phí được duyệt → kiểm tra đã thu hồi/kiểm định đủ → tính cọc còn giữ và khoản khấu trừ → hoàn phần còn lại → ghi kết quả/sổ cọc → đóng hợp đồng khi đủ điều kiện. | Còn cây chưa trả, cây hư hỏng/mất, không còn tiền để hoàn, phí vượt cọc và hoàn tiền đang chờ/thất bại. |

AD-02 và AD-04 gọi AD-03 để tránh lặp toàn bộ quy trình thanh toán. Với COD trong AD-01, việc xác nhận thu tiền diễn ra sau bước giao nhận thực tế; tạo đơn không đồng nghĩa đã thanh toán. Bộ này tách tình huống mua và thuê để trình bày; đơn hỗn hợp có thể ghi trong phần thuyết minh hoặc thêm nhánh khi cần, không phát sinh sơ đồ riêng.

## Các bước thực hiện

1. Viết đặc tả ngắn cho từng sơ đồ: tác nhân, tiền điều kiện, luồng chính, nhánh thay thế và kết quả.
2. Chốt các chính sách ảnh hưởng đến nhánh: kỳ tính phí thuê, điều kiện thu cọc/bàn giao, COD, gia hạn, phí hư hỏng và hoàn cọc.
3. Vẽ AD-01 làm mẫu thống nhất ký pháp và bố cục; sau đó AD-03 → AD-02 → AD-04 → AD-05.
4. Đối chiếu giữa các sơ đồ và model/service, đi thử các kịch bản thành công và ngoại lệ.
5. Xuất bộ sơ đồ để chèn luận văn.

## Quy cách sơ đồ và đầu ra

- Năm file draw.io offline riêng, mỗi file chứa đúng một sơ đồ chỉnh sửa được.
- Nền trắng, nét đen, nhãn tiếng Việt; ưu tiên bố cục dọc đọc được trên A4.
- Dùng swimlane thể hiện trách nhiệm; mỗi hình chỉ có các vai trò thực sự tham gia. Nếu lane thanh toán/nhân viên khiến hình quá rộng, gom phần xử lý phương thức thành hoạt động con có chú thích trách nhiệm.
- Mỗi sơ đồ chỉ có một điểm bắt đầu và một điểm kết thúc chung. Dùng action bo góc, decision/merge và các nhánh có điều kiện rõ ràng; các kết quả hội tụ qua merge trước End. Fork/join chỉ dùng cho xử lý thực sự song song.
- AD-05 có thể dùng hoạt động con cho kiểm định từng cây/hoàn tiền để giữ một trang dễ đọc.
- Mỗi hình thể hiện hành động nghiệp vụ và kết quả, không đưa tên hàm/API/khóa ngoại lên sơ đồ.
- Kèm SVG/PNG cho từng hình và một tài liệu đặc tả ngắn. Đặt tên hình trong luận văn theo mã chức năng, sau đó đánh số theo chương.

Tệp bàn giao: `docs/activity-diagrams/AD-01-dat-mua-cay.drawio`, `AD-02-dat-thue-cay.drawio`, `AD-03-thanh-toan.drawio`, `AD-04-gia-han-thue.drawio`, `AD-05-thu-hoi-hoan-coc.drawio`; các hình trong `svg/` và `png/`, cùng `specifications.md`. Bản tổng hợp nhiều trang trước đây vẫn được giữ để tham khảo.

## Đối chiếu mức triển khai

Căn cứ: [Danh_Sach_Chuc_Nang.md](Danh_Sach_Chuc_Nang.md), [database-erd.md](database-erd.md) và mã nguồn `backend/apps/`.

Một số bước thanh toán trực tuyến, duyệt/thu phí gia hạn, nối hoàn tiền và đóng hợp đồng chưa được tích hợp đầy đủ. Đặc tả phải phân biệt bước có mã xử lý với thiết kế dự kiến. Việc kiểm tra khả năng cung ứng khi đặt thuê không đồng nghĩa đã giữ một cây vật lý; booking cây cụ thể được tạo khi phân bổ.

Quyết định nghiệp vụ cần chốt: cơ chế COD, cách tính kỳ thuê, thời điểm thu cọc/bàn giao, thời điểm thanh toán gia hạn, xử lý trả sớm/quá hạn, khoản phí vượt cọc và điều kiện kết thúc hợp đồng. Các điểm này được ghi rõ trong đặc tả trước khi hoàn thiện nhánh liên quan.

Ký pháp tham chiếu: [OMG UML 2.5.1](https://www.omg.org/spec/UML/2.5.1).
