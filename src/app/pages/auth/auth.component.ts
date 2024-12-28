import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import { Router } from '@angular/router';
import { FieldComponent } from '../../components/field/field.component';
import { AuthButtonComponent } from '../../components/auth-button/auth-button.component';
import { firstValueFrom } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { ToastService } from '../../services/toast.service';

export enum AuthState {
  login,
  register
};

@Component({
  selector: 'app-auth',
  imports: [FormsModule, FieldComponent, AuthButtonComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  authState: AuthState = AuthState.login;
  username: string = "";
  password: string = "";

  file: File | null = null;
  filePreview: string = "";

  confirmPassword: string = "";
  country: string = "";
  website: string = "";

  public GetAuthState = (): typeof AuthState => AuthState;

  constructor(private backend: BackendService, private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object, private toastService: ToastService) { }

  goHome() {
    if (isPlatformBrowser(this.platformId)) {
      this.backend.check().finally(() => {
        this.router.navigate(["/home"]);
      });
    }
  }

  async login() {
    try {
      const response = await firstValueFrom(this.backend.login(this.username, this.password));
      if (response) {
        this.goHome();
      }
    } catch (err: any) {
      const errorMessage = err?.error?.error || "Unexpected error during login";
      this.toastService.create(errorMessage, true);
    }
  }

  async register() {
    // Validate password confirmation
    if (this.password !== this.confirmPassword) {
      this.toastService.create("Password confirmation failed", true);
      return;
    }

    try {
      // Register user
      const registerResponse = await firstValueFrom(this.backend.register(this.username, this.password));
      if (!registerResponse) {
        throw new Error("Registration failed");
      }

      // Handle file upload
      const photo_key = await this.backend.handleUpload(this.file);

      // Edit user profile
      const editResponse = await firstValueFrom(
        this.backend.edit(photo_key || "")
      );
      if (!editResponse) {
        throw new Error("Profile update failed");
      }

      // Redirect to home on success
      this.goHome();
    } catch (err: any) {
      const errorMessage = err?.error?.error || "Unexpected error during registration";
      this.toastService.create(errorMessage, true);
    }
  }

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
}
