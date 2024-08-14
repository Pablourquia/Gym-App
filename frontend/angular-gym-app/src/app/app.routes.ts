import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MainComponent } from './main/main.component';
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
    }
];
