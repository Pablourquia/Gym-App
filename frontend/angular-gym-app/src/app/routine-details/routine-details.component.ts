import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RoutineService } from '../services/routine.service';
import { AuthService } from '../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

interface ExerciseDetail {
  id: number;
  name: string;
  comment: string;
}


interface Exercise {
  id: number;
  routine: number;
  exercise: number;
  exercise_detail: ExerciseDetail;
  sets: number;
}

@Component({
  selector: 'app-routine-details',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule],
  templateUrl: './routine-details.component.html',
  styleUrl: './routine-details.component.css'
})
export class RoutineDetailsComponent {
  routine: any ={};
  errorMessage: string = '';
  exerciseName: string = '';
  sets: number = 0;
  comment: string = '';
  exercises: Exercise[] = [];

  constructor(
    private routineService: RoutineService,
    private cdr: ChangeDetectorRef
  ) {}

  reloadExercises() {
    this.routineService.getExercises(this.routine.id).subscribe(
      (exercises) => {
        this.exercises = exercises;
        console.log('Exercises:', this.exercises);
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error al obtener los ejercicios:', error);
      }
    );
  }

  ngOnInit(): void {
    this.routine = history.state.data;
    this.reloadExercises();
  }

  addExercise() {
    if (!this.exerciseName || !this.sets) {
      this.errorMessage = 'Exercise name and sets are required';
      return;
    }
    this.routineService.addExercise({ name: this.exerciseName, comment: this.comment }, this.routine.id, this.sets ).subscribe({
      next: () => {
        console.log('Exercise added successfully');
        this.reloadExercises();
      },
      error: (error) => {
        console.error(error);
        if (error.status === 400) {
          this.errorMessage = 'Exercise name already exists';
        }
        else {
          this.errorMessage = 'Unknown error';
        }
      }
    });
  }

  removeExercise(exerciseId: number) {
    this.routineService.deleteExerciseAndRemoveFromRoutine(this.routine.id, exerciseId).subscribe({
      next: () => {
        this.reloadExercises();
      },
      error: (error) => {
        console.error('Error al eliminar el ejercicio:', error);
        this.errorMessage = 'Error removing exercise';
      }
    });
  }
}
