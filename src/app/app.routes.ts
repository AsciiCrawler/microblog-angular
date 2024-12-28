import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PostComponent } from './pages/post/post.component';
import { AboutComponent } from './pages/about/about.component';

export const routes: Routes = [
    { path: '', redirectTo: "/home", pathMatch: "full" },
    { path: 'home', component: HomeComponent },
    { path: 'auth', component: AuthComponent },
    { path: 'profile/:user', component: ProfileComponent },
    { path: 'post/:post', component: PostComponent },
    { path: 'about', component: AboutComponent },
];
