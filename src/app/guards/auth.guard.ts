import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthApiService } from '../core/services/auth-api.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthApiService);
  const router = inject(Router);

  return authService.isLoggedIn() ? true : router.createUrlTree(['/login']);
};
