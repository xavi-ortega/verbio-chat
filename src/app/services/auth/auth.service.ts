import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpCommonService } from '../http-common.service';

const LOGIN_URL = 'login';

const AUTH_STORAGE_KEY = 'verbio-chat/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private httpCommonService: HttpCommonService
  ) {}

  private loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  check(): boolean {
    const isLoggedIn = this.loggedIn$.getValue();

    if (isLoggedIn) {
      return true;
    }

    const token = localStorage.getItem(AUTH_STORAGE_KEY);

    if (token) {
      this.setAuth(token);
      return true;
    }

    return false;
  }

  login(params): Observable<boolean> {
    return this.http
      .post<{ session_id: string }>(
        `${environment.serverUrl}/${{ LOGIN_URL }}`,
        params
      )
      .pipe(
        tap((response) => {
          // when successful set headers and store the session
          this.setAuth(response.session_id);
        }),
        mapTo(true),
        catchError((err) => {
          console.error('login', err);
          return of(false);
        })
      );
  }

  logout(): Observable<boolean> {
    return of(false);
  }

  private setAuth(token: string) {
    this.httpCommonService.setHeaders(
      new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      })
    );

    localStorage.setItem(AUTH_STORAGE_KEY, token);

    this.loggedIn$.next(true);
  }
}
