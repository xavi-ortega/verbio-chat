import { HttpHeaders } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpCommonService } from '../http-common.service';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let httpCommon: HttpCommonService;
  const routerMock = { navigate: jasmine.createSpy('navigate') };
  const credentials = { user: 'user', password: 'password' };

  let store = {};

  const mockLocalStorage = {
    getItem: (key: string): string => {
      return key in store ? store[key] : null;
    },
    setItem: (key: string, value: string) => {
      store[key] = `${value}`;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: Router,
          useValue: routerMock,
        },
      ],
    });

    store = {};

    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);

    httpMock = TestBed.inject(HttpTestingController);

    service = TestBed.inject(AuthService);
    httpCommon = TestBed.inject(HttpCommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send login POST request', () => {
    service.login(credentials).subscribe();

    const req = httpMock.expectOne(`${environment.serverUrl}/login`);

    expect(req.request.method).toBe('POST');
  });

  it('should return true on successfull login', () => {
    service.login(credentials).subscribe((success) => {
      expect(success).toBe(true);
    });

    const req = httpMock.expectOne(`${environment.serverUrl}/login`);

    req.flush({ session_id: 'token' });
  });

  it('should return false on login error', () => {
    service.login(credentials).subscribe((success) => {
      expect(success).toBe(false);
    });

    const req = httpMock.expectOne(`${environment.serverUrl}/login`);

    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  it('should login', () => {
    service.login(credentials).subscribe();

    const req = httpMock.expectOne(`${environment.serverUrl}/login`);

    req.flush({ session_id: 'token' });

    const loggedIn = service.check();

    expect(loggedIn).toBe(true);
  });

  it('should set general http headers after login', () => {
    service.login(credentials).subscribe();

    const req = httpMock.expectOne(`${environment.serverUrl}/login`);

    req.flush({ session_id: 'token' });

    const token = 'Bearer token';

    const sessionToken = httpCommon.getHeaders().get('Authorization');

    expect(sessionToken).toBe(token);
  });

  it('should logout', () => {
    service.logout().subscribe();

    const loggedIn = service.check();

    expect(loggedIn).toBe(false);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
