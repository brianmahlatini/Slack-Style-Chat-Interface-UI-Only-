import { Routes } from '@angular/router';
import { ShellComponent } from './shell.component';

export const routes: Routes = [
  { path: '', redirectTo: 'channel/general', pathMatch: 'full' },
  { path: 'channel/:id', component: ShellComponent },
  { path: '**', redirectTo: 'channel/general' }
];
