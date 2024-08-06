from rest_framework import serializers
from .models import User, Exercise, Routine

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = '__all__'

class RoutineSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    exercises = ExerciseSerializer(many=True)
    class Meta:
        model = Routine
        fields = '__all__'