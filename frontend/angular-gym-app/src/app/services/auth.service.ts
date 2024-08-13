import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    console.log("Llega login de auth.service.ts");
    return this.http.post<any>(`${this.apiUrl}/login/`, credentials, { observe: 'response' }).pipe(
      tap((response: HttpResponse<any>) => {
        if (response.status === 200) {
          console.log('User is logged in');
          localStorage.setItem('name', response.body?.name);
          localStorage.setItem('email', response.body?.email);
          console.log(localStorage);
        } else {
          console.log('User is not logged in');
          throw new Error(response.body?.message || 'Unknown error');
        }
      })
    );
  }
}