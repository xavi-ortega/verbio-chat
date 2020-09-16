import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

import { GuestGuard } from './guest.guard';

describe('GuestGuard', () => {
  let guard: GuestGuard;
  let authService: AuthService;
  const routeMock: any = { snapshot: {} };
  const routeStateMock: any = { snapshot: {}, url: '/login' };
  const routerMock = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuestGuard, { provide: Router, useValue: routerMock }],
      imports: [HttpClientTestingModule],
    });
    authService = TestBed.inject(AuthService);
    guard = TestBed.inject(GuestGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect an authenticated user to the chat page', () => {
    spyOn(authService, 'check').and.returnValue(true);
    expect(guard.canActivate(routeMock, routeStateMock)).toEqual(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/chat']);
  });
});
