import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = "https://paburq.pythonanywhere.com/api";
  //private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login/`, credentials, { observe: 'response' }).pipe(
      tap((response: HttpResponse<any>) => {
        if (response.status === 200) {
          localStorage.setItem('name', response.body?.name);
          localStorage.setItem('email', response.body?.email);
          localStorage.setItem('id', response.body?.id);
        } else {
          throw new Error(response.body?.message || 'Unknown error');
        }
      })
    );
  }

  register(credentials: { name:string; email:string; password: string}): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register/`, credentials, { observe: 'response' }).pipe(
      tap((response: HttpResponse<any>) => {
        if (response.status === 201) {
          localStorage.setItem('name', response.body?.name);
          localStorage.setItem('email', response.body?.email);
          localStorage.setItem('id', response.body?.id);
        } else {
          throw new Error(response.body?.message || 'Unknown error');
        }
      })
    );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('email');
  }

  logout() {
    localStorage.removeItem('name');
    localStorage.removeItem('email');
  }

  getId(): string {
    return localStorage.getItem('id') || '';
  }
}