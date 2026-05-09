import re

from rest_framework import serializers

from .models import Doctor


PHONE_PATTERN = re.compile(r"^\+?[0-9][0-9\s\-()]{7,19}$")


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = (
            "id",
            "full_name",
            "specialization",
            "email",
            "phone",
            "hospital_name",
            "years_of_experience",
            "created_at",
        )
        read_only_fields = ("id", "created_at")

    def validate_full_name(self, value):
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError("Full name must be at least 2 characters.")
        return value

    def validate_email(self, value):
        email = value.lower().strip()
        queryset = Doctor.objects.filter(email__iexact=email)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("A doctor with this email already exists.")
        return email

    def validate_phone(self, value):
        value = value.strip()
        if not PHONE_PATTERN.match(value):
            raise serializers.ValidationError("Enter a valid phone number.")
        return value

    def validate_years_of_experience(self, value):
        if value > 80:
            raise serializers.ValidationError("Years of experience must be realistic.")
        return value
