import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import io from 'socket.io-client';
import { Messages } from '../../models/chat.model';
import { ChatService } from '../../services/chat.service';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../../../constants';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

  username: string = "";
  socket: any; // Socket instance
  message: string = "";
  chat_id: string = "";
  messages: Messages[] = [];
  data: any;
  to: string = '';
  from: string = '';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService
  ) { }

  async ngOnInit(): Promise<void> {
    this.data = this.router.getCurrentNavigation()?.extras.state?.['data'] ?? null;
    if (!this.data){
      // Alternatively, access the state directly from the history if the component is loaded directly via URL or on page refresh
      this.data = history.state['data'];
    }
    this.username = sessionStorage.getItem('username')!;
    this.setToAndFrom();
    this.chat_id = this.route.snapshot.params['chatid']
    var messages = await firstValueFrom(this.chatService.getAllMessages(this.chat_id));
    console.log(messages);
    this.messages = messages;
    this.setupSocketConnection();
  }

  setToAndFrom(): void {
    if(this.username == 'admin'){
      this.from = "admin"
      this.to = this.data.user
    }
    else{
      this.from = this.username
      this.to = "admin"
    }
  }

  setupSocketConnection() {
    // Replace 'http://localhost:3000' with your server URL
    this.socket = io(API_URL);

    this.socket.emit('register_user',{
      chat_id: this.chat_id,
      from: this.from,
      to: this.to
    });
    
    // Example: Listen for 'message' event from server
    // this.socket.on('user_online', (data: any) => {
    //   console.log('User is oline now:', data);
    // });

    // Example: Listen for 'message' event from server
    this.socket.on('new_message', (data: any) => {
      console.log('Message from server:', data);
      this.messages.push(data);
    });
  }

  // Example: Send message to server
  sendMessage() {
    
    const newMessage: Messages = { 
      to: this.to, 
      from: this.from,
      message: this.message,
      timestamp: Date.now(),
      type: "text",
      chat_id: this.chat_id
    }
    this.messages.push(newMessage);
    console.log(newMessage);
    this.socket.emit('send_message', newMessage);
    this.message = "";
  }

  handleImageUpload(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // Once the file is loaded, reader.result contains the base64 string
        const base64 = reader.result as string;
  
        // Construct the image message object
        const imageMessage: Messages = {
          to: this.to,
          from: this.from,
          message: base64, // Base64 string of the image
          timestamp: Date.now(),
          type: "image", // Specify the message type as 'image'
          chat_id: this.chat_id
        };
  
        // Add to messages array for immediate display
        this.messages.push(imageMessage);
  
        // Emit the image message to the server
        this.socket.emit('send_message', imageMessage);
      };
  
      // Read the file as a base64 string
      reader.readAsDataURL(file);
    }
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
