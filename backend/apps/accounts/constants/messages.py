"""Account and authentication constants, messages, and regex patterns."""

# Phone configuration
PHONE_MAX_LENGTH = 20
PHONE_REGEX = r"^(?:0[35789]\d{8}|\+?84[35789]\d{8})$"

# Validation & Error Messages
PHONE_REQUIRED_ERROR = "Số điện thoại là trường bắt buộc."
PHONE_INVALID_ERROR = "Số điện thoại Việt Nam không hợp lệ."
PHONE_ALREADY_EXISTS_ERROR = "Số điện thoại này đã được liên kết với một tài khoản khác."

EMAIL_REQUIRED_ERROR = "Email là trường bắt buộc."
EMAIL_ALREADY_EXISTS_ERROR = "Địa chỉ email này đã được sử dụng trên hệ thống."
