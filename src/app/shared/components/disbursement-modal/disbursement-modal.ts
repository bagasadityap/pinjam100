import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-disbursement-modal',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './disbursement-modal.html',
})
export class DisbursementModal {
  @Input() show = false;
  @Input() customerName = '';
  @Input() bankName = '';
  @Input() accountNumber = '';
  @Input() disbursementAmount = 0;
  @Input() adminFee = 0;
  @Input() otherFee = 0;
  @Input() netAmount = 0;

  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }

  submit(): void {
    this.submitted.emit();
  }
}
