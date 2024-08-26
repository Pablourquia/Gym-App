import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainComponent } from './main.component';
import { RoutineService } from '../services/routine.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let routineServiceMock: any;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    routineServiceMock = {
      getRoutines: jasmine.createSpy('getRoutines').and.returnValue(of([])),
      deleteRoutine: jasmine.createSpy('deleteRoutine').and.returnValue(of({}))
    };

    authServiceMock = {
      getId: jasmine.createSpy('getId').and.returnValue('1')
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterModule, MainComponent],
      providers: [
        { provide: RoutineService, useValue: routineServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load routines on init', () => {
    const routinesMock = [{ id: 1, name: 'Routine 1' }, { id: 2, name: 'Routine 2' }];
    routineServiceMock.getRoutines.and.returnValue(of(routinesMock));

    component.ngOnInit();

    expect(routineServiceMock.getRoutines).toHaveBeenCalledWith(1);
    expect(component.routines).toEqual(routinesMock);
  });

  it('should navigate to routine details on goToRoutineDetail()', () => {
    const routineMock = { id: 1, name: 'Routine 1' };

    component.goToRoutineDetail(routineMock);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/routine-details', routineMock.id], { state: { data: routineMock } });
  });

  it('should delete routine and reload routines on deleteRoutine()', () => {
    component.routines = [{ id: 1, name: 'Routine 1' }];

    component.deleteRoutine(1);

    expect(routineServiceMock.deleteRoutine).toHaveBeenCalledWith(1);
    expect(routineServiceMock.getRoutines).toHaveBeenCalled();
  });

  it('should handle error on loadRoutines()', () => {
    const consoleErrorSpy = spyOn(console, 'error');
    routineServiceMock.getRoutines.and.returnValue(throwError('error'));

    component.ngOnInit();

    expect(consoleErrorSpy).toHaveBeenCalledWith('error');
  });

  it('should handle error on deleteRoutine()', () => {
    const consoleErrorSpy = spyOn(console, 'error');
    routineServiceMock.deleteRoutine.and.returnValue(throwError('error'));

    component.deleteRoutine(1);

    expect(consoleErrorSpy).toHaveBeenCalledWith('error');
  });
});