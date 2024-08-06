from django.urls import path
from .views import UserList, UserDetail, ExerciseList, ExerciseDetail, RoutineList, RoutineDetail

urlpatterns = [
    path('users/', UserList.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetail.as_view(), name='user-detail'),
    path('exercises/', ExerciseList.as_view(), name='exercise-list'),
    path('exercises/<int:pk>/', ExerciseDetail.as_view(), name='exercise-detail'),
    path('routines/', RoutineList.as_view(), name='routine-list'),
    path('routines/<int:pk>/', RoutineDetail.as_view(), name='routine-detail'),
]