import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpNetwork } from '../../core/network/http.network';
import { AUTHORIZED } from '../../core/http/http.context';
import {
  RoleRequest,
  RoleResponse
} from './role.model';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly http = inject(HttpNetwork);
  private readonly endpoint = `${environment.api.baseUrl}/role`;

  getAll(): Observable<RoleResponse[]> {
    return this.http.get<RoleResponse[]>(
      this.endpoint,
      AUTHORIZED
    );
  }

  getById(id: string): Observable<RoleResponse> {
    return this.http.get<RoleResponse>(
      `${this.endpoint}/${id}`,
      AUTHORIZED
    );
  }

  create(request: RoleRequest): Observable<RoleResponse> {
    return this.http.post<RoleResponse>(
      this.endpoint,
      request,
      AUTHORIZED
    );
  }

  update(id: string, request: RoleRequest): Observable<RoleResponse> {
    return this.http.put<RoleResponse>(
      `${this.endpoint}/${id}`,
      request,
      AUTHORIZED
    );
  }

  updatePermission(id: string, permissions: string[]): Observable<RoleResponse> {
    return this.http.patch<RoleResponse>(
      `${this.endpoint}/${id}/permission`,
      { permissions },
      AUTHORIZED
    );
  }

  delete(id: string): Observable<RoleResponse> {
    return this.http.delete<RoleResponse>(
      `${this.endpoint}/${id}`,
      AUTHORIZED
    );
  }
}
