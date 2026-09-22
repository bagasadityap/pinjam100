import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../../core/service/token.service';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  templateUrl: './forbidden.html',
})
export class Forbidden {
  private readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);

  back(): void {
    const token = this.tokenService.get();

    if (token) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.router.navigate(['/']);
  }
}
