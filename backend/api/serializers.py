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
    exercise = ExerciseSerializer()

    class Meta:
        model = RoutineExercise
        fields = ['id', 'routine', 'exercise', 'sets']

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
    class Meta:
        model = ExerciseSet
        fields = ['id', 'routine_session', 'exercise', 'set_number', 'reps', 'weight', 'rir']



