from django.db import models

# Create your models here.

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    photo = models.ImageField(upload_to='users/', null=True, blank=True)

    def __str__(self):
        return self.name
    
class Exercise(models.Model):
    name = models.CharField(max_length=100)
    reps = models.IntegerField()
    comment = models.TextField()

    def __str__(self):
        return self.name
    
class Routine(models.Model):
    name = models.CharField(max_length=100)
    exercises = models.ManyToManyField(Exercise)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name