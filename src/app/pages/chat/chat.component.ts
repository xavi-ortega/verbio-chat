import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, from, interval, Observable, zip } from 'rxjs';
import { delay, first, mergeMap, timeInterval } from 'rxjs/operators';
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

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.messageForm = new FormGroup({
      message: new FormControl('', Validators.required),
    });

    this.chatService
      .fetchWelcomeMessage()
      .pipe(
        first(),
        mergeMap((messages) => zip(interval(500), from(messages)))
      )
      .subscribe(([_, message]) => {
        const messages = [...this.messages$.getValue(), message];
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

      const messages = [...this.messages$.getValue(), message];
      this.messages$.next(messages);

      this.scrollBottom();

      this.chatService
        .sendMessage(message)
        .pipe(
          first(),
          mergeMap((botMessages) => zip(interval(500), from(botMessages)))
        )
        .subscribe(([_, botMessage]) => {
          const messages = [...this.messages$.getValue(), botMessage];

          this.messages$.next(messages);

          this.messageForm.reset();

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
    }, 100);
  }
}
