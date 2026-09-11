import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { Login } from './login';
import { AuthService } from '../auth.service';
import { TokenService } from '../../../core/service/token.service';
import { environment } from '../../../../environments/environment';

describe('Login Integration', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let http: HttpTestingController;

  const router = {
    navigate: vi.fn()
  };

  const tokenService = {
    set: vi.fn(),
    remove: vi.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        AuthService,
        {
          provide: Router,
          useValue: router
        },
        {
          provide: TokenService,
          useValue: tokenService
        },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);

    fixture.detectChanges();
  });

  afterEach(() => {
    http.verify();
    vi.clearAllMocks();
  });

  it('should login successfully', () => {
    component.identityNumber = '12345';
    component.password = '1234567890';

    component.login();

    const request = http.expectOne(
      `${environment.api.baseUrl}/auth/login`
    );

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      identityNumber: '12345',
      password: '1234567890'
    });

    request.flush({
      token: 'test-token',
      identityNumber: '12345',
      role: 'SUPER_ADMIN',
      permissions: []
    });

    expect(tokenService.set).toHaveBeenCalledWith('test-token');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.errorMessage()).toBe('');
    expect(component.loading()).toBe(false);
  });

  it('should show error when identity number or password is wrong', () => {
    component.identityNumber = '1234567';
    component.password = '1234567890';

    component.login();

    const request = http.expectOne(
      `${environment.api.baseUrl}/auth/login`
    );

    request.flush(
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

    expect(component.errorMessage()).toBe(
      'NIP atau password salah'
    );

    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.loading()).toBe(false);
  });

  it('should show error when user is inactive', () => {
    component.identityNumber = '123456';
    component.password = '1234567890';

    component.login();

    const request = http.expectOne(
      `${environment.api.baseUrl}/auth/login`
    );

    request.flush(
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

    expect(component.errorMessage()).toBe(
      'Status user tidak aktif, mohon menghungi administrator'
    );

    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.loading()).toBe(false);
  });

  it('should show validation error when login is empty', () => {
    component.identityNumber = '';
    component.password = '';

    component.login();

    expect(component.errorMessage()).toBe(
      'NIP dan password wajib diisi.'
    );

    expect(component.loading()).toBe(false);

    expect(http.match(() => true)).toHaveLength(0);
  });
});
