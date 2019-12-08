import re
from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser

class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None, grade=1, department=''):
        if email is None or re.compile(r'^[^@\s]+@[^.@\s]+[.][^@\s]+$').match(email) is None:
            raise ValueError('User must have an valid email address')

        user = self.model(
            email=self.normalize_email(email),
            username=username,
            grade=grade,
            department=department
        )

        user.set_password(password)
        user.save(using=self._db)

        timetable_main = Timetable.objects.create(title='My timetable', user=user)
        user.timetable_main = timetable_main
        user.save()
        return user

    def create_superuser(self, email, username, password, grade=1, department=''):
        user = self.create_user(
            email,
            password=password,
            username=username,
            grade=grade,
            department=department,
        )
        user.is_admin = True
        user.is_active = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    email = models.EmailField(verbose_name='email', max_length=255, unique=True)
    username = models.CharField(max_length=32)
    grade = models.IntegerField()
    department = models.CharField(max_length=64)
    is_active = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    timetable_main = models.OneToOneField('Timetable', null=True, blank=True,
                                          related_name='user_main', on_delete=models.SET_NULL)
    friends = models.ManyToManyField('self', symmetrical=True)
    friends_request = models.ManyToManyField('self', symmetrical=False)

    days_per_week = models.IntegerField(default=5)
    credit_min = models.IntegerField(default=1)
    credit_max = models.IntegerField(default=18)
    major_min = models.IntegerField(default=0)
    major_max = models.IntegerField(default=18)


    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

    def has_perm(self, *unused_args, **unused_kwargs):
        return True

    def has_module_perms(self, *unused_args):
        return True

    @property
    def is_staff(self):
        return self.is_admin

    def data_large(self):
        return {'id': self.id, 'email': self.email, 'username': self.username,
                'grade': self.grade, 'department': self.department,
                'timetable_main': self.timetable_main.id}

    def data_medium(self):
        return {'id': self.id, 'email': self.email, 'username': self.username,
                'grade': self.grade, 'department': self.department,
                'timetable_main': self.timetable_main.data()}

    def data_small(self):
        return {'id': self.id, 'email': self.email, 'username': self.username}

class Course(models.Model):
    semester = models.CharField(max_length=8, default='default')
    classification = models.CharField(max_length=8, default='default')
    college = models.CharField(max_length=32, default='default')
    department = models.CharField(max_length=128, default='default')
    degree_program = models.CharField(max_length=32, default='default')
    academic_year = models.CharField(max_length=8)
    course_number = models.CharField(max_length=16, default='default')
    lecture_number = models.CharField(max_length=8, default='default')
    title = models.CharField(max_length=128, default='default')
    subtitle = models.CharField(max_length=128, default='default')
    credit = models.IntegerField(default=-1)
    lecture_credit = models.IntegerField(default=-1)
    lab_credit = models.IntegerField(default=-1)
    lecture_type = models.CharField(max_length=64, default='default')
    time = models.CharField(max_length=128, default='default')
    location = models.CharField(max_length=128, default='default')
    professor = models.CharField(max_length=64, default='default')
    quota = models.CharField(max_length=16, default='default')
    remark = models.TextField(default='default')
    language = models.CharField(max_length=16, default='default')
    status = models.CharField(max_length=8, default='default')

    def data(self):
        course_time_data = [course_time.data() for course_time
                            in CourseTime.objects.filter(course=self)]
        return {
            'id': self.id,
            'title': self.title,
            'lecture_number': self.lecture_number,
            'course_number': self.course_number,
            'credit': self.credit,
            'professor': self.professor,
            'location': self.location,
            'time': course_time_data,
        }

    def __str__(self):
        return self.title

class Timetable(models.Model):
    title = models.CharField(max_length=64)
    semester = models.CharField(max_length=8, default="")
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

    def data(self):
        '''
        Format of data is
        {id, title, semester, course: [{id, title, color, lecture_number, course_number,
        time: [week_day, start_time, end_time]}]}
        '''
        course_data = [custom_course.data()
                       for custom_course in CustomCourse.objects.filter(timetable=self)]
        return {'id': self.id, 'title': self.title,
                'semester': self.semester, 'course': course_data}

    def data_small(self):
        return {'id': self.id, 'title': self.title, 'semester': self.semester}

