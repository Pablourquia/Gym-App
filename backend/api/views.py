from rest_framework import viewsets
from .models import User, Exercise, Routine, RoutineSession, RoutineExercise, ExerciseSet
from .serializers import UserSerializer, ExerciseSerializer, RoutineSerializer, RoutineSessionSerializer, ExerciseSetSerializer, RoutineExerciseSerializer

# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer

class RoutineViewSet(viewsets.ModelViewSet):
    queryset = Routine.objects.all()
    serializer_class = RoutineSerializer

class RoutineSessionViewSet(viewsets.ModelViewSet):
    queryset = RoutineSession.objects.all()
    serializer_class = RoutineSessionSerializer

class ExerciseSetViewSet(viewsets.ModelViewSet):
    queryset = ExerciseSet.objects.all()
    serializer_class = ExerciseSetSerializer

class RoutineExerciseViewSet(viewsets.ModelViewSet):
    queryset = RoutineExercise.objects.all()
    serializer_class = RoutineExerciseSerializer
