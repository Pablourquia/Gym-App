from rest_framework import viewsets
from .models import User, Exercise, Routine, RoutineSession, RoutineExercise, ExerciseSet
from .serializers import UserSerializer, ExerciseSerializer, RoutineSerializer, RoutineSessionSerializer, ExerciseSetSerializer, RoutineExerciseSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password, make_password

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


# View for user login
class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        if check_password(password, user.password):
            serializer = UserSerializer(user)
            return Response(serializer.data)
        else:
            return Response({'error': 'Incorrect password'}, status=status.HTTP_401_UNAUTHORIZED)

# View for user registration
class RegisterView(APIView):
    def post(self, request):
        name = request.data.get('name')
        email = request.data.get('email')
        password = request.data.get('password')
        photo = request.data.get('photo')
        if User.objects.filter(email=email).exists():
            return Response({'error': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = User(name=name, email=email, password=make_password(password), photo=photo)
        user.save()
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# View for user routines
class UserRoutinesView(APIView):
    # Get all routines for a user
    def get(self, request, user_id):
        try: 
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        routines = Routine.objects.filter(user=user)
        serializer = RoutineSerializer(routines, many=True)
        return Response(serializer.data)
    
    # Post a new routine for a user
    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        name = request.data.get('name')
        routine = Routine(name=name, user=user)
        # If a routine with the same name already exists for the user, return an error
        if Routine.objects.filter(user=user, name=name).exists():
            return Response({'error': 'Routine already exists'}, status=status.HTTP_400_BAD_REQUEST)
        routine.save()
        return Response({'id': routine.id, 'name': routine.name, 'user': routine.user.id}, status=status.HTTP_201_CREATED)

# View for routine exercises
class RoutineExercisesView(APIView):
    # Post a new exercise for a routine
    def post(self, request, routine_id):
        try:
            routine = Routine.objects.get(id=routine_id)
        except Routine.DoesNotExist:
            return Response({'error': 'Routine does not exist'}, status=status.HTTP_404_NOT_FOUND)

        try:
            exercise_id = request.data.get('exercise')
            exercise = Exercise.objects.get(id=exercise_id)
        except Exercise.DoesNotExist:
            return Response({'error': 'Exercise does not exist'}, status=status.HTTP_404_NOT_FOUND)

        exercise_name = exercise.name
        exercises_ids_for_name = Exercise.objects.filter(name=exercise_name).values_list('id', flat=True)
    
        if exercises_ids_for_name:
            if RoutineExercise.objects.filter(routine=routine, exercise_id__in=exercises_ids_for_name).exists():
                return Response({'error': 'Exercise already exists for the routine'}, status=status.HTTP_400_BAD_REQUEST)

        sets = request.data.get('sets')
        routine_exercise = RoutineExercise(routine=routine, exercise_id=exercise_id, sets=sets)
        routine_exercise.save()
        return Response({'id': routine_exercise.id, 'routine': routine_exercise.routine.id, 'exercise': routine_exercise.exercise.id, 'sets': routine_exercise.sets}, status=status.HTTP_201_CREATED)
    
    # Delete an exercise from a routine
    def delete(self, request, routine_id, exercise_id):
        try:
            routine = Routine.objects.get(id=routine_id)
        except Routine.DoesNotExist:
            return Response({'error': 'Routine does not exist'}, status=status.HTTP_404_NOT_FOUND)

        try:
            exercise = Exercise.objects.get(id=exercise_id)
        except Exercise.DoesNotExist:
            return Response({'error': 'Exercise does not exist'}, status=status.HTTP_404_NOT_FOUND)

        try:
            routine_exercise = RoutineExercise.objects.get(routine=routine, exercise=exercise)
        except RoutineExercise.DoesNotExist:
            return Response({'error': 'Exercise not associated with this routine'}, status=status.HTTP_404_NOT_FOUND)

        routine_exercise.delete()
        return Response({'message': 'Exercise removed successfully'}, status=status.HTTP_204_NO_CONTENT)

# View for routine sessions
class RoutineSessionsView(APIView):
    # Get all routine sessions for a specific routine
    def get(self, request):
        routine = request.query_params.get('routine')
        sessions = RoutineSession.objects.filter(routine_id=routine)
        serializer = RoutineSessionSerializer(sessions, many=True)
        return Response(serializer.data)
    
    # Post a new routine session
    def post(self, request):
        routine_id = request.data.get('routine')
        try:
            routine = Routine.objects.get(id=routine_id)
        except Routine.DoesNotExist:
            return Response({'error': 'Routine does not exist'}, status=status.HTTP_404_NOT_FOUND)
        session = RoutineSession(routine=routine)
        session.save()
        return Response({'id': session.id, 'routine': session.routine.id, 'date': session.date}, status=status.HTTP_201_CREATED)

# View for exercise sets
class RoutineSessionSetsView(APIView):
    # Get all sets for a specific routine session
    def get(self, request, session_id):
        try:
            session = RoutineSession.objects.get(id=session_id)
        except RoutineSession.DoesNotExist:
            return Response({'error': 'Routine session does not exist'}, status=status.HTTP_404_NOT_FOUND)
        sets = ExerciseSet.objects.filter(routine_session=session)
        serializer = ExerciseSetSerializer(sets, many=True)
        return Response(serializer.data)
    
    # Post a new set for a specific routine session
    def post(self, request, session_id):
        try:
            session = RoutineSession.objects.get(id=session_id)
        except RoutineSession.DoesNotExist:
            return Response({'error': 'Routine session does not exist'}, status=status.HTTP_404_NOT_FOUND)
        exercise = request.data.get('exercise')
        set_number = request.data.get('set_number')
        reps = request.data.get('reps')
        weight = request.data.get('weight')
        rir = request.data.get('rir')
        if ExerciseSet.objects.filter(routine_session=session, exercise=exercise, set_number=set_number).exists():
            exercise_set = ExerciseSet.objects.get(routine_session=session, exercise=exercise, set_number=set_number)
            exercise_set.reps = reps
            exercise_set.weight = weight
            exercise_set.rir = rir
            exercise_set.save()
            return Response({'id': exercise_set.id, 'routine_session': exercise_set.routine_session.id, 'exercise': exercise_set.exercise.id, 'set_number': exercise_set.set_number, 'reps': exercise_set.reps, 'weight': exercise_set.weight, 'rir': exercise_set.rir}, status=status.HTTP_200_OK)
        exercise_set = ExerciseSet(routine_session=session, exercise_id=exercise, set_number=set_number, reps=reps, weight=weight, rir=rir)
        exercise_set.save()
        return Response({'id': exercise_set.id, 'routine_session': exercise_set.routine_session.id, 'exercise': exercise_set.exercise.id, 'set_number': exercise_set.set_number, 'reps': exercise_set.reps, 'weight': exercise_set.weight, 'rir': exercise_set.rir}, status=status.HTTP_201_CREATED)