import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HotToastService } from '@ngxpert/hot-toast';

import { Sidebar } from '../../../layouts/sidebar/sidebar';
import { CustomerService } from '../../customer/customer.service';
import { CustomerDetailResponse } from '../../customer/customer.model';
import { LimitService } from '../limit-setting.service';

@Component({
  selector: 'app-limit-setting',
  imports: [
    Sidebar,
    ReactiveFormsModule,
    DatePipe,
  ],
  templateUrl: './setting.html',
  styleUrl: './setting.css',
})
export class Setting implements OnInit {

  private readonly customerService = inject(CustomerService);
  private readonly limitService = inject(LimitService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(HotToastService);

  readonly customer = signal<CustomerDetailResponse | null>(null);

  showConfirmModal = false;

  readonly limitForm = this.fb.nonNullable.group({
    creditLimit: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ]
  });

  ngOnInit(): void {
    this.getCustomer();
  }

  private getCustomer(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.toast.error('ID customer tidak ditemukan');
      this.back();
      return;
    }

    this.customerService.getDetailById(id).subscribe({
      next: (response) => {
        this.customer.set(response);
      },
      error: (error) => {
        this.toast.error(
          error.error?.message ?? 'Gagal mendapatkan data customer'
        );
        this.back();
      }
    });
  }

  get monthlyIncome(): number {
    return Number(this.customer()?.employment?.monthlyIncome ?? 0);
  }

  get creditLimit(): number {
    return Number(this.limitForm.controls.creditLimit.value ?? 0);
  }

  get dsr(): number {
    if (!this.monthlyIncome || !this.creditLimit) {
      return 0;
    }

    return (this.creditLimit / this.monthlyIncome) * 100;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(value);
  }

  openConfirmModal(): void {
    if (this.limitForm.invalid) {
      this.limitForm.markAllAsTouched();
      return;
    }

    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
  }

  confirmSave(): void {
    const customerId = this.route.snapshot.paramMap.get('id');

    if (!customerId) {
      this.toast.error('ID customer tidak ditemukan');
      return;
    }

    const limit = {
      customerId,
      ...this.limitForm.getRawValue()
    };

    this.limitService.create(limit).subscribe({
      next: (response) => {
        this.toast.success('Limit pinjaman berhasil disimpan');
        console.log('Limit pinjaman berhasil disimpan:', response);
        this.closeConfirmModal();
        this.back();
      },
      error: (error) => {
        this.toast.error(
          error.error?.message ?? 'Gagal menyimpan plafon'
        );
      }
    });
  }

  back(): void {
    this.router.navigate(['/limit-setting']);
  }

  formatNumber(value: number): string {
    if (!value) {
      return '';
    }

    return new Intl.NumberFormat('id-ID').format(value);
  }

  onCreditLimitInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '');

    const creditLimit = Number(value);

    this.limitForm.controls.creditLimit.setValue(creditLimit);
  }

  get riskAnalysis() {
    const limit = Number(this.limitForm.controls.creditLimit.value) || 0;
    const income = this.monthlyIncome || 0;

    if (!income || !limit) {
      return {
        ratio: 0,
        status: 'LOW',
        label: 'Rendah',
        description: 'Masukkan plafon untuk melihat kalkulasi risiko.'
      };
    }

    const ratio = limit / income;

    if (ratio <= 2.0) {
      return {
        ratio,
        status: 'LOW',
        label: 'Risiko Rendah',
        description: 'Plafon berada dalam batas ideal (<= 2x penghasilan bulanan).'
      };
    } else if (ratio <= 3.5) {
      return {
        ratio,
        status: 'MODERATE',
        label: 'Risiko Sedang',
        description: 'Plafon membutuhkan perhatian (2x - 3.5x penghasilan bulanan).'
      };
    } else {
      return {
        ratio,
        status: 'HIGH',
        label: 'Risiko Tinggi',
        description: 'Plafon melebihi batas rekomendasi (> 3.5x penghasilan bulanan).'
      };
    }
  }
}
