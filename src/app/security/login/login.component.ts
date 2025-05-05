import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from '@common/security/login';
import { SecurityService } from '@services/security.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  form: FormGroup;
  error: boolean = false;

  constructor(
    private fb: FormBuilder,
    private securityService: SecurityService,
    private router: Router
  ) {
    this.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const login: Login = {
        username: this.form.value.email,
        password: this.form.value.password,
      };
      this.error = false;
      this.securityService.logIn(login).subscribe({
        next: (data) => {
          const rememberMe = (
            document.getElementById('rememberMe') as HTMLInputElement
          ).checked;

          if (rememberMe) {
            // حفظ في localStorage
            localStorage.setItem('authUser', JSON.stringify(data.userDTO));
            localStorage.setItem('authToken', data.token);
          } else {
            // حفظ في sessionStorage
            sessionStorage.setItem('authUser', JSON.stringify(data.userDTO));
            sessionStorage.setItem('authToken', data.token);
          }
          this.router.navigate(['home']);
        },
        error: (error) => {
          this.error = true;
        },
      });
    }
  }
  goSignUp() {
    this.router.navigate(['sign-up']);
  }

  resetPassword() {
    this.router.navigate(['send-reset-password-email']);
  }
}
