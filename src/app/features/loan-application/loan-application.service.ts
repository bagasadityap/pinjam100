import { inject, Injectable } from "@angular/core";
import { HttpNetwork } from "../../core/network/http.network";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { LoanApplicationApprovalResponse, LoanApplicationDisbursementResponse, LoanApplicationResponse, LoanApplicationReviewResponse } from "./loan-application.model";
import { AUTHORIZED } from "../../core/http/http.context";
import { ReviewRequest } from "./review/review.model";
import { ApprovalRequest } from "./approval/approval.model";

@Injectable({
  providedIn: 'root'
})
export class LoanApplicationService {
  private readonly http = inject(HttpNetwork);
  private readonly endpoint = `${environment.api.baseUrl}/loan-application`;

  getAll(): Observable<LoanApplicationResponse[]> {
    return this.http.get<LoanApplicationResponse[]>(
      `${this.endpoint}`,
      AUTHORIZED
    )
  }

  getAllForReview(): Observable<LoanApplicationResponse[]> {
    return this.http.get<LoanApplicationResponse[]>(
      `${this.endpoint}/review`,
      AUTHORIZED
    )
  }

  getAllForApproval(): Observable<LoanApplicationResponse[]> {
    return this.http.get<LoanApplicationResponse[]>(
      `${this.endpoint}/approval`,
      AUTHORIZED
    )
  }

  getAllForDisbursement(): Observable<LoanApplicationResponse[]> {
    return this.http.get<LoanApplicationResponse[]>(
      `${this.endpoint}/disbursement`,
      AUTHORIZED
    )
  }

  getById(id: string): Observable<LoanApplicationResponse> {
    return this.http.get<LoanApplicationResponse>(
      `${this.endpoint}/${id}`,
      AUTHORIZED
    )
  }

  getByBranch(id: string): Observable<LoanApplicationResponse[]> {
    return this.http.get<LoanApplicationResponse[]>(
      `${this.endpoint}/${id}/branch`,
      AUTHORIZED
    )
  }

  getByCustomer(id: string): Observable<LoanApplicationResponse[]> {
    return this.http.get<LoanApplicationResponse[]>(
      `${this.endpoint}/${id}/customer`,
      AUTHORIZED
    )
  }

  getForReview(id: string): Observable<LoanApplicationReviewResponse> {
    return this.http.get<LoanApplicationReviewResponse>(
      `${this.endpoint}/${id}/review`,
      AUTHORIZED
    )
  }

  getForApproval(id: string): Observable<LoanApplicationApprovalResponse> {
    return this.http.get<LoanApplicationApprovalResponse>(
      `${this.endpoint}/${id}/approval`,
      AUTHORIZED
    )
  }

  getForDisbursement(id: string): Observable<LoanApplicationDisbursementResponse> {
    return this.http.get<LoanApplicationDisbursementResponse>(
      `${this.endpoint}/${id}/disbursement`,
      AUTHORIZED
    )
  }

  review(id: string, request: ReviewRequest): Observable<LoanApplicationResponse> {
    return this.http.post<LoanApplicationResponse>(
      `${this.endpoint}/${id}/review`,
      request,
      AUTHORIZED
    )
  }

  approve(id: string, request: ApprovalRequest): Observable<LoanApplicationResponse> {
    return this.http.post<LoanApplicationResponse>(
      `${this.endpoint}/${id}/approval`,
      request,
      AUTHORIZED
    )
  }

  disburse(id: string): Observable<LoanApplicationResponse> {
    return this.http.post<LoanApplicationResponse>(
      `${this.endpoint}/${id}/disbursement`,
      null,
      AUTHORIZED
    )
  }
}
