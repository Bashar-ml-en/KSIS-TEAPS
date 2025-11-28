from django.urls import path
from .views import analyze_feedback, health

urlpatterns = [
    path("analyze-feedback/", analyze_feedback, name="analyze-feedback"),
    path("health/", health, name="health"),
]
