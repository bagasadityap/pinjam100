import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';
import { HasRoleDirective } from '../../core/directive/has-role.directive';
import { UserResponse } from '../../features/user/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, HasRoleDirective],
  templateUrl: './sidebar.html',
})
export class Sidebar implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  currentUser = signal<UserResponse | null>(null);
  userMenuOpen = false;
  masterDataMenuOpen = false;
  logoutModalOpen = false;

  ngOnInit(): void {
    this.getCurrentUser()
  }

  getCurrentUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: (response) => {
        this.currentUser.set(response);
      },
      error: (error) => {
        console.error("Gagal mengambil data user", error);
      }
    });
  }

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

  getRoleLabel(): string {
    switch (this.currentUser()?.role) {
      case "SUPER_ADMIN":
        return "Super Administrator";
      case "MARKETING":
        return "Marketing";
      case "BRANCH_MARKETING":
        return "Branch Marketing";
      case "PAYMENT":
        return "Payment";
      case "DOCUMENT_CHECKER":
        return "Document Checker";
      case "CREDIT_ANALYST":
        return "Credit Analyst";
      default:
        return "User";
    }
  }
}