class Building(models.Model):
    name = models.CharField(max_length=8, default='default')
    latitude = models.DecimalField(max_digits=16, decimal_places=8)
    longitude = models.DecimalField(max_digits=16, decimal_places=8)

    def __str__(self):
        return self.name

    def data(self):
        return {'name' : self.name,
                'lat' : self.latitude,
                'lng' : self.longitude}

    def detail_data(self, detail):
        return {'name' : self.name,
                'lat' : self.latitude,
                'lng' : self.longitude,
                'detail' : detail}

class CourseTime(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    building = models.ForeignKey(Building, on_delete=models.CASCADE)
    lectureroom = models.CharField(max_length=8, default='default')
    weekday = models.IntegerField(default=0)
    start_time = models.TimeField()
    end_time = models.TimeField()

    def data(self):
        return {'week_day': self.weekday,
                'start_time': self.start_time.hour*60
                              +self.start_time.minute,
                'end_time': self.end_time.hour*60
                            +self.end_time.minute}

class CustomCourse(models.Model):
    timetable = models.ForeignKey(Timetable, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True)
    ''' User modifiable data '''
    title = models.CharField(max_length=128, default='default')
    color = models.CharField(max_length=8, default='default')

    def set_course_time(self):
        course_time_list = CourseTime.objects.filter(course=self.course)
        for course_time in course_time_list:
            CustomCourseTime(timetable=self.timetable, course=self,
                             weekday=course_time.weekday,
                             start_time=course_time.start_time,
                             end_time=course_time.end_time,
                             building=course_time.building,
                             lectureroom=course_time.lectureroom).save()

    def set_custom_course_time(self, times):
        custom_course_time_list = CustomCourseTime.objects.filter(course=self)
        lectureroom = ''
        for time in custom_course_time_list:
            time.delete()
        for time in times:
            try:
                building=Building.objects.get(name=time['building']['name'])
                CustomCourseTime(timetable=self.timetable, course=self,
                                weekday=time['week_day'],
                                start_time=time['start_time'],
                                end_time=time['end_time'],
                                building=building,
                                detail=time['building']['detail'],
                                lectureroom=lectureroom).save()
            except (Building.DoesNotExist):
                CustomCourseTime(timetable=self.timetable, course=self,
                                weekday=time['week_day'],
                                start_time=time['start_time'],
                                end_time=time['end_time'],
                                building=Building.objects.get(id=0),
                                detail=time['building']['detail'],
                                lectureroom=lectureroom).save()


    def data(self):
        if self.course is None:
            course_time = [
                course_time.data() for course_time
                in CustomCourseTime.objects.filter(course=self, timetable=self.timetable)
            ]
            return {
                'id': self.id,
                'is_custom': True,
                'title': self.title,
                'color': self.color,
                'time': course_time
            }

        course = Course.objects.get(pk=self.course.id)
        course_time = [course_time.data() for course_time
                       in CustomCourseTime.objects.filter(course=self)]
        title = course.title if self.title == 'default' else self.title
        return {
            'id': self.id,
            'is_custom': False,
            'color': self.color,
            'title': title,
            'lecture_number': course.lecture_number,
            'course_number': course.course_number,
            'credit': course.credit,
            'professor': course.professor,
            'location': course.location,
            'time': course_time,
        }

    def __str__(self):
        return self.color

class CustomCourseTime(models.Model):
    timetable = models.ForeignKey('Timetable', on_delete=models.CASCADE)
    course = models.ForeignKey('CustomCourse', on_delete=models.CASCADE)
    building = models.ForeignKey('Building', on_delete=models.CASCADE)
    detail = models.TextField(default='')
    lectureroom = models.CharField(max_length=8, default='default')
    weekday = models.IntegerField(default=0)
    start_time = models.TimeField()
    end_time = models.TimeField()

    def data(self):
        return {'week_day': self.weekday,
                'start_time': self.start_time.hour*60
                              +self.start_time.minute,
                'end_time': self.end_time.hour*60
                            +self.end_time.minute,
                'building' : self.building.detail_data(self.detail)}
