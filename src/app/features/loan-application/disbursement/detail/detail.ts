import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Sidebar } from '../../../../layouts/sidebar/sidebar';
import { LoanApplicationService } from '../../loan-application.service';
import { LoanApplicationDisbursementResponse } from '../../loan-application.model';
import { HotToastService } from '@ngxpert/hot-toast';
import { ActivatedRoute, Router } from '@angular/router';
import { DisbursementModal } from '../../../../shared/components/disbursement-modal/disbursement-modal';

@Component({
  selector: 'app-detail',
  imports: [CommonModule, Sidebar, DisbursementModal, CurrencyPipe],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class Detail implements OnInit {
  private readonly loanApplicationService = inject(LoanApplicationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(HotToastService);

  readonly application = signal<LoanApplicationDisbursementResponse | null>(null);
  isDisbursementModalOpen = false;
  disbursementValue = '';

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

    this.loanApplicationService.getForDisbursement(id).subscribe({
      next: (response) => {
        this.application.set(response);
      },
      error: (error) => {
        this.toast.error(error.error?.message ?? 'Gagal mendapatkan data aplikasi pinjaman');
      },
    });
  }

  disburse(id: string): void {
    this.loanApplicationService.disburse(id).subscribe({
      next: () => {
        this.toast.success('Pinjaman berhasil dicairkan');
        this.closeDisbursementModal();
        this.back();
      },
      error: (error) => {
        this.toast.error(error.error?.message ?? 'Gagal melakukan pencairan pinjaman');
      },
    });
  }

  openDisbursementModal(id: string): void {
    this.disbursementValue = id;
    this.isDisbursementModalOpen = true;
  }

  closeDisbursementModal(): void {
    this.disbursementValue = '';
    this.isDisbursementModalOpen = false;
  }

  confirmDisbursement(): void {
    if (!this.disbursementValue) {
      return;
    }

    this.disburse(this.disbursementValue);
  }

  back(): void {
    this.router.navigate(['/pengajuan-pinjaman/disbursement']);
  }
}
