import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Ruta raíz redirige al login
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Pantallas de autenticación (públicas)
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./features/auth/registro/registro.component').then((m) => m.RegistroComponent),
  },
  {
    path: 'recuperar',
    loadComponent: () =>
      import('./features/auth/recuperar/recuperar.component').then((m) => m.RecuperarComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },

  // Ejemplo de ruta protegida (agregar más adelante)
  // {
  //   path: 'dashboard',
  //   canActivate: [authGuard],
  //   loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
  // },
];
