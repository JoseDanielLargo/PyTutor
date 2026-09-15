import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

/**
 * An HTTP interceptor runs on EVERY outgoing request. Here we automatically
 * add the "Authorization: Bearer <token>" header when we have a token, so
 * individual components never have to worry about it. This pairs with the
 * backend's JwtStrategy, which reads that exact header to identify the user.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  return next(req);
};
