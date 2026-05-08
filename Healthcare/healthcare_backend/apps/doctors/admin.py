from django.contrib import admin

from .models import Doctor


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ("full_name", "specialization", "email", "phone", "hospital_name")
    list_filter = ("specialization", "hospital_name")
    search_fields = ("full_name", "email", "phone", "hospital_name")
