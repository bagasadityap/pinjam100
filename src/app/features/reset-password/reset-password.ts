import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';
import { ResetPasswordService } from './reset-password.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  private readonly route = inject(ActivatedRoute);
  private readonly resetPasswordService = inject(ResetPasswordService);
  private readonly toast = inject(HotToastService);

  password = '';
  confirmPassword = '';

  showPassword = false;
  showConfirmPassword = false;

  isSubmitting = false;
  showSuccessDialog = signal(false);

  token = this.route.snapshot.queryParamMap.get('token') ?? '';

  resetPassword(): void {
    if (this.isSubmitting) {
      return;
    }

    if (!this.token) {
      this.toast.error('Token reset password tidak ditemukan');
      return;
    }

    if (!this.password || !this.confirmPassword) {
      this.toast.error('Password dan konfirmasi password wajib diisi');
      return;
    }

    if (this.password.length < 8) {
      this.toast.error('Password minimal 8 karakter');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toast.error('Konfirmasi password tidak sesuai');
      return;
    }

    this.isSubmitting = true;

    this.resetPasswordService.resetPassword({
      password: this.password,
      token: this.token,
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.password = '';
        this.confirmPassword = '';
        this.showSuccessDialog.set(true);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.toast.error(
          error.error?.message ?? 'Gagal mengubah password'
        );
      }
    });
  }

  closeSuccessDialog(): void {
    this.showSuccessDialog.set(false);
  }
}
