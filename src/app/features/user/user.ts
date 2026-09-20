import { afterNextRender, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Sidebar } from '../../layouts/sidebar/sidebar';
import { Datatable } from '../../shared/components/datatable/datatable';
import { Modal } from '../../shared/components/modal/modal';
import { UserService } from './user.service';
import { UserResponse } from './user.model';
import { RoleService } from '../role-permission/role.service';
import { RoleResponse } from '../role-permission/role.model';
import { DeleteModal } from '../../shared/components/delete-modal/delete-modal';
import { HotToastService } from '@ngxpert/hot-toast';
import { USER_TABLE_COLUMNS } from './user-table.config';
import { DetailModal } from '../../shared/components/detail-modal/detail-modal';
import fa from '@angular/common/locales/fa';

@Component({
  selector: 'app-user',
  imports: [Sidebar, Datatable, Modal, ReactiveFormsModule, DetailModal, DeleteModal],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User implements OnInit {
  private readonly userService = inject(UserService);
  private readonly roleService = inject(RoleService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(HotToastService);
  readonly loading = signal(true);

  readonly users = signal<UserResponse[]>([]);
  readonly roles = signal<RoleResponse[]>([]);
  readonly showUserModal = signal(false);
  readonly userModalMode = signal<'create' | 'update'>('create');
  readonly showDetailUserModal = signal(false);
  readonly showChangeRoleModal = signal(false);
  readonly showDeleteModal = signal(false);
  readonly selectedUser = signal<UserResponse | null>(null);

  readonly userForm = this.fb.nonNullable.group({
    identityNumber: ['', Validators.required],
    name: ['', Validators.required],
    password: ['', Validators.required],
    role: this.fb.control<string | null>(null)
  });

  readonly roleForm = this.fb.nonNullable.group({
    role: this.fb.control<string | null>(null, Validators.required)
  });

  readonly columns = USER_TABLE_COLUMNS

  ngOnInit(): void {
    this.getUsers();
    this.getRoles();
  }

  private getUsers(): void {
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: (error) => {
        this.toast.error("Gagal mengambil data user:", error)
      }
    });
  }

  private getRoles(): void {
    this.roleService.getAll().subscribe({
      next: (roles) => {
        this.roles.set(roles);
      },
      error: (error) => {
        console.error('Gagal mengambil data role:', error);
      }
    });
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const user = this.userForm.getRawValue();
    const selectedUser = this.selectedUser();

    if (this.userModalMode() === 'create') {
      this.userService.create(user).subscribe({
        next: () => {
          this.closeUserModal();
          this.getUsers();
          this.toast.success('User berhasil ditambahkan');
        },
        error: (error) => {
          this.toast.error(error.error?.message ?? 'Gagal menambahkan user');
        }
      });

      return;
    }

    if (selectedUser) {
      this.userService.update(selectedUser.id, user).subscribe({
        next: () => {
          this.closeUserModal();
          this.getUsers();
          this.toast.success('User berhasil diperbarui');
        },
        error: (error) => {
          this.toast.error(error.error?.message ?? 'Gagal memperbarui user');
        }
      });
    }
  }

  updateActive(id: string): void {
    this.userService.updateActive(id).subscribe({
      next: () => {
        this.getUsers();
        this.toast.success('Status user berhasil diubah');
      },
      error: (error) => {
        this.getUsers();
        this.toast.error(error.error?.message ?? 'Gagal mengubah status user');
      }
    });
  }

  changeRole(): void {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    const user = this.selectedUser();
    const roleId = this.roleForm.getRawValue().role;

    if (!user || !roleId) {
      return;
    }

    this.userService.changeRole(user.id, roleId).subscribe({
      next: () => {
        this.closeChangeRoleModal();
        this.getUsers();
        this.toast.success('Role user berhasil diubah');
      },
      error: (error) => {
        this.toast.error(error.error?.message ?? 'Gagal mengubah role user');
      }
    });
  }

  deleteUser(): void {
    const user = this.selectedUser();

    if (!user) {
      return;
    }

    this.userService.delete(user.id).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.getUsers();
        this.toast.success('User berhasil dihapus');
      },
      error: (error) => {
        this.toast.error(error.error?.message ?? 'Gagal menghapus user');
      }
    });
  }

  openCreateUserModal(): void {
    this.userForm.reset();
    this.selectedUser.set(null);
    this.userModalMode.set('create');
    this.showUserModal.set(true);
  }

  openUpdateUserModal(id: string): void {
    const user = this.users().find(user => user.id === id);

    if (!user) {
      return;
    }

    this.selectedUser.set(user);
    this.userModalMode.set('update');

    this.userForm.patchValue({
      identityNumber: user.identityNumber,
      name: user.name,
      role: user.role
    });

    this.showUserModal.set(true);
  }

  openChangeRoleModal(id: string): void {
    const user = this.users().find(user => user.id === id);

    if (!user) {
      return;
    }

    this.selectedUser.set(user);
    this.roleForm.patchValue({
      role: user.role
    });
    this.showChangeRoleModal.set(true);
  }

  closeChangeRoleModal(): void {
    this.showChangeRoleModal.set(false);
    this.roleForm.reset();
    this.selectedUser.set(null);
  }

  closeUserModal(): void {
    this.showUserModal.set(false);
  }

  openDetailUserModal(id: string): void {
    const user = this.users().find(user => user.id === id);

    if (!user) {
      return;
    }

    this.selectedUser.set(user);
    this.showDetailUserModal.set(true);
  }

  closeDetailUserModal(): void {
    this.showDetailUserModal.set(false);
    this.selectedUser.set(null);
  }

  openDeleteModal(id: string): void {
    const user = this.users().find(user => user.id === id);

    if (!user) {
      return;
    }

    this.selectedUser.set(user);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.selectedUser.set(null);
  }

  handleAction(event: any): void {
    switch (event.type) {
      case 'read':
        this.openDetailUserModal(event.id);
        break;

      case 'update':
        this.openUpdateUserModal(event.id);
        break;

      case 'change-role':
        this.openChangeRoleModal(event.id);
        break;

      case 'delete':
        this.openDeleteModal(event.id);
        break;

      case 'set-active':
        this.updateActive(event.id);
        break;
    }
  }
}
