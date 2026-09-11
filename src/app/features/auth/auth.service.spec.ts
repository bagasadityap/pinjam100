import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AuthService } from './auth.service';
import { TokenService } from '../../core/service/token.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  const tokenService = {
    set: vi.fn(),
    remove: vi.fn()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: TokenService, useValue: tokenService },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    vi.clearAllMocks();
  });

  it('should login successfully', () => {
    service.login({
      identityNumber: '12345',
      password: '1234567890'
    }).subscribe();

    const req = http.expectOne(`${environment.api.baseUrl}/auth/login`);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      identityNumber: '12345',
      password: '1234567890'
    });

    req.flush({
      token: 'test-token',
      identityNumber: '12345',
      role: 'SUPER_ADMIN',
      permissions: []
    });

    expect(tokenService.set).toHaveBeenCalledWith('test-token');
  });

  it('should return error when identity number or password is wrong', () => {
    service.login({
      identityNumber: '1234567',
      password: '1234567890'
    }).subscribe({
      error: error => {
        expect(error.status).toBe(401);
        expect(error.error.message).toBe('NIP atau password salah');
      }
    });

    const req = http.expectOne(`${environment.api.baseUrl}/auth/login`);

    req.flush(
      {
        status: 401,
        message: 'NIP atau password salah',
        error: 'Unauthorized'
      },
      {
        status: 401,
        statusText: 'Unauthorized'
      }
    );

    expect(tokenService.set).not.toHaveBeenCalled();
  });

  it('should return error when user is inactive', () => {
    service.login({
      identityNumber: '123456',
      password: '1234567890'
    }).subscribe({
      error: error => {
        expect(error.status).toBe(401);
        expect(error.error.message).toBe(
          'Status user tidak aktif, mohon menghungi administrator'
        );
      }
    });

    const req = http.expectOne(`${environment.api.baseUrl}/auth/login`);

    req.flush(
      {
        status: 401,
        message: 'Status user tidak aktif, mohon menghungi administrator',
        error: 'Unauthorized'
      },
      {
        status: 401,
        statusText: 'Unauthorized'
      }
    );

    expect(tokenService.set).not.toHaveBeenCalled();
  });
});
