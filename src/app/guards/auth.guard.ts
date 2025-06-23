import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DbtaskService } from '../services/dbtask.service';

export const authGuard: CanActivateFn = async (route, state) => {
  
  const dbtaskService = inject(DbtaskService);
  const router = inject(Router);

 
  const isSessionActive = await dbtaskService.verificarSesionActiva();

  if (isSessionActive) {
    return true; 
  } else {
    
    router.navigate(['/login']);
    return false;
  }
};