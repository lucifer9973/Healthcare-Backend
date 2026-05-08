from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Doctor",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("full_name", models.CharField(max_length=150)),
                ("specialization", models.CharField(max_length=120)),
                ("email", models.EmailField(max_length=254, unique=True)),
                ("phone", models.CharField(max_length=20)),
                ("hospital_name", models.CharField(max_length=180)),
                ("years_of_experience", models.PositiveSmallIntegerField(default=0)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "ordering": ["full_name"],
            },
        ),
        migrations.AddIndex(
            model_name="doctor",
            index=models.Index(fields=["email"], name="doctors_doc_email_3b48b9_idx"),
        ),
        migrations.AddIndex(
            model_name="doctor",
            index=models.Index(fields=["specialization"], name="doctors_doc_special_037046_idx"),
        ),
    ]
