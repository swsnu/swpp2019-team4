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
    score = models.IntegerField(default=3)
    def data(self):
        return {'weekday': self.weekday,
                'start_hour': self.start_time.hour,
                'start_minute': self.start_time.minute,
                'score': self.score}

class RecommendCourse(models.Model):
    timetable = models.ForeignKey('RecommendTimetable', on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    color = models.CharField(max_length=8, default='default')
    def data (self):
        course_data = Course.objects.get(pk=self.course.id).data()
        color_data = {'color': self.color}
        course_data.update(color_data)
        return course_data

class RecommendTimetable(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    def data (self):
        timetable_data = []
        course_data = [recommend_course.data() 
                       for recommend_course in RecommendCourse.objects.filter(timetable=self)]
        return {'course': course_data}
