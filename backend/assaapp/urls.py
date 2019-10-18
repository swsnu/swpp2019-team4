from django.urls import path
from assaapp import views

urlpatterns = [
    path('token/', views.token),
    path('signin/', views.signin),
    path('user/', views.user)
]