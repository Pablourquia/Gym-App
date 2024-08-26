import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CreateRoutineComponent } from './create-routine.component';
import { RoutineService } from '../services/routine.service';
import { AuthService } from '../services/auth.service';

describe('CreateRoutineComponent', () => {
  let component: CreateRoutineComponent;
  let fixture: ComponentFixture<CreateRoutineComponent>;
  let routineServiceMock: jasmine.SpyObj<RoutineService>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routineServiceMock = jasmine.createSpyObj('RoutineService', ['createRoutine']);
    authServiceMock = jasmine.createSpyObj('AuthService', ['getId']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CreateRoutineComponent],
      providers: [
        { provide: RoutineService, useValue: routineServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateRoutineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createRoutine and navigate on success', () => {
    // Arrange
    routineServiceMock.createRoutine.and.returnValue(of({}));
    authServiceMock.getId.and.returnValue('1');
    component.routineName = 'Test Routine';

    // Act
    component.createRoutine();

    // Assert
    expect(routineServiceMock.createRoutine).toHaveBeenCalledWith({ name: 'Test Routine', user: 1 });
    expect(routerMock.navigate).toHaveBeenCalledWith(['/main']);
  });

  it('should set errorMessage when routine name already exists (400)', () => {
    // Arrange
    const errorResponse = { status: 400 };
    routineServiceMock.createRoutine.and.returnValue(throwError(errorResponse));
    authServiceMock.getId.and.returnValue('1');
    component.routineName = 'Duplicate Routine';

    // Act
    component.createRoutine();

    // Assert
    expect(routineServiceMock.createRoutine).toHaveBeenCalledWith({ name: 'Duplicate Routine', user: 1 });
    expect(component.errorMessage).toBe('Routine name already exists');
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should set errorMessage when unknown error occurs', () => {
    // Arrange
    const errorResponse = { status: 500 };
    routineServiceMock.createRoutine.and.returnValue(throwError(errorResponse));
    authServiceMock.getId.and.returnValue('1');
    component.routineName = 'Test Routine';

    // Act
    component.createRoutine();

    // Assert
    expect(routineServiceMock.createRoutine).toHaveBeenCalledWith({ name: 'Test Routine', user: 1 });
    expect(component.errorMessage).toBe('Unknown error');
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});