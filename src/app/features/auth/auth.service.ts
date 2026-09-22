import { Injectable, inject } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpNetwork } from '../../core/network/http.network';
import { PUBLIC, AUTHORIZED } from '../../core/http/http.context';
import { AuthResponse, LoginRequest } from './auth.model';
import { TokenService } from '../../core/service/token.service';
import { UserResponse } from '../user/user.model';
import { BaseResponse } from '../../core/model/base-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpNetwork);
  private readonly tokenService = inject(TokenService);

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<BaseResponse<AuthResponse>>(
      `${environment.api.baseUrl}/auth/login`,
      request,
      PUBLIC
    ).pipe(
      map(response => response.data),
      tap(response => {
        this.tokenService.set(response.token);
        this.tokenService.setRefreshToken(response.refreshToken);
      })
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.tokenService.getRefreshToken();

    return this.http.post<BaseResponse<AuthResponse>>(
      `${environment.api.baseUrl}/auth/refresh`,
      { refreshToken },
      PUBLIC
    ).pipe(
      map(response => response.data),
      tap(response => {
        this.tokenService.set(response.token);
        this.tokenService.setRefreshToken(response.refreshToken);
      })
    );
  }

  logout(): Observable<void> {
  const refreshToken = this.tokenService.getRefreshToken();

  return this.http.post<BaseResponse<void>>(
    `${environment.api.baseUrl}/auth/logout`,
      {
        refreshToken
      },
      AUTHORIZED
    ).pipe(
      map(response => response.data),
      tap(() => {
        this.tokenService.remove();
      })
    );
  }

  getCurrentUser(): Observable<UserResponse> {
    return this.http.get<BaseResponse<UserResponse>>(
      `${environment.api.baseUrl}/auth/get-current-user`,
      AUTHORIZED
    ).pipe(
      map(response => response.data)
    );
  }
}
