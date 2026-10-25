"""
DRF Global Exception Handler according to Plantify Architecture Blueprint.
"""
import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import APIException

logger = logging.getLogger("plantify")


class BusinessRuleError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = "BUSINESS_RULE_VIOLATION"
    default_detail = "Yêu cầu vi phạm quy tắc nghiệp vụ hệ thống."

    def __init__(self, detail=None, code=None, status_code=None):
        if status_code is not None:
            self.status_code = status_code
        if code is not None:
            self.default_code = code
        super().__init__(detail=detail, code=self.default_code)


class ConflictError(BusinessRuleError):
    status_code = status.HTTP_409_CONFLICT
    default_code = "RESOURCE_CONFLICT"
    default_detail = "Xung đột tài nguyên hoặc trạng thái không hợp lệ."


def global_exception_handler(exc, context):
    """
    Unified DRF Exception Handler.
    Returns consistent response format:
    {
        "success": False,
        "error": {
            "code": "ERROR_CODE",
            "message": "User-friendly message",
            "details": {...}
        }
    }
    """
    response = exception_handler(exc, context)

    if response is not None:
        error_code = getattr(exc, "default_code", "ERROR")
        if hasattr(exc, "detail") and isinstance(exc.detail, dict) and "code" in exc.detail:
            error_code = exc.detail["code"]

        formatted_data = {
            "success": False,
            "error": {
                "code": str(error_code).upper(),
                "message": str(exc.detail if hasattr(exc, "detail") else exc),
                "details": response.data,
            },
        }
        response.data = formatted_data
        return response

    # Unhandled unexpected errors
    logger.exception("Unhandled server error: %s", str(exc), exc_info=exc)
    return Response(
        {
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "Đã có lỗi hệ thống xảy ra. Vui lòng thử lại sau.",
                "details": None,
            },
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
