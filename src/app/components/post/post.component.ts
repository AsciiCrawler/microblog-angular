import { Component, EventEmitter, input, InputSignal, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PostOrCommentHeaderComponent } from '../../components/post-or-comment-header/post-or-comment-header.component';
import { ParsePostTimestampPipe } from '../../pipes/parse-post-timestamp.pipe';
import { ParsePhotoKeyPipe } from '../../pipes/parse-photo-key.pipe';
import { ParseSkPipe } from '../../pipes/parse-sk.pipe';
import { LoaderComponent } from '../loader/loader.component';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { BackendService } from '../../services/backend.service';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-post',
  imports: [RouterLink, PostOrCommentHeaderComponent, ParsePostTimestampPipe, ParsePhotoKeyPipe, ParseSkPipe, ConfirmationModalComponent],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  text: InputSignal<string> = input("");
  photo_key: InputSignal<string> = input("");
  created_at: InputSignal<number> = input(0);
  username: InputSignal<string> = input("");
  user_photo_key: InputSignal<string> = input("");
  post_uuid: InputSignal<string> = input("");

  @Output() onDelete = new EventEmitter<string>(); // Emits when cancel button is clicked

  isModalVisible: boolean = false;
  isLoadingDelete: boolean = false;

  constructor(private backendService: BackendService, private toastService: ToastService) {
    console.log({ post_uuid: this.post_uuid() });
  }

  openDeleteModal() {
    this.isModalVisible = true;
    this.isLoadingDelete = false;
  }

  confirmDelete() {
    console.log({ post_uuid: this.post_uuid() });
    this.isLoadingDelete = true;
    firstValueFrom(this.backendService.deletePost(this.post_uuid())).then(() => {
      this.toastService.create("Post deleted successfully");
      this.onDelete.emit(this.post_uuid());
    }).catch(() => {
      this.toastService.create("Error on post delete", true);
    }).finally(() => {
      this.isLoadingDelete = false;
      this.isModalVisible = false;
    })
  }

  cancelDelete() {
    this.isLoadingDelete = false;
    this.isModalVisible = false;
  }

  isDeleteVisible() {
    return this.username().toLowerCase() == (this.backendService.currentUser?.user.username_original.toLowerCase() || "");
  }
}
