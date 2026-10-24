# Đặc tả 5 sơ đồ Activity Plantify

## Phạm vi và cách diễn giải

Bộ sơ đồ mô tả hoạt động ở mức phân tích/thiết kế nghiệp vụ, dùng cho luận văn tốt nghiệp. Không phải mọi nhánh trên hình đều đã được tích hợp đầy đủ vào ứng dụng hiện tại. Các bước có căn cứ mã nguồn và phần thiết kế dự kiến được phân biệt ở cuối tài liệu.

- Khách hàng đã đăng nhập khi đặt hàng hoặc yêu cầu gia hạn.
- Mỗi hình có một điểm bắt đầu và các kết quả kết thúc rõ ràng. Điểm kết thúc ở nhánh chờ xử lý chỉ kết thúc lần yêu cầu đang mô tả; nghiệp vụ tổng thể vẫn có thể được tiếp tục sau.
- Hình thoi không nhãn là merge của các nhánh lựa chọn, không phải join đồng bộ. Không có fork/join vì bộ quy trình này không yêu cầu mô tả xử lý song song.
- Đường nối có mũi tên là control flow; nhãn trong ngoặc vuông là guard. Chỉ một nhánh của mỗi quyết định được chọn theo dữ liệu của lần xử lý.
- Biểu tượng rake trên một khối hành động thể hiện hoạt động con. AD-01, AD-02, AD-04 và phần thu phí bổ sung trong AD-05 tham chiếu AD-03.
- Lane “Đơn vị xác nhận thanh toán” ở AD-03 gom trách nhiệm xác nhận theo phương thức: cổng thanh toán cho trực tuyến, nhân viên đối soát cho chuyển khoản và nhân viên thu tiền cho COD. Đây là các vai trò thay thế theo nhánh, không phải một cá nhân thực hiện mọi phương thức.
- Sơ đồ tách mua và thuê để dễ trình bày. Đơn hỗn hợp sử dụng chung cơ chế dòng đơn/thanh toán và không có trang riêng trong bộ này.

## AD-01 — Đặt mua cây

**Mục tiêu:** Tạo đơn mua từ lựa chọn của khách, kiểm tra thông tin và giữ kho bán.

**Tác nhân:** Khách hàng, Hệ thống Plantify.

**Tiền điều kiện:** Khách đã đăng nhập, sản phẩm/biến thể đang được phép bán.

**Luồng chính:**

1. Khách chọn cây, biến thể và số lượng.
2. Hệ thống kiểm tra giỏ và tồn kho khả dụng.
3. Khách nhập/chọn địa chỉ; hệ thống kiểm tra thông tin giao nhận.
4. Hệ thống tính và hiển thị tổng tiền.
5. Khách xác nhận; hệ thống tạo đơn và giữ số lượng tồn kho.
6. Gọi AD-03 cho việc thanh toán theo phương thức được chọn.
7. Trả mã đơn và kết quả xử lý hiện tại.

**Ngoại lệ:** Thiếu hàng thì quay lại điều chỉnh lựa chọn; địa chỉ không hợp lệ thì sửa; khách không xác nhận thì hủy trước khi tạo đơn.

**Hậu điều kiện:** Có đơn và dữ liệu giữ kho nếu đặt thành công. Kết quả của AD-03 có thể là đã trả tiền, chưa trả hoặc chờ xác nhận; tạo đơn không tự mang nghĩa đã thanh toán. Với COD, việc thu tiền gắn với xác nhận giao nhận thực tế trong AD-03.

**Dữ liệu liên quan:** Cart, CartItem, Order, OrderItem, StockBalance, StockReservation, Payment.

## AD-02 — Đặt thuê và bàn giao cây

**Mục tiêu:** Ghi nhận nhu cầu thuê và chỉ đưa hợp đồng vào hiệu lực sau khi đủ điều kiện, phân bổ và bàn giao cây.

**Tác nhân:** Khách hàng, Hệ thống Plantify, Nhân viên vận hành.

**Tiền điều kiện:** Khách đã đăng nhập; sản phẩm được phép thuê; biểu giá và điều kiện thanh toán/cọc được cấu hình.

