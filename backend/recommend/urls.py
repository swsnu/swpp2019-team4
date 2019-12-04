from django.urls import path
from recommend import views

urlpatterns = [
    path('coursepref/', views.api_coursepref, name='coursepref'),
    path('coursepref/rated/', views.api_coursepref_rated, name='coursepref_rated'),
    path('coursepref/unrated/', views.api_coursepref_unrated, name='coursepref_unrated'),
    path('coursepref/<int:course_id>/', views.api_coursepref_id, name='coursepref_id'),
    path('timepref/', views.api_timepref, name='timepref'),
    path('timepref/<int:timepref_id>/', views.api_timepref_id, name='timepref_id'),
]
