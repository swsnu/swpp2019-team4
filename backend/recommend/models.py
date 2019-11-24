import re
from django.db import models
from assaapp.models import User, Course

class CoursePref(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    score = models.IntegerField(default=5)

class TimePref(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    weekday = models.IntegerField(default=0)
    start_time = models.TimeField()
    score = models.IntegerField(default=5)