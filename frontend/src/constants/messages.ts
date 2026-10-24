export const MESSAGES = {
  NETWORK_ERROR: "Không thể kết nối máy chủ. Vui lòng thử lại sau.",
  SERVER_ERROR: "Hệ thống đang bận. Vui lòng thử lại sau.",
  UNEXPECTED_ERROR: "Đã có lỗi xảy ra. Vui lòng thử lại.",
  LOGIN_SUCCESS: "Đăng nhập thành công. Chào mừng bạn trở lại!",
  LOGIN_ERROR: "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.",
  REGISTER_SUCCESS: "Tạo tài khoản thành công. Chào mừng bạn!",
  REGISTER_ERROR:
    "Đăng ký không thành công. Vui lòng kiểm tra thông tin và thử lại.",
  LOGOUT_SUCCESS: "Đã đăng xuất tài khoản.",
  NEWSLETTER_SAVED: "Đã lưu email trên thiết bị này. Cảm ơn bạn đã ghé thăm!",
  STORAGE_ERROR:
    "Không thể lưu dữ liệu trên thiết bị. Vui lòng kiểm tra cài đặt trình duyệt.",
  FAVORITE_ADDED: (name: string) => `Đã thêm ${name} vào danh sách yêu thích.`,
  FAVORITE_REMOVED: (name: string) => `Đã bỏ ${name} khỏi danh sách yêu thích.`,
} as const;

export const VALIDATION_MESSAGES = {
  INVALID_FORM: "Vui lòng kiểm tra thông tin đã nhập.",
  REQUIRED: (label: string) =>
    `Vui lòng nhập ${label.toLocaleLowerCase("vi")}.`,
  REQUIRED_FIELD: "Vui lòng điền thông tin bắt buộc.",
  EMAIL_REQUIRED: "Vui lòng nhập email",
  EMAIL_INVALID: "Định dạng email không hợp lệ",
  PASSWORD_LOGIN_MIN: "Mật khẩu tối thiểu 6 ký tự",
  PASSWORD_REGISTER_MIN: "Mật khẩu tối thiểu 8 ký tự",
  NAME_MIN: "Họ và tên tối thiểu 2 ký tự",
  PHONE_INVALID: "Số điện thoại Việt Nam không hợp lệ",
  PASSWORD_CONFIRM_REQUIRED: "Vui lòng xác nhận mật khẩu",
  PASSWORD_MISMATCH: "Mật khẩu xác nhận không trùng khớp",
  INVALID_FORMAT: "Thông tin chưa đúng định dạng. Vui lòng kiểm tra lại.",
} as const;
