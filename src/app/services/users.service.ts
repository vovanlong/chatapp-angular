import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASEURL = 'https://chatapp-longvv.herokuapp.com/api/chatapp';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) {}

  GetAllUsers(): Observable<any> {
    return this.http.get(`${BASEURL}/users`);
  }

  GetUserById(id): Observable<any> {
    return this.http.get(`${BASEURL}/users/${id}`);
  }

  GetUserByName(username): Observable<any> {
    return this.http.get(`${BASEURL}/username/${username}`);
  }

  FollowUser(userFollowed): Observable<any> {
    return this.http.post(`${BASEURL}/follow-user`, { userFollowed });
  }

  UnFollowUser(userFollowed): Observable<any> {
    return this.http.post(`${BASEURL}/unfollow-user`, { userFollowed });
  }

  MaxNotification(id, deleteValue?): Observable<any> {
    return this.http.post(`${BASEURL}/max/${id}`, { id, deleteValue });
  }

  MaxAllAsRead(): Observable<any> {
    return this.http.post(`${BASEURL}/max-all`, {
      all: true
    });
  }

  AddImage(image): Observable<any> {
    return this.http.post(`${BASEURL}/upload-image`, {
      image
    });
  }

  SetDefaultImage(imageId, imageVersion): Observable<any> {
    return this.http.get(`${BASEURL}/set-default-image/${imageId}/${imageVersion}`);
  }

  ProfileNotifications(id): Observable<any> {
    return this.http.post(`${BASEURL}/user/view-profile`, { id });
  }

  ChangePassword(body): Observable<any> {
    return this.http.post(`${BASEURL}/change-password`, body);
  }
}
