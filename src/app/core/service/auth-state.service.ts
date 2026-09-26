import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TokenService } from './token.service';

interface JwtPayload {
  sub?: string;
  role?: string;
  permissions?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private readonly tokenService = inject(TokenService);

  private readonly roleSubject = new BehaviorSubject<string | null>(null);

  private readonly permissionsSubject = new BehaviorSubject<string[]>([]);

  readonly role$ = this.roleSubject.asObservable();
  readonly permissions$ = this.permissionsSubject.asObservable();

  constructor() {
    this.loadFromToken();
  }

  private loadFromToken(): void {
    const token = this.tokenService.get();

    if (!token) {
      this.roleSubject.next(null);
      this.permissionsSubject.next([]);
      return;
    }

    try {
      const payload = this.decodeToken(token);

      this.roleSubject.next(payload.role ?? null);
      this.permissionsSubject.next(payload.permissions ?? []);
    } catch {
      this.roleSubject.next(null);
      this.permissionsSubject.next([]);
    }
  }

  getRole(): string | null {
    return this.roleSubject.value;
  }

  hasRole(role: string): boolean {
    return this.getRole() === role;
  }

  hasPermission(permission: string): boolean {
    return this.permissionsSubject.value.includes(permission);
  }

  private decodeToken(token: string): JwtPayload {
    const payload = token.split('.')[1];

    return JSON.parse(atob(payload));
  }
}
