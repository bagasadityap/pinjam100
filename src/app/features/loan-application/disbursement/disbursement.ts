import { Component, inject, OnInit, signal } from '@angular/core';
import { LoanApplicationService } from '../loan-application.service';
import { LoanApplicationResponse } from '../loan-application.model';
import { HotToastService } from '@ngxpert/hot-toast';
import { LOAN_APPLICATION_TABLE_COLUMNS } from '../loan-application-table.config';
import { Sidebar } from '../../../layouts/sidebar/sidebar';
import { Datatable } from '../../../shared/components/datatable/datatable';

@Component({
  selector: 'app-loan-application',
  imports: [Sidebar, Datatable],
  templateUrl: './disbursement.html',
  styleUrl: './disbursement.css',
})
export class Disbursement implements OnInit {
  private readonly loanApplicationService = inject(LoanApplicationService);
  readonly loanApplications = signal<LoanApplicationResponse[]>([]);
  private readonly toast = inject(HotToastService);
  readonly loading = signal(true);

  readonly columns = LOAN_APPLICATION_TABLE_COLUMNS;

  ngOnInit(): void {
    this.getLoanApplication();
  }

  private getLoanApplication() {
    this.loanApplicationService.getAllForDisbursement().subscribe({
      next: (response) => {
        this.loanApplications.set(response);
        this.loading.set(false);
      },
      error: (error) => {
        this.toast.error("Gagal mendapatkan data aplikasi pinjaman:", error)
      }
    })
  }

  handleAction(event: any): void {
    switch (event.type) {
      case 'review-application':
        window.location.href = `/pengajuan-pinjaman/${event.id}/disbursement`;
        break;
    }
  }
}
