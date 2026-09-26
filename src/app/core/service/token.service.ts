import { Injectable, inject, PLATFORM_ID, REQUEST } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private platformId = inject(PLATFORM_ID);
  private request = inject(REQUEST, { optional: true });

  private getCookieValue(name: string): string | null {
    let cookieHeader: string | null | undefined;

    if (isPlatformBrowser(this.platformId)) {
      cookieHeader = document.cookie;
    } else {
      cookieHeader = this.request?.headers.get('cookie');
    }

    if (!cookieHeader) {
      return null;
    }

    const cookie = cookieHeader.split('; ').find((row) => row.startsWith(`${name}=`));

    if (!cookie) {
      return null;
    }

    return decodeURIComponent(cookie.substring(name.length + 1));
  }

  get(): string | null {
    return this.getCookieValue('token');
  }

  getRefreshToken(): string | null {
    return this.getCookieValue('refreshToken');
  }

  set(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      document.cookie = `token=${encodeURIComponent(token)}; path=/`;
    }
  }

  setRefreshToken(refreshToken: string): void {
    if (isPlatformBrowser(this.platformId)) {
      document.cookie = `refreshToken=${encodeURIComponent(refreshToken)}; path=/`;
    }
  }

  remove(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.cookie = 'token=; path=/; max-age=0';
      document.cookie = 'refreshToken=; path=/; max-age=0';
    }
  }
}
