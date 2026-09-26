import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';

import { Sidebar } from '../../../../layouts/sidebar/sidebar';
import { LoanApplicationService } from '../../loan-application.service';
import { LoanApplicationReviewResponse } from '../../loan-application.model';

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

  back(): void {
    this.router.navigate(['/pengajuan-pinjaman']);
  }
}
