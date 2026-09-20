import { afterNextRender, Component, inject, OnInit, signal } from '@angular/core';
import { Sidebar } from '../../layouts/sidebar/sidebar';
import { Datatable } from '../../shared/components/datatable/datatable';
import { RoleService } from './role.service';
import { RoleResponse } from './role.model';
import { PermissionService } from './pemission/permission.service';
import { PermissionResponse } from './pemission/permission.model';
import { ROLE_TABLE_COLUMNS } from './role-table.config';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HotToastService } from '@ngxpert/hot-toast';
import { Modal } from '../../shared/components/modal/modal';
import { DeleteModal } from '../../shared/components/delete-modal/delete-modal';

@Component({
  selector: 'app-role-permission',
  imports: [Sidebar, Datatable, ReactiveFormsModule, Modal, DeleteModal],
  templateUrl: './role.html',
  styleUrl: './role.css',
})
export class RolePermission implements OnInit {
  private readonly roleService = inject(RoleService);
  private readonly permissionService = inject(PermissionService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(HotToastService);
  readonly loading = signal(true);

  readonly roles = signal<RoleResponse[]>([]);
  readonly permissions = signal<PermissionResponse[]>([]);

  readonly showRoleModal = signal(false);
  readonly roleModalMode = signal<'create' | 'update'>('create');
  readonly showChangePermissionModal = signal(false);
  readonly showDeleteModal = signal(false);
  readonly selectedRole = signal<RoleResponse | null>(null);

  readonly columns = ROLE_TABLE_COLUMNS;

  readonly roleForm = this.fb.nonNullable.group({
    roleName: ['', Validators.required]
  });
  readonly permissionForm = this.fb.nonNullable.group({
    roleName: this.fb.control<string | null>(null, Validators.required),
    permissions: this.fb.nonNullable.control<string[]>([])
  });

  ngOnInit(): void {
    this.getRoles();
    this.getPermissions();
  }

  constructor() {
    afterNextRender(() => {
      this.getRoles();
      this.getPermissions();
    });
  }

  private getRoles(): void {
    this.roleService.getAll().subscribe({
      next: (roles) => {
        this.roles.set(roles);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Gagal mengambil data role:', error);
      }
    });
  }

  private getPermissions(): void {
    this.permissionService.getAll().subscribe({
      next: (permissions) => {
        this.permissions.set(permissions);
      },
      error: (error) => {
        console.error('Gagal mengambil data permission:', error);
      }
    });
  }

  saveRole(): void {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    const role = this.roleForm.getRawValue();
    const selectedRole = this.selectedRole();

    if (this.roleModalMode() === 'create') {
      this.roleService.create(role).subscribe({
        next: () => {
          this.closeRoleModal();
          this.getRoles();
          this.toast.success('Role berhasil ditambahkan');
        },
        error: (error) => {
          this.toast.error(error.error?.message ?? 'Gagal menambahkan role');
        }
      });

      return;
    }

    if (selectedRole) {
      this.roleService.update(selectedRole.id, role).subscribe({
        next: () => {
          this.closeRoleModal();
          this.getRoles();
          this.toast.success('Role berhasil diperbarui');
        },
        error: (error) => {
          this.toast.error(error.error?.message ?? 'Gagal memperbarui role');
        }
      });
    }
  }

  savePermission(): void {
    const role = this.selectedRole();

    if (!role) {
      return;
    }

    const permissions = this.permissionForm.controls.permissions.value;

    this.roleService.updatePermission(role.id, permissions).subscribe({
      next: () => {
        this.closeChangePermissionModal();
        this.getRoles();
        this.toast.success('Permission berhasil diperbarui');
      },
      error: (error) => {
        this.toast.error(
          error.error?.message ?? 'Gagal memperbarui permission'
        );
      }
    });
  }

  deleteRole(): void {
    const role = this.selectedRole();

    if (!role) {
      return;
    }

    this.roleService.delete(role.id).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.getRoles();
        this.toast.success('Role berhasil dihapus');
      },
      error: (error) => {
        this.toast.error(error.error?.message ?? 'Gagal menghapus role');
      }
    });
  }

  openCreateRoleModal(): void {
    this.roleForm.reset();
    this.selectedRole.set(null);
    this.roleModalMode.set('create');
    this.showRoleModal.set(true);
  }

  openUpdateRoleModal(id: string): void {
    const role = this.roles().find(role => role.id === id);

    if (!role) {
      return;
    }

    this.selectedRole.set(role);
    this.roleModalMode.set('update');

    this.roleForm.patchValue({
      roleName: role.roleName
    });

    this.showRoleModal.set(true);
  }

  openChangePermissionModal(id: string): void {
    const role = this.roles().find(role => role.id === id);

    if (!role) {
      return;
    }

    this.selectedRole.set(role);
    this.permissionForm.patchValue({
      roleName: role.roleName,
      permissions: role.permissions.map(permission => permission.id)
    });
    this.showChangePermissionModal.set(true);
  }

  closeChangePermissionModal(): void {
    this.showChangePermissionModal.set(false);
    this.permissionForm.reset({
      roleName: null,
      permissions: []
    });
    this.selectedRole.set(null);
  }

  closeRoleModal(): void {
    this.showRoleModal.set(false);
  }

  openDeleteModal(id: string): void {
    const role = this.roles().find(role => role.id === id);

    if (!role) {
      return;
    }

    this.selectedRole.set(role);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.selectedRole.set(null);
  }

  togglePermission(id: string, checked: boolean): void {
    const permissions = this.permissionForm.controls.permissions.value;

    if (checked) {
      if (!permissions.includes(id)) {
        this.permissionForm.controls.permissions.setValue([
          ...permissions,
          id
        ]);
      }

      return;
    }

    this.permissionForm.controls.permissions.setValue(
      permissions.filter(permissionId => permissionId !== id)
    );
  }

  getPermissionLabel(permissionName: string): string {
    return permissionName
      .split(':')[1]
      .replace('-', ' ')
      .replace(/\b\w/g, letter => letter.toUpperCase());
  }

  handleAction(event: any): void {
    switch (event.type) {
      case 'update':
        this.openUpdateRoleModal(event.id);
        break;

      case 'change-permission':
        this.openChangePermissionModal(event.id);
        break;

      case 'delete':
        this.openDeleteModal(event.id);
        break;
    }
  }
}
