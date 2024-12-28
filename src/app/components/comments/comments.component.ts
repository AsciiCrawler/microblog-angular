import { Component, Inject, input, InputSignal, OnInit, PLATFORM_ID } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { firstValueFrom } from 'rxjs';
import { PostOrCommentHeaderComponent } from '../../components/post-or-comment-header/post-or-comment-header.component';
import { ParsePostTimestampPipe } from '../../pipes/parse-post-timestamp.pipe';
import { ParsePhotoKeyPipe } from '../../pipes/parse-photo-key.pipe';
import { isPlatformBrowser } from '@angular/common';
import { LoaderComponent } from "../loader/loader.component";
import { FetchMoreButtonComponent } from '../fetch-more-button/fetch-more-button.component';
import { commentType } from '../../services/backend.types';

@Component({
  selector: 'app-comments',
  imports: [PostOrCommentHeaderComponent, ParsePostTimestampPipe, ParsePhotoKeyPipe, LoaderComponent, FetchMoreButtonComponent],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnInit {
  post_uuid: InputSignal<string> = input("");
  public comments: commentType[] = [];
  public LastEvaluatedKey: null | any = null;
  public isLoading: boolean = true;

  constructor(private backend: BackendService, @Inject(PLATFORM_ID) private platformId: Object) { }

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId))
      this.fetchComments();
  }

  async fetchComments() {
    this.isLoading = true;
    const data = await firstValueFrom(this.backend.getAllComments(this.LastEvaluatedKey, this.post_uuid().split("#")[1])).finally(() => { this.isLoading = false; });
    this.LastEvaluatedKey = data.LastEvaluatedKey || null;
    this.comments.push(...data.Items);
  }
}
