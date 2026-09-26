import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-detail-modal',
  standalone: true,
  templateUrl: './detail-modal.html',
})
export class DetailModal {
  @Input() show = false;
  @Input() title = '';
  @Input() description = '';

  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }
}
