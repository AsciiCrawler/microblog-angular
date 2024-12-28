import { Component, input, InputSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-or-comment-header',
  imports: [RouterLink],
  templateUrl: './post-or-comment-header.component.html',
  styleUrl: './post-or-comment-header.component.scss'
})
export class PostOrCommentHeaderComponent {
  photo_url: InputSignal<string> = input("");
  username: InputSignal<string> = input("");
  created_at: InputSignal<string> = input("");
}
