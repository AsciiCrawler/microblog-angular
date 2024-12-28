import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BackendService } from '../../services/backend.service';
import { isPlatformBrowser } from '@angular/common';
import { PostComponent } from '../../components/post/post.component';
import { CenterContainerComponent } from '../../components/center-container/center-container.component';
import { HeaderComponent } from '../../components/header/header.component';
import { UploadboxComponent } from '../../components/uploadbox/uploadbox.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { FetchMoreButtonComponent } from '../../components/fetch-more-button/fetch-more-button.component';
import { postType } from '../../services/backend.types';

@Component({
  selector: 'app-profile',
  imports: [PostComponent, CenterContainerComponent, HeaderComponent, UploadboxComponent, LoaderComponent, FetchMoreButtonComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  public posts: postType[] = [];
  public LastEvaluatedKey: null | any = null;
  public isLoading: boolean = true;
  public isMyProfile: boolean = false;

  constructor(private route: ActivatedRoute, private backend: BackendService, @Inject(PLATFORM_ID) private platformId: Object) {
    this.getUserProfile();
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId))
      this.fetchPost();
  }

  async getUserProfile() {
    const user = this.route.snapshot.paramMap.get("user");

    if (user?.toLocaleLowerCase() == this.backend.currentUser?.user.username_original.toLowerCase())
      this.isMyProfile = true;

    if (user)
      await firstValueFrom(this.backend.profile(user));
  }

  async fetchPost() {
    this.isLoading = true;
    const user = this.route.snapshot.paramMap.get("user");
    if (user) {
      const data = await firstValueFrom(this.backend.getAllPostsByUserOrUUID(this.LastEvaluatedKey, user)).finally(() => { this.isLoading = false; });
      this.LastEvaluatedKey = data.LastEvaluatedKey || null;
      this.posts.push(...data.Items);
    }
    this.isLoading = false;
  }

  onDelete(post_uuid: string) {
    const index = this.posts.findIndex(e => e.SK.toLocaleLowerCase().includes(post_uuid.toLowerCase()));
    if (index == -1)
      return;
    this.posts.splice(index, 1);
  }
}
