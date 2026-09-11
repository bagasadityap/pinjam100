import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpNetwork } from '../../core/network/http.network';
import { AUTHORIZED } from '../../core/http/http.context';
import { UserRequest, UserResponse } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpNetwork);
  private readonly endpoint = `${environment.api.baseUrl}/user`;

  getAll(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(
      this.endpoint,
      AUTHORIZED
    );
  }

  getById(id: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(
      `${this.endpoint}/${id}`,
      AUTHORIZED
    );
  }

  create(request: UserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(
      this.endpoint,
      request,
      AUTHORIZED
    );
  }

  update(id: string, request: UserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(
      `${this.endpoint}/${id}`,
      request,
      AUTHORIZED
    );
  }

  updateActive(id: string): Observable<UserResponse> {
    return this.http.patch<UserResponse>(
      `${this.endpoint}/${id}/active`,
      null,
      AUTHORIZED
    )
  }

  changeRole(id: string, roleId: string): Observable<UserResponse> {
    return this.http.patch<UserResponse>(
      `${this.endpoint}/${id}/role`,
      roleId,
      AUTHORIZED
    )
  }

  delete(id: string): Observable<UserResponse> {
    return this.http.delete<UserResponse>(
      `${this.endpoint}/${id}`,
      AUTHORIZED
    );
  }
}
