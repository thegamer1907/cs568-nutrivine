import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import io from 'socket.io-client';
import { Messages } from '../../models/chat.model';
import { ChatService } from '../../services/chat.service';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../../../constants';
import { Preference } from '../../models/preferences.model';
import imageCompression from 'browser-image-compression';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

  @ViewChild('messagesContainer') private messagesContainer: ElementRef | undefined;

  username: string = "";
  socket: any; // Socket instance
  message: string = "";
  chat_id: string = "";
  messages: Messages[] = [];
  userPreferences: Preference[] = [];
  data: any;
  to: string = '';
  from: string = '';
  isDisabled = true;
  showPreferences: boolean = false; // Controls the visibility of the preferences panel

  togglePreferences(): void {
    this.showPreferences = !this.showPreferences;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService
  ) { }

  async ngOnInit(): Promise<void> {
    const fileInput = document.getElementById('imageUpload');

    fileInput!.addEventListener('change', (e) => {
      console.log(e);
      this.handleImageUpload(e);
    });

    // fileInput!.addEventListener('drop', (e) => {
    //   console.log(e);
    //   this.handleImageUpload(e);
    // });

    // fileInput!.addEventListener('paste', (e) => {
    //   console.log(e);
    //   this.handleImageUpload(e);
    // });

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
    this.messages = messages.messages;
    this.userPreferences = messages.preferences;
    console.log(this.userPreferences);
    this.setupSocketConnection();
    setTimeout(() => this.scrollToBottom(), 10);
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
    this.socket.on('new_message', (data: any) => {
      console.log('Message from server:', data);
      this.messages.push(data);
      setTimeout(() => this.scrollToBottom(), 10);
    });
  }

  scrollToBottom(): void {
    console.log('Attempting to scroll to bottom', this.messagesContainer);
    try {
      this.messagesContainer!.nativeElement.scrollTop = this.messagesContainer!.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Could not scroll to bottom: ', err);
    }
  }
  

  // Example: Send message to server
  sendMessage() {
    if(this.message.length == 0) {
      return;
    }
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
    setTimeout(() => this.scrollToBottom(), 10);
  }

  options = {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  }

  async handleImageUpload(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      console.log(`originalFile size ${file.size/1024/1024} MB`);
      const compressedFile = await imageCompression(file, this.options);
      console.log(`compressedFile size ${compressedFile.size/1024/1024} MB`);
      const reader = new FileReader();
      reader.onload = () => {
        // Once the file is loaded, reader.result contains the base64 string
        const base64 = reader.result as string;
        // console.log(base64);
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
        setTimeout(() => this.scrollToBottom(), 10);
      };
  
      // Read the file as a base64 string
      reader.readAsDataURL(compressedFile);
    }
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
