import { inject, Injectable } from "@angular/core";
import { HttpNetwork } from "../../core/network/http.network";
import { environment } from "../../../environments/environment";
import { AUTHORIZED } from "../../core/http/http.context";
import { Observable, map } from "rxjs";
import {
  CreditAnalystDashboardResponse,
  DashboardResponse,
  DocumentCheckerDashboardResponse,
  MarketingDashboardResponse,
  PaymentDashboardResponse
} from "./dashboard.model";
import { BaseResponse } from "../../core/model/base-response.model";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpNetwork);
  private readonly endpoint = `${environment.api.baseUrl}/dashboard`;

  getDashboard(): Observable<
    DashboardResponse |
    MarketingDashboardResponse |
    PaymentDashboardResponse |
    DocumentCheckerDashboardResponse |
    CreditAnalystDashboardResponse
  > {
    return this.http.get<
      BaseResponse<
        DashboardResponse |
        MarketingDashboardResponse |
        PaymentDashboardResponse |
        DocumentCheckerDashboardResponse |
        CreditAnalystDashboardResponse
      >
    >(
      this.endpoint,
      AUTHORIZED
    ).pipe(
      map(response => response.data)
    );
  }
}
