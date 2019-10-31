from django.urls import path, re_path
from assaapp import views

urlpatterns = [
    path('token/', views.token),
    path('signup/', views.signup),
    path('signin/', views.signin),
    path('signout/', views.signout),
    re_path('^verify/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$', views.verify),
    path('user/', views.user),
    path('timetable/', views.timetable)
]