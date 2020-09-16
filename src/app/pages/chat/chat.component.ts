import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ChatMessage, ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  messageForm: FormGroup;

  messages$: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<
    ChatMessage[]
  >([]);

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.messageForm = new FormGroup({
      message: new FormControl('', Validators.required),
    });

    this.chatService.fetchWelcomeMessage().subscribe((messages) => {
      this.messages$.next(messages);
    });
  }

  sendMessage() {
    if (this.messageForm.valid) {
      const message: ChatMessage = {
        text: this.messageForm.get('message').value,
        type: 'text',
        own: true,
      };

      this.chatService
        .sendMessage(message)
        .pipe(first())
        .subscribe((botMessages) => {
          const messages = [
            ...this.messages$.getValue(),
            message,
            ...botMessages,
          ];

          this.messages$.next(messages);

          this.messageForm.reset();
        });
    } else {
      console.log('invalid form', this.messageForm.getRawValue());
    }
  }
}
