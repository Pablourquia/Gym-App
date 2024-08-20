import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, tap, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { map } from 'rxjs/operators';

interface Session {
  id: number;
  routine: number;
  date: Date;
}

interface ExerciseDetail {
  id: number;
  name: string;
  comment: string;
}

interface Exercise {
  id: number;
  routine: number;
  exercise: number;
  exercise_detail: ExerciseDetail;
  sets: number;
}

interface Routine {
  id: number;
  name: string;
  user: number;
  exercises: Exercise[];
}

@Injectable({
  providedIn: 'root'
})
export class RoutineService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  createRoutine(routine: {'name': string, 'user': number}): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/${routine.user}/routines/`, routine, { observe: 'response' }).pipe(
      tap((response: HttpResponse<any>) => {
        if (response.status === 201) {
          console.log('Routine created successfully');
        } else {
          throw new Error(response.body?.message || 'Unknown error');
        }
      })
    );
  }

  getRoutines(user_id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${user_id}/routines/`);
  }

  addExercise(exercise: { name: string, comment: string }, routine_id: number, sets: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/exercises/`, exercise, { observe: 'response' }).pipe(
      switchMap((exerciseResponse: HttpResponse<any>) => {
        if (exerciseResponse.status === 201) {
          console.log('Exercise created successfully');
          const exerciseId = exerciseResponse.body.id;
  
          return this.http.post<any>(
            `${this.apiUrl}/routines/${routine_id}/exercises/`,
            { exercise: exerciseId, sets },
            { observe: 'response' }
          );
        } else {
          throw new Error(exerciseResponse.body?.message || 'Failed to create exercise');
        }
      }),
      tap((routineExerciseResponse: HttpResponse<any>) => {
        if (routineExerciseResponse.status === 201) {
          console.log('Exercise added to routine successfully');
        } else {
          throw new Error(routineExerciseResponse.body?.message || 'Failed to add exercise to routine');
        }
      })
    );
  }
  
  getExercises(routine_id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/routine-exercises/`)
      .pipe(
        map(exercises => exercises.filter(exercise => exercise.routine === routine_id))
      );
  }

  createRoutineSession(routine_id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/routine-sessions/`, { routine: routine_id }, { observe: 'response' }).pipe(
      tap((response: HttpResponse<any>) => {
        if (response.status === 201) {
          console.log('Routine session created successfully');
        } else {
          throw new Error(response.body?.message || 'Unknown error');
        }
      })
    );
  }

  getSessions(user_id: number): Observable<any[]> {
    let sessions = this.http.get<any[]>(`${this.apiUrl}/routine-sessions/`);
    let routines = this.getRoutines(user_id);
    return forkJoin([sessions, routines]).pipe(
      map(([sessions, routines]: [Session[], Routine[]]) => {
        return sessions.filter(session =>
          routines.some(routine => routine.id === session.routine)
        );
      })
    );
  }

  deleteSession(session_id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/routine-sessions/${session_id}/`, { observe: 'response' }).pipe(
      tap((response: HttpResponse<any>) => {
        if (response.status === 204) {
          console.log('Session deleted successfully');
        } else {
          throw new Error(response.body?.message || 'Unknown error');
        }
      })
    );
  }

  deleteRoutine(routine_id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/routines/${routine_id}/`, { observe: 'response' }).pipe(
      tap((response: HttpResponse<any>) => {
        if (response.status === 204) {
          console.log('Routine deleted successfully');
        } else {
          throw new Error(response.body?.message || 'Unknown error');
        }
      })
    );
  }

  deleteExerciseAndRemoveFromRoutine(routine_id: number, exercise_id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/routines/${routine_id}/exercises/${exercise_id}/`, { observe: 'response' }).pipe(
      switchMap((routineExerciseResponse: HttpResponse<any>) => {
        if (routineExerciseResponse.status === 204) {
          console.log('Exercise removed from routine successfully');
          
          return this.http.delete<any>(`${this.apiUrl}/exercises/${exercise_id}/`, { observe: 'response' });
        } else {
          throw new Error(routineExerciseResponse.body?.message || 'Failed to remove exercise from routine');
        }
      }),
      tap((exerciseResponse: HttpResponse<any>) => {
        if (exerciseResponse.status === 204) {
          console.log('Exercise deleted successfully');
        } else {
          throw new Error(exerciseResponse.body?.message || 'Failed to delete exercise');
        }
      })
    );
  }
  
}
