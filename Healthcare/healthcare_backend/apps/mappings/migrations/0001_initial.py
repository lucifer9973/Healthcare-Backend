import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("doctors", "0001_initial"),
        ("patients", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="PatientDoctorMapping",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("assigned_at", models.DateTimeField(auto_now_add=True)),
                ("doctor", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="patient_mappings", to="doctors.doctor")),
                ("patient", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="doctor_mappings", to="patients.patient")),
            ],
            options={
                "ordering": ["-assigned_at"],
            },
        ),
        migrations.AddConstraint(
            model_name="patientdoctormapping",
            constraint=models.UniqueConstraint(fields=("patient", "doctor"), name="unique_patient_doctor_mapping"),
        ),
        migrations.AddIndex(
            model_name="patientdoctormapping",
            index=models.Index(fields=["patient", "assigned_at"], name="mappings_pa_patient_932fd0_idx"),
        ),
        migrations.AddIndex(
            model_name="patientdoctormapping",
            index=models.Index(fields=["doctor", "assigned_at"], name="mappings_pa_doctor__8b3d74_idx"),
        ),
    ]
