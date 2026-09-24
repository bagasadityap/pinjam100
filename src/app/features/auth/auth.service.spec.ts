import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { of } from 'rxjs';

import { AuthService } from './auth.service';
import { HttpNetwork } from '../../core/network/http.network';
import { TokenService } from '../../core/service/token.service';
import { environment } from '../../../environments/environment';
import { PUBLIC, AUTHORIZED } from '../../core/http/http.context';
import { AuthResponse, LoginRequest } from './auth.model';
import { BaseResponse } from '../../core/model/base-response.model';
import { UserResponse } from '../user/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpNetworkMock: any;
  let tokenServiceMock: any;

  const mockAuthData: AuthResponse = {
    token: 'mock-token',
    refreshToken: 'mock-refresh-token',
    identityNumber: '123456789',
    role: 'ADMIN',
    permissions: ['READ', 'WRITE']
  };

  const mockBaseAuthResponse: BaseResponse<AuthResponse> = {
    statusCode: 200,
    message: 'Success',
    data: mockAuthData
  };

  beforeEach(() => {
    httpNetworkMock = {
      post: vi.fn(),
      get: vi.fn(),
    };

    tokenServiceMock = {
      set: vi.fn(),
      setRefreshToken: vi.fn(),
      getRefreshToken: vi.fn(),
      remove: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpNetwork, useValue: httpNetworkMock },
        { provide: TokenService, useValue: tokenServiceMock },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('login', () => {
    const loginRequest: LoginRequest = { identityNumber: '123456789', password: 'password123' };
    httpNetworkMock.post.mockReturnValue(of(mockBaseAuthResponse));

    let result: AuthResponse | undefined;
    service.login(loginRequest).subscribe(res => {
      result = res;
    });

    expect(httpNetworkMock.post).toHaveBeenCalledWith(
      `${environment.api.baseUrl}/auth/login`,
      loginRequest,
      PUBLIC
    );
    expect(result).toEqual(mockAuthData);
    expect(tokenServiceMock.set).toHaveBeenCalledWith(mockAuthData.token);
    expect(tokenServiceMock.setRefreshToken).toHaveBeenCalledWith(mockAuthData.refreshToken);
  });

  it('refreshToken', () => {
    const oldRefreshToken = 'old-refresh-token';
    tokenServiceMock.getRefreshToken.mockReturnValue(oldRefreshToken);
    httpNetworkMock.post.mockReturnValue(of(mockBaseAuthResponse));

    let result: AuthResponse | undefined;
    service.refreshToken().subscribe(res => {
      result = res;
    });

    expect(tokenServiceMock.getRefreshToken).toHaveBeenCalled();
    expect(httpNetworkMock.post).toHaveBeenCalledWith(
      `${environment.api.baseUrl}/auth/refresh`,
      { refreshToken: oldRefreshToken },
      PUBLIC
    );
    expect(result).toEqual(mockAuthData);
    expect(tokenServiceMock.set).toHaveBeenCalledWith(mockAuthData.token);
    expect(tokenServiceMock.setRefreshToken).toHaveBeenCalledWith(mockAuthData.refreshToken);
  });

  it('logout', () => {
    const currentRefreshToken = 'current-refresh-token';
    const mockBaseLogoutResponse: BaseResponse<void> = {
      statusCode: 200,
      message: 'Logged out successfully',
      data: undefined as void
    };

    tokenServiceMock.getRefreshToken.mockReturnValue(currentRefreshToken);
    httpNetworkMock.post.mockReturnValue(of(mockBaseLogoutResponse));

    let isCompleted = false;
    service.logout().subscribe(() => {
      isCompleted = true;
    });

    expect(tokenServiceMock.getRefreshToken).toHaveBeenCalled();
    expect(httpNetworkMock.post).toHaveBeenCalledWith(
      `${environment.api.baseUrl}/auth/logout`,
      { refreshToken: currentRefreshToken },
      AUTHORIZED
    );
    expect(tokenServiceMock.remove).toHaveBeenCalled();
    expect(isCompleted).toBe(true);
  });

  it('getCurrentUser', () => {
    const mockUserData = { id: 1, name: 'John Doe' } as unknown as UserResponse;
    const mockBaseUserResponse: BaseResponse<UserResponse> = {
      statusCode: 200,
      message: 'Success',
      data: mockUserData
    };

    httpNetworkMock.get.mockReturnValue(of(mockBaseUserResponse));

    let result: UserResponse | undefined;
    service.getCurrentUser().subscribe(res => {
      result = res;
    });

    expect(httpNetworkMock.get).toHaveBeenCalledWith(
      `${environment.api.baseUrl}/auth/get-current-user`,
      AUTHORIZED
    );
    expect(result).toEqual(mockUserData);
  });
});
