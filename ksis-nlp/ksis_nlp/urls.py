from django.contrib import admin
from django.urls import path, include
from feedback_analysis.views import root

urlpatterns = [
    path("", root, name="root"),  # root path
    path("admin/", admin.site.urls),
    path("api/", include("feedback_analysis.urls")),
]
