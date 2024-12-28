import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BackendService } from './services/backend.service';
import { isPlatformBrowser } from '@angular/common';
import { ToastService } from './services/toast.service';
import { ToastComponent } from './components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'microblog-angular';
  constructor(private backend: BackendService,
    @Inject(PLATFORM_ID) private platformId: Object,
    public toastService: ToastService) { }

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      await this.backend.check();
    }
  }
}
