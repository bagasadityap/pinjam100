import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { AuthStateService } from './auth-state.service';
import { TokenService } from './token.service';

describe('AuthStateService', () => {
  let service: AuthStateService;
  let tokenServiceMock: any;

  const createMockToken = (payload: any) => {
    return `header.${btoa(JSON.stringify(payload))}.signature`;
  };

  beforeEach(() => {
    tokenServiceMock = {
      get: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [AuthStateService, { provide: TokenService, useValue: tokenServiceMock }],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('harus inisialisasi dengan role null dan permissions kosong jika tidak ada token', () => {
    tokenServiceMock.get.mockReturnValue(null);

    service = TestBed.inject(AuthStateService);

    expect(service.getRole()).toBeNull();
    expect(service.hasRole('ADMIN')).toBe(false);
    expect(service.hasPermission('READ')).toBe(false);
  });

  it('harus mengekstrak payload JWT dengan benar dan menyimpan state', () => {
    const mockToken = createMockToken({ role: 'ADMIN', permissions: ['READ', 'WRITE'] });
    tokenServiceMock.get.mockReturnValue(mockToken);

    service = TestBed.inject(AuthStateService);

    expect(service.getRole()).toBe('ADMIN');
    expect(service.hasRole('ADMIN')).toBe(true);
    expect(service.hasRole('USER')).toBe(false);

    expect(service.hasPermission('READ')).toBe(true);
    expect(service.hasPermission('WRITE')).toBe(true);
    expect(service.hasPermission('DELETE')).toBe(false);
  });

  it('harus menangani payload JWT tanpa properti role dan permissions (default fallback)', () => {
    const mockToken = createMockToken({ sub: '123' });
    tokenServiceMock.get.mockReturnValue(mockToken);

    service = TestBed.inject(AuthStateService);

    expect(service.getRole()).toBeNull();
    expect(service.hasPermission('READ')).toBe(false);
  });

  it('harus kembali ke state default jika token malformed (memicu catch error)', () => {
    tokenServiceMock.get.mockReturnValue('invalid.token.format.that.fails.atob');

    service = TestBed.inject(AuthStateService);

    expect(service.getRole()).toBeNull();
    expect(service.hasPermission('READ')).toBe(false);
  });
});
