import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { of } from 'rxjs';

import { RoleService } from './role.service';
import { HttpNetwork } from '../../core/network/http.network';
import { environment } from '../../../environments/environment';
import { AUTHORIZED } from '../../core/http/http.context';
import { BaseResponse } from '../../core/model/base-response.model';
import { RoleRequest, RoleResponse } from './role.model';

describe('RoleService', () => {
  let service: RoleService;
  let httpNetworkMock: any;
  const endpoint = `${environment.api.baseUrl}/role`;
  const mockId = '123';

  const mockRoleResponse = { id: mockId, name: 'ADMIN' } as unknown as RoleResponse;
  const mockListResponse: BaseResponse<RoleResponse[]> = {
    statusCode: 200,
    message: 'OK',
    data: [mockRoleResponse],
  };
  const mockSingleResponse: BaseResponse<RoleResponse> = {
    statusCode: 200,
    message: 'OK',
    data: mockRoleResponse,
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
      providers: [RoleService, { provide: HttpNetwork, useValue: httpNetworkMock }],
    });

    service = TestBed.inject(RoleService);
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
    const request = { name: 'ADMIN' } as unknown as RoleRequest;
    httpNetworkMock.post.mockReturnValue(of(mockSingleResponse));

    service.create(request).subscribe((res) => {
      expect(res).toEqual(mockSingleResponse.data);
    });

    expect(httpNetworkMock.post).toHaveBeenCalledWith(endpoint, request, AUTHORIZED);
  });

  it('update', () => {
    const request = { name: 'SUPER_ADMIN' } as unknown as RoleRequest;
    httpNetworkMock.put.mockReturnValue(of(mockSingleResponse));

    service.update(mockId, request).subscribe((res) => {
      expect(res).toEqual(mockSingleResponse.data);
    });

    expect(httpNetworkMock.put).toHaveBeenCalledWith(`${endpoint}/${mockId}`, request, AUTHORIZED);
  });

  it('updatePermission', () => {
    const permissions = ['CREATE_USER', 'DELETE_USER'];
    httpNetworkMock.patch.mockReturnValue(of(mockSingleResponse));

    service.updatePermission(mockId, permissions).subscribe((res) => {
      expect(res).toEqual(mockSingleResponse.data);
    });

    expect(httpNetworkMock.patch).toHaveBeenCalledWith(
      `${endpoint}/${mockId}/permission`,
      { permissions },
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
