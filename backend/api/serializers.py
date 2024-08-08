from rest_framework import serializers
from .models import User, Exercise, Routine, RoutineSession, RoutineExercise, ExerciseSet

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'password', 'photo']
        extra_kwargs = {'password': {'write_only': True}}

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['id', 'name', 'comment']

class RoutineExerciseSerializer(serializers.ModelSerializer):
    exercise = serializers.PrimaryKeyRelatedField(queryset=Exercise.objects.all())  # Para aceptar IDs de Exercise
    exercise_detail = ExerciseSerializer(source='exercise', read_only=True)  # Para mostrar detalles del Exercise en la respuesta

    class Meta:
        model = RoutineExercise
        fields = ['id', 'routine', 'exercise', 'exercise_detail', 'sets']

class RoutineSerializer(serializers.ModelSerializer):
    exercises = RoutineExerciseSerializer(source='routineexercise_set', many=True, read_only=True)

    class Meta:
        model = Routine
        fields = ['id', 'name', 'user', 'exercises']

class RoutineSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoutineSession
        fields = ['id', 'routine', 'date']

class ExerciseSetSerializer(serializers.ModelSerializer):
    exercise_detail = ExerciseSerializer(source='exercise', read_only=True)  # Para mostrar detalles del Exercise
    class Meta:
        model = ExerciseSet
        fields = ['id', 'routine_session', 'exercise', 'exercise_detail', 'set_number', 'reps', 'weight', 'rir']



