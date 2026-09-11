import { Component, inject, signal } from '@angular/core';
import { CustomerService } from '../customer/customer.service';
import { CustomerResponse } from '../customer/customer.model';
import { LIMIT_SETTING_TABLE_COLUMNS } from './limit-setting-table.config';
import { HotToastService } from '@ngxpert/hot-toast';
import { Sidebar } from '../../layouts/sidebar/sidebar';
import { Datatable } from '../../shared/components/datatable/datatable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-limit-setting',
  imports: [Sidebar, Datatable],
  templateUrl: './limit-setting.html',
  styleUrl: './limit-setting.css',
})
export class LimitSetting {
  private readonly customerService = inject(CustomerService);
  readonly customers = signal<CustomerResponse[]>([]);
  readonly selectedUser = signal<CustomerResponse | null>(null);
  private readonly router = inject(Router);
  private readonly toast = inject(HotToastService);
  readonly loading = signal(true);

  readonly columns = LIMIT_SETTING_TABLE_COLUMNS;

  ngOnInit(): void {
    this.getCustomer();
  }

  private getCustomer(): void {
    this.customerService.getVerifiedAndLimitIsNull().subscribe({
      next: (response) => {
        this.customers.set(response);
        this.loading.set(false);
      },
      error: (error) => {
        this.toast.error('Gagal mendapatkan data customer: ', error);
      }
    });
  }

  openLimitSetting(id: string): void {
    this.router.navigate([`/limit-setting/${id}`]);
  }

  handleAction(event: any): void {
    switch (event.type) {
      case 'review-customer':
        this.openLimitSetting(event.id);
        break;
    }
  }
}
