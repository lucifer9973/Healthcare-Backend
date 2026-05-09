from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field

from apps.doctors.models import Doctor
from apps.doctors.serializers import DoctorSerializer
from apps.patients.models import Patient
from apps.patients.serializers import PatientSerializer

from .models import PatientDoctorMapping


class PatientDoctorMappingSerializer(serializers.ModelSerializer):
    patient_detail = PatientSerializer(source="patient", read_only=True)
    doctor_detail = DoctorSerializer(source="doctor", read_only=True)

    class Meta:
        model = PatientDoctorMapping
        fields = ("id", "patient", "doctor", "patient_detail", "doctor_detail", "assigned_at")
        read_only_fields = ("id", "patient_detail", "doctor_detail", "assigned_at")
        validators = []

    def validate_patient(self, patient):
        request = self.context["request"]
        if patient.created_by_id != request.user.id:
            raise serializers.ValidationError("Patient not found.")
        return patient

    def validate(self, attrs):
        patient = attrs.get("patient")
        doctor = attrs.get("doctor")
        queryset = PatientDoctorMapping.objects.filter(patient=patient, doctor=doctor)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("This doctor is already assigned to this patient.")
        return attrs


class PatientWithDoctorsSerializer(serializers.ModelSerializer):
    assigned_doctors = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = (
            "id",
            "full_name",
            "age",
            "gender",
            "phone",
            "address",
            "medical_history",
            "created_at",
            "assigned_doctors",
        )

    @extend_schema_field(DoctorSerializer(many=True))
    def get_assigned_doctors(self, patient):
        mappings = patient.doctor_mappings.select_related("doctor")
        doctors = [mapping.doctor for mapping in mappings]
        return DoctorSerializer(doctors, many=True).data


class MappingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientDoctorMapping
        fields = ("id", "patient", "doctor", "assigned_at")
        read_only_fields = ("id", "assigned_at")
        validators = []

    def validate_patient(self, patient):
        request = self.context["request"]
        if patient.created_by_id != request.user.id:
            raise serializers.ValidationError("Patient not found.")
        return patient

    def validate_doctor(self, doctor):
        if not Doctor.objects.filter(pk=doctor.pk).exists():
            raise serializers.ValidationError("Doctor not found.")
        return doctor

    def validate(self, attrs):
        if PatientDoctorMapping.objects.filter(
            patient=attrs["patient"],
            doctor=attrs["doctor"],
        ).exists():
            raise serializers.ValidationError("This doctor is already assigned to this patient.")
        return attrs
