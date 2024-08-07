from django.db import models

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    photo = models.ImageField(upload_to='users/', null=True, blank=True)

    def __str__(self):
        return self.name
    
class Exercise(models.Model):
    name = models.CharField(max_length=100)
    comment = models.TextField()

    def __str__(self):
        return self.name

class Routine(models.Model):
    name = models.CharField(max_length=100)
    exercises = models.ManyToManyField(Exercise, through='RoutineExercise')
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class RoutineSession(models.Model):
    routine = models.ForeignKey(Routine, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.routine.name} on {self.date}"

class RoutineExercise(models.Model):
    routine = models.ForeignKey(Routine, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    sets = models.IntegerField()

    def __str__(self):
        return f"{self.routine.name} - {self.exercise.name}"

class ExerciseSet(models.Model):
    routine_session = models.ForeignKey(RoutineSession, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    set_number = models.IntegerField()
    reps = models.IntegerField()
    weight = models.FloatField()
    rir = models.IntegerField()

    def __str__(self):
        return f"{self.exercise.name} - Set {self.set_number} ({self.reps} reps, {self.weight} kg, {self.rir} RIR)"

