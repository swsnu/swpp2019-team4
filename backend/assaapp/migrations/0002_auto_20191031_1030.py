# Generated by Django 2.2.6 on 2019-10-31 10:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assaapp', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='course',
            name='academic_year',
            field=models.IntegerField(default=-1),
        ),
        migrations.AlterField(
            model_name='course',
            name='classification',
            field=models.CharField(default='default', max_length=8),
        ),
        migrations.AlterField(
            model_name='course',
            name='college',
            field=models.CharField(default='default', max_length=32),
        ),
        migrations.AlterField(
            model_name='course',
            name='course_number',
            field=models.CharField(default='default', max_length=16),
        ),
        migrations.AlterField(
            model_name='course',
            name='credit',
            field=models.IntegerField(default=-1),
        ),
        migrations.AlterField(
            model_name='course',
            name='degree_program',
            field=models.CharField(default='default', max_length=32),
        ),
        migrations.AlterField(
            model_name='course',
            name='department',
            field=models.CharField(default='default', max_length=128),
        ),
        migrations.AlterField(
            model_name='course',
            name='lab_credit',
            field=models.IntegerField(default=-1),
        ),
        migrations.AlterField(
            model_name='course',
            name='language',
            field=models.CharField(default='default', max_length=16),
        ),
        migrations.AlterField(
            model_name='course',
            name='lecture_credit',
            field=models.IntegerField(default=-1),
        ),
        migrations.AlterField(
            model_name='course',
            name='lecture_number',
            field=models.CharField(default='default', max_length=8),
        ),
        migrations.AlterField(
            model_name='course',
            name='lecture_type',
            field=models.CharField(default='default', max_length=64),
        ),
        migrations.AlterField(
            model_name='course',
            name='location',
            field=models.CharField(default='default', max_length=128),
        ),
        migrations.AlterField(
            model_name='course',
            name='professor',
            field=models.CharField(default='default', max_length=64),
        ),
        migrations.AlterField(
            model_name='course',
            name='quota',
            field=models.CharField(default='default', max_length=16),
        ),
        migrations.AlterField(
            model_name='course',
            name='remark',
            field=models.TextField(default='default'),
        ),
        migrations.AlterField(
            model_name='course',
            name='semester',
            field=models.CharField(default='default', max_length=8),
        ),
        migrations.AlterField(
            model_name='course',
            name='status',
            field=models.CharField(default='default', max_length=8),
        ),
        migrations.AlterField(
            model_name='course',
            name='subtitle',
            field=models.CharField(default='default', max_length=128),
        ),
        migrations.AlterField(
            model_name='course',
            name='title',
            field=models.CharField(default='default', max_length=128),
        ),
        migrations.AlterField(
            model_name='coursecolor',
            name='color',
            field=models.CharField(default='default', max_length=8),
        ),
    ]