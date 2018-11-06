import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const BASEURL = 'https://chatapp-longvv.herokuapp.com/api/chatapp';
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private http: HttpClient) {}

  SendMessage(senderId, receiverId, receiverName, message): Observable<any> {
    return this.http.post(`${BASEURL}/chat-messages/${senderId}/${receiverId}`, {
      receiverId,
      receiverName,
      message
    });
  }

  GetAllMessages(senderId, receiverId): Observable<any> {
    return this.http.get(`${BASEURL}/chat-messages/${senderId}/${receiverId}`);
  }

  MaxMessages(sender, receiver): Observable<any> {
    return this.http.get(`${BASEURL}/receiver-messages/${sender}/${receiver}`);
  }

  MaxAllMessages(): Observable<any> {
    return this.http.get(`${BASEURL}/max-all-messages`);
  }
}
