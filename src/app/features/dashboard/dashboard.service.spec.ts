import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { of } from 'rxjs';

import { DashboardService } from './dashboard.service';
import { HttpNetwork } from '../../core/network/http.network';
import { environment } from '../../../environments/environment';
import { AUTHORIZED } from '../../core/http/http.context';
import { BaseResponse } from '../../core/model/base-response.model';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpNetworkMock: any;
  const endpoint = `${environment.api.baseUrl}/dashboard`;

  const mockDashboardData = { total: 100, active: 80 };
  const mockBaseResponse: BaseResponse<any> = {
    statusCode: 200,
    message: 'OK',
    data: mockDashboardData
  };

  beforeEach(() => {
    httpNetworkMock = {
      get: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        DashboardService,
        { provide: HttpNetwork, useValue: httpNetworkMock },
      ],
    });

    service = TestBed.inject(DashboardService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('getDashboard', () => {
    httpNetworkMock.get.mockReturnValue(of(mockBaseResponse));

    service.getDashboard().subscribe(res => {
      expect(res).toEqual(mockBaseResponse.data);
    });

    expect(httpNetworkMock.get).toHaveBeenCalledWith(endpoint, AUTHORIZED);
  });
});
