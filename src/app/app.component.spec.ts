import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, async } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  const routerMock = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],

      providers: [{ provide: Router, useValue: routerMock }],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should redirect to login page on logout', () => {
    const appComponent: AppComponent = TestBed.createComponent(AppComponent)
      .componentInstance;

    appComponent.logout();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
