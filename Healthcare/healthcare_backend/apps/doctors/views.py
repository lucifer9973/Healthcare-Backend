from rest_framework import viewsets

from .models import Doctor
from .serializers import DoctorSerializer


class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    search_fields = ("full_name", "specialization", "email", "phone", "hospital_name")
    filterset_fields = ("specialization", "hospital_name")
    ordering_fields = ("created_at", "full_name", "years_of_experience")
    ordering = ("full_name",)
