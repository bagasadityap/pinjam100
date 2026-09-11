import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpNetwork } from '../../../core/network/http.network';
import { AUTHORIZED } from '../../../core/http/http.context';
import { PermissionResponse } from './permission.model';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private readonly http = inject(HttpNetwork);
  private readonly endpoint = `${environment.api.baseUrl}/permission`;

  getAll(): Observable<PermissionResponse[]> {
    return this.http.get<PermissionResponse[]>(
      `${this.endpoint}`,
      AUTHORIZED
    )
  }

  getAllByRoleId(id: string): Observable<PermissionResponse> {
    return this.http.get<PermissionResponse>(
      `${this.endpoint}/${id}/role`,
      AUTHORIZED
    )
  }
}
