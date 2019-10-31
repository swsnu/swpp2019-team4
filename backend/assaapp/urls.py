from django.urls import path, re_path
from assaapp import views

urlpatterns = [
    path('token/', views.token),
    path('signup/', views.signup),
    path('signin/', views.signin),
    path('signout/', views.signout),
    re_path('^verify/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$', views.verify),
    path('user/', views.user),
    path('timetable/', views.timetable),
    path('timetable/<int:timetable_id>/', views.timetable_id, name='timetable_id'),
    path('timetable/<int:timetable_id>/course/', views.timetable_id_course, name='timetable_id_course'),
    path('course/', views.course, name='course'),
    path('course/<int:course_id>/', views.course_id, name='course_id')
]