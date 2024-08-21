import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RoutineService } from '../services/routine.service';
import { RoutineSession, Exercise } from '../models/models';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-session-characteristics',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule],
  templateUrl: './session-characteristics.component.html',
  styleUrl: './session-characteristics.component.css'
})
export class SessionCharacteristicsComponent {
  session: RoutineSession = { routine: '', date: '', id: 0 };
  session_id = 0;
  routine: any = {};
  exercises: Exercise[] = [];
  errorMessage: string = '';
  sessionSets: any[] = [];
  lastSessionSets: any[] = [];

  formSets: { [exerciseIndex: number]: { reps: number, weight: number, rir: number }[] } = {};

  constructor(
    private routineService: RoutineService,
    private route: ActivatedRoute
  ) {}

  initializeFormSets() {
    this.formSets = this.exercises.map((exercise) => {
      const sessionSetsForExercise = this.getSessionSetsForExercise(exercise.id);
      return Array.from({ length: exercise.sets }, (_, setIndex) => {
        const sessionSet = sessionSetsForExercise.find(set => set.set_number === setIndex + 1);
        return sessionSet? {
          reps: sessionSet.reps,
          weight: sessionSet.weight,
          rir: sessionSet.rir
        } : {
          reps: 0,
          weight: 0,
          rir: 0
        };
      });
    });
  }

  getLastSessionSetForDisplay(exerciseId: number, setIndex: number): { weight: number, reps: number, rir: number } | undefined {
    return this.lastSessionSets.find(set => set.exercise === exerciseId && set.set_number === setIndex + 1);
  }

  getSessionSetsForExercise(exerciseId: number): { set_number: number, weight: number, reps: number, rir: number }[] {
    return this.sessionSets.filter(set => set.exercise === exerciseId);
  }

  reloadData() {
    this.routineService.getSession(this.session_id).subscribe(
      (session) => {
        this.session = session;
        this.routineService.getRoutine(session.routine).subscribe(
          (routine) => {
            this.routine = routine;
            this.routineService.getExercises(routine.id).subscribe(
              (exercises) => {
                this.exercises = exercises;
                this.routineService.getRoutineSessionSet(this.session_id).subscribe(
                  (sets: any) => {
                    this.sessionSets = sets;
                    this.exercises.forEach((exercise) => {
                      this.routineService.getLastSessionSetsForExercise(routine.id, exercise.id, session.id).subscribe(
                        (lastSets: any) => {
                          this.lastSessionSets = [...this.lastSessionSets, ...lastSets];
                          this.initializeFormSets();
                        },
                        (error) => {
                          console.error('Error al obtener los sets de la última sesión:', error);
                          this.initializeFormSets();
                        }
                      );
                    });
                  },
                  (error) => {
                    console.error('Error al obtener los sets de la sesión actual:', error);
                  }
                );
              },
              (error) => {
                console.error('Error al obtener los ejercicios:', error);
              }
            );
          },
          (error) => {
            console.error('Error al obtener la rutina:', error);
          }
        );
      },
      (error) => {
        console.error('Error al obtener la sesión:', error);
      }
    );
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.session_id = +params['id'];
    });
    this.reloadData();
  }

  getSetIndices(setCount: number): number[] {
    return Array.from({ length: setCount }, (_, index) => index);
  }

  onSubmit(exerciseId: number, exerciseIndex: number) {
    const sets = this.formSets[exerciseIndex] || [];
    sets.forEach((set, setIndex) => {
      this.createRoutineSessionSet(
        this.session_id,
        exerciseId,
        setIndex + 1,
        set.reps,
        set.weight,
        set.rir
      );
    });
  }
  
  createRoutineSessionSet(routine_session_id: number, exercise_id: number, set_number: number, reps: number, weight: number, rir: number) {
    this.routineService.createRoutineSessionSet(routine_session_id, exercise_id, set_number, reps, weight, rir).subscribe(
      () => {
        console.log('Set creado exitosamente');
      },
      error => {
        console.error('Error al crear el set:', error);
        if (error.status === 400) {
          this.errorMessage = 'El set ya existe';
        } else {
          this.errorMessage = 'Error desconocido';
        }
      }
    );
  }
}