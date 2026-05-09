from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        return response

    detail = response.data
    message = "Request failed."

    if isinstance(detail, dict):
        if "detail" in detail:
            message = str(detail["detail"])
        elif "non_field_errors" in detail:
            message = detail["non_field_errors"][0]
        else:
            message = "Validation error."
    elif isinstance(detail, list) and detail:
        message = str(detail[0])

    response.data = {
        "success": False,
        "message": message,
        "errors": detail,
    }
    return response
