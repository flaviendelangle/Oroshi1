# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-10-14 13:32
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_directors_tbmcid'),
    ]

    operations = [
        migrations.RenameField(
            model_name='directors',
            old_name='tbmcId',
            new_name='tmdbId',
        ),
    ]
