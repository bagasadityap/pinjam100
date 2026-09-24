import { Component, inject, signal } from '@angular/core';
import { CustomerService } from '../customer.service';
import { CustomerResponse } from '../customer.model';
import { CUSTOMER_TABLE_COLUMNS } from './customer-table.config';
import { HotToastService } from '@ngxpert/hot-toast';
import { Router } from '@angular/router';
import { Sidebar } from '../../../layouts/sidebar/sidebar';
import { Datatable } from '../../../shared/components/datatable/datatable';

@Component({
  selector: 'app-verify-customer',
  imports: [Sidebar, Datatable],
  templateUrl: './verify-customer.html',
  styleUrl: './verify-customer.css',
})
export class VerifyCustomer {
  private readonly customerService = inject(CustomerService);
  readonly customers = signal<CustomerResponse[]>([]);
  readonly selectedUser = signal<CustomerResponse | null>(null);
  private readonly router = inject(Router);
  private readonly toast = inject(HotToastService);
  readonly loading = signal(true);

  readonly columns = CUSTOMER_TABLE_COLUMNS;

  ngOnInit(): void {
    this.getCustomer();
  }

  private getCustomer(): void {
    this.customerService.getPending().subscribe({
      next: (response) => {
        this.customers.set(response);
        this.loading.set(false);
      },
      error: (error) => {
        this.toast.error("Gagal mendapatkan data user: ", error)
      }
    })
  }

  openDetailCustomer(id: string): void {
    this.router.navigate([`/verifikasi-customer/detail/${id}`]);
  }

  handleAction(event: any): void {
    switch (event.type) {
      case 'review-customer':
        this.openDetailCustomer(event.id);
        break;
    }
  }
}
