import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { HistoricalRoutinesComponent } from './historical-routines.component';
import { RoutineService } from '../services/routine.service';
import { AuthService } from '../services/auth.service';

describe('HistoricalRoutinesComponent', () => {
  let component: HistoricalRoutinesComponent;
  let fixture: ComponentFixture<HistoricalRoutinesComponent>;
  let routineServiceMock: jasmine.SpyObj<RoutineService>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routineServiceMock = jasmine.createSpyObj('RoutineService', ['getRoutines', 'getSessions', 'createRoutineSession', 'deleteSession']);
    authServiceMock = jasmine.createSpyObj('AuthService', ['getId']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HistoricalRoutinesComponent],
      providers: [
        { provide: RoutineService, useValue: routineServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HistoricalRoutinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load routines and sessions on init', () => {
    const routinesMock = [{ id: 1, name: 'Routine 1' }];
    const sessionsMock = [{ id: 1, routine: 1, date: '2023-08-25' }];
    
    routineServiceMock.getRoutines.and.returnValue(of(routinesMock));
    routineServiceMock.getSessions.and.returnValue(of(sessionsMock));
    authServiceMock.getId.and.returnValue('1');

    component.ngOnInit();

    expect(routineServiceMock.getRoutines).toHaveBeenCalledWith(1);
    expect(routineServiceMock.getSessions).toHaveBeenCalledWith(1);
    expect(component.routinesSessions.length).toBe(1);
    expect(component.routinesSessions[0].routine).toBe('Routine 1');
  });

  it('should create a new routine session', () => {
    component.routines = [{ id: 1, name: 'Routine 1' }];
    component.routineName = 'Routine 1';
    routineServiceMock.createRoutineSession.and.returnValue(of({}));

    component.createRoutineSession();

    expect(routineServiceMock.createRoutineSession).toHaveBeenCalledWith(1);
  });

  it('should handle routine session creation error', () => {
    component.routines = [{ id: 1, name: 'Routine 1' }];
    component.routineName = 'Routine 1';
    routineServiceMock.createRoutineSession.and.returnValue(throwError({}));

    component.createRoutineSession();

    expect(component.errorMessage).toBe('Unknown error');
  });

  it('should delete a session', () => {
    routineServiceMock.deleteSession.and.returnValue(of({}));

    component.deleteSession(1);

    expect(routineServiceMock.deleteSession).toHaveBeenCalledWith(1);
  });

  it('should handle delete session error', () => {
    routineServiceMock.deleteSession.and.returnValue(throwError({}));

    component.deleteSession(1);

    expect(component.errorMessage).toBe('Error deleting session');
  });

  it('should navigate to session characteristics', () => {
    component.sessionCharacteristics(1);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/session-characteristics', 1]);
  });
});