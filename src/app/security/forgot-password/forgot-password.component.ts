import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPassword } from '@common/security/reset-password';
import { SecurityService } from '@services/security.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  isLoading: boolean = false;
  token: string | null = null;
  conformedToken: boolean | null = null;
  passwordChanged: boolean = false;
  ispasswordChanged: boolean = false;

  constructor(
    private fb: FormBuilder,
    private securityService: SecurityService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group(
      {
        password1: ['', [Validators.required, Validators.minLength(6)]],
        password2: ['', [Validators.required, Validators.minLength(6)]],
      },
      { validators: passwordMatchValidator() }
    );
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (this.token) {
      this.isLoading = true;
      this.securityService
        .conformResetPassword(this.token)
        .subscribe((data: boolean) => {
          console.log(data);
          this.conformedToken = data;
          this.isLoading = false;
        });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.ispasswordChanged = false;
      this.isLoading = true;
      const password: ResetPassword = {
        token: this.token!,
        newPassword: this.form.value.password1,
      };
      this.securityService
        .resetPassword(password)
        .subscribe((data: boolean) => {
          this.isLoading = false;
          this.passwordChanged = data;
        });
    }
  }

  gologin() {
    this.router.navigate(['login']);
  }
}

export function passwordMatchValidator(): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    const password1 = form.get('password1')?.value;
    const password2 = form.get('password2')?.value;

    return password1 === password2 ? null : { passwordsDoNotMatch: true };
  };
}
