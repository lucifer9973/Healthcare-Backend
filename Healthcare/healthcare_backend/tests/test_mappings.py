import pytest

from apps.doctors.models import Doctor
from apps.mappings.models import PatientDoctorMapping
from apps.patients.models import Patient


@pytest.fixture
def patient(user):
    return Patient.objects.create(
        full_name="Patient One",
        age=42,
        gender="female",
        phone="+15551112222",
        address="404 Main Street",
        created_by=user,
    )


@pytest.fixture
def doctor():
    return Doctor.objects.create(
        full_name="Dr. House",
        specialization="Diagnostics",
        email="house@example.com",
        phone="+15552223333",
        hospital_name="Princeton Plainsboro",
        years_of_experience=20,
    )


@pytest.mark.django_db
def test_prevents_duplicate_mapping(auth_client, patient, doctor):
    PatientDoctorMapping.objects.create(patient=patient, doctor=doctor)

    response = auth_client.post(
        "/api/mappings/",
        {"patient": patient.id, "doctor": doctor.id},
        format="json",
    )

    assert response.status_code == 400
    assert "already assigned" in str(response.data["errors"])


@pytest.mark.django_db
def test_patient_mapping_detail_returns_assigned_doctors(auth_client, patient, doctor):
    PatientDoctorMapping.objects.create(patient=patient, doctor=doctor)

    response = auth_client.get(f"/api/mappings/{patient.id}/")

    assert response.status_code == 200
    assert response.data["data"]["id"] == patient.id
    assert response.data["data"]["assigned_doctors"][0]["email"] == "house@example.com"


@pytest.mark.django_db
def test_delete_mapping_by_id(auth_client, patient, doctor):
    mapping = PatientDoctorMapping.objects.create(patient=patient, doctor=doctor)

    response = auth_client.delete(f"/api/mappings/{mapping.id}/")

    assert response.status_code == 204
    assert not PatientDoctorMapping.objects.filter(pk=mapping.id).exists()
