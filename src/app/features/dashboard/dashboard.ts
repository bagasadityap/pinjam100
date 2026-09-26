import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { DashboardService } from './dashboard.service';
import {
  DashboardResponse,
  MarketingDashboardResponse,
  PaymentDashboardResponse,
  DocumentCheckerDashboardResponse,
  CreditAnalystDashboardResponse,
} from './dashboard.model';
import { Sidebar } from '../../layouts/sidebar/sidebar';
import { AuthService } from '../auth/auth.service';
import { UserResponse } from '../user/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  imports: [CommonModule, Sidebar],
})
export class Dashboard implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly authService = inject(AuthService);

  currentUser = signal<UserResponse | null>(null);
  loading = signal(true);
  error = signal(false);

  dashboard = signal<
    | DashboardResponse
    | MarketingDashboardResponse
    | PaymentDashboardResponse
    | DocumentCheckerDashboardResponse
    | CreditAnalystDashboardResponse
    | null
  >(null);

  role = signal<string | null>(null);

  ngOnInit(): void {
    this.getCurrentUser();
  }

  getCurrentUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: (response) => {
        this.currentUser.set(response);
        this.role.set(response.role ?? null);
        this.loadDashboard();
      },
      error: (error) => {
        console.error('Gagal mengambil data user', error);
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  loadDashboard(): void {
    this.loading.set(true);
    this.error.set(false);

    this.dashboardService.getDashboard().subscribe({
      next: (response) => {
        this.dashboard.set(response);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Gagal mengambil data dashboard', error);
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  isSuperAdmin(): boolean {
    return this.role() === 'SUPER_ADMIN';
  }

  isMarketing(): boolean {
    return this.role() === 'MARKETING' || this.role() === 'BRANCH_MARKETING';
  }

  isPayment(): boolean {
    return this.role() === 'PAYMENT';
  }

  isDocumentChecker(): boolean {
    return this.role() === 'DOCUMENT_CHECKER';
  }

  isCreditAnalyst(): boolean {
    return this.role() === 'CREDIT_ANALYST';
  }

  get dashboardData(): DashboardResponse | null {
    return this.dashboard() as DashboardResponse | null;
  }

  get marketingData(): MarketingDashboardResponse | null {
    return this.dashboard() as MarketingDashboardResponse | null;
  }

  get paymentData(): PaymentDashboardResponse | null {
    return this.dashboard() as PaymentDashboardResponse | null;
  }

  get documentCheckerData(): DocumentCheckerDashboardResponse | null {
    return this.dashboard() as DocumentCheckerDashboardResponse | null;
  }

  get creditAnalystData(): CreditAnalystDashboardResponse | null {
    return this.dashboard() as CreditAnalystDashboardResponse | null;
  }

  getInitials(name: string | null | undefined): string {
    if (!name) {
      return '-';
    }

    return name
      .split(' ')
      .filter((value) => value.length > 0)
      .slice(0, 2)
      .map((value) => value.charAt(0).toUpperCase())
      .join('');
  }

  getRoleLabel(): string {
    switch (this.role()) {
      case 'SUPER_ADMIN':
        return 'Super Administrator';
      case 'MARKETING':
        return 'Marketing';
      case 'BRANCH_MARKETING':
        return 'Branch Marketing';
      case 'PAYMENT':
        return 'Payment';
      case 'DOCUMENT_CHECKER':
        return 'Document Checker';
      case 'CREDIT_ANALYST':
        return 'Credit Analyst';
      default:
        return 'User';
    }
  }
}
