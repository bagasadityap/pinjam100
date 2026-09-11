import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpNetwork } from "../network/http.network";
import { Observable } from "rxjs";
import { Document } from '../model/document.model';
import { AUTHORIZED } from "../http/http.context";

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private readonly http = inject(HttpNetwork);
  private readonly endpoint = `${environment.api.baseUrl}/document`;

  verifyDocument(documentId: string, status: string): Observable<Document> {
    return this.http.put<Document>(
      `${this.endpoint}/${documentId}/verify`,
      status,
      AUTHORIZED
    );
  }
}
