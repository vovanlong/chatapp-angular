import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASEURL = 'https://chatapp-longvv.herokuapp.com/api/chatapp';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  registerUser(body): Observable<any> {
    return this.http.post(`${BASEURL}/register`, body);
  }

  loginUser(body): Observable<any> {
    return this.http.post(`${BASEURL}/login`, body);
  }
}
