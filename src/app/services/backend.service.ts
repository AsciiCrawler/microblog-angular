import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { checkResponse, createPostResponse, getAllCommentsResponse, getAllPostResponse, profileResponse, registerResponse } from './backend.types';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  constructor(private http: HttpClient) { }
  public isAuth: boolean = false;
  public currentUser: profileResponse | null = null;

  //////////
  // Post //
  /**
   * Fetches all posts.
   * @param LastEvaluatedKey - The key for pagination.
   * @returns Observable of getAllPostResponse.
   */
  getAllPosts(LastEvaluatedKey: null | any): Observable<getAllPostResponse> {
    let _params = { withCredentials: true } as {
      withCredentials: boolean, params: any
    };

    if (LastEvaluatedKey)
      _params = {
        ..._params, params: {
          LastEvaluatedKey: JSON.stringify(LastEvaluatedKey)
        }
      }
    return this.http.get<getAllPostResponse>(`${environment.backendUrl}/v1/post/get-all`, _params);
  }

  /**
   * Fetches all posts by a specific user or UUID.
   * @param LastEvaluatedKey - The key for pagination.
   * @param uuid - The user's UUID.
   * @returns Observable of getAllPostResponse.
   */
  getAllPostsByUserOrUUID(LastEvaluatedKey: null | any, uuid: string) {
    let _params = { withCredentials: true } as {
      withCredentials: boolean, params: any
    };

    if (LastEvaluatedKey)
      _params = {
        ..._params, params: {
          LastEvaluatedKey: JSON.stringify(LastEvaluatedKey)
        }
      }
    return this.http.get<getAllPostResponse>(`${environment.backendUrl}/v1/post/get-all/${uuid}`, _params);
  }

  /**
   * Creates a new post.
   * @param key - The post key (optional).
   * @param text - The post content.
   * @returns Observable of registerResponse.
   */
  createPost(key: string | null, text: string): Observable<createPostResponse> {
    let body: any = { text };
    if (key != null)
      body.key = key;

    return this.http.post<createPostResponse>(`${environment.backendUrl}/v1/post/create`, body, { withCredentials: true });
  }

  deletePost(key: string): Observable<registerResponse> {
    return this.http.delete<any>(`${environment.backendUrl}/v1/post/delete/${key.split("POST#")[1]}`, { withCredentials: true });
  }
  // Post //
  //////////

  //////////////
  // Comments //
  /**
   * Fetches all comments for a specific post.
   * @param LastEvaluatedKey - The key for pagination.
   * @param postUUID - The post's UUID.
   * @returns Observable of getAllCommentsResponse.
   */
  getAllComments(LastEvaluatedKey: null | any, postUUID: string): Observable<getAllCommentsResponse> {
    let _params = { withCredentials: true } as {
      withCredentials: boolean, params: any
    };

    if (LastEvaluatedKey)
      _params = {
        ..._params, params: {
          LastEvaluatedKey: JSON.stringify(LastEvaluatedKey)
        }
      }
    return this.http.get<getAllCommentsResponse>(`${environment.backendUrl}/v1/comment/get-all/${postUUID}`, _params);
  }

  /**
   * Creates a new comment.
   * @param uuid - The post's UUID.
   * @param text - The comment content.
   * @returns Observable of any.
   */
  createComment(uuid: string, text: string): Observable<any> {
    return this.http.post<any>(`${environment.backendUrl}/v1/comment/create`, { uuid, text }, { withCredentials: true });
  }
  // Comments //
  //////////////

  //////////
  /* Auth */
  /**
   * Logs in a user.
   * @param username - The user's username.
   * @param password - The user's password.
   * @returns Observable of registerResponse.
   */
  login(username: string, password: string): Observable<registerResponse> {
    return this.http.post<registerResponse>(`${environment.backendUrl}/v1/auth/login`, {
      username, password
    }, { withCredentials: true });
  }

  /**
   * Registers a new user.
   * @param username - The user's username.
   * @param password - The user's password.
   * @returns Observable of registerResponse.
   */
  register(username: string, password: string): Observable<registerResponse> {
    return this.http.post<registerResponse>(`${environment.backendUrl}/v1/auth/register`, {
      username, password
    }, { withCredentials: true });
  }

  /**
   * Edits the user's profile.
   * @param photo_key - The photo key.
   * @returns Observable of registerResponse.
   */
  edit(photo_key: string): Observable<registerResponse> {
    return this.http.post<registerResponse>(`${environment.backendUrl}/v1/auth/edit`, {
      photo_key
    }, { withCredentials: true });
  }

  /**
   * Checks if the user is authenticated.
   * @returns Promise of checkResponse or null.
   */
  async check(): Promise<null | checkResponse> {
    return await firstValueFrom(this.http.get<checkResponse>(`${environment.backendUrl}/v1/auth/check`, { withCredentials: true })).then(async (data) => {
      this.isAuth = true;
      this.currentUser = await firstValueFrom(this.profile(data.username));
      return data;
    }).catch(() => {
      this.isAuth = false;
      return null;
    });
  }

  /**
   * Fetches the user's profile.
   * @param user - The user's username.
   * @returns Observable of profileResponse.
   */
  profile(user: string): Observable<profileResponse> {
    return this.http.get<profileResponse>(`${environment.backendUrl}/v1/auth/profile/${user}`, { withCredentials: true });
  }
  /* Auth */
  //////////

  /////////////////////
  /* File management */
  /**
   * Handles file upload.
   * @param file - The file to upload.
   * @returns Promise of the file key or null.
   */
  async handleUpload(file: File | null) {
    if (file == null) return null;

    try {
      const data = await firstValueFrom(this.http.post<any>(`${environment.backendUrl}/v1/get-signed-url`, {
        fileName: file.name
      }, { withCredentials: true }));

      const formData = new FormData();
      Object.keys(data.fields).forEach(key => {
        formData.append(key, data.fields[key]);
      });
      formData.append("file", file);
      const key = data.fields.key;

      await firstValueFrom(this.http.post<any>(data.url, formData));
      const processResult = await firstValueFrom(this.http.post<{ key: string }>(`${environment.backendUrl}/v1/process-image`, {
        key
      }, { withCredentials: true }));

      return processResult.key;
    } catch (error) {
      return null;
    }
  }
  /* File management */
  /////////////////////
}
