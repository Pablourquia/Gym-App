from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('users', views.UserViewSet)
router.register('exercises', views.ExerciseViewSet)
router.register('routines', views.RoutineViewSet)
router.register('routine-sessions', views.RoutineSessionViewSet)
router.register('routine-exercises', views.RoutineExerciseViewSet)
router.register('exercise-sets', views.ExerciseSetViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', views.LoginView.as_view(), name='login'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('users/<int:user_id>/routines/', views.UserRoutinesView.as_view(), name='user-routines'),
    path('routines/<int:routine_id>/exercises/', views.RoutineExercisesView.as_view(), name='routine-exercises'),
    path('routine-sessions/', views.RoutineSessionsView.as_view(), name='routine-sessions'),
    path('routine-sessions/<int:session_id>/sets/', views.RoutineSessionSetsView.as_view(), name='routine-session-sets'),
    
]