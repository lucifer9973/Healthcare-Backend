from django.db import models


class Doctor(models.Model):
    full_name = models.CharField(max_length=150)
    specialization = models.CharField(max_length=120)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    hospital_name = models.CharField(max_length=180)
    years_of_experience = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["full_name"]
        indexes = [
            models.Index(fields=["email"]),
            models.Index(fields=["specialization"]),
        ]

    def __str__(self):
        return f"{self.full_name} - {self.specialization}"
