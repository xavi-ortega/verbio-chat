import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, from, interval, Observable, zip } from 'rxjs';
import {
  delay,
  finalize,
  first,
  mergeMap,
  tap,
  timeInterval,
} from 'rxjs/operators';
import { ChatMessage, ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @ViewChild('chat', { static: false }) chat: ElementRef;

  messageForm: FormGroup;

  messages$: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<
    ChatMessage[]
  >([]);

  botIsTyping: boolean;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.messageForm = new FormGroup({
      message: new FormControl('', Validators.required),
    });

    this.botIsTyping = true;

    this.chatService
      .fetchWelcomeMessage()
      .pipe(
        first(),
        delay(500),
        mergeMap((messages) => zip(interval(500), from(messages))),
        finalize(() => (this.botIsTyping = false))
      )
      .subscribe(([_, message]) => {
        const messages = [...this.messages$.getValue(), message];
        this.messages$.next(messages);
      });
  }

  sendMessage() {
    if (this.messageForm.valid && !this.botIsTyping) {
      const message: ChatMessage = {
        text: this.messageForm.get('message').value,
        type: 'text',
        own: true,
      };

      const messages = [...this.messages$.getValue(), message];
      this.messages$.next(messages);

      this.messageForm.reset();

      this.scrollBottom();

      this.botIsTyping = true;

      this.chatService
        .sendMessage(message)
        .pipe(
          first(),
          mergeMap((botMessages) => zip(interval(500), from(botMessages))),
          finalize(() => (this.botIsTyping = false))
        )
        .subscribe(([_, botMessage]) => {
          const messages = [...this.messages$.getValue(), botMessage];

          this.messages$.next(messages);

          this.messageForm.enable();

          this.scrollBottom();
        });
    } else {
      console.log('invalid form', this.messageForm.getRawValue());
    }
  }

  private scrollBottom() {
    setTimeout(() => {
      this.chat.nativeElement.scrollTo({
        top: this.chat.nativeElement.scrollHeight,
        behavior: 'smooth',
      });
    }, 300);
  }
}
