import { Component, EventEmitter, input, InputSignal, Output } from '@angular/core';

@Component({
  selector: 'app-fetch-more-button',
  imports: [],
  templateUrl: './fetch-more-button.component.html',
  styleUrl: './fetch-more-button.component.scss'
})
export class FetchMoreButtonComponent {
  message: InputSignal<string> = input("");
  @Output() click = new EventEmitter<void>();
  
  onClick(): void {
    this.click.emit();
  }
}
