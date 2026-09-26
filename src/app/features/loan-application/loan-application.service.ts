import { inject, Injectable } from '@angular/core';
import { HttpNetwork } from '../../core/network/http.network';
import { environment } from '../../../environments/environment';
import { Observable, map } from 'rxjs';
import {
  LoanApplicationApprovalResponse,
  LoanApplicationDisbursementResponse,
  LoanApplicationResponse,
  LoanApplicationReviewResponse,
} from './loan-application.model';
import { AUTHORIZED } from '../../core/http/http.context';
import { ReviewRequest } from './review/review.model';
import { ApprovalRequest } from './approval/approval.model';
import { BaseResponse } from '../../core/model/base-response.model';

@Injectable({
  providedIn: 'root',
})
export class LoanApplicationService {
  private readonly http = inject(HttpNetwork);
  private readonly endpoint = `${environment.api.baseUrl}/loan-application`;

  getAll(): Observable<LoanApplicationResponse[]> {
    return this.http
      .get<BaseResponse<LoanApplicationResponse[]>>(`${this.endpoint}`, AUTHORIZED)
      .pipe(map((response) => response.data));
  }

  getAllForReview(): Observable<LoanApplicationResponse[]> {
    return this.http
      .get<BaseResponse<LoanApplicationResponse[]>>(`${this.endpoint}/review`, AUTHORIZED)
      .pipe(map((response) => response.data));
  }

  getAllForApproval(): Observable<LoanApplicationResponse[]> {
    return this.http
      .get<BaseResponse<LoanApplicationResponse[]>>(`${this.endpoint}/approval`, AUTHORIZED)
      .pipe(map((response) => response.data));
  }

  getAllForDisbursement(): Observable<LoanApplicationResponse[]> {
    return this.http
      .get<BaseResponse<LoanApplicationResponse[]>>(`${this.endpoint}/disbursement`, AUTHORIZED)
      .pipe(map((response) => response.data));
  }

  getById(id: string): Observable<LoanApplicationResponse> {
    return this.http
      .get<BaseResponse<LoanApplicationResponse>>(`${this.endpoint}/${id}`, AUTHORIZED)
      .pipe(map((response) => response.data));
  }

  getByBranch(id: string): Observable<LoanApplicationResponse[]> {
    return this.http
      .get<BaseResponse<LoanApplicationResponse[]>>(`${this.endpoint}/${id}/branch`, AUTHORIZED)
      .pipe(map((response) => response.data));
  }

  getByCustomer(id: string): Observable<LoanApplicationResponse[]> {
    return this.http
      .get<BaseResponse<LoanApplicationResponse[]>>(`${this.endpoint}/${id}/customer`, AUTHORIZED)
      .pipe(map((response) => response.data));
  }

  getForReview(id: string): Observable<LoanApplicationReviewResponse> {
    return this.http
      .get<BaseResponse<LoanApplicationReviewResponse>>(`${this.endpoint}/${id}/review`, AUTHORIZED)
      .pipe(map((response) => response.data));
  }

  getForApproval(id: string): Observable<LoanApplicationApprovalResponse> {
    return this.http
      .get<BaseResponse<LoanApplicationApprovalResponse>>(
        `${this.endpoint}/${id}/approval`,
        AUTHORIZED,
      )
      .pipe(map((response) => response.data));
  }

  getForDisbursement(id: string): Observable<LoanApplicationDisbursementResponse> {
    return this.http
      .get<BaseResponse<LoanApplicationDisbursementResponse>>(
        `${this.endpoint}/${id}/disbursement`,
        AUTHORIZED,
      )
      .pipe(map((response) => response.data));
  }

  review(id: string, request: ReviewRequest): Observable<LoanApplicationResponse> {
    return this.http
      .post<BaseResponse<LoanApplicationResponse>>(
        `${this.endpoint}/${id}/review`,
        request,
        AUTHORIZED,
      )
      .pipe(map((response) => response.data));
  }

  approve(id: string, request: ApprovalRequest): Observable<LoanApplicationResponse> {
    return this.http
      .post<BaseResponse<LoanApplicationResponse>>(
        `${this.endpoint}/${id}/approval`,
        request,
        AUTHORIZED,
      )
      .pipe(map((response) => response.data));
  }

  disburse(id: string): Observable<LoanApplicationResponse> {
    return this.http
      .post<BaseResponse<LoanApplicationResponse>>(
        `${this.endpoint}/${id}/disbursement`,
        null,
        AUTHORIZED,
      )
      .pipe(map((response) => response.data));
  }
}
