from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import User, Exercise, Routine, RoutineSession, RoutineExercise, ExerciseSet

# Test for diferents models

# Test for User model
class UserTestCase(TestCase):

    # Create a new user
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(name='Test User', email='test@example', password='password')
    
    # Test for user creation
    def test_user_creation(self):
        self.assertEqual(self.user.name, 'Test User')
        self.assertEqual(self.user.email, 'test@example')
        self.assertEqual(self.user.password, 'password')
    
    # Test for user list with a petition to the API
    def test_user_list(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Test User')
        self.assertEqual(response.data[0]['email'], 'test@example')
        self.assertFalse('password' in response.data[0])
    
    # Test for user recreation with the same email. It should not work
    def test_user_recreate_same_email(self):
        response = self.client.post('/api/users/', {'name': 'Test User', 'email': 'test@example', 'password': 'password'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 1)
    
    # Test for user recreation with a different email. It should work
    def test_user_recreate(self):
        response = self.client.post('/api/users/', {'name': 'Test User', 'email': 'test1@example.com', 'password': 'password'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)

    # Test for update user
    def test_user_update(self):
        response = self.client.put(f'/api/users/{self.user.id}/', {'name': 'Test User Updated', 'email': 'test1@example.com', 'password': 'password'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.name, 'Test User Updated')
        self.assertEqual(self.user.email, 'test1@example.com')
        self.assertEqual(self.user.password, 'password')
    
    # Test for delete user
    def test_user_delete(self):
        response = self.client.delete(f'/api/users/{self.user.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(User.objects.count(), 0)

# Test for Exercise model
class ExerciseTestCase(TestCase):

    # Create a new exercise
    def setUp(self):
        self.client = APIClient()
        self.exercise = Exercise.objects.create(name='Test Exercise', comment='Test Comment')

    # Test for exercise creation
    def test_exercise_creation(self):
        self.assertEqual(self.exercise.name, 'Test Exercise')
        self.assertEqual(self.exercise.comment, 'Test Comment')

    # Test for exercise list with a petition to the API
    def test_exercise_list(self):
        response = self.client.get('/api/exercises/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Test Exercise')
        self.assertEqual(response.data[0]['comment'], 'Test Comment')

    # Test for create a new exercise with a petition to the API
    def test_exercise_recreate(self):
        response = self.client.post('/api/exercises/', {'name': 'Test Exercise', 'comment': 'Test Comment'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Exercise.objects.count(), 2)

    # Test for update exercise
    def test_exercise_update(self):
        response = self.client.put(f'/api/exercises/{self.exercise.id}/', {'name': 'Test Exercise Updated', 'comment': 'Test Comment Updated'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.exercise.refresh_from_db()
        self.assertEqual(self.exercise.name, 'Test Exercise Updated')
        self.assertEqual(self.exercise.comment, 'Test Comment Updated')

    # Test for delete exercise
    def test_exercise_delete(self):
        response = self.client.delete(f'/api/exercises/{self.exercise.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Exercise.objects.count(), 0)

# Test for Routine model
class RoutineTestCase(TestCase):
    
        # Create a new routine
        def setUp(self):
            self.client = APIClient()
            self.user = User.objects.create(name='Test User', email='test@example', password='password')
            self.routine = Routine.objects.create(name='Test Routine', user=self.user)
    
        # Test for routine creation
        def test_routine_creation(self):
            self.assertEqual(self.routine.name, 'Test Routine')
            self.assertEqual(self.routine.user, self.user)
    
        # Test for routine list with a petition to the API
        def test_routine_list(self):
            response = self.client.get('/api/routines/')
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(len(response.data), 1)
            self.assertEqual(response.data[0]['name'], 'Test Routine')
            self.assertEqual(response.data[0]['user'], self.user.id)
    
        # Test for create a new routine with a petition to the API
        def test_routine_recreate(self):
            response = self.client.post('/api/routines/', {'name': 'Test Routine', 'user': self.user.id}, format='json')
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            self.assertEqual(Routine.objects.count(), 2)
    
        # Test for update routine
        def test_routine_update(self):
            response = self.client.put(f'/api/routines/{self.routine.id}/', {'name': 'Test Routine Updated', 'user': self.user.id}, format='json')
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.routine.refresh_from_db()
            self.assertEqual(self.routine.name, 'Test Routine Updated')
    
        # Test for delete routine
        def test_routine_delete(self):
            response = self.client.delete(f'/api/routines/{self.routine.id}/')
            self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
            self.assertEqual(Routine.objects.count(), 0)

# Test for RoutineSession model
class RoutineSessionTestCase(TestCase):

    # Create a new routine session
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(name='Test User', email='test@example', password='password')
        self.routine = Routine.objects.create(name='Test Routine', user=self.user)
        self.routine_session = RoutineSession.objects.create(routine=self.routine)

    # Test for routine session creation
    def test_routine_session_creation(self):
        self.assertEqual(self.routine_session.routine, self.routine)
    
    # Test for routine session list with a petition to the API
    def test_routine_session_list(self):
        response = self.client.get('/api/routine-sessions/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['routine'], self.routine.id)
        self.assertEqual(response.data[0]['date'], '2024-08-08')
    
    # Test for create a new routine session with a petition to the API
    def test_routine_session_recreate(self):
        response = self.client.post('/api/routine-sessions/', {'routine': self.routine.id}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(RoutineSession.objects.count(), 2)

    # Test for update routine session
    def test_routine_session_update(self):
        response = self.client.put(f'/api/routine-sessions/{self.routine_session.id}/', {'routine': self.routine.id}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.routine_session.refresh_from_db()
        self.assertEqual(self.routine_session.routine, self.routine)

    # Test for delete routine session
    def test_routine_session_delete(self):
        response = self.client.delete(f'/api/routine-sessions/{self.routine_session.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(RoutineSession.objects.count(), 0)

# Test for RoutineExercise model
class RoutineExerciseTestCase(TestCase):

    # Create a new routine exercise
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(name='Test User', email='test@example', password='password')
        self.exercise = Exercise.objects.create(name='Test Exercise', comment='Test Comment')
        self.routine = Routine.objects.create(name='Test Routine', user=self.user)
        self.routine_exercise = RoutineExercise.objects.create(routine=self.routine, exercise=self.exercise, sets=3)
    
    # Test for routine exercise creation
    def test_routine_exercise_creation(self):
        self.assertEqual(self.routine_exercise.routine, self.routine)
        self.assertEqual(self.routine_exercise.exercise, self.exercise)
        self.assertEqual(self.routine_exercise.sets, 3)

    # Test for routine exercise list with a petition to the API
    def test_routine_exercise_list(self):
        response = self.client.get('/api/routine-exercises/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['routine'], self.routine.id)
        self.assertEqual(response.data[0]['exercise_detail']['name'], 'Test Exercise')
        self.assertEqual(response.data[0]['sets'], 3)

    # Test for create a new routine exercise with a petition to the API
    def test_routine_exercise_recreate(self):
        response = self.client.post('/api/routine-exercises/', {'routine': self.routine.id, 'exercise': self.exercise.id, 'sets': 3}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(RoutineExercise.objects.count(), 2)
    
    # Test for update routine exercise
    def test_routine_exercise_update(self):
        response = self.client.put(f'/api/routine-exercises/{self.routine_exercise.id}/', {'routine': self.routine.id, 'exercise': self.exercise.id, 'sets': 4}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.routine_exercise.refresh_from_db()
        self.assertEqual(self.routine_exercise.sets, 4)
    
    # Test for delete routine exercise
    def test_routine_exercise_delete(self):
        response = self.client.delete(f'/api/routine-exercises/{self.routine_exercise.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(RoutineExercise.objects.count(), 0)
        
# Test for ExerciseSet model
class ExerciseSetTestCase(TestCase):
    
    # Create a new exercise set
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(name='Test User', email='test@example', password='password')
        self.exercise = Exercise.objects.create(name='Test Exercise', comment='Test Comment')
        self.routine = Routine.objects.create(name='Test Routine', user=self.user)
        self.routine_session = RoutineSession.objects.create(routine=self.routine)
        self.exercise_set = ExerciseSet.objects.create(routine_session=self.routine_session, exercise=self.exercise, set_number=1, reps=10, weight=20, rir=2)

    # Test for exercise set creation
    def test_exercise_set_creation(self):
        self.assertEqual(self.exercise_set.routine_session, self.routine_session)
        self.assertEqual(self.exercise_set.exercise, self.exercise)
        self.assertEqual(self.exercise_set.set_number, 1)
        self.assertEqual(self.exercise_set.reps, 10)
        self.assertEqual(self.exercise_set.weight, 20)
        self.assertEqual(self.exercise_set.rir, 2)

    # Test for exercise set list with a petition to the API
    def test_exercise_set_list(self):
        response = self.client.get('/api/exercise-sets/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['routine_session'], self.routine_session.id)
        self.assertEqual(response.data[0]['exercise_detail']['name'], 'Test Exercise')
        self.assertEqual(response.data[0]['set_number'], 1)
        self.assertEqual(response.data[0]['reps'], 10)
        self.assertEqual(response.data[0]['weight'], 20)
        self.assertEqual(response.data[0]['rir'], 2)

    # Test for create a new exercise set with a petition to the API
    def test_exercise_set_recreate(self):
        response = self.client.post('/api/exercise-sets/', {'routine_session': self.routine_session.id, 'exercise': self.exercise.id, 'set_number': 1, 'reps': 10, 'weight': 20, 'rir': 2}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ExerciseSet.objects.count(), 2)

    # Test for update exercise set
    def test_exercise_set_update(self):
        response = self.client.put(f'/api/exercise-sets/{self.exercise_set.id}/', {'routine_session': self.routine_session.id, 'exercise': self.exercise.id, 'set_number': 1, 'reps': 10, 'weight': 20, 'rir': 3}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.exercise_set.refresh_from_db()
        self.assertEqual(self.exercise_set.rir, 3)

    # Test for delete exercise set
    def test_exercise_set_delete(self):
        response = self.client.delete(f'/api/exercise-sets/{self.exercise_set.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(ExerciseSet.objects.count(), 0)


