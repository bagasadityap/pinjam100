import { inject, Injectable } from "@angular/core";
import { HttpNetwork } from "../../core/network/http.network";
import { Observable, map } from "rxjs";
import { BranchRequest, BranchResponse } from "./branch.model";
import { environment } from "../../../environments/environment";
import { AUTHORIZED } from "../../core/http/http.context";
import { BaseResponse } from "../../core/model/base-response.model";

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private readonly http = inject(HttpNetwork);
  private readonly endpoint = `${environment.api.baseUrl}/branch`;

  getAll(): Observable<BranchResponse[]> {
    return this.http.get<BaseResponse<BranchResponse[]>>(
      `${this.endpoint}`,
      AUTHORIZED
    ).pipe(
      map(response => response.data)
    );
  }

  getById(id: string): Observable<BranchResponse> {
    return this.http.get<BaseResponse<BranchResponse>>(
      `${this.endpoint}/${id}`,
      AUTHORIZED
    ).pipe(
      map(response => response.data)
    );
  }

  create(request: BranchRequest): Observable<BranchResponse> {
    return this.http.post<BaseResponse<BranchResponse>>(
      this.endpoint,
      request,
      AUTHORIZED
    ).pipe(
      map(response => response.data)
    );
  }

  update(id: string, request: BranchRequest): Observable<BranchResponse> {
    return this.http.put<BaseResponse<BranchResponse>>(
      `${this.endpoint}/${id}`,
      request,
      AUTHORIZED
    ).pipe(
      map(response => response.data)
    );
  }

  delete(id: string): Observable<BranchResponse> {
    return this.http.delete<BaseResponse<BranchResponse>>(
      `${this.endpoint}/${id}`,
      AUTHORIZED
    ).pipe(
      map(response => response.data)
    );
  }
}
