import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      login: jasmine.createSpy('login').and.returnValue(of({}))
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthService login on login()', () => {
    component.email = 'test@example.com';
    component.password = 'password123';
    
    component.login();

    expect(authServiceMock.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
    expect(routerMock.navigate).toHaveBeenCalledWith(['/main']);
  });

  it('should set errorMessage to "Incorrect password" on 401 error', () => {
    authServiceMock.login.and.returnValue(throwError({ status: 401 }));
    
    component.login();

    expect(component.errorMessage).toBe('Incorrect password');
  });

  it('should set errorMessage to "User not exists" on 404 error', () => {
    authServiceMock.login.and.returnValue(throwError({ status: 404 }));

    component.login();

    expect(component.errorMessage).toBe('User not exists');
  });

  it('should set errorMessage to "Unknown error" on other errors', () => {
    authServiceMock.login.and.returnValue(throwError({ status: 500 }));

    component.login();

    expect(component.errorMessage).toBe('Unknown error');
  });

  it('should navigate to /register on register()', () => {
    component.register();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/register']);
  });
});

