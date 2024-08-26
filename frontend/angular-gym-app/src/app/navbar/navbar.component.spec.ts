import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(true),
      logout: jasmine.createSpy('logout')
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate'),
      url: '/some-route'
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, NavbarComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true if user is authenticated', () => {
    expect(component.isAuthenticated).toBeTrue();
    expect(authServiceMock.isAuthenticated).toHaveBeenCalled();
  });

  it('should navigate to login on logout', () => {
    component.logout();

    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should return true if the current route is active', () => {
    expect(component.isActive('/some-route')).toBeTrue();
  });

  it('should return false if the current route is not active', () => {
    expect(component.isActive('/another-route')).toBeFalse();
  });
});
