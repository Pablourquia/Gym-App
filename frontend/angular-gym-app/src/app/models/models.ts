export interface ExerciseDetail {
    id: number;
    name: string;
    comment: string;
  }
  
export interface Exercise {
    id: number;
    routine: number;
    exercise: number;
    exercise_detail: ExerciseDetail;
    sets: number;
  }
  
export interface RoutineSession {
    routine: string;
    date: string;
    id: number;
  }