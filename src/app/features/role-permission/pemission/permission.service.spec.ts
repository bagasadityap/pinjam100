import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { of } from 'rxjs';

import { PermissionService } from './permission.service';
import { HttpNetwork } from '../../../core/network/http.network';
import { environment } from '../../../../environments/environment';
import { AUTHORIZED } from '../../../core/http/http.context';
import { BaseResponse } from '../../../core/model/base-response.model';
import { PermissionResponse } from './permission.model';

describe('PermissionService', () => {
  let service: PermissionService;
  let httpNetworkMock: any;
  const endpoint = `${environment.api.baseUrl}/permission`;
  const mockId = '123';

  const mockPermissionResponse = { id: 'perm-1', name: 'CREATE_USER' } as unknown as PermissionResponse;

  const mockListResponse: BaseResponse<PermissionResponse[]> = {
    statusCode: 200,
    message: 'OK',
    data: [mockPermissionResponse]
  };

  const mockSingleResponse: BaseResponse<PermissionResponse> = {
    statusCode: 200,
    message: 'OK',
    data: mockPermissionResponse
  };

  beforeEach(() => {
    httpNetworkMock = {
      get: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        PermissionService,
        { provide: HttpNetwork, useValue: httpNetworkMock },
      ],
    });

    service = TestBed.inject(PermissionService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('getAll', () => {
    httpNetworkMock.get.mockReturnValue(of(mockListResponse));

    service.getAll().subscribe(res => {
      expect(res).toEqual(mockListResponse.data);
    });

    expect(httpNetworkMock.get).toHaveBeenCalledWith(endpoint, AUTHORIZED);
  });

  it('getAllByRoleId', () => {
    httpNetworkMock.get.mockReturnValue(of(mockSingleResponse));

    service.getAllByRoleId(mockId).subscribe(res => {
      expect(res).toEqual(mockSingleResponse.data);
    });

    expect(httpNetworkMock.get).toHaveBeenCalledWith(`${endpoint}/${mockId}/role`, AUTHORIZED);
  });
});
