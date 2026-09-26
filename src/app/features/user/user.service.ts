import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpNetwork } from '../../core/network/http.network';
import { AUTHORIZED } from '../../core/http/http.context';
import { UserRequest, UserResponse } from './user.model';
import { BaseResponse } from '../../core/model/base-response.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpNetwork);
  private readonly endpoint = `${environment.api.baseUrl}/user`;

  getAll(): Observable<UserResponse[]> {
    return this.http
      .get<BaseResponse<UserResponse[]>>(this.endpoint, AUTHORIZED)
      .pipe(map((response) => response.data));
  }

  getById(id: string): Observable<UserResponse> {
    return this.http
      .get<BaseResponse<UserResponse>>(`${this.endpoint}/${id}`, AUTHORIZED)
      .pipe(map((response) => response.data));
  }

  create(request: UserRequest): Observable<UserResponse> {
    return this.http
      .post<BaseResponse<UserResponse>>(this.endpoint, request, AUTHORIZED)
      .pipe(map((response) => response.data));
  }

  update(id: string, request: UserRequest): Observable<UserResponse> {
    return this.http
      .put<BaseResponse<UserResponse>>(`${this.endpoint}/${id}`, request, AUTHORIZED)
      .pipe(map((response) => response.data));
  }

  updateActive(id: string): Observable<UserResponse> {
    return this.http
      .patch<BaseResponse<UserResponse>>(`${this.endpoint}/${id}/active`, null, AUTHORIZED)
      .pipe(map((response) => response.data));
  }

  changeRole(id: string, roleId: string): Observable<UserResponse> {
    return this.http
      .patch<BaseResponse<UserResponse>>(`${this.endpoint}/${id}/role`, roleId, AUTHORIZED)
      .pipe(map((response) => response.data));
  }

  delete(id: string): Observable<UserResponse> {
    return this.http
      .delete<BaseResponse<UserResponse>>(`${this.endpoint}/${id}`, AUTHORIZED)
      .pipe(map((response) => response.data));
  }
}
