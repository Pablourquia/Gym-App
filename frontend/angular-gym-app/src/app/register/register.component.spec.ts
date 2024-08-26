import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      register: jasmine.createSpy('register').and.returnValue(of({}))
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call register and navigate to /main on successful registration', () => {
    component.name = 'Test User';
    component.email = 'test@example.com';
    component.password = 'password';

    component.register();

    expect(authServiceMock.register).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password'
    });
    expect(routerMock.navigate).toHaveBeenCalledWith(['/main']);
  });

  it('should set errorMessage to "User already exists" when status is 400', () => {
    authServiceMock.register.and.returnValue(throwError({ status: 400 }));

    component.register();

    expect(component.errorMessage).toBe('User already exists');
  });

  it('should set errorMessage to "Unknown error" for other error statuses', () => {
    authServiceMock.register.and.returnValue(throwError({ status: 500 }));

    component.register();

    expect(component.errorMessage).toBe('Unknown error');
  });

  it('should navigate to /login when login() is called', () => {
    component.login();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});