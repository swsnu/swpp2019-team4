from django.urls import path
from recommend import views

urlpatterns = [
    path('coursepref/', views.api_coursepref, name='coursepref'),
    path('coursepref/<int:course_id>/', views.api_coursepref_id, name='coursepref_id'),
    path('timepref/', views.api_timepref, name='timepref'),
    path('timepref/<int:timepref_id>/', views.api_timepref_id, name='timepref_id'),
    path('recommend/', views.api_recommend, name='recommend'),
    path('constraints/', views.api_constraints, name='constraints'),
    path('coursepref/rated/', views.api_coursepref_rated, name='coursepref_rated'),
    path('coursepref/unrated/', views.api_coursepref_unrated, name='coursepref_unrated'),
    path('coursepref/<int:course_id>/', views.api_coursepref_id, name='coursepref_id'),
    path('lastpage/', views.api_lastpage, name='lastpage'),
]