**Luồng chính:**

1. Khách chọn cây, số lượng và kỳ thuê; hệ thống kiểm tra dữ liệu và khả năng cung ứng.
2. Hệ thống báo phí thuê và cọc; khách xác nhận đặt thuê.
3. Tạo đơn thuê và gọi AD-03.
4. Kiểm tra đã đạt điều kiện thanh toán/cọc theo chính sách của đơn thuê.
5. Lập hợp đồng và tách chi tiết theo từng cây.
6. Nhân viên chọn cây vật lý đúng biến thể; hệ thống kiểm tra tình trạng và lịch của cây cụ thể.
7. Gán cây, tạo booking, bàn giao và xác nhận giao nhận.
8. Hệ thống ghi nhận hợp đồng đang hiệu lực.

**Ngoại lệ:** Yêu cầu không hợp lệ được điều chỉnh trước khi tạo đơn; khách có thể hủy ở bước xác nhận. Thanh toán chưa đạt điều kiện thì đơn chờ xử lý. Nếu cây đã chọn không gán được thì chọn cây khác; hết phương án phù hợp thì ghi nhận chờ phân bổ và thông báo khách.

**Quy tắc:** Kiểm tra khả năng cung ứng ở đầu quy trình không đồng nghĩa đã giữ một cây vật lý. Booking chỉ được tạo khi phân bổ cây cụ thể. Nếu đã thu tiền mà không phân bổ được, phải xử lý tiếp bằng phương án thỏa thuận hoặc hoàn tiền theo chính sách; hình không tự coi hợp đồng đã có hiệu lực.

**Dữ liệu liên quan:** ProductVariant, RentalRate, Order, RentalContract, RentalContractItem, PlantAsset, RentalAssetBooking, Payment, DepositLedgerEntry.

## AD-03 — Thanh toán đơn hàng

**Mục tiêu:** Ghi nhận kết quả thanh toán đúng nguồn, đúng giao dịch và không hạch toán lặp.

**Tác nhân:** Khách hàng, Hệ thống Plantify, Đơn vị xác nhận theo phương thức.

**Tiền điều kiện:** Có đơn/khoản phải thanh toán hợp lệ. Khi dùng cho gia hạn hoặc phí bổ sung, ngữ cảnh giao dịch phải được gắn đúng nghiệp vụ gọi.

**Luồng chính:**

1. Khách chọn phương thức, hệ thống ghi nhận yêu cầu thanh toán.
2. Trực tuyến: khách thao tác trên cổng, cổng xử lý và trả kết quả. Chuyển khoản: khách chuyển tiền, nhân viên đối soát. COD: chờ giao hàng và xác nhận số tiền đã thu.
3. Các nhánh phương thức hợp nhất trước bước xác minh nguồn xác nhận, mã và số tiền giao dịch.
4. Nếu kết quả này đã được ghi nhận thì trả lại kết quả đã có.
5. Nếu là kết quả mới: thành công thì ghi nhận đã thanh toán, phân bổ tiền, cập nhật nghiệp vụ và thông báo; chưa xác định thì theo dõi chờ xác nhận; thất bại/hủy/hết hạn thì cho khách lựa chọn thử lại hoặc dừng.

**Ngoại lệ:** Kết quả không hợp lệ được chuyển kiểm tra và không tự đổi giao dịch sang đã thanh toán. Trang chuyển hướng trên trình duyệt không tự đủ làm căn cứ ghi nhận tiền. Thao tác thử lại phải phân biệt lần thử với việc thu tiền lặp và kiểm tra lại điều kiện đơn khi cần.

**Hậu điều kiện:** Chỉ kết quả được xác minh thành công mới tạo ghi nhận đã trả tiền. Nhánh chờ xác nhận giữ trạng thái đang chờ. Việc nhận lại kết quả đã xử lý không cộng tiền/phân bổ/giữ cọc thêm lần nữa.

**Dữ liệu liên quan:** Payment, PaymentAttempt, PaymentAllocation; Order hoặc RentalContract và sổ cọc khi nghiệp vụ cần.

