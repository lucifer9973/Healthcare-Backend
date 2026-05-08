import pytest
from django.contrib.auth import get_user_model


User = get_user_model()


@pytest.mark.django_db
def test_register_creates_user(api_client):
    response = api_client.post(
        "/api/auth/register/",
        {
            "name": "Jane Doe",
            "email": "jane@example.com",
            "password": "StrongPass123!",
        },
        format="json",
    )

    assert response.status_code == 201
    assert response.data["success"] is True
    assert User.objects.filter(email="jane@example.com").exists()
    assert User.objects.get(email="jane@example.com").check_password("StrongPass123!")


@pytest.mark.django_db
def test_login_returns_jwt_tokens(api_client, user):
    response = api_client.post(
        "/api/auth/login/",
        {"email": "test@example.com", "password": "StrongPass123!"},
        format="json",
    )

    assert response.status_code == 200
    assert "access" in response.data["data"]
    assert "refresh" in response.data["data"]
