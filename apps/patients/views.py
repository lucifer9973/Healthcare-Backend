from rest_framework import viewsets

from .models import Patient
from .serializers import PatientSerializer


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.none()
    serializer_class = PatientSerializer
    search_fields = ("full_name", "phone", "address", "medical_history")
    filterset_fields = ("gender", "age")
    ordering_fields = ("created_at", "full_name", "age")
    ordering = ("-created_at",)

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Patient.objects.none()
        return Patient.objects.filter(created_by=self.request.user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
