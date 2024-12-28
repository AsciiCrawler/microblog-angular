import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { ToastService } from '../../services/toast.service';
import { ParsePhotoKeyPipe } from '../../pipes/parse-photo-key.pipe';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [ParsePhotoKeyPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  currentRoute: string = "";

  isLoading: boolean = false;
  profileState: number = 0; // Visible - My profile - User profile
  currentPhotoKey = "";
  currentUsername = "";

  file: File | null = null;

  constructor(private router: Router, private backendService: BackendService, private toastService: ToastService) {
    this.init();
  }

  async init() {
    this.currentRoute = this.router.url;
    this.isLoading = true;

    if (this.currentRoute.includes("profile/")) {
      const username = this.currentRoute.split("profile/")[1];
      this.profileState = username == this.backendService.currentUser?.user.username_original ? 1 : 2;

      if (this.profileState == 1) {
        this.currentPhotoKey = this.backendService.currentUser?.user.photo_key || "";
        this.currentUsername = this.backendService.currentUser?.user.username_original || "";
      } else
        await firstValueFrom(this.backendService.profile(username)).then(data => {
          this.currentPhotoKey = data.user.photo_key || "";
          this.currentUsername = data.user.username_original || "";
        }).catch(err => {
          console.error({ err });
        })
    } else if (this.isAuth()) {
      this.currentPhotoKey = this.backendService.currentUser?.user.photo_key || "";
      this.currentUsername = this.backendService.currentUser?.user.username_original || "";
    }

    this.isLoading = false;
  }

  isAuth() {
    return this.backendService.isAuth;
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }

  goToProfile() {
    if (this.backendService.currentUser != null)
      this.router.navigate([`profile/${this.backendService.currentUser.user.username_original}`]);
    else
      this.toastService.create("No valid username | Unauthorized", true);
  }

  async handleFileInput(event: any) {
    this.file = event.target.files[0];
    const key = await this.backendService.handleUpload(this.file).then((data) => {
      return data;
    });

    if (key) {
      await firstValueFrom(this.backendService.edit(key || "")).then(() => {
        this.toastService.create("Image update OK");
      }).catch(err => {
        this.toastService.create(err.error?.error || "Unexpected error on Edit profile", true)
        return null;
      })
    }

    await this.backendService.check();
  }
}
