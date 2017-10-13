from django.db import models

from api.Directors.models import Directors

class Movies(models.Model):
    title = models.CharField(max_length=1000, default="")
    release = models.IntegerField(default=0)
    directors = models.ManyToManyField(Directors, verbose_name="list_of_directors")