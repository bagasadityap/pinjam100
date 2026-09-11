import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { EMPTY } from 'rxjs';

import { API_ACCESS, AUTHORIZED } from './http.context';
import { TokenService } from '../service/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const access = req.context.get(API_ACCESS);

  if (access !== AUTHORIZED) {
    return next(req);
  }

  const token = tokenService.get();

  if (!token) {
    return EMPTY;
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })
  );
};
