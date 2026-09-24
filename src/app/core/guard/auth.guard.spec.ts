import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { authGuard } from './auth.guard';
import { TokenService } from '../service/token.service';

describe('authGuard', () => {
  let routerMock: any;
  let tokenServiceMock: any;

  beforeEach(() => {
    routerMock = {
      parseUrl: vi.fn().mockReturnValue('mock-url-tree'),
    };

    tokenServiceMock = {
      get: vi.fn(),
    };
  });

  const executeGuard = (platformId: string) => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: platformId },
        { provide: Router, useValue: routerMock },
        { provide: TokenService, useValue: tokenServiceMock },
      ],
    });

    return TestBed.runInInjectionContext(() => {
      const routeMock = {} as ActivatedRouteSnapshot;
      const stateMock = {} as RouterStateSnapshot;

      return authGuard(routeMock, stateMock);
    });
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('harus mengembalikan true jika tidak berjalan di browser', () => {
    const result = executeGuard('server');
    expect(result).toBe(true);
  });

  it('harus mengembalikan true jika berjalan di browser dan memiliki token', () => {
    tokenServiceMock.get.mockReturnValue('valid-token');

    const result = executeGuard('browser');

    expect(result).toBe(true);
  });

  it('harus mengembalikan UrlTree ke /login jika berjalan di browser dan token tidak ada', () => {
    tokenServiceMock.get.mockReturnValue(null);

    const result = executeGuard('browser');

    expect(result).toBe('mock-url-tree');
    expect(routerMock.parseUrl).toHaveBeenCalledWith('/login');
  });
});
