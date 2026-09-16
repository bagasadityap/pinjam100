import { Injectable, inject } from '@angular/core';
import { Observable} from 'rxjs';
import { HttpNetwork } from '../../core/network/http.network';
import { environment } from '../../../environments/environment';
import { PUBLIC } from '../../core/http/http.context';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService {
  private readonly http = inject(HttpNetwork);
  private readonly endpoint = environment.api.baseUrl

  resetPassword(request: ResetPasswordRequest): Observable<void> {
    return this.http.post<void>(
      `${this.endpoint}/auth/customer/reset-password`,
      request,
      PUBLIC
    )
  }
}
