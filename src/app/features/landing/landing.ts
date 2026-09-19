import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../layouts/navbar/navbar';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [Navbar, CommonModule, ReactiveFormsModule],
  templateUrl: './landing.html',
})
export class Landing implements OnInit {
  simulasiForm!: FormGroup;

  tenorOptions = [
    { label: '3 Bulan', value: 3 },
    { label: '6 Bulan', value: 6 },
    { label: '12 Bulan', value: 12 },
    { label: '18 Bulan', value: 18 },
    { label: '24 Bulan', value: 24 },
  ];

  totalBunga = 0;
  totalPengembalian = 0;

  private readonly BUNGA_BULANAN = 0.03; // 3% per bulan (contoh kalkulasi bulanan)

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.simulasiForm = this.fb.group({
      nominal: [12000000],
      tenor: [12],
    });

    this.hitungSimulasi();

    this.simulasiForm.valueChanges.subscribe(() => {
      this.hitungSimulasi();
    });
  }

  setTenor(val: number): void {
    this.simulasiForm.patchValue({ tenor: val });
  }

  onNominalInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const rawValue = input.value.replace(/[^0-9]/g, '');
    const numericValue = rawValue ? parseInt(rawValue, 10) : 0;

    this.simulasiForm.patchValue({ nominal: numericValue }, { emitEvent: true });
  }

  private hitungSimulasi(): void {
    const { nominal, tenor } = this.simulasiForm.value;
    const validNominal = nominal || 0;

    this.totalBunga = Math.round(validNominal * this.BUNGA_BULANAN * tenor);
    this.totalPengembalian = validNominal + this.totalBunga;
  }

  formatRupiah(val: number): string {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(val || 0);
  }
}
