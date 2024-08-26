import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionCharacteristicsComponent } from './session-characteristics.component';
import { RoutineService } from '../services/routine.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('SessionCharacteristicsComponent', () => {
  let component: SessionCharacteristicsComponent;
  let fixture: ComponentFixture<SessionCharacteristicsComponent>;
  let routineServiceMock: any;
  let routeMock: any;

  beforeEach(async () => {
    routineServiceMock = {
      getSession: jasmine.createSpy('getSession').and.returnValue(of({ id: 1, routine: '1', date: '2024-08-26' })),
      getRoutine: jasmine.createSpy('getRoutine').and.returnValue(of({ id: 1, name: 'Test Routine' })),
      getExercises: jasmine.createSpy('getExercises').and.returnValue(of([{ id: 1, routine: 1, exercise: 1, exercise_detail: { id: 1, name: 'Test Exercise', comment: 'Test Comment' }, sets: 3 }])),
      getRoutineSessionSet: jasmine.createSpy('getRoutineSessionSet').and.returnValue(of([])),
      getLastSessionSetsForExercise: jasmine.createSpy('getLastSessionSetsForExercise').and.returnValue(of([])),
      createRoutineSessionSet: jasmine.createSpy('createRoutineSessionSet').and.returnValue(of({}))
    };

    routeMock = {
      params: of({ id: 1 })
    };

    await TestBed.configureTestingModule({
      imports: [SessionCharacteristicsComponent, FormsModule, CommonModule],
      providers: [
        { provide: RoutineService, useValue: routineServiceMock },
        { provide: ActivatedRoute, useValue: routeMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SessionCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load session and related data on init', () => {
    component.ngOnInit();

    expect(routineServiceMock.getSession).toHaveBeenCalledWith(1);
    expect(routineServiceMock.getRoutine).toHaveBeenCalledWith('1');
    expect(routineServiceMock.getExercises).toHaveBeenCalledWith(1);
    expect(routineServiceMock.getRoutineSessionSet).toHaveBeenCalledWith(1);
    expect(routineServiceMock.getLastSessionSetsForExercise).toHaveBeenCalled();
  });

  it('should initialize formSets correctly', () => {
    component.exercises = [{
      id: 1,
      routine: 1,
      exercise: 1,
      exercise_detail: { id: 1, name: 'Test Exercise', comment: 'Test Comment' },
      sets: 3
    }];
    component.sessionSets = [
      { exercise: 1, set_number: 1, reps: 10, weight: 100, rir: 2 },
      { exercise: 1, set_number: 2, reps: 8, weight: 100, rir: 1 }
    ];

    component.initializeFormSets();

    expect(component.formSets[0].length).toBe(3);
    expect(component.formSets[0][0]).toEqual({ reps: 10, weight: 100, rir: 2 });
    expect(component.formSets[0][1]).toEqual({ reps: 8, weight: 100, rir: 1 });
    expect(component.formSets[0][2]).toEqual({ reps: 0, weight: 0, rir: 0 });
  });

  it('should create routine session sets on form submission', () => {
    component.session_id = 1;
    component.exercises = [{
      id: 1,
      routine: 1,
      exercise: 1,
      exercise_detail: { id: 1, name: 'Test Exercise', comment: 'Test Comment' },
      sets: 3
    }];
    component.formSets = {
      0: [
        { reps: 10, weight: 100, rir: 2 },
        { reps: 8, weight: 100, rir: 1 },
        { reps: 6, weight: 100, rir: 0 }
      ]
    };

    component.onSubmit(1, 0);

    expect(routineServiceMock.createRoutineSessionSet).toHaveBeenCalledTimes(3);
    expect(routineServiceMock.createRoutineSessionSet).toHaveBeenCalledWith(1, 1, 1, 10, 100, 2);
    expect(routineServiceMock.createRoutineSessionSet).toHaveBeenCalledWith(1, 1, 2, 8, 100, 1);
    expect(routineServiceMock.createRoutineSessionSet).toHaveBeenCalledWith(1, 1, 3, 6, 100, 0);
  });

  it('should display error message if createRoutineSessionSet fails with 400', () => {
    routineServiceMock.createRoutineSessionSet.and.returnValue(throwError({ status: 400 }));

    component.onSubmit(1, 0);

    expect(component.errorMessage).toBe('El set ya existe');
  });

  it('should display "Error desconocido" on non-400 errors', () => {
    routineServiceMock.createRoutineSessionSet.and.returnValue(throwError({ status: 500 }));

    component.onSubmit(1, 0);

    expect(component.errorMessage).toBe('Error desconocido');
  });

  it('should handle errors when loading session data', () => {
    routineServiceMock.getSession.and.returnValue(throwError('Error loading session'));
    spyOn(console, 'error');

    component.reloadData();

    expect(console.error).toHaveBeenCalledWith('Error al obtener la sesión:', 'Error loading session');
  });
});