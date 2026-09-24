import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { of } from 'rxjs';

import { CustomerService } from './customer.service';
import { HttpNetwork } from '../../core/network/http.network';
import { environment } from '../../../environments/environment';
import { AUTHORIZED } from '../../core/http/http.context';
import { BaseResponse } from '../../core/model/base-response.model';
import { CustomerResponse, CustomerDetailResponse } from './customer.model';

describe('CustomerService', () => {
  let service: CustomerService;
  let httpNetworkMock: any;
  const endpoint = `${environment.api.baseUrl}/customer`;
  const mockId = '123';

  const mockCustomerData = { id: mockId, fullName: 'John Doe' } as unknown as CustomerResponse;
  const mockCustomerDetailData = { id: mockId, fullName: 'John Doe', detail: {} } as unknown as CustomerDetailResponse;

  const mockListResponse: BaseResponse<CustomerResponse[]> = { statusCode: 200, message: 'OK', data: [mockCustomerData] };
  const mockSingleResponse: BaseResponse<CustomerResponse> = { statusCode: 200, message: 'OK', data: mockCustomerData };
  const mockDetailResponse: BaseResponse<CustomerDetailResponse> = { statusCode: 200, message: 'OK', data: mockCustomerDetailData };

  beforeEach(() => {
    httpNetworkMock = {
      get: vi.fn(),
      put: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        CustomerService,
        { provide: HttpNetwork, useValue: httpNetworkMock },
      ],
    });

    service = TestBed.inject(CustomerService);
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

  it('getPending', () => {
    httpNetworkMock.get.mockReturnValue(of(mockListResponse));

    service.getPending().subscribe(res => {
      expect(res).toEqual(mockListResponse.data);
    });

    expect(httpNetworkMock.get).toHaveBeenCalledWith(`${endpoint}/pending`, AUTHORIZED);
  });

  it('getVerifiedAndLimitIsNull', () => {
    httpNetworkMock.get.mockReturnValue(of(mockListResponse));

    service.getVerifiedAndLimitIsNull().subscribe(res => {
      expect(res).toEqual(mockListResponse.data);
    });

    expect(httpNetworkMock.get).toHaveBeenCalledWith(`${endpoint}/verified-limit-null`, AUTHORIZED);
  });

  it('getById', () => {
    httpNetworkMock.get.mockReturnValue(of(mockSingleResponse));

    service.getById(mockId).subscribe(res => {
      expect(res).toEqual(mockSingleResponse.data);
    });

    expect(httpNetworkMock.get).toHaveBeenCalledWith(`${endpoint}/${mockId}`, AUTHORIZED);
  });

  it('getDetailById', () => {
    httpNetworkMock.get.mockReturnValue(of(mockDetailResponse));

    service.getDetailById(mockId).subscribe(res => {
      expect(res).toEqual(mockDetailResponse.data);
    });

    expect(httpNetworkMock.get).toHaveBeenCalledWith(`${endpoint}/${mockId}/detail`, AUTHORIZED);
  });

  it('verifyCustomer', () => {
    const status = 'VERIFIED';
    httpNetworkMock.put.mockReturnValue(of(mockDetailResponse));

    service.verifyCustomer(mockId, status).subscribe(res => {
      expect(res).toEqual(mockDetailResponse.data);
    });

    expect(httpNetworkMock.put).toHaveBeenCalledWith(`${endpoint}/${mockId}/verify`, status, AUTHORIZED);
  });

  it('getDocument', () => {
    const fileUrl = 'docs/123.pdf';
    const expectedUrl = `${environment.api.documentUrl}/${fileUrl}`;

    const result = service.getDocument(fileUrl);

    expect(result).toBe(expectedUrl);
  });
});
