import { inject, Injectable } from "@angular/core";
import { HttpNetwork } from "../../core/network/http.network";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { CustomerDetailResponse, CustomerResponse } from "./customer.model";
import { AUTHORIZED } from "../../core/http/http.context";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly http = inject(HttpNetwork);
  private readonly endpoint = `${environment.api.baseUrl}/customer`;

  getAll(): Observable<CustomerResponse[]> {
    return this.http.get<CustomerResponse[]>(
      `${this.endpoint}`,
      AUTHORIZED
    )
  }

  getPending(): Observable<CustomerResponse[]> {
    return this.http.get<CustomerResponse[]>(
      `${this.endpoint}/pending`,
      AUTHORIZED
    )
  }

  getVerifiedAndLimitIsNull(): Observable<CustomerResponse[]> {
    return this.http.get<CustomerResponse[]>(
      `${this.endpoint}/verified-limit-null`,
      AUTHORIZED
    )
  }

  getById(id: string): Observable<CustomerResponse> {
    return this.http.get<CustomerResponse>(
      `${this.endpoint}/${id}`
    )
  }

  getDetailById(id: string): Observable<CustomerDetailResponse> {
    return this.http.get<CustomerDetailResponse>(
      `${this.endpoint}/${id}/detail`
    )
  }

  verifyCustomer(customerId: string, status: string): Observable<CustomerDetailResponse> {
    return this.http.put<CustomerDetailResponse>(
      `${this.endpoint}/${customerId}/verify`,
      status,
      AUTHORIZED
    );
  }

  getDocument(fileUrl: string): string {
    return `${environment.api.documentUrl}/${fileUrl}`;
  }
}
