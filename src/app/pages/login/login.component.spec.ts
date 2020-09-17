import { HttpClientModule } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let httpMock: HttpTestingController;

  const routerMock = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      providers: [{ provide: Router, useValue: routerMock }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should prevent from sending request when empty credentials', () => {
    httpMock = TestBed.inject(HttpTestingController);

    component.loginForm.get('user').setValue('');
    component.loginForm.get('password').setValue('');

    const credentials = component.loginForm.getRawValue();

    expect(credentials).toEqual({ user: '', password: '' });

    component.login();

    httpMock.expectNone(`${environment.serverUrl}/login`);

    httpMock.verify();
  });

  it('should redirect to chat page on login', () => {
    authService = TestBed.inject(AuthService);

    component.loginForm.get('user').setValue('user');
    component.loginForm.get('password').setValue('password');

    spyOn(authService, 'login').and.returnValue(of(true));

    component.login();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/chat']);
  });
});
