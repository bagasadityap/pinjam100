import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  identityNumber = '';
  password = '';

  loading = signal(false);
  errorMessage = signal('');

  login(): void {
    this.errorMessage.set('');

    if (!this.identityNumber.trim() || !this.password) {
      this.errorMessage.set('NIP dan password wajib diisi.');
      this.cdr.detectChanges();
      return;
    }

    this.loading.set(true);

    this.auth.login({
      identityNumber: this.identityNumber.trim(),
      password: this.password
    })
    .pipe(
      finalize(() => {
        this.loading.set(false);
        this.cdr.detectChanges();
      })
    )
    .subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage.set(
          error.error?.message ?? 'Terjadi kesalahan. Silakan coba lagi.'
        );

        this.cdr.detectChanges();
      }
    });
  }
}
