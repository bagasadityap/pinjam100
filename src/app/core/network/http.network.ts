import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ACCESS, ApiAccess, AUTHORIZED } from '../http/http.context'

@Injectable({
  providedIn: 'root',
})
export class HttpNetwork {
  private readonly http = inject(HttpClient);

  get<T>(url: string, access: ApiAccess = AUTHORIZED): Observable<T> {
    return this.http.get<T>(url, {
      context: new HttpContext().set(API_ACCESS, access),
    });
  }

  post<T>(url: string, body: unknown, access: ApiAccess = AUTHORIZED): Observable<T> {
    return this.http.post<T>(url, body, {
      context: new HttpContext().set(API_ACCESS, access),
    });
  }

  put<T>(url: string, body: unknown, access: ApiAccess = AUTHORIZED): Observable<T> {
    return this.http.put<T>(url, body, {
      context: new HttpContext().set(API_ACCESS, access),
    });
  }

  patch<T>(url: string, body: unknown, access: ApiAccess = AUTHORIZED): Observable<T> {
    return this.http.patch<T>(url, body, {
      context: new HttpContext().set(API_ACCESS, access),
    });
  }

  delete<T>(url: string, access: ApiAccess = AUTHORIZED): Observable<T> {
    return this.http.delete<T>(url, {
      context: new HttpContext().set(API_ACCESS, access),
    });
  }
}
