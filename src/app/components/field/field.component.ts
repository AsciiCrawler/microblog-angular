import { Component, EventEmitter, input, InputSignal, Output } from '@angular/core';

@Component({
  selector: 'app-field',
  imports: [],
  templateUrl: './field.component.html',
  styleUrl: './field.component.scss'
})
export class FieldComponent {
  placeholder: InputSignal<string> = input("");
  isPassword: InputSignal<boolean> = input(false);

  field: InputSignal<string> = input("");
  @Output() fieldChange = new EventEmitter<string>();
  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.fieldChange.emit(inputElement.value);
  }
  
}
