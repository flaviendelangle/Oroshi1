from django.db import models

class Directors(models.Model):
    name = models.CharField(max_length=1000, default="")
    tmdbId = models.IntegerField(default=0)
