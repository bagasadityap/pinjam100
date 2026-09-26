import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.html',
})
export class Modal {
  @Input() show = false;
  @Input() title = '';
  @Input() description = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'lg';

  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }

  save(): void {
    this.saved.emit();
  }
}
