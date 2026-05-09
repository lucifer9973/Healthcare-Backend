import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Patient",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("full_name", models.CharField(max_length=150)),
                ("age", models.PositiveSmallIntegerField()),
                ("gender", models.CharField(choices=[("male", "Male"), ("female", "Female"), ("other", "Other")], max_length=20)),
                ("phone", models.CharField(max_length=20)),
                ("address", models.TextField()),
                ("medical_history", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("created_by", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="patients", to=settings.AUTH_USER_MODEL)),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
        migrations.AddIndex(
            model_name="patient",
            index=models.Index(fields=["created_by", "created_at"], name="patients_pa_created_1db0dc_idx"),
        ),
        migrations.AddIndex(
            model_name="patient",
            index=models.Index(fields=["phone"], name="patients_pa_phone_fc49bb_idx"),
        ),
    ]
