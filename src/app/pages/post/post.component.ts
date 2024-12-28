import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { firstValueFrom } from 'rxjs';
import { PostComponent as _PostComponent } from '../../components/post/post.component';
import { CommentsComponent } from '../../components/comments/comments.component';
import { CenterContainerComponent } from '../../components/center-container/center-container.component';
import { UploadboxComponent } from '../../components/uploadbox/uploadbox.component';
import { ParseSkPipe } from '../../pipes/parse-sk.pipe';
import { Location } from '@angular/common';
import { LoaderComponent } from '../../components/loader/loader.component';
import { postType } from '../../services/backend.types';

@Component({
  selector: 'app-post-page',
  imports: [_PostComponent, CommentsComponent, CenterContainerComponent, UploadboxComponent, ParseSkPipe, LoaderComponent],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  public post: postType | null = null;

  constructor(private route: ActivatedRoute, private backend: BackendService, private location: Location) {
    this.getPost();
  }

  async getPost() {
    const post = this.route.snapshot.paramMap.get("post");
    if (!post)
      return;

    const data = await firstValueFrom(this.backend.getAllPostsByUserOrUUID(null, post));
    if (data.Items.length > 0)
      this.post = data.Items[0];
  }

  goBack() {
    this.location.back();
  }
}
