import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpNetwork } from '../../../core/network/http.network';
import { AUTHORIZED } from '../../../core/http/http.context';
import { PermissionResponse } from './permission.model';
import { BaseResponse } from '../../../core/model/base-response.model';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private readonly http = inject(HttpNetwork);
  private readonly endpoint = `${environment.api.baseUrl}/permission`;

  getAll(): Observable<PermissionResponse[]> {
    return this.http
      .get<BaseResponse<PermissionResponse[]>>(`${this.endpoint}`, AUTHORIZED)
      .pipe(map((response) => response.data));
  }

  getAllByRoleId(id: string): Observable<PermissionResponse> {
    return this.http
      .get<BaseResponse<PermissionResponse>>(`${this.endpoint}/${id}/role`, AUTHORIZED)
      .pipe(map((response) => response.data));
  }
}
