import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpNetwork } from '../network/http.network';
import { Observable, map } from 'rxjs';
import { Document } from '../model/document.model';
import { AUTHORIZED } from '../http/http.context';
import { BaseResponse } from '../model/base-response.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private readonly http = inject(HttpNetwork);
  private readonly endpoint = `${environment.api.baseUrl}/document`;

  verifyDocument(documentId: string, status: string): Observable<Document> {
    return this.http
      .put<BaseResponse<Document>>(`${this.endpoint}/${documentId}/verify`, status, AUTHORIZED)
      .pipe(map((response) => response.data));
  }
}
