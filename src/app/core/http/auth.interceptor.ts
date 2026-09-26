import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  EMPTY,
  catchError,
  filter,
  finalize,
  switchMap,
  take,
  throwError,
} from 'rxjs';

import { API_ACCESS, AUTHORIZED } from './http.context';
import { TokenService } from '../service/token.service';
import { AuthService } from '../../features/auth/auth.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const access = req.context.get(API_ACCESS);

  if (access !== AUTHORIZED) {
    return next(req);
  }

  const token = tokenService.get();

  if (!token) {
    return EMPTY;
  }

  const authorizedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authorizedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      const refreshToken = tokenService.getRefreshToken();

      if (!refreshToken) {
        tokenService.remove();
        router.navigate(['/login']);
        return EMPTY;
      }

      if (isRefreshing) {
        return refreshTokenSubject.pipe(
          filter((token) => token !== null),
          take(1),
          switchMap((newToken) => {
            return next(
              req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`,
                },
              }),
            );
          }),
        );
      }

      isRefreshing = true;
      refreshTokenSubject.next(null);

      return authService.refreshToken().pipe(
        switchMap((response) => {
          const newToken = response.token;

          refreshTokenSubject.next(newToken);

          return next(
            req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`,
              },
            }),
          );
        }),
        catchError((refreshError) => {
          tokenService.remove();
          refreshTokenSubject.next(null);
          router.navigate(['/login']);

          return throwError(() => refreshError);
        }),
        finalize(() => {
          isRefreshing = false;
        }),
      );
    }),
  );
};