## AD-04 — Gia hạn thuê cây

**Mục tiêu:** Thay đổi kỳ thuê sau khi yêu cầu được chấp thuận, khách đồng ý và đáp ứng các điều kiện áp dụng.

**Tác nhân:** Khách hàng, Hệ thống Plantify, Nhân viên vận hành.

**Tiền điều kiện:** Khách có quyền trên cây/hợp đồng và đối tượng đang đủ điều kiện được yêu cầu gia hạn.

**Luồng chính:**

1. Khách chọn cây và ngày kết thúc mới.
2. Kiểm tra quyền, ngày và lịch thuê tiếp theo; ghi yêu cầu chờ duyệt nếu hợp lệ.
3. Nhân viên xem xét; từ chối thì ghi lý do và kết thúc yêu cầu.
4. Nếu chấp thuận, xác định phí và thông báo phương án; khách có thể đồng ý hoặc hủy.
5. Nếu có phí, gọi AD-03 và kiểm tra kết quả. Nếu không có phí thì đi thẳng đến bước áp dụng.
6. Kiểm tra lại lịch trước khi thay đổi vì lịch có thể đã thay đổi trong lúc xét duyệt/thanh toán.
7. Cập nhật kỳ thuê và booking đồng bộ; thông báo thời hạn mới.

**Ngoại lệ:** Không đủ điều kiện thì khách sửa và gửi lại hoặc dừng. Chưa thanh toán thì giữ nguyên kỳ thuê. Nếu lịch không còn khả dụng thì chưa áp dụng gia hạn và phải xử lý khoản đã thu nếu có; chưa tự kết luận đã hoàn tiền.

**Quy tắc thiết kế sử dụng trong hình:** Nhân viên duyệt phương án, khách đồng ý, phí được thanh toán trước khi áp dụng khi có phí. Mức phí và chính sách bồi hoàn/xử lý sau khi đã thu được giữ ở mức cấu hình, không tự đặt giá trị cụ thể.

**Dữ liệu liên quan:** RentalExtensionRequest, RentalContractItem, RentalAssetBooking, Payment.

## AD-05 — Thu hồi cây và quyết toán cọc

**Mục tiêu:** Kết thúc nghĩa vụ thuê và chỉ đóng hợp đồng khi cây/nghĩa vụ, phí và tiền cọc đã được xử lý đủ.

**Tác nhân:** Khách hàng, Nhân viên vận hành, Hệ thống Plantify. Hoạt động con hoàn cọc làm việc với đơn vị thanh toán tương ứng.

**Tiền điều kiện:** Có hợp đồng và yêu cầu/lịch thu hồi hợp lệ.

**Luồng chính:**

1. Khách bàn giao cây; nhân viên tiếp nhận và đối chiếu hợp đồng.
2. Kiểm định từng cây; hệ thống ghi nhận cây đã trả và kết thúc booking tương ứng.
3. Kiểm tra đã xử lý đủ cây/nghĩa vụ. Cây mất chưa được xử lý trách nhiệm không được coi là đã hoàn tất.
4. Nhân viên xác định và duyệt các khoản phải thu; hệ thống tính cọc đang giữ và khoản khấu trừ.
5. Nếu phí vượt cọc thì yêu cầu thanh toán phần còn thiếu qua AD-03.
6. Khi không còn khoản thiếu cần thu, ghi nhận khấu trừ và tính tiền cọc cần hoàn.
7. Có tiền cần hoàn thì thực hiện hoàn, kiểm tra thành công rồi ghi sổ hoàn cọc; không cần hoàn thì bỏ qua bước này.
8. Đóng hợp đồng, thông báo quyết toán và trả kết quả cho khách.

**Công thức nghiệp vụ:** Với `C` là cọc thực tế còn giữ và `F` là phí đã duyệt: khấu trừ cọc = `min(C, F)`; cần thu thêm = `max(0, F-C)`; cần hoàn = `max(0, C-F)`. Không dùng khoản cọc ban đầu thay cho cọc còn giữ nếu đã có biến động trước đó.

