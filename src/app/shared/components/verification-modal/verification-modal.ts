import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-verification-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './verification-modal.html'
})
export class VerificationModal {
  @Input() show = false;
  @Input() title = '';
  @Input() description = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'lg';

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<string>();
  @Output() rejected = new EventEmitter<string>();

  notes = '';

  close(): void {
    this.closed.emit();
  }

  save(): void {
    this.saved.emit(this.notes);
  }

  reject(): void {
    this.rejected.emit(this.notes);
  }
}
