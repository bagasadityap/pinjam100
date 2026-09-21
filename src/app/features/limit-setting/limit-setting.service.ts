import { inject, Injectable } from "@angular/core";
import { HttpNetwork } from "../../core/network/http.network";
import { environment } from "../../../environments/environment";
import { AUTHORIZED } from "../../core/http/http.context";
import { Observable, map } from "rxjs";
import { BaseResponse } from "../../core/model/base-response.model";
import { LimitResponse } from "./limit.model";

@Injectable({
  providedIn: 'root'
})
export class LimitService {
  private readonly http = inject(HttpNetwork);
  private readonly endpoint = `${environment.api.baseUrl}/customer-limit`;

  create(request: any): Observable<LimitResponse> {
    return this.http.post<BaseResponse<LimitResponse>>(
      `${this.endpoint}`,
      request,
      AUTHORIZED
    ).pipe(
      map(response => response.data)
    );
  }
}
