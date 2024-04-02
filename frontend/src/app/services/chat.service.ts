import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chats, UserMessages } from '../models/chat.model';
import { API_URL } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  getAllChats(username: string): Observable<Chats[]> {
    return this.http.get<Chats[]>(API_URL+"/chats/"+username);
  }

  getAllMessages(chatid: string): Observable<UserMessages> {
    return this.http.get<UserMessages>(API_URL+"/messages/"+chatid);
  }

  startNewChat(username: string): Observable<Chats> {
    return this.http.post<Chats>(API_URL+"/start_chat", { user: username });
  }
}
