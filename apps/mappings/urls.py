from django.urls import path

from .views import MappingListCreateView, MappingPatientDetailDeleteView

urlpatterns = [
    path("", MappingListCreateView.as_view(), name="mapping-list-create"),
    path("<int:id>/", MappingPatientDetailDeleteView.as_view(), name="mapping-patient-detail-delete"),
]
