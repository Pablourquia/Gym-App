import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RoutineService } from './routine.service';
import { of, throwError } from 'rxjs';

describe('RoutineService', () => {
  let service: RoutineService;
  let httpMock: HttpTestingController;

  const apiUrl = "https://paburq.pythonanywhere.com/api";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RoutineService]
    });

    service = TestBed.inject(RoutineService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createRoutine', () => {
    it('should create a routine and handle response correctly', () => {
      const routine = { name: 'Morning Routine', user: 1 };
      const response = { id: 1 };

      service.createRoutine(routine).subscribe(resp => {
        expect(resp).toEqual(response);
      });

      const req = httpMock.expectOne(`${apiUrl}/users/1/routines/`);
      expect(req.request.method).toBe('POST');
      req.flush(response, { status: 201, statusText: 'Created' });
    });

    it('should handle errors properly', () => {
      const routine = { name: 'Morning Routine', user: 1 };

      service.createRoutine(routine).subscribe({
        error: (error) => {
          expect(error.message).toBe('Unknown error');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/users/1/routines/`);
      expect(req.request.method).toBe('POST');
      req.flush({ message: 'Some error' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getRoutines', () => {
    it('should retrieve routines for a user', () => {
      const userId = 1;
      const routines = [{ id: 1, name: 'Morning Routine', user: userId, exercises: [] }];

      service.getRoutines(userId).subscribe(resp => {
        expect(resp).toEqual(routines);
      });

      const req = httpMock.expectOne(`${apiUrl}/users/1/routines/`);
      expect(req.request.method).toBe('GET');
      req.flush(routines);
    });
  });

  describe('addExercise', () => {
    it('should add an exercise to a routine', () => {
      const exercise = { name: 'Push-ups', comment: 'Upper body workout' };
      const routineId = 1;
      const exerciseResponse = { id: 1 };
      const routineExerciseResponse = { status: 201 };

      service.addExercise(exercise, routineId, 3).subscribe(resp => {
        expect(resp.status).toBe(201);
      });

      const req1 = httpMock.expectOne(`${apiUrl}/exercises/`);
      expect(req1.request.method).toBe('POST');
      req1.flush(exerciseResponse, { status: 201, statusText: 'Created' });

      const req2 = httpMock.expectOne(`${apiUrl}/routines/1/exercises/`);
      expect(req2.request.method).toBe('POST');
      req2.flush(routineExerciseResponse, { status: 201, statusText: 'Created' });
    });

    it('should handle errors while adding exercise', () => {
      const exercise = { name: 'Push-ups', comment: 'Upper body workout' };
      const routineId = 1;

      service.addExercise(exercise, routineId, 3).subscribe({
        error: (error) => {
          expect(error.message).toBe('Failed to create exercise');
        }
      });

      const req1 = httpMock.expectOne(`${apiUrl}/exercises/`);
      expect(req1.request.method).toBe('POST');
      req1.flush({ message: 'Some error' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getExercises', () => {
    it('should retrieve exercises for a routine', () => {
      const routineId = 1;
      const exercises = [{ id: 1, routine: routineId, exercise: 1, exercise_detail: { id: 1, name: 'Push-ups', comment: 'Upper body' }, sets: 3 }];

      service.getExercises(routineId).subscribe(resp => {
        expect(resp).toEqual(exercises);
      });

      const req = httpMock.expectOne(`${apiUrl}/routine-exercises/`);
      expect(req.request.method).toBe('GET');
      req.flush(exercises);
    });
  });

  describe('createRoutineSession', () => {
    it('should create a routine session', () => {
      const routineId = 1;
      const response = { id: 1 };

      service.createRoutineSession(routineId).subscribe(resp => {
        expect(resp).toEqual(response);
      });

      const req = httpMock.expectOne(`${apiUrl}/routine-sessions/`);
      expect(req.request.method).toBe('POST');
      req.flush(response, { status: 201, statusText: 'Created' });
    });

    it('should handle errors during routine session creation', () => {
      const routineId = 1;

      service.createRoutineSession(routineId).subscribe({
        error: (error) => {
          expect(error.message).toBe('Unknown error');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/routine-sessions/`);
      expect(req.request.method).toBe('POST');
      req.flush({ message: 'Some error' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getSessions', () => {
    it('should retrieve sessions for a user', () => {
      const userId = 1;
      const sessions = [{ id: 1, routine: 1, date: new Date() }];
      const routines = [{ id: 1, name: 'Morning Routine', user: userId, exercises: [] }];

      service.getSessions(userId).subscribe(resp => {
        expect(resp).toEqual(sessions);
      });

      const req1 = httpMock.expectOne(`${apiUrl}/routine-sessions/`);
      expect(req1.request.method).toBe('GET');
      req1.flush(sessions);

      const req2 = httpMock.expectOne(`${apiUrl}/users/1/routines/`);
      expect(req2.request.method).toBe('GET');
      req2.flush(routines);
    });
  });

  describe('getSession', () => {
    it('should retrieve a specific session', () => {
      const sessionId = 1;
      const session = { id: sessionId, routine: 1, date: new Date() };

      service.getSession(sessionId).subscribe(resp => {
        expect(resp).toEqual(session);
      });

      const req = httpMock.expectOne(`${apiUrl}/routine-sessions/${sessionId}/`);
      expect(req.request.method).toBe('GET');
      req.flush(session);
    });
  });

  describe('deleteSession', () => {
    it('should delete a session and handle response correctly', () => {
      const sessionId = 1;

      service.deleteSession(sessionId).subscribe(resp => {
        expect(resp).toBeUndefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/routine-sessions/${sessionId}/`);
      expect(req.request.method).toBe('DELETE');
      req.flush({}, { status: 204, statusText: 'No Content' });
    });

    it('should handle errors during session deletion', () => {
      const sessionId = 1;

      service.deleteSession(sessionId).subscribe({
        error: (error) => {
          expect(error.message).toBe('Unknown error');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/routine-sessions/${sessionId}/`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ message: 'Some error' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('deleteRoutine', () => {
    it('should delete a routine and handle response correctly', () => {
      const routineId = 1;

      service.deleteRoutine(routineId).subscribe(resp => {
        expect(resp).toBeUndefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/routines/${routineId}/`);
      expect(req.request.method).toBe('DELETE');
      req.flush({}, { status: 204, statusText: 'No Content' });
    });

    it('should handle errors during routine deletion', () => {
      const routineId = 1;

      service.deleteRoutine(routineId).subscribe({
        error: (error) => {
          expect(error.message).toBe('Unknown error');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/routines/${routineId}/`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ message: 'Some error' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('deleteExerciseAndRemoveFromRoutine', () => {
    it('should delete an exercise and remove it from a routine', () => {
      const routineId = 1;
      const exerciseId = 1;

      service.deleteExerciseAndRemoveFromRoutine(routineId, exerciseId).subscribe(resp => {
        expect(resp).toBeUndefined();
      });

      const req1 = httpMock.expectOne(`${apiUrl}/routines/${routineId}/exercises/${exerciseId}/`);
      expect(req1.request.method).toBe('DELETE');
      req1.flush({}, { status: 204, statusText: 'No Content' });

      const req2 = httpMock.expectOne(`${apiUrl}/exercises/${exerciseId}/`);
      expect(req2.request.method).toBe('DELETE');
      req2.flush({}, { status: 204, statusText: 'No Content' });
    });

    it('should handle errors while deleting exercise', () => {
      const routineId = 1;
      const exerciseId = 1;

      service.deleteExerciseAndRemoveFromRoutine(routineId, exerciseId).subscribe({
        error: (error) => {
          expect(error.message).toBe('Failed to remove exercise from routine');
        }
      });

      const req1 = httpMock.expectOne(`${apiUrl}/routines/${routineId}/exercises/${exerciseId}/`);
      expect(req1.request.method).toBe('DELETE');
      req1.flush({ message: 'Some error' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('createRoutineSessionSet', () => {
    it('should create a routine session set', () => {
      const routineSessionId = 1;
      const exerciseId = 1;
      const setNumber = 1;
      const reps = 10;
      const weight = 50;
      const rir = 1;
      const response = { id: 1 };

      service.createRoutineSessionSet(routineSessionId, exerciseId, setNumber, reps, weight, rir).subscribe(resp => {
        expect(resp).toEqual(response);
      });

      const req = httpMock.expectOne(`${apiUrl}/routine-sessions/${routineSessionId}/sets/`);
      expect(req.request.method).toBe('POST');
      req.flush(response, { status: 201, statusText: 'Created' });
    });

    it('should handle errors during routine session set creation', () => {
      const routineSessionId = 1;
      const exerciseId = 1;
      const setNumber = 1;
      const reps = 10;
      const weight = 50;
      const rir = 1;

      service.createRoutineSessionSet(routineSessionId, exerciseId, setNumber, reps, weight, rir).subscribe({
        error: (error) => {
          expect(error.message).toBe('Unknown error');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/routine-sessions/${routineSessionId}/sets/`);
      expect(req.request.method).toBe('POST');
      req.flush({ message: 'Some error' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getRoutineSessionSet', () => {
    it('should retrieve sets for a session', () => {
      const sessionId = 1;
      const sets = [{ set_number: 1, weight: 50, reps: 10, rir: 1 }];

      service.getRoutineSessionSet(sessionId).subscribe(resp => {
        expect(resp).toEqual(sets);
      });

      const req = httpMock.expectOne(`${apiUrl}/routine-sessions/${sessionId}/sets/`);
      expect(req.request.method).toBe('GET');
      req.flush(sets);
    });
  });

  describe('getPreviousRoutineSessionId', () => {
    it('should retrieve the previous routine session ID', () => {
      const routineId = 1;
      const currentSessionId = 2;
      const sessions = [
        { id: 1, routine: routineId, date: '2024-01-01T00:00:00Z' },
        { id: 2, routine: routineId, date: '2024-02-01T00:00:00Z' }
      ];

      service.getPreviousRoutineSessionId(routineId, currentSessionId).subscribe(resp => {
        expect(resp).toBe(1);
      });

      const req = httpMock.expectOne(`${apiUrl}/routine-sessions/`);
      expect(req.request.method).toBe('GET');
      req.flush(sessions);
    });

    it('should return null if no previous session exists', () => {
      const routineId = 1;
      const currentSessionId = 1;
      const sessions = [{ id: 1, routine: routineId, date: '2024-01-01T00:00:00Z' }];

      service.getPreviousRoutineSessionId(routineId, currentSessionId).subscribe(resp => {
        expect(resp).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}/routine-sessions/`);
      expect(req.request.method).toBe('GET');
      req.flush(sessions);
    });
  });

  describe('getLastSessionSetsForExercise', () => {
    it('should retrieve last session sets for a specific exercise', () => {
      const routineId = 1;
      const exerciseId = 1;
      const currentSessionId = 2;
      const previousSessionId = 1;
      const sets = [{ set_number: 1, weight: 50, reps: 10, rir: 1 }];

      spyOn(service, 'getPreviousRoutineSessionId').and.returnValue(of(previousSessionId));
      spyOn(service, 'getRoutineSessionSet').and.returnValue(of(sets));

      service.getLastSessionSetsForExercise(routineId, exerciseId, currentSessionId).subscribe(resp => {
        expect(resp).toEqual(sets);
      });
    });

    it('should return an empty array if no previous session', () => {
      const routineId = 1;
      const exerciseId = 1;
      const currentSessionId = 2;

      spyOn(service, 'getPreviousRoutineSessionId').and.returnValue(of(null));

      service.getLastSessionSetsForExercise(routineId, exerciseId, currentSessionId).subscribe(resp => {
        expect(resp).toEqual([]);
      });
    });
  });
});