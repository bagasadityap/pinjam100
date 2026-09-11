import { inject, Injectable } from "@angular/core";
import { HttpNetwork } from "../../core/network/http.network";
import { environment } from "../../../environments/environment";
import { AUTHORIZED } from "../../core/http/http.context";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LimitService {
  private readonly http = inject(HttpNetwork);
  private readonly endpoint = `${environment.api.baseUrl}/customer-limit`;

  create(request: any): Observable<any> {
    return this.http.post(
      `${this.endpoint}`,
      request,
      AUTHORIZED
    );
  }
}
