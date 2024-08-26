import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const apiUrl = "https://paburq.pythonanywhere.com/api";
  const credentials = { email: 'test@example.com', password: 'password' };
  const userResponse = {
    name: 'John Doe',
    email: 'test@example.com',
    id: '12345'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should log in the user and store the user data in localStorage', () => {
      service.login(credentials).subscribe(response => {
        expect(response).toBeDefined();
        expect(localStorage.getItem('name')).toBe(userResponse.name);
        expect(localStorage.getItem('email')).toBe(userResponse.email);
        expect(localStorage.getItem('id')).toBe(userResponse.id);
      });

      const req = httpMock.expectOne(`${apiUrl}/login/`);
      expect(req.request.method).toBe('POST');
      req.flush(userResponse, { status: 200, statusText: 'OK' });
    });

    it('should throw an error if login fails', () => {
      const errorMessage = 'Login failed';

      service.login(credentials).subscribe({
        error: (error) => {
          expect(error.message).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/login/`);
      expect(req.request.method).toBe('POST');
      req.flush({ message: errorMessage }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('register', () => {
    it('should register the user and store the user data in localStorage', () => {
      service.register({ ...credentials, name: 'John Doe' }).subscribe(response => {
        expect(response).toBeDefined();
        expect(localStorage.getItem('name')).toBe(userResponse.name);
        expect(localStorage.getItem('email')).toBe(userResponse.email);
        expect(localStorage.getItem('id')).toBe(userResponse.id);
      });

      const req = httpMock.expectOne(`${apiUrl}/register/`);
      expect(req.request.method).toBe('POST');
      req.flush(userResponse, { status: 201, statusText: 'Created' });
    });

    it('should throw an error if registration fails', () => {
      const errorMessage = 'Registration failed';

      service.register({ ...credentials, name: 'John Doe' }).subscribe({
        error: (error) => {
          expect(error.message).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/register/`);
      expect(req.request.method).toBe('POST');
      req.flush({ message: errorMessage }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if email is in localStorage', () => {
      localStorage.setItem('email', 'test@example.com');
      expect(service.isAuthenticated()).toBeTrue();
    });

    it('should return false if email is not in localStorage', () => {
      localStorage.removeItem('email');
      expect(service.isAuthenticated()).toBeFalse();
    });
  });

  describe('logout', () => {
    it('should clear user data from localStorage', () => {
      localStorage.setItem('name', 'John Doe');
      localStorage.setItem('email', 'test@example.com');
      localStorage.setItem('id', '12345');

      service.logout();

      expect(localStorage.getItem('name')).toBeNull();
      expect(localStorage.getItem('email')).toBeNull();
      expect(localStorage.getItem('id')).toBeNull();
    });
  });

  describe('getId', () => {
    it('should return the user id from localStorage', () => {
      localStorage.setItem('id', '12345');
      expect(service.getId()).toBe('12345');
    });

    it('should return an empty string if id is not in localStorage', () => {
      localStorage.removeItem('id');
      expect(service.getId()).toBe('');
    });
  });
});