**Ngoại lệ:** Còn cây/nghĩa vụ chưa xử lý, chưa thanh toán phần thiếu hoặc hoàn tiền đang chờ/thất bại đều kết thúc lần xử lý với hợp đồng chưa đóng. Tạo yêu cầu hoàn không đồng nghĩa đã hoàn thành chuyển tiền.

**Dữ liệu liên quan:** RentalContract, RentalContractItem, RentalInspection, RentalAssetBooking, PlantAsset, Payment, Refund, DepositLedgerEntry.

## Đối chiếu với mã nguồn hiện tại

| Sơ đồ | Căn cứ đã có trong mã nguồn | Phần mô tả thiết kế còn cần tích hợp/hoàn thiện |
|---|---|---|
| AD-01 | `orders/services/add_to_cart.py`, `checkout_order.py`, `inventory/services/reserve_stock.py`: dữ liệu giỏ, kỳ thuê, tạo đơn, snapshot tiền và giữ kho. | Nối checkout với toàn bộ luồng thanh toán/giao diện; kiểm tra đầy đủ các điều kiện giao nhận và các tình huống cạnh tranh trong luồng tổng thể. |
| AD-02 | `rentals/services/create_contract.py`, `allocate_asset.py`, `selectors/availability.py`: tạo hợp đồng, tách chi tiết, gán cây và kiểm tra trùng lịch. | Tính phí đầy đủ theo kỳ thuê, điều kiện cọc cấu hình, kiểm tra nguồn cung ở bước đặt, xác nhận bàn giao và nối quy trình xuyên suốt. |
| AD-03 | `payments/services/create_payment.py`, `capture_payment.py`: payment, allocations, chống capture lặp; có helper chữ ký. | Các gateway mới là khung; `verify_gateway_webhook` hiện trả `True`. Hình mô tả xác minh đúng và kết quả đầy đủ theo thiết kế, không khẳng định code đã thực hiện. Luồng COD/chuyển khoản và retry cần được nối đầy đủ. |
| AD-04 | `rentals/services/extend_rental.py`: kiểm tra ngày/lịch và tạo yêu cầu chờ duyệt. | Duyệt/từ chối, chấp nhận phương án, thu phí, kiểm tra lại và cập nhật booking đồng bộ chưa được tích hợp đủ. |
| AD-05 | `rentals/services/return_asset.py`, `settle_deposit.py`, `payments/services/settle_deposit.py`, `request_refund.py`: kiểm định, ghi sổ, tạo yêu cầu hoàn và đóng hợp đồng ở các service riêng. | Nối thành luồng thu hồi/quyết toán, kiểm tra cọc thực còn giữ, thu phí vượt cọc, xử lý mất cây, hoàn tiền thực tế và điều kiện đóng hợp đồng an toàn. |

Các sơ đồ không tự đặt mức phạt, tỷ lệ cọc, cách làm tròn kỳ thuê hoặc SLA hoàn tiền. Các giá trị này được xác định theo chính sách nghiệp vụ khi triển khai và có thể điều chỉnh trực tiếp trong file draw.io nếu phạm vi luận văn thay đổi.

## Rà soát bộ hình

- Đúng 5 file riêng AD-01 đến AD-05, mỗi file chứa một sơ đồ và một điểm bắt đầu. Bản tổng hợp nhiều trang trước đây được giữ để tham khảo.
- Mọi node có thể đi đến từ điểm bắt đầu và có đường đến ít nhất một kết quả kết thúc.
- Mỗi quyết định có guard rõ; các nhánh lựa chọn hội tụ qua merge khi cần.
- Không đặt nhiều luồng vào một action để vô tình biểu diễn đồng bộ; các điểm hội tụ được tách riêng.
- Hủy thao tác trước khi tạo đơn không làm phát sinh giữ kho. Chưa trả tiền/chưa giao/chưa hoàn cọc không bị mô tả là đã hoàn tất nghiệp vụ tương ứng.
- Các điều kiện chưa đạt có kết quả chờ/không áp dụng rõ ràng; không để nhánh treo.
- Xuất hình bằng draw.io desktop; kiểm tra đường nối, chữ, swimlane và ký hiệu ở bản xuất.
