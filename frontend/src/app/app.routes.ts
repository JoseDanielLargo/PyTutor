import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  // The dashboard is protected: authGuard redirects to /login if not signed in.
  { path: '', component: Dashboard, canActivate: [authGuard] },
  // Anything unknown -> send to the dashboard (which itself guards to login).
  { path: '**', redirectTo: '' },
];
