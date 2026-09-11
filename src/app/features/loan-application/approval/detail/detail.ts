import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Sidebar } from '../../../../layouts/sidebar/sidebar';
import { LoanApplicationService } from '../../loan-application.service';
import { LoanApplicationReviewResponse } from '../../loan-application.model';
import { HotToastService } from '@ngxpert/hot-toast';
import { ActivatedRoute, Router } from '@angular/router';
import { VerificationModal } from '../../../../shared/components/verification-modal/verification-modal';
import { ApprovalRequest, ApprovalStatus } from '../approval.model';

type ActiveTab = 'customer' | 'loan' | 'summary';

@Component({
  selector: 'app-review',
  imports: [ CommonModule, Sidebar, VerificationModal, CurrencyPipe, DatePipe],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class Detail implements OnInit {
  private readonly loanApplicationService = inject(LoanApplicationService);
  readonly application = signal<LoanApplicationReviewResponse | null>(null);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(HotToastService);

  activeTab: ActiveTab = 'customer';
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
        this.toast.error("Gagal mendapatkan data aplikasi pinjaman: ", error)
      }
    });
  }

  review(id: string, request: ApprovalRequest): void {
    this.loanApplicationService.approve(id, request).subscribe({
      next: () => {
        this.toast.success(
          request.approvalStatus === 'APPROVED'
            ? 'Data aplikasi pinjaman berhasil disetujui'
            : 'Data aplikasi pinjaman berhasil ditolak'
        );
        this.closeVerifyModal();
        this.back();
      },
      error: (error) => {
        console.log(id, request);
        this.toast.error(
          error.error?.message ?? 'Gagal menyimpan data aplikasi pinjaman'
        );
      }
    });
  }

  back(): void {
    window.location.href = '/pengajuan-pinjaman/approval';
  }

  setActiveTab(tab: ActiveTab): void {
    this.activeTab = tab;
  }

  openVerifyModal(id: string): void {
    console.log('openVerifyModal', id);
    this.verificationValue = id;
    this.isVerifyModalOpen = true;
  }

  closeVerifyModal(): void {
    this.verificationValue = '';
    this.isVerifyModalOpen = false;
  }

  confirmVerify(notes: string): void {
    if (!this.verificationValue) {
      return;
    }

    this.review(this.verificationValue, {
      approvalStatus: ApprovalStatus.APPROVED,
      notes
    });
  }

  confirmReject(notes: string): void {
    if (!this.verificationValue) {
      return;
    }

    this.review(this.verificationValue, {
      approvalStatus: ApprovalStatus.REJECTED,
      notes
    });
  }
}
