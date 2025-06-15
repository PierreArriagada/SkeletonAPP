import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DbtaskService } from '../services/dbtask.service';

export const authGuard: CanActivateFn = async (route, state) => {
  // Se inyectan los servicios necesarios
  const dbtaskService = inject(DbtaskService);
  const router = inject(Router);

  // Se consulta al servicio si existe una sesión activa 
  const isSessionActive = await dbtaskService.verificarSesionActiva();

  if (isSessionActive) {
    return true; // Si hay sesión, permite el acceso
  } else {
    // Si no hay sesión, redirige a la página de login
    router.navigate(['/login']);
    return false;
  }
};