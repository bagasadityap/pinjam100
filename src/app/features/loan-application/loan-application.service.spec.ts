import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { of } from 'rxjs';

import { LoanApplicationService } from './loan-application.service';
import { HttpNetwork } from '../../core/network/http.network';
import { environment } from '../../../environments/environment';
import { AUTHORIZED } from '../../core/http/http.context';
import { BaseResponse } from '../../core/model/base-response.model';
import { ReviewRequest } from './review/review.model';
import { ApprovalRequest } from './approval/approval.model';

describe('LoanApplicationService', () => {
  let service: LoanApplicationService;
  let httpNetworkMock: any;
  const endpoint = `${environment.api.baseUrl}/loan-application`;
  const mockId = '123';

  const mockData = { id: mockId, status: 'PENDING' };
  const mockListResponse: BaseResponse<any[]> = {
    statusCode: 200,
    message: 'OK',
    data: [mockData],
  };
  const mockSingleResponse: BaseResponse<any> = { statusCode: 200, message: 'OK', data: mockData };

  beforeEach(() => {
    httpNetworkMock = {
      get: vi.fn(),
      post: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [LoanApplicationService, { provide: HttpNetwork, useValue: httpNetworkMock }],
    });

    service = TestBed.inject(LoanApplicationService);
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

  it('getAllForReview', () => {
    httpNetworkMock.get.mockReturnValue(of(mockListResponse));

    service.getAllForReview().subscribe((res) => {
      expect(res).toEqual(mockListResponse.data);
    });

    expect(httpNetworkMock.get).toHaveBeenCalledWith(`${endpoint}/review`, AUTHORIZED);
  });

  it('getAllForApproval', () => {
    httpNetworkMock.get.mockReturnValue(of(mockListResponse));

    service.getAllForApproval().subscribe((res) => {
      expect(res).toEqual(mockListResponse.data);
    });

    expect(httpNetworkMock.get).toHaveBeenCalledWith(`${endpoint}/approval`, AUTHORIZED);
  });

  it('getAllForDisbursement', () => {
    httpNetworkMock.get.mockReturnValue(of(mockListResponse));

    service.getAllForDisbursement().subscribe((res) => {
      expect(res).toEqual(mockListResponse.data);
    });

    expect(httpNetworkMock.get).toHaveBeenCalledWith(`${endpoint}/disbursement`, AUTHORIZED);
  });

  it('getById', () => {
    httpNetworkMock.get.mockReturnValue(of(mockSingleResponse));

    service.getById(mockId).subscribe((res) => {
      expect(res).toEqual(mockSingleResponse.data);
    });

    expect(httpNetworkMock.get).toHaveBeenCalledWith(`${endpoint}/${mockId}`, AUTHORIZED);
  });

  it('getByBranch', () => {
    httpNetworkMock.get.mockReturnValue(of(mockListResponse));

    service.getByBranch(mockId).subscribe((res) => {
      expect(res).toEqual(mockListResponse.data);
    });

    expect(httpNetworkMock.get).toHaveBeenCalledWith(`${endpoint}/${mockId}/branch`, AUTHORIZED);
  });

  it('getByCustomer', () => {
    httpNetworkMock.get.mockReturnValue(of(mockListResponse));

    service.getByCustomer(mockId).subscribe((res) => {
      expect(res).toEqual(mockListResponse.data);
    });

    expect(httpNetworkMock.get).toHaveBeenCalledWith(`${endpoint}/${mockId}/customer`, AUTHORIZED);
  });

  it('getForReview', () => {
    httpNetworkMock.get.mockReturnValue(of(mockSingleResponse));

    service.getForReview(mockId).subscribe((res) => {
      expect(res).toEqual(mockSingleResponse.data);
    });

    expect(httpNetworkMock.get).toHaveBeenCalledWith(`${endpoint}/${mockId}/review`, AUTHORIZED);
  });

  it('getForApproval', () => {
    httpNetworkMock.get.mockReturnValue(of(mockSingleResponse));

    service.getForApproval(mockId).subscribe((res) => {
      expect(res).toEqual(mockSingleResponse.data);
    });

    expect(httpNetworkMock.get).toHaveBeenCalledWith(`${endpoint}/${mockId}/approval`, AUTHORIZED);
  });

  it('getForDisbursement', () => {
    httpNetworkMock.get.mockReturnValue(of(mockSingleResponse));

    service.getForDisbursement(mockId).subscribe((res) => {
      expect(res).toEqual(mockSingleResponse.data);
    });

    expect(httpNetworkMock.get).toHaveBeenCalledWith(
      `${endpoint}/${mockId}/disbursement`,
      AUTHORIZED,
    );
  });

  it('review', () => {
    const request = { notes: 'looks good' } as unknown as ReviewRequest;
    httpNetworkMock.post.mockReturnValue(of(mockSingleResponse));

    service.review(mockId, request).subscribe((res) => {
      expect(res).toEqual(mockSingleResponse.data);
    });

    expect(httpNetworkMock.post).toHaveBeenCalledWith(
      `${endpoint}/${mockId}/review`,
      request,
      AUTHORIZED,
    );
  });

  it('approve', () => {
    const request = { isApproved: true } as unknown as ApprovalRequest;
    httpNetworkMock.post.mockReturnValue(of(mockSingleResponse));

    service.approve(mockId, request).subscribe((res) => {
      expect(res).toEqual(mockSingleResponse.data);
    });

    expect(httpNetworkMock.post).toHaveBeenCalledWith(
      `${endpoint}/${mockId}/approval`,
      request,
      AUTHORIZED,
    );
  });

  it('disburse', () => {
    httpNetworkMock.post.mockReturnValue(of(mockSingleResponse));

    service.disburse(mockId).subscribe((res) => {
      expect(res).toEqual(mockSingleResponse.data);
    });

    expect(httpNetworkMock.post).toHaveBeenCalledWith(
      `${endpoint}/${mockId}/disbursement`,
      null,
      AUTHORIZED,
    );
  });
});
