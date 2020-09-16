import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  hasAuth: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  checkAuth() {
    this.hasAuth = this.authService.check();
  }

  logout() {
    this.authService
      .logout()
      .pipe(first())
      .subscribe((success) => {
        if (success) {
          this.router.navigate(['/login']);
        }
      });
  }
}
