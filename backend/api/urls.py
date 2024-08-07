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
]