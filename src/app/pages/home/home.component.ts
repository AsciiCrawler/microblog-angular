import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { UploadboxComponent } from '../../components/uploadbox/uploadbox.component';
import { CenterContainerComponent } from '../../components/center-container/center-container.component';
import { BackendService } from '../../services/backend.service';
import { firstValueFrom } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PostComponent } from '../../components/post/post.component';
import { LoaderComponent } from "../../components/loader/loader.component";
import { HeaderComponent } from '../../components/header/header.component';
import { FetchMoreButtonComponent } from '../../components/fetch-more-button/fetch-more-button.component';
import { postType } from '../../services/backend.types';

@Component({
  selector: 'app-home',
  imports: [UploadboxComponent, CenterContainerComponent, PostComponent, LoaderComponent, HeaderComponent, FetchMoreButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  public posts: postType[] = [];
  public LastEvaluatedKey: null | any = null;
  public isLoading: boolean = true;

  constructor(
    public backend: BackendService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  async fetchPost() {
    this.isLoading = true;
    const data = await firstValueFrom(this.backend.getAllPosts(this.LastEvaluatedKey)).finally(() => { this.isLoading = false; });
    this.LastEvaluatedKey = data.LastEvaluatedKey || null;
    this.posts.push(...data.Items);
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId))
      this.fetchPost();
  }

  onDelete(post_uuid: string) {
    const index = this.posts.findIndex(e => e.SK.toLocaleLowerCase().includes(post_uuid.toLowerCase()));
    if (index == -1)
      return;
    this.posts.splice(index, 1);
  }
}
