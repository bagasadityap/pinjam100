import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { of } from 'rxjs';

import { UserService } from './user.service';
import { HttpNetwork } from '../../core/network/http.network';
import { environment } from '../../../environments/environment';
import { AUTHORIZED } from '../../core/http/http.context';
import { BaseResponse } from '../../core/model/base-response.model';
import { UserRequest, UserResponse } from './user.model';

describe('UserService', () => {
  let service: UserService;
  let httpNetworkMock: any;
  const endpoint = `${environment.api.baseUrl}/user`;
  const mockId = '123';

  const mockUserResponse = { id: mockId, name: 'John Doe' } as unknown as UserResponse;
  const mockListResponse: BaseResponse<UserResponse[]> = {
    statusCode: 200,
    message: 'OK',
    data: [mockUserResponse],
  };
  const mockSingleResponse: BaseResponse<UserResponse> = {
    statusCode: 200,
    message: 'OK',
    data: mockUserResponse,
  };

  beforeEach(() => {
    httpNetworkMock = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [UserService, { provide: HttpNetwork, useValue: httpNetworkMock }],
    });

    service = TestBed.inject(UserService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('getAll', () => {
    httpNetworkMock.get.mockReturnValue(of(mockListResponse));

    service.getAll().subscribe((res) => {
      expect(res).toEqual(mockListResponse.data);
    });

    expect(httpNetworkMock.get).toHaveBeenCalledWith(endpoint, AUTHORIZED);
  });

  it('getById', () => {
    httpNetworkMock.get.mockReturnValue(of(mockSingleResponse));

    service.getById(mockId).subscribe((res) => {
      expect(res).toEqual(mockSingleResponse.data);
    });

    expect(httpNetworkMock.get).toHaveBeenCalledWith(`${endpoint}/${mockId}`, AUTHORIZED);
  });

  it('create', () => {
    const request = { name: 'John Doe', email: 'john@example.com' } as unknown as UserRequest;
    httpNetworkMock.post.mockReturnValue(of(mockSingleResponse));

    service.create(request).subscribe((res) => {
      expect(res).toEqual(mockSingleResponse.data);
    });

    expect(httpNetworkMock.post).toHaveBeenCalledWith(endpoint, request, AUTHORIZED);
  });

  it('update', () => {
    const request = { name: 'Jane Doe', email: 'jane@example.com' } as unknown as UserRequest;
    httpNetworkMock.put.mockReturnValue(of(mockSingleResponse));

    service.update(mockId, request).subscribe((res) => {
      expect(res).toEqual(mockSingleResponse.data);
    });

    expect(httpNetworkMock.put).toHaveBeenCalledWith(`${endpoint}/${mockId}`, request, AUTHORIZED);
  });

  it('updateActive', () => {
    httpNetworkMock.patch.mockReturnValue(of(mockSingleResponse));

    service.updateActive(mockId).subscribe((res) => {
      expect(res).toEqual(mockSingleResponse.data);
    });

    expect(httpNetworkMock.patch).toHaveBeenCalledWith(
      `${endpoint}/${mockId}/active`,
      null,
      AUTHORIZED,
    );
  });

  it('changeRole', () => {
    const roleId = 'role-123';
    httpNetworkMock.patch.mockReturnValue(of(mockSingleResponse));

    service.changeRole(mockId, roleId).subscribe((res) => {
      expect(res).toEqual(mockSingleResponse.data);
    });

    expect(httpNetworkMock.patch).toHaveBeenCalledWith(
      `${endpoint}/${mockId}/role`,
      roleId,
      AUTHORIZED,
    );
  });

  it('delete', () => {
    httpNetworkMock.delete.mockReturnValue(of(mockSingleResponse));

    service.delete(mockId).subscribe((res) => {
      expect(res).toEqual(mockSingleResponse.data);
    });

    expect(httpNetworkMock.delete).toHaveBeenCalledWith(`${endpoint}/${mockId}`, AUTHORIZED);
  });
});
