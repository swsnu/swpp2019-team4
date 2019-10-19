from django.urls import path
from assaapp import views

urlpatterns = [
    path('token/', views.token),
    path('signup/', views.signup),
    path('signin/', views.signin),
    path('signout/', views.signout),
    path('user/', views.user),
    path('timetable/', views.timetable)
]