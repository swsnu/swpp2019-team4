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
                'timetable_main': self.timetable_main.id}

    def data_small(self):
        return {'id': self.id, 'email': self.email, 'username': self.username}

class Course(models.Model):
    semester = models.CharField(max_length=8, default='default')
    classification = models.CharField(max_length=8, default='default')
    college = models.CharField(max_length=32, default='default')
    department = models.CharField(max_length=128, default='default')
    degree_program = models.CharField(max_length=32, default='default')
    academic_year = models.IntegerField(default=-1)
    course_number = models.CharField(max_length=16, default='default')
    lecture_number = models.CharField(max_length=8, default='default')
    title = models.CharField(max_length=128, default='default')
    subtitle = models.CharField(max_length=128, default='default')
    credit = models.IntegerField(default=-1)
    lecture_credit = models.IntegerField(default=-1)
    lab_credit = models.IntegerField(default=-1)
    lecture_type = models.CharField(max_length=64, default='default')
    location = models.CharField(max_length=128, default='default')
    professor = models.CharField(max_length=64, default='default')
    quota = models.CharField(max_length=16, default='default')
    remark = models.TextField(default='default')
    language = models.CharField(max_length=16, default='default')
    status = models.CharField(max_length=8, default='default')

    def __str__(self):
        return self.title

class Timetable(models.Model):
    title = models.CharField(max_length=64)
    semester = models.CharField(max_length=8, default="")
    courses = models.ManyToManyField(Course, related_name='timetables', through='CourseColor')
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

class CourseColor(models.Model):
    timetable = models.ForeignKey(Timetable, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    color = models.CharField(max_length=8, default='default')

    def __str__(self):
        return self.color

class CourseTime(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    weekday = models.IntegerField(default=0)
    start_time = models.TimeField()
    end_time = models.TimeField()
