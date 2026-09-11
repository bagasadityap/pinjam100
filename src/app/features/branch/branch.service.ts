import { inject, Injectable } from "@angular/core";
import { HttpNetwork } from "../../core/network/http.network";
import { Observable } from "rxjs";
import { BranchRequest, BranchResponse } from "./branch.model";
import { environment } from "../../../environments/environment";
import { AUTHORIZED } from "../../core/http/http.context";

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private readonly http = inject(HttpNetwork);
  private readonly endpoint = `${environment.api.baseUrl}/branch`;

  getAll(): Observable<BranchResponse[]> {
    return this.http.get<BranchResponse[]>(
      `${this.endpoint}`,
      AUTHORIZED
    )
  }

  getById(id: string): Observable<BranchResponse> {
    return this.http.get<BranchResponse>(
      `${this.endpoint}/${id}`,
      AUTHORIZED
    );
  }

  create(request: BranchRequest): Observable<BranchResponse> {
    return this.http.post<BranchResponse>(
      this.endpoint,
      request,
      AUTHORIZED
    );
  }

  update(id: string, request: BranchRequest): Observable<BranchResponse> {
    return this.http.put<BranchResponse>(
      `${this.endpoint}/${id}`,
      request,
      AUTHORIZED
    );
  }

  delete(id: string): Observable<BranchResponse> {
    return this.http.delete<BranchResponse>(
      `${this.endpoint}/${id}`,
      AUTHORIZED
    );
  }
}
