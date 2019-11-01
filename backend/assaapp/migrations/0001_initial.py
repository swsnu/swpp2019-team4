# Generated by Django 2.2.6 on 2019-11-01 09:25

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('email', models.EmailField(max_length=255, unique=True, verbose_name='email')),
                ('username', models.CharField(max_length=32)),
                ('grade', models.IntegerField()),
                ('department', models.CharField(max_length=64)),
                ('is_active', models.BooleanField(default=False)),
                ('is_admin', models.BooleanField(default=False)),
                ('friends', models.ManyToManyField(related_name='_user_friends_+', to=settings.AUTH_USER_MODEL)),
                ('friends_request', models.ManyToManyField(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('semester', models.CharField(default='default', max_length=8)),
                ('classification', models.CharField(default='default', max_length=8)),
                ('college', models.CharField(default='default', max_length=32)),
                ('department', models.CharField(default='default', max_length=128)),
                ('degree_program', models.CharField(default='default', max_length=32)),
                ('academic_year', models.IntegerField(default=-1)),
                ('course_number', models.CharField(default='default', max_length=16)),
                ('lecture_number', models.CharField(default='default', max_length=8)),
                ('title', models.CharField(default='default', max_length=128)),
                ('subtitle', models.CharField(default='default', max_length=128)),
                ('credit', models.IntegerField(default=-1)),
                ('lecture_credit', models.IntegerField(default=-1)),
                ('lab_credit', models.IntegerField(default=-1)),
                ('lecture_type', models.CharField(default='default', max_length=64)),
                ('location', models.CharField(default='default', max_length=128)),
                ('professor', models.CharField(default='default', max_length=64)),
                ('quota', models.CharField(default='default', max_length=16)),
                ('remark', models.TextField(default='default')),
                ('language', models.CharField(default='default', max_length=16)),
                ('status', models.CharField(default='default', max_length=8)),
            ],
        ),
        migrations.CreateModel(
            name='CourseColor',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('color', models.CharField(default='default', max_length=8)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='assaapp.Course')),
            ],
        ),
        migrations.CreateModel(
            name='Timetable',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=64)),
                ('semester', models.IntegerField(default=0)),
                ('courses', models.ManyToManyField(related_name='timetables', through='assaapp.CourseColor', to='assaapp.Course')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='CourseTime',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('weekday', models.IntegerField(default=0)),
                ('start_time', models.TimeField()),
                ('end_time', models.TimeField()),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='assaapp.Course')),
            ],
        ),
        migrations.AddField(
            model_name='coursecolor',
            name='timetable',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='assaapp.Timetable'),
        ),
        migrations.AddField(
            model_name='user',
            name='timetable_main',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='user_main', to='assaapp.Timetable'),
        ),
    ]
