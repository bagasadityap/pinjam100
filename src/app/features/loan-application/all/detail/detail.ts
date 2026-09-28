import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';

import { Sidebar } from '../../../../layouts/sidebar/sidebar';
import { LoanApplicationService } from '../../loan-application.service';
import { LoanApplicationReviewResponse } from '../../loan-application.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-review',
  imports: [CommonModule, Sidebar, CurrencyPipe, DatePipe],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class Detail implements OnInit {
  private readonly loanApplicationService = inject(LoanApplicationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(HotToastService);

  readonly application = signal<LoanApplicationReviewResponse | null>(null);

  documentUrl = environment.api.documentUrl;
  previewDocumentUrl = '';
  previewDocumentTitle = '';

  ngOnInit(): void {
    this.getApplication();
  }

  getApplication(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.toast.error('Customer tidak ditemukan');
      this.back();
      return;
    }

    this.loanApplicationService.getForReview(id).subscribe({
      next: (response) => {
        this.application.set(response);
      },
      error: (error) => {
        this.toast.error(error.error?.message ?? 'Gagal mendapatkan data aplikasi pinjaman');
      },
    });
  }

  get monthlyIncome(): number {
    return Number(this.application()?.customer?.employment?.monthlyIncome ?? 0);
  }

  get loanAmount(): number {
    return Number(this.application()?.loanAmount ?? 0);
  }

  get tenorMonths(): number {
    return Number(this.application()?.tenorMonths ?? 12);
  }

  get interestRate(): number {
    return Number(this.application()?.interestRate ?? 0);
  }

  get totalInterest(): number {
    return this.loanAmount * (this.interestRate / 100) * (this.tenorMonths / 12);
  }

  get totalRepayment(): number {
    return Number(this.application()?.installmentAmount ?? 0) * this.tenorMonths;
  }

  get estimatedMonthlyInstallment(): number {
    return Number(this.application()?.installmentAmount ?? 0);
  }

  get dsr(): number {
    if (!this.monthlyIncome || !this.estimatedMonthlyInstallment) return 0;

    return (this.estimatedMonthlyInstallment / this.monthlyIncome) * 100;
  }

  get dsrRiskAnalysis() {
    const dsrVal = this.dsr;

    if (dsrVal === 0) {
      return {
        status: 'LOW',
        label: 'N/A',
        description: 'Data keuangan tidak lengkap.',
      };
    }

    if (dsrVal <= 30) {
      return {
        status: 'LOW',
        label: 'Risiko Rendah',
        description: 'Beban angsuran aman (<= 30% dari penghasilan).',
      };
    }

    if (dsrVal <= 40) {
      return {
        status: 'MODERATE',
        label: 'Risiko Sedang',
        description: 'Beban angsuran memerlukan pertimbangan (30% - 40%).',
      };
    }

    return {
      status: 'HIGH',
      label: 'Risiko Tinggi',
      description: 'Beban angsuran melampaui batas aman (> 40%).',
    };
  }

  openDocumentPreview(url: string, title: string): void {
    this.previewDocumentUrl = `${this.documentUrl}${url}`;
    this.previewDocumentTitle = title;
  }

  closeDocumentPreview(): void {
    this.previewDocumentUrl = '';
    this.previewDocumentTitle = '';
  }

  back(): void {
    this.router.navigate(['/pengajuan-pinjaman']);
  }
}
