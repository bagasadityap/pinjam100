import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { HttpNetwork } from './http.network';
import { API_ACCESS, AUTHORIZED, ApiAccess } from '../http/http.context';

describe('HttpNetwork', () => {
  let service: HttpNetwork;
  let httpMock: HttpTestingController;
  const mockUrl = '/api/data';
  const mockBody = { id: 1, name: 'test' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpNetwork, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(HttpNetwork);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('harus melakukan request GET dengan context AUTHORIZED secara default', () => {
    service.get(mockUrl).subscribe();

    const req = httpMock.expectOne(mockUrl);
    expect(req.request.method).toBe('GET');
    expect(req.request.context.get(API_ACCESS)).toBe(AUTHORIZED);
    req.flush({});
  });

  it('harus melakukan request POST beserta body dengan context AUTHORIZED secara default', () => {
    service.post(mockUrl, mockBody).subscribe();

    const req = httpMock.expectOne(mockUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockBody);
    expect(req.request.context.get(API_ACCESS)).toBe(AUTHORIZED);
    req.flush({});
  });

  it('harus melakukan request PUT beserta body dengan context AUTHORIZED secara default', () => {
    service.put(mockUrl, mockBody).subscribe();

    const req = httpMock.expectOne(mockUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockBody);
    expect(req.request.context.get(API_ACCESS)).toBe(AUTHORIZED);
    req.flush({});
  });

  it('harus melakukan request PATCH beserta body dengan context AUTHORIZED secara default', () => {
    service.patch(mockUrl, mockBody).subscribe();

    const req = httpMock.expectOne(mockUrl);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(mockBody);
    expect(req.request.context.get(API_ACCESS)).toBe(AUTHORIZED);
    req.flush({});
  });

  it('harus melakukan request DELETE dengan context AUTHORIZED secara default', () => {
    service.delete(mockUrl).subscribe();

    const req = httpMock.expectOne(mockUrl);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.context.get(API_ACCESS)).toBe(AUTHORIZED);
    req.flush({});
  });

  it('harus menggunakan context ApiAccess kustom jika parameter access diisi', () => {
    const customAccess = 'UNAUTHORIZED' as ApiAccess;

    service.get(mockUrl, customAccess).subscribe();

    const req = httpMock.expectOne(mockUrl);
    expect(req.request.context.get(API_ACCESS)).toBe(customAccess);
    req.flush({});
  });
});
