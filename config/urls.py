from django.contrib import admin
from django.urls import include, path
from django.http import JsonResponse
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView


def api_root(request):
    return JsonResponse({
        "message": "Healthcare Backend API",
        "version": "1.0.0",
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


urlpatterns = [
    path("", api_root, name="api-root"),
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.authentication.urls")),
    path("api/patients/", include("apps.patients.urls")),
    path("api/doctors/", include("apps.doctors.urls")),
    path("api/mappings/", include("apps.mappings.urls")),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]
