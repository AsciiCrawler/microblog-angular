import { Component, EventEmitter, input, InputSignal, Output, output } from '@angular/core';

@Component({
  selector: 'app-auth-button',
  imports: [],
  templateUrl: './auth-button.component.html',
  styleUrl: './auth-button.component.scss'
})
export class AuthButtonComponent {
  text: InputSignal<string> = input("");
  disabled: InputSignal<boolean> = input(false);
  @Output() clickEvent = new EventEmitter<void>();
}
