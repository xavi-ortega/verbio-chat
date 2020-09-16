import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  HttpClient,
  HttpHeaders,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { NoAuthHttpInterceptor } from './no-auth.interceptor';
import { ChatMessage, ChatService } from '../services/chat/chat.service';
import { first } from 'rxjs/operators';
import { HttpCommonService } from '../services/http-common.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

describe(`NoAuthHttpInterceptor`, () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  const routerMock = { navigate: jasmine.createSpy('navigate') };
  const testRoute = 'getWelcomeMessage';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: NoAuthHttpInterceptor,
          multi: true,
        },
        {
          provide: Router,
          useValue: routerMock,
        },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should catch an unauthenticated request and redirect to login page', () => {
    httpClient
      .get(`${environment.serverUrl}/${testRoute}`, {
        headers: {
          Authorization: 'bad token',
        },
      })
      .subscribe();

    const request = httpMock.expectOne(`${environment.serverUrl}/${testRoute}`);

    request.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
