import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RoutineService } from '../services/routine.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [NavbarComponent, CommonModule, RouterModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  routines: any[] = [];

  constructor(private routineService: RoutineService, private authService : AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadRoutines();
  }

  private loadRoutines(): void {
    this.routineService.getRoutines(Number(this.authService.getId())).subscribe({
      next: (routines) => {
        this.routines = routines;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  goToRoutineDetail(routine: any) {
    this.router.navigate(['/routine-details', routine.id], { state: { data: routine } });
  } 

  deleteRoutine(routine: number) {
    this.routineService.deleteRoutine(routine).subscribe({
      next: () => {
        this.loadRoutines();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
