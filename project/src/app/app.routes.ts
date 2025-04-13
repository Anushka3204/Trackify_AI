import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { MainComponent } from './main.component';
import { EditTaskComponent } from './edit-task.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'main', component: MainComponent },
  { path: 'edit/:id', component: EditTaskComponent },
  { path: '**', redirectTo: '' }
];
