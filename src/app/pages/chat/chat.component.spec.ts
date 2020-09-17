import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  async,
  ComponentFixture,
  fakeAsync,
  flushMicrotasks,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatMessage } from 'src/app/services/chat/chat.service';
import { environment } from 'src/environments/environment';

import { ChatComponent } from './chat.component';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChatComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render message list', () => {
    const html: HTMLBaseElement = fixture.nativeElement;

    const message: ChatMessage = {
      text: 'Welcome',
      type: 'text',
    };

    component.messages$.next([message]);

    fixture.detectChanges();

    const chatItem = html.querySelector('li');

    expect(chatItem.innerText).toContain(message.text);
  });

  it('should render image message', () => {
    const html: HTMLBaseElement = fixture.nativeElement;

    const message: ChatMessage = {
      url: 'url',
      type: 'image',
    };

    component.messages$.next([message]);

    fixture.detectChanges();

    const chatItem = html.querySelector('li');

    expect(chatItem.innerHTML).toContain('img');
  });

  it('should send a message', () => {
    component.messageForm.get('message').setValue('new message');

    const value = component.messageForm.getRawValue();

    expect(value).toEqual({ message: 'new message' });

    component.sendMessage();

    httpMock.expectOne(`${environment.serverUrl}/sendMessage`).flush({
      response: [
        {
          type: 'text',
          text: 'new message',
        },
      ],
    });
  });

  it('should prevent from sending a message if empty', () => {
    component.messageForm.get('message').setValue('');

    const value = component.messageForm.getRawValue();

    expect(value).toEqual({ message: '' });

    component.sendMessage();

    httpMock.expectNone(`${environment.serverUrl}/sendMessage`);
  });

  afterEach(() => {
    httpMock
      .expectOne(`${environment.serverUrl}/getWelcomeMessage`)
      .flush({ response: [] });

    httpMock.verify();
  });
});
