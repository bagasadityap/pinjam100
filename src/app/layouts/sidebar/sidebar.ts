import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';
import { HasRoleDirective } from '../../core/directive/has-role.directive';
import { HasPermissionDirective } from '../../core/directive/has-permission.directive';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, HasRoleDirective],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  userMenuOpen = false;
  masterDataMenuOpen = false;
  logoutModalOpen = false;

  toggleMasterDataMenu(): void {
    this.masterDataMenuOpen = !this.masterDataMenuOpen;
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  openLogoutModal(): void {
    this.logoutModalOpen = true;
  }

  closeLogoutModal(): void {
    this.logoutModalOpen = false;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },

      error: (error) => {
        console.error('Gagal logout:', error);
      }
    });
  }

}
