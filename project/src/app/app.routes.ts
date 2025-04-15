import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { MainComponent } from './main.component';
import { LoginComponent } from './login.component';
import { SignupComponent } from './signup.component';
import { EditTaskComponent } from './edit-task.component';
import { CompletedTasksComponent } from './completed-tasks.component';
import { routeGuard } from './route.guard';
import { AiAssistantComponent } from './ai-assistant.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { 
    path: 'main', 
    component: MainComponent,
    canActivate: [routeGuard]
  },
  { 
    path: 'edit-task/:id', 
    component: EditTaskComponent,
    canActivate: [routeGuard]
  },
  { 
    path: 'completed-tasks', 
    component: CompletedTasksComponent,
    canActivate: [routeGuard]
  },
  { path: 'tasks', component: MainComponent, canActivate: [routeGuard] },
  { path: 'ai-assistant', component: AiAssistantComponent },
  { path: '**', redirectTo: '' }
];
