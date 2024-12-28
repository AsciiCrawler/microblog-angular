import { Component, input, InputSignal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import { first, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-uploadbox',
  imports: [FormsModule],
  templateUrl: './uploadbox.component.html',
  styleUrl: './uploadbox.component.scss'
})
export class UploadboxComponent {
  body: string = "";
  file: File | null = null;
  isComment: InputSignal<boolean> = input(false);

  /* Comment only*/
  post_uuid: InputSignal<string> = input("");

  constructor(private backend: BackendService, private router: Router) { }

  handleFileInput(event: any) {
    this.file = event.target.files[0];
  }

  async post() {
    if (this.isComment()) {
      await firstValueFrom(this.backend.createComment(this.post_uuid(), this.body));
    }
    else {
      let key: string | null = await this.backend.handleUpload(this.file);
      const data = await firstValueFrom(this.backend.createPost(key, this.body));
      this.router.navigate([`/post/${data.post_uuid}`]);
    }
  }

  isAuth = () => this.backend.isAuth;
}
