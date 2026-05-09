from django.http import JsonResponse
from django.conf import settings


def api_index(request):
    """
    API root endpoint for Vercel deployment
    """
    return JsonResponse({
        "message": "Healthcare Backend API",
        "version": "1.0.0",
        "status": "running",
        "environment": "production" if getattr(settings, 'IS_VERCEL', False) else "development",
        "endpoints": {
            "auth": "/api/auth/",
            "patients": "/api/patients/",
            "doctors": "/api/doctors/",
            "mappings": "/api/mappings/",
            "docs": "/api/docs/",
            "redoc": "/api/redoc/",
            "schema": "/api/schema/",
            "admin": "/admin/"
        }
    })
