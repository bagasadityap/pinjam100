import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpNetwork } from '../../core/network/http.network';
import { PUBLIC, AUTHORIZED } from '../../core/http/http.context';
import { AuthResponse, LoginRequest } from './auth.model';
import { TokenService } from '../../core/service/token.service';
import { UserResponse } from '../user/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpNetwork);
  private readonly tokenService = inject(TokenService);

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${environment.api.baseUrl}/auth/login`,
      request,
      PUBLIC
    ).pipe(
      tap(response => {
        this.tokenService.set(response.token);
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(
      `${environment.api.baseUrl}/auth/logout`,
      {},
      AUTHORIZED
    ).pipe(
      tap(() => {
        this.tokenService.remove();
      })
    );
  }

  getCurrentUser(): Observable<UserResponse> {
    return this.http.get<UserResponse>(
      `${environment.api.baseUrl}/auth/get-current-user`,
      AUTHORIZED
    )
  }
}
