# Generated by Django 2.2.6 on 2019-12-12 07:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assaapp', '0002_auto_20191204_1955'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='last_recommend_page',
            field=models.IntegerField(default=0),
        ),
    ]