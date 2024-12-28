import { Component, input, InputSignal } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  message: InputSignal<string> = input("");
  isError: InputSignal<boolean> = input(false);
  uuid: InputSignal<string> = input("");

  constructor(private toastService: ToastService) { }
  remove = () => this.toastService.remove(this.uuid());
}
