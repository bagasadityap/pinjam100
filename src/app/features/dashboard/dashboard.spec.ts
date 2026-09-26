import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { of, throwError } from 'rxjs';

import { Dashboard } from './dashboard';
import { DashboardService } from './dashboard.service';
import { AuthService } from '../auth/auth.service';
import { Sidebar } from '../../layouts/sidebar/sidebar';
import { UserResponse } from '../user/user.model';

describe('Dashboard Component', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let authServiceMock: any;
  let dashboardServiceMock: any;

  beforeEach(async () => {
    authServiceMock = {
      getCurrentUser: vi.fn(),
    };

    dashboardServiceMock = {
      getDashboard: vi.fn(),
    };

    vi.spyOn(console, 'error').mockImplementation(() => {});

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: DashboardService, useValue: dashboardServiceMock },
      ],
    })
      .overrideComponent(Dashboard, {
        // Sidebar dilepas dari imports, lalu schema diset di level komponen
        // (untuk standalone component, schemas di TestBed module tidak berpengaruh)
        remove: { imports: [Sidebar] },
        add: { schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('ngOnInit harus memanggil getCurrentUser dan memuat dashboard dengan sukses', () => {
    const mockUser = { role: 'SUPER_ADMIN', name: 'John Doe' } as UserResponse;
    const mockDashboard = { total: 100 } as any;

    authServiceMock.getCurrentUser.mockReturnValue(of(mockUser));
    dashboardServiceMock.getDashboard.mockReturnValue(of(mockDashboard));

    fixture.detectChanges();

    expect(authServiceMock.getCurrentUser).toHaveBeenCalled();
    expect(dashboardServiceMock.getDashboard).toHaveBeenCalled();

    expect(component.currentUser()).toEqual(mockUser);
    expect(component.role()).toBe('SUPER_ADMIN');
    expect(component.dashboard()).toEqual(mockDashboard);

    expect(component.loading()).toBe(false);
    expect(component.error()).toBe(false);
  });

  it('getCurrentUser harus menangani error', () => {
    authServiceMock.getCurrentUser.mockReturnValue(throwError(() => new Error('Auth Error')));

    component.getCurrentUser();

    expect(component.error()).toBe(true);
    expect(component.loading()).toBe(false);
    expect(console.error).toHaveBeenCalledWith('Gagal mengambil data user', expect.any(Error));
  });

  it('loadDashboard harus menangani error', () => {
    dashboardServiceMock.getDashboard.mockReturnValue(
      throwError(() => new Error('Dashboard Error')),
    );

    component.loadDashboard();

    expect(component.error()).toBe(true);
    expect(component.loading()).toBe(false);
    expect(console.error).toHaveBeenCalledWith('Gagal mengambil data dashboard', expect.any(Error));
  });

  it('harus memvalidasi isSuperAdmin', () => {
    component.role.set('SUPER_ADMIN');
    expect(component.isSuperAdmin()).toBe(true);
  });

  it('harus memvalidasi isMarketing', () => {
    component.role.set('MARKETING');
    expect(component.isMarketing()).toBe(true);

    component.role.set('BRANCH_MARKETING');
    expect(component.isMarketing()).toBe(true);
  });

  it('harus memvalidasi isPayment', () => {
    component.role.set('PAYMENT');
    expect(component.isPayment()).toBe(true);
  });

  it('harus memvalidasi isDocumentChecker', () => {
    component.role.set('DOCUMENT_CHECKER');
    expect(component.isDocumentChecker()).toBe(true);
  });

  it('harus memvalidasi isCreditAnalyst', () => {
    component.role.set('CREDIT_ANALYST');
    expect(component.isCreditAnalyst()).toBe(true);
  });

  it('harus mengembalikan data dashboard melalui getter', () => {
    const mockData = { id: 1 } as any;
    component.dashboard.set(mockData);

    expect(component.dashboardData).toEqual(mockData);
    expect(component.marketingData).toEqual(mockData);
    expect(component.paymentData).toEqual(mockData);
    expect(component.documentCheckerData).toEqual(mockData);
    expect(component.creditAnalystData).toEqual(mockData);
  });

  it('harus memformat inisial dengan benar pada getInitials', () => {
    expect(component.getInitials(null)).toBe('-');
    expect(component.getInitials(undefined)).toBe('-');
    expect(component.getInitials('')).toBe('-');
    expect(component.getInitials('John')).toBe('J');
    expect(component.getInitials('John Doe')).toBe('JD');
    expect(component.getInitials('John Doe Smith')).toBe('JD');
  });

  it('harus mengembalikan label role dengan benar pada getRoleLabel', () => {
    component.role.set('SUPER_ADMIN');
    expect(component.getRoleLabel()).toBe('Super Administrator');

    component.role.set('MARKETING');
    expect(component.getRoleLabel()).toBe('Marketing');

    component.role.set('BRANCH_MARKETING');
    expect(component.getRoleLabel()).toBe('Branch Marketing');

    component.role.set('PAYMENT');
    expect(component.getRoleLabel()).toBe('Payment');

    component.role.set('DOCUMENT_CHECKER');
    expect(component.getRoleLabel()).toBe('Document Checker');

    component.role.set('CREDIT_ANALYST');
    expect(component.getRoleLabel()).toBe('Credit Analyst');

    component.role.set('UNKNOWN_ROLE');
    expect(component.getRoleLabel()).toBe('User');
  });
});
