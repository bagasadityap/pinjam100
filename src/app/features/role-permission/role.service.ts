import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpNetwork } from '../../core/network/http.network';
import { AUTHORIZED } from '../../core/http/http.context';
import {
  RoleRequest,
  RoleResponse
} from './role.model';
import { BaseResponse } from '../../core/model/base-response.model';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly http = inject(HttpNetwork);
  private readonly endpoint = `${environment.api.baseUrl}/role`;

  getAll(): Observable<RoleResponse[]> {
    return this.http.get<BaseResponse<RoleResponse[]>>(
      this.endpoint,
      AUTHORIZED
    ).pipe(
      map(response => response.data)
    );
  }

  getById(id: string): Observable<RoleResponse> {
    return this.http.get<BaseResponse<RoleResponse>>(
      `${this.endpoint}/${id}`,
      AUTHORIZED
    ).pipe(
      map(response => response.data)
    );
  }

  create(request: RoleRequest): Observable<RoleResponse> {
    return this.http.post<BaseResponse<RoleResponse>>(
      this.endpoint,
      request,
      AUTHORIZED
    ).pipe(
      map(response => response.data)
    );
  }

  update(id: string, request: RoleRequest): Observable<RoleResponse> {
    return this.http.put<BaseResponse<RoleResponse>>(
      `${this.endpoint}/${id}`,
      request,
      AUTHORIZED
    ).pipe(
      map(response => response.data)
    );
  }

  updatePermission(
    id: string,
    permissions: string[]
  ): Observable<RoleResponse> {
    return this.http.patch<BaseResponse<RoleResponse>>(
      `${this.endpoint}/${id}/permission`,
      { permissions },
      AUTHORIZED
    ).pipe(
      map(response => response.data)
    );
  }

  delete(id: string): Observable<RoleResponse> {
    return this.http.delete<BaseResponse<RoleResponse>>(
      `${this.endpoint}/${id}`,
      AUTHORIZED
    ).pipe(
      map(response => response.data)
    );
  }
}
