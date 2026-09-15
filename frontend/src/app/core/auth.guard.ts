import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * A route guard decides if the user may visit a route. If they're not logged
 * in, we send them to /login. This is the frontend mirror of the backend's
 * JwtAuthGuard — both stop unauthenticated access, just on different sides.
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
