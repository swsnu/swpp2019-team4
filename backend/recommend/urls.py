from django.urls import path, re_path
from recommend import views

urlpatterns = [
    path('coursepref/', views.api_course_pref, name='coursepref'),
    path('coursepref/<int:course_id>/', views.api_course_pref_id, name='coursepref_id'),
]
