# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-11-01 09:34
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_movies_poster'),
    ]

    operations = [
        migrations.AddField(
            model_name='collections',
            name='adult_content',
            field=models.BooleanField(default=0),
        ),
    ]
