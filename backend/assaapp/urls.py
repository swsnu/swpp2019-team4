from django.urls import path
from assaapp import views

urlpatterns = [
    path('token/', views.token),
    path('signin/', views.signin),
    path('signout/', views.signout),
    path('user/', views.user),
    path('timetable/', views.timetable)
]