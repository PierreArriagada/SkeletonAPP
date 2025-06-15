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
    canActivate: [authGuard], // Se aplica el guard a la ruta home y sus hijas 
    children: [ // Se definen las rutas hijas para cargar los componentes desde el Home 
      {
        path: '',
        redirectTo: 'mis-datos', // Redirección por defecto al entrar a /home
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
  // Ruta para la página de no encontrado 
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
  // Wildcard que redirige cualquier ruta no definida a la página 404 
  {
    path: '**',
    redirectTo: '404',
  },
];