import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoutineDetailsComponent } from './routine-details.component';
import { RoutineService } from '../services/routine.service';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('RoutineDetailsComponent', () => {
  let component: RoutineDetailsComponent;
  let fixture: ComponentFixture<RoutineDetailsComponent>;
  let routineServiceMock: any;
  let cdrMock: any;

  beforeEach(async () => {
    routineServiceMock = {
      getExercises: jasmine.createSpy('getExercises').and.returnValue(of([])),
      addExercise: jasmine.createSpy('addExercise').and.returnValue(of({})),
      deleteExerciseAndRemoveFromRoutine: jasmine.createSpy('deleteExerciseAndRemoveFromRoutine').and.returnValue(of({}))
    };

    cdrMock = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    await TestBed.configureTestingModule({
      imports: [RoutineDetailsComponent, FormsModule, CommonModule],
      providers: [
        { provide: RoutineService, useValue: routineServiceMock },
        { provide: ChangeDetectorRef, useValue: cdrMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RoutineDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load exercises on init', () => {
    component.routine = { id: 1, name: 'Test Routine' };
    component.ngOnInit();

    expect(routineServiceMock.getExercises).toHaveBeenCalledWith(1);
    expect(component.exercises).toEqual([]);
  });

  it('should display error message if exercise name or sets are missing', () => {
    component.exerciseName = '';
    component.sets = 0;

    component.addExercise();

    expect(component.errorMessage).toBe('Exercise name and sets are required');
    expect(routineServiceMock.addExercise).not.toHaveBeenCalled();
  });

  it('should add exercise and reload exercises on successful addition', () => {
    component.exerciseName = 'Test Exercise';
    component.sets = 3;
    component.routine = { id: 1, name: 'Test Routine' };

    component.addExercise();

    expect(routineServiceMock.addExercise).toHaveBeenCalledWith({ name: 'Test Exercise', comment: '' }, 1, 3);
    expect(routineServiceMock.getExercises).toHaveBeenCalledWith(1);
  });

  it('should set errorMessage to "Exercise name already exists" on 400 error', () => {
    routineServiceMock.addExercise.and.returnValue(throwError({ status: 400 }));

    component.exerciseName = 'Test Exercise';
    component.sets = 3;
    component.routine = { id: 1, name: 'Test Routine' };

    component.addExercise();

    expect(component.errorMessage).toBe('Exercise name already exists');
  });

  it('should set errorMessage to "Unknown error" on other errors', () => {
    routineServiceMock.addExercise.and.returnValue(throwError({ status: 500 }));

    component.exerciseName = 'Test Exercise';
    component.sets = 3;
    component.routine = { id: 1, name: 'Test Routine' };

    component.addExercise();

    expect(component.errorMessage).toBe('Unknown error');
  });

  it('should remove exercise and reload exercises on successful removal', () => {
    component.routine = { id: 1, name: 'Test Routine' };

    component.removeExercise(1);

    expect(routineServiceMock.deleteExerciseAndRemoveFromRoutine).toHaveBeenCalledWith(1, 1);
    expect(routineServiceMock.getExercises).toHaveBeenCalledWith(1);
  });

  it('should set errorMessage to "Error removing exercise" on removal failure', () => {
    routineServiceMock.deleteExerciseAndRemoveFromRoutine.and.returnValue(throwError({ status: 500 }));

    component.routine = { id: 1, name: 'Test Routine' };

    component.removeExercise(1);

    expect(component.errorMessage).toBe('Error removing exercise');
  });
});