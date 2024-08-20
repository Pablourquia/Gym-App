import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        console.log('User is logged in');
        this.router.navigate(['/main']);
      },
      error: (error) => {
        console.error(error);
        if (error.status === 401) {
          this.errorMessage = 'Incorrect password';
        }
        else if (error.status === 404) {
          this.errorMessage = 'User not exists';
        }
        else {
          this.errorMessage = 'Unknown error';
        }
      }
    });
  }

  register() {
    this.router.navigate(['/register']);
  }
}