import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      user: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  login() {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {
      this.authService
        .login(this.loginForm.getRawValue())
        .subscribe((success) => {
          if (success) {
            this.router.navigate(['/chat']);
          } else {
            this.toastrService.error('You email or your password is incorrect');
          }
        });
    } else {
      this.toastrService.error(
        'There are some fields that require your atention'
      );
    }
  }

  controlHasError(field: string, type?: string): boolean {
    const control = this.loginForm.get(field);

    if (type) {
      return control.hasError(type) && (control.dirty || control.touched);
    } else {
      return control.invalid && (control.dirty || control.touched);
    }
  }
}
