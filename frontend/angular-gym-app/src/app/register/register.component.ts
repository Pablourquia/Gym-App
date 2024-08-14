import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  
  email: string = '';
  password: string = '';
  name: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  register() {
    this.authService.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => {
        console.log('User is logged register');
        this.router.navigate(['/main']);
      },
      error: (error) => {
        console.error(error);
        if (error.status === 400) {
          this.errorMessage = 'User already exists';
        }
        else {
          this.errorMessage = 'Unknown error';
        }
      }
    });
  }
}
