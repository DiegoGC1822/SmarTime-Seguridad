# Apps/Antiprocrastinacion/urls.py
from django.urls import path
from .views import AntiprocrastinacionAPIView

urlpatterns = [
    path(
        "urls/",
        AntiprocrastinacionAPIView.as_view(),
        name="antipro",
    ),
    path(
        "urls/<int:antipro_id>/",
        AntiprocrastinacionAPIView.as_view(),
        name="antipro-delete",
    ),
]
