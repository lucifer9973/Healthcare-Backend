import re

from rest_framework import serializers

from .models import Patient


PHONE_PATTERN = re.compile(r"^\+?[0-9][0-9\s\-()]{7,19}$")


class PatientSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)

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
            "created_by",
            "created_at",
        )
        read_only_fields = ("id", "created_by", "created_at")

    def validate_full_name(self, value):
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError("Full name must be at least 2 characters.")
        return value

    def validate_age(self, value):
        if value > 130:
            raise serializers.ValidationError("Age must be realistic.")
        return value

    def validate_phone(self, value):
        value = value.strip()
        if not PHONE_PATTERN.match(value):
            raise serializers.ValidationError("Enter a valid phone number.")
        return value
