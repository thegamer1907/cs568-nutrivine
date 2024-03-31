import { Component } from '@angular/core';
import { Chats } from '../../models/chat.model';
import { ChatService } from '../../services/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrl: './chatlist.component.css'
})
export class ChatlistComponent {
  chats: Chats[] = [];
  username: string = ""; //This needs to be stored in localstorage when user logs in

  constructor(
    private chatService: ChatService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.username = sessionStorage.getItem('username')!;
    this.loadChats();
  }

  loadChats() {
    this.chatService.getAllChats(this.username).subscribe(chats => {
      this.chats = chats;
      console.log(this.chats);
    });
  }

  openChat(chat: Chats) {
    this.router.navigate(['/chat/'+chat._id], { state: { data: chat } });
  }

  newChat() {
    this.chatService.startNewChat(this.username).subscribe({
      next: (data) => {
        console.log(data);
        this.router.navigate(['/chat/'+data._id], { state: { data: data } });
      }
    });
  }
}
