import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RoutineService } from '../services/routine.service';
import { AuthService } from '../services/auth.service';
import { forkJoin } from 'rxjs';
import { RoutineSession } from '../models/models';

@Component({
  selector: 'app-historical-routines',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './historical-routines.component.html',
  styleUrl: './historical-routines.component.css'
})
export class HistoricalRoutinesComponent {
  errorMessage: string = '';
  routines: any[] = [];
  routineName: string = '';
  sessions: any[] = [];
  routinesSessions: RoutineSession[] = [];

  constructor (
    private router: Router,
    private routineService: RoutineService,
    private authService: AuthService
  ) {}

  matchRoutinesSessions() {
    const userId = Number(this.authService.getId());

    forkJoin({
      routines: this.routineService.getRoutines(userId),
      sessions: this.routineService.getSessions(userId)
    }).subscribe({
      next: ({ routines, sessions }) => {
        this.routines = routines;
        this.sessions = sessions;

        this.routinesSessions = sessions
          .map((session) => {
            const routine = routines.find((routine: any) => routine.id === session.routine);
            return routine
              ? { routine: routine.name, date: session.date, id: session.id }
              : null;
          })
          .filter((item) => item !== null) as { routine: string; date: string, id: number }[];

        console.log(this.routinesSessions);
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Unknown error';
      }
    });
  }

  ngOnInit(): void {
    this.matchRoutinesSessions();
  }

  createRoutineSession() {
    let routine_id = 0;
    for (let routine of this.routines) {
      if (routine.name === this.routineName) {
        routine_id = routine.id;
        break;
      }
    }
    if (routine_id === 0) {
      this.errorMessage = 'Routine not found';
      return;
    }
    this.routineService.createRoutineSession(routine_id).subscribe({
      next: () => {
        console.log('Routine session created successfully');
        this.matchRoutinesSessions();
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Unknown error';
      }
    });
  }

  deleteSession(sessionId: number) {
    this.routineService.deleteSession(sessionId).subscribe({
      next: () => {
        console.log('Session deleted successfully');
        this.matchRoutinesSessions();
      },
      error: (error) => {
        console.error('Error deleting session:', error);
        this.errorMessage = 'Error deleting session';
      }
    });
  }

  sessionCharacteristics(sessionId: number) {
    this.router.navigate(['/session-characteristics', sessionId]);
  }
}
