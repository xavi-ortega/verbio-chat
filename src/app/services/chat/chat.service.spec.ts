import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';

import { ChatMessage, ChatService } from './chat.service';

describe('ChatService', () => {
  let chatService: ChatService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    httpMock = TestBed.inject(HttpTestingController);
    chatService = TestBed.inject(ChatService);
  });

  it('should be created', () => {
    expect(chatService).toBeTruthy();
  });

  it('should get welcome messages', () => {
    const welcomeMessages: ChatMessage[] = [
      {
        text: "Hi, I'm a bot",
        type: 'text',
      },
      {
        text: 'I will echo back your messages',
        type: 'text',
      },
    ];

    chatService.fetchWelcomeMessage().subscribe((messages) => {
      expect(messages).toEqual(welcomeMessages);
    });

    const req = httpMock.expectOne(
      `${environment.serverUrl}/getWelcomeMessage`
    );

    req.flush({ response: welcomeMessages });
  });

  it('should send a message and receive the answer', () => {
    const message: ChatMessage = {
      text: 'Hello!',
      type: 'text',
    };

    chatService.sendMessage(message).subscribe((answer) => {
      expect(answer[0]).toEqual(message);
    });

    const req = httpMock.expectOne(`${environment.serverUrl}/sendMessage`);

    req.flush({ response: [message] });
  });
});
