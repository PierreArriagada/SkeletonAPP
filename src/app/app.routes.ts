import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage),
    canActivate: [authGuard], 
    children: [ 
      {
        path: '',
        redirectTo: 'mis-datos',
        pathMatch: 'full',
      },
      {
        path: 'mis-datos',
        loadComponent: () => import('./components/mis-datos/mis-datos.component').then(m => m.MisDatosComponent),
      },
      {
        path: 'experiencia',
        loadComponent: () => import('./components/experiencia-laboral/experiencia-laboral.component').then(m => m.ExperienciaLaboralComponent),
      },
      {
        path: 'certificaciones',
        loadComponent: () => import('./components/certificaciones/certificaciones.component').then(m => m.CertificacionesComponent),
      },
    ],
  },
  
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
  
  {
    path: '**',
    redirectTo: '404',
  },
];