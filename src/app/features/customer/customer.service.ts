import { inject, Injectable } from "@angular/core";
import { HttpNetwork } from "../../core/network/http.network";
import { environment } from "../../../environments/environment";
import { Observable, map } from "rxjs";
import {
  CustomerDetailResponse,
  CustomerResponse
} from "./customer.model";
import { AUTHORIZED } from "../../core/http/http.context";
import { BaseResponse } from "../../core/model/base-response.model";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly http = inject(HttpNetwork);
  private readonly endpoint = `${environment.api.baseUrl}/customer`;

  getAll(): Observable<CustomerResponse[]> {
    return this.http.get<BaseResponse<CustomerResponse[]>>(
      `${this.endpoint}`,
      AUTHORIZED
    ).pipe(
      map(response => response.data)
    );
  }

  getPending(): Observable<CustomerResponse[]> {
    return this.http.get<BaseResponse<CustomerResponse[]>>(
      `${this.endpoint}/pending`,
      AUTHORIZED
    ).pipe(
      map(response => response.data)
    );
  }

  getVerifiedAndLimitIsNull(): Observable<CustomerResponse[]> {
    return this.http.get<BaseResponse<CustomerResponse[]>>(
      `${this.endpoint}/verified-limit-null`,
      AUTHORIZED
    ).pipe(
      map(response => response.data)
    );
  }

  getById(id: string): Observable<CustomerResponse> {
    return this.http.get<BaseResponse<CustomerResponse>>(
      `${this.endpoint}/${id}`,
      AUTHORIZED
    ).pipe(
      map(response => response.data)
    );
  }

  getDetailById(id: string): Observable<CustomerDetailResponse> {
    return this.http.get<BaseResponse<CustomerDetailResponse>>(
      `${this.endpoint}/${id}/detail`,
      AUTHORIZED
    ).pipe(
      map(response => response.data)
    );
  }

  verifyCustomer(
    customerId: string,
    status: string
  ): Observable<CustomerDetailResponse> {
    return this.http.put<BaseResponse<CustomerDetailResponse>>(
      `${this.endpoint}/${customerId}/verify`,
      status,
      AUTHORIZED
    ).pipe(
      map(response => response.data)
    );
  }

  getDocument(fileUrl: string): string {
    return `${environment.api.documentUrl}/${fileUrl}`;
  }
}
