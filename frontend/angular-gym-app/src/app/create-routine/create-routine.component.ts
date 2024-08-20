import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RoutineService } from '../services/routine.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-create-routine',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule],
  templateUrl: './create-routine.component.html',
  styleUrl: './create-routine.component.css'
})
export class CreateRoutineComponent {

  errorMessage: string = '';
  routineName: string = '';

  constructor (
    private router: Router,
    private routineService: RoutineService,
    private authService: AuthService
  ) {}

  createRoutine() {
    this.routineService.createRoutine({ name: this.routineName, user: Number(this.authService.getId()) }).subscribe({
      next: () => {
        console.log('Routine created successfully');
        this.router.navigate(['/main']);
      },
      error: (error) => {
        console.error(error);
        if (error.status === 400) {
          this.errorMessage = 'Routine name already exists';
        }
        else {
          this.errorMessage = 'Unknown error';
        }
      }
    });
  }
  
}
