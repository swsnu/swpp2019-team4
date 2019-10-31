from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser

class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None, grade=1, department=''):
        if not email:
            raise ValueError('User must have an email address')
        
        user = self.model(
            email=self.normalize_email(email),
            username=username,
            grade=grade,
            department=department,
        )

        user.set_password(password)
        user.save(using=self._db)
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
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    email = models.EmailField(verbose_name='email', max_length=255, unique=True)
    username = models.CharField(max_length=32)
    grade = models.IntegerField()
    department = models.CharField(max_length=64)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return True
    
    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin

class Course(models.Model):
    semester = models.CharField(max_length=8, default="")
    classification = models.CharField(max_length=8, default="")
    college = models.CharField(max_length=16, default="")
    department = models.CharField(max_length=32, default="")
    degree_program = models.CharField(max_length=16, default="")
    academic_year = models.IntegerField(default=0)
    course_number = models.CharField(max_length=8, default="")
    lecture_number = models.CharField(max_length=8, default="")
    title = models.CharField(max_length=256, default="")
    subtitle = models.CharField(max_length=256, default="")
    credit = models.IntegerField(default=0)
    lecture_credit = models.IntegerField(default=0)
    lab_credit = models.IntegerField(default=0)
    lecture_type = models.CharField(max_length=32, default="")
    location = models.CharField(max_length=32, default="")
    professor = models.CharField(max_length=16, default="")
    quota = models.CharField(max_length=16, default="")
    remark = models.TextField(default="")
    language = models.CharField(max_length=16, default="")
    status = models.CharField(max_length=16, default="")

    def __str__(self):
        return self.title

class Timetable(models.Model):
    title = models.CharField(max_length=64)
    semester = models.IntegerField(default = 0)
    courses = models.ManyToManyField(Course, related_name = 'timetables', through = 'CourseColor')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    

    def __str__(self):
        return self.title
class CourseColor(models.Model):
    timetable = models.ForeignKey(Timetable, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    color = models.CharField(max_length=8, default = '#FFFFFF')

    def __str__(self):
        return self.color

class CourseTime(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    weekday = models.IntegerField(default=0)
    start_time = models.TimeField()
    end_time = models.TimeField()