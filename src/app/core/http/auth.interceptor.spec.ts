import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { authInterceptor } from './auth.interceptor';
import { TokenService } from '../service/token.service';
import { AuthService } from '../../features/auth/auth.service';
import { API_ACCESS, AUTHORIZED } from './http.context';

describe('authInterceptor (Vitest)', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  let tokenServiceMock: any;
  let authServiceMock: any;
  let routerMock: any;

  const mockUrl = '/api/data';

  beforeEach(() => {
    tokenServiceMock = {
      get: vi.fn(),
      getRefreshToken: vi.fn(),
      remove: vi.fn(),
    };

    authServiceMock = {
      refreshToken: vi.fn(),
    };

    routerMock = {
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: TokenService, useValue: tokenServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    vi.clearAllMocks();
  });

  it('harus meneruskan request tanpa mengubah header jika API_ACCESS bukan AUTHORIZED', () => {
    // PERBAIKAN: Secara eksplisit set context agar BUKAN AUTHORIZED
    const context = new HttpContext().set(API_ACCESS, 'PUBLIC' as any);

    http.get(mockUrl, { context }).subscribe();

    const req = httpMock.expectOne(mockUrl);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('harus membatalkan request (mengembalikan EMPTY) jika token tidak ada', () => {
    tokenServiceMock.get.mockReturnValue(null);
    const context = new HttpContext().set(API_ACCESS, AUTHORIZED);

    http.get(mockUrl, { context }).subscribe();
    httpMock.expectNone(mockUrl);
  });

  it('harus menambahkan header Authorization Bearer jika ada token', () => {
    tokenServiceMock.get.mockReturnValue('mock-token');
    const context = new HttpContext().set(API_ACCESS, AUTHORIZED);

    http.get(mockUrl, { context }).subscribe();

    const req = httpMock.expectOne(mockUrl);
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush({});
  });

  it('harus meneruskan error jika status error BUKAN 401', () => {
    tokenServiceMock.get.mockReturnValue('mock-token');
    const context = new HttpContext().set(API_ACCESS, AUTHORIZED);

    http.get(mockUrl, { context }).subscribe({
      error: (err: HttpErrorResponse) => {
        expect(err.status).toBe(500);
      },
    });

    const req = httpMock.expectOne(mockUrl);
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('harus menghapus token dan redirect ke login jika 401 dan tidak ada refresh token', () => {
    tokenServiceMock.get.mockReturnValue('mock-token');
    tokenServiceMock.getRefreshToken.mockReturnValue(null);
    const context = new HttpContext().set(API_ACCESS, AUTHORIZED);

    http.get(mockUrl, { context }).subscribe();

    const req = httpMock.expectOne(mockUrl);
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(tokenServiceMock.remove).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('harus memanggil refreshToken() dan mengulangi request dengan token baru jika 401 terjadi', () => {
    tokenServiceMock.get.mockReturnValue('old-token');
    tokenServiceMock.getRefreshToken.mockReturnValue('mock-refresh-token');
    authServiceMock.refreshToken.mockReturnValue(of({ token: 'new-token' }));

    const context = new HttpContext().set(API_ACCESS, AUTHORIZED);

    http.get(mockUrl, { context }).subscribe();

    const req1 = httpMock.expectOne(mockUrl);
    expect(req1.request.headers.get('Authorization')).toBe('Bearer old-token');
    req1.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(authServiceMock.refreshToken).toHaveBeenCalled();

    const req2 = httpMock.expectOne(mockUrl);
    expect(req2.request.headers.get('Authorization')).toBe('Bearer new-token');
    req2.flush({});
  });

  it('harus menghapus token dan redirect ke login jika proses refreshToken() gagal', () => {
    tokenServiceMock.get.mockReturnValue('old-token');
    tokenServiceMock.getRefreshToken.mockReturnValue('mock-refresh-token');
    authServiceMock.refreshToken.mockReturnValue(throwError(() => new Error('Refresh failed')));

    const context = new HttpContext().set(API_ACCESS, AUTHORIZED);

    http.get(mockUrl, { context }).subscribe({
      error: (err) => {
        expect(err.message).toBe('Refresh failed');
      }
    });

    const req = httpMock.expectOne(mockUrl);
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(authServiceMock.refreshToken).toHaveBeenCalled();
    expect(tokenServiceMock.remove).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
