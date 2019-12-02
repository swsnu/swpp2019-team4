from django.urls import path
from recommend import views

urlpatterns = [
    path('coursepref/', views.api_course_pref, name='coursepref'),
    path('coursepref/<int:course_id>/', views.api_course_pref_id, name='coursepref_id'),
    path('timepref/', views.api_time_pref, name='timepref'),
    path('timepref/<int:timepref_id>/', views.api_time_pref_id, name='timepref_id'),
    path('recommend/', views.api_recommend, name='recommend'),
]
