import { Component, inject, OnInit, signal } from '@angular/core';
import { Sidebar } from '../../layouts/sidebar/sidebar';
import { Datatable } from '../../shared/components/datatable/datatable';
import { BranchService } from './branch.service';
import { BranchResponse } from './branch.model';
import { BRANCH_TABLE_COLUMNS } from './branch-table.config';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HotToastService } from '@ngxpert/hot-toast';
import { Modal } from '../../shared/components/modal/modal';
import { DetailModal } from '../../shared/components/detail-modal/detail-modal';
import { DeleteModal } from '../../shared/components/delete-modal/delete-modal';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Wilayah } from '../../core/model/wilayah.model';
import { WilayahService } from '../../core/service/wilayah.service';

@Component({
  selector: 'app-branch',
  imports: [
    Sidebar,
    Datatable,
    ReactiveFormsModule,
    Modal,
    DetailModal,
    DeleteModal,
    NgSelectComponent,
  ],
  templateUrl: './branch.html',
  styleUrl: './branch.css',
})
export class Branch implements OnInit {
  private readonly branchService = inject(BranchService);
  private readonly wilayahService = inject(WilayahService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(HotToastService);

  readonly branches = signal<BranchResponse[]>([]);
  readonly provinces = signal<Wilayah[]>([]);
  readonly regencies = signal<Wilayah[]>([]);

  readonly showBranchModal = signal(false);
  readonly showDetailBranchModal = signal(false);
  readonly showDeleteModal = signal(false);

  readonly selectedBranch = signal<BranchResponse | null>(null);

  readonly columns = BRANCH_TABLE_COLUMNS;

  readonly branchForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    province: ['', Validators.required],
    city: [{ value: '', disabled: true }, Validators.required],
    postalCode: ['', Validators.required],
  });

  ngOnInit(): void {
    this.getBranch();
    this.getProvinces();
  }

  private getBranch(): void {
    this.branchService.getAll().subscribe({
      next: (branches) => {
        this.branches.set(branches);
      },
      error: (error) => {
        this.toast.error(error.error?.message ?? 'Gagal mengambil data branch');
      },
    });
  }

  saveBranch(): void {
    if (this.branchForm.invalid) {
      this.branchForm.markAllAsTouched();
      return;
    }

    const branch = this.branchForm.getRawValue();
    const selectedBranch = this.selectedBranch();

    if (selectedBranch) {
      this.branchService.update(selectedBranch.id, branch).subscribe({
        next: () => {
          this.closeBranchModal();
          this.getBranch();
          this.toast.success('Branch berhasil diperbarui');
        },
        error: (error) => {
          this.toast.error(error.error?.message ?? 'Gagal memperbarui branch');
        },
      });

      return;
    }

    this.branchService.create(branch).subscribe({
      next: () => {
        this.closeBranchModal();
        this.getBranch();
        this.toast.success('Branch berhasil ditambahkan');
      },
      error: (error) => {
        this.toast.error(error.error?.message ?? 'Gagal menambahkan branch');
      },
    });
  }

  detailBranch(id: string): void {
    this.branchService.getById(id).subscribe({
      next: (branch) => {
        this.selectedBranch.set(branch);
        this.showDetailBranchModal.set(true);
      },
      error: (error) => {
        this.toast.error(error.error?.message ?? 'Gagal mengambil detail branch');
      },
    });
  }

  deleteBranch(): void {
    const branch = this.selectedBranch();

    if (!branch) {
      return;
    }

    this.branchService.delete(branch.id).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.getBranch();
        this.toast.success('Branch berhasil dihapus');
      },
      error: (error) => {
        this.toast.error(error.error?.message ?? 'Gagal menghapus branch');
      },
    });
  }

  openCreateBranchModal(): void {
    this.selectedBranch.set(null);
    this.regencies.set([]);

    this.branchForm.reset();
    this.branchForm.controls.city.disable();

    this.showBranchModal.set(true);
  }

  openUpdateBranchModal(id: string): void {
    const branch = this.branches().find((item) => item.id === id);

    if (!branch) {
      return;
    }

    this.selectedBranch.set(branch);
    this.regencies.set([]);

    this.branchForm.reset();
    this.branchForm.controls.city.disable();

    this.branchForm.patchValue({
      name: branch.name,
      province: branch.province,
      postalCode: branch.postalCode,
    });

    this.showBranchModal.set(true);

    this.loadProvinceForUpdate(branch.province, branch.city);
  }

  private loadProvinceForUpdate(provinceName: string, cityName: string): void {
    const province = this.provinces().find((item) => item.name === provinceName);

    if (province) {
      this.getRegenciesForUpdate(province.code, cityName);

      return;
    }

    this.wilayahService.getProvinces().subscribe({
      next: (response) => {
        this.provinces.set(response.data);

        const province = response.data.find((item) => item.name === provinceName);

        if (!province) {
          console.error('Provinsi tidak ditemukan:', provinceName);

          this.branchForm.controls.city.disable();
          return;
        }

        this.getRegenciesForUpdate(province.code, cityName);
      },
      error: (error) => {
        console.error('Gagal mengambil data provinsi:', error);

        this.branchForm.controls.city.disable();
      },
    });
  }

  private getRegenciesForUpdate(provinceCode: string, cityName: string): void {
    this.wilayahService.getRegencies(provinceCode).subscribe({
      next: (response) => {
        this.regencies.set(response.data);

        this.branchForm.controls.city.enable();

        const city = response.data.find((item) => item.name === cityName);

        if (city) {
          this.branchForm.controls.city.setValue(city.name);
        } else {
          this.branchForm.controls.city.setValue(cityName);
        }
      },
      error: (error) => {
        console.error('Gagal mengambil data kabupaten/kota:', error);

        this.regencies.set([]);
        this.branchForm.controls.city.reset();
        this.branchForm.controls.city.disable();
      },
    });
  }

  openDetailBranchModal(id: string): void {
    this.detailBranch(id);
  }

  openDeleteModal(id: string): void {
    const branch = this.branches().find((item) => item.id === id);

    if (!branch) {
      return;
    }

    this.selectedBranch.set(branch);
    this.showDeleteModal.set(true);
  }

  closeBranchModal(): void {
    this.showBranchModal.set(false);
    this.branchForm.reset();
    this.branchForm.controls.city.disable();
    this.regencies.set([]);
    this.selectedBranch.set(null);
  }

  closeDetailBranchModal(): void {
    this.showDetailBranchModal.set(false);
    this.selectedBranch.set(null);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.selectedBranch.set(null);
  }

  getProvinces(): void {
    this.wilayahService.getProvinces().subscribe({
      next: (response) => {
        this.provinces.set(response.data);
      },
      error: (error) => {
        console.error('Gagal mengambil data provinsi:', error);
      },
    });
  }

  getRegencies(provinceCode: string): void {
    this.regencies.set([]);

    this.branchForm.controls.city.reset();
    this.branchForm.controls.city.disable();

    this.wilayahService.getRegencies(provinceCode).subscribe({
      next: (response) => {
        this.regencies.set(response.data);

        if (response.data.length > 0) {
          this.branchForm.controls.city.enable();
        }
      },
      error: (error) => {
        console.error('Gagal mengambil data kabupaten/kota:', error);

        this.regencies.set([]);
        this.branchForm.controls.city.reset();
        this.branchForm.controls.city.disable();
      },
    });
  }

  onProvinceChange(province: string | Wilayah | null): void {
    this.regencies.set([]);
    this.branchForm.controls.city.reset();
    this.branchForm.controls.city.disable();

    if (!province) {
      return;
    }

    const provinceName = typeof province === 'string' ? province : province.name;

    const selectedProvince = this.provinces().find((item) => item.name === provinceName);

    if (!selectedProvince) {
      return;
    }

    this.getRegencies(selectedProvince.code);
  }

  handleAction(event: any): void {
    switch (event.type) {
      case 'read':
        this.openDetailBranchModal(event.id);
        break;

      case 'update':
        this.openUpdateBranchModal(event.id);
        break;

      case 'delete':
        this.openDeleteModal(event.id);
        break;
    }
  }
}
