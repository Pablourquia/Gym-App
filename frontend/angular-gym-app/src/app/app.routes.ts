import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MainComponent } from './main/main.component';
import { CreateRoutineComponent } from './create-routine/create-routine.component';
import { RoutineDetailsComponent } from './routine-details/routine-details.component';
import { HistoricalRoutinesComponent } from './historical-routines/historical-routines.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/login",
        pathMatch: "full"
    },
    {
        path: "login",
        component: LoginComponent 
    },
    {
        path: "register",
        component: RegisterComponent
    },
    {
        path: "main",
        component: MainComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "create-routine",
        component: CreateRoutineComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "routine-details/:id",
        component: RoutineDetailsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: "historical-routines",
        component: HistoricalRoutinesComponent,
        canActivate: [AuthGuard]
    }
];
