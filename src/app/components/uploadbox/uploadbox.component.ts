import { Component, input, InputSignal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import { first, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-uploadbox',
  imports: [FormsModule, LoaderComponent],
  templateUrl: './uploadbox.component.html',
  styleUrl: './uploadbox.component.scss'
})
export class UploadboxComponent {
  body: string = "";
  file: File | null = null;
  filePreview: string = "";
  isComment: InputSignal<boolean> = input(false);

  isLoading: boolean = false;

  /* Comment only*/
  post_uuid: InputSignal<string> = input("");

  constructor(private backend: BackendService, private router: Router, private toastService: ToastService) { }

  handleFileInput(event: any) {
    this.file = event.target.files[0];
    if (this.file && this.file.type.startsWith('image/')) {
      const reader = new FileReader(); // Create a FileReader instance
      reader.onload = () => {
        this.filePreview = reader.result as string;
      };
      reader.readAsDataURL(this.file);  // Read the file as a data URL
    } else {
      this.toastService.create("Please select a valid image file.", true);
    }
  }

  async post() {
    this.isLoading = true;

    if (this.isComment()) {
      await firstValueFrom(this.backend.createComment(this.post_uuid(), this.body));
      window.location.reload(); // Todo : Create Comments and Post Service
    }
    else {
      let key: string | null = await this.backend.handleUpload(this.file);
      const data = await firstValueFrom(this.backend.createPost(key, this.body));
      this.router.navigate([`/post/${data.post_uuid}`]);
    }

    this.isLoading = false;
  }

  isAuth = () => this.backend.isAuth;
}
