import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  imports: [],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss'
})
export class ConfirmationModalComponent {
  @Input() message: string = 'Are you sure?'; // Default message
  @Input() confirmButtonText: string = 'Confirm'; // Default confirm button text
  @Input() cancelButtonText: string = 'Cancel'; // Default cancel button text
  @Input() isVisible: boolean = false;
  @Input() isLoading: boolean = false;

  @Output() confirm = new EventEmitter<void>(); // Emits when confirm button is clicked
  @Output() cancel = new EventEmitter<void>(); // Emits when cancel button is clicked

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
