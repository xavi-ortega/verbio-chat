import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class NoAuthHttpInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.error('interceptor: no session', error);
          this.authService.logout().pipe(first()).subscribe();
          this.router.navigate(['/login']);
        }

        return throwError(error);
      })
    );
  }
}
