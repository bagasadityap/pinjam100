import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Sidebar } from '../../../../layouts/sidebar/sidebar';
import { LoanApplicationService } from '../../loan-application.service';
import { LoanApplicationReviewResponse } from '../../loan-application.model';
import { HotToastService } from '@ngxpert/hot-toast';
import { ActivatedRoute, Router } from '@angular/router';
import { VerificationModal } from '../../../../shared/components/verification-modal/verification-modal';
import { ReviewRequest, ReviewResult } from '../review.model';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-review',
  imports: [ CommonModule, Sidebar, VerificationModal, CurrencyPipe, DatePipe ],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class Detail implements OnInit {
  private readonly loanApplicationService = inject(LoanApplicationService);
  private readonly authService = inject(AuthService);
  readonly application = signal<LoanApplicationReviewResponse | null>(null);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(HotToastService);

  verificationValue = '';
  isVerifyModalOpen = false;

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
        this.toast.error('Gagal mendapatkan data aplikasi pinjaman');
      }
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
    return Number(this.application()?.installmentAmount) * this.tenorMonths;
  }

  get estimatedMonthlyInstallment(): number {
    return Number(this.application()?.installmentAmount);
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
        description: 'Data keuangan tidak lengkap.'
      };
    }

    if (dsrVal <= 30) {
      return {
        status: 'LOW',
        label: 'Risiko Rendah',
        description: 'Beban angsuran aman (<= 30% dari penghasilan).'
      };
    } else if (dsrVal <= 40) {
      return {
        status: 'MODERATE',
        label: 'Risiko Sedang',
        description: 'Beban angsuran memerlukan pertimbangan (30% - 40%).'
      };
    } else {
      return {
        status: 'HIGH',
        label: 'Risiko Tinggi',
        description: 'Beban angsuran melampaui batas aman (> 40%).'
      };
    }
  }

  review(id: string, request: ReviewRequest): void {
    this.loanApplicationService.review(id, request).subscribe({
      next: () => {
        this.toast.success(
          request.reviewResult === 'APPROVED'
            ? 'Data aplikasi pinjaman berhasil disetujui'
            : 'Data aplikasi pinjaman berhasil ditolak'
        );
        this.closeVerifyModal();
        this.back();
      },
      error: (error) => {
        this.toast.error(
          error.error?.message ?? 'Gagal menyimpan data aplikasi pinjaman'
        );
      }
    });
  }

  back(): void {
    this.router.navigate(['/pengajuan-pinjaman/review']);
  }

  openVerifyModal(id: string): void {
    this.verificationValue = id;
    this.isVerifyModalOpen = true;
  }

  closeVerifyModal(): void {
    this.verificationValue = '';
    this.isVerifyModalOpen = false;
  }

  confirmVerify(notes: string): void {
    if (!this.verificationValue) return;

    this.review(this.verificationValue, {
      reviewResult: ReviewResult.APPROVED,
      notes
    });
  }

  confirmReject(notes: string): void {
    if (!this.verificationValue) return;

    this.review(this.verificationValue, {
      reviewResult: ReviewResult.REJECTED,
      notes
    });
  }
}
