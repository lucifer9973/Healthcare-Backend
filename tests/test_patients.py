import pytest
from django.contrib.auth import get_user_model

from apps.patients.models import Patient


User = get_user_model()


@pytest.mark.django_db
def test_user_only_sees_own_patients(auth_client, user):
    other_user = User.objects.create_user(
        name="Other User",
        email="other@example.com",
        password="StrongPass123!",
    )
    Patient.objects.create(
        full_name="Visible Patient",
        age=36,
        gender="female",
        phone="+15551234567",
        address="101 Main Street",
        created_by=user,
    )
    Patient.objects.create(
        full_name="Hidden Patient",
        age=45,
        gender="male",
        phone="+15557654321",
        address="202 Main Street",
        created_by=other_user,
    )

    response = auth_client.get("/api/patients/")

    assert response.status_code == 200
    names = [item["full_name"] for item in response.data["results"]]
    assert names == ["Visible Patient"]


@pytest.mark.django_db
def test_create_patient_assigns_current_user(auth_client, user):
    response = auth_client.post(
        "/api/patients/",
        {
            "full_name": "New Patient",
            "age": 29,
            "gender": "other",
            "phone": "+15550001111",
            "address": "303 Main Street",
            "medical_history": "No known allergies",
        },
        format="json",
    )

    assert response.status_code == 201
    patient = Patient.objects.get(full_name="New Patient")
    assert patient.created_by == user
