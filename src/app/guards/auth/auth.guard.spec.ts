import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  const routeMock: any = { snapshot: {} };
  const routeStateMock: any = { snapshot: {}, url: '/chat' };
  const routerMock = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard, { provide: Router, useValue: routerMock }],
      imports: [HttpClientTestingModule],
    });
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect an unauthenticated user to the login page', () => {
    expect(guard.canActivate(routeMock, routeStateMock)).toEqual(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should allow the authenticated user to access app', () => {
    spyOn(authService, 'check').and.returnValue(true);
    expect(guard.canActivate(routeMock, routeStateMock)).toEqual(true);
  });
});
