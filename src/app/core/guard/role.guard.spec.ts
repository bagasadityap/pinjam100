import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { roleGuard } from './role.guard';
import { AuthStateService } from '../service/auth-state.service';

describe('roleGuard (Vitest)', () => {
  let routerMock: any;
  let authStateMock: any;

  beforeEach(() => {
    routerMock = {
      createUrlTree: vi.fn().mockReturnValue('mock-url-tree'),
    };

    authStateMock = {
      getRole: vi.fn(),
    };
  });

  const executeGuard = (platformId: string, routeData: any) => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: platformId },
        { provide: Router, useValue: routerMock },
        { provide: AuthStateService, useValue: authStateMock },
      ],
    });

    return TestBed.runInInjectionContext(() => {
      const routeMock = { data: routeData } as unknown as ActivatedRouteSnapshot;
      const stateMock = {} as RouterStateSnapshot;

      return roleGuard(routeMock, stateMock);
    });
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('harus mengembalikan true jika berjalan selain di browser (misal: SSR/Server)', () => {
    const result = executeGuard('server', { roles: ['ADMIN'] });

    expect(result).toBe(true);
  });

  it('harus mengembalikan true jika berjalan di browser DAN role pengguna cocok', () => {
    authStateMock.getRole.mockReturnValue('ADMIN');

    const result = executeGuard('browser', { roles: ['ADMIN', 'MANAGER'] });

    expect(result).toBe(true);
  });

  it('harus me-redirect ke /forbidden jika role pengguna tidak cocok', () => {
    authStateMock.getRole.mockReturnValue('STAFF');

    const result = executeGuard('browser', { roles: ['ADMIN', 'MANAGER'] });

    expect(result).toBe('mock-url-tree');
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/forbidden']);
  });

  it('harus me-redirect ke /forbidden jika pengguna tidak memiliki role (null/undefined)', () => {
    authStateMock.getRole.mockReturnValue(null);

    const result = executeGuard('browser', { roles: ['ADMIN'] });

    expect(result).toBe('mock-url-tree');
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/forbidden']);
  });
});
