import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpCommonService } from '../http-common.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const GET_WELCOME_MESSAGE_URL = 'getWelcomeMessage';
const POST_MESSAGE_URL = 'sendMessage';

export interface ChatMessage {
  text?: string;
  type: string;
  url?: string;
  own?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private http: HttpClient,
    private httpCommon: HttpCommonService
  ) {}

  fetchWelcomeMessage(): Observable<ChatMessage[]> {
    return this.http
      .get<{ response: ChatMessage[] }>(
        `${environment.serverUrl}/${GET_WELCOME_MESSAGE_URL}`,
        { headers: this.httpCommon.getHeaders() }
      )
      .pipe(
        map(({ response }) => response),
        catchError((err) => {
          console.error('fetchWelcomeMesssage', err);
          return of([]);
        })
      );
  }

  sendMessage(message: ChatMessage): Observable<ChatMessage[]> {
    return this.http
      .post<{ response: ChatMessage[] }>(
        `${environment.serverUrl}/${POST_MESSAGE_URL}`,
        message,
        { headers: this.httpCommon.getHeaders() }
      )
      .pipe(
        map(({ response }) => response),
        catchError((err) => {
          console.error('sendMessage', err);
          return of([]);
        })
      );
  }
}
