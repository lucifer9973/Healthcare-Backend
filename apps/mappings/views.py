from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.filters import OrderingFilter, SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import OpenApiParameter, extend_schema

from apps.core.responses import success_response
from apps.patients.models import Patient

from .models import PatientDoctorMapping
from .serializers import MappingCreateSerializer, PatientDoctorMappingSerializer, PatientWithDoctorsSerializer


class MappingListCreateView(generics.ListCreateAPIView):
    queryset = PatientDoctorMapping.objects.none()
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = ("patient", "doctor")
    search_fields = ("patient__full_name", "doctor__full_name", "doctor__specialization")
    ordering_fields = ("assigned_at",)
    ordering = ("-assigned_at",)

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return PatientDoctorMapping.objects.none()
        return (
            PatientDoctorMapping.objects.filter(patient__created_by=self.request.user)
            .select_related("patient", "doctor", "patient__created_by")
        )

    def get_serializer_class(self):
        if self.request.method == "POST":
            return MappingCreateSerializer
        return PatientDoctorMappingSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        mapping = serializer.save()
        data = PatientDoctorMappingSerializer(mapping, context=self.get_serializer_context()).data
        return success_response(data=data, message="Doctor assigned to patient.", status_code=status.HTTP_201_CREATED)


class MappingPatientDetailDeleteView(generics.GenericAPIView):
    queryset = PatientDoctorMapping.objects.all()
    serializer_class = PatientWithDoctorsSerializer

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=int,
                location=OpenApiParameter.PATH,
                description="Patient ID owned by the authenticated user.",
            )
        ],
        responses=PatientWithDoctorsSerializer,
    )
    def get(self, request, id):
        patient = get_object_or_404(
            Patient.objects.prefetch_related("doctor_mappings__doctor"),
            pk=id,
            created_by=request.user,
        )
        serializer = PatientWithDoctorsSerializer(patient)
        return success_response(data=serializer.data, message="Patient assigned doctors retrieved.")

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="id",
                type=int,
                location=OpenApiParameter.PATH,
                description="Mapping ID to delete.",
            )
        ],
        responses={204: None},
    )
    def delete(self, request, id):
        mapping = get_object_or_404(
            PatientDoctorMapping.objects.filter(patient__created_by=request.user),
            pk=id,
        )
        mapping.delete()
        return success_response(data=None, message="Mapping deleted.", status_code=status.HTTP_204_NO_CONTENT)
