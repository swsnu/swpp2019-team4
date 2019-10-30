# Generated by Django 2.2.5 on 2019-10-30 11:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('assaapp', '0002_timetable'),
    ]

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('semester', models.CharField(default='', max_length=8)),
                ('classification', models.CharField(default='', max_length=8)),
                ('college', models.CharField(default='', max_length=16)),
                ('department', models.CharField(default='', max_length=32)),
                ('degree_program', models.CharField(default='', max_length=16)),
                ('academic_year', models.IntegerField(default=0)),
                ('course_number', models.CharField(default='', max_length=8)),
                ('lecture_number', models.CharField(default='', max_length=8)),
                ('title', models.CharField(default='', max_length=256)),
                ('subtitle', models.CharField(default='', max_length=256)),
                ('credit', models.IntegerField(default=0)),
                ('lecture_credit', models.IntegerField(default=0)),
                ('lab_credit', models.IntegerField(default=0)),
                ('lecture_type', models.CharField(default='', max_length=32)),
                ('location', models.CharField(default='', max_length=32)),
                ('professor', models.CharField(default='', max_length=16)),
                ('quota', models.CharField(default='', max_length=16)),
                ('remark', models.TextField(default='')),
                ('language', models.CharField(default='', max_length=16)),
                ('status', models.CharField(default='', max_length=16)),
            ],
        ),
        migrations.AddField(
            model_name='timetable',
            name='semester',
            field=models.IntegerField(default=0),
        ),
        migrations.CreateModel(
            name='Timetable_Course',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='assaapp.Course')),
                ('timetable', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='assaapp.Timetable')),
            ],
        ),
        migrations.CreateModel(
            name='Course_Time',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('weekday', models.IntegerField(default=0)),
                ('start_time', models.TimeField()),
                ('end_time', models.TimeField()),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='assaapp.Course')),
            ],
        ),
    ]