import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {

  get(): string | null {
    if (typeof document === 'undefined') {
      return null;
    }

    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='));

    if (!cookie) {
      return null;
    }

    return decodeURIComponent(cookie.substring(6));
  }

  set(token: string): void {
    document.cookie = `token=${encodeURIComponent(token)}; path=/`;
  }

  remove(): void {
    document.cookie = 'token=; path=/; max-age=0';
  }

}
