import { Component, OnInit } from '@angular/core';
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

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login() {
    console.log("Entra en login de login.component.ts");
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        console.log('User is logged in');
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
