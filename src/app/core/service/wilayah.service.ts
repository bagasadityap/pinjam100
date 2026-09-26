import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpNetwork } from '../network/http.network';
import { AUTHORIZED } from '../http/http.context';
import { WilayahResponse } from '../model/wilayah.model';
import { BaseResponse } from '../model/base-response.model';

@Injectable({
  providedIn: 'root',
})
export class WilayahService {
  private readonly http = inject(HttpNetwork);
  private readonly endpoint = `${environment.api.baseUrl}/wilayah`;

  getProvinces(): Observable<WilayahResponse> {
    return this.http
      .get<BaseResponse<WilayahResponse>>(`${this.endpoint}/provinces`, AUTHORIZED)
      .pipe(map((response) => response.data));
  }

  getRegencies(provinceCode: string): Observable<WilayahResponse> {
    return this.http
      .get<BaseResponse<WilayahResponse>>(`${this.endpoint}/regencies/${provinceCode}`, AUTHORIZED)
      .pipe(map((response) => response.data));
  }
}
