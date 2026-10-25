# Plantify Frontend

Ứng dụng React + TypeScript, tổ chức theo feature trong `features/`.

## Component dùng chung

Các control được dùng thống nhất từ `components/common/`:

- `ButtonCommon`: nút thao tác, hỗ trợ `variant`, `size`, `isLoading`, `disabled`, `ref`. Mặc định `type="button"`; nút gửi form phải khai báo `type="submit"`.
- `LinkCommon`: điều hướng bằng `to` (React Router) hoặc `href` (anchor), có thể dùng chung `variant`/`size` của button. Không lồng button bên trong link.
- `TextFieldCommon`: input có `label`, `hideLabel`, `error`, `helperText`, `wrapperClassName`, `ref`; tương thích `react-hook-form` qua `register`. ID tự sinh, label và mô tả lỗi được liên kết cho trình đọc màn hình.
- `SelectCommon`: dropdown với `options: { value, label, disabled? }[]`, cùng cơ chế label và lỗi như text field.
- `FormCommon`: xử lý submit, chặn submit lặp qua `isSubmitting`, validation HTML với toast và focus vào trường lỗi đầu tiên. Với React Hook Form, dùng `noValidate` và `handleSubmit(onSubmit, notifyFormErrors)`.
- `ModalCommon`: dialog native có quản lý focus, khóa cuộn nền, đóng bằng Escape hoặc backdrop.
- `ToastCommon`: được mount một lần trong `AppProviders`. Không mount thêm tại từng trang.

Để giữ các kiểu dáng riêng của homepage, dùng `variant="unstyled"` và class CSS hiện có. Với input, đặt class cho input qua `className` và cho wrapper qua `wrapperClassName`.

`components/ui/` giữ các primitive Card, Badge, Spinner. Các export Button, Input, Modal và StoreDialog cũ là adapter tương thích; mã ứng dụng hiện sử dụng tên Common.

## Labels và thông báo

- `constants/labels.ts`: text giao diện, placeholder, aria-label và hàm tạo label động, phân nhóm theo chức năng.
- `constants/messages.ts`: thông báo thao tác, lỗi và validation.
- `features/catalog/constants/`: nhãn nghiệp vụ cây cảnh, bộ sưu tập và nội dung sản phẩm.
- Gọi `notify.success`, `notify.error`, `notify.info` từ `services/notifications` để hiện toast. Không dùng alert hoặc tự tạo khối thông báo thành công/lỗi API trong từng trang.
- `QueryProvider` xử lý lỗi query và mutation tập trung. Mutation có thể khai báo `meta.successMessage`/`meta.errorMessage`; dùng `meta.silentError` khi có UI fallback xử lý lỗi chủ động.
- Lỗi từng trường vẫn hiển thị cạnh input để người dùng sửa; lỗi validation tổng quát và kết quả thao tác hiển thị bằng toast.

## Kiểm tra

```sh
npm run lint
npm test -- --run
npm run build
```

Các kiểm thử trong `test/commonComponents.test.tsx` kiểm tra control dùng chung, khả năng truy cập, chống submit lặp và luồng đăng nhập/notification với API được mock.
