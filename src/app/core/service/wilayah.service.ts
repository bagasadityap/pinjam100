import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpNetwork } from '../network/http.network';
import { AUTHORIZED, PUBLIC } from '../http/http.context';
import { WilayahResponse } from '../model/wilayah.model';

@Injectable({
  providedIn: 'root'
})
export class WilayahService {
  private readonly http = inject(HttpNetwork);
  private readonly endpoint = `${environment.api.baseUrl}/wilayah`;

  getProvinces(): Observable<WilayahResponse> {
    return this.http.get<WilayahResponse>(
      `${this.endpoint}/provinces`,
      AUTHORIZED
    );
  }

  getRegencies(provinceCode: string): Observable<WilayahResponse> {
    return this.http.get<WilayahResponse>(
      `${this.endpoint}/regencies/${provinceCode}`,
      AUTHORIZED
    );
  }
}